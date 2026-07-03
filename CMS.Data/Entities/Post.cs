using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    // Bài viết CMS: Đánh giá điện thoại/laptop, Hướng dẫn sử dụng thiết bị, So sánh sản phẩm công nghệ
    public class Post
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề bài viết không được để trống")]
        [StringLength(250)]
        public string Title { get; set; }       // Tiêu đề bài viết

        public string? Content { get; set; }     // Nội dung chi tiết (HTML từ CKEditor)

        public string? ImageUrl { get; set; }    // Hình ảnh đại diện

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Khóa ngoại liên kết tới Category
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
    }
}
