using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers.Api
{
    // API xác thực Khách hàng Frontend: đăng ký, đăng nhập, quên mật khẩu OTP (tiêu chí #33, #34, #46)
    [ApiController]
    [Route("api/customers")]
    [EnableCors("AllowReactApp")]
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _config;

        public CustomersApiController(ApplicationDbContext context, IMemoryCache cache, IConfiguration config)
        {
            _context = context;
            _cache = cache;
            _config = config;
        }

        // ===== GỬI OTP XÁC MINH EMAIL KHI ĐĂNG KÝ =====
        // POST /api/customers/register/send-otp
        [HttpPost("register/send-otp")]
        public async Task<IActionResult> RegisterSendOtp([FromBody] SendOtpRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email))
                return BadRequest(new { message = "Vui lòng nhập email." });

            var email = req.Email.Trim().ToLower();

            if (_context.Customers.Any(c => c.Email == email))
                return BadRequest(new { message = "Email này đã được đăng ký. Vui lòng dùng email khác." });

            var otp = new Random().Next(100000, 999999).ToString();
            _cache.Set($"reg_otp:{email}", otp, TimeSpan.FromMinutes(10));

            try
            {
                await SendOtpEmailAsync(email, otp, isRegister: true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Không gửi được email OTP: {ex.Message}" });
            }

            return Ok(new { message = "Mã OTP đã được gửi đến email của bạn. Có hiệu lực trong 10 phút." });
        }

        // ===== ĐĂNG KÝ — tiêu chí #34 =====
        // POST /api/customers/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.FullName) ||
                string.IsNullOrWhiteSpace(req.Email) ||
                string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { message = "Vui lòng điền đầy đủ họ tên, email và mật khẩu." });

            if (req.Password.Length < 6)
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự." });

            var email = req.Email.Trim().ToLower();

            if (_context.Customers.Any(c => c.Email == email))
                return BadRequest(new { message = "Email này đã được đăng ký." });

            var customer = new Customer
            {
                FullName = req.FullName.Trim(),
                Email    = email,
                Phone    = req.Phone?.Trim(),
                Password = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(new { message = "Đăng ký thành công!", customerId = customer.Id, fullName = customer.FullName, email = customer.Email });
        }

        // ===== ĐĂNG NHẬP =====
        // POST /api/customers/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { message = "Vui lòng nhập email và mật khẩu." });

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == req.Email.Trim().ToLower());

            if (customer == null || !BCrypt.Net.BCrypt.Verify(req.Password, customer.Password))
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

            return Ok(new {
                message = "Đăng nhập thành công!",
                customerId = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone
            });
        }

        // ===== ĐĂNG NHẬP BẰNG GOOGLE — tiêu chí đăng nhập mạng xã hội =====
        // POST /api/customers/google-login
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Code) || string.IsNullOrWhiteSpace(req.RedirectUri))
                return BadRequest(new { message = "Thiếu thông tin xác thực Google." });

            // 1. Đổi authorization code lấy access token từ Google
            using var http = new System.Net.Http.HttpClient();
            var tokenRes = await http.PostAsync("https://oauth2.googleapis.com/token",
                new System.Net.Http.FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["code"]          = req.Code,
                    ["client_id"]     = _config["Authentication:Google:ClientId"]!,
                    ["client_secret"] = _config["Authentication:Google:ClientSecret"]!,
                    ["redirect_uri"]  = req.RedirectUri,
                    ["grant_type"]    = "authorization_code"
                }));

            if (!tokenRes.IsSuccessStatusCode)
                return Unauthorized(new { message = "Không thể xác thực với Google. Vui lòng thử lại." });

            var tokenJson = System.Text.Json.JsonDocument.Parse(await tokenRes.Content.ReadAsStringAsync());
            var accessToken = tokenJson.RootElement.GetProperty("access_token").GetString();

            // 2. Lấy thông tin người dùng từ Google
            http.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            var infoRes = await http.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");

            if (!infoRes.IsSuccessStatusCode)
                return Unauthorized(new { message = "Không lấy được thông tin tài khoản Google." });

            var infoJson = System.Text.Json.JsonDocument.Parse(await infoRes.Content.ReadAsStringAsync());
            var email    = infoJson.RootElement.GetProperty("email").GetString()?.ToLower().Trim();
            var name     = infoJson.RootElement.TryGetProperty("name", out var nameProp) ? nameProp.GetString() : email;

            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Không lấy được email từ Google." });

            // 3. Tìm khách hàng theo email — nếu chưa có thì tự tạo (auto-register)
            var customer = _context.Customers.FirstOrDefault(c => c.Email == email);
            if (customer == null)
            {
                customer = new Customer
                {
                    FullName = name ?? email,
                    Email    = email,
                    Password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()) // mật khẩu random
                };
                _context.Customers.Add(customer);
                _context.SaveChanges();
            }

            return Ok(new {
                message    = "Đăng nhập Google thành công!",
                customerId = customer.Id,
                fullName   = customer.FullName,
                email      = customer.Email,
                phone      = customer.Phone
            });
        }

        // ===== QUÊN MẬT KHẨU — Gửi yêu cầu để admin duyệt (#46) =====
        // POST /api/customers/forgot-password/request
        [HttpPost("forgot-password/request")]
        public IActionResult ForgotPasswordRequest([FromBody] ForgotPasswordRequestDto req)
        {
            if (string.IsNullOrWhiteSpace(req.FullName) ||
                string.IsNullOrWhiteSpace(req.Email) ||
                string.IsNullOrWhiteSpace(req.Phone) ||
                string.IsNullOrWhiteSpace(req.NewPassword))
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin." });

            if (req.NewPassword.Length < 6)
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự." });

            var email = req.Email.Trim().ToLower();
            var customer = _context.Customers.FirstOrDefault(c => c.Email == email);
            if (customer == null)
                return BadRequest(new { message = "Không tìm thấy tài khoản với email này." });

            // Kiểm tra thông tin khớp (bảo mật cơ bản)
            if (!customer.FullName.Trim().Equals(req.FullName.Trim(), StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { message = "Họ tên không khớp với tài khoản." });

            // Kiểm tra xem đã có yêu cầu đang chờ chưa
            var existing = _context.PasswordResetRequests
                .FirstOrDefault(r => r.Email == email && r.Status == 0);
            if (existing != null)
                return BadRequest(new { message = "Bạn đã có yêu cầu đặt lại mật khẩu đang chờ admin duyệt." });

            var resetRequest = new CMS.Data.Entities.PasswordResetRequest
            {
                FullName       = req.FullName.Trim(),
                Email          = email,
                Phone          = req.Phone.Trim(),
                NewPasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword),
                Status         = 0,
                RequestDate    = DateTime.Now
            };

            _context.PasswordResetRequests.Add(resetRequest);
            _context.SaveChanges();

            return Ok(new { message = "Yêu cầu đã được gửi! Admin sẽ xem xét và xử lý trong vòng 24 giờ." });
        }

        // ===== QUÊN MẬT KHẨU — Bước 1: Gửi OTP (giữ lại tương thích) =====
        // POST /api/customers/forgot-password/send-otp
        [HttpPost("forgot-password/send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email))
                return BadRequest(new { message = "Vui lòng nhập email." });

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == req.Email.Trim().ToLower());

            // Không tiết lộ email có tồn tại hay không (bảo mật)
            if (customer == null)
                return Ok(new { message = "Nếu email tồn tại, mã OTP đã được gửi." });

            // Tạo OTP 6 số
            var otp = new Random().Next(100000, 999999).ToString();
            var cacheKey = $"otp:{req.Email.Trim().ToLower()}";

            // Lưu OTP vào cache 5 phút
            _cache.Set(cacheKey, otp, TimeSpan.FromMinutes(5));

            // Gửi email (cần cấu hình EmailSettings trong appsettings.json)
            try
            {
                await SendEmailAsync(customer.Email, customer.FullName, otp);
            }
            catch (Exception ex)
            {
                // Nếu chưa cấu hình email, trả lỗi rõ ràng
                return StatusCode(500, new { message = $"Không gửi được email: {ex.Message}. Vui lòng cấu hình EmailSettings." });
            }

            return Ok(new { message = "Mã OTP đã được gửi đến email của bạn. Có hiệu lực trong 5 phút." });
        }

        // ===== QUÊN MẬT KHẨU — Bước 2: Xác nhận OTP + đặt mật khẩu mới (#46) =====
        // POST /api/customers/forgot-password/reset
        [HttpPost("forgot-password/reset")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Otp) || string.IsNullOrWhiteSpace(req.NewPassword))
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            if (req.NewPassword.Length < 6)
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự." });

            var cacheKey = $"otp:{req.Email.Trim().ToLower()}";
            if (!_cache.TryGetValue(cacheKey, out string? savedOtp) || savedOtp != req.Otp.Trim())
                return BadRequest(new { message = "Mã OTP không đúng hoặc đã hết hạn." });

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == req.Email.Trim().ToLower());

            if (customer == null)
                return NotFound(new { message = "Tài khoản không tồn tại." });

            customer.Password = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            _context.SaveChanges();

            // Xóa OTP sau khi dùng
            _cache.Remove(cacheKey);

            return Ok(new { message = "Đặt lại mật khẩu thành công! Vui lòng đăng nhập." });
        }

        // ===== XEM THÔNG TIN PROFILE =====
        // GET /api/customers/{id}/profile
        [HttpGet("{id}/profile")]
        public IActionResult GetProfile(int id)
        {
            var c = _context.Customers.Find(id);
            if (c == null) return NotFound(new { message = "Không tìm thấy tài khoản." });
            return Ok(new { fullName = c.FullName, email = c.Email, phone = c.Phone, address = c.Address });
        }

        // ===== CẬP NHẬT THÔNG TIN PROFILE =====
        // PUT /api/customers/{id}/profile
        [HttpPut("{id}/profile")]
        public IActionResult UpdateProfile(int id, [FromBody] UpdateProfileRequest req)
        {
            var c = _context.Customers.Find(id);
            if (c == null) return NotFound(new { message = "Không tìm thấy tài khoản." });

            if (string.IsNullOrWhiteSpace(req.FullName))
                return BadRequest(new { message = "Họ tên không được để trống." });

            c.FullName = req.FullName.Trim();
            c.Phone    = req.Phone?.Trim();
            c.Address  = req.Address?.Trim();
            _context.SaveChanges();

            return Ok(new { message = "Cập nhật thông tin thành công!", fullName = c.FullName, phone = c.Phone, address = c.Address });
        }

        // ===== ĐỔI MẬT KHẨU =====
        // PUT /api/customers/{id}/change-password
        [HttpPut("{id}/change-password")]
        public IActionResult ChangePassword(int id, [FromBody] ChangePasswordRequest req)
        {
            var c = _context.Customers.Find(id);
            if (c == null) return NotFound(new { message = "Không tìm thấy tài khoản." });

            if (!BCrypt.Net.BCrypt.Verify(req.OldPassword, c.Password))
                return BadRequest(new { message = "Mật khẩu hiện tại không đúng." });

            if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 6)
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự." });

            c.Password = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            _context.SaveChanges();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        // ===== LỊCH SỬ ĐƠN HÀNG =====
        // GET /api/customers/{id}/orders
        [HttpGet("{id}/orders")]
        public IActionResult GetOrders(int id)
        {
            var orders = _context.Orders
                .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == id)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    id         = o.Id,
                    orderDate  = o.OrderDate,
                    status     = o.Status,
                    statusLabel = o.Status == 0 ? "Chờ xác nhận"
                                : o.Status == 1 ? "Đang giao hàng"
                                : o.Status == 2 ? "Đã hoàn thành"
                                : "Đã hủy",
                    totalAmount = o.TotalAmount,
                    items = o.OrderDetails.Select(od => new {
                        productId   = od.ProductId,
                        productName = od.Product != null ? od.Product.Name : $"Sản phẩm #{od.ProductId}",
                        imageUrl    = od.Product != null ? od.Product.ImageUrl : null,
                        quantity    = od.Quantity,
                        unitPrice   = od.UnitPrice
                    })
                })
                .ToList();

            return Ok(orders);
        }

        // ===== Helper: Gửi OTP email (dùng chung cho đăng ký + quên mật khẩu) =====
        private Task SendOtpEmailAsync(string toEmail, string otp, bool isRegister = false)
        {
            var subject = isRegister
                ? $"[TruongMobile] Mã xác minh đăng ký: {otp}"
                : $"[TruongMobile] Mã OTP đặt lại mật khẩu: {otp}";
            var heading = isRegister ? "Xác minh tài khoản của bạn" : "Đặt lại mật khẩu";
            var desc = isRegister
                ? "Bạn vừa đăng ký tài khoản TruongMobile. Nhập mã bên dưới để xác minh email:"
                : "Bạn đã yêu cầu đặt lại mật khẩu. Mã OTP của bạn là:";
            var expire = isRegister ? "10 phút" : "5 phút";

            var body = $@"
<div style='font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#111827;color:#fff;border-radius:12px;'>
  <div style='font-size:22px;font-weight:800;color:#f6ad55;margin-bottom:8px;'>TruongMobile</div>
  <h2 style='font-size:16px;color:#e2e8f0;margin-bottom:16px;'>{heading}</h2>
  <p style='color:#a0aec0;margin-bottom:16px;'>{desc}</p>
  <div style='font-size:40px;font-weight:900;letter-spacing:10px;color:#f6ad55;text-align:center;padding:20px 0;background:#1a2332;border-radius:8px;margin:16px 0;'>
    {otp}
  </div>
  <p style='color:#718096;font-size:13px;'>Mã có hiệu lực trong <strong>{expire}</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
  <p style='color:#4a5568;font-size:12px;margin-top:20px;'>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
</div>";

            return SendRawEmailAsync(toEmail, subject, body);
        }

        // ===== Helper: Gửi email thô qua Gmail SMTP (dùng MailKit) =====
        private async Task SendRawEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var host     = _config["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
            var port     = int.Parse(_config["EmailSettings:SmtpPort"] ?? "587");
            var sender   = _config["EmailSettings:SenderEmail"] ?? "";
            var password = _config["EmailSettings:SenderPassword"] ?? "";

            if (string.IsNullOrEmpty(sender) || string.IsNullOrEmpty(password))
                throw new InvalidOperationException("EmailSettings chưa được cấu hình trong appsettings.json.");

            var message = new MimeKit.MimeMessage();
            message.From.Add(MimeKit.MailboxAddress.Parse(sender));
            message.To.Add(MimeKit.MailboxAddress.Parse(toEmail));
            message.Subject = subject;
            message.Body = new MimeKit.TextPart(MimeKit.Text.TextFormat.Html) { Text = htmlBody };

            using var client = new MailKit.Net.Smtp.SmtpClient();
            await client.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.Auto);
            await client.AuthenticateAsync(sender, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        private Task SendEmailAsync(string toEmail, string toName, string otp)
            => SendOtpEmailAsync(toEmail, otp, isRegister: false);
    }

    // ===== Request DTOs =====
    public record RegisterRequest(string FullName, string Email, string? Phone, string Password, string? Otp);
    public record ForgotPasswordRequestDto(string FullName, string Email, string Phone, string NewPassword);
    public record LoginRequest(string Email, string Password);
    public record GoogleLoginRequest(string Code, string RedirectUri);
    public record SendOtpRequest(string Email);
    public record ResetPasswordRequest(string Email, string Otp, string NewPassword);
    public record UpdateProfileRequest(string FullName, string? Phone, string? Address);
    public record ChangePasswordRequest(string OldPassword, string NewPassword);
}
