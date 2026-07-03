using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CMS.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CategoriesProducts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriesProducts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Posts_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsHot = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CategoryProductId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_CategoriesProducts_CategoryProductId",
                        column: x => x.CategoryProductId,
                        principalTable: "CategoriesProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Review chi tiết các dòng smartphone mới nhất", "Đánh giá điện thoại" },
                    { 2, "So sánh, đánh giá laptop văn phòng & gaming", "Đánh giá Laptop" },
                    { 3, "Mẹo & thủ thuật dùng thiết bị điện tử hiệu quả", "Hướng dẫn sử dụng" },
                    { 4, "So sánh các dòng sản phẩm công nghệ", "So sánh sản phẩm" }
                });

            migrationBuilder.InsertData(
                table: "CategoriesProducts",
                columns: new[] { "Id", "Description", "DisplayOrder", "ImageUrl", "Name" },
                values: new object[,]
                {
                    { 1, "Smartphone các hãng", 1, null, "Điện thoại" },
                    { 2, "Laptop văn phòng, gaming", 2, null, "Laptop" },
                    { 3, "Tablet, iPad", 3, null, "Máy tính bảng" },
                    { 4, "Smartwatch", 4, null, "Đồng hồ thông minh" },
                    { 5, "Tai nghe có dây & không dây", 5, null, "Tai nghe" },
                    { 6, "Sạc, cáp, pin dự phòng...", 6, null, "Phụ kiện" }
                });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "Id", "CategoryId", "Content", "CreatedDate", "ImageUrl", "Title" },
                values: new object[,]
                {
                    { 1, 1, "<p>iPhone 15 Pro Max mang đến khung Titan nhẹ hơn, chip A17 Pro mạnh mẽ...</p>", new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "/uploads/iphone15.jpg", "Đánh giá iPhone 15 Pro Max: Nâng cấp đáng giá?" },
                    { 2, 2, "<p>MacBook Air M3 cải thiện hiệu năng và thời lượng pin ấn tượng...</p>", new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "/uploads/macbook-air-m3.jpg", "Đánh giá MacBook Air M3: Laptop mỏng nhẹ tốt nhất" },
                    { 3, 3, "<p>Các bước ghép nối Apple Watch với iPhone và cấu hình cơ bản...</p>", new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "/uploads/applewatch-setup.jpg", "Hướng dẫn thiết lập Apple Watch lần đầu" },
                    { 4, 4, "<p>Hai flagship đầu bảng 2024 cạnh tranh ở camera, hiệu năng và pin...</p>", new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "/uploads/iphone-vs-samsung.jpg", "So sánh iPhone 15 Pro Max và Galaxy S24 Ultra" },
                    { 5, 1, "<p>Danh sách những mẫu tai nghe true wireless chất lượng nhất...</p>", new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "/uploads/top5-tainghe.jpg", "Top 5 tai nghe không dây đáng mua năm 2026" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryProductId", "CreatedDate", "Description", "ImageUrl", "IsHot", "Name", "Price", "StockQuantity" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chip A17 Pro, khung Titan, camera 48MP.", null, true, "iPhone 15 Pro Max 256GB", 29990000m, 50 },
                    { 2, 1, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Snapdragon 8 Gen 3, bút S-Pen, màn 6.8 inch.", null, true, "Samsung Galaxy S24 Ultra", 26990000m, 40 },
                    { 3, 1, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Camera Leica, sạc nhanh 90W.", null, false, "Xiaomi 14", 18990000m, 60 },
                    { 4, 2, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chip Apple M3, pin 18 giờ, siêu mỏng nhẹ.", null, true, "MacBook Air M3 13 inch", 27990000m, 30 },
                    { 5, 2, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Intel Core Ultra 7, màn InfinityEdge.", null, false, "Dell XPS 13 9340", 32990000m, 20 },
                    { 6, 3, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chip M2, hỗ trợ Apple Pencil Pro.", null, false, "iPad Air M2 11 inch", 16990000m, 35 },
                    { 7, 4, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Đo SpO2, ECG, chip S9.", null, true, "Apple Watch Series 9 GPS", 10990000m, 25 },
                    { 8, 5, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chống ồn chủ động, âm thanh không gian.", null, true, "AirPods Pro 2 USB-C", 5990000m, 100 },
                    { 9, 6, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sạc nhanh PD 30W, 2 cổng ra.", null, false, "Pin dự phòng Anker 20000mAh", 790000m, 200 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderId",
                table: "OrderDetails",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_ProductId",
                table: "OrderDetails",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_CategoryId",
                table: "Posts",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryProductId",
                table: "Products",
                column: "CategoryProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderDetails");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "CategoriesProducts");
        }
    }
}
