using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    // Tài khoản quản trị nội bộ (nhân viên cửa hàng) - dùng cho đăng nhập Admin
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; } // Mật khẩu băm BCrypt - KHÔNG lưu thô

        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [Required]
        public string Role { get; set; } // "Admin" (Quản trị viên) hoặc "Editor" (Biên tập viên)

        [StringLength(200)]
        public string? Email { get; set; } // Email để liên kết đăng nhập Google OAuth
    }
}
