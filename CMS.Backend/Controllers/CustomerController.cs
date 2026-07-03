using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    // Quản lý Khách hàng (Customer) - Buổi 4 (tiêu chí #13).
    // Khách tự đăng ký ở Frontend (Buổi 10), Admin chỉ xem/sửa/xóa.
    [Authorize] // Buổi 5 (#16)
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.Customers.OrderBy(c => c.FullName).ToList();
            return View(data);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.Customers.Find(id);
            if (item == null) return NotFound();
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            if (!ModelState.IsValid) return View(model);
            _context.Customers.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var item = _context.Customers.Find(id);
            if (item != null)
            {
                _context.Customers.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
