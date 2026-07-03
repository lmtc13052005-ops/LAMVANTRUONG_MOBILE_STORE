using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    // Danh mục tin tức / bài viết (CMS) - vd: Đánh giá điện thoại, Hướng dẫn sử dụng, So sánh sản phẩm
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(100)]
        public string Name { get; set; }

        public string? Description { get; set; }

        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post>? Posts { get; set; }
    }
}
