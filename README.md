# TruongCMS.MobileStore

**Website Kinh Doanh Điện Thoại, Laptop & Đồ Điện Tử** — Đồ án ASP.NET Core 8.0 + ReactJS.

Kinh doanh điện thoại, laptop, máy tính bảng, đồng hồ thông minh, tai nghe, phụ kiện công nghệ và các thiết bị điện tử khác. Tích hợp **CMS tin tức** (đánh giá, hướng dẫn sử dụng, so sánh sản phẩm công nghệ).

## 🏗️ Kiến trúc 3 lớp

| Project | Công nghệ | Vai trò |
|---------|-----------|---------|
| `CMS.Data` | .NET 8 Class Library + EF Core | 8 thực thể (Entities) + DbContext |
| `CMS.Backend` | ASP.NET Core 8 MVC + Web API | Trang quản trị (Admin) + Web API + Swagger |
| `cms.frontend` | ReactJS | Giao diện khách hàng (SPA) |

**8 thực thể:** Category, Post, User · CategoryProduct, Product, Customer, Order, OrderDetail

## ⚙️ Yêu cầu môi trường

- .NET SDK 8.0 trở lên
- SQL Server (Express / LocalDB)
- Node.js (LTS) + npm

## ▶️ Cách chạy Backend (Visual Studio / CLI)

```bash
# Tại thư mục gốc solution
dotnet restore
dotnet build

# Tạo database (sau khi cấu hình ConnectionString trong CMS.Backend/appsettings.json)
dotnet ef database update --project CMS.Data --startup-project CMS.Backend

# Chạy Backend (hoặc nhấn F5 trong Visual Studio, đặt CMS.Backend làm Startup Project)
dotnet run --project CMS.Backend
```

- Trang quản trị: `https://localhost:<port>/`
- Swagger API: `https://localhost:<port>/swagger`

## ▶️ Cách chạy Frontend (ReactJS)

```bash
cd cms.frontend
npm install
npm start
```

- Giao diện khách hàng: `http://localhost:3000`
- Cấu hình API trong `cms.frontend/.env` → `REACT_APP_API_URL`

## 🔑 Tài khoản demo (cập nhật sau khi seed)

| Vai trò | Username | Password |
|---------|----------|----------|
| Admin   | admin    | admin123 |
| Editor  | editor   | editor123 |

> Tài khoản được **seed tự động** (băm BCrypt) khi chạy lần đầu nếu DB chưa có User. Trang đăng nhập: `/Account/Login`.

## 📚 Tài liệu

- [Lộ trình & checklist điểm](docs/00-BANG-DIEM-DIEU-CHINH.md)
- Tiến độ theo buổi: [Buổi 1](docs/buoi-01.md) · [Buổi 2](docs/buoi-02.md) · [Buổi 3](docs/buoi-03.md) · [Buổi 4](docs/buoi-04.md) · [Buổi 5](docs/buoi-05.md) · [Buổi 6](docs/buoi-06.md)

## 🔌 Web API (cho ReactJS)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Danh sách sản phẩm (lọc + phân trang) |
| GET | `/api/products/{id}` · `/api/products/hot` | Chi tiết · 3 sản phẩm Hot |
| GET | `/api/posts` · `/api/posts/{id}` · `/api/posts/latest` | Bài viết |
| GET | `/api/categories/products` · `/api/categories/posts` | Danh mục |
| POST | `/api/orders` | Tạo đơn hàng từ giỏ (trừ tồn kho) |

CORS cho phép origin `http://localhost:3000` (ReactJS).

## 🗓️ Tiến độ

- [x] **Buổi 1** — Khởi tạo Solution 3 lớp + 8 Entities + demo CategoryController
- [x] **Buổi 2** — EF Core, DbContext, Migration (8 bảng), Seed data đồ điện tử
- [x] **Buổi 3** — LINQ (Where/OrderBy/Include/Take) + CRUD Category + Post list/details + trang chủ 3 tin mới
- [x] **Buổi 4** — Admin Panel (giao diện Notus/Tailwind) + CRUD 8 thực thể + phân trang + CKEditor + upload ảnh
- [x] **Buổi 5** — Cookie Authentication: Login/Logout, `[Authorize]`, phân quyền Role, băm mật khẩu BCrypt
- [x] **Buổi 6** — Web API (GET/POST) cho ReactJS + CORS (AllowReactApp) + middleware lai API/MVC
- [ ] Buổi 7 → 12 — (đang triển khai)
