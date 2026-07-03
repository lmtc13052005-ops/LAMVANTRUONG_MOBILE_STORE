using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers.Api
{
    // Web API Bài viết CMS phục vụ ReactJS Frontend - Buổi 6 (#20).
    [ApiController]
    [Route("api/posts")]
    [EnableCors("AllowReactApp")]
    public class PostsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/posts?categoryId=1&page=1&pageSize=6
        [HttpGet]
        public IActionResult GetAll(int? categoryId, int page = 1, int pageSize = 6)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 24) pageSize = 6;

            var query = _context.Posts.Include(p => p.Category).AsQueryable();

            if (categoryId != null)
                query = query.Where(p => p.CategoryId == categoryId);

            query = query.OrderByDescending(p => p.CreatedDate);

            int total = query.Count();
            var items = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new {
                    p.Id, p.Title, p.ImageUrl, p.CreatedDate,
                    Category = p.Category != null ? p.Category.Name : ""
                })
                .ToList();

            return Ok(new { total, page, pageSize, totalPages = (int)Math.Ceiling(total / (double)pageSize), items });
        }

        // GET /api/posts/5 - chi tiết bài viết (Content HTML từ CKEditor)
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    Category = p.Category!.Name
                })
                .FirstOrDefault();

            if (post == null) return NotFound();
            return Ok(post);
        }

        // GET /api/posts/latest - 3 bài mới nhất (trang chủ #36)
        [HttpGet("latest")]
        public IActionResult GetLatest()
        {
            var items = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .Take(3)
                .Select(p => new { p.Id, p.Title, p.ImageUrl, p.CreatedDate, Category = p.Category!.Name })
                .ToList();
            return Ok(items);
        }
    }
}
