# 📱 LAMVANTRUONG_MOBILE_STORE

Dự án quản lý và bán hàng cửa hàng điện thoại di động (Mobile Store) sử dụng mô hình kết hợp giữa **ASP.NET Core Web API (Backend)** và **ReactJS (Frontend)**. Đây là bài tập lớn cho môn học ASP.NET Core.

---

## 🏗️ Kiến trúc & Công nghệ sử dụng

### 1. Backend (`CMS.Backend` & `CMS.Data`)
* **Framework:** ASP.NET Core 8.0 (Web API + MVC Dashboard)
* **Database:** Microsoft SQL Server (sử dụng Entity Framework Core Code-First)
* **Bảo mật & Xác thực:** 
  * Xác thực Cookie (Cookie Authentication) cho trang quản trị Dashboard.
  * Tích hợp **Google OAuth 2.0** hỗ trợ đăng nhập nhanh bằng tài khoản Google.
  * Mã hóa mật khẩu người dùng sử dụng thuật toán **BCrypt**.
* **Chức năng bổ sung:**
  * **Email SMTP Service:** Gửi mã OTP xác nhận khi người dùng quên mật khẩu.
  * **Swagger UI:** Tự động tạo tài liệu API phục vụ việc kiểm thử tại đường dẫn `/swagger`.
  * **CORS:** Cấu hình cho phép ứng dụng ReactJS kết nối an toàn.
  * **DbInitializer:** Tự động Seed tài khoản Admin mặc định khi khởi chạy cơ sở dữ liệu.

### 2. Frontend (`cms.frontend`)
* **Framework:** ReactJS 19.x (Khởi tạo bằng Create React App)
* **Routing:** React Router v7
* **Tính năng chính:** Hiển thị sản phẩm điện thoại, danh mục sản phẩm, chi tiết sản phẩm và các chức năng của khách hàng.

---

## 🛠️ Hướng dẫn cài đặt và chạy dự án

### 📋 Yêu cầu hệ thống
* [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js](https://nodejs.org/) (Khuyên dùng bản LTS mới nhất)
* [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb) hoặc SQL Server Express.

---

### 📂 Cấu hình & Khởi chạy Backend

1. **Cấu hình Database và API:**
   Mở tệp `CMS.Backend/appsettings.json` và cập nhật thông tin chuỗi kết nối SQL Server cũng như cấu hình gửi Email/Google OAuth nếu cần:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TruongCMS_MobileStore_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
     },
     "Authentication": {
       "Google": {
         "ClientId": "YOUR_GOOGLE_CLIENT_ID",
         "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
       }
     },
     "EmailSettings": {
       "SmtpHost": "smtp.gmail.com",
       "SmtpPort": "465",
       "SenderEmail": "YOUR_EMAIL@gmail.com",
       "SenderPassword": "YOUR_APP_PASSWORD"
     }
   }
   ```

2. **Chạy Migration để tạo Database:**
   Mở Terminal ở thư mục gốc dự án và chạy lệnh:
   ```bash
   dotnet ef database update --project CMS.Data --startup-project CMS.Backend
   ```
   *(Hoặc nếu chạy lần đầu, ứng dụng tự động gọi Seed Database để tạo sẵn cấu trúc và tài khoản Admin mặc định).*

3. **Khởi chạy Backend:**
   Chạy lệnh dotnet từ thư mục `CMS.Backend`:
   ```bash
   cd CMS.Backend
   dotnet run
   ```
   API và trang quản trị sẽ khả dụng tại:
   * **Dashboard MVC (Trang quản trị):** `https://localhost:7079` (hoặc `http://localhost:5079`)
   * **Swagger UI (Tài liệu API):** `https://localhost:7079/swagger`

---

### 💻 Khởi chạy Frontend (ReactJS)

1. **Cài đặt thư viện:**
   Di chuyển vào thư mục `cms.frontend` và cài đặt các gói phụ thuộc:
   ```bash
   cd cms.frontend
   npm install
   ```

2. **Khởi chạy ứng dụng:**
   ```bash
   npm start
   ```
   Ứng dụng ReactJS sẽ chạy tại địa chỉ: `http://localhost:3000`

---

## 👥 Thành viên thực hiện
* **Lâm Văn Trường** (Trưởng nhóm / Nhà phát triển chính)
