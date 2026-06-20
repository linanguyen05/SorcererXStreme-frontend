# Tài liệu Tích hợp API mới dành cho Frontend (FE)

Tài liệu này tổng hợp toàn bộ các thay đổi về API liên quan đến **Upload Avatar** và **Hồ sơ Chuyên gia (Expert Profile)** mới được triển khai ở Backend.

---

## 1. Cấu hình Chung (Headers & Authentication)

Mọi endpoint dưới đây (ngoại trừ Health Check) đều yêu cầu đính kèm JWT Token của AWS Cognito trong Header:
*   **Header Key:** `Authorization`
*   **Header Value:** `Bearer <Cognito_Access_Token>`

---

## 2. Danh sách Endpoints Chi tiết

### 2.1. Tải lên Ảnh Đại diện (Upload Avatar)
Endpoint này xử lý việc tải ảnh trực tiếp lên Cloudinary từ Serverless Backend và tự động đồng bộ hóa lưu URL ảnh vào trường `avatar` trong bảng `User` của Database.

*   **HTTP Method:** `POST`
*   **Path:** `/api/users/avatar`
*   **Content-Type:** `multipart/form-data`
*   **Request Body:**
    *   **Field Key:** `avatar` (Kiểu dữ liệu: `File`)
    *   *Lưu ý:* Bắt buộc tên Key phải là `avatar`. Nếu đặt tên khác hoặc để trống Key, API sẽ trả về lỗi `400 Bad Request` ("Field name missing").

#### Response Thành công (200 OK):
```json
{
  "message": "Avatar uploaded and updated successfully",
  "avatarUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v12345678/avatars/xxxx.jpg",
  "user": {
    "id": "uuid-cua-user-1234",
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "gender": "male",
    "avatar": "https://res.cloudinary.com/your-cloud-name/image/upload/v12345678/avatars/xxxx.jpg",
    "is_vip": false,
    "birth_date": "1995-10-27T00:00:00.000Z",
    "birth_time": "10:00",
    "birth_place": "Hanoi"
  }
}
```

---

### 2.2. Lấy thông tin Hồ sơ Chuyên gia (Get Expert Profile)
API dùng để lấy chi tiết hồ sơ chuyên gia của chính người dùng đang đăng nhập.

*   **HTTP Method:** `GET`
*   **Path:** `/api/experts/:expertId/profile`
    *   *Tham số `:expertId`:* Cần truyền chính xác ID của tài khoản đang đăng nhập (trùng khớp với trường `sub` trong Token).
*   **Yêu cầu phân quyền:** Tài khoản thực hiện request phải có vai trò `role` là `expert` trong Database (nếu không sẽ trả về `403 Forbidden`).

#### Response Thành công (200 OK):
```json
{
  "message": "Expert profile fetched successfully",
  "expert": {
    "id": "uuid-cua-user-1234",
    "bio": "Chào mọi người, tôi là chuyên gia Tarot...",
    "experience_years": 5,
    "specialty": "Tarot",
    "status": "PENDING",
    "media_channels": {
      "facebook": "https://facebook.com/chuyengia.tarot",
      "youtube": "https://youtube.com/c/tarotchannel"
    },
    "created_at": "2026-06-20T04:12:00.000Z",
    "updated_at": "2026-06-20T05:10:00.000Z",
    "user": {
      "id": "uuid-cua-user-1234",
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "gender": "male",
      "avatar": "https://res.cloudinary.com/your-cloud-name/image/upload/v12345678/avatars/xxxx.jpg",
      "role": "expert"
    }
  }
}
```

---

### 2.3. Cập nhật Hồ sơ Chuyên gia (Update Expert Profile)
API này dùng để cập nhật hoặc khởi tạo thông tin chuyên sâu của Chuyên gia. 

*   **Đặc điểm quan trọng:** **Không** truyền trường `avatar` trong body của API này vì avatar đã được quản lý và cập nhật riêng bởi endpoint `/api/users/avatar`.
*   **HTTP Method:** `PATCH`
*   **Path:** `/api/experts/:expertId/profile`
    *   *Tham số `:expertId`:* Phải trùng với ID tài khoản đang thực hiện request.
*   **Content-Type:** `application/json`
*   **Request Body (JSON):**
    ```json
    {
      "bio": "Chào mọi người, tôi là chuyên gia Tarot...",
      "experience_years": 5,
      "specialty": "TAROT",
      "media_channels": {
        "facebook": "https://facebook.com/chuyengia.tarot",
        "youtube": "https://youtube.com/c/tarotchannel",
        "tiktok": "https://tiktok.com/@chuyengiatarot"
      }
    }
    ```
    *   **Trường `specialty`:** Chấp nhận các giá trị định dạng sau: `"TAROT"`, `"ASTROLOGY"`, `"NUMEROLOGY"`, `"HOROSCOPE"` (Backend sẽ tự động chuẩn hóa chữ hoa/thường về dạng chuẩn để lưu vào DB).
    *   **Trường `media_channels`:** Nhận dữ liệu dưới dạng **Key-Value JSON** (đối tượng). Client tự định nghĩa tên mạng xã hội làm Key (facebook, youtube, website, v.v.) và link URL làm Value. Mọi Value truyền lên phải là URL hợp lệ.

#### Response Thành công (200 OK):
Trả về thông tin Expert sau khi cập nhật thành công (cấu trúc tương tự như API Get Profile).

---

## 3. Mã lỗi Thường gặp cần xử lý ở FE

*   **`400 Bad Request`:**
    *   **Trường hợp 1 (Lỗi upload file):** Trả về khi gửi thiếu trường `avatar` trong request body của API upload, hoặc cấu hình sai key.
    *   **Trường hợp 2 (Lỗi Zod Validation):** Gửi sai kiểu dữ liệu (ví dụ: `experience_years` là số âm, `media_channels` chứa link không hợp lệ, hoặc `bio` ngắn hơn 10 ký tự).
*   **`401 Unauthorized`:** Token không được gửi kèm ở header, hết hạn hoặc không hợp lệ.
*   **`403 Forbidden`:**
    *   **Trường hợp 1:** Cố tình truy cập/sửa hồ sơ của Chuyên gia khác (`expertId` trên URL khác với `id` trong token).
    *   **Trường hợp 2:** Tài khoản gọi API `GET /api/experts/:expertId/profile` không phải là tài khoản có role `expert` trong Database.
