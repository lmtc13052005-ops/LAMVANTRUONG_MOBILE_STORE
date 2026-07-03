using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    // Danh mục sản phẩm - vd: Điện thoại, Laptop, Máy tính bảng, Đồng hồ thông minh, Tai nghe, Phụ kiện
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(100)]
        public string Name { get; set; }

        public string? Description { get; set; }

        public int DisplayOrder { get; set; } // Thứ tự hiển thị trên menu danh mục

        public string? ImageUrl { get; set; } // Ảnh đại diện ngành hàng (CategoryMenu)

        // Quan hệ: Một danh mục có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; }
    }
}
