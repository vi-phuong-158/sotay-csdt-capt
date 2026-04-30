# Mô tả dự án: Cẩm nang Pháp luật & Nghiệp vụ Điều tra

## 1. Tổng quan dự án

**Cẩm nang Pháp luật & Nghiệp vụ Điều tra** là hệ thống web nội bộ phục vụ tra cứu văn bản pháp luật, hướng dẫn nghiệp vụ và tài liệu liên quan đến công tác điều tra. Dự án hướng tới mô hình sử dụng khép kín, có đăng nhập, có phân quyền quản trị và có khả năng theo dõi nhật ký hoạt động của người dùng.

Hệ thống được thiết kế để quản trị dữ liệu thông qua Google Sheets và Google Drive, giúp triển khai nhanh, dễ cập nhật nội dung, không cần vận hành máy chủ cơ sở dữ liệu riêng. Người dùng có thể đăng nhập, tìm kiếm văn bản, xem tài liệu đính kèm; tài khoản quản trị có thể quản lý tài khoản, văn bản và theo dõi nhật ký hoạt động.

## 2. Công nghệ triển khai

### Frontend

- **React 18**: Xây dựng giao diện người dùng dạng single-page application.
- **Vite**: Công cụ build và dev server cho frontend.
- **Tailwind CSS**: Xây dựng giao diện responsive, tối ưu cho cả desktop và thiết bị di động.
- **React Context API**: Quản lý trạng thái đăng nhập, dữ liệu văn bản, nhật ký, tài khoản và thông báo trong ứng dụng.
- **localStorage**: Lưu phiên đăng nhập cục bộ gồm thông tin user và token.

### Backend

- **Google Apps Script Web App**: Đóng vai trò API trung gian cho frontend.
- Backend xử lý các tác vụ:
  - Đăng nhập.
  - Xác thực token.
  - Đọc dữ liệu văn bản và nhật ký.
  - Quản lý tài khoản qua quyền admin.
  - Ghi nhật ký hoạt động.
  - Upload file lên Google Drive.

### Database và lưu trữ

- **Google Sheets**: Được sử dụng như database chính.
  - Sheet `users`: Lưu tài khoản, mật khẩu, họ tên, đơn vị, vai trò và thời điểm đăng nhập cuối.
  - Sheet `documents`: Lưu thông tin văn bản, số hiệu, ngày ban hành, cơ quan ban hành, chuyên mục, tóm tắt và link file.
  - Sheet `activity_logs`: Lưu nhật ký đăng nhập, tìm kiếm và xem văn bản.
- **Google Drive**: Lưu file tài liệu đính kèm như PDF hoặc hình ảnh.
  - File upload được lưu trực tiếp vào thư mục Drive cấu hình sẵn.
  - File được chia sẻ bằng chế độ có link để frontend có thể mở/xem.

### Công nghệ AI

- **Google NotebookLM**: Công cụ AI phục vụ tra cứu thông minh.
  - Tận dụng khả năng tóm tắt và trả lời câu hỏi dựa trên kho dữ liệu văn bản pháp luật riêng biệt.
  - Được tích hợp dưới dạng một chuyên mục hỗ trợ người dùng giải đáp các thắc mắc nghiệp vụ phức tạp bằng ngôn ngữ tự nhiên.


## 3. Các tính năng chính

### Đăng nhập và phân quyền

- Người dùng phải đăng nhập trước khi sử dụng hệ thống.
- Tài khoản có vai trò `admin` được truy cập trang quản trị.
- Tài khoản thường chỉ sử dụng chức năng tra cứu và xem tài liệu.
- Phiên đăng nhập được duy trì bằng token lưu trong `localStorage`.

### Tra cứu văn bản

- Tìm kiếm văn bản theo:
  - Tiêu đề.
  - Số hiệu văn bản.
  - Cơ quan ban hành.
  - Nội dung tóm tắt.
- Hỗ trợ tìm kiếm tiếng Việt không dấu.
- Có bộ lọc theo chuyên mục và cơ quan ban hành.
- Có thể ghim/lưu văn bản quan tâm ở phía frontend.

### Xem văn bản và file đính kèm

- Hiển thị thông tin chi tiết của văn bản.
- Hỗ trợ mở file đính kèm từ Google Drive.
- File PDF có thể xem dạng nhúng.
- File hình ảnh có thể hiển thị trực tiếp trong giao diện đọc.

### Quản trị tài khoản

- Admin có thể xem danh sách tài khoản từ Google Sheets.
- Hỗ trợ tìm kiếm tài khoản theo:
  - Username.
  - Họ tên.
  - Đơn vị.
  - Vai trò.
