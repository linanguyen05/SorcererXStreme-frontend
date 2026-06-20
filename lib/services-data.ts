// ============================================================
// EXPERT READER DATA — HuyenHocAI
// Each expert offers 1:1 consultation sessions across multiple domains
// ============================================================

export type ExpertSpecialty =
    | 'Tarot'
    | 'Chiêm Tinh'
    | 'Tử Vi'
    | 'Thần Số Học'
    | 'Phong Thủy'
    | 'Bói Bài'
    | 'Năng Lượng'
    | 'Tâm Linh';

export interface ServicePackage {
    id: string;
    name: string;
    duration: string;   // e.g. "30 phút"
    price: number;      // VND (giá hiện tại / sau sale)
    originalPrice?: number; // giá gốc (nếu đang sale)
    description: string;
    includes: string[];
    highlight?: boolean;
}

export interface Testimonial {
    id: string;
    authorName: string;
    authorAvatar: string;  // emoji or image url
    rating: number;        // 1-5
    content: string;
    date: string;
    service: string;
}

export interface SocialLinks {
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    instagram?: string;
    threads?: string;
}

export interface Expert {
    id: string;
    name: string;
    title: string;           // e.g. "Chuyên gia Tarot & Chiêm Tinh"
    specialties: ExpertSpecialty[];
    avatar: string;          // image URL
    coverImage: string;      // hero image URL
    gallery: string[];       // additional images
    experience: string;      // e.g. "10 năm"
    sessionsCompleted: number;
    rating: number;          // 4.0-5.0
    reviewCount: number;
    bio: string;             // short description
    about: string;           // long description (multiple sentences)
    packages: ServicePackage[];
    testimonials: Testimonial[];
    badges: string[];        // e.g. ["Top Rated", "Bestseller"]
    availableOnline: boolean;
    location?: string;       // e.g. "Hà Nội"
    social?: SocialLinks;    // mạng xã hội
    isPremium?: boolean;     // khung vàng đặc biệt cho thầy uy tín cao
}

// MOCK DATA (Expert id)

