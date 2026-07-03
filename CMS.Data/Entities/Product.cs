using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    // Sản phẩm: điện thoại, laptop, máy tính bảng, đồng hồ thông minh, tai nghe, phụ kiện...
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        [StringLength(250)]
        public string Name { get; set; }

        public string? Description { get; set; } // Mô tả chi tiết (HTML từ CKEditor)

        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; } // Số lượng tồn kho

        public string? ImageUrl { get; set; }

        public bool IsHot { get; set; } // Đánh dấu sản phẩm Hot / Bán chạy

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Khóa ngoại nối tới CategoryProduct
        public int CategoryProductId { get; set; }

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; }

        public virtual ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    }
}
