using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    // Phiên bản sản phẩm: màu sắc + dung lượng/RAM (iPhone 17 Pro Max 256GB Đen Titan...)
    public class ProductVariant
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }

        [StringLength(50)]
        public string? Color { get; set; }        // "Đen Titan", "Trắng", "Xanh Dương"

        [StringLength(20)]
        public string? ColorCode { get; set; }    // CSS hex "#1c1c1e" để hiển thị màu

        [StringLength(50)]
        public string? Storage { get; set; }      // "128GB", "256GB", "1TB", "16GB RAM"

        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceAdjust { get; set; } = 0; // Chênh lệch so với giá gốc (dương/âm)

        public int StockQuantity { get; set; } = 0;

        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }
    }
}
