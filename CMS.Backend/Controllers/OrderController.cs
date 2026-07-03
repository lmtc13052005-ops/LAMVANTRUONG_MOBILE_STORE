using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    // Quản lý Đơn hàng (Order -> OrderDetail) - Buổi 4 (tiêu chí #13).
    // Đơn hàng được tạo từ Frontend (Buổi 11), Admin xem chi tiết & cập nhật trạng thái.
    [Authorize] // Buổi 5 (#16)
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.Orders
                        .Include(o => o.Customer)
                        .OrderByDescending(o => o.OrderDate)
                        .ToList();
            return View(data);
        }

        // Chi tiết đơn hàng: Include Customer + OrderDetails -> Product
        public IActionResult Details(int id)
        {
            var order = _context.Orders
                        .Include(o => o.Customer)
                        .Include(o => o.OrderDetails)
                            .ThenInclude(d => d.Product)
                        .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();
            return View(order);
        }

        // Cập nhật trạng thái đơn hàng (0: Chờ duyệt, 1: Đang giao, 2: Đã xong)
        [HttpPost]
        public IActionResult UpdateStatus(int id, int status)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                order.Status = status;
                _context.SaveChanges();
            }
            return RedirectToAction("Details", new { id });
        }
    }
}
