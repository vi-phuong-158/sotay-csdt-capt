BỘ NÃO DỰ ÁN: HỆ THỐNG TRA CỨU PHÁP LUẬT & NGHIỆP VỤ (GOOGLE SHEETS VERSION)

1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

Tên dự án: Cẩm nang Pháp luật & Nghiệp vụ Điều tra Hình sự.

Mục tiêu: Xây dựng Web App tra cứu nhanh, bảo mật cao cho 300 tài khoản cố định. Quản trị hoàn toàn bằng Google Sheets.

Đặc thù cốt lõi:

Hệ thống ĐÓNG: Bắt buộc đăng nhập. Admin toàn quyền cấp phát bằng cách nhập liệu vào Google Sheets.

Audit Logging (Truy vết): Ghi lại mọi hành động (Đăng nhập, Từ khóa tìm kiếm, Văn bản đã xem) vào một Tab ẩn trên Google Sheets.

Smart Reading: Tối ưu văn bản dài thông qua cấu trúc JSON (Chương/Điều) và Mục lục động.

Fuzzy Search: Tìm kiếm thông minh hỗ trợ tiếng Việt không dấu, sai dấu.

Hybrid Storage: Text/Data lưu tại Google Sheets, File gốc (PDF/Word có dấu đỏ) lưu tại Google Drive (Sử dụng link chia sẻ).

1. TECH STACK (CÔNG NGHỆ BẮT BUỘC)

Frontend: React 18, Vite.

Styling: Tailwind CSS (Mobile-First).

Icons: lucide-react.

Backend/Database: Google Sheets (Thông qua Google Apps Script Web App URL làm API đọc/ghi).

State Management: React Context API & localStorage để duy trì phiên đăng nhập.

1. UI/UX & DESIGN SYSTEM

Màu sắc chính (Công an nhân dân & Pháp luật):

Xanh rêu/Xanh lục đậm: #113a26 (Header/Sidebar).

Xanh Navy Cảnh sát: #1e3a8a (Nút bấm/Chức năng).

Đỏ mận: #991b1b (Cảnh báo/Điểm nhấn).

Vàng sao vàng: #FFD700 (Logo/Icon quan trọng).

Typography: Font chữ không chân (Sans-serif). Nội dung văn bản dùng text-base đến text-lg, leading-relaxed để tối ưu đọc mobile.

1. MANDATORY AI RULES (QUY TẮC BẮT BUỘC CHO AI)

Giao tiếp: Luôn trao đổi với user bằng Tiếng Việt.

Bảo mật: Sử dụng ProtectedRoute cho mọi trang trừ Login. Login logic thực hiện bằng cách fetch dữ liệu sheet users về và so sánh ở client.

Ghi Log (Logging Requirement): Bắt buộc gọi hàm POST data lên sheet activity_logs cho 3 sự kiện: LOGIN, SEARCH (kèm từ khóa), VIEW_DOC (kèm ID văn bản).

Xử lý dữ liệu JSON & File đính kèm: - Render nội dung text dựa trên cấu trúc JSON (Mục lục -> Chương -> Điều).

Nếu văn bản có drive_link, hiển thị nút "📄 Xem bản gốc (PDF)" nổi bật ở đầu trang đọc.

Tối ưu API: Fetch toàn bộ dữ liệu 1 lần lúc đăng nhập và lưu vào Global State để tránh gọi API Google Sheets liên tục gây chậm. Cập nhật ngầm (Background fetch) sau mỗi 5 phút.

1. DATA SCHEMA (GOOGLE SHEETS TABS)

Yêu cầu tạo 1 file Google Sheets gồm 3 Tab (Sheet) sau:

Tab 1: users (Các cột A->E)

username (Mã đăng nhập)

password

full_name (Họ và tên)

unit (Đơn vị công tác)

role (admin/user)

Tab 2: documents (Các cột A->F)

id (Mã duy nhất tự tạo)

title (Tiêu đề luật/hướng dẫn)

issue_number (Số ký hiệu)

category (Luật, Chỉ thị, Hướng dẫn...)

content (Chuỗi JSON stringify cấu trúc Mục lục/Chương/Điều)

drive_link (Link chia sẻ Google Drive)

Tab 3: activity_logs (Các cột A->D)

timestamp (Thời gian tự sinh)

username (Tài khoản thực hiện)

action (LOGIN, SEARCH, VIEW_DOC)

details (Từ khóa hoặc ID văn bản)

1. WORKFLOW & THỨ TỰ XÂY DỰNG (ACTION PLAN)

📍 Phase 1: Khởi tạo & Kết nối API Google Sheets

Setup Vite. Tạo file src/lib/api.js cấu hình hàm fetchData (GET) và postData (POST) trỏ tới URL Apps Script.

Giao diện Đăng nhập màu xanh rêu, nghiêm trang.

📍 Phase 2: Authentication & Phân quyền Admin

Login logic: Lấy dữ liệu tab users, so sánh thông tin.

Giao diện Admin: Liệt kê danh sách tài khoản. Thêm/Sửa/Xóa tài khoản bằng cách gọi API POST/UPDATE lên Sheets.

📍 Phase 3: Module Tra cứu & Fuzzy Search

Tích hợp hàm loại bỏ dấu tiếng Việt để tìm kiếm mờ (lọc từ State Frontend cho nhanh).

Tự động POST log SEARCH + từ khóa lên tab activity_logs.

Hiển thị danh sách Card (Có icon kẹp ghim nếu có drive_link).

📍 Phase 4: Reading Mode (Trái tim của App)

Parse chuỗi JSON từ cột content để dựng màn hình đọc văn bản.

Xây dựng Mục lục nổi (Floating ToC), cuộn mượt đến từng Điều.

Nút mở link PDF trên tab mới. POST log VIEW_DOC.

📍 Phase 5: Giao diện Đăng bài (Dành cho Admin)

Form nhập liệu văn bản mới (Title, Issue Number, Cấu trúc JSON, Link Drive). Lưu dữ liệu đẩy thẳng lên tab documents.

📍 Phase 6: Admin Audit Trail & Kiểm thử UI

Màn hình Admin kéo log từ tab activity_logs về để giám sát 300 user.

Tối ưu UI Mobile, Verification Loop.
