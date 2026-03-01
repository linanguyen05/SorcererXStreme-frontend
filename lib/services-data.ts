// ============================================================
// EXPERT READER DATA — SorcererXStreme
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

// ============================================================
// DATA
// ============================================================

export const experts: Expert[] = [
    {
        id: 'master-tri-duc',
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
        id: 'master-minh-thien',
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
        id: 'master-minh-tri',
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
        id: 'master-tue-linh',
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

    // ===== NEW EXPERTS =====

    {
        id: 'thay-kim-long',
        name: 'Thầy Kim Long',
        title: 'Chuyên gia Phong Thủy & Tử Vi',
        specialties: ['Phong Thủy', 'Tử Vi', 'Chiêm Tinh'],
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=1200&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=600&fit=crop',
        ],
        experience: '20 năm',
        sessionsCompleted: 4120,
        rating: 5.0,
        reviewCount: 789,
        badges: ['Top Rated', 'Huyền Học Đại Sư'],
        availableOnline: true,
        location: 'Hà Nội',
        social: {
            facebook: 'https://facebook.com',
            youtube: 'https://youtube.com',
            threads: 'https://threads.net',
        },
        bio: 'Thầy Kim Long là bậc thầy phong thủy với 20 năm kinh nghiệm, từng tư vấn cho hàng trăm doanh nghiệp và gia đình nổi tiếng.',
        about: 'Thầy Kim Long là một trong những chuyên gia phong thủy hàng đầu Việt Nam với hơn 20 năm tu học và thực chiến. Ông được học trực tiếp từ các đại sư phong thủy tại Hồng Kông và Đài Loan, và đã tư vấn cho hàng trăm doanh nghiệp lớn về bố trí văn phòng, kho bãi và nhà xưởng theo phong thủy hiện đại.',
        packages: [
            { id: 'fengshui-home', name: 'Phong Thủy Nhà Ở', duration: '45 phút', price: 350000, description: 'Tư vấn phong thủy không gian sống cho gia đình.', includes: ['Phân tích hướng nhà', 'Bố trí nội thất theo mệnh', 'Giải xung sát khí', 'Báo cáo ghi chú chi tiết'] },
            { id: 'fengshui-business', name: 'Phong Thủy Doanh Nghiệp', duration: '75 phút', price: 600000, description: 'Tối ưu phong thủy văn phòng và nơi làm việc.', includes: ['Phân tích hướng văn phòng', 'Bố trí bàn làm việc', 'Chọn màu sắc & vật phẩm', 'Kế hoạch vá phong thủy', 'Hỗ trợ 14 ngày'], highlight: true },
            { id: 'fengshui-vip', name: 'VIP Trọn Gói', duration: '120 phút', price: 1200000, description: 'Gói phong thủy toàn diện cho gia đình + sự nghiệp.', includes: ['Phong thủy nhà & văn phòng', 'Tử vi gia chủ', 'Chọn ngày đẹp khai trương/chuyển nhà', 'Tư vấn màu sắc và số tầng', 'Follow-up không giới hạn 30 ngày'] },
        ],
        testimonials: [
            { id: 'kl1', authorName: 'Lê Văn Đức', authorAvatar: '👨', rating: 5, content: 'Sau khi thầy Kim Long tư vấn bố trí phong thủy văn phòng, doanh thu tăng 30% chỉ sau 2 tháng. Không phải ngẫu nhiên! Thầy phân tích rất khoa học và có căn cứ.', date: '1 tuần trước', service: 'Phong Thủy Doanh Nghiệp' },
            { id: 'kl2', authorName: 'Nguyễn Thị Bích Ngọc', authorAvatar: '👩', rating: 5, content: 'Thầy rất nhiệt tình và giải thích cặn kẽ. Nhà mình sắp xếp lại theo lời thầy, không khí gia đình hòa thuận hơn hẳn và con cái học hành cũng tốt hơn.', date: '2 tuần trước', service: 'Phong Thủy Nhà Ở' },
            { id: 'kl3', authorName: 'Phạm Minh Khoa', authorAvatar: '👨', rating: 5, content: 'Thầy Kim Long là số 1 về phong thủy. Đã giới thiệu cho cả đối tác kinh doanh cùng xem. Ai cũng hài lòng với tư vấn của thầy.', date: '1 tháng trước', service: 'VIP Trọn Gói' },
            { id: 'kl4', authorName: 'Thanh Tâm', authorAvatar: '👩', rating: 5, content: 'Thầy với 20 năm kinh nghiệm thực sự khác biệt hẳn. Phân tích từng góc nhà, từng hướng cửa theo bát trạch rất tỉ mỉ. Cảm ơn thầy nhiều!', date: '4 ngày trước', service: 'Phong Thủy Nhà Ở' },
            { id: 'kl5', authorName: 'Đại Nghĩa', authorAvatar: '👨', rating: 5, content: 'Khai trương theo ngày thầy Kim Long chọn, shop mình khách liên tục ngay từ ngày đầu. Trùng hợp hay phong thủy? Tôi tin là phong thủy!', date: '3 tuần trước', service: 'VIP Trọn Gói' },
            { id: 'kl6', authorName: 'Thúy Vi', authorAvatar: '👩', rating: 5, content: 'Thầy phân tích tử vi gia chủ kết hợp phong thủy nhà rất toàn diện. Hai góc độ cộng lại cho bức tranh hoàn hảo về những gì cần thay đổi.', date: '2 tháng trước', service: 'VIP Trọn Gói' },
            { id: 'kl7', authorName: 'Văn Hiếu', authorAvatar: '👨', rating: 5, content: 'Mua nhà mới được thầy Kim Long tư vấn phong thủy trọn gói. Tất cả từ hướng cổng, bố trí phòng ngủ đến màu sắc nội thất đều được thầy chỉ dẫn kỹ lưỡng.', date: '5 tháng trước', service: 'Phong Thủy Nhà Ở' },
            { id: 'kl8', authorName: 'Lan Phương', authorAvatar: '👩', rating: 4, content: 'Thầy Kim Long giải thích nguyên lý phong thủy rất khoa học, không mê tín. Tôi đặc biệt ấn tượng với cách thầy kết hợp phong thủy với kiến trúc hiện đại.', date: '4 tháng trước', service: 'Phong Thủy Doanh Nghiệp' },
        ],
    },

    {
        id: 'co-huong-giang',
        name: 'Cô Hương Giang',
        title: 'Chuyên gia Tarot & Chiêm Tinh Phương Tây',
        specialties: ['Tarot', 'Chiêm Tinh', 'Thần Số Học'],
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1475274047050-1d0c0975864c?w=1200&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop',
        ],
        experience: '9 năm',
        sessionsCompleted: 1820,
        rating: 4.8,
        reviewCount: 390,
        badges: ['Top Rated', 'Bestseller'],
        availableOnline: true,
        location: 'TP. Hồ Chí Minh',
        social: {
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
            tiktok: 'https://tiktok.com',
            youtube: 'https://youtube.com',
        },
        bio: 'Cô Hương Giang chuyên luận giải Tarot & Chiêm Tinh phương Tây theo phong cách hiện đại, tập trung vào tình cảm và phát triển bản thân.',
        about: 'Cô Hương Giang là một trong những chuyên gia Tarot & Chiêm Tinh phương Tây nổi bật nhất tại Việt Nam. Được đào tạo tại The Tarot School (New York) và nghiên cứu Psychological Astrology theo trường phái Liz Greene, cô mang đến những buổi đọc bài khai sáng và chữa lành theo chiều hướng tích cực.',
        packages: [
            { id: 'hg-basic', name: 'Tarot Mini', duration: '30 phút', price: 230000, description: 'Trải bài cho một tình huống cụ thể.', includes: ['Trải bài 5-10 lá', 'Đọc và giải thích', 'Lời khuyên thực tế'] },
            { id: 'hg-astro', name: 'Birth Chart Reading', duration: '60 phút', price: 490000, description: 'Phân tích lá số chiêm tinh cá nhân toàn diện.', includes: ['Lập và đọc Birth Chart', 'Phân tích Sun/Moon/Rising', 'Dự đoán transit năm nay', 'File PDF chi tiết'], highlight: true },
            { id: 'hg-combo', name: 'Tarot + Chiêm Tinh', duration: '90 phút', price: 720000, description: 'Kết hợp cả hai để có cái nhìn toàn diện nhất.', includes: ['Trải bài Tarot đa chủ đề', 'Đọc Birth Chart đầy đủ', 'Dự đoán 6 tháng tới', 'Báo cáo tổng hợp PDF'] },
        ],
        testimonials: [
            { id: 'hg1', authorName: 'Trần Bích Phượng', authorAvatar: '👩', rating: 5, content: 'Cô Hương Giang đọc bài rất sâu sắc và đúng tình huống thực tế. Lần đầu xem tarot mà tôi muốn book ngay lần 2! Đặc biệt cô giải thích từng lá bài rất rõ ràng.', date: '4 ngày trước', service: 'Birth Chart Reading' },
            { id: 'hg2', authorName: 'Nguyễn Anh Tuấn', authorAvatar: '👨', rating: 5, content: 'Birth chart reading cực kỳ chuyên sâu. Cô phân tích đúng điểm mạnh điểm yếu của mình và đưa ra lộ trình phát triển rất thực tế.', date: '2 tuần trước', service: 'Tarot + Chiêm Tinh' },
            { id: 'hg3', authorName: 'Mai Linh Thảo', authorAvatar: '👩', rating: 5, content: 'Cô không chỉ đọc bài mà còn coaching tâm lý rất hay. Tôi học được cách nhìn nhận các thử thách trong cuộc sống theo hướng tích cực hơn. Cảm ơn cô nhiều!', date: '3 tuần trước', service: 'Birth Chart Reading' },
            { id: 'hg4', authorName: 'Khánh Linh', authorAvatar: '👩', rating: 5, content: 'Sun/Moon/Rising được phân tích đầy đủ và tích hợp vào bức tranh tổng thể rất logic. Cô Hương Giang là chiêm tinh gia dạng tâm lý học, rất khác với kiểu xem thông thường.', date: '1 tuần trước', service: 'Birth Chart Reading' },
            { id: 'hg5', authorName: 'Tuấn Khải', authorAvatar: '👨', rating: 5, content: 'Tarot kết hợp chiêm tinh là combo hoàn hảo. Cô dùng chart để nhìn tổng quan rồi dùng bài Tarot để xem chi tiết từng vấn đề. Methodology rất bài bản.', date: '3 tuần trước', service: 'Tarot + Chiêm Tinh' },
            { id: 'hg6', authorName: 'Hồng Nhung', authorAvatar: '👩', rating: 5, content: 'Xem tình duyên qua Tarot + Venus/Mars chart rất thú vị. Hiểu được pattern tình cảm của mình và biết cách break the cycle. Giá trị lắm!', date: '1 tháng trước', service: 'Tarot Mini' },
            { id: 'hg7', authorName: 'Trí Khải', authorAvatar: '👨', rating: 4, content: 'Dự đoán transit năm nay khá chuẩn. Đặc biệt cô predict được thời điểm thăng tiến trong công việc rất gần với thực tế.', date: '2 tháng trước', service: 'Birth Chart Reading' },
            { id: 'hg8', authorName: 'Phương Anh', authorAvatar: '👩', rating: 5, content: 'File PDF sau buổi xem cực kỳ chi tiết với hình ảnh minh họa. Tôi có thể tham khảo bất cứ lúc nào. Cô Hương Giang chuẩn bị rất chuyên nghiệp.', date: '4 tháng trước', service: 'Tarot + Chiêm Tinh' },
        ],
    },

    {
        id: 'thay-dao-quang',
        name: 'Thầy Đạo Quang',
        title: 'Chuyên gia Tử Vi & Kinh Dịch',
        specialties: ['Tử Vi', 'Bói Bài', 'Tâm Linh'],
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?w=1200&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
        ],
        experience: '18 năm',
        sessionsCompleted: 3540,
        rating: 4.9,
        reviewCount: 621,
        badges: ['Top Rated', 'Bestseller'],
        availableOnline: false,
        location: 'Huế',
        social: {
            facebook: 'https://facebook.com',
            threads: 'https://threads.net',
            youtube: 'https://youtube.com',
        },
        bio: 'Thầy Đạo Quang tinh thông Tử Vi Đẩu Số và Kinh Dịch theo phương pháp cổ truyền, được truyền dạy từ dòng họ nhiều đời.',
        about: 'Thầy Đạo Quang xuất thân từ dòng họ có truyền thống nghiên cứu huyền học nhiều đời tại Huế. Ông tinh thông Tử Vi Đẩu Số, Kinh Dịch, và các bộ môn huyền học cổ truyền phương Đông. Với phong thái trầm tĩnh và sâu sắc, mỗi buổi tư vấn của thầy là một hành trình khám phá văn hoá tâm linh Việt độc đáo.',
        packages: [
            { id: 'dq-basic', name: 'Xem Tử Vi Cơ Bản', duration: '45 phút', price: 300000, description: 'Luận giải lá số tử vi cơ bản theo phương pháp cổ truyền.', includes: ['Lập và đọc lá số Tử Vi', 'Phân tích cung Mệnh', 'Xem vận năm hiện tại', 'Ghi chép tóm tắt'] },
            { id: 'dq-full', name: 'Tử Vi Toàn Diện', duration: '90 phút', price: 550000, description: 'Phân tích toàn bộ 12 cung trong lá số tử vi.', includes: ['Luận giải đầy đủ 12 cung', 'Phân tích đại hạn vận', 'Xem ngũ hành sinh khắc', 'Kinh Dịch bổ sung', 'Báo cáo chi tiết'], highlight: true },
            { id: 'dq-vip', name: 'Gói Truyền Thống VIP', duration: '120 phút', price: 900000, description: 'Tư vấn chuyên sâu đầy đủ theo phương pháp cổ truyền.', includes: ['Tử vi toàn diện', 'Kinh dịch & bói quẻ', 'Xem phong thủy nhà ở', 'Chọn ngày lành tháng tốt', 'Follow-up 1 buổi miễn phí'] },
        ],
        testimonials: [
            { id: 'dq1', authorName: 'Hoàng Thị Tuyết', authorAvatar: '👩', rating: 5, content: 'Thầy Đạo Quang xem rất chuẩn theo phong cách cổ truyền. Cảm giác như được nghe câu chuyện của chính mình từ người hiểu sâu về văn hóa dân tộc.', date: '1 tuần trước', service: 'Tử Vi Toàn Diện' },
            { id: 'dq2', authorName: 'Vũ Bá Thịnh', authorAvatar: '👨', rating: 5, content: 'Thầy có kiến thức cực kỳ sâu về tử vi cổ truyền. Xem xong thực sự hiểu được vận mệnh của mình hơn và biết cần làm gì trong giai đoạn hiện tại.', date: '3 tuần trước', service: 'Gói Truyền Thống VIP' },
            { id: 'dq3', authorName: 'Lý Thị Kim Anh', authorAvatar: '👩', rating: 5, content: 'Trải nghiệm rất đặc biệt và chân thực. Thầy không làm màu, nói thẳng sự thật kể cả những điều không dễ nghe. Rất đáng trân trọng!', date: '2 tháng trước', service: 'Tử Vi Toàn Diện' },
            { id: 'dq4', authorName: 'Đức Thịnh', authorAvatar: '👨', rating: 5, content: 'Kinh Dịch bổ sung vào tử vi tạo ra sự toàn vẹn cho phần luận giải. Thầy Đạo Quang thực sự nắm vững cả hai bộ môn này ở tầm cao.', date: '2 ngày trước', service: 'Gói Truyền Thống VIP' },
            { id: 'dq5', authorName: 'Thiên Kim', authorAvatar: '👩', rating: 5, content: 'Đặc biệt ấn tượng với cách thầy giải thích đại hạn vận. Tôi biết được mình đang ở giai đoạn nào và cần làm gì để tận dụng vận khí tốt sắp tới.', date: '4 tuần trước', service: 'Xem Tử Vi Cơ Bản' },
            { id: 'dq6', authorName: 'Quốc Hưng', authorAvatar: '👨', rating: 5, content: 'Thầy ở Huế nhưng phong cách xem mang hồn văn hóa xứ Huế rất đặc trưng. Buổi xem vừa có giá trị thực tiễn vừa là trải nghiệm văn hóa độc đáo.', date: '2 tháng trước', service: 'Tử Vi Toàn Diện' },
            { id: 'dq7', authorName: 'Bảo Trâm', authorAvatar: '👩', rating: 5, content: 'Ba của tôi đã xem tử vi ở nhiều nơi nhưng nói thầy Đạo Quang là người xem hay nhất. Gia đình đã book thêm các anh chị em để xem.', date: '3 tháng trước', service: 'Gói Truyền Thống VIP' },
            { id: 'dq8', authorName: 'Minh Tuấn', authorAvatar: '👨', rating: 4, content: 'Cách thầy kết hợp bói quẻ Kinh Dịch với tử vi để xác nhận kết quả rất thú vị. Phương pháp xác minh chéo cho kết quả tin cậy hơn.', date: '5 tháng trước', service: 'Tử Vi Toàn Diện' },
        ],
    },

    {
        id: 'co-bich-tram',
        name: 'Cô Bích Trâm',
        title: 'Chuyên gia Oracle Cards & Năng Lượng Chữa Lành',
        specialties: ['Năng Lượng', 'Tâm Linh', 'Tarot', 'Bói Bài'],
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=1200&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        ],
        experience: '7 năm',
        sessionsCompleted: 1290,
        rating: 4.8,
        reviewCount: 267,
        badges: ['Rising Star', 'Chuyên gia Năng Lượng'],
        availableOnline: true,
        location: 'TP. Hồ Chí Minh',
        social: {
            instagram: 'https://instagram.com',
            tiktok: 'https://tiktok.com',
            facebook: 'https://facebook.com',
        },
        bio: 'Cô Bích Trâm chuyên về Oracle Cards và năng lượng chữa lành, kết hợp thiền định và crystal healing để phục hồi năng lượng toàn diện.',
        about: 'Cô Bích Trâm là chuyên gia năng lượng và Oracle Cards với 7 năm kinh nghiệm. Cô được chứng nhận Reiki Master Level III và đào tạo Crystal Healing tại Mỹ. Phong cách của cô ấm áp, sáng tạo và trực giác cao, phù hợp với những ai đang tìm kiếm sự chữa lành tâm hồn và kết nối với bản thân sâu hơn.',
        packages: [
            { id: 'bt-oracle', name: 'Oracle Card Reading', duration: '30 phút', price: 190000, description: 'Trải Oracle Cards cho thông điệp từ vũ trụ.', includes: ['Trải Oracle tối đa 7 lá', 'Đọc và giải thích thông điệp', 'Bài tập thực hành sau buổi'] },
            { id: 'bt-healing', name: 'Energy Healing Session', duration: '60 phút', price: 400000, description: 'Kết hợp Oracle, Reiki và Crystal để chữa lành năng lượng.', includes: ['Oracle reading', 'Reiki distance healing', 'Crystal recommendations', 'Hướng dẫn thiền định cá nhân'], highlight: true },
            { id: 'bt-full', name: 'Soul Alignment', duration: '90 phút', price: 700000, description: 'Hành trình cân bằng tâm-thân-linh toàn diện.', includes: ['Oracle + Angel Cards reading', 'Reiki toàn thân', 'Chakra balancing', 'Bản đồ năng lượng cá nhân', 'Kế hoạch chữa lành 30 ngày'] },
        ],
        testimonials: [
            { id: 'bt1', authorName: 'Ngô Thanh Hương', authorAvatar: '👩', rating: 5, content: 'Cô Bích Trâm có năng lượng rất bình an và ấm áp. Sau buổi healing tôi ngủ ngon hơn hẳn! Cơ thể nhẹ nhàng và đầu óc thông suốt hơn nhiều.', date: '2 ngày trước', service: 'Energy Healing Session' },
            { id: 'bt2', authorName: 'Đỗ Minh Nhật', authorAvatar: '👨', rating: 5, content: 'Ban đầu tôi hoài nghi về reiki nhưng sau buổi session với cô thực sự cảm thấy khác biệt. Đau vai gáy mãn tính giảm hẳn sau 2 buổi healing.', date: '1 tuần trước', service: 'Soul Alignment' },
            { id: 'bt3', authorName: 'Phan Thu Nga', authorAvatar: '👩', rating: 5, content: 'Oracle reading rất chính xác với tình huống mình đang gặp phải. Cô đọc như đọc tâm tư vậy! Các thông điệp từ Oracle rất phù hợp và có tính dẫn đường.', date: '2 tuần trước', service: 'Oracle Card Reading' },
            { id: 'bt4', authorName: 'Mỹ Duyên', authorAvatar: '👩', rating: 5, content: 'Soul Alignment là buổi sâu sắc nhất tôi từng trải qua. Cô dẫn mình qua các lớp năng lượng và giúp nhận ra những khối năng lượng bị chặn từ lâu.', date: '5 ngày trước', service: 'Soul Alignment' },
            { id: 'bt5', authorName: 'Gia Bảo', authorAvatar: '👨', rating: 5, content: 'Crystal recommendations của cô Bích Trâm rất specific cho từng người. Cô giải thích tại sao từng loại đá phù hợp với năng lượng cá nhân rất logic.', date: '1 tháng trước', service: 'Energy Healing Session' },
            { id: 'bt6', authorName: 'Thúy Ngân', authorAvatar: '👩', rating: 5, content: 'Sau buổi healing, cô còn gửi kế hoạch chữa lành 30 ngày rất chi tiết. Tôi theo từng bước và cảm thấy sức khỏe tinh thần cải thiện rõ rệt.', date: '6 tuần trước', service: 'Soul Alignment' },
            { id: 'bt7', authorName: 'Hải Đăng', authorAvatar: '👨', rating: 4, content: 'Cô Bích Trâm là người đầu tiên giới thiệu cho tôi khái niệm chakra balancing. Cách cô giải thích dễ hiểu và không huyền bí hóa quá mức.', date: '3 tháng trước', service: 'Oracle Card Reading' },
            { id: 'bt8', authorName: 'Thu Huyền', authorAvatar: '👩', rating: 5, content: 'Bản đồ năng lượng cá nhân nhận được sau buổi Soul Alignment thực sự là tài liệu quý. Tôi cầm theo như nhật ký hướng dẫn cuộc sống hàng ngày.', date: '4 tháng trước', service: 'Soul Alignment' },
        ],
    },

    {
        id: 'thay-an-nhien',
        name: 'Thầy An Nhiên',
        title: 'Chuyên gia Thiền Định & Tâm Lý Học Tâm Linh',
        specialties: ['Tâm Linh', 'Năng Lượng', 'Thần Số Học'],
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1200&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        ],
        experience: '11 năm',
        sessionsCompleted: 1980,
        rating: 4.9,
        reviewCount: 412,
        badges: ['Top Rated', 'Chuyên gia Thiền'],
        availableOnline: true,
        location: 'Đà Lạt',
        social: {
            facebook: 'https://facebook.com',
            youtube: 'https://youtube.com',
            instagram: 'https://instagram.com',
        },
        bio: 'Thầy An Nhiên là người tiên phong kết hợp Tâm Lý Học hiện đại với Tâm Linh học Đông phương, giúp khách hàng chữa lành từ bên trong.',
        about: 'Thầy An Nhiên là nhà thiền định và tư vấn tâm lý tâm linh với 11 năm kinh nghiệm. Ông từng tu học tại các thiền viện Phật giáo ở Ấn Độ và Myanmar, đồng thời nghiên cứu Tâm Lý Học Chuyển Hóa tại ĐH San Francisco. Phương pháp độc đáo của ông kết hợp thiền chánh niệm, MBSR và các kỹ thuật tâm linh để tạo ra sự thay đổi bền vững từ bên trong.',
        packages: [
            { id: 'an-mind', name: 'Tư Vấn Tâm Lý Tâm Linh', duration: '45 phút', price: 280000, description: 'Buổi tư vấn kết hợp tâm lý học và huyền học.', includes: ['Phân tích vấn đề tâm lý', 'Góc nhìn tâm linh', 'Bài tập thực hành tại nhà', 'Hỗ trợ chat 5 ngày'] },
            { id: 'an-meditate', name: 'Thiền Định Cá Nhân', duration: '60 phút', price: 360000, description: 'Khóa thiền định cá nhân hóa theo nhu cầu.', includes: ['Thiền hướng dẫn trực tiếp', 'Kỹ thuật thiền phù hợp cá nhân', 'Audio hướng dẫn thiền tại nhà', 'Theo dõi tiến trình 2 tuần'], highlight: true },
            { id: 'an-transform', name: 'Hành Trình Chuyển Hóa', duration: '90 phút', price: 650000, description: 'Chương trình chuyển hóa toàn diện tâm-thân-linh.', includes: ['Đánh giá tình trạng năng lượng', 'Thiền định sâu có hướng dẫn', 'Thần số học hỗ trợ', 'Kế hoạch chuyển hóa 60 ngày', 'Check-in hàng tuần 4 tuần'] },
        ],
        testimonials: [
            { id: 'an1', authorName: 'Đinh Thị Ngọc Ánh', authorAvatar: '👩', rating: 5, content: 'Thầy An Nhiên giúp tôi thay đổi cách nhìn về cuộc đời. Sau 3 buổi Hành Trình Chuyển Hóa, tôi kiểm soát cảm xúc tốt hơn hẳn và phản ứng bình tĩnh hơn với áp lực.', date: '5 ngày trước', service: 'Hành Trình Chuyển Hóa' },
            { id: 'an2', authorName: 'Lưu Văn Hải', authorAvatar: '👨', rating: 5, content: 'Kết hợp giữa tâm lý học và tâm linh rất thú vị, khác hẳn những nơi khác. Thầy có nền tảng học thuật vững chắc nên giải thích rất thuyết phục. Rất đáng thử!', date: '2 tuần trước', service: 'Thiền Định Cá Nhân' },
            { id: 'an3', authorName: 'Tô Thị Bảo Châu', authorAvatar: '👩', rating: 5, content: 'Thầy rất kiên nhẫn và thấu hiểu. Cứ tưởng thiền khó nhưng thầy hướng dẫn rất dễ vào. Audio thiền gửi sau buổi rất hay, tôi dùng hàng ngày.', date: '1 tháng trước', service: 'Thiền Định Cá Nhân' },
            { id: 'an4', authorName: 'Minh Quân', authorAvatar: '👨', rating: 5, content: 'Là người làm việc áp lực cao, thiền MBSR của thầy An Nhiên đã trở thành công cụ không thể thiếu của tôi. Check-in hàng tuần rất giá trị để duy trì tiến trình.', date: '1 tuần trước', service: 'Hành Trình Chuyển Hóa' },
            { id: 'an5', authorName: 'Bích Phượng', authorAvatar: '👩', rating: 5, content: 'Phân tích thần số học kết hợp thiền định tạo ra góc nhìn rất toàn diện. Hiểu được bản thân theo nhiều chiều giúp tôi làm chủ cuộc đời mình hơn.', date: '3 tuần trước', service: 'Hành Trình Chuyển Hóa' },
            { id: 'an6', authorName: 'Hoàng Anh', authorAvatar: '👨', rating: 5, content: 'Sau 6 tháng làm việc với thầy An Nhiên, tôi nhận ra sự thay đổi rõ ràng trong cách nhìn nhận các vấn đề. Từ lo lắng phản ứng sang chủ động ứng phó.', date: '2 tháng trước', service: 'Tư Vấn Tâm Lý Tâm Linh' },
            { id: 'an7', authorName: 'Thanh Vy', authorAvatar: '👩', rating: 4, content: 'Buổi thiền hướng dẫn trực tiếp với thầy rất đặc biệt. Chất lượng âm thanh buổi online tốt và thầy có giọng rất bình an, dễ đi vào trạng thái thiền.', date: '3 tháng trước', service: 'Thiền Định Cá Nhân' },
            { id: 'an8', authorName: 'Gia Khang', authorAvatar: '👨', rating: 5, content: 'Kế hoạch chuyển hóa 60 ngày của thầy rất cụ thể và thực tế. Không chỉ là lý thuyết mà là từng hành động nhỏ mỗi ngày. 60 ngày sau tôi như người khác.', date: '5 tháng trước', service: 'Hành Trình Chuyển Hóa' },
        ],
    },

    // ── NEW EXPERTS ──────────────────────────────────────────────

    {
        id: 'master-phuoc-an',
        name: 'Master Phước An',
        title: 'Chuyên gia Tử Vi & Kinh Dịch Cao Cấp',
        specialties: ['Tử Vi', 'Chiêm Tinh', 'Phong Thủy'],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=600&fit=crop',
        gallery: [],
        experience: '22 năm',
        sessionsCompleted: 5102,
        rating: 5.0,
        reviewCount: 1204,
        badges: ['MASTER', 'Top 1'],
        availableOnline: true,
        location: 'Huế',
        isPremium: true,
        social: { facebook: 'https://facebook.com', youtube: 'https://youtube.com', instagram: 'https://instagram.com' },
        bio: 'Đại sư 22 năm tu học Tử Vi tại Huế — được phong danh "Nhà tiên tri của miền Trung". Hơn 5.000 buổi tư vấn với độ chính xác vượt trội.',
        about: 'Master Phước An là đệ tử chân truyền của dòng phái Tử Vi Huế cổ truyền. Với 22 năm tu học và hành nghề, ông đã được cộng đồng huyền học tôn vinh là "Nhà tiên tri của miền Trung".',
        packages: [
            { id: 'pa-basic', name: 'Tư Vấn Cơ Bản', duration: '30 phút', price: 350000, description: 'Giải đáp 1-2 câu hỏi cụ thể.', includes: ['Xem 1 chủ đề', 'Phân tích lá số', 'Tóm tắt qua email'] },
            { id: 'pa-adv', name: 'Luận Giải Toàn Diện', duration: '75 phút', price: 650000, originalPrice: 850000, description: 'Phân tích toàn bộ lá số tử vi, vận hạn năm, hướng phát triển.', includes: ['3 chủ đề tự chọn', 'Vận hạn 3 năm tới', 'Báo cáo PDF chi tiết', 'Hỗ trợ 14 ngày'], highlight: true },
            { id: 'pa-vip', name: 'VIP Tọa Đàm Cùng Master', duration: '120 phút', price: 1200000, description: 'Buổi tọa đàm riêng tư, toàn diện nhất với Master Phước An.', includes: ['Không giới hạn chủ đề', 'Lập kế hoạch vận mệnh', 'Báo cáo PDF + Audio', 'Ưu tiên hỗ trợ 60 ngày'] },
        ],
        testimonials: [
            { id: 'pa1', authorName: 'Ngô Vĩnh Phú', authorAvatar: '👨', rating: 5, content: 'Master Phước An xem chính xác đến mức tôi không thể tin được. Từng sự kiện ông nói đều xảy ra đúng như vậy. Thật sự là bậc thầy.', date: '1 tuần trước', service: 'VIP Tọa Đàm' },
            { id: 'pa2', authorName: 'Lê Thu Hà', authorAvatar: '👩', rating: 5, content: '22 năm kinh nghiệm thể hiện rõ qua từng lời phân tích. Không có gì là mơ hồ — tất cả đều cụ thể và có cơ sở.', date: '2 tuần trước', service: 'Luận Giải Toàn Diện' },
            { id: 'pa3', authorName: 'Trần Bảo Long', authorAvatar: '👨', rating: 5, content: 'Đặt lịch với Master Phước An là quyết định tốt nhất tôi đã làm năm nay. Thầy giúp tôi tránh được một quyết định sai lầm lớn về đầu tư.', date: '3 tuần trước', service: 'VIP Tọa Đàm' },
        ],
    },

    {
        id: 'co-van-anh',
        name: 'Cô Vân Anh',
        title: 'Tarot Master & Chiêm Tinh Học',
        specialties: ['Tarot', 'Chiêm Tinh', 'Năng Lượng'],
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&h=600&fit=crop',
        gallery: [],
        experience: '10 năm',
        sessionsCompleted: 3241,
        rating: 4.9,
        reviewCount: 876,
        badges: ['Top Rated', 'Rising Star'],
        availableOnline: true,
        location: 'Đà Nẵng',
        isPremium: true,
        social: { instagram: 'https://instagram.com', tiktok: 'https://tiktok.com', threads: 'https://threads.net' },
        bio: 'Tarot Master được đào tạo tại Pháp, kết hợp chiêm tinh Tây và năng lượng chữa lành. Nổi tiếng với khả năng đọc bài cực kỳ chính xác và nhân ái.',
        about: 'Cô Vân Anh học Tarot và Chiêm Tinh tại Pháp trong 3 năm, sau đó trở về Đà Nẵng để mang kiến thức phương Tây kết hợp với văn hóa tâm linh Việt Nam.',
        packages: [
            { id: 'va-celtic', name: 'Celtic Cross Reading', duration: '45 phút', price: 299000, originalPrice: 399000, description: 'Trải bài Celtic Cross kinh điển, trả lời 1 câu hỏi chuyên sâu.', includes: ['10 lá bài Celtic Cross', 'Diễn giải chi tiết từng lá', 'Lời khuyên hành động', 'Ảnh lá bài qua Zalo/email'] },
            { id: 'va-year', name: 'Xem Năm Tarot + Chiêm Tinh', duration: '60 phút', price: 499000, description: 'Kết hợp lá số chiêm tinh cá nhân với trải bài năm — toàn diện nhất.', includes: ['Lá số chiêm tinh sinh nhật', 'Trải bài 12 tháng', 'Các chu kỳ hành tinh quan trọng', 'Báo cáo PDF'], highlight: true },
            { id: 'va-energy', name: 'Cleanse & Heal (Chữa lành)', duration: '50 phút', price: 380000, description: 'Khai thông năng lượng, giải phóng tâm lý, tìm lại cân bằng nội tâm.', includes: ['Đọc năng lượng cá nhân', 'Thiền hướng dẫn', 'Affirmation cá nhân hóa', 'Hỗ trợ 7 ngày'] },
        ],
        testimonials: [
            { id: 'va1', authorName: 'Hoàng Diệu Linh', authorAvatar: '👩', rating: 5, content: 'Cô Vân Anh đọc bài Tarot quá chính xác! Chỉ 10 lá bài mà cô nói được tâm trạng thâm sâu của tôi mà bạn bè thân cũng không biết.', date: '3 ngày trước', service: 'Celtic Cross Reading' },
            { id: 'va2', authorName: 'Minh Thy', authorAvatar: '👩', rating: 5, content: 'Buổi chữa lành với cô Vân Anh như được tắm trong ánh sáng vậy. Tôi về nhà cảm thấy nhẹ nhàng và rõ ràng hơn hẳn.', date: '1 tuần trước', service: 'Cleanse & Heal' },
            { id: 'va3', authorName: 'Phi Hùng', authorAvatar: '👨', rating: 5, content: 'Lá số chiêm tinh kết hợp Tarot cho một cái nhìn rất toàn diện. Cô Vân Anh giải thích dễ hiểu ngay cả khi tôi không biết gì về chiêm tinh.', date: '2 tuần trước', service: 'Xem Năm Tarot + Chiêm Tinh' },
        ],
    },

    {
        id: 'thay-duc-minh',
        name: 'Thầy Đức Minh',
        title: 'Phong Thủy Dương Trạch & Âm Trạch',
        specialties: ['Phong Thủy', 'Tử Vi', 'Tâm Linh'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=1200&h=600&fit=crop',
        gallery: [],
        experience: '17 năm',
        sessionsCompleted: 1893,
        rating: 4.8,
        reviewCount: 423,
        badges: ['Chuyên Gia', 'Best Value'],
        availableOnline: false,
        location: 'TP.HCM',
        social: { facebook: 'https://facebook.com', youtube: 'https://youtube.com' },
        bio: '17 năm tư vấn Phong Thủy nhà ở, văn phòng và mộ phần. Đã thiết kế phong thủy cho hàng trăm công trình lớn nhỏ tại TP.HCM.',
        about: 'Thầy Đức Minh chuyên tư vấn phong thủy dương trạch (nhà ở, văn phòng, công ty) và âm trạch (mồ mả, gia tiên). Phương pháp của thầy kết hợp Bát Trạch, Phi Tinh và Loan Đầu Pháp.',
        packages: [
            { id: 'dm-house', name: 'Phong Thủy Nhà Ở', duration: '60 phút', price: 500000, originalPrice: 700000, description: 'Xem và tư vấn phong thủy cho nhà ở, căn hộ online qua ảnh/video.', includes: ['Phân tích hướng nhà', 'Xem vị trí các phòng', 'Khắc chế và bổ khuyết', 'Sơ đồ cải tạo PDF'], highlight: true },
            { id: 'dm-office', name: 'Phong Thủy Văn Phòng', duration: '90 phút', price: 800000, description: 'Tư vấn phong thủy văn phòng, công ty để tăng tài lộc và sự nghiệp.', includes: ['Phân tích toàn bộ không gian', 'Vị trí bàn lãnh đạo', 'Hướng cổng, bếp tài lộc', 'Báo cáo chi tiết + bản vẽ'] },
            { id: 'dm-land', name: 'Chọn Đất & Hướng Xây', duration: '45 phút', price: 350000, description: 'Tư vấn chọn đất, hướng xây phù hợp tuổi gia chủ.', includes: ['Phân tích lô đất qua ảnh', 'Hướng tốt theo tuổi', 'Thời điểm khởi công', 'Lời khuyên cụ thể'] },
        ],
        testimonials: [
            { id: 'dm1', authorName: 'Nguyễn Quốc Thắng', authorAvatar: '👨', rating: 5, content: 'Sau khi tư vấn với thầy Đức Minh và chỉnh sửa phong thủy văn phòng, doanh thu công ty tăng đáng kể trong 3 tháng. Không phải trùng hợp!', date: '1 tháng trước', service: 'Phong Thủy Văn Phòng' },
            { id: 'dm2', authorName: 'Bảo Châu', authorAvatar: '👩', rating: 5, content: 'Thầy xem phong thủy nhà rất tỉ mỉ, giải thích từng góc cạnh cụ thể. Sau khi điều chỉnh theo hướng dẫn, không khí gia đình hòa thuận hơn hẳn.', date: '2 tuần trước', service: 'Phong Thủy Nhà Ở' },
        ],
    },

    {
        id: 'co-thanh-thuy',
        name: 'Cô Thanh Thủy',
        title: 'Bói Bài & Thần Giao Cách Cảm',
        specialties: ['Bói Bài', 'Tâm Linh', 'Năng Lượng'],
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?w=1200&h=600&fit=crop',
        gallery: [],
        experience: '8 năm',
        sessionsCompleted: 1567,
        rating: 4.7,
        reviewCount: 334,
        badges: ['Rising Star'],
        availableOnline: true,
        location: 'Cần Thơ',
        social: { facebook: 'https://facebook.com', tiktok: 'https://tiktok.com', threads: 'https://threads.net' },
        bio: 'Chuyên đọc bài tây & oracle cards kết hợp thần giao cách cảm. Cô Thanh Thủy nổi tiếng với khả năng "cảm nhận" năng lượng người xem qua online với độ chính xác cao.',
        about: 'Cô Thanh Thủy phát hiện năng khiếu bói bài từ năm 18 tuổi. Qua 8 năm luyện tập và học hỏi, cô đã phát triển khả năng thần giao cách cảm — có thể cảm nhận được cảm xúc và tình trạng năng lượng của khách hàng ngay cả qua màn hình.',
        packages: [
            { id: 'tt-quick', name: 'Quick Reading (3 lá)', duration: '20 phút', price: 150000, originalPrice: 200000, description: 'Đọc nhanh 3 lá bài cho 1 câu hỏi cụ thể — gọn, nhanh, chính xác.', includes: ['3 lá bài trực quan', 'Giải thích ngắn gọn', 'Lời khuyên hành động ngay'] },
            { id: 'tt-love', name: 'Tình Duyên Reading', duration: '40 phút', price: 280000, description: 'Chuyên đọc về tình yêu, hôn nhân, mối quan hệ cảm xúc.', includes: ['7 lá tình duyên', 'Phân tích 2 chiều', 'Thời điểm và hướng đi', 'Ghi âm buổi xem'], highlight: true },
            { id: 'tt-oracle', name: 'Oracle + Năng Lượng', duration: '45 phút', price: 320000, description: 'Kết hợp Oracle Cards với đọc năng lượng để tìm thông điệp vũ trụ.', includes: ['Oracle Cards', 'Đọc năng lượng', 'Affirmation cá nhân', 'Hỗ trợ 3 ngày'] },
        ],
        testimonials: [
            { id: 'tt1', authorName: 'Kim Phụng', authorAvatar: '👩', rating: 5, content: 'Cô Thanh Thủy bói tình duyên cực kỳ chính xác! Cô nói đúng y chang tình trạng mối quan hệ của tôi mà không cần tôi kể gì cả.', date: '4 ngày trước', service: 'Tình Duyên Reading' },
            { id: 'tt2', authorName: 'Việt Dũng', authorAvatar: '👨', rating: 5, content: 'Quick reading 3 lá mà cô giải thích rất sâu sắc. Đáng tiền hơn cả buổi dài ở chỗ khác. Sẽ book lại!', date: '1 tuần trước', service: 'Quick Reading' },
        ],
    },

    {
        id: 'thay-minh-duc',
        name: 'Thầy Minh Đức',
        title: 'Thần Số Học Pythagorean & Chaldean',
        specialties: ['Thần Số Học', 'Chiêm Tinh', 'Tâm Linh'],
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=600&fit=crop',
        gallery: [],
        experience: '12 năm',
        sessionsCompleted: 2156,
        rating: 4.8,
        reviewCount: 589,
        badges: ['Top Rated', 'Bestseller'],
        availableOnline: true,
        location: 'Hà Nội',
        social: { facebook: 'https://facebook.com', youtube: 'https://youtube.com', instagram: 'https://instagram.com' },
        bio: 'Chuyên gia Thần Số Học cả trường phái Pythagorean lẫn Chaldean. 12 năm giúp khách hàng khám phá sứ mệnh linh hồn và tối ưu vận hạn thông qua con số.',
        about: 'Thầy Minh Đức là một trong số ít chuyên gia thần số học tại Việt Nam thành thạo cả hai trường phái Pythagorean (hiện đại) và Chaldean (cổ đại Babylon). Ông đã viết 2 cuốn sách về thần số học và dạy hơn 500 học viên.',
        packages: [
            { id: 'md-basic', name: 'Giải Mã Con Số Cá Nhân', duration: '45 phút', price: 280000, description: 'Phân tích số đường đời, số tên, số sinh ngày đầy đủ.', includes: ['Số chủ đạo đời người', 'Số tên + tên tiền định', 'Năm cá nhân hiện tại', 'Báo cáo tóm tắt'] },
            { id: 'md-chart', name: 'Lập Bản Đồ Số Trọn Đời', duration: '75 phút', price: 480000, originalPrice: 580000, description: 'Bản đồ số đầy đủ — khám phá sứ mệnh linh hồn và chu kỳ vận hạn.', includes: ['Toàn bộ ma trận số', 'Các đỉnh và thách thức', 'Chu kỳ 9 năm', 'Sứ mệnh linh hồn', 'PDF 20+ trang'], highlight: true },
            { id: 'md-couple', name: 'Hợp Số Cặp Đôi', duration: '60 phút', price: 399000, description: 'Phân tích sự tương hợp giữa hai người qua thần số học.', includes: ['Hợp số 2 người', 'Điểm mạnh & thách thức', 'Hướng phát triển mối quan hệ', 'Báo cáo PDF cặp đôi'] },
        ],
        testimonials: [
            { id: 'md1', authorName: 'Quang Trung', authorAvatar: '👨', rating: 5, content: 'Thầy Minh Đức giải thích thần số học rất logic và khoa học. Không hề mơ hồ mà rất cụ thể, có bằng chứng lịch sử đi kèm.', date: '5 ngày trước', service: 'Lập Bản Đồ Số Trọn Đời' },
            { id: 'md2', authorName: 'Thảo Nguyên', authorAvatar: '👩', rating: 5, content: 'Bản đồ số trọn đời của tôi chính xác đến rợn người. Từng giai đoạn trong cuộc đời thầy nói đều khớp với những gì tôi đã trải qua.', date: '2 tuần trước', service: 'Lập Bản Đồ Số Trọn Đời' },
        ],
    },

    {
        id: 'co-mai-huong',
        name: 'Cô Mai Hương',
        title: 'Oracle Cards & Chakra Healing',
        specialties: ['Năng Lượng', 'Tarot', 'Tâm Linh'],
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=600&fit=crop',
        gallery: [],
        experience: '6 năm',
        sessionsCompleted: 987,
        rating: 4.6,
        reviewCount: 212,
        badges: ['New Expert'],
        availableOnline: true,
        location: 'Đà Lạt',
        social: { instagram: 'https://instagram.com', threads: 'https://threads.net', tiktok: 'https://tiktok.com' },
        bio: 'Chuyên gia Chakra Healing và Oracle Cards tại Đà Lạt. Cô Mai Hương giúp khách hàng khai thông năng lượng, cân bằng 7 luân xa và tìm lại sự bình an nội tâm.',
        about: 'Cô Mai Hương bắt đầu hành trình tâm linh sau khi tự chữa lành chứng lo âu mạn tính bằng thiền định và Chakra Healing. Cô học tập tại trung tâm Yoga và Healing tại Bali trước khi về Đà Lạt mở studio chữa lành.',
        packages: [
            { id: 'mh-chakra', name: 'Chakra Scanning & Healing', duration: '50 phút', price: 320000, originalPrice: 420000, description: 'Đọc và cân bằng 7 luân xa qua năng lượng. Giải phóng năng lượng bế tắc.', includes: ['Đọc trạng thái 7 chakra', 'Cân bằng năng lượng', 'Affirmation cho từng chakra', 'Hướng dẫn tự chữa lành'] },
            { id: 'mh-oracle', name: 'Oracle Card Reading', duration: '35 phút', price: 220000, description: 'Đọc thông điệp từ vũ trụ qua bộ bài Oracle đặc biệt.', includes: ['5-7 lá Oracle', 'Thông điệp tháng/năm', 'Hành động cần thực hiện ngay'], highlight: true },
            { id: 'mh-full', name: 'Full Healing Session', duration: '90 phút', price: 550000, description: 'Phiên chữa lành toàn diện: Oracle + Chakra + Thiền hướng dẫn.', includes: ['Oracle Reading', 'Chakra Healing', 'Thiền có hướng dẫn (30 phút)', 'Hỗ trợ 14 ngày'] },
        ],
        testimonials: [
            { id: 'mh1', authorName: 'Lan Phương', authorAvatar: '👩', rating: 5, content: 'Buổi Chakra Healing với cô Mai Hương như một liều thuốc tinh thần. Sau buổi xem tôi cảm thấy nhẹ nhõm và tràn đầy năng lượng tích cực.', date: '1 tuần trước', service: 'Chakra Scanning & Healing' },
            { id: 'mh2', authorName: 'Hoàng Nam', authorAvatar: '👨', rating: 4, content: 'Không ngờ Oracle Cards lại cho kết quả chính xác như vậy. Cô giải thích rất dễ hiểu và mang tính hành động, không chỉ nói chung chung.', date: '3 tuần trước', service: 'Oracle Card Reading' },
        ],
    },

    {
        id: 'master-quang-vinh',
        name: 'Master Quang Vinh',
        title: 'Đại Sư Chiêm Tinh & Tử Vi Kết Hợp',
        specialties: ['Chiêm Tinh', 'Tử Vi', 'Thần Số Học'],
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=300&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&h=600&fit=crop',
        gallery: [],
        experience: '20 năm',
        sessionsCompleted: 4320,
        rating: 4.9,
        reviewCount: 1050,
        badges: ['MASTER', 'Top Rated'],
        availableOnline: true,
        location: 'TP.HCM',
        isPremium: true,
        social: { facebook: 'https://facebook.com', youtube: 'https://youtube.com', instagram: 'https://instagram.com', tiktok: 'https://tiktok.com' },
        bio: '20 năm kết hợp Chiêm Tinh Tây, Tử Vi Đông Phương và Thần Số Học thành hệ thống Trí Tuệ Vũ Trụ độc đáo. Hơn 4.000 buổi tư vấn thành công.',
        about: 'Master Quang Vinh là người tiên phong trong việc tổng hợp các hệ thống huyền học Đông - Tây tại Việt Nam. Ông xây dựng hệ thống "Trí Tuệ Vũ Trụ" độc đáo kết hợp chiêm tinh, tử vi và thần số học thành một thể thống nhất.',
        packages: [
            { id: 'qv-astro', name: 'Lá Số Chiêm Tinh Natal', duration: '60 phút', price: 450000, description: 'Giải mã lá số chiêm tinh từ lúc sinh — tính cách, sứ mệnh, vận hạn.', includes: ['Natal chart đầy đủ', '12 nhà chiêm tinh', 'Góc chiếu hành tinh', 'Báo cáo PDF'] },
            { id: 'qv-combo', name: 'Combo Thiên - Địa - Nhân', duration: '100 phút', price: 899000, originalPrice: 1200000, description: 'Kết hợp đồng bộ Chiêm Tinh + Tử Vi + Thần Số Học — toàn diện nhất.', includes: ['Lá số chiêm tinh đầy đủ', 'Tử vi trọn đời', 'Ma trận thần số học', 'Sứ mệnh linh hồn', 'Báo cáo 30+ trang', 'Hỗ trợ ưu tiên 30 ngày'], highlight: true },
            { id: 'qv-transit', name: 'Dự Báo Vận Hạn Năm', duration: '60 phút', price: 550000, description: 'Phân tích transit hành tinh và vận hạn chi tiết cho năm hiện tại.', includes: ['Transit các hành tinh lớn', 'Cách xảy đến theo tháng', 'Điểm mạnh + điểm cần cẩn thận', 'Chiến lược tối ưu vận hạn'] },
        ],
        testimonials: [
            { id: 'qv1', authorName: 'Thanh Bình', authorAvatar: '👩', rating: 5, content: 'Master Quang Vinh đúng là bậc thầy! Combo Thiên - Địa - Nhân cho tôi một bức tranh toàn cảnh về cuộc đời. Tôi như được nhìn thấy bản đồ cuộc đời mình.', date: '1 tuần trước', service: 'Combo Thiên - Địa - Nhân' },
            { id: 'qv2', authorName: 'Minh Khoa', authorAvatar: '👨', rating: 5, content: 'Dự báo vận hạn năm của thầy Quang Vinh chính xác đến từng tháng. Biết trước được các cột mốc giúp tôi chuẩn bị tốt hơn rất nhiều.', date: '3 tuần trước', service: 'Dự Báo Vận Hạn Năm' },
        ],
    },
];

export function getExpertById(id: string): Expert | undefined {
    return experts.find((e) => e.id === id);
}

export function formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
}
