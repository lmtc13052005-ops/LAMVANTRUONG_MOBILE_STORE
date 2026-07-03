using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    // Nhận ảnh upload từ CKEditor & form, lưu vào wwwroot/uploads (tiêu chí #35).
    [Authorize] // Buổi 5 (#16): chỉ người đăng nhập mới upload được
    public class UploadController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        // CKEditor 5 (Simple Upload Adapter) POST 'upload' -> trả JSON { url: "..." }
        [HttpPost]
        public async Task<IActionResult> CKEditorImage(IFormFile upload)
        {
            if (upload == null || upload.Length == 0)
                return Json(new { error = new { message = "Không có tệp nào được tải lên." } });

            var url = await SaveFileAsync(upload);
            return Json(new { url });
        }

        // Upload ảnh đại diện từ form Create/Edit -> trả JSON { url } để gán vào ô ImageUrl
        [HttpPost]
        public async Task<IActionResult> Image(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Json(new { success = false, message = "Chưa chọn tệp." });

            var url = await SaveFileAsync(file);
            return Json(new { success = true, url });
        }

        private async Task<string> SaveFileAsync(IFormFile file)
        {
            var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadDir = Path.Combine(webRoot, "uploads");
            Directory.CreateDirectory(uploadDir);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(uploadDir, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Đường dẫn public phục vụ qua UseStaticFiles
            return $"/uploads/{fileName}";
        }
    }
}
