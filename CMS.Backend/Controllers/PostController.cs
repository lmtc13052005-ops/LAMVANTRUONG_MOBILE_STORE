using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using CMS.Data; // ApplicationDbContext
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize] // Buổi 5 (#16)
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const int PageSize = 5; // Số bài viết mỗi trang (PostGrid - tiêu chí #14)

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách bài viết: lọc theo danh mục (tùy chọn) + PHÂN TRANG (Skip/Take)
        // Ví dụ: /Post?categoryId=1&page=2
        public IActionResult Index(int? categoryId, int page = 1)
        {
            if (page < 1) page = 1;

            var query = _context.Posts
                        .Include(p => p.Category)       // Eager Loading (Join) lấy kèm tên danh mục
                        .AsQueryable();

            if (categoryId != null)
            {
                query = query.Where(p => p.CategoryId == categoryId); // Lọc theo danh mục
            }

            query = query.OrderByDescending(p => p.CreatedDate);       // Mới nhất lên đầu

            int totalItems = query.Count();
            int totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            var posts = query
                        .Skip((page - 1) * PageSize)
                        .Take(PageSize)
                        .ToList();

            ViewBag.Categories = _context.Categories.OrderBy(c => c.Name).ToList();
            ViewBag.SelectedCategoryId = categoryId;
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            ViewBag.PageAction = "Index";
            return View(posts);
        }

        // Chi tiết bài viết (Include lấy kèm Category, FirstOrDefault theo Id)
        public IActionResult Details(int id)
        {
            var post = _context.Posts
                        .Include(p => p.Category)
                        .FirstOrDefault(p => p.Id == id);

            if (post == null) return NotFound();

            return View(post);
        }

        // ===== CREATE ===== (nội dung soạn bằng CKEditor - tiêu chí #15)
        [HttpGet]
        public IActionResult Create()
        {
            LoadCategories();
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model)
        {
            if (!ModelState.IsValid) { LoadCategories(model.CategoryId); return View(model); }
            _context.Posts.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== EDIT =====
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();
            LoadCategories(post.CategoryId);
            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post model)
        {
            if (!ModelState.IsValid) { LoadCategories(model.CategoryId); return View(model); }
            _context.Posts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== DELETE =====
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // Đổ dropdown danh mục bài viết cho form Create/Edit
        private void LoadCategories(int? selectedId = null)
        {
            ViewBag.Categories = new SelectList(
                _context.Categories.OrderBy(c => c.Name).ToList(),
                "Id", "Name", selectedId);
        }
    }
}
