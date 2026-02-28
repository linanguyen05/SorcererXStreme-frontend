'use client';

import { motion } from 'framer-motion';
import parse from 'html-react-parser';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Button } from '@/components/ui/Button';
import { Calendar, User, ArrowLeft, Clock, Share2, Tag, ShoppingCart, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock data 
const blogPost = {
    id: 1,
    title: "Tử vi năm 2026: Những biến động quan trọng cho thế hệ Gen Z",
    excerpt: "Khám phá cách các vì sao ảnh hưởng đến sự nghiệp và tài chính của bạn trong năm Bính Ngọ...",
    content: `
        <p>Năm Bính Ngọ 2026 mang đến một luồng năng lượng mạnh mẽ, đặc biệt ảnh hưởng đến thế hệ Gen Z - những người trẻ đang trong giai đoạn xây dựng sự nghiệp và định hình bản thân. Với hành Hỏa vượng, năm này hứa hẹn cả những cơ hội đột phá lẫn những thử thách đòi hỏi sự linh hoạt và can đảm.</p>
        <br></br>
        <h2><strong>1. Tổng quan vận hạn 2026</strong></h2>
        <p>Thế hệ Gen Z (sinh từ 1997 - 2012) sẽ cảm nhận rõ rệt sự dịch chuyển của các vì sao trong năm 2026. Sao Mộc di chuyển vào những cung hoàng đạo trọng yếu mang đến sự mở rộng về tầm nhìn, khuyến khích việc học hỏi các kỹ năng mới. Tuy nhiên, sự xung chiếu của sao Diêm Vương có thể gây ra những khủng hoảng nhỏ về định hướng.</p>
        <br></br>
        <h2><strong>2. Sự nghiệp và Tài chính</strong></h2>
        <p>Trong năm Hỏa vượng, những ngành nghề liên quan đến công nghệ, sáng tạo nội dung, và năng lượng tâm linh sẽ lên ngôi. Đây là thời kỳ bùng nổ cho những ai dám bước ra khỏi vùng an toàn. Về tài chính, cần cẩn trọng với các khoản đầu tư rủi ro cao. Việc lập ngân sách và tiết kiệm sẽ là chìa khóa để vượt qua những tháng giữa năm có biến động.</p>
        <br></br>
        <h2><strong>3. Lời khuyên cho từng mệnh</strong></h2>        
        <ul>
            <li><strong>Mệnh Kim:</strong> Cần rèn luyện sự kiên nhẫn. Sự nghiệp có thể đối mặt với áp lực lớn. Hãy tìm sự hỗ trợ từ những ngọc sa thạch hoặc thạch anh tóc vàng.</li>
            <li><strong>Mệnh Mộc:</strong> Đây là năm phát triển mạnh mẽ. Năng lượng Hỏa giúp Thủy sinh Mộc, mở ra nhiều cơ hội. Hợp với các phụ kiện bằng ngọc bích.</li>
            <li><strong>Mệnh Thủy:</strong> Cẩn thận với cảm xúc tiêu cực. Hãy duy trì thói quen thiền định và sử dụng các sản phẩm thanh tẩy không gian.</li>
            <li><strong>Mệnh Hỏa:</strong> Năm bản mệnh có thể mang đến sự bứt phá vượt bậc nếu biết kiềm chế sự nóng nảy.</li>
            <li><strong>Mệnh Thổ:</strong> Vận trình bình ổn, Thổ sinh Kim mang lại tài lộc vào cuối năm.</li>
        </ul>
        
        <p>Nhìn chung, 2026 là một năm đòi hỏi sự chuẩn bị kỹ lưỡng cả về mặt tinh thần lẫn vật chất. Việc ứng dụng phong thủy và năng lượng đá quý sẽ phần nào giúp cân bằng và thu hút trường năng lượng tích cực.</p>
    `,
    image: "https://maisonoffice.vn/wp-content/uploads/2026/01/Tu-vi-12-con-giap-chi-tiet.jpg",
    category: "Tử Vi",
    author: "Master Trí Đức",
    date: "20/05/2025",
    readTime: "5 phút",
    tags: ["GenZ", "Tử Vi 2026", "Vận Mệnh", "Phong Thủy"],
    suggestedProducts: [
        {
            id: 101,
            name: "Vòng Tay Thạch Anh Tóc Vàng",
            description: "Thu hút tài lộc, tăng cường tự tin và may mắn trong công việc. Phù hợp cho mệnh Kim và Thổ năm 2026.",
            price: "850.000đ",
            image: "https://static1.cafeland.vn/cafelandnew/hinh-anh/2022/08/11/153/thachanhtocvang1.jpg",
            link: "https://shopee.vn/search?keyword=vong%20tay%20thach%20anh%20toc%20vang" // Ví dụ link sản phẩm (có thể thay bằng link aff của bạn)
        },
        {
            id: 102,
            name: "Bộ Nhang Trầm Hương Thanh Tẩy",
            description: "Giúp thanh lọc không gian, xua tan năng lượng tiêu cực, mang lại bình an. Cần thiết cho mệnh Thủy.",
            price: "320.000đ",
            image: "https://tramhuongthienquang.com/wp-content/uploads/2015/11/nhang-nu-tram-9.jpg",
            link: "https://shopee.vn/search?keyword=nhang%20tram%20huong"
        }
    ]
};

const blogPost2 = {
    id: 2,
    title: "Thần số học: Ý nghĩa của con số chủ đạo 1 trong năm thế giới số 1",
    excerpt: "Năng lượng của số 1 sẽ tác động mạnh mẽ đến các quyết định và hướng đi của bạn trong năm tới. Cùng tìm hiểu cách khai thác tối đa sức mạnh của nó.",
    content: `
        <p>Thần số học coi số 1 là con số của sự khởi đầu, của sự độc lập và khả năng tiên phong. Khi con số chủ đạo của bạn là 1 và chúng ta đang bước vào một năm thế giới mang năng lượng số 1, thì sự cộng hưởng này sẽ tạo ra một cú hích cực kỳ mạnh mẽ.</p>

        <br></br>
        <h2><strong>1. Năng lượng của Năm Thế Giới Số 1</strong></h2>
        <p>Năm Thế giới số 1 đánh dấu sự khởi đầu của một chu kỳ 9 năm mới. Nó mang ý nghĩa của việc gieo hạt, gặt hái những ý tưởng mới, và đòi hỏi sự tự tin để bước ra khỏi vùng an toàn. Bất kỳ hạt giống nào bạn gieo trồng trong năm nay sẽ định hình toàn bộ 8 năm tiếp theo trong chu kỳ của thế giới.</p>
        
        <br></br>
        <h2><strong>2. Khi Số Chủ Đạo 1 Gặp Năm Thế Giới Số 1</strong></h2>
        <p>Sự kết hợp này được ví như "hổ mọc thêm cánh". Những người có số chủ đạo 1 vốn đã có sẵn tố chất lãnh đạo, khao khát khẳng định bản thân và ít khi chùn bước. Trong năm nay, những phẩm chất này sẽ được khuếch đại lên gấp bội.</p>
        <ul>
            <li><strong>Cơ hội:</strong> Đây là lúc tuyệt vời nhất để bắt đầu một dự án khởi nghiệp, thay đổi công việc, hay ra mắt một sản phẩm mang đậm dấu ấn cá nhân.</li>
            <li><strong>Thách thức:</strong> Cái "Tôi" (Ego) có thể trở nên quá lớn. Bạn dễ rơi vào tình trạng độc đoán, thiếu lắng nghe ý kiến xung quanh và tự rước lấy sự cô lập.</li>
        </ul>

        <br></br>
        <h2><strong>3. Lời khuyên phát triển mạnh mẽ</strong></h2>
        <p>Bạn không thiếu sức mạnh, thứ bạn cần là sự mềm mỏng để dung hòa. Người mang số 1 cần học cách không quá cực đoan. Việc sử dụng các loại đá phong thủy mang tính dịu êm sẽ giúp làm mát bớt sức nóng và sự quyết liệt bẩm sinh, cho bạn một cái nhìn tĩnh tại hơn để đưa ra quyết định.</p>
    `,
    image: "https://blog.dktcdn.net/files/than-so-hoc-la-gi-7.png",
    category: "Thần Số Học",
    author: "Huyền Học AI Team",
    date: "18/05/2025",
    readTime: "8 phút",
    tags: ["Thần Số Học", "Số Chủ Đạo 1", "Năm Thế Giới Số 1", "Khởi Nghiệp"],
    suggestedProducts: [
        {
            id: 201,
            name: "Vòng Tay Đá Aquamarine",
            description: "Aquamarine mang năng lượng của nước, giúp làm dịu cái tôi quá lớn của số 1, tăng cường khả năng giao tiếp và lắng nghe mượt mà hơn.",
            price: "650.000đ",
            image: "https://lili.vn/wp-content/uploads/2021/11/Vong-tay-da-Aquamarine-7A-nu-nam-LILI_498498_3.jpg",
            link: "https://shopee.vn/product/1207846037/24973733293?gads_t_sig=VTJGc2RHVmtYMTlxTFVSVVRrdENkYWxZMTdQTStNaG03aTlHYnZwSjk5RDlpNVlOKzlYbWxSaXhPYkVHL2JFZWd0bEN4bnh1K0krdzNNTEJEL0hHb0U5akZWeGJNcElWbDA0Q2FiZUdDMktYR1JRbWdHZ0c3WEF4NXEydC9FOVY3UE5xd25Rd2dCVlN2QS9uZjRTNkVBPT0&gad_source=1&gad_campaignid=22449815430&gbraid=0AAAAADPpQE5n4jTI2Zi6TnwR-wjjkwDlL&gclid=CjwKCAiAnoXNBhAZEiwAnItcG_ra8Ip9DVlgB1Qqi02YhrWoud5ael-_fAwtvTqY68WfDM5IjjVgAxoCzJ4QAvD_BwE"
        },
        {
            id: 202,
            name: "Tháp Văn Xương Đá Thạch Anh Trắng",
            description: "Biểu tượng của học vấn và sự minh mẫn. Đặt trên bàn làm việc để hỗ trợ những quyết định khởi đầu sáng suốt.",
            price: "1.200.000đ",
            image: "https://anphatgems.vn/wp-content/uploads/2024/04/thap-van-xuong-thach-anh-trang-m24460258.jpg",
            link: "https://hadosa.com/thap-van-xuong-thach-anh-trang-13cm-370gr?variantId=103340566&gad_source=1&gad_campaignid=23437442155&gbraid=0AAAAAouLZS9DM4HEb2pHD4xzC9vYKeN0n&gclid=CjwKCAiAnoXNBhAZEiwAnItcG-lzX1j9U3nSaJA_gJwxH4B2ajCLkdFGzzveHd6RR0s3u8N90g7lLRoCSVwQAvD_BwE"
        }
    ]
};

const mockPosts: Record<string, any> = {
    '1': blogPost,
    '2': blogPost2
};

export default function BlogDetailClient() {
    const sidebarCollapsed = useSidebarCollapsed();
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const params = useParams();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;
    const currentPost = id ? mockPosts[id] : null;

    if (!currentPost) {
        return (
            <div className="flex h-screen overflow-hidden bg-black font-sans text-white items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Oops!</h1>
                    <p className="text-gray-400 mb-8">Bài viết không tồn tại hoặc đã bị xóa.</p>
                    <Link href="/blog">
                        <Button className="bg-purple-600 hover:bg-purple-700">Quay lại danh sách</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-black font-sans text-white"
            style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            <AnimatedBackground />
            <Sidebar />

            <main
                className="flex-1 relative z-10 overflow-auto transition-all duration-200"
                style={{ marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px') }}
            >
                <article className="max-w-4xl mx-auto px-6 py-12 md:py-20 lg:px-8">
                    {/* Back Button */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-10 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                    </Link>

                    {/* Header */}
                    <header className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap items-center gap-3 mb-6"
                        >
                            <span className="bg-purple-600/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                {currentPost.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                <Clock className="w-3.5 h-3.5" /> {currentPost.readTime}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-bold leading-tight mb-8 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
                        >
                            {currentPost.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-white/10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    {currentPost.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-200">{currentPost.author}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                                        <Calendar className="w-3.5 h-3.5" /> {currentPost.date}
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" className="text-gray-400 hover:text-purple-300 p-2 rounded-full hover:bg-white/5 transition-all">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </header>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/5"
                    >
                        <img
                            src={currentPost.image}
                            alt={currentPost.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Content */}
                    <div className="prose prose-invert prose-purple max-w-none mb-16 text-gray-300 leading-relaxed 
                                   prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-100 prose-h2:mt-10 prose-h2:mb-4
                                   prose-p:mb-6 prose-p:text-lg
                                   prose-li:text-gray-300 prose-ul:space-y-3 prose-strong:text-purple-300 blog-content">
                        {parse(currentPost.content)}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-16">
                        <span className="text-sm text-gray-400 flex items-center gap-1.5 mr-2">
                            <Tag className="w-4 h-4" /> Tags:
                        </span>
                        {currentPost.tags.map((tag: string) => (
                            <Link key={tag} href={`/blog?search=${tag}`} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 hover:text-purple-300 hover:bg-purple-900/20 hover:border-purple-500/30 transition-all">
                                #{tag}
                            </Link>
                        ))}
                    </div>

                    {/* Product Recommendations */}
                    {currentPost.suggestedProducts && currentPost.suggestedProducts.length > 0 && (
                        <section className="bg-gray-900/60 border border-purple-500/20 rounded-3xl p-8 md:p-10 mb-20 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                            <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3 text-white">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                Vật phẩm phong thủy được gợi ý cho bạn
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                {currentPost.suggestedProducts.map((product: any) => (
                                    <a
                                        key={product.id}
                                        href={product.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-black/40 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:bg-black/60 transition-all shadow-lg flex flex-col h-full"
                                    >
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <span className="absolute bottom-4 left-4 font-bold text-lg text-white">
                                                {product.price}
                                            </span>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <h4 className="font-bold text-lg mb-2 text-gray-100 group-hover:text-cyan-300 transition-colors">
                                                {product.name}
                                            </h4>
                                            <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-1">
                                                {product.description}
                                            </p>
                                            <Button className="w-full bg-white/10 hover:bg-purple-600 text-white border border-white/10 hover:border-transparent transition-all mt-auto flex items-center justify-center gap-2">
                                                <ShoppingCart className="w-4 h-4" /> Mua ngay
                                            </Button>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                </article>
                <Footer forceRender={true} />
            </main>
        </div>
    );
}
