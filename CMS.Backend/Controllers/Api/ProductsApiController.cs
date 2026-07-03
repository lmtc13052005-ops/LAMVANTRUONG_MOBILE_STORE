using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers.Api
{
    // Web API Sản phẩm phục vụ ReactJS Frontend - Buổi 6 (#20, #22).
    [ApiController]
    [Route("api/products")]
    [EnableCors("AllowReactApp")]
    public class ProductsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/products?categoryId=1&page=1&pageSize=12&search=iphone&sort=newest&minPrice=0&maxPrice=50000000
        [HttpGet]
        public IActionResult GetAll(
            int? categoryId, int page = 1, int pageSize = 12,
            string? search = null, string? sort = null,
            decimal? minPrice = null, decimal? maxPrice = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 48) pageSize = 12;

            var query = _context.Products.Include(p => p.CategoryProduct).AsQueryable();

            if (categoryId != null)
                query = query.Where(p => p.CategoryProductId == categoryId);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Name.Contains(search));

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            query = sort switch
            {
                "price_asc"  => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "hot"        => query.OrderByDescending(p => p.IsHot).ThenByDescending(p => p.CreatedDate),
                _            => query.OrderByDescending(p => p.CreatedDate)
            };

            int total = query.Count();
            var items = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new {
                    p.Id, p.Name, p.Price, p.StockQuantity,
                    p.ImageUrl, p.IsHot, p.CreatedDate,
                    Category = p.CategoryProduct != null ? p.CategoryProduct.Name : "",
                    p.CategoryProductId
                })
                .ToList();

            return Ok(new { total, page, pageSize, totalPages = (int)Math.Ceiling(total / (double)pageSize), items });
        }

        // GET /api/products/new?count=3 — sản phẩm mới nhất (tiêu chí #36)
        [HttpGet("new")]
        public IActionResult GetNew(int count = 3)
        {
            var items = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.CreatedDate)
                .Take(count)
                .Select(p => new {
                    p.Id, p.Name, p.Price, p.StockQuantity,
                    p.ImageUrl, p.IsHot, p.CreatedDate,
                    Category = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();
            return Ok(items);
        }

        // GET /api/products/hot?count=3 — sản phẩm bán chạy (tiêu chí #37)
        [HttpGet("hot")]
        public IActionResult GetHot(int count = 3)
        {
            var items = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.IsHot)
                .OrderByDescending(p => p.CreatedDate)
                .Take(count)
                .Select(p => new {
                    p.Id, p.Name, p.Price, p.StockQuantity,
                    p.ImageUrl, p.IsHot, p.CreatedDate,
                    Category = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            // Fallback: chưa đánh dấu IsHot → lấy 3 sản phẩm tiếp theo sau newest
            if (!items.Any())
            {
                items = _context.Products
                    .Include(p => p.CategoryProduct)
                    .OrderByDescending(p => p.CreatedDate)
                    .Skip(count)
                    .Take(count)
                    .Select(p => new {
                        p.Id, p.Name, p.Price, p.StockQuantity,
                        p.ImageUrl, p.IsHot, p.CreatedDate,
                        Category = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                    })
                    .ToList();
            }
            return Ok(items);
        }

        // GET /api/products/5 — chi tiết sản phẩm kèm variants (tiêu chí #27)
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .Include(p => p.Variants)
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id, p.Name, p.Description, p.Price, p.StockQuantity,
                    p.ImageUrl, p.IsHot, p.CreatedDate,
                    Category = p.CategoryProduct != null ? p.CategoryProduct.Name : "",
                    p.CategoryProductId,
                    Variants = p.Variants.Select(v => new {
                        v.Id, v.Color, v.ColorCode, v.Storage, v.PriceAdjust, v.StockQuantity
                    }).ToList()
                })
                .FirstOrDefault();

            if (product == null)
                return NotFound(new { message = "Sản phẩm không tìm thấy." });
            return Ok(product);
        }
    }
}
