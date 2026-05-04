# Sổ tay Nghiệp vụ CSDT Cấp tỉnh (sotay-csdt-capt)

## 📖 Tổng quan
**Sổ tay Nghiệp vụ CSDT Cấp tỉnh** là một ứng dụng nền tảng web (Web App) được thiết kế chuyên dụng cho cán bộ điều tra. Ứng dụng cung cấp một hệ thống quản lý và tra cứu văn bản pháp luật, quy trình nghiệp vụ và các biểu mẫu tố tụng một cách nhanh chóng, chính xác và tiện lợi ngay trên thiết bị di động hoặc máy tính.

Dự án nhằm mục tiêu số hóa các tài liệu nghiệp vụ, giúp tối ưu hóa thời gian tra cứu và nâng cao hiệu quả trong công tác điều tra, phá án.

## 🛠 Công nghệ sử dụng
Dự án được xây dựng trên nền tảng các công nghệ hiện đại, đảm bảo tốc độ và tính bảo mật:

*   **Frontend**: [React 18](https://reactjs.org/) - Thư viện JavaScript phổ biến để xây dựng giao diện người dùng.
*   **Build Tool**: [Vite](https://vitejs.dev/) - Công cụ build nhanh và tối ưu cho môi trường phát triển.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Framework CSS tiện dụng để thiết kế giao diện hiện đại và phản hồi (responsive).
*   **Icons**: [Lucide React](https://lucide.dev/) - Bộ icon vector sắc nét và đồng bộ.
*   **Backend & Database**: [Google Apps Script (GAS)](https://developers.google.com/apps-script) - Sử dụng làm backend trung gian để kết nối và quản lý dữ liệu trực tiếp trên Google Sheets.
*   **Deployment**: [Vercel](https://vercel.com/) - Nền tảng triển khai ứng dụng web mạnh mẽ.

## ✨ Tính năng cốt lõi
1.  **Trang chủ (Dashboard)**: Tổng hợp các danh mục văn bản, thông báo mới và các phím tắt truy cập nhanh.
2.  **Tra cứu nâng cao (Search)**: Bộ lọc tìm kiếm thông minh theo từ khóa, loại văn bản, chương, điều hoặc nội dung cụ thể.
3.  **Trình đọc văn bản (Reader)**: Giao diện đọc tài liệu được tối ưu hóa, hỗ trợ chế độ đọc tập trung và điều chỉnh cỡ chữ.
4.  **Quản trị nội dung (Admin Panel)**: Giao diện dành cho người quản lý để cập nhật, chỉnh sửa nội dung văn bản và cấu hình hệ thống.
5.  **Chế độ Offline/Demo**: Cho phép ứng dụng hoạt động với dữ liệu mẫu (mock data) khi không có kết nối internet hoặc chưa cấu hình backend.
6.  **Đồng bộ dữ liệu**: Kết nối trực tiếp với Google Sheets thông qua Apps Script để cập nhật dữ liệu thời gian thực.

## 📂 Cấu trúc thư mục
```text
sotay-csdt-capt/
├── google-apps-script/     # Mã nguồn backend chạy trên Google Apps Script
├── public/                 # Các tài nguyên tĩnh (logo, images, favicon)
├── src/
│   ├── components/         # Các thành phần giao diện dùng chung (Button, Header, Card...)
│   ├── context/            # Quản lý trạng thái ứng dụng (AuthContext, ThemeContext...)
│   ├── data/               # Chứa dữ liệu mẫu (mockData.js) phục vụ chế độ demo
│   ├── hooks/              # Các custom hooks xử lý logic
│   ├── pages/              # Các trang chính (HomePage, SearchPage, ReaderPage, Admin...)
│   ├── lib/                # Cấu hình thư viện bên thứ ba (utils, constants)
│   ├── App.jsx             # File điều hướng và cấu hình chính của React
│   ├── main.jsx            # Điểm đầu vào (entry point) của ứng dụng
│   └── index.css           # Cấu hình Tailwind và styles chung
├── .env.example            # Mẫu file cấu hình biến môi trường
├── tailwind.config.js      # Cấu hình Tailwind CSS
├── vite.config.js          # Cấu hình công cụ build Vite
└── vercel.json             # Cấu hình triển khai trên Vercel
```

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
*   Node.js (phiên bản 18 trở lên)
*   npm hoặc yarn

### 2. Các bước cài đặt
1.  **Clone repository**:
    ```bash
    git clone https://github.com/your-username/sotay-csdt-capt.git
    cd sotay-csdt-capt
    ```

2.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```

3.  **Cấu hình biến môi trường**:
    *   Sao chép file `.env.example` thành `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Mở file `.env` và điền các thông tin cần thiết:
        *   `VITE_APPS_SCRIPT_URL`: URL web app sau khi triển khai Google Apps Script.
        *   `VITE_DEMO_MODE`: Đặt thành `true` nếu muốn chạy với dữ liệu mẫu, hoặc `false` để kết nối thật.

4.  **Chạy ứng dụng ở chế độ phát triển**:
    ```bash
    npm run dev
    ```
    Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

5.  **Build ứng dụng cho production**:
    ```bash
    npm run build
    ```

---
*Dự án được phát triển nhằm hỗ trợ lực lượng CSDT. Mọi ý kiến đóng góp xin vui lòng liên hệ ban quản trị.*
