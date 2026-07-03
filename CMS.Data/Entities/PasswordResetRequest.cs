using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class PasswordResetRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = "";

        [Required]
        public string Email { get; set; } = "";

        public string? Phone { get; set; }

        [Required]
        public string NewPasswordHash { get; set; } = "";

        public int Status { get; set; } = 0; // 0=Chờ duyệt, 1=Đã duyệt, 2=Từ chối

        public DateTime RequestDate { get; set; } = DateTime.Now;

        public DateTime? ProcessedDate { get; set; }

        public string? Note { get; set; }
    }
}
