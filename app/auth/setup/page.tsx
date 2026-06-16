'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Clock, ArrowRight, Sparkles, Star, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import toast from 'react-hot-toast';

export default function SetupPage() {
    const router = useRouter();
    const { completeProfile, user, token } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        gender: 'male',
        birthDate: '',
        birthTime: '',
        birthPlace: ''
    });

    // Tự động điền thông tin từ hồ sơ guest lưu trong localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('guestProfile');
            if (stored) {
                try {
                    const guest = JSON.parse(stored);
                    
                    // Định dạng lại birth_date từ ISOString sang YYYY-MM-DD
                    let birthDateFormatted = '';
                    const rawDate = guest.birth_date || guest.birthDate;
                    if (rawDate) {
                        const date = new Date(rawDate);
                        if (!isNaN(date.getTime())) {
                            birthDateFormatted = date.toISOString().split('T')[0];
                        }
                    }

                    setFormData({
                        name: guest.name || '',
                        gender: guest.gender || 'male',
                        birthDate: birthDateFormatted,
                        birthTime: guest.birth_time || guest.birthTime || '',
                        birthPlace: guest.birth_place || guest.birthPlace || ''
                    });
                } catch (e) {
                    console.error('Failed to parse guestProfile in SetupPage:', e);
                }
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!token) {
            toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
            router.push('/auth/login');
            return;
        }

        setIsLoading(true);
        try {
            await completeProfile(
                formData.name,
                formData.gender,
                formData.birthDate,
                formData.birthTime,
                formData.birthPlace,
                token
            );
            
            // Xóa thông tin guest trong localStorage sau khi đã hoàn tất hồ sơ tài khoản chính thức
            localStorage.removeItem('guestId');
            localStorage.removeItem('guestProfile');

            toast.success('Cập nhật hồ sơ thành công!');
            router.push('/profile');
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans text-white">
            <AnimatedBackground />

            {/* Mystical Floating Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -30, 0], rotate: [0, 10, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-10 text-purple-500/20"
                >
                    <Star size={60} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 40, 0], rotate: [0, -5, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/3 right-10 text-red-500/20"
                >
                    <Moon size={90} />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg"
            >
                {/* Card Container */}
                <div className="relative backdrop-blur-xl bg-black/30 rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_-12px_rgba(255,0,0,0.25)] overflow-hidden">

                    {/* Card Glow Effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />

                    <div className="relative text-center mb-8">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        >
                            <User className="w-8 h-8 text-purple-400" />
                        </motion.div>
                        <motion.h1
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
                        >
                            Thiết lập hồ sơ
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-400 text-sm mt-2 font-light tracking-wide"
                        >
                            Để chúng tôi có thể luận giải chính xác nhất về cuộc đời bạn
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Input */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="group relative"
                        >
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 ml-1">Họ và tên</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                />
                            </div>
                        </motion.div>

                        {/* Gender Select */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.55 }}
                            className="group relative"
                        >
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 ml-1">Giới tính</label>
                            <div className="flex gap-4">
                                {['male', 'female', 'other'].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: g })}
                                        className={`flex-1 py-3 rounded-xl border transition-all ${formData.gender === g
                                                ? 'bg-purple-500/20 border-purple-500/50 text-purple-200'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác'}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Birth Date */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="group relative"
                            >
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 ml-1">Ngày sinh</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </motion.div>

                            {/* Birth Time */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.65 }}
                                className="group relative"
                            >
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 ml-1">Giờ sinh</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                        <Clock size={18} />
                                    </div>
                                    <input
                                        type="time"
                                        value={formData.birthTime}
                                        onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Birth Place */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="group relative"
                        >
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 ml-1">Nơi sinh</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={formData.birthPlace}
                                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                                    placeholder="Tỉnh/Thành phố"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="pt-4"
                        >
                            <button
                                type="submit"
                                className="w-full relative group overflow-hidden rounded-xl p-[1px]"
                                disabled={isLoading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-gradient-xy opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="relative bg-gray-900/90 hover:bg-gray-900/80 rounded-xl py-4 px-6 transition-all duration-300 flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="font-medium bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Hoàn tất hồ sơ</span>
                                            <ArrowRight size={18} className="text-purple-200" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </motion.div>

                    </form>
                </div>
            </motion.div>
        </div>
    );
}
