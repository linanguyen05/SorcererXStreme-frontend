export interface TarotCard {
    id: number;
    name: string;
    image: string;
    suit?: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
    meaning: {
        upright: string;
        reversed: string;
        love: string;
        career: string;
    };
}

export const TAROT_DECK: TarotCard[] = [
    // --- MAJOR ARCANA (22 cards) ---
    {
        id: 0,
        name: "The Fool",
        suit: "major",
        image: "/tarot/RWS_Tarot_00_Fool.jpg",
        meaning: {
            upright: "Khởi đầu mới, tự do, ngây thơ, mạo hiểm, tiềm năng vô hạn.",
            reversed: "Bất cẩn, liều lĩnh, ngây ngô, bị lợi dụng, thiếu suy nghĩ.",
            love: "Một tình yêu mới đầy thú vị nhưng khó đoán, cảm xúc bùng nổ bất ngờ.",
            career: "Cơ hội công việc mới, khởi nghiệp, cần dám nghĩ dám làm."
        }
    },
    {
        id: 1,
        name: "The Magician",
        suit: "major",
        image: "/tarot/RWS_Tarot_01_Magician.jpg",
        meaning: {
            upright: "Kỹ năng, ý chí, sự tập trung, hành động, tháo vát.",
            reversed: "Thao túng, lừa dối, tài năng bị lãng phí, thiếu kế hoạch.",
            love: "Chủ động chinh phục, sức hút mạnh mẽ, khéo léo trong giao tiếp.",
            career: "Sử dụng kỹ năng để đạt mục tiêu, thời điểm tốt để triển khai dự án."
        }
    },
    {
        id: 2,
        name: "The High Priestess",
        suit: "major",
        image: "/tarot/RWS_Tarot_02_High_Priestess.jpg",
        meaning: {
            upright: "Trực giác, bí ẩn, tiềm thức, sự tĩnh lặng, nữ tính thần thánh.",
            reversed: "Bí mật bị lộ, phớt lờ trực giác, sống hời hợt, cảm xúc bị kìm nén.",
            love: "Tình yêu thầm kín, kết nối tâm linh sâu sắc, người phụ nữ bí ẩn.",
            career: "Lắng nghe trực giác, giữ bí mật kinh doanh, nghiên cứu sâu."
        }
    },
    {
        id: 3,
        name: "The Empress",
        suit: "major",
        image: "/tarot/RWS_Tarot_03_Empress.jpg",
        meaning: {
            upright: "Sự trù phú, mẹ thiên nhiên, sáng tạo, nuôi dưỡng, vẻ đẹp.",
            reversed: "Phụ thuộc, thiếu sáng tạo, bỏ bê bản thân, ghen tuông.",
            love: "Tình yêu nồng nàn, sự chăm sóc, khả năng mang thai hoặc sinh nở.",
            career: "Môi trường làm việc thoải mái, dự án phát triển tốt, sáng tạo nghệ thuật."
        }
    },
    {
        id: 4,
        name: "The Emperor",
        suit: "major",
        image: "/tarot/RWS_Tarot_04_Emperor.jpg",
        meaning: {
            upright: "Quyền lực, cấu trúc, ổn định, lãnh đạo, kỷ luật.",
            reversed: "Độc tài, cứng nhắc, thiếu kỷ luật, lạm quyền.",
            love: "Mối quan hệ bền vững, người đàn ông che chở nhưng hơi gia trưởng.",
            career: "Lãnh đạo, thăng chức, thiết lập quy trình, làm việc có tổ chức."
        }
    },
    {
        id: 5,
        name: "The Hierophant",
        suit: "major",
        image: "/tarot/RWS_Tarot_05_Hierophant.jpg",
        meaning: {
            upright: "Truyền thống, niềm tin, giáo dục, quy tắc xã hội.",
            reversed: "Phá vỡ quy tắc, tư duy mới lạ, đạo đức giả, bị gò bó.",
            love: "Hôn nhân truyền thống, cam kết lâu dài, làm theo lời khuyên.",
            career: "Làm việc trong tổ chức lớn, tuân thủ quy trình, học hỏi từ mentor."
        }
    },
    {
        id: 6,
        name: "The Lovers",
        suit: "major",
        image: "/tarot/RWS_Tarot_06_Lovers.jpg",
        meaning: {
            upright: "Tình yêu, sự hòa hợp, lựa chọn quan trọng, liên kết.",
            reversed: "Mâu thuẫn, chia rẽ, lựa chọn sai lầm, mất cân bằng.",
            love: "Mối quan hệ lãng mạn, tri kỷ, sự lựa chọn giữa hai người.",
            career: "Hợp tác kinh doanh, lựa chọn nghề nghiệp phù hợp đam mê."
        }
    },
    {
        id: 7,
        name: "The Chariot",
        suit: "major",
        image: "/tarot/RWS_Tarot_07_Chariot.jpg",
        meaning: {
            upright: "Chiến thắng, ý chí, kiểm soát, tiến lên phía trước, quyết tâm.",
            reversed: "Mất kiểm soát, hung hăng, thất bại, đi sai hướng.",
            love: "Chủ động theo đuổi, vượt qua rào cản để đến với nhau.",
            career: "Thành công nhờ nỗ lực, cạnh tranh thắng lợi, đi công tác."
        }
    },
    {
        id: 8,
        name: "Strength",
        suit: "major",
        image: "/tarot/RWS_Tarot_08_Strength.jpg",
        meaning: {
            upright: "Sức mạnh nội tâm, lòng trắc ẩn, kiên nhẫn, kiểm soát bản năng.",
            reversed: "Yếu đuối, thiếu tự tin, mất kiểm soát cảm xúc.",
            love: "Tình yêu bền bỉ, sự bao dung, vượt qua thử thách cùng nhau.",
            career: "Kiên trì giải quyết vấn đề, lãnh đạo bằng sự thấu hiểu."
        }
    },
    {
        id: 9,
        name: "The Hermit",
        suit: "major",
        image: "/tarot/RWS_Tarot_09_Hermit.jpg",
        meaning: {
            upright: "Cô độc, tìm kiếm nội tâm, soi đường, sự khôn ngoan.",
            reversed: "Cô lập, xa lánh xã hội, cô đơn tiêu cực, từ chối lời khuyên.",
            love: "Cần không gian riêng, suy ngẫm về mối quan hệ, độc thân vui vẻ.",
            career: "Tự nghiên cứu, làm việc độc lập, cần thời gian suy nghĩ kỹ."
        }
    },
    {
        id: 10,
        name: "Wheel of Fortune",
        suit: "major",
        image: "/tarot/RWS_Tarot_10_Wheel_of_Fortune.jpg",
        meaning: {
            upright: "May mắn, định mệnh, thay đổi, chu kỳ cuộc sống.",
            reversed: "Xui xẻo, kháng cự thay đổi, chu kỳ xấu lặp lại.",
            love: "Duyên số sắp đặt, gặp gỡ bất ngờ, thay đổi trong tình cảm.",
            career: "Cơ hội bất ngờ, thăng trầm, thời điểm vàng để thay đổi."
        }
    },
    {
        id: 11,
        name: "Justice",
        suit: "major",
        image: "/tarot/RWS_Tarot_11_Judgement.jpg",
        meaning: {
            upright: "Công lý, sự thật, cân bằng, luật nhân quả.",
            reversed: "Bất công, thiên vị, dối trá, trốn tránh trách nhiệm.",
            love: "Đối xử công bằng, sự thật được phơi bày, kết hôn hoặc ly hôn.",
            career: "Ký kết hợp đồng, giải quyết tranh chấp, đánh giá công bằng."
        }
    },
    {
        id: 12,
        name: "The Hanged Man",
        suit: "major",
        image: "/tarot/RWS_Tarot_12_Hanged_Man.jpg",
        meaning: {
            upright: "Hy sinh, góc nhìn mới, chờ đợi, buông bỏ.",
            reversed: "Hy sinh vô ích, bế tắc, cứng đầu, trì hoãn.",
            love: "Tạm dừng để suy nghĩ, hy sinh vì người khác, chờ đợi thời cơ.",
            career: "Công việc đình trệ, cần thay đổi tư duy, chấp nhận lùi một bước."
        }
    },
    {
        id: 13,
        name: "Death",
        suit: "major",
        image: "/tarot/RWS_Tarot_13_Death.jpg",
        meaning: {
            upright: "Kết thúc, chuyển hóa, thay đổi lớn, buông bỏ cái cũ.",
            reversed: "Kháng cự thay đổi, trì trệ, sợ hãi cái mới.",
            love: "Chia tay hoặc thay đổi hoàn toàn cách yêu, kết thúc giai đoạn cũ.",
            career: "Nghỉ việc, chuyển nghề, dự án kết thúc, tái cấu trúc."
        }
    },
    {
        id: 14,
        name: "Temperance",
        suit: "major",
        image: "/tarot/RWS_Tarot_14_Temperance.jpg",
        meaning: {
            upright: "Cân bằng, kiên nhẫn, hòa hợp, chữa lành.",
            reversed: "Mất cân bằng, vội vàng, xung đột, thái quá.",
            love: "Hòa hợp, thấu hiểu, kiên nhẫn với đối phương.",
            career: "Phối hợp tốt, giữ bình tĩnh, quản lý thời gian hiệu quả."
        }
    },
    {
        id: 15,
        name: "The Devil",
        suit: "major",
        image: "/tarot/RWS_Tarot_15_Devil.jpg",
        meaning: {
            upright: "Ràng buộc, cám dỗ, vật chất, nghiện ngập, bóng tối.",
            reversed: "Giải phóng, phá vỡ xiềng xích, nhận ra sự thật.",
            love: "Mối quan hệ độc hại, ám ảnh, ghen tuông, dục vọng.",
            career: "Bị ràng buộc bởi công việc, tham vọng mù quáng, môi trường xấu."
        }
    },
    {
        id: 16,
        name: "The Tower",
        suit: "major",
        image: "/tarot/RWS_Tarot_16_Tower.jpg",
        meaning: {
            upright: "Sụp đổ, tai họa bất ngờ, sự thật vỡ lở, thay đổi đột ngột.",
            reversed: "Tránh được tai họa, sụp đổ từ từ, sợ hãi thay đổi.",
            love: "Chia tay đột ngột, cãi vã lớn, sự thật gây sốc.",
            career: "Mất việc, công ty phá sản, kế hoạch đổ bể."
        }
    },
    {
        id: 17,
        name: "The Star",
        suit: "major",
        image: "/tarot/RWS_Tarot_17_Star.jpg",
        meaning: {
            upright: "Hy vọng, niềm tin, cảm hứng, chữa lành, tâm linh.",
            reversed: "Thất vọng, thiếu niềm tin, bi quan, mất phương hướng.",
            love: "Hy vọng mới trong tình yêu, chữa lành vết thương lòng.",
            career: "Cơ hội mới, cảm hứng sáng tạo, tương lai tươi sáng."
        }
    },
    {
        id: 18,
        name: "The Moon",
        suit: "major",
        image: "/tarot/RWS_Tarot_18_Moon.jpg",
        meaning: {
            upright: "Ảo tưởng, sợ hãi, tiềm thức, mơ hồ, trực giác.",
            reversed: "Giải tỏa nỗi sợ, sự thật sáng tỏ, bớt hoang mang.",
            love: "Hiểu lầm, lừa dối, cảm xúc không rõ ràng, lo lắng.",
            career: "Thiếu thông tin, môi trường làm việc mập mờ, cẩn thận lừa đảo."
        }
    },
    {
        id: 19,
        name: "The Sun",
        suit: "major",
        image: "/tarot/RWS_Tarot_19_Sun.jpg",
        meaning: {
            upright: "Niềm vui, thành công, năng lượng tích cực, sự thật, hạnh phúc.",
            reversed: "Niềm vui tạm thời, bi quan, thành công bị trì hoãn.",
            love: "Tình yêu hạnh phúc, đám cưới, sự ấm áp, rõ ràng.",
            career: "Thành công rực rỡ, được công nhận, tỏa sáng."
        }
    },
    {
        id: 20,
        name: "Judgement",
        suit: "major",
        image: "/tarot/RWS_Tarot_20_Judgement.jpg",
        meaning: {
            upright: "Phán xét, tái sinh, tiếng gọi nội tâm, tha thứ.",
            reversed: "Phán xét sai, chần chừ, không chịu thay đổi, hối tiếc.",
            love: "Quyết định quan trọng trong tình cảm, tha thứ cho người cũ.",
            career: "Đánh giá lại sự nghiệp, bước ngoặt quan trọng."
        }
    },
    {
        id: 21,
        name: "The World",
        suit: "major",
        image: "/tarot/RWS_Tarot_21_The_World.jpg",
        meaning: {
            upright: "Hoàn thành, trọn vẹn, thành tựu, du lịch, kết thúc viên mãn.",
            reversed: "Chưa hoàn thành, trì trệ, thiếu một chút để thành công.",
            love: "Hạnh phúc viên mãn, kết hôn, mối quan hệ trọn vẹn.",
            career: "Đạt được mục tiêu, hoàn thành dự án, mở rộng ra quốc tế."
        }
    },
    // --- MINOR ARCANA: WANDS (Lửa - Hành động, Đam mê) ---
    {
        id: 22,
        name: "Ace of Wands",
        suit: "wands",
        image: "/tarot/Wands01.jpg",
        meaning: {
            upright: "Khởi đầu mới, cảm hứng, năng lượng, sáng tạo.",
            reversed: "Trì hoãn, thiếu động lực, ý tưởng không thực tế.",
            love: "Tình yêu sét đánh, đam mê mới, khởi đầu lãng mạn.",
            career: "Dự án mới, cơ hội kinh doanh, ý tưởng đột phá."
        }
    },
    {
        id: 23,
        name: "Two of Wands",
        suit: "wands",
        image: "/tarot/Wands02.jpg",
        meaning: {
            upright: "Lập kế hoạch, tầm nhìn xa, quyết định, khám phá.",
            reversed: "Sợ hãi cái mới, kế hoạch kém, thiếu quyết đoán.",
            love: "Lên kế hoạch tương lai, lựa chọn đối tượng.",
            career: "Lập chiến lược, mở rộng thị trường, chuẩn bị đi xa."
        }
    },
    {
        id: 24,
        name: "Three of Wands",
        suit: "wands",
        image: "/tarot/Wands03.jpg",
        meaning: {
            upright: "Mở rộng, tầm nhìn, chờ đợi kết quả, hợp tác quốc tế.",
            reversed: "Trở ngại, thất vọng, kế hoạch bị hoãn.",
            love: "Chờ đợi người yêu, tình yêu xa, hy vọng tương lai.",
            career: "Mở rộng kinh doanh, xuất khẩu, nhìn xa trông rộng."
        }
    },
    {
        id: 25,
        name: "Four of Wands",
        suit: "wands",
        image: "/tarot/Wands04.jpg",
        meaning: {
            upright: "Ăn mừng, hạnh phúc, gia đình, ổn định, đám cưới.",
            reversed: "Mâu thuẫn gia đình, hủy bỏ tiệc tùng, thiếu ổn định.",
            love: "Đám cưới, đính hôn, cuộc sống gia đình hạnh phúc.",
            career: "Thành công bước đầu, tiệc công ty, môi trường tốt."
        }
    },
    {
        id: 26,
        name: "Five of Wands",
        suit: "wands",
        image: "/tarot/Wands05.jpg",
        meaning: {
            upright: "Cạnh tranh, xung đột, mâu thuẫn, thử thách.",
            reversed: "Tránh né xung đột, giải quyết mâu thuẫn, thỏa hiệp.",
            love: "Cãi vã, có người thứ ba, cạnh tranh tình cảm.",
            career: "Môi trường cạnh tranh, tranh luận, đấu đá nội bộ."
        }
    },
    {
        id: 27,
        name: "Six of Wands",
        suit: "wands",
        image: "/tarot/Wands06.jpg",
        meaning: {
            upright: "Chiến thắng, vinh quang, được công nhận, tự hào.",
            reversed: "Thất bại, kiêu ngạo, không được công nhận.",
            love: "Chinh phục được tình yêu, được mọi người ủng hộ.",
            career: "Thăng chức, khen thưởng, thành công dự án."
        }
    },
    {
        id: 28,
        name: "Seven of Wands",
        suit: "wands",
        image: "/tarot/Wands07.jpg",
        meaning: {
            upright: "Phòng thủ, kiên định, bảo vệ quan điểm, dũng cảm.",
            reversed: "Bỏ cuộc, bị áp đảo, yếu thế, mất vị thế.",
            love: "Bảo vệ tình yêu, đấu tranh vì người mình yêu.",
            career: "Giữ vững lập trường, đối mặt với chỉ trích."
        }
    },
    {
        id: 29,
        name: "Eight of Wands",
        suit: "wands",
        image: "/tarot/Wands08.jpg",
        meaning: {
            upright: "Tốc độ, hành động nhanh, tin tức, di chuyển.",
            reversed: "Trì hoãn, vội vàng hấp tấp, tin xấu, lỡ nhịp.",
            love: "Tình yêu tiến triển nhanh, tin nhắn dồn dập, đi du lịch cùng nhau.",
            career: "Công việc bận rộn, tiến độ nhanh, chuyến công tác."
        }
    },
    {
        id: 30,
        name: "Nine of Wands",
        suit: "wands",
        image: "/tarot/Wands09.jpg",
        meaning: {
            upright: "Kiên cường, đề phòng, mệt mỏi nhưng không bỏ cuộc.",
            reversed: "Kiệt sức, bỏ cuộc, hoang tưởng, phòng thủ thái quá.",
            love: "Tổn thương từ quá khứ, dè dặt khi yêu, cố gắng gìn giữ.",
            career: "Giai đoạn cuối dự án, mệt mỏi, cần kiên trì."
        }
    },
    {
        id: 31,
        name: "Ten of Wands",
        suit: "wands",
        image: "/tarot/Wands10.jpg",
        meaning: {
            upright: "Gánh nặng, áp lực, trách nhiệm, làm việc quá sức.",
            reversed: "Buông bỏ gánh nặng, chia sẻ công việc, sụp đổ.",
            love: "Cảm thấy nặng nề trong mối quan hệ, gánh vác quá nhiều.",
            career: "Ôm đồm công việc, stress, cần ủy quyền."
        }
    },
    {
        id: 32,
        name: "Page of Wands",
        suit: "wands",
        image: "/tarot/Wands11.jpg",
        meaning: {
            upright: "Tin tức tốt, khám phá, nhiệt huyết trẻ thơ, ý tưởng mới.",
            reversed: "Tin xấu, thiếu nhiệt huyết, trì hoãn, trẻ con.",
            love: "Tin nhắn tán tỉnh, mối tình mới chớm, phiêu lưu.",
            career: "Học hỏi cái mới, tin tức về công việc, dự án nhỏ."
        }
    },
    {
        id: 33,
        name: "Knight of Wands",
        suit: "wands",
        image: "/tarot/Wands12.jpg",
        meaning: {
            upright: "Hành động, phiêu lưu, đam mê, bốc đồng, quyến rũ.",
            reversed: "Hấp tấp, hung hăng, khoe khoang, thiếu kiên nhẫn.",
            love: "Người yêu nồng nhiệt nhưng hay thay đổi, cuộc tình chóng vánh.",
            career: "Làm việc năng nổ, thay đổi công việc, đi công tác."
        }
    },
    {
        id: 34,
        name: "Queen of Wands",
        suit: "wands",
        image: "/tarot/Wands13.jpg",
        meaning: {
            upright: "Tự tin, độc lập, quyến rũ, năng lượng, ấm áp.",
            reversed: "Ghen tuông, ích kỷ, đòi hỏi, mất tự tin.",
            love: "Người phụ nữ cuốn hút, chủ động, tình yêu nồng cháy.",
            career: "Lãnh đạo nữ, làm việc hiệu quả, truyền cảm hứng."
        }
    },
    {
        id: 35,
        name: "King of Wands",
        suit: "wands",
        image: "/tarot/Wands14.jpg",
        meaning: {
            upright: "Lãnh đạo, tầm nhìn, doanh nhân, danh dự, lôi cuốn.",
            reversed: "Độc đoán, nóng nảy, kiêu ngạo, đặt kỳ vọng quá cao.",
            love: "Người đàn ông trưởng thành, che chở, đam mê.",
            career: "Sếp lớn, khởi nghiệp thành công, người dẫn đầu."
        }
    },
    // --- MINOR ARCANA: CUPS (Nước - Cảm xúc, Tình cảm) ---
    {
        id: 36,
        name: "Ace of Cups",
        suit: "cups",
        image: "/tarot/Cups01.jpg",
        meaning: {
            upright: "Tình yêu mới, cảm xúc dạt dào, trực giác, hạnh phúc.",
            reversed: "Cảm xúc bị kìm nén, thất vọng, tình yêu đơn phương.",
            love: "Bắt đầu mối tình đẹp, cảm xúc thăng hoa, mang thai.",
            career: "Công việc yêu thích, sáng tạo, môi trường hòa đồng."
        }
    },
    {
        id: 37,
        name: "Two of Cups",
        suit: "cups",
        image: "/tarot/Cups02.jpg",
        meaning: {
            upright: "Kết đôi, hòa hợp, tình yêu, đối tác, sự cân bằng.",
            reversed: "Mất cân bằng, chia rẽ, hiểu lầm, tan vỡ.",
            love: "Tình yêu đôi lứa, sự thấu hiểu, đính hôn.",
            career: "Đối tác ăn ý, hợp đồng tốt đẹp, sự hỗ trợ."
        }
    },
    {
        id: 38,
        name: "Three of Cups",
        suit: "cups",
        image: "/tarot/Cups03.jpg",
        meaning: {
            upright: "Ăn mừng, tình bạn, hội họp, vui vẻ.",
            reversed: "Tiệc tùng quá đà, tin đồn, bị cô lập, nhóm tan rã.",
            love: "Vui vẻ bên bạn bè, tiệc cưới, mối quan hệ mở.",
            career: "Thành công nhóm, tiệc công ty, môi trường vui vẻ."
        }
    },
    {
        id: 39,
        name: "Four of Cups",
        suit: "cups",
        image: "/tarot/Cups04.jpg",
        meaning: {
            upright: "Thờ ơ, chán nản, bỏ lỡ cơ hội, suy ngẫm.",
            reversed: "Nắm bắt cơ hội, thoát khỏi sự chán nản, động lực mới.",
            love: "Chán nản trong tình yêu, từ chối lời tỏ tình.",
            career: "Chán việc, không hài lòng, bỏ qua cơ hội tốt."
        }
    },
    {
        id: 40,
        name: "Five of Cups",
        suit: "cups",
        image: "/tarot/Cups05.jpg",
        meaning: {
            upright: "Mất mát, đau khổ, hối tiếc, tập trung vào tiêu cực.",
            reversed: "Chấp nhận mất mát, chữa lành, nhìn về phía trước.",
            love: "Chia tay, thất tình, hối tiếc về quá khứ.",
            career: "Thất bại, mất tiền, thất vọng về kết quả."
        }
    },
    {
        id: 41,
        name: "Six of Cups",
        suit: "cups",
        image: "/tarot/Cups06.jpg",
        meaning: {
            upright: "Hoài niệm, quá khứ, ngây thơ, đoàn tụ, quà tặng.",
            reversed: "Mắc kẹt trong quá khứ, không chịu trưởng thành.",
            love: "Người cũ quay lại, tình yêu thanh mai trúc mã.",
            career: "Làm việc với người cũ, quay lại công ty cũ, sáng tạo."
        }
    },
    {
        id: 42,
        name: "Seven of Cups",
        suit: "cups",
        image: "/tarot/Cups07.jpg",
        meaning: {
            upright: "Ảo tưởng, lựa chọn, mơ mộng, nhiều cơ hội.",
            reversed: "Vỡ mộng, lựa chọn thực tế, tập trung.",
            love: "Kén cá chọn canh, ảo tưởng về đối phương, nhiều vệ tinh.",
            career: "Quá nhiều dự án, thiếu tập trung, mơ mộng viển vông."
        }
    },
    {
        id: 43,
        name: "Eight of Cups",
        suit: "cups",
        image: "/tarot/Cups08.jpg",
        meaning: {
            upright: "Bỏ đi, tìm kiếm ý nghĩa, thất vọng, hành trình tâm linh.",
            reversed: "Sợ thay đổi, quay lại, chấp nhận hoàn cảnh.",
            love: "Rời bỏ mối quan hệ không hạnh phúc, tìm kiếm tình yêu đích thực.",
            career: "Nghỉ việc, tìm hướng đi mới, không còn hứng thú."
        }
    },
    {
        id: 44,
        name: "Nine of Cups",
        suit: "cups",
        image: "/tarot/Cups09.jpg",
        meaning: {
            upright: "Ước nguyện thành hiện thực, hài lòng, sung túc.",
            reversed: "Tham lam, không hài lòng, tự mãn, khoe khoang.",
            love: "Hạnh phúc viên mãn, tự tin trong tình yêu.",
            career: "Thành công, đạt được điều mong muốn, thăng tiến."
        }
    },
    {
        id: 45,
        name: "Ten of Cups",
        suit: "cups",
        image: "/tarot/Cups10.jpg",
        meaning: {
            upright: "Hạnh phúc trọn vẹn, gia đình, hòa hợp, viên mãn.",
            reversed: "Gia đình bất hòa, ly thân, hạnh phúc giả tạo.",
            love: "Hôn nhân hạnh phúc, gia đình êm ấm, tri kỷ.",
            career: "Cân bằng công việc và cuộc sống, môi trường như gia đình."
        }
    },
    {
        id: 46,
        name: "Page of Cups",
        suit: "cups",
        image: "/tarot/Cups11.jpg",
        meaning: {
            upright: "Tin vui, trực giác, sáng tạo, lãng mạn, mơ mộng.",
            reversed: "Tin buồn, cảm xúc non nớt, thất vọng, bị lừa dối.",
            love: "Lời tỏ tình, tình yêu lãng mạn, người yêu trẻ con.",
            career: "Tin tức mới, ý tưởng sáng tạo, nghệ thuật."
        }
    },
    {
        id: 47,
        name: "Knight of Cups",
        suit: "cups",
        image: "/tarot/Cups12.jpg",
        meaning: {
            upright: "Lãng mạn, quyến rũ, lời đề nghị, người tình lý tưởng.",
            reversed: "Thất hứa, lừa dối tình cảm, ủ rũ, ghen tuông.",
            love: "Người yêu lãng mạn, lời cầu hôn, theo đuổi tình yêu.",
            career: "Lời mời làm việc, làm việc theo cảm hứng."
        }
    },
    {
        id: 48,
        name: "Queen of Cups",
        suit: "cups",
        image: "/tarot/Cups13.jpg",
        meaning: {
            upright: "Nhạy cảm, thấu hiểu, trực giác, quan tâm, dịu dàng.",
            reversed: "Phụ thuộc cảm xúc, thao túng, trầm cảm, hay khóc.",
            love: "Người phụ nữ giàu tình cảm, sự chăm sóc, thấu hiểu.",
            career: "Công việc chăm sóc, tư vấn, lắng nghe, nghệ thuật."
        }
    },
    {
        id: 49,
        name: "King of Cups",
        suit: "cups",
        image: "/tarot/Cups14.jpg",
        meaning: {
            upright: "Cân bằng cảm xúc, rộng lượng, khôn ngoan, ngoại giao.",
            reversed: "Lạnh lùng, thao túng, lừa dối, nghiện ngập.",
            love: "Người đàn ông tình cảm, trưởng thành, biết quan tâm.",
            career: "Lãnh đạo tâm lý, giải quyết mâu thuẫn, cố vấn."
        }
    },
    // --- MINOR ARCANA: SWORDS (Khí - Trí tuệ, Suy nghĩ) ---
    {
        id: 50,
        name: "Ace of Swords",
        suit: "swords",
        image: "/tarot/Swords01.jpg",
        meaning: {
            upright: "Đột phá, ý tưởng mới, sự thật, rõ ràng, chiến thắng.",
            reversed: "Rối trí, thiếu ý tưởng, thất bại, lời nói gây tổn thương.",
            love: "Nói rõ lòng mình, quyết định dứt khoát, khởi đầu mới.",
            career: "Ý tưởng xuất sắc, giao tiếp rõ ràng, dự án mới."
        }
    },
    {
        id: 51,
        name: "Two of Swords",
        suit: "swords",
        image: "/tarot/Swords02.jpg",
        meaning: {
            upright: "Bế tắc, lưỡng lự, trốn tránh sự thật, cân nhắc.",
            reversed: "Ra quyết định, nhìn thấy sự thật, hết bế tắc.",
            love: "Không biết chọn ai, che giấu cảm xúc, chiến tranh lạnh.",
            career: "Khó đưa ra quyết định, chờ đợi thông tin, bế tắc."
        }
    },
    {
        id: 52,
        name: "Three of Swords",
        suit: "swords",
        image: "/tarot/Swords03.jpg",
        meaning: {
            upright: "Đau khổ, chia tay, tổn thương, buồn bã, phản bội.",
            reversed: "Chữa lành, tha thứ, vượt qua nỗi đau, lạc quan.",
            love: "Tan vỡ, thất tình, bị phản bội, đau lòng.",
            career: "Thất bại, bị sa thải, mâu thuẫn gay gắt."
        }
    },
    {
        id: 53,
        name: "Four of Swords",
        suit: "swords",
        image: "/tarot/Swords04.jpg",
        meaning: {
            upright: "Nghỉ ngơi, hồi phục, thiền định, tạm dừng.",
            reversed: "Kiệt sức, không chịu nghỉ, quay lại làm việc.",
            love: "Tạm xa nhau, cần không gian riêng, nghỉ ngơi sau cãi vã.",
            career: "Nghỉ phép, kiệt sức, cần thời gian nạp năng lượng."
        }
    },
    {
        id: 54,
        name: "Five of Swords",
        suit: "swords",
        image: "/tarot/Swords05.jpg",
        meaning: {
            upright: "Xung đột, thất bại, chơi xấu, thắng nhưng mất mát.",
            reversed: "Hòa giải, hối hận, buông bỏ hận thù, kết thúc tranh cãi.",
            love: "Cãi nhau to, muốn thắng người yêu, không khí căng thẳng.",
            career: "Môi trường độc hại, bị chơi xấu, tranh giành quyền lực."
        }
    },
    {
        id: 55,
        name: "Six of Swords",
        suit: "swords",
        image: "/tarot/Swords06.jpg",
        meaning: {
            upright: "Rời bỏ, chuyển đổi, bình yên sau bão, di chuyển.",
            reversed: "Mắc kẹt, không thể rời đi, vấn đề quay lại.",
            love: "Cùng nhau vượt qua khó khăn, chuyến đi chữa lành.",
            career: "Chuyển công tác, thay đổi môi trường, tình hình tốt lên."
        }
    },
    {
        id: 56,
        name: "Seven of Swords",
        suit: "swords",
        image: "/tarot/Swords07.jpg",
        meaning: {
            upright: "Lén lút, lừa dối, chiến thuật, trốn tránh.",
            reversed: "Thú nhận, bị phát hiện, thay đổi chiến thuật.",
            love: "Ngoại tình, giấu giếm, không trung thực.",
            career: "Ăn cắp ý tưởng, làm việc thiếu minh bạch, mưu mẹo."
        }
    },
    {
        id: 57,
        name: "Eight of Swords",
        suit: "swords",
        image: "/tarot/Swords08.jpg",
        meaning: {
            upright: "Bế tắc, tự giới hạn, sợ hãi, cảm thấy bị trói buộc.",
            reversed: "Thoát khỏi bế tắc, tự do, nhìn nhận vấn đề.",
            love: "Cảm thấy ngột ngạt, không lối thoát, tự ti.",
            career: "Công việc nhàm chán, không dám thay đổi, bế tắc."
        }
    },
    {
        id: 58,
        name: "Nine of Swords",
        suit: "swords",
        image: "/tarot/Swords09.jpg",
        meaning: {
            upright: "Lo lắng, mất ngủ, ác mộng, stress, hối hận.",
            reversed: "Giải tỏa lo âu, tìm ra giải pháp, hy vọng.",
            love: "Lo lắng thái quá, nghi ngờ, dằn vặt.",
            career: "Áp lực công việc, lo sợ thất bại, mất ngủ vì việc."
        }
    },
    {
        id: 59,
        name: "Ten of Swords",
        suit: "swords",
        image: "/tarot/Swords10.jpg",
        meaning: {
            upright: "Kết thúc đau đớn, phản bội, thất bại hoàn toàn, đáy vực.",
            reversed: "Hồi phục, khởi đầu lại, tồi tệ nhất đã qua.",
            love: "Chia tay đau đớn, bị đâm sau lưng, kết thúc.",
            career: "Phá sản, mất việc, thất bại thảm hại."
        }
    },
    {
        id: 60,
        name: "Page of Swords",
        suit: "swords",
        image: "/tarot/Swords11.jpg",
        meaning: {
            upright: "Tò mò, tin tức, ý tưởng mới, cảnh giác, nói nhiều.",
            reversed: "Tin đồn, nói dối, hứa suông, thiếu kinh nghiệm.",
            love: "Theo dõi người yêu, tin nhắn, tò mò thái quá.",
            career: "Học hỏi nhanh, thu thập thông tin, phỏng vấn."
        }
    },
    {
        id: 61,
        name: "Knight of Swords",
        suit: "swords",
        image: "/tarot/Swords12.jpg",
        meaning: {
            upright: "Hành động nhanh, quyết đoán, tham vọng, thẳng thắn.",
            reversed: "Hung hăng, thô lỗ, vội vàng, bất cẩn.",
            love: "Tình yêu đến nhanh, tranh luận, lời nói sắc bén.",
            career: "Làm việc tốc độ, cạnh tranh gay gắt, quyết liệt."
        }
    },
    {
        id: 62,
        name: "Queen of Swords",
        suit: "swords",
        image: "/tarot/Swords13.jpg",
        meaning: {
            upright: "Thông minh, độc lập, sắc sảo, rõ ràng, công bằng.",
            reversed: "Cay nghiệt, lạnh lùng, phán xét, cô độc.",
            love: "Người phụ nữ lý trí, rõ ràng, không bi lụy.",
            career: "Giao tiếp giỏi, phân tích sắc bén, lãnh đạo nữ."
        }
    },
    {
        id: 63,
        name: "King of Swords",
        suit: "swords",
        image: "/tarot/Swords14.jpg",
        meaning: {
            upright: "Trí tuệ, quyền lực, logic, sự thật, kỷ luật.",
            reversed: "Độc tài, tàn nhẫn, thao túng, lạm quyền.",
            love: "Người đàn ông lý trí, ít thể hiện cảm xúc, công bằng.",
            career: "Lãnh đạo cấp cao, luật sư, chuyên gia, quyết định sáng suốt."
        }
    },
    // --- MINOR ARCANA: PENTACLES (Đất - Vật chất, Tiền bạc) ---
    {
        id: 64,
        name: "Ace of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents01.jpg",
        meaning: {
            upright: "Cơ hội tài chính, khởi đầu mới, thịnh vượng, sức khỏe.",
            reversed: "Mất cơ hội, chi tiêu hoang phí, tham lam.",
            love: "Mối quan hệ bền vững, cam kết thực tế, quà tặng.",
            career: "Dự án mới sinh lời, tăng lương, công việc mới."
        }
    },
    {
        id: 65,
        name: "Two of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents02.jpg",
        meaning: {
            upright: "Cân bằng, linh hoạt, quản lý tài chính, đa nhiệm.",
            reversed: "Mất cân bằng, rối loạn, nợ nần, quá tải.",
            love: "Cân bằng tình yêu và công việc, linh hoạt thích ứng.",
            career: "Xoay sở dòng tiền, làm nhiều việc cùng lúc."
        }
    },
    {
        id: 66,
        name: "Three of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents03.jpg",
        meaning: {
            upright: "Hợp tác, kỹ năng, chất lượng, làm việc nhóm.",
            reversed: "Thiếu hợp tác, làm việc kém, mâu thuẫn nhóm.",
            love: "Xây dựng mối quan hệ, cùng nhau phấn đấu.",
            career: "Được công nhận kỹ năng, hợp tác thành công."
        }
    },
    {
        id: 67,
        name: "Four of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents04.jpg",
        meaning: {
            upright: "Tiết kiệm, sở hữu, ổn định, kiểm soát.",
            reversed: "Keo kiệt, tham lam, mất kiểm soát, chi tiêu.",
            love: "Chiếm hữu, ghen tuông, giữ chặt người yêu.",
            career: "Giữ vị trí, không dám đầu tư, bảo thủ."
        }
    },
    {
        id: 68,
        name: "Five of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents05.jpg",
        meaning: {
            upright: "Nghèo khó, mất mát, cô lập, bệnh tật.",
            reversed: "Hồi phục tài chính, tìm được sự giúp đỡ, cải thiện.",
            love: "Cảm thấy bị bỏ rơi, khó khăn tài chính ảnh hưởng tình cảm.",
            career: "Thất nghiệp, thua lỗ, bị cô lập tại nơi làm việc."
        }
    },
    {
        id: 69,
        name: "Six of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents06.jpg",
        meaning: {
            upright: "Cho đi và nhận lại, từ thiện, hào phóng, chia sẻ.",
            reversed: "Ích kỷ, nợ nần, lợi dụng, bất công.",
            love: "Sự quan tâm, chia sẻ, hỗ trợ lẫn nhau.",
            career: "Được giúp đỡ, tăng lương, chia sẻ lợi nhuận."
        }
    },
    {
        id: 70,
        name: "Seven of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents07.jpg",
        meaning: {
            upright: "Kiên nhẫn, đầu tư, chờ đợi thu hoạch, đánh giá.",
            reversed: "Mất kiên nhẫn, đầu tư thất bại, lười biếng.",
            love: "Chờ đợi tình yêu chín muồi, xem xét lại mối quan hệ.",
            career: "Đánh giá lại kết quả, chờ đợi thành quả, kiên trì."
        }
    },
    {
        id: 71,
        name: "Eight of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents08.jpg",
        meaning: {
            upright: "Chăm chỉ, kỹ năng, chi tiết, học nghề, nỗ lực.",
            reversed: "Lười biếng, làm ẩu, thiếu tham vọng, chán nản.",
            love: "Cố gắng vun đắp tình cảm, chăm chút cho người yêu.",
            career: "Nâng cao tay nghề, làm việc tỉ mỉ, chuyên gia."
        }
    },
    {
        id: 72,
        name: "Nine of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents09.jpg",
        meaning: {
            upright: "Sung túc, độc lập, tận hưởng, sang trọng.",
            reversed: "Phụ thuộc tài chính, chi tiêu hoang phí, cô đơn.",
            love: "Độc lập trong tình yêu, yêu bản thân, tận hưởng cuộc sống.",
            career: "Thành công tài chính, nghỉ hưu, tự do tài chính."
        }
    },
    {
        id: 73,
        name: "Ten of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents10.jpg",
        meaning: {
            upright: "Giàu có, di sản, gia đình, ổn định lâu dài.",
            reversed: "Tranh chấp tài sản, gia đình tan vỡ, mất mát.",
            love: "Hôn nhân bền vững, gia đình giàu có, ổn định.",
            career: "Sự nghiệp vững chắc, thừa kế, công ty gia đình."
        }
    },
    {
        id: 74,
        name: "Page of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents11.jpg",
        meaning: {
            upright: "Cơ hội mới, học hỏi, thực tế, tin tức tài chính.",
            reversed: "Thiếu tập trung, lười biếng, tin xấu về tiền bạc.",
            love: "Mối quan hệ thực tế, chậm mà chắc, trung thành.",
            career: "Học kỹ năng mới, nhận việc mới, khởi đầu nhỏ."
        }
    },
    {
        id: 75,
        name: "Knight of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents12.jpg",
        meaning: {
            upright: "Chăm chỉ, đáng tin cậy, kiên trì, thực tế.",
            reversed: "Nhàm chán, lười biếng, cứng nhắc, trì trệ.",
            love: "Người yêu chung thủy, ổn định nhưng ít lãng mạn.",
            career: "Làm việc cần cù, tiến độ chậm nhưng chắc, trách nhiệm."
        }
    },
    {
        id: 76,
        name: "Queen of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents13.jpg",
        meaning: {
            upright: "Nuôi dưỡng, thực tế, giàu có, hào phóng, đảm đang.",
            reversed: "Ích kỷ, tham công tiếc việc, bỏ bê gia đình.",
            love: "Người phụ nữ của gia đình, chăm sóc, ổn định.",
            career: "Quản lý tài chính tốt, kinh doanh thành công, hỗ trợ."
        }
    },
    {
        id: 77,
        name: "King of Pentacles",
        suit: "pentacles",
        image: "/tarot/Pents14.jpg",
        meaning: {
            upright: "Thành đạt, giàu có, quyền lực, đáng tin cậy.",
            reversed: "Tham lam, bủn xỉn, thất bại, lạm quyền.",
            love: "Người đàn ông thành đạt, che chở, cam kết lâu dài.",
            career: "Ông chủ lớn, đầu tư thành công, đỉnh cao sự nghiệp."
        }
    }
];