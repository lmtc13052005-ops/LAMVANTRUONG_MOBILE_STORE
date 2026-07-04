using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using CMS.Backend;
using CMS.Data;
using CMS.Data.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Đăng ký DbContext vào hệ thống (Dependency Injection) - "cắm điện" kết nối Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===== BUỔI 5: Xác thực bằng Cookie + Google OAuth =====
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
    })
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
        options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
        options.CallbackPath = "/Account/GoogleCallback";
    });

// ===== IMemoryCache cho OTP quên mật khẩu (#46) =====
builder.Services.AddMemoryCache();

// ===== Swagger: tài liệu + test API tại /swagger =====
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===== BUỔI 6: CORS cho ReactJS Frontend (#22) =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // Đúng port ReactJS
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Tạo sẵn tài khoản quản trị mặc định (băm BCrypt) nếu DB chưa có User nào - #33
DbInitializer.SeedAdminUsers(app);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Chỉ bật Swagger UI ở môi trường Development
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowReactApp"); // Bật CORS trước Authentication/Authorization

app.UseAuthentication(); // Buổi 5: nhận diện người đăng nhập
app.UseAuthorization();

// ===== BUỔI 6: Middleware lai - API (attribute routing) + MVC (conventional) (#23) =====
app.MapControllers(); // Web API: /api/...

// Điểm vào backend là KHU QUẢN TRỊ: mặc định trỏ thẳng Dashboard.
// Dashboard có [Authorize] -> chưa đăng nhập sẽ tự chuyển về /Account/Login,
// đăng nhập xong quay lại Dashboard. (Phần public là ReactJS frontend, không render ở đây.)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Dashboard}/{id?}");

app.Run();
