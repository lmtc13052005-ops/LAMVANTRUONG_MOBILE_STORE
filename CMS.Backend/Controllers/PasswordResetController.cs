using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class PasswordResetController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PasswordResetController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            ViewData["Title"] = "Yêu cầu đặt lại mật khẩu";
            ViewData["ActiveMenu"] = "passwordreset";
            var list = _context.PasswordResetRequests
                .OrderByDescending(r => r.RequestDate)
                .ToList();
            return View(list);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Approve(int id)
        {
            var req = _context.PasswordResetRequests.Find(id);
            if (req == null || req.Status != 0)
                return NotFound();

            var customer = _context.Customers.FirstOrDefault(c => c.Email == req.Email);
            if (customer == null)
            {
                req.Status = 2;
                req.Note = "Tài khoản không còn tồn tại.";
                req.ProcessedDate = DateTime.Now;
                _context.SaveChanges();
                TempData["Error"] = "Không tìm thấy tài khoản với email này.";
                return RedirectToAction(nameof(Index));
            }

            customer.Password = req.NewPasswordHash;
            req.Status = 1;
            req.ProcessedDate = DateTime.Now;
            _context.SaveChanges();

            TempData["Success"] = $"Đã duyệt yêu cầu và cập nhật mật khẩu cho {req.Email}.";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Reject(int id, string? note)
        {
            var req = _context.PasswordResetRequests.Find(id);
            if (req == null || req.Status != 0)
                return NotFound();

            req.Status = 2;
            req.Note = string.IsNullOrWhiteSpace(note) ? "Từ chối bởi admin." : note.Trim();
            req.ProcessedDate = DateTime.Now;
            _context.SaveChanges();

            TempData["Success"] = $"Đã từ chối yêu cầu của {req.Email}.";
            return RedirectToAction(nameof(Index));
        }
    }
}
