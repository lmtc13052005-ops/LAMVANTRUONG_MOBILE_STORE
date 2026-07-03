using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend
{
    // Tạo tài khoản quản trị mặc định khi DB chưa có User nào (mật khẩu băm BCrypt - #33).
    // Chạy 1 lần lúc khởi động trong Program.cs.
    public static class DbInitializer
    {
        public static void SeedAdminUsers(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Đảm bảo DB đã được tạo/migrate
            context.Database.Migrate();

            // Patch email cho admin nếu chưa có (upgrade từ phiên bản cũ)
            var adminUser = context.Users.FirstOrDefault(u => u.Username == "admin");
            if (adminUser != null && string.IsNullOrEmpty(adminUser.Email))
            {
                adminUser.Email = "lmtc13052005@gmail.com";
                context.SaveChanges();
            }

            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User
                    {
                        Username = "admin",
                        FullName = "Quản trị viên",
                        Role = "Admin",
                        Email = "lmtc13052005@gmail.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123")
                    },
                    new User
                    {
                        Username = "editor",
                        FullName = "Biên tập viên",
                        Role = "Editor",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("editor123")
                    }
                );
                context.SaveChanges();
            }

            SeedTestCustomers(context);
        }

        // Tạo khách hàng mẫu để test đăng nhập frontend.
        private static void SeedTestCustomers(ApplicationDbContext context)
        {
            // Chỉ seed khi chưa có khách hàng nào
            if (context.Customers.Any()) return;

            context.Customers.AddRange(
                new Customer
                {
                    FullName = "Nguyễn Văn An",
                    Email = "an@test.com",
                    Phone = "0901111111",
                    Password = BCrypt.Net.BCrypt.HashPassword("123456")
                },
                new Customer
                {
                    FullName = "Trần Thị Bích",
                    Email = "bich@test.com",
                    Phone = "0902222222",
                    Password = BCrypt.Net.BCrypt.HashPassword("123456")
                },
                new Customer
                {
                    FullName = "Lê Minh Cường",
                    Email = "cuong@test.com",
                    Phone = "0903333333",
                    Password = BCrypt.Net.BCrypt.HashPassword("123456")
                }
            );
            context.SaveChanges();
        }
    }
}
