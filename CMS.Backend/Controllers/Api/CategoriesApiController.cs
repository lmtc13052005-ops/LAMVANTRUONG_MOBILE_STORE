using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using CMS.Data;

namespace CMS.Backend.Controllers.Api
{
    // Web API Danh mục (ngành hàng sản phẩm + danh mục bài viết) - Buổi 6 (#20).
    [ApiController]
    [Route("api/categories")]
    [EnableCors("AllowReactApp")]
    public class CategoriesApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/categories/products - ngành hàng cho CategoryMenu (#38)
        [HttpGet("products")]
        public IActionResult GetProductCategories()
        {
            var items = _context.CategoriesProducts
                .OrderBy(c => c.DisplayOrder)
                .Select(c => new { c.Id, c.Name, c.Description, c.ImageUrl, c.DisplayOrder })
                .ToList();
            return Ok(items);
        }

        // GET /api/categories/posts - danh mục bài viết
        [HttpGet("posts")]
        public IActionResult GetPostCategories()
        {
            var items = _context.Categories
                .OrderBy(c => c.Name)
                .Select(c => new { c.Id, c.Name, c.Description })
                .ToList();
            return Ok(items);
        }
    }
}
