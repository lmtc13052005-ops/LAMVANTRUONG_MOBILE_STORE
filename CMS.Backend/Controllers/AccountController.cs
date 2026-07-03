using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    // Đăng nhập / Đăng xuất vùng Admin - Buổi 5 (#19).
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Trang đăng nhập (độc lập, không dùng layout Admin có Sidebar)
        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string username, string password, string? returnUrl = null)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            // Kiểm tra mật khẩu băm BCrypt (không so sánh mật khẩu thô)
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                ViewBag.Error = "Sai tên đăng nhập hoặc mật khẩu!";
                ViewBag.ReturnUrl = returnUrl;
                return View();
            }

            // Tạo "thẻ định danh" (Claims) lưu vào Cookie
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("FullName", user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);

            return RedirectToAction("Dashboard", "Home");
        }

        // Bắt đầu luồng đăng nhập Google: chuyển browser sang trang xác thực của Google
        [HttpGet]
        public IActionResult LoginWithGoogle(string? returnUrl = null)
        {
            var redirectUrl = Url.Action("GoogleCallback", "Account", new { returnUrl });
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        // Google gọi về đây sau khi người dùng xác thực thành công
        [HttpGet]
        public async Task<IActionResult> GoogleCallback(string? returnUrl = null)
        {
            // Đọc thông tin Google trả về (external login info)
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (!result.Succeeded)
            {
                ViewBag.Error = "Đăng nhập Google thất bại. Vui lòng thử lại.";
                return View("Login");
            }

            // Lấy email từ claims Google trả về
            var email = result.Principal?.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                ViewBag.Error = "Không lấy được email từ tài khoản Google.";
                return View("Login");
            }

            // Tìm user trong DB theo email (chỉ admin đã có tài khoản mới được vào)
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                ViewBag.Error = $"Tài khoản Google ({email}) không được phép truy cập hệ thống.";
                return View("Login");
            }

            // Tạo Cookie admin y hệt luồng đăng nhập thường
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("FullName", user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);

            return RedirectToAction("Dashboard", "Home");
        }

        // Đăng xuất: xóa Cookie (giải phóng phiên đăng nhập) - #19
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        public IActionResult AccessDenied() => View();
    }
}