- Admin có thể cấp tài khoản mới.
- Admin có thể reset mật khẩu tài khoản.
- Admin có thể xóa tài khoản không phải tài khoản hiện tại.

### Quản trị văn bản

- Admin có thể thêm văn bản mới.
- Admin có thể tải file đính kèm lên Google Drive.
- Admin có thể xem nhanh văn bản từ khu vực quản trị.
- Admin có thể xóa văn bản khỏi danh sách quản lý.

### Nhật ký hoạt động

- Hệ thống ghi nhận các hành động quan trọng:
  - `LOGIN`: Đăng nhập.
  - `SEARCH`: Tìm kiếm.
  - `VIEW_DOC`: Xem văn bản.
- Admin có thể xem nhật ký trong trang quản trị.
- Nhật ký được sắp xếp từ mới nhất đến cũ nhất.
- Nhật ký có phân trang để tránh render quá nhiều dữ liệu cùng lúc.
- Nhật ký được bổ sung thông tin người dùng từ danh sách tài khoản nếu dữ liệu log chỉ có username.

### Đổi mật khẩu

- Người dùng có thể đổi mật khẩu cá nhân.
- Backend xác thực mật khẩu cũ trước khi cập nhật mật khẩu mới.

### Sổ tay AI

- Cung cấp giao diện truy cập nhanh vào trợ lý AI (Google NotebookLM).
- AI được huấn luyện dựa trên toàn bộ các văn bản pháp luật và hướng dẫn nghiệp vụ có trong hệ thống.
- Hỗ trợ người dùng:
  - Tóm tắt các văn bản dài.
  - Trả lời các tình huống nghiệp vụ dựa trên quy định pháp luật hiện hành.
  - Tìm kiếm thông tin theo ngữ nghĩa thay vì chỉ tìm theo từ khóa chính xác.


## 4. Các giải pháp bảo mật đã triển khai

### Bắt buộc đăng nhập

- Ứng dụng chỉ hiển thị giao diện chính sau khi người dùng đăng nhập thành công.
- Thông tin phiên được lưu ở frontend để duy trì trạng thái sử dụng.

### Token phiên đăng nhập

- Sau khi đăng nhập, backend cấp token cho người dùng.
- Token chứa username, timestamp và khóa bí mật nội bộ.
- Backend kiểm tra token trước các thao tác cần quyền như quản lý tài khoản, đổi mật khẩu, upload file và ghi dữ liệu.
- Token có giới hạn thời gian sử dụng.

### Chặn truy cập trực tiếp sheet tài khoản

- API GET không cho đọc trực tiếp sheet `users`.
- Danh sách tài khoản chỉ được lấy qua endpoint POST `admin_get_users` kèm token hợp lệ.

### Phân quyền admin

- Trang quản trị chỉ hiển thị với tài khoản có `role = admin`.
- Các thao tác quản lý tài khoản và dữ liệu quan trọng yêu cầu token.

### Ẩn mật khẩu khi trả danh sách tài khoản

- Endpoint `admin_get_users` loại bỏ trường `password` trước khi trả dữ liệu về frontend.

### Ghi nhật ký hoạt động

- Các hành động quan trọng được ghi vào sheet `activity_logs`.
- Nhật ký giúp admin giám sát việc đăng nhập, tìm kiếm và xem văn bản.

### Kiểm tra file upload

- Frontend kiểm tra định dạng file trước khi upload.
- Chỉ cho phép PDF và hình ảnh hợp lệ.
- Có giới hạn kích thước file để giảm rủi ro upload dữ liệu quá lớn.

### Lưu file trong thư mục Drive chỉ định

- File upload không lưu rải rác ở Drive gốc.
- Backend lưu file vào thư mục Google Drive đã cấu hình bằng `UPLOAD_FOLDER_ID`.
- Việc ghi file phụ thuộc quyền của tài khoản triển khai Apps Script đối với thư mục đó.

### Bảo mật dữ liệu AI

- Tính năng AI sử dụng dữ liệu được nạp vào NotebookLM theo quy trình kiểm soát nội bộ.
- Truy cập vào Sổ tay AI yêu cầu tài khoản Google và chỉ giới hạn cho những người được cấp quyền truy cập vào notebook tương ứng.


## 5. Ghi chú vận hành

- Khi thay đổi `google-apps-script/Code.gs`, cần deploy lại Google Apps Script Web App bằng phiên bản mới.
- Khi thay đổi biến môi trường frontend, cần build/deploy lại frontend.
- Nếu token cũ không còn hợp lệ, người dùng cần đăng xuất, xóa phiên cũ hoặc đăng nhập lại.
- Tài khoản triển khai Apps Script cần có quyền đọc/ghi Google Sheets và quyền ghi vào thư mục Google Drive lưu tài liệu.
