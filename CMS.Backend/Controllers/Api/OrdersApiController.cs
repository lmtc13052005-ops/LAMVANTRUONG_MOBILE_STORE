using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Models.Api;

namespace CMS.Backend.Controllers.Api
{
    // Web API đặt hàng từ ReactJS - #21, #30 (POST + trừ kho), #31 (email xác nhận), #42 (chặn vượt kho).
    [ApiController]
    [Route("api/orders")]
    [EnableCors("AllowReactApp")]
    public class OrdersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public OrdersApiController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // POST /api/orders
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
        {
            if (request == null || request.Items == null || request.Items.Count == 0)
                return BadRequest(new { message = "Giỏ hàng trống." });

            // Gom thông tin giao hàng vào Notes để admin xem
            var shippingInfo = $"👤 {request.FullName}\n📞 {request.Phone}\n📍 {request.Address}";
            if (!string.IsNullOrWhiteSpace(request.Notes))
                shippingInfo += $"\n📝 {request.Notes}";

            var order = new Order
            {
                CustomerId = request.CustomerId,
                OrderDate = DateTime.Now,
                Status = 0, // Chờ duyệt
                Notes = shippingInfo,
                OrderDetails = new List<OrderDetail>()
            };

            decimal total = 0;
            var productNames = new List<string>();

            foreach (var item in request.Items)
            {
                var product = _context.Products.Find(item.ProductId);
                if (product == null)
                    return BadRequest(new { message = $"Sản phẩm #{item.ProductId} không tồn tại." });

                // Chặn mua vượt tồn kho (#42)
                if (item.Quantity > product.StockQuantity)
                    return BadRequest(new { message = $"Số lượng trong kho không đủ cho '{product.Name}'! Còn {product.StockQuantity} sản phẩm." });

                product.StockQuantity -= item.Quantity; // Trừ tồn kho (#30)
                total += product.Price * item.Quantity;
                productNames.Add($"• {product.Name} × {item.Quantity} = {product.Price * item.Quantity:#,##0}đ");

                order.OrderDetails.Add(new OrderDetail
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                });
            }

            order.TotalAmount = total;
            _context.Orders.Add(order);
            _context.SaveChanges();

            // Gửi email xác nhận (#31) — không throw nếu chưa cấu hình
            var toEmail = request.CustomerEmail;
            if (string.IsNullOrEmpty(toEmail) && request.CustomerId > 0)
            {
                var customer = _context.Customers.Find(request.CustomerId);
                toEmail = customer?.Email;
            }

            if (!string.IsNullOrEmpty(toEmail))
            {
                try { await SendOrderEmailAsync(toEmail, request.FullName, order.Id, productNames, total, request.Address, request.Phone); }
                catch { /* Không fail đặt hàng nếu email lỗi */ }
            }

            return Ok(new { orderId = order.Id, total = order.TotalAmount, message = "Đặt hàng thành công!" });
        }

        // GET /api/orders/track/{id} — tra cứu trạng thái đơn hàng (không cần xác thực)
        [HttpGet("track/{id}")]
        public IActionResult Track(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng." });

            var statusLabel = order.Status switch
            {
                0 => "Chờ xác nhận",
                1 => "Đang giao hàng",
                2 => "Đã hoàn thành",
                _ => "Đã hủy"
            };

            return Ok(new {
                id = order.Id,
                status = order.Status,
                statusLabel,
                orderDate = order.OrderDate,
                totalAmount = order.TotalAmount,
                notes = order.Notes,
                items = order.OrderDetails.Select(od => new {
                    productId = od.ProductId,
                    productName = od.Product != null ? od.Product.Name : $"Sản phẩm #{od.ProductId}",
                    imageUrl = od.Product != null ? od.Product.ImageUrl : null,
                    quantity = od.Quantity,
                    unitPrice = od.UnitPrice
                })
            });
        }

        private async Task SendOrderEmailAsync(string toEmail, string toName, int orderId,
            List<string> productLines, decimal total, string address, string phone)
        {
            var host = _config["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
            var port = int.Parse(_config["EmailSettings:SmtpPort"] ?? "587");
            var sender = _config["EmailSettings:SenderEmail"] ?? "";
            var password = _config["EmailSettings:SenderPassword"] ?? "";
            if (string.IsNullOrEmpty(sender) || string.IsNullOrEmpty(password)) return;

            var productsHtml = string.Join("", productLines.Select(l =>
                $"<li style='padding:6px 0;color:#e2e8f0;font-size:14px;'>{l}</li>"));

            var body = $@"
<div style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#111827;color:#fff;border-radius:12px;overflow:hidden;'>
  <div style='background:#f6ad55;padding:24px 32px;'>
    <div style='font-size:20px;font-weight:900;color:#111827;'>TruongMobile</div>
    <div style='font-size:14px;color:#1a202c;margin-top:4px;'>Xác nhận đơn hàng #{orderId}</div>
  </div>
  <div style='padding:28px 32px;'>
    <p style='color:#a0aec0;margin-bottom:20px;'>Xin chào <strong style='color:#fff;'>{toName}</strong>, đơn hàng của bạn đã được tiếp nhận!</p>
    <div style='background:#1a2332;border-radius:8px;padding:16px 20px;margin-bottom:20px;'>
      <div style='font-size:13px;font-weight:700;color:#f6ad55;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;'>Sản phẩm đặt mua</div>
      <ul style='margin:0;padding:0;list-style:none;'>{productsHtml}</ul>
      <div style='border-top:1px solid #2d3748;margin-top:12px;padding-top:12px;display:flex;justify-content:space-between;'>
        <span style='font-weight:700;color:#fff;'>Tổng cộng</span>
        <span style='font-weight:900;color:#f6ad55;font-size:18px;'>{total:#,##0}đ</span>
      </div>
    </div>
    <div style='background:#1a2332;border-radius:8px;padding:16px 20px;'>
      <div style='font-size:13px;font-weight:700;color:#f6ad55;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;'>Địa chỉ giao hàng</div>
      <div style='color:#e2e8f0;font-size:14px;line-height:1.7;'>{toName} · {phone}<br/>{address}</div>
    </div>
    <p style='color:#718096;font-size:13px;margin-top:20px;'>Chúng tôi sẽ liên hệ xác nhận và giao hàng sớm nhất có thể. Cảm ơn bạn đã tin dùng TruongMobile!</p>
  </div>
</div>";

            using var client = new SmtpClient(host, port) { EnableSsl = true, Credentials = new NetworkCredential(sender, password) };
            var msg = new MailMessage(sender, toEmail)
            {
                Subject = $"[TruongMobile] Xác nhận đơn hàng #{orderId} — {total:#,##0}đ",
                Body = body,
                IsBodyHtml = true
            };
            await client.SendMailAsync(msg);
        }
    }
}
