'use client';

import { motion } from 'framer-motion';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Button } from '@/components/ui/Button';
import { Search, Calendar, User, ArrowRight, BookOpen, Sparkles, Star, ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const blogPosts = [
    {
        id: 1,
        title: "Tử vi năm 2026: Những biến động quan trọng cho thế hệ Gen Z",
        excerpt: "Khám phá cách các vì sao ảnh hưởng đến sự nghiệp và tài chính của bạn trong năm Bính Ngọ...",
        image: "https://maisonoffice.vn/wp-content/uploads/2026/01/Tu-vi-12-con-giap-chi-tiet.jpg",
        category: "Tử Vi",
        author: "Master Trí Đức",
        date: "20/05/2025",
        readTime: "5 phút"
    },
    {
        id: 2,
        title: "Thần số học: Ý nghĩa của con số chủ đạo 1 trong năm thế giới số 1",
        excerpt: "Năm 2026 được dự báo là năm của những khởi đầu mới. Nếu bạn sở hữu số chủ đạo 1, đây là thời điểm vàng...",
        image: "https://blog.dktcdn.net/files/than-so-hoc-la-gi-7.png",
        category: "Thần Số Học",
        author: "Huyền Học AI Team",
        date: "18/05/2025",
        readTime: "8 phút"
    },
    {
        id: 3,
        title: "Nghệ thuật Tarot: Kết nối tiềm thức qua bộ ẩn chính",
        excerpt: "Tarot không chỉ là tiên đoán, đó là tấm gương phản chiếu nội tâm. Học cách lắng nghe tiếng nói của trực giác thông qua 22 lá bài ẩn chính (Major Arcana)...",
        image: "https://cellphones.com.vn/sforum/wp-content/uploads/2022/11/tarot-la-gi-1.jpg",
        category: "Tarot",
        author: "Healer Minh Anh",
        date: "15/02/2026",
        readTime: "10 phút"
    },
    {
        id: 4,
        title: "Cân bằng Luân xa: Bí quyết duy trì năng lượng tích cực",
        excerpt: "Sự tắc nghẽn năng lượng có thể dẫn đến mệt mỏi và stress. Khám phá 7 luân xa trên cơ thể và các bài tập thiền định giúp khơi thông dòng chảy sinh mệnh...",
        image: "https://courses.embodiedphilosophy.com/cdn/shop/files/MeditationMetaphysical.jpg?v=1699697043",
        category: "Healing",
        author: "Ngọc Tâm",
        date: "12/02/2026",
        readTime: "7 phút"
    },
    {
        id: 5,
        title: "Phong thủy nhà ở: Sắp xếp không gian làm việc đón tài lộc",
        excerpt: "Góc làm việc lộn xộn ảnh hưởng đến sự tập trung. Chỉ với 3 thay đổi nhỏ về hướng bàn và cây xanh, bạn có thể gia tăng hiệu suất làm việc lên gấp đôi...",
        image: "https://images.ctfassets.net/x715brg11yrw/oQoXUhdLYqqJgQ6mhJdwf/2bf39d21abe4a4a4ae137e9983eef37c/Oakham_-_3_and_2_seater_sofa-large.jpg?w=1800&fm=webp&q=80",
        category: "Phong Thủy",
        author: "Chuyên gia Phong Thủy Việt",
        date: "10/02/2026",
        readTime: "6 phút"
    },
    {
        id: 6,
        title: "AI và Huyền học: Tương lai của việc giải mã vận mệnh",
        excerpt: "Sự kết hợp giữa dữ liệu lớn (Big Data) và tri thức cổ xưa tạo nên những kết quả chính xác đến kinh ngạc. Liệu máy móc có thể hiểu được định mệnh?",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        category: "Công Nghệ",
        author: "SorcererX Tech",
        date: "05/02/2026",
        readTime: "9 phút"
    },
    {
        id: 7,
        title: "Sao Thái Tuế 2026: Cách hóa giải xung sát cho tuổi Ngọ và tuổi Tý",
        excerpt: "Năm Bính Ngọ mang đến những thử thách lớn về tâm lý và sự nghiệp. Tìm hiểu các phương pháp hóa giải Thái Tuế bằng năng lượng và lối sống tích cực thay vì những hủ tục lạc hậu...",
        image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=800",
        category: "Tử Vi",
        author: "Master Trí Đức",
        date: "25/02/2026",
        readTime: "6 phút"
    },
    {
        id: 8,
        title: "Thanh lọc không gian sống: 5 loại cây phong thủy mang lại bình an",
        excerpt: "Không chỉ giúp làm sạch không khí, các loại cây như Lưỡi Hổ, Lan Ý hay Kim Tiền còn giúp luân chuyển dòng năng lượng 'Sát' thành 'Sinh', giúp bạn ngủ ngon và làm việc tập trung hơn...",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800",
        category: "Phong Thủy",
        author: "Chuyên gia Phong Thủy Việt",
        date: "22/02/2026",
        readTime: "4 phút"
    },
    {
        id: 9,
        title: "Hành trình The Fool: Tại sao chúng ta luôn bắt đầu từ số 0?",
        excerpt: "Lá bài đầu tiên trong bộ ẩn chính Tarot dạy chúng ta về sự can đảm của kẻ khờ. Khám phá cách chấp nhận những khởi đầu mới mà không sợ hãi sự phán xét từ thế giới bên ngoài...",
        image: "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2023/02/y-nghia-la-bai-Tarot-Fool.jpg",
        category: "Tarot",
        author: "Healer Minh Anh",
        date: "20/02/2026",
        readTime: "7 phút"
    }
];

export default function BlogPage() {
    const sidebarCollapsed = useSidebarCollapsed();
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setMounted(true);

        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-black font-sans text-white"
            style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            <AnimatedBackground />
            <Sidebar />

            <main
                className="flex-1 relative z-10 overflow-auto transition-all duration-200"
                style={{ marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px') }}
            >
                {/* Hero Section */}
                <section className="relative py-20 px-8 text-center overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Blog Huyền Học & Chữa Lành
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                            Khám phá những bài viết chuyên sâu về huyền học, chữa lành và hành trình thấu hiểu bản thân.
                        </p>

                        <div className="relative max-w-xl mx-auto">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm bài viết..."
                                className="w-full bg-white/5 border border-purple-500/20 rounded-full py-4 px-6 pl-12 focus:border-purple-500/50 outline-none transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/50 w-5 h-5" />
                        </div>
                    </motion.div>
                </section>

                {/* Categories Tab */}
                <div className="flex justify-center gap-4 mb-12 px-4 flex-wrap">
                    {['Tất cả', 'Tử Vi', 'Thần Số Học', 'Tarot', 'Phong Thủy', 'Healing', 'Công Nghệ'].map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setShowMore(false);
                            }}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${cat === selectedCategory ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured & Side Posts Layout */}
                <section className="max-w-7xl mx-auto px-8 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Featured Post (Left) */}
                        <div className="lg:col-span-2">
                            {filteredPosts.length > 0 ? (
                                <Link href={`/blog/${filteredPosts[0].id}`} className="block h-full cursor-pointer">
                                    <motion.article
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        key={filteredPosts[0].id} // Add key to force animation re-trigger when filtered
                                        className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/40 transition-all shadow-2xl h-full flex flex-col"
                                    >
                                        <div className="relative w-full aspect-video overflow-hidden">
                                            <img
                                                src={filteredPosts[0].image}
                                                alt={filteredPosts[0].title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute top-4 left-4 bg-purple-600/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold z-10">
                                                {filteredPosts[0].category}
                                            </div>
                                        </div>
                                        <div className="p-8 md:p-10 flex flex-col flex-1 justify-between">
                                            <div>
                                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 uppercase tracking-tighter font-semibold">
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {filteredPosts[0].date}</span>
                                                    <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {filteredPosts[0].readTime}</span>
                                                </div>
                                                <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-purple-300 transition-colors leading-tight">
                                                    {filteredPosts[0].title}
                                                </h2>
                                                <p className="text-gray-400 text-base md:text-lg line-clamp-3 mb-8">
                                                    {filteredPosts[0].excerpt}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                                                <span className="text-sm text-indigo-300 font-medium flex items-center gap-2">
                                                    <User className="w-4 h-4" /> {filteredPosts[0].author}
                                                </span>
                                                <span className="text-cyan-400 group-hover:text-cyan-300 p-0 flex items-center gap-2 text-sm font-semibold transition-colors">
                                                    Đọc tiếp <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            ) : (
                                <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl">
                                    <p className="text-gray-400 text-lg">Chưa có bài viết nào trong danh mục này.</p>
                                </div>
                            )}
                        </div>

                        {/* Side Posts (Right) */}
                        <div className="flex flex-col gap-6">
                            {filteredPosts.slice(1, 4).map((post, index) => (
                                <Link key={post.id} href={`/blog/${post.id}`} className="block">
                                    <motion.article
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all shadow-xl flex h-32 md:h-40 cursor-pointer"
                                    >
                                        <div className="w-2/5 relative overflow-hidden shrink-0">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="w-3/5 p-4 md:p-5 flex flex-col justify-center">
                                            <div className="text-[10px] md:text-xs text-purple-400 font-bold mb-1 md:mb-2 uppercase tracking-wider">
                                                {post.category}
                                            </div>
                                            <h3 className="text-sm md:text-base font-bold mb-1 md:mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-500 mt-auto">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 md:w-4 md:h-4" /> {post.date}</span>
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            ))}
                        </div>
                    </div>


                    {/* Load More and Hide Button */}
                    {!showMore && filteredPosts.length > 4 && (
                        <div className="flex justify-center mt-12">
                            <Button onClick={() => setShowMore(true)} variant="ghost" className="text-cyan-400 hover:text-cyan-300 p-0 flex items-center gap-2 text-sm font-semibold">
                                Xem thêm <ArrowDown className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {showMore && filteredPosts.length > 4 && (
                        <div className="flex justify-center mt-12">
                            <Button onClick={() => setShowMore(false)} variant="ghost" className="text-cyan-400 hover:text-cyan-300 p-0 flex items-center gap-2 text-sm font-semibold">
                                Ẩn các bài viết <ArrowUp className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {/* Remaining Posts (Horizontal Layout) */}
                    {showMore && filteredPosts.length > 4 && (
                        <section className="mt-16 border-t border-white/10 pt-16">
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                <Sparkles className="text-purple-400 w-6 h-6" /> Bài viết khác
                            </h3>
                            <div className="flex flex-col gap-6">
                                {filteredPosts.slice(4).map((post, index) => (
                                    <Link key={post.id} href={`/blog/${post.id}`} className="block">
                                        <motion.article
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all shadow-xl flex flex-col md:flex-row h-auto md:h-48 cursor-pointer"
                                        >
                                            <div className="md:w-1/3 relative overflow-hidden shrink-0 h-48 md:h-full">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute top-4 left-4 bg-purple-600/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold z-10">
                                                    {post.category}
                                                </div>
                                            </div>
                                            <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                                                <div className="flex items-center gap-4 text-[10px] md:text-xs text-gray-500 mb-3 uppercase tracking-tighter">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 md:w-4 md:h-4" /> {post.date}</span>
                                                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 md:w-4 md:h-4" /> {post.readTime}</span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm md:text-base line-clamp-2 mb-4 hidden md:block">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto pt-4 md:pt-0 border-t border-white/5 md:border-none">
                                                    <span className="text-xs text-indigo-300 flex items-center gap-1.5"><User className="w-3 h-3 md:w-4 md:h-4" /> {post.author}</span>
                                                </div>
                                            </div>
                                        </motion.article>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </section>

                <Footer forceRender={true} />
            </main>
        </div>
    );
}