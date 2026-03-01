# 📝 CHANGES — SorcererXStreme Frontend

> **Branch / PR Context:** Mô tả các thay đổi thực hiện trong phiên làm việc ngày 28/02/2026 liên quan đến trang **Services (Chuyên Gia Huyền Học)** và trang **Chi Tiết Chuyên Gia**.

---

## 📁 Danh sách file thay đổi

### 1. `lib/services-data.ts`
**Loại thay đổi:** Thêm interface mới + dữ liệu mới + mở rộng dữ liệu hiện có

**Chi tiết:**
- **Thêm `SocialLinks` interface** — Định nghĩa các liên kết mạng xã hội cho mỗi chuyên gia:
  ```ts
  export interface SocialLinks {
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    instagram?: string;
    threads?: string;   // Thay thế zalo
  }
  ```
- **Thêm trường vào `Expert` interface:** `social?: SocialLinks` và `location?: string`
- **Thêm 5 chuyên gia mới:**
  - `thay-kim-long` — Phong Thủy & Tử Vi (Hà Nội, 20 năm KN)
  - `co-huong-giang` — Tarot & Chiêm Tinh Phương Tây (TP.HCM, 9 năm KN)
  - `thay-dao-quang` — Tử Vi & Kinh Dịch (Huế, 18 năm KN)
  - `co-bich-tram` — Oracle Cards & Năng Lượng Chữa Lành (TP.HCM, 7 năm KN)
  - `thay-an-nhien` — Thiền Định & Tâm Lý Học Tâm Linh (Đà Lạt, 11 năm KN)
- **Xóa `zalo`, thay bằng `threads`** trong toàn bộ dữ liệu social
- **Mở rộng `testimonials`** từ 3 → **8 reviews** cho tất cả 8 chuyên gia (đánh giá đa dạng hơn: 4–5 sao, nhiều gói dịch vụ, nhiều thời gian khác nhau)

---

### 2. `app/services/page.tsx`
**Loại thay đổi:** Viết lại hoàn toàn (full rewrite)

**Chi tiết:**
- **Layout 3 cột responsive:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **`ExpertTile` component:** Ô vuông 3:4 với background image, avatar hover shift, specialty pills khi hover, giá từ
- **`ExpertPopup` component (hover popup):** Xuất hiện khi hover vào tile, không cần click
  - **Header cố định:** Avatar + tên + rating + location + online status + specialty pills
  - **Body scrollable (max 320px):** Bio → Stats (KN/Buổi/Gói) → Danh sách gói → Social links
  - **CTA sticky bottom:** Giá từ + nút "Xem & Đặt lịch"
  - Popup tự điều chỉnh trái/phải, tránh overflow viewport
- **`TikTokIcon` và `ThreadsIcon`** — SVG tùy chỉnh (Lucide không có hai icon này)
- **`SocialRow` component:** Hiển thị mạng xã hội dạng pill với icon + label (Facebook, YouTube, Instagram, TikTok, Threads)
- **Thanh lọc (filter bar):** Lọc theo chuyên môn (Tarot, Chiêm Tinh, Tử Vi, ...)
- **Ô tìm kiếm:** Tìm theo tên, lĩnh vực, tỉnh thành
- **Màu sắc:** Nền `#07070c` / `#111118`, accent vàng `yellow-400`, contrast text cao

---

### 3. `components/services/ExpertDetailClient.tsx`
**Loại thay đổi:** Sửa đổi component `TestimonialsSection`

**Chi tiết:**
- **Thêm `RatingSummary` component:**
  - Hiển thị điểm trung bình lớn (vd: 4.7)
  - Thanh bar chart phân phối sao 5→1 (gradient vàng)
- **Viết lại `TestimonialsSection` từ carousel → paginated list:**
  - Hiển thị **5 reviews/trang**
  - Mỗi review card: avatar emoji, tên, số sao, badge gói dịch vụ (pill vàng), ngày, nội dung đầy đủ
  - Phân trang: nút **Trước / Sau** + dot indicator (dot hiện tại có màu vàng)
  - Animation chuyển trang mượt (framer-motion)
- Xóa import `Quote` (không còn dùng), giữ nguyên các import khác

---

### 4. `app/checkout/page.tsx`
**Loại thay đổi:** Dọn dẹp nhỏ (cleanup)

**Chi tiết:**
- Xóa hàm `formatDate` không còn được sử dụng
- Xóa logic `updateQuantity` thừa sau khi trường "số lượng" được thay bằng chọn lịch
- Sửa tính toán `totalAllServices` không dùng quantity nữa

---

## 🔍 Lưu ý khi merge / review

> ⚠️ **`lib/services-data.ts`** là file có nhiều thay đổi nhất (interface, expert mới, testimonials mở rộng). Nếu có conflict tại file này, ưu tiên giữ lại:
> - `SocialLinks` interface với trường `threads` (không phải `zalo`)
> - Trường `social` và `location` trong `Expert` interface
> - 5 chuyên gia mới (id: `thay-kim-long`, `co-huong-giang`, `thay-dao-quang`, `co-bich-tram`, `thay-an-nhien`)

> ⚠️ **`app/services/page.tsx`** đã được viết lại hoàn toàn — nếu có conflict, toàn bộ nội dung file mới cần được giữ nguyên.

> ✅ **`components/services/ExpertDetailClient.tsx`** — Chỉ thay đổi hai function đầu file (`TestimonialsSection` và thêm `RatingSummary`). Phần còn lại không đổi.

---

## 🚀 Tính năng đã hoàn thiện

| Tính năng | Trạng thái |
|-----------|-----------|
| Trang Services — Grid 3 cột | ✅ Done |
| Hover popup chi tiết chuyên gia | ✅ Done |
| Social links (Facebook/YouTube/Instagram/TikTok/Threads) | ✅ Done |
| Thêm 5 chuyên gia mới | ✅ Done |
| Trang Chi Tiết — Chọn lịch tư vấn (DatePicker) | ✅ Done |
| Trang Chi Tiết — Gói dịch vụ (Package Cards) | ✅ Done |
| Trang Chi Tiết — Phản hồi khách hàng (Paginated List) | ✅ Done |
| Trang Chi Tiết — Rating Summary Bar | ✅ Done |
| Trang Checkout — Form thông tin cá nhân | ✅ Done |
| Màu sắc & UI cải thiện | ✅ Done |

---

*Generated: 2026-02-28 | Session: SorcererXStreme Services Feature Development*