export const experts: Expert[] = [
    {
        id: '1',
        name: 'Master Trí Đức',
        title: 'Chuyên gia Tử Vi & Phong Thủy',
        specialties: ['Tử Vi', 'Phong Thủy', 'Chiêm Tinh'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
        ],
        experience: '15 năm',
        sessionsCompleted: 2847,
        rating: 4.9,
        reviewCount: 512,
        badges: ['Top Rated', 'Bestseller'],
        availableOnline: true,
        location: 'Hà Nội',
        isPremium: true,
        social: {
            facebook: 'https://facebook.com',
            youtube: 'https://youtube.com',
            threads: 'https://threads.net',
        },
        bio: 'Với 15 năm kinh nghiệm, Master Trí Đức đã tư vấn cho hàng nghìn khách hàng về vận mệnh, sự nghiệp và tình duyên.',
        about: 'Master Trí Đức là nhà nghiên cứu huyền học uy tín với hơn 15 năm kinh nghiệm trong lĩnh vực Tử Vi Đẩu Số và Phong Thủy Bát Trạch. Ông từng tu học tại các trường phái Tử Vi truyền thống ở Huế và Hà Nội, đồng thời tích hợp kiến thức Chiêm Tinh Tây phương hiện đại vào phương pháp tư vấn của mình.',
        packages: [
            {
                id: 'basic-30',
                name: 'Tư Vấn Cơ Bản',
                duration: '30 phút',
                price: 250000,
                description: 'Phù hợp cho những câu hỏi cụ thể, nhanh chóng và rõ ràng.',
                includes: ['Luận giải 1 chủ đề cụ thể', 'Phân tích lá số cơ bản', 'Gửi tóm tắt sau buổi xem', 'Hỗ trợ qua chat 3 ngày'],
            },
            {
                id: 'advanced-60',
                name: 'Tư Vấn Chuyên Sâu',
                duration: '60 phút',
                price: 450000,
                originalPrice: 600000,
                description: 'Phân tích toàn diện vận mệnh, phù hợp cho những quyết định quan trọng.',
                includes: ['Luận giải 3 chủ đề tự chọn', 'Phân tích lá số toàn diện', 'Báo cáo chi tiết PDF', 'Hỗ trợ qua chat 7 ngày'],
                highlight: true,
            },
            {
                id: 'premium-90',
                name: 'Gói VIP Trọn Gói',
                duration: '90 phút',
                price: 750000,
                description: 'Trải nghiệm tư vấn cao cấp nhất, đầy đủ nhất với Master.',
                includes: ['Luận giải không giới hạn', 'Phân tích lá số trọn đời', 'Báo cáo PDF + Video recording', 'Hỗ trợ ưu tiên 30 ngày'],
            },
        ],
        testimonials: [
            { id: 't1', authorName: 'Nguyễn Minh Anh', authorAvatar: '👩', rating: 5, content: 'Master Trí Đức xem rất chính xác! Ông dự đoán tôi sẽ chuyển công việc trong 3 tháng tới và đúng thật. Cảm ơn thầy rất nhiều!', date: '2 tuần trước', service: 'Tư Vấn Chuyên Sâu' },
            { id: 't2', authorName: 'Trần Quốc Bảo', authorAvatar: '👨', rating: 5, content: 'Lần đầu tiên xem tử vi mà tôi cảm thấy thực sự được lắng nghe. Rất đáng tiền! Thầy không nói chung chung mà đi vào rất cụ thể.', date: '1 tháng trước', service: 'Gói VIP Trọn Gói' },
            { id: 't3', authorName: 'Lê Thị Hương', authorAvatar: '👩', rating: 5, content: 'Master Trí Đức có kiến thức cực kỳ sâu rộng. Tôi đã book lần thứ 3 rồi và mỗi lần đều nhận được thông tin mới hữu ích.', date: '3 tuần trước', service: 'Gói VIP Trọn Gói' },
            { id: 't3b', authorName: 'Phạm Văn An', authorAvatar: '👨', rating: 5, content: 'Thầy phân tích lá số tử vi cực kỳ chi tiết. Từng cung được thầy giải thích tường tận, tôi hiểu bản thân mình hơn rất nhiều sau buổi xem.', date: '5 ngày trước', service: 'Tư Vấn Chuyên Sâu' },
            { id: 't3c', authorName: 'Vũ Thị Thanh Hà', authorAvatar: '👩', rating: 5, content: 'Tôi đã tham khảo nhiều thầy cô nhưng Master Trí Đức là người cho tôi cảm giác tin tưởng nhất. Kiến thức uyên bác và thái độ tận tâm.', date: '10 ngày trước', service: 'Tư Vấn Cơ Bản' },
            { id: 't3d', authorName: 'Đinh Công Minh', authorAvatar: '👨', rating: 4, content: 'Buổi xem rất hữu ích và thực tế. Thầy đưa ra lời khuyên về hướng phát triển sự nghiệp rất phù hợp với tình huống của tôi.', date: '3 tháng trước', service: 'Tư Vấn Chuyên Sâu' },
            { id: 't3e', authorName: 'Ngọc Hân', authorAvatar: '👩', rating: 5, content: 'Phong thủy được phân tích rất kỹ lưỡng. Tôi áp dụng theo và nhà cửa thực sự không khí khác hẳn. Highly recommend!', date: '6 tuần trước', service: 'Gói VIP Trọn Gói' },
            { id: 't3f', authorName: 'Bùi Tiến Dũng', authorAvatar: '👨', rating: 5, content: 'Báo cáo PDF sau buổi xem rất đầy đủ và chuyên nghiệp. Tôi đọc đi đọc lại nhiều lần vẫn tìm ra thông tin mới.', date: '2 tháng trước', service: 'Tư Vấn Chuyên Sâu' },
        ],
    },

    {
        id: '2',
        name: 'Master Minh Thiện',
        title: 'Chuyên gia Tarot & Năng Lượng',
        specialties: ['Tarot', 'Năng Lượng', 'Tâm Linh'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800&h=600&fit=crop',
        ],
        experience: '8 năm',
        sessionsCompleted: 1563,
        rating: 4.8,
        reviewCount: 341,
        badges: ['Top Rated'],
        availableOnline: true,
        location: 'TP. Hồ Chí Minh',
        social: {
            facebook: 'https://facebook.com',
            tiktok: 'https://tiktok.com',
            instagram: 'https://instagram.com',
            threads: 'https://threads.net',
        },
        bio: 'Master Minh Thiện chuyên về Tarot và năng lượng chữa lành, giúp khách hàng vượt qua khủng hoảng tinh thần.',
        about: 'Master Minh Thiện là chuyên gia Tarot được đào tạo bài bản tại trường Tarot Academy London và tu tập thiền định Vipassana tại Thái Lan. Anh sử dụng bộ bài Rider-Waite-Smith cùng các kỹ thuật đọc bài hiện đại kết hợp với Thiền định Năng lượng.',
        packages: [
            { id: 'tarot-single', name: 'Trải Bài Đơn', duration: '30 phút', price: 200000, description: 'Trải bài cho một câu hỏi cụ thể.', includes: ['Trải bài Celtic Cross', 'Giải thích chi tiết', 'Ảnh kết quả buổi xem'] },
            { id: 'tarot-deep', name: 'Tarot Chuyên Sâu', duration: '60 phút', price: 380000, description: 'Phân tích nhiều khía cạnh cuộc sống.', includes: ['Trải bài đa chủ đề', 'Tích hợp phân tích năng lượng', 'Hỗ trợ chat 5 ngày'], highlight: true },
            { id: 'healing-session', name: 'Chữa Lành Năng Lượng', duration: '90 phút', price: 650000, description: 'Kết hợp Tarot, thiền định và chữa lành năng lượng.', includes: ['Phiên Tarot toàn diện', 'Thiền định có hướng dẫn', 'Chakra balancing', 'Follow-up call sau 2 tuần'] },
        ],
        testimonials: [
            { id: 't4', authorName: 'Phạm Thu Hà', authorAvatar: '👩', rating: 5, content: 'Sau buổi xem với Minh Thiện, tôi cảm thấy nhẹ nhõm hẳn. Năng lượng trong người trở nên thông suốt hơn rất nhiều. Rất trân trọng!', date: '5 ngày trước', service: 'Chữa Lành Năng Lượng' },
            { id: 't5', authorName: 'Hoàng Văn Tùng', authorAvatar: '👨', rating: 5, content: 'Kết quả bài đúng đến 90%. Lời khuyên rất thực tế và có chiều sâu. Thầy không nói những thứ chung chung mà đi vào từng vấn đề cụ thể.', date: '2 tuần trước', service: 'Tarot Chuyên Sâu' },
            { id: 't6', authorName: 'Vũ Ngọc Linh', authorAvatar: '👩', rating: 5, content: 'Buổi xem 90 phút xứng đáng từng đồng. Cảm giác được chữa lành thực sự, không phải trải nghiệm gì đó huyền bí mà rất thực tế. Highly recommended!', date: '1 tháng trước', service: 'Chữa Lành Năng Lượng' },
            { id: 't6b', authorName: 'Chu Thị Lan Anh', authorAvatar: '👩', rating: 5, content: 'Minh Thiện đọc bài Tarot cực kỳ nhạy. Lần đầu xem mà cảm giác như anh biết mình từ lâu rồi. Chắc chắn sẽ quay lại!', date: '3 ngày trước', service: 'Trải Bài Đơn' },
            { id: 't6c', authorName: 'Hồ Mạnh Hùng', authorAvatar: '👨', rating: 4, content: 'Thiền định kết hợp Tarot là trải nghiệm khá độc đáo. Thầy hướng dẫn cách thở và kết nối nội tâm trước khi đọc bài, tạo nền tảng tốt cho buổi xem.', date: '5 tuần trước', service: 'Chữa Lành Năng Lượng' },
            { id: 't6d', authorName: 'Nguyễn Thảo Nguyên', authorAvatar: '👩', rating: 5, content: 'Sau nhiều năm lo lắng về tương lai, buổi xem với Minh Thiện cho tôi cái nhìn rõ ràng và bình tĩnh hơn. Cảm ơn anh rất nhiều!', date: '2 tháng trước', service: 'Tarot Chuyên Sâu' },
            { id: 't6e', authorName: 'Lê Gia Bảo', authorAvatar: '👨', rating: 5, content: 'Ban đầu tôi nghĩ Tarot chỉ là trò vui nhưng buổi xem này thay đổi hoàn toàn suy nghĩ của tôi. Thầy liên kết các lá bài với tình huống thực tế rất mạch lạc.', date: '6 tuần trước', service: 'Trải Bài Đơn' },
            { id: 't6f', authorName: 'Trần Mỹ Linh', authorAvatar: '👩', rating: 5, content: 'Chakra balancing session thực sự có hiệu quả. Cảm giác cơ thể nhẹ nhàng và đầu óc minh mẫn hơn sau buổi. Sẽ book thêm các tháng sau.', date: '3 tháng trước', service: 'Chữa Lành Năng Lượng' },
        ],
    },

    {
        id: '3',
        name: 'Master Minh Trí',
        title: 'Chuyên gia Thần Số Học & Chiêm Tinh',
        specialties: ['Thần Số Học', 'Chiêm Tinh', 'Bói Bài'],
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800&h=600&fit=crop',
        ],
        experience: '6 năm',
        sessionsCompleted: 987,
        rating: 4.7,
        reviewCount: 218,
        badges: ['Rising Star'],
        availableOnline: true,
        location: 'Đà Nẵng',
        social: {
            facebook: 'https://facebook.com',
            youtube: 'https://youtube.com',
            tiktok: 'https://tiktok.com',
        },
        bio: 'Master Minh Trí kết hợp Thần Số Học Pythagoras và Chiêm Tinh học để vẽ bức tranh vận mệnh chính xác và khoa học nhất.',
        about: 'Master Minh Trí là chuyên gia trẻ tài năng được đào tạo chuyên sâu về Numerology theo trường phái Pythagoras tại Ý và Vedic Astrology theo truyền thống Ấn Độ.',
        packages: [
            { id: 'numerology-basic', name: 'Thần Số Cơ Bản', duration: '30 phút', price: 180000, description: 'Khám phá Con Số Chủ Đạo của bạn.', includes: ['Tính toán Life Path Number', 'Phân tích Destiny Number', 'Dự đoán Năm Cá Nhân', 'Bảng thần số PDF'] },
            { id: 'numerology-full', name: 'Thần Số Toàn Diện', duration: '60 phút', price: 350000, description: 'Phân tích đầy đủ bản đồ số của bạn.', includes: ['Phân tích 7 con số quan trọng', 'Bản đồ vòng đời', 'Tương hợp số với đối tác', 'Báo cáo 20 trang PDF'], highlight: true },
            { id: 'astro-numerology', name: 'Chiêm Tinh + Thần Số', duration: '90 phút', price: 580000, description: 'Kết hợp sức mạnh cả hai bộ môn.', includes: ['Phân tích thần số toàn diện', 'Lập và luận giải Birth Chart', 'Báo cáo 30 trang PDF cao cấp'] },
        ],
        testimonials: [
            { id: 't7', authorName: 'Đặng Thị Mai', authorAvatar: '👩', rating: 5, content: 'Minh Trí giải thích thần số học theo cách rất dễ hiểu và logic. Mình không nghĩ con số lại có thể phản ánh con người mình chính xác đến vậy!', date: '1 tuần trước', service: 'Thần Số Toàn Diện' },
            { id: 't8', authorName: 'Bùi Quang Hải', authorAvatar: '👨', rating: 4, content: 'Báo cáo PDF chi tiết đến mức tôi đọc mãi không hết. Rất xứng đáng với số tiền bỏ ra, thông tin cực kỳ phong phú và có chiều sâu.', date: '3 tuần trước', service: 'Chiêm Tinh + Thần Số' },
            { id: 't9', authorName: 'Ngô Thanh Xuân', authorAvatar: '👩', rating: 5, content: 'Kết hợp nhiều phương pháp rất mạch lạc. Lời khuyên rất cụ thể giúp tôi đưa ra quyết định về việc học thêm ngành mới.', date: '2 tháng trước', service: 'Chiêm Tinh + Thần Số' },
            { id: 't9b', authorName: 'Trường An', authorAvatar: '👨', rating: 5, content: 'Mình là dân kỹ thuật, ban đầu không tin lắm nhưng thần số học của Minh Trí rất có cơ sở khoa học. Anh giải thích từng bước rất logic, mình impressed!', date: '4 ngày trước', service: 'Thần Số Cơ Bản' },
            { id: 't9c', authorName: 'Kim Chi', authorAvatar: '👩', rating: 5, content: 'Tương hợp số với bạn đời của tôi được phân tích rất thú vị. Hiểu nhau hơn sau buổi xem. Cảm ơn Minh Trí!', date: '2 tuần trước', service: 'Thần Số Toàn Diện' },
            { id: 't9d', authorName: 'Lâm Bảo Khải', authorAvatar: '👨', rating: 5, content: 'Birth chart và thần số học kết hợp cho ra bức tranh vận mệnh cực kỳ rõ ràng. Hiểu được đại hạn vận của mình giúp tôi chuẩn bị tốt hơn.', date: '1 tháng trước', service: 'Chiêm Tinh + Thần Số' },
            { id: 't9e', authorName: 'Tuyết Nhung', authorAvatar: '👩', rating: 5, content: 'Rất ấn tượng với sự chuẩn bị kỹ lưỡng của Minh Trí trước buổi xem. Anh đã nghiên cứu ngày sinh của tôi và sẵn sàng câu trả lời rất detail.', date: '7 tuần trước', service: 'Thần Số Toàn Diện' },
            { id: 't9f', authorName: 'Phong Trần', authorAvatar: '👨', rating: 4, content: 'Dự đoán về tài chính năm nay khá chính xác. Thần số học applied vào cuộc sống thực tế thì hiệu quả hơn tôi tưởng.', date: '3 tháng trước', service: 'Thần Số Cơ Bản' },
        ],
    },

    {
        id: '4',
        name: 'Master Tuệ Linh',
        title: 'Chuyên gia Bói Bài & Tâm Linh',
        specialties: ['Bói Bài', 'Tâm Linh', 'Năng Lượng', 'Tarot'],
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1519339901962-5c6ab3f9cf6a?w=1200&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&h=600&fit=crop',
        ],
        experience: '12 năm',
        sessionsCompleted: 2231,
        rating: 4.9,
        reviewCount: 445,
        badges: ['Top Rated', 'Bestseller'],
        availableOnline: true,
        location: 'TP. Hồ Chí Minh',
        social: {
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
            tiktok: 'https://tiktok.com',
            threads: 'https://threads.net',
            youtube: 'https://youtube.com',
        },
        bio: 'Master Tuệ Linh nổi tiếng với khả năng kết nối tâm linh đặc biệt và phong thái ôn hòa, là người bạn đồng hành tin cậy.',
        about: 'Master Tuệ Linh là chuyên gia tâm linh nữ với hơn 12 năm kinh nghiệm, chuyên về Bói Bài truyền thống Việt Nam kết hợp Tarot hiện đại và các kỹ thuật kết nối năng lượng tâm linh.',
        packages: [
            { id: 'oracle-30', name: 'Bói Bài Nhanh', duration: '30 phút', price: 220000, description: 'Bói bài cho một hoặc hai câu hỏi cụ thể.', includes: ['Trải bài Oracle/Tarot', 'Đọc & giải thích trực tiếp', 'Tin nhắn tóm tắt sau buổi'] },
            { id: 'spiritual-deep', name: 'Kết Nối Tâm Linh', duration: '60 phút', price: 420000, description: 'Buổi xem tâm linh chuyên sâu, kết nối năng lượng.', includes: ['Bói bài đa chủ đề', 'Đọc năng lượng aura', 'Báo cáo chi tiết sau buổi xem'], highlight: true },
            { id: 'premium-spiritual', name: 'Hành Trình Tâm Linh', duration: '120 phút', price: 850000, description: 'Trải nghiệm tâm linh sâu sắc nhất.', includes: ['Bói bài không giới hạn', 'Đọc năng lượng tâm linh sâu', 'Thiền định có hướng dẫn', 'Follow-up 45 phút sau 1 tháng'] },
        ],
        testimonials: [
            { id: 't10', authorName: 'Trịnh Thị Lan', authorAvatar: '👩', rating: 5, content: 'Chị Tuệ Linh có năng lực đặc biệt. Buổi xem như một liều thuốc tinh thần quý giá, giúp tôi xử lý nhiều cảm xúc còn đọng lại nhiều năm.', date: '3 ngày trước', service: 'Kết Nối Tâm Linh' },
            { id: 't11', authorName: 'Dương Văn Minh', authorAvatar: '👨', rating: 5, content: 'Sau 2 giờ với Master Tuệ Linh, tôi tìm lại được bình yên và định hướng. Buổi xem giúp tôi nhìn rõ con đường phía trước. Thực sự vô giá!', date: '1 tuần trước', service: 'Hành Trình Tâm Linh' },
            { id: 't12', authorName: 'Cao Thị Ngọc', authorAvatar: '👩', rating: 5, content: 'Lần đầu tiên trong đời tôi buổi bói bài khiến tôi khóc vì xúc động. Chị Tuệ Linh đọc đúng tâm tư sâu kín nhất của tôi. Incredible!', date: '2 tuần trước', service: 'Hành Trình Tâm Linh' },
            { id: 't12b', authorName: 'Quỳnh Nga', authorAvatar: '👩', rating: 5, content: 'Chị Tuệ Linh rất ôn hòa và kiên nhẫn. Ngồi xem bài mà cứ như ngồi nói chuyện với người chị lớn thấu hiểu mình vậy. Tuyệt vời!', date: '6 ngày trước', service: 'Bói Bài Nhanh' },
            { id: 't12c', authorName: 'Hữu Phát', authorAvatar: '👨', rating: 5, content: 'Tôi hoài nghi về bói bài nhưng người bạn giới thiệu nên thử. Và tôi phải nói chị Tuệ Linh thực sự có cái gì đó đặc biệt. Chính xác về tình huống gia đình tôi đang gặp.', date: '3 tuần trước', service: 'Kết Nối Tâm Linh' },
            { id: 't12d', authorName: 'Minh Châu', authorAvatar: '👩', rating: 5, content: 'Buổi Hành Trình Tâm Linh 2 tiếng là trải nghiệm không thể quên. Được đọc năng lượng aura, thiền định và bói bài kết hợp. Đáng book mỗi quý một lần!', date: '1 tháng trước', service: 'Hành Trình Tâm Linh' },
            { id: 't12e', authorName: 'Bảo Long', authorAvatar: '👨', rating: 4, content: 'Chị đọc bài Oracle rất trực quan và dễ hiểu. Không dùng ngôn ngữ huyền bí khó hiểu mà giải thích bằng ngôn ngữ đời thường giúp tôi dễ tiếp nhận hơn.', date: '2 tháng trước', service: 'Bói Bài Nhanh' },
            { id: 't12f', authorName: 'Linh Đan', authorAvatar: '👩', rating: 5, content: 'Đã book cho cả mẹ và em gái cùng xem. Gia đình tôi rất hài lòng. Chị Tuệ Linh là người tôi tin tưởng nhất trong lĩnh vực tâm linh.', date: '3 tháng trước', service: 'Kết Nối Tâm Linh' },
        ],
    },
];

export function getExpertById(id: string): Expert | undefined {
    return experts.find((e) => e.id === id);
}

export function formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
}
