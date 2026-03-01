'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, ChevronLeft, Clock, Shield, Users, Award, Check,
    Sparkles, ChevronRight, ChevronLeft as ChevLeft, Quote,
    MapPin, Zap, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Footer } from '@/components/layout/Footer';
import { PersonalInfoModal } from '@/components/services/PersonalInfoModal';
import { experts, Expert, ServicePackage, formatPrice } from '@/lib/services-data';

const SPECIALTY_COLORS: Record<string, string> = {
    'Tarot': 'from-purple-500 to-violet-600',
    'Chiêm Tinh': 'from-blue-500 to-cyan-600',
    'Tử Vi': 'from-amber-500 to-yellow-600',
    'Thần Số Học': 'from-green-500 to-emerald-600',
    'Phong Thủy': 'from-teal-500 to-green-600',
    'Bói Bài': 'from-pink-500 to-rose-600',
    'Năng Lượng': 'from-orange-500 to-amber-600',
    'Tâm Linh': 'from-indigo-500 to-purple-600',
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
    const starClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${starClass} ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                />
            ))}
        </div>
    );
}

const REVIEWS_PER_PAGE = 5;

function RatingSummary({ testimonials }: { testimonials: { rating: number }[] }) {
    const total = testimonials.length;
    const avg = (testimonials.reduce((s, t) => s + t.rating, 0) / total).toFixed(1);
    const counts = [5, 4, 3, 2, 1].map(r => ({
        star: r,
        count: testimonials.filter(t => t.rating === r).length,
    }));
    return (
        <div className="flex flex-col sm:flex-row gap-6 p-5 bg-gray-900/50 border border-gray-700/40 rounded-2xl mb-6">
            {/* Big score */}
            <div className="flex-shrink-0 text-center px-4">
                <p className="text-5xl font-extrabold text-yellow-400 leading-none">{avg}</p>
                <StarRating rating={parseFloat(avg)} size="md" />
                <p className="text-gray-500 text-xs mt-1">{total} đánh giá</p>
            </div>
            {/* Bar chart */}
            <div className="flex-1 space-y-1.5">
                {counts.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400 w-3">{star}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                                style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
                            />
                        </div>
                        <span className="text-[11px] text-gray-500 w-4 text-right">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TestimonialsSection({ expert }: { expert: Expert }) {
    const [page, setPage] = useState(0);
    const { testimonials } = expert;
    const totalPages = Math.ceil(testimonials.length / REVIEWS_PER_PAGE);
    const pageItems = testimonials.slice(page * REVIEWS_PER_PAGE, (page + 1) * REVIEWS_PER_PAGE);

    return (
        <div>
            <RatingSummary testimonials={testimonials} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={page}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                >
                    {pageItems.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-5 hover:border-yellow-500/20 transition-colors duration-200"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-500/20 flex items-center justify-center text-xl">
                                    {t.authorAvatar}
                                </div>
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <div>
                                            <p className="font-semibold text-white text-[14px]">{t.authorName}</p>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                <StarRating rating={t.rating} />
                                                <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-medium">{t.service}</span>
                                            </div>
                                        </div>
                                        <span className="text-gray-600 text-xs flex-shrink-0">{t.date}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed mt-2.5">{t.content}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-800">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-gray-700/50 text-gray-400 text-sm font-medium hover:border-yellow-500/30 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevLeft className="w-4 h-4" /> Trước
                    </button>

                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`rounded-full transition-all duration-200 ${i === page
                                    ? 'w-6 h-2 bg-yellow-400'
                                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-gray-700/50 text-gray-400 text-sm font-medium hover:border-yellow-500/30 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Sau <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}


function PackageCard({ pkg, onSelect }: { pkg: ServicePackage; onSelect: (pkg: ServicePackage) => void }) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 ${pkg.highlight
                ? 'bg-gradient-to-b from-gray-900/90 to-black/90 border-yellow-500/50 shadow-2xl shadow-yellow-900/20'
                : 'bg-gray-900/50 border-gray-700/40 hover:border-gray-600/60'
                }`}
        >
            {pkg.highlight && (
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-500 to-amber-600 text-black text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10">PHỔ BIẾN NHẤT</div>
            )}
            {pkg.highlight && (
                <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-500/10 to-amber-600/10 blur-xl opacity-60" />
            )}
            <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className={`w-4 h-4 ${pkg.highlight ? 'text-yellow-400' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${pkg.highlight ? 'text-yellow-300' : 'text-gray-300'}`}>{pkg.duration}</span>
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${pkg.highlight ? 'text-white' : 'text-gray-100'}`}>{pkg.name}</h3>
                    <p className="text-gray-500 text-sm leading-snug">{pkg.description}</p>
                </div>
                <div className={`text-3xl font-bold mb-5 ${pkg.highlight ? 'text-yellow-400' : 'text-white'}`}>{formatPrice(pkg.price)}</div>
                <ul className="space-y-2.5 mb-6 flex-1">
                    {pkg.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${pkg.highlight ? 'bg-yellow-500/20' : 'bg-gray-700'}`}>
                                <Check className={`w-2.5 h-2.5 ${pkg.highlight ? 'text-yellow-400' : 'text-gray-400'}`} />
                            </div>
                            <span className={`text-sm leading-snug ${pkg.highlight ? 'text-gray-200' : 'text-gray-400'}`}>{item}</span>
                        </li>
                    ))}
                </ul>
                <div className={pkg.highlight ? 'relative group' : ''}>
                    {pkg.highlight && <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-300" />}
                    <Button
                        onClick={() => onSelect(pkg)}
                        className={`relative w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all ${pkg.highlight
                            ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 shadow-lg'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-gray-600/50 hover:border-gray-500'
                            }`}
                    >
                        Đặt lịch ngay
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

export function ExpertDetailClient({ expertId }: { expertId: string }) {
    const router = useRouter();
    const sidebarCollapsed = useSidebarCollapsed();
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeGalleryImg, setActiveGalleryImg] = useState<string | null>(null);

    const expert = experts.find((e) => e.id === expertId);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!mounted) return null;

    if (!expert) {
        return (
            <div className="flex h-screen bg-black text-white items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không tìm thấy chuyên gia</h1>
                    <Button onClick={() => router.push('/expert-listing')} className="bg-yellow-500 text-black">Quay lại danh sách</Button>
                </div>
            </div>
        );
    }

    const handleSelectPackage = (pkg: ServicePackage) => {
        setSelectedPackage(pkg);
        setIsModalOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-black text-white font-sans" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            <AnimatedBackground />
            <Sidebar />

            <main className="flex-1 relative z-10 overflow-auto transition-all duration-200" style={{ marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px') }}>
                {/* HERO */}
                <div className="relative h-72 md:h-96 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={expert.coverImage} alt={expert.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.push('/expert-listing')}
                        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-full text-sm transition-all hover:bg-black/60"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Danh sách
                    </motion.button>

                    <div className="absolute top-6 right-6 flex flex-wrap gap-2 justify-end">
                        {expert.badges.map((badge) => (
                            <span key={badge} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 backdrop-blur-sm uppercase tracking-wide">
                                {badge}
                            </span>
                        ))}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 flex items-end gap-5">
                        <div className="relative flex-shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full blur-sm opacity-60" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={expert.avatar} alt={expert.name} className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-yellow-400/60" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-4xl font-bold text-white leading-tight truncate">
                                {expert.name}
                            </motion.h1>
                            <p className="text-yellow-300/80 text-sm md:text-base font-medium">{expert.title}</p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <StarRating rating={expert.rating} />
                                    <span className="text-yellow-400 text-sm font-bold ml-1">{expert.rating}</span>
                                    <span className="text-gray-400 text-sm">({expert.reviewCount} đánh giá)</span>
                                </div>
                                <span className="text-gray-600">·</span>
                                <span className="text-gray-400 text-sm">{expert.sessionsCompleted.toLocaleString()} buổi xem</span>
                                <span className="text-gray-600">·</span>
                                <span className="text-gray-400 text-sm">{expert.experience} kinh nghiệm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-14">
                    {/* Specialties */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2">
                        {expert.specialties.map((spec) => (
                            <span key={spec} className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${SPECIALTY_COLORS[spec] ?? 'from-gray-600 to-gray-700'} shadow-md`}>
                                {spec}
                            </span>
                        ))}
                    </motion.div>

                    {/* Stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Award, label: 'Kinh nghiệm', value: expert.experience, color: 'text-yellow-400' },
                            { icon: Users, label: 'Buổi xem', value: expert.sessionsCompleted.toLocaleString() + '+', color: 'text-blue-400' },
                            { icon: Star, label: 'Đánh giá', value: expert.rating.toString(), color: 'text-purple-400' },
                            { icon: Shield, label: 'Đã xác thực', value: 'Uy tín', color: 'text-green-400' },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <div key={label} className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-4 text-center">
                                <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                                <p className="text-xl font-bold text-white">{value}</p>
                                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* About */}
                    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            Giới thiệu
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-base">{expert.about}</p>
                    </motion.section>

                    {/* Gallery */}
                    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-yellow-400" />
                            Hình ảnh
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            {expert.gallery.map((img, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.03 }} onClick={() => setActiveGalleryImg(img)} className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`gallery-${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* PACKAGES */}
                    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
                                <Crown className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-300 text-sm font-medium">Chọn gói tư vấn</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                Gói dịch vụ của{' '}
                                <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">{expert.name}</span>
                            </h2>
                            <p className="text-gray-400 mt-2">Chọn gói phù hợp với nhu cầu và ngân sách của bạn</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {expert.packages.map((pkg) => (
                                <PackageCard key={pkg.id} pkg={pkg} onSelect={handleSelectPackage} />
                            ))}
                        </div>
                    </motion.section>

                    {/* TESTIMONIALS */}
                    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                Phản hồi từ khách hàng
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {expert.reviewCount} đánh giá · Trung bình{' '}
                                <span className="text-yellow-400 font-semibold">{expert.rating}/5</span>
                            </p>
                        </div>
                        <TestimonialsSection expert={expert} />
                    </motion.section>

                    {/* Other Experts */}
                    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-xl font-bold text-white mb-5">Chuyên gia khác</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {experts.filter((e) => e.id !== expert.id).slice(0, 3).map((e) => (
                                <motion.div
                                    key={e.id}
                                    whileHover={{ y: -3 }}
                                    onClick={() => router.push(`/expert-listing/${e.id}`)}
                                    className="bg-gray-900/50 border border-gray-700/40 hover:border-yellow-500/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 flex items-center gap-3"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={e.avatar} alt={e.name} className="w-12 h-12 rounded-full object-cover border border-gray-600 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="font-semibold text-white text-sm truncate">{e.name}</p>
                                        <p className="text-gray-400 text-xs truncate">{e.title}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <span className="text-yellow-400 text-xs font-semibold">{e.rating}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </div>

                {/* STICKY CTA */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="sticky bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-yellow-500/20 px-4 py-4"
                >
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-white font-semibold truncate">{expert.name}</p>
                            <p className="text-gray-400 text-sm">
                                Từ <span className="text-yellow-400 font-bold">{formatPrice(Math.min(...expert.packages.map((p) => p.price)))}</span>
                            </p>
                        </div>
                        <div className="relative group flex-shrink-0">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-300" />
                            <Button
                                onClick={() => handleSelectPackage(expert.packages.find((p) => p.highlight) ?? expert.packages[0])}
                                className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-bold px-6 py-3 rounded-xl flex items-center gap-2"
                            >
                                <Crown className="w-4 h-4" />
                                Đặt lịch ngay
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <Footer forceRender={true} />

                {/* Gallery Lightbox */}
                <AnimatePresence>
                    {activeGalleryImg && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setActiveGalleryImg(null)}
                            className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        >
                            <motion.img
                                initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
                                src={activeGalleryImg} alt="gallery"
                                className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {selectedPackage && (
                <PersonalInfoModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setSelectedPackage(null); }}
                    expert={expert}
                    selectedPackage={selectedPackage}
                />
            )}
        </div>
    );
}
