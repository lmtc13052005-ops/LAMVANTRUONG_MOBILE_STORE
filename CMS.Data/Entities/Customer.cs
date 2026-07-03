using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    // Khách hàng mua sắm trên Frontend (đăng ký / đăng nhập)
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        [Required]
        public string Password { get; set; } // Lưu mật khẩu đã băm BCrypt (không lưu thô)

        public virtual ICollection<Order>? Orders { get; set; }
    }
}
