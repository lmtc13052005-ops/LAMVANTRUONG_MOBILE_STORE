using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;

namespace CMS.Data
{
    // "Trạm điều khiển" trung tâm kết nối các Entity với SQL Server
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // Mỗi DbSet tương ứng một bảng trong SQL Server
        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CategoryProduct> CategoriesProducts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<PasswordResetRequest> PasswordResetRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            SeedData(modelBuilder);
        }

        // Nạp dữ liệu mẫu (Seed Data) - đồ điện tử đúng đề tài
        private void SeedData(ModelBuilder mb)
        {
            var seedDate = new DateTime(2026, 1, 15);

            // 1) Danh mục bài viết CMS
            mb.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Đánh giá điện thoại", Description = "Review chi tiết các dòng smartphone mới nhất" },
                new Category { Id = 2, Name = "Đánh giá Laptop", Description = "So sánh, đánh giá laptop văn phòng & gaming" },
                new Category { Id = 3, Name = "Hướng dẫn sử dụng", Description = "Mẹo & thủ thuật dùng thiết bị điện tử hiệu quả" },
                new Category { Id = 4, Name = "So sánh sản phẩm", Description = "So sánh các dòng sản phẩm công nghệ" }
            );

            // 2) Danh mục sản phẩm (ngành hàng)
            mb.Entity<CategoryProduct>().HasData(
                new CategoryProduct { Id = 1, Name = "Điện thoại", Description = "Smartphone các hãng", DisplayOrder = 1 },
                new CategoryProduct { Id = 2, Name = "Laptop", Description = "Laptop văn phòng, gaming", DisplayOrder = 2 },
                new CategoryProduct { Id = 3, Name = "Máy tính bảng", Description = "Tablet, iPad", DisplayOrder = 3 },
                new CategoryProduct { Id = 4, Name = "Đồng hồ thông minh", Description = "Smartwatch", DisplayOrder = 4 },
                new CategoryProduct { Id = 5, Name = "Tai nghe", Description = "Tai nghe có dây & không dây", DisplayOrder = 5 },
                new CategoryProduct { Id = 6, Name = "Phụ kiện", Description = "Sạc, cáp, pin dự phòng...", DisplayOrder = 6 }
            );

            // 3) Sản phẩm mẫu
            mb.Entity<Product>().HasData(
                new Product { Id = 1, Name = "iPhone 15 Pro Max 256GB", Description = "Chip A17 Pro, khung Titan, camera 48MP.", Price = 29990000m, StockQuantity = 50, IsHot = true, CategoryProductId = 1, CreatedDate = seedDate },
                new Product { Id = 2, Name = "Samsung Galaxy S24 Ultra", Description = "Snapdragon 8 Gen 3, bút S-Pen, màn 6.8 inch.", Price = 26990000m, StockQuantity = 40, IsHot = true, CategoryProductId = 1, CreatedDate = seedDate },
                new Product { Id = 3, Name = "Xiaomi 14", Description = "Camera Leica, sạc nhanh 90W.", Price = 18990000m, StockQuantity = 60, IsHot = false, CategoryProductId = 1, CreatedDate = seedDate },
                new Product { Id = 4, Name = "MacBook Air M3 13 inch", Description = "Chip Apple M3, pin 18 giờ, siêu mỏng nhẹ.", Price = 27990000m, StockQuantity = 30, IsHot = true, CategoryProductId = 2, CreatedDate = seedDate },
                new Product { Id = 5, Name = "Dell XPS 13 9340", Description = "Intel Core Ultra 7, màn InfinityEdge.", Price = 32990000m, StockQuantity = 20, IsHot = false, CategoryProductId = 2, CreatedDate = seedDate },
                new Product { Id = 6, Name = "iPad Air M2 11 inch", Description = "Chip M2, hỗ trợ Apple Pencil Pro.", Price = 16990000m, StockQuantity = 35, IsHot = false, CategoryProductId = 3, CreatedDate = seedDate },
                new Product { Id = 7, Name = "Apple Watch Series 9 GPS", Description = "Đo SpO2, ECG, chip S9.", Price = 10990000m, StockQuantity = 25, IsHot = true, CategoryProductId = 4, CreatedDate = seedDate },
                new Product { Id = 8, Name = "AirPods Pro 2 USB-C", Description = "Chống ồn chủ động, âm thanh không gian.", Price = 5990000m, StockQuantity = 100, IsHot = true, CategoryProductId = 5, CreatedDate = seedDate },
                new Product { Id = 9, Name = "Pin dự phòng Anker 20000mAh", Description = "Sạc nhanh PD 30W, 2 cổng ra.", Price = 790000m, StockQuantity = 200, IsHot = false, CategoryProductId = 6, CreatedDate = seedDate }
            );

            // 4) Bài viết CMS mẫu
            mb.Entity<Post>().HasData(
                new Post { Id = 1, Title = "Đánh giá iPhone 15 Pro Max: Nâng cấp đáng giá?", Content = "<p>iPhone 15 Pro Max mang đến khung Titan nhẹ hơn, chip A17 Pro mạnh mẽ...</p>", ImageUrl = "/uploads/iphone15.jpg", CategoryId = 1, CreatedDate = seedDate },
                new Post { Id = 2, Title = "Đánh giá MacBook Air M3: Laptop mỏng nhẹ tốt nhất", Content = "<p>MacBook Air M3 cải thiện hiệu năng và thời lượng pin ấn tượng...</p>", ImageUrl = "/uploads/macbook-air-m3.jpg", CategoryId = 2, CreatedDate = seedDate },
                new Post { Id = 3, Title = "Hướng dẫn thiết lập Apple Watch lần đầu", Content = "<p>Các bước ghép nối Apple Watch với iPhone và cấu hình cơ bản...</p>", ImageUrl = "/uploads/applewatch-setup.jpg", CategoryId = 3, CreatedDate = seedDate },
                new Post { Id = 4, Title = "So sánh iPhone 15 Pro Max và Galaxy S24 Ultra", Content = "<p>Hai flagship đầu bảng 2024 cạnh tranh ở camera, hiệu năng và pin...</p>", ImageUrl = "/uploads/iphone-vs-samsung.jpg", CategoryId = 4, CreatedDate = seedDate },
                new Post { Id = 5, Title = "Top 5 tai nghe không dây đáng mua năm 2026", Content = "<p>Danh sách những mẫu tai nghe true wireless chất lượng nhất...</p>", ImageUrl = "/uploads/top5-tainghe.jpg", CategoryId = 1, CreatedDate = seedDate }
            );
        }
    }
}
