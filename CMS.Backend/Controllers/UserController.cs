using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    // CRUD Tài khoản quản trị nội bộ (User) - Buổi 4 (#12) + băm mật khẩu BCrypt Buổi 5 (#33).
    [Authorize(Roles = "Admin")] // Buổi 5 (#17): chỉ Admin được quản lý tài khoản
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.Users.OrderBy(u => u.Username).ToList();
            return View(data);
        }

        [HttpGet]
        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(User model)
        {
            if (!ModelState.IsValid) return View(model);
            // Băm mật khẩu BCrypt trước khi lưu (không lưu thô) - tiêu chí #33
            model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);
            _context.Users.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.Users.Find(id);
            if (item == null) return NotFound();
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(User model, string? NewPassword)
        {
            // PasswordHash không nằm trên form Edit -> bỏ qua kiểm tra Required cho nó
            ModelState.Remove("PasswordHash");
            if (!ModelState.IsValid) return View(model);

            var user = _context.Users.Find(model.Id);
            if (user == null) return NotFound();

            user.Username = model.Username;
            user.FullName = model.FullName;
            user.Role = model.Role;

            // Chỉ băm & đổi mật khẩu khi người dùng nhập mật khẩu mới
            if (!string.IsNullOrWhiteSpace(NewPassword))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(NewPassword);
            }

            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var item = _context.Users.Find(id);
            if (item != null)
            {
                _context.Users.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
