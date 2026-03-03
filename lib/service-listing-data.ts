// lib/servicesData.ts

export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ServiceDetail {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gallery: string[];
  category: string;
  format: string;
  formatIcon: "chat" | "call";
  packages: ServicePackage[];
  reviews: Review[];
}

const imgZodiac = "/services/mystical-zodiac.jpg";
const imgTarot = "/services/mystical-tarot.jpg";
const imgNumerology = "/services/mystical-numerology.jpg";
const imgLove = "/services/mystical-love.jpg";
const imgFortune = "/services/mystical-fortune.jpg";
const imgFengshui = "/services/mystical-fengshui.jpg";

export const servicesData: ServiceDetail[] = [
  {
    id: 1,
    slug: "ai-chat",
    title: "AI Chat Tâm Linh",
    subtitle: "Trò chuyện với trí tuệ nhân tạo về vận mệnh",
    description: "Hệ thống AI được huấn luyện chuyên sâu về tâm linh, tử vi và phong thuỷ. Bạn có thể hỏi bất kỳ câu hỏi nào về cuộc sống, tình yêu, sự nghiệp và nhận được câu trả lời sâu sắc, chính xác dựa trên kiến thức cổ học phương Đông kết hợp công nghệ hiện đại.",
    image: imgFortune,
    gallery: [imgFortune, imgZodiac, imgTarot],
    category: "AI Chat",
    format: "Chatbot AI",
    formatIcon: "chat",
    packages: [
      { id: "ai-free", name: "Miễn phí", price: "0 VNĐ", priceValue: 0, duration: "5 câu hỏi/ngày", features: ["5 câu hỏi mỗi ngày", "Trả lời cơ bản", "Hỗ trợ tiếng Việt"] },
      { id: "ai-pro", name: "Pro", price: "99.000 VNĐ", priceValue: 99000, duration: "30 ngày", features: ["Không giới hạn câu hỏi", "Phân tích chuyên sâu", "Lịch sử trò chuyện", "Ưu tiên hỗ trợ"], popular: true },
      { id: "ai-vip", name: "VIP", price: "249.000 VNĐ", priceValue: 249000, duration: "30 ngày", features: ["Tất cả tính năng Pro", "Tư vấn 1-1 chuyên gia", "Báo cáo PDF hàng tuần", "Dự đoán xu hướng"] },
    ],
    reviews: [
      { id: 1, name: "Minh Anh", avatar: "MA", rating: 5, date: "15/02/2026", comment: "AI trả lời rất chính xác, tôi rất hài lòng với dịch vụ này!" },
      { id: 2, name: "Thuỷ Tiên", avatar: "TT", rating: 4, date: "10/02/2026", comment: "Câu trả lời sâu sắc, giúp tôi hiểu rõ hơn về bản thân mình." },
      { id: 3, name: "Hoàng Nam", avatar: "HN", rating: 5, date: "08/02/2026", comment: "Đáng tiền, AI hiểu tâm lý và cho lời khuyên rất hữu ích." },
    ],
  },
  {
    id: 2,
    slug: "tarot",
    title: "Trải bài Tarot",
    subtitle: "Khám phá thông điệp từ những lá bài huyền bí",
    description: "Trải nghiệm đọc bài Tarot trực tuyến với AI được huấn luyện bởi các chuyên gia Tarot hàng đầu. Mỗi lá bài mang một thông điệp riêng, giúp bạn nhìn rõ quá khứ, hiểu hiện tại và dự đoán tương lai.",
    image: imgTarot,
    gallery: [imgTarot, imgFortune, imgLove],
    category: "Tarot",
    format: "Chatbot AI",
    formatIcon: "chat",
    packages: [
      { id: "tarot-3", name: "3 Lá Bài", price: "50.000 VNĐ", priceValue: 50000, duration: "15 phút", features: ["Trải 3 lá bài cơ bản", "Quá khứ - Hiện tại - Tương lai", "Giải nghĩa chi tiết"] },
      { id: "tarot-celtic", name: "Celtic Cross", price: "120.000 VNĐ", priceValue: 120000, duration: "30 phút", features: ["Trải 10 lá bài Celtic", "Phân tích toàn diện", "Lời khuyên hành động", "Báo cáo PDF"], popular: true },
      { id: "tarot-full", name: "Trọn Gói", price: "200.000 VNĐ", priceValue: 200000, duration: "60 phút", features: ["Kết hợp nhiều trải bài", "Tư vấn chuyên sâu", "Theo dõi 30 ngày", "Chat không giới hạn"] },
    ],
    reviews: [
      { id: 1, name: "Lan Phương", avatar: "LP", rating: 5, date: "12/02/2026", comment: "Bài Tarot rất chính xác, đúng với hoàn cảnh hiện tại của tôi." },
      { id: 2, name: "Đức Minh", avatar: "ĐM", rating: 5, date: "05/02/2026", comment: "Giải nghĩa chi tiết và dễ hiểu, sẽ quay lại!" },
    ],
  },
  {
    id: 3,
    slug: "cung-hoang-dao",
    title: "Cung Hoàng Đạo",
    subtitle: "Phân tích chi tiết 12 cung hoàng đạo",
    description: "Khám phá tính cách, sự nghiệp, tình yêu và tài chính dựa trên cung hoàng đạo của bạn. Phân tích sự tương hợp giữa các cung và dự đoán vận mệnh theo từng giai đoạn.",
    image: imgZodiac,
    gallery: [imgZodiac, imgNumerology, imgFengshui],
    category: "Cung hoàng đạo",
    format: "Chatbot AI",
    formatIcon: "chat",
    packages: [
      { id: "zodiac-basic", name: "Cơ Bản", price: "50.000 VNĐ", priceValue: 50000, duration: "15 phút", features: ["Phân tích tính cách", "Vận hạn tháng này", "Lời khuyên cơ bản"] },
      { id: "zodiac-full", name: "Chi Tiết", price: "120.000 VNĐ", priceValue: 120000, duration: "30 phút", features: ["Phân tích toàn diện", "Tình yêu & Sự nghiệp", "Tương hợp cung đạo", "Dự đoán 3 tháng"], popular: true },
    ],
    reviews: [
      { id: 1, name: "Hải Yến", avatar: "HY", rating: 4, date: "20/02/2026", comment: "Phân tích rất đúng tính cách của tôi, ấn tượng!" },
      { id: 2, name: "Quốc Bảo", avatar: "QB", rating: 5, date: "18/02/2026", comment: "Dự đoán tháng trước chính xác, tin tưởng dịch vụ." },
    ],
  },
  {
    id: 4,
    slug: "la-so-tu-vi",
    title: "Lá số Tử Vi",
    subtitle: "Luận giải lá số tử vi trọn đời",
    description: "Lập và luận giải lá số tử vi dựa trên ngày giờ sinh của bạn. Phân tích 12 cung mệnh, sao chiếu và vận hạn từng năm, giúp bạn hiểu rõ vận mệnh và hướng đi cuộc đời.",
    image: imgNumerology,
    gallery: [imgNumerology, imgZodiac, imgFortune],
    category: "Tử vi",
    format: "Chatbot AI",
    formatIcon: "chat",
    packages: [
      { id: "tuvi-basic", name: "Cơ Bản", price: "100.000 VNĐ", priceValue: 100000, duration: "30 phút", features: ["Lập lá số cơ bản", "Luận giải cung Mệnh", "Vận hạn năm nay"] },
      { id: "tuvi-full", name: "Trọn Đời", price: "300.000 VNĐ", priceValue: 300000, duration: "60 phút", features: ["Lá số chi tiết 12 cung", "Luận giải toàn bộ sao", "Vận hạn 10 năm", "Lời khuyên hướng nghiệp"], popular: true },
      { id: "tuvi-vip", name: "VIP", price: "500.000 VNĐ", priceValue: 500000, duration: "90 phút", features: ["Tất cả tính năng Trọn Đời", "Tư vấn 1-1 chuyên gia", "Cập nhật hàng năm", "Phong thuỷ bổ trợ"] },
    ],
    reviews: [
      { id: 1, name: "Thanh Hà", avatar: "TH", rating: 5, date: "25/02/2026", comment: "Lá số rất chi tiết và chính xác, xứng đáng từng đồng!" },
      { id: 2, name: "Việt Anh", avatar: "VA", rating: 5, date: "22/02/2026", comment: "Chuyên gia phân tích rất tận tâm và chuyên nghiệp." },
      { id: 3, name: "Ngọc Mai", avatar: "NM", rating: 4, date: "19/02/2026", comment: "Giúp tôi hiểu rõ hơn về bản thân, rất hữu ích." },
    ],
  },
  {
    id: 5,
    slug: "tu-vi-hang-ngay",
    title: "Tử vi Hàng ngày",
    subtitle: "Dự đoán vận mệnh mỗi ngày",
    description: "Nhận dự đoán tử vi hàng ngày dựa trên ngày sinh và cung mệnh. Bao gồm vận may, tình yêu, sức khoẻ và công việc cho từng ngày.",
    image: imgFengshui,
    gallery: [imgFengshui, imgZodiac, imgFortune],
    category: "Tử vi",
    format: "Chatbot AI",
    formatIcon: "chat",
    packages: [
      { id: "daily-free", name: "Miễn phí", price: "0 VNĐ", priceValue: 0, duration: "Hàng ngày", features: ["Tử vi ngày cơ bản", "Chỉ số may mắn", "Màu sắc may mắn"] },
      { id: "daily-premium", name: "Premium", price: "49.000 VNĐ", priceValue: 49000, duration: "30 ngày", features: ["Tử vi chi tiết", "5 lĩnh vực cuộc sống", "Lời khuyên hàng ngày", "Thông báo sáng sớm"], popular: true },
    ],
    reviews: [
      { id: 1, name: "Kim Chi", avatar: "KC", rating: 5, date: "01/03/2026", comment: "Đọc mỗi sáng trước khi đi làm, rất hữu ích!" },
      { id: 2, name: "Trung Kiên", avatar: "TK", rating: 4, date: "28/02/2026", comment: "Dự đoán khá chính xác, thích tính năng màu may mắn." },
    ],
  },
  {
    id: 6,
    slug: "boi-tinh-duyen",
    title: "Bói Tình Duyên",
    subtitle: "Khám phá duyên phận và tình yêu đích thực",
    description: "Phân tích sự tương hợp giữa hai người dựa trên ngày sinh, cung mệnh và ngũ hành. Dự đoán tương lai tình cảm và đưa ra lời khuyên để gìn giữ hạnh phúc.",
    image: imgLove,
    gallery: [imgLove, imgTarot, imgZodiac],
    category: "Tình duyên",
    format: "Chatbot AI",
    formatIcon: "chat",
    packages: [
      { id: "love-basic", name: "Cơ Bản", price: "90.000 VNĐ", priceValue: 90000, duration: "20 phút", features: ["Phân tích tương hợp", "Điểm hoà hợp", "Lời khuyên cơ bản"] },
      { id: "love-deep", name: "Chuyên Sâu", price: "180.000 VNĐ", priceValue: 180000, duration: "40 phút", features: ["Phân tích 5 yếu tố", "Ngũ hành tương hợp", "Dự đoán tương lai", "Lời khuyên chi tiết"], popular: true },
    ],
    reviews: [
      { id: 1, name: "Phương Linh", avatar: "PL", rating: 5, date: "14/02/2026", comment: "Bói đúng quá, đúng y chang tình trạng hiện tại!" },
      { id: 2, name: "Tuấn Khải", avatar: "TK", rating: 5, date: "10/02/2026", comment: "Nhờ lời khuyên mà hai vợ chồng hiểu nhau hơn." },
    ],
  },
  {
    id: 7,
    slug: "than-so-hoc",
    title: "Thần Số Học",
    subtitle: "Giải mã cuộc đời qua con số",
    description: "Phân tích biểu đồ thần số học dựa trên ngày tháng năm sinh và tên đầy đủ. Tìm hiểu số chủ đạo, số linh hồn, số biểu đạt và nhiều chỉ số quan trọng khác.",
    image: imgNumerology,
    gallery: [imgNumerology, imgFortune, imgTarot],
    category: "Thần số học",
    format: "Chatbot AI",
    formatIcon: "chat",
    packages: [
      { id: "num-basic", name: "Cơ Bản", price: "70.000 VNĐ", priceValue: 70000, duration: "20 phút", features: ["Số chủ đạo", "Số đường đời", "Tính cách cơ bản"] },
      { id: "num-full", name: "Toàn Diện", price: "150.000 VNĐ", priceValue: 150000, duration: "40 phút", features: ["Biểu đồ đầy đủ", "9 chỉ số quan trọng", "Năm cá nhân", "Báo cáo PDF chi tiết"], popular: true },
      { id: "num-vip", name: "VIP", price: "280.000 VNĐ", priceValue: 280000, duration: "60 phút", features: ["Tất cả tính năng Toàn Diện", "Tư vấn 1-1", "Biểu đồ tương hợp", "Cập nhật hàng năm"] },
    ],
    reviews: [
      { id: 1, name: "Bảo Ngọc", avatar: "BN", rating: 5, date: "27/02/2026", comment: "Phân tích số chủ đạo đúng đến kinh ngạc!" },
      { id: 2, name: "Đình Phong", avatar: "ĐP", rating: 4, date: "24/02/2026", comment: "Báo cáo PDF rất chi tiết và đẹp mắt." },
      { id: 3, name: "Hạnh Dung", avatar: "HD", rating: 5, date: "20/02/2026", comment: "Hiểu thêm nhiều điều về bản thân qua các con số." },
    ],
  },
];