using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers.Api
{
    // CRUD phiên bản sản phẩm — gọi từ Admin JS
    [ApiController]
    [Route("api/product-variants")]
    [EnableCors("AllowReactApp")]
    public class ProductVariantsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProductVariantsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/product-variants?productId=5
        [HttpGet]
        public IActionResult GetByProduct(int productId)
        {
            var variants = _context.ProductVariants
                .Where(v => v.ProductId == productId)
                .OrderBy(v => v.Color).ThenBy(v => v.Storage)
                .Select(v => new { v.Id, v.Color, v.ColorCode, v.Storage, v.PriceAdjust, v.StockQuantity })
                .ToList();
            return Ok(variants);
        }

        // POST /api/product-variants
        [HttpPost]
        public IActionResult Create([FromBody] ProductVariantRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!_context.Products.Any(p => p.Id == req.ProductId))
                return NotFound(new { message = "Sản phẩm không tồn tại." });

            var variant = new ProductVariant
            {
                ProductId  = req.ProductId,
                Color      = req.Color?.Trim(),
                ColorCode  = req.ColorCode?.Trim(),
                Storage    = req.Storage?.Trim(),
                PriceAdjust = req.PriceAdjust,
                StockQuantity = req.StockQuantity
            };
            _context.ProductVariants.Add(variant);
            _context.SaveChanges();
            return Ok(new { variant.Id, variant.Color, variant.ColorCode, variant.Storage, variant.PriceAdjust, variant.StockQuantity });
        }

        // PUT /api/product-variants/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ProductVariantRequest req)
        {
            var variant = _context.ProductVariants.Find(id);
            if (variant == null) return NotFound();
            variant.Color         = req.Color?.Trim();
            variant.ColorCode     = req.ColorCode?.Trim();
            variant.Storage       = req.Storage?.Trim();
            variant.PriceAdjust   = req.PriceAdjust;
            variant.StockQuantity = req.StockQuantity;
            _context.SaveChanges();
            return Ok(new { variant.Id, variant.Color, variant.ColorCode, variant.Storage, variant.PriceAdjust, variant.StockQuantity });
        }

        // DELETE /api/product-variants/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var variant = _context.ProductVariants.Find(id);
            if (variant == null) return NotFound();
            _context.ProductVariants.Remove(variant);
            _context.SaveChanges();
            return Ok(new { message = "Đã xóa phiên bản." });
        }
    }

    public record ProductVariantRequest(
        int ProductId,
        string? Color,
        string? ColorCode,
        string? Storage,
        decimal PriceAdjust,
        int StockQuantity
    );
}
