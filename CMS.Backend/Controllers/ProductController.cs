using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    // CRUD Sản phẩm + Phân trang (Buổi 4 - tiêu chí #13, #14)
    [Authorize] // Buổi 5 (#16)
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const int PageSize = 5; // Số sản phẩm mỗi trang

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách sản phẩm có PHÂN TRANG (Skip/Take)
        public IActionResult Index(int page = 1)
        {
            if (page < 1) page = 1;

            var query = _context.Products
                        .Include(p => p.CategoryProduct)
                        .OrderByDescending(p => p.CreatedDate);

            int totalItems = query.Count();
            int totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            var products = query
                        .Skip((page - 1) * PageSize)
                        .Take(PageSize)
                        .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            ViewBag.PageAction = "Index";
            return View(products);
        }

        [HttpGet]
        public IActionResult Create()
        {
            LoadCategories();
            return View();
        }

        [HttpPost]
        public IActionResult Create(Product model)
        {
            if (!ModelState.IsValid) { LoadCategories(model.CategoryProductId); return View(model); }
            _context.Products.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.Products.Find(id);
            if (item == null) return NotFound();
            LoadCategories(item.CategoryProductId);
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(Product model)
        {
            if (!ModelState.IsValid) { LoadCategories(model.CategoryProductId); return View(model); }
            _context.Products.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var item = _context.Products.Find(id);
            if (item != null)
            {
                _context.Products.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // Đổ dropdown danh mục ngành hàng cho form Create/Edit
        private void LoadCategories(int? selectedId = null)
        {
            ViewBag.CategoryProducts = new SelectList(
                _context.CategoriesProducts.OrderBy(c => c.DisplayOrder).ToList(),
                "Id", "Name", selectedId);
        }
    }
}
