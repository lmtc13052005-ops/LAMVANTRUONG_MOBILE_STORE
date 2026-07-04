# 📱 HỆ THỐNG QUẢN LÝ VÀ BÁN HÀNG ĐIỆN THOẠI DI ĐỘNG (TRUONG CMS MOBILE STORE)

Dự án phát triển hệ thống Website Quản lý và Cửa hàng bán lẻ Điện thoại di động trực tuyến. Dự án áp dụng mô hình kiến trúc hiện đại tách biệt giữa **Trang quản trị (Admin Dashboard - ASP.NET Core MVC/API)** và **Trang khách hàng (Client Side - ReactJS Single Page Application)**.

---

## 📋 MỤC LỤC CHI TIẾT (10 PHẦN)

1. [Giới thiệu dự án](#1-giới-thiệu-dự-án)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Các tính năng chính của hệ thống](#3-các-tính-năng-chính-của-hệ-thống)
4. [Công nghệ & Thư viện sử dụng](#4-công-nghệ--thư-viện-sử-dụng)
5. [Yêu cầu cài đặt hệ thống](#5-yêu-cầu-cài-đặt-hệ-thống)
6. [Hướng dẫn cài đặt & Cấu hình chi tiết](#6-hướng-dẫn-cài-đặt--cấu-hình-chi-tiết)
7. [Khởi tạo cơ sở dữ liệu (Database Migration)](#7-khởi-tạo-cơ-sở-dữ-liệu-database-migration)
8. [Hướng dẫn vận hành & Chạy chương trình](#8-hướng-dẫn-vận-hành--chạy-chương-trình)
9. [Kiểm thử API & Tài liệu Swagger](#9-kiểm-thử-api--tài-liệu-swagger)
10. [Cấu trúc thư mục & Quy chuẩn đóng góp](#10-cấu-trúc-thư-mục--quy-chuẩn-đóng-góp)

---

## 1. GIỚI THIỆU DỰ ÁN
**TruongCMS Mobile Store** là giải pháp quản lý bán hàng toàn diện được thiết kế để hỗ trợ các doanh nghiệp bán lẻ điện thoại di động tối ưu hóa quy trình quản lý kho, theo dõi đơn hàng và bán sản phẩm tới khách hàng. 
* **Mục tiêu:** Tạo ra một hệ thống chạy mượt mà, phân tách rõ ràng nhiệm vụ quản trị viên và trải nghiệm khách hàng mua sắm.
* **Đối tượng hướng tới:** Các cửa hàng điện thoại vừa và nhỏ muốn số hóa kênh phân phối và quản lý.

---

## 2. KIẾN TRÚC HỆ THỐNG
Dự án được xây dựng theo mô hình Client-Server hiện đại:
* **Backend (RESTful API & MVC Dashboard):** Nhận yêu cầu từ Client, thực hiện logic nghiệp vụ, quản lý trạng thái phiên đăng nhập (Cookie-based), bảo mật và truy xuất dữ liệu từ SQL Server.
* **Frontend (ReactJS SPA):** Đóng vai trò giao diện người dùng, gọi API không đồng bộ để tải thông tin sản phẩm và quản lý trạng thái giỏ hàng, mang lại trải nghiệm mượt mà, không tải lại trang (Single Page Application).
* **Luồng bảo mật:** Tích hợp cả cơ chế Cookie cho Admin Area và Token/API cho React Client.

---

## 3. CÁC TÍNH NĂNG CHÍNH CỦA HỆ THỐNG

### A. Hệ thống Quản trị (Admin Dashboard - Backend MVC)
* **Quản lý sản phẩm:** Thêm, sửa, xóa các dòng điện thoại, quản lý số lượng tồn kho, giá bán, hình ảnh.
* **Quản lý danh mục:** Tổ chức sản phẩm theo thương hiệu (Apple, Samsung, Xiaomi...) hoặc loại sản phẩm.
* **Xác thực Cookie & Phân quyền:** Phân chia quyền hạn Admin và nhân viên bán hàng.
* **Quản lý Đơn hàng:** Xem thông tin đặt hàng, duyệt trạng thái đơn hàng (Đang xử lý, Đang giao, Đã hoàn thành).
* **Đăng nhập Google OAuth:** Cho phép quản trị viên đăng nhập nhanh bằng tài khoản Google đã liên kết.

### B. Giao diện Người dùng (Customer Client - ReactJS)
* **Xem & Tìm kiếm sản phẩm:** Bộ lọc thông minh theo giá, thương hiệu, tính năng.
* **Quản lý giỏ hàng:** Thêm sản phẩm vào giỏ hàng, cập nhật số lượng trực tuyến trực quan.
* **Xác thực đa năng:** Đăng ký tài khoản, đăng nhập hệ thống thường hoặc qua mạng xã hội (Google Login).
* **Khôi phục mật khẩu (OTP):** Gửi mã xác nhận qua Email để lấy lại mật khẩu an toàn.

---

## 4. CÔNG NGHỆ & THƯ VIỆN SỬ DỤNG

### Backend (.NET Core 8.0)
* **Entity Framework Core:** Áp dụng Code-First để tự động sinh cấu trúc DB.
* **Microsoft.AspNetCore.Authentication.Google:** Thư viện liên kết dịch vụ Google Login.
* **BCrypt.Net-Next:** Mã hóa một chiều mật khẩu để lưu trữ an toàn trong DB.
* **Swashbuckle.AspNetCore:** Công cụ sinh tài liệu OpenAPI / Swagger UI tự động.
* **MailKit / System.Net.Mail:** Hỗ trợ gửi Email khôi phục tài khoản thông qua giao thức SMTP.

### Frontend (ReactJS)
* **React 19.x & React-DOM:** Thư viện xây dựng giao diện người dùng dựa trên Component.
* **React Router v7:** Quản lý chuyển trang mượt mà không tải lại.
* **Axios (hoặc Fetch API):** Giao tiếp HTTP gửi/nhận dữ liệu từ Backend.

---

## 5. YÊU CẦU CÀI ĐẶT HỆ THỐNG
Trước khi khởi chạy dự án, máy tính của bạn cần được cài đặt sẵn:
1. **.NET SDK 8.0:** Để biên dịch và chạy Backend.
2. **Node.js (LTS version >= 18):** Để quản lý package và khởi chạy ReactJS.
3. **Microsoft SQL Server (2019/2022 hoặc LocalDB):** Hệ quản trị cơ sở dữ liệu quan hệ.
4. **Git:** Dùng để quản lý mã nguồn.

---

## 6. HƯỚNG DẪN CÀI ĐẶT & CẤU HÌNH CHI TIẾT

### Bước 1: Clone dự án về máy
```bash
git clone https://github.com/lmtc13052005-ops/LAMVANTRUONG_MOBILE_STORE.git
cd LAMVANTRUONG_MOBILE_STORE
```

### Bước 2: Cấu hình Backend (`CMS.Backend/appsettings.json`)
Chỉnh sửa các giá trị kết nối sau trong tệp cấu hình:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TruongCMS_MobileStore_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  "Authentication": {
    "Google": {
      "ClientId": "66237493241-e7npdu0evipug6acu7u0p3it1tvecaoi.apps.googleusercontent.com",
      "ClientSecret": "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"
    }
  },
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "465",
    "SenderEmail": "lmtc13052005@gmail.com",
    "SenderPassword": "pnjwosmpuvyotlhp"
  }
}
```
> ⚠️ **Lưu ý bảo mật:** Hãy thay thế các thông tin ClientId, ClientSecret và SenderPassword bằng tài khoản thực tế của bạn trước khi đưa dự án lên môi trường Production.

---

## 7. KHỞI TẠO CƠ SỞ DỮ LIỆU (DATABASE MIGRATION)
Dự án sử dụng cơ chế EF Core Code-First. Khi chạy lần đầu, bạn cần sinh cấu trúc cơ sở dữ liệu trên SQL Server.

1. Hãy chắc chắn bạn đã cài đặt công cụ `dotnet-ef`:
   ```bash
   dotnet tool install --global dotnet-ef
   ```
2. Thực thi lệnh cập nhật cơ sở dữ liệu từ thư mục gốc của dự án:
   ```bash
   dotnet ef database update --project CMS.Data --startup-project CMS.Backend
   ```
3. Sau khi hoàn thành lệnh, một cơ sở dữ liệu tên `TruongCMS_MobileStore_DB` sẽ được tạo trong SQL Server của bạn. 
4. Hệ thống cũng sẽ tự động chạy chương trình seed (`DbInitializer.SeedAdminUsers`) để khởi tạo tài khoản Admin mặc định nếu DB chưa có người dùng nào.

---

## 8. HƯỚNG DẪN VẬN HÀNH & CHẠY CHƯƠNG TRÌNH

### 1. Chạy Backend (ASP.NET Core)
1. Di chuyển vào thư mục dự án Backend:
   ```bash
   cd CMS.Backend
   ```
2. Thực thi lệnh chạy dự án:
   ```bash
   dotnet run
   ```
3. Backend sẽ chạy ở các cổng mặc định:
   * **HTTPS:** `https://localhost:7079`
   * **HTTP:** `http://localhost:5079`

### 2. Chạy Frontend (ReactJS)
1. Mở một cửa sổ terminal mới và di chuyển vào thư mục Frontend:
   ```bash
   cd cms.frontend
   ```
2. Tiến hành cài đặt các gói thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy ứng dụng React ở chế độ phát triển:
   ```bash
   npm start
   ```
4. Trình duyệt sẽ tự động mở trang web tại địa chỉ: `http://localhost:3000`

---

## 9. KIỂM THỬ API & TÀI LIỆU SWAGGER
Để hỗ trợ việc tích hợp giữa Frontend và Backend dễ dàng, bạn có thể kiểm thử trực tiếp các endpoint của hệ thống bằng công cụ Swagger tích hợp sẵn.
* Địa chỉ truy cập Swagger UI: `https://localhost:7079/swagger/index.html` (chỉ khả dụng trong môi trường phát triển - `Development`).
* Tại đây, bạn có thể thử các API như:
  * Đăng nhập khách hàng thông qua Google: `/api/customers/google-login`
  * Quản lý sản phẩm API.
  * Xem danh sách danh mục sản phẩm phục vụ hiển thị lên giao diện ReactJS.

---

## 10. CẤU TRÚC THƯ MƯ CỰC & QUY CHUẨN ĐÓNG GÓP
```text
TruongCMS.MobileStore/
├── CMS.Backend/            # Dự án chính ASP.NET Core (Controllers, Views, program.cs)
├── CMS.Data/               # Lớp truy cập cơ sở dữ liệu (Entities, DbContext, Migrations)
├── cms.frontend/           # Dự án ReactJS phía khách hàng (src/, public/)
└── TruongCMS.MobileStore.sln
```

### Quy chuẩn đóng góp khi sửa đổi code:
1. Tránh đẩy trực tiếp các tệp build (`bin/`, `obj/`, `node_modules/`, `build/`) lên Git. Luôn cập nhật tệp `.gitignore` tương ứng.
2. Không commit trực tiếp thông tin nhạy cảm (như mật khẩu cá nhân hay token thực tế) lên nhánh `main`. Hãy dùng các biến môi trường hoặc cấu hình cục bộ (`appsettings.Development.json`).
3. Khi tạo tính năng mới, vui lòng tạo nhánh con từ nhánh `main` (ví dụ: `feature/ten-tinh-nang`) rồi tạo Pull Request sau khi kiểm thử thành công.

---
*Chúc các bạn hoàn thành tốt môn học ASP.NET Core với dự án TruongCMS Mobile Store!*
