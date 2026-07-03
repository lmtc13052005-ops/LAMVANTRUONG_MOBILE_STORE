using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CMS.Data; // ApplicationDbContext
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize] // Buổi 5 (#16): chặn người chưa đăng nhập
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối Database vào Controller (Constructor Injection)
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách danh mục (LINQ: sắp xếp theo tên)
        public IActionResult Index()
        {
            var data = _context.Categories
                        .OrderBy(c => c.Name)
                        .ToList();
            return View(data);
        }

        // ===== CREATE =====
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Category model)
        {
            // Bước 1: thêm vào bộ nhớ tạm | Bước 2: ghi xuống SQL Server
            _context.Categories.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== EDIT =====
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        [HttpPost]
        public IActionResult Edit(Category model)
        {
            _context.Categories.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== DELETE =====
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
