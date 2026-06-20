'use client';

import { color, motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Star, Moon, Sun, ArrowRight, Zap, Shield, Heart, MessageCircle, Compass } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { useAuthStore } from '@/lib/store';  
import { useRouter } from 'next/navigation'; 

export default function LandingPage() {

    const router = useRouter();
    const { user } = useAuthStore();

    const handleNavigation = (path: string) => {
        router.push(path);
    };
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
            <Header />

            <main className="relative">
                <AnimatedBackground />

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,0,255,0.15),transparent_50%)]" />

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-300">Khám phá vận mệnh cùng AI</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight"
                            style={{ lineHeight: '1.2' }}
                        >
                            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
                                Giải Mã Bí Ẩn
                            </span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mt-4 pt-2">
                                Vũ Trụ & Bản Thân
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            Kết hợp trí tuệ nhân tạo tiên tiến với các bộ môn huyền học cổ xưa.
                            HuyenHocAI mang đến cho bạn những lời khuyên sâu sắc và chính xác nhất.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link
                                href="/auth/register"
                                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-purple-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Bắt Đầu Ngay <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link
                                href="#features"
                                className="px-8 py-4 bg-white/5 text-white rounded-full font-bold text-lg hover:bg-white/10 border border-white/10 transition-all duration-300 backdrop-blur-sm"
                            >
                                Tìm Hiểu Thêm
                            </Link>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1">
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className="w-1.5 h-1.5 rounded-full bg-white"
                            />
                        </div>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Dịch Vụ Huyền Học</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Đa dạng các phương pháp dự đoán và phân tích, được cá nhân hóa hoàn toàn cho bạn.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {[
                                {
                                    title: "Chat AI",
                                    desc: "Trải nghiệm trò chuyện với AI, giải đáp mọi thắc mắc của bạn.",
                                    icon: <MessageCircle className="w-6 h-6 text-green-400" />,
                                    color: "from-green-500/20 to-green-500/20",
                                    href: "/chat"
                                },
                                {
                                    title: "Tarot",
                                    desc: "Trải nghiệm bói bài Tarot với AI, giải mã thông điệp từ vũ trụ một cách chính xác và sâu sắc.",
                                    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
                                    color: "from-purple-500/20 to-blue-500/20",
                                    href: "/tarot"
                                },
                                {
                                    title: "Cung Hoàng Đạo",
                                    desc: "Khám phá bản đồ sao cá nhân, hiểu rõ tính cách và tiềm năng ẩn giấu qua vị trí các vì sao.",
                                    icon: <Star className="w-6 h-6 text-blue-400" />,
                                    color: "from-blue-500/20 to-cyan-500/20",
                                    href: "/astrology"
                                },
                                {
                                    title: "Tử Vi",
                                    desc: "Luận giải lá số tử vi chi tiết, dự đoán vận mệnh, công danh, tình duyên theo từng giai đoạn.",
                                    icon: <Moon className="w-6 h-6 text-yellow-400" />,
                                    color: "from-yellow-500/20 to-orange-500/20",
                                    href: "/fortune"
                                },
                                {
                                    title: "Thần Số Học",
                                    desc: "Giải mã ý nghĩa các con số trong ngày sinh và tên gọi, định hướng đường đời phù hợp nhất.",
                                    icon: <Sun className="w-6 h-6 text-pink-400" />,
                                    color: "from-pink-500/20 to-rose-500/20",
                                    href: "/numerology"
                                },
                                {
                                    title: "Dịch Vụ & Chuyên Gia",
                                    desc: "Đặt gói dịch vụ tâm linh và kết nối tư vấn 1:1 trực tiếp với các chuyên gia huyền học hàng đầu.",
                                    icon: <Compass className="w-6 h-6 text-amber-400" />,
                                    color: "from-amber-500/20 to-yellow-500/20",
                                    href: "/service-listing"
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleNavigation(feature.href)}
                                    className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden cursor-pointer"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-24 bg-gradient-to-b from-transparent to-purple-900/10">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 mb-5">
                                Giá trị cốt lõi
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                                Tại Sao Chọn{' '}
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    HuyenHocAI?
                                </span>
                            </h2>
                            <p className="text-gray-400">
                                Sự kết hợp giữa trí tuệ nhân tạo và huyền học, mang đến trải nghiệm chính xác và gần gũi.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "AI Chính Xác Cao",
                                    desc: "Sử dụng mô hình ngôn ngữ lớn được huấn luyện chuyên sâu về huyền học.",
                                    icon: <Zap className="w-6 h-6 text-yellow-400" />,
                                    glow: "from-yellow-500/20",
                                    ring: "group-hover:border-yellow-400/40"
                                },
                                {
                                    title: "Bảo Mật Tuyệt Đối",
                                    desc: "Thông tin cá nhân và câu chuyện của bạn được mã hóa và bảo vệ an toàn.",
                                    icon: <Shield className="w-6 h-6 text-green-400" />,
                                    glow: "from-green-500/20",
                                    ring: "group-hover:border-green-400/40"
                                },
                                {
                                    title: "Tận Tâm & Thấu Hiểu",
                                    desc: "Không chỉ là dự đoán, chúng tôi mang đến lời khuyên để bạn tốt hơn mỗi ngày.",
                                    icon: <Heart className="w-6 h-6 text-red-400" />,
                                    glow: "from-red-500/20",
                                    ring: "group-hover:border-red-400/40"
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className={`group relative bg-white/5 border border-white/10 ${item.ring} rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                                >
                                    <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${item.glow} to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
