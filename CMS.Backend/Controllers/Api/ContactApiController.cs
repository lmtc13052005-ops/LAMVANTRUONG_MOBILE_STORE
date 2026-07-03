using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers.Api
{
    [ApiController]
    [Route("api/contact")]
    [EnableCors("AllowReactApp")]
    public class ContactApiController : ControllerBase
    {
        private readonly ILogger<ContactApiController> _logger;

        public ContactApiController(ILogger<ContactApiController> logger)
        {
            _logger = logger;
        }

        // POST /api/contact
        [HttpPost]
        public IActionResult SendContact([FromBody] ContactRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Name) ||
                string.IsNullOrWhiteSpace(req.Phone) ||
                string.IsNullOrWhiteSpace(req.Email) ||
                string.IsNullOrWhiteSpace(req.Message))
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin." });

            _logger.LogInformation(
                "Liên hệ mới từ {Name} ({Email}, {Phone}): [{Subject}] {Message}",
                req.Name, req.Email, req.Phone, req.Subject ?? "Không có tiêu đề", req.Message);

            return Ok(new { message = "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ." });
        }
    }

    public record ContactRequest(string Name, string Phone, string Email, string? Subject, string Message);
}
