'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, MapPin, Clock, ArrowRight, Sparkles, Star, Moon, Camera, Facebook, Instagram, Award, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import toast from 'react-hot-toast';
import { updateUserAttribute, fetchAuthSession } from 'aws-amplify/auth';
import { profileApi, expertApi } from '@/lib/api-client';

const availableSpecialties = ['Tarot', 'Astrology', 'Numerology', 'Tử vi', 'Phong thủy'];

export default function SetupPage() {
    const router = useRouter();
    const { completeProfile, user, token } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Core Profile Form State
    const [formData, setFormData] = useState({
        name: '',
        gender: 'male',
        birthDate: '',
        birthTime: '',
        birthPlace: ''
    });

    // Role state
    const [role, setRole] = useState<'USER' | 'EXPERT' | 'ADMIN'>('USER');

    // Expert Info Form State
    const [bio, setBio] = useState('');
    const [experienceYears, setExperienceYears] = useState<number | ''>('');
    const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Kích thước ảnh tối đa là 2MB");
                return;
            }

            if (!token) {
                toast.error("Bạn cần đăng nhập để tải ảnh đại diện.");
                return;
            }

            const uploadToast = toast.loading("Đang tải ảnh đại diện lên server...");
            try {
                const uploadRes = await profileApi.uploadAvatar(file, token);
                const uploadedAvatarUrl = uploadRes.url || uploadRes.avatarUrl || uploadRes.data?.url || uploadRes.data?.avatarUrl || uploadRes.imageUrl;

                if (!uploadedAvatarUrl) {
                    throw new Error("Không tìm thấy URL ảnh từ kết quả trả về của API.");
                }

                setAvatar(uploadedAvatarUrl);
                toast.dismiss(uploadToast);
                toast.success("Tải ảnh đại diện thành công!");
            } catch (err: any) {
                toast.dismiss(uploadToast);
                console.error("Lỗi upload avatar:", err);
                toast.error("Không thể upload ảnh: " + (err.message || "Lỗi hệ thống"));
            }
        }
    };

    const toggleSpec = (spec: string) => {
        setSelectedSpecs(prev =>
            prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
        );
    };

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

        // Standard validation
        if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
            toast.error('Vui lòng điền đầy đủ thông tin cá nhân');
            return;
        }

        // Expert-specific validation
        if (role === 'EXPERT') {
            if (!bio.trim()) {
                toast.error('Vui lòng nhập Giới thiệu bản thân (Bio)');
                return;
            }
            if (experienceYears === '' || Number(experienceYears) < 0) {
                toast.error('Vui lòng nhập Số năm kinh nghiệm hợp lệ');
                return;
            }
            if (selectedSpecs.length === 0) {
                toast.error('Vui lòng chọn ít nhất 1 Chuyên môn');
                return;
            }
        }

        if (!token) {
            toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
            router.push('/auth/login');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Submit Core Profile to Backend Database
            await completeProfile(
                formData.name,
                formData.gender,
                formData.birthDate,
                formData.birthTime,
                formData.birthPlace,
                token
            );

            // 2. Update Cognito Attribute & Get userSub
            let userId = user?.id || 'temp-id';
            try {
                await updateUserAttribute({
                    userAttribute: {
                        attributeKey: 'custom:role',
                        value: role
                    }
                });
                // Force session refresh so tokens are updated with the custom:role claim
                const session = await fetchAuthSession({ forceRefresh: true });
                if (session.userSub) {
                    userId = session.userSub;
                }
            } catch (cognitoError) {
                console.error("Cognito attribute update failed:", cognitoError);
            }

            // 3. Update Zustand Store user object role
            const currentUser = useAuthStore.getState().user;
            if (currentUser && userId !== 'temp-id') {
                currentUser.id = userId;
            }

            useAuthStore.setState({
                user: currentUser ? {
                    ...currentUser,
                    role: role,
                    isProfileComplete: true
                } : null
            });

            // 4. Save Expert Details locally and database if Expert role is selected
            if (role === 'EXPERT') {
                // Build media_channels with only valid URLs
                const mediaChannels: Record<string, string> = {};
                if (facebook && facebook.startsWith('http')) mediaChannels.facebook = facebook;
                if (instagram && instagram.startsWith('http')) mediaChannels.instagram = instagram;

                const expertPayload: Record<string, any> = {
                    specialty: selectedSpecs.map(s => s.toUpperCase()),
                    experience_years: Number(experienceYears),
                };
                // bio must be >= 10 chars per backend validation
                if (bio && bio.length >= 10) {
                    expertPayload.bio = bio;
                }
                if (Object.keys(mediaChannels).length > 0) {
                    expertPayload.media_channels = mediaChannels;
                }

                try {
                    await expertApi.updateProfile(userId, expertPayload, token);
                } catch (apiError) {
                    console.error("Failed to update expert profile on backend:", apiError);
                    toast.error("Không thể đồng bộ hồ sơ chuyên gia lên máy chủ");
                }

                const expertProfilePayload = {
                    profile: {
                        name: formData.name,
                        title: `Chuyên gia ` + selectedSpecs.join(" & "),
                        bio: bio,
                        experience: expertPayload.experience,
                        yoe: Number(experienceYears),
                        email: user?.email || currentUser?.email || '',
                        phone: expertPayload.phone,
                        facebook: facebook || 'fb.com',
                        instagram: instagram || 'instagr.am',
                        specs: selectedSpecs,
                        price: '200.000đ'
                    },
                    avatar: avatar,
                    coverColor: 'from-purple-900/60 to-red-900/60'
                };

                localStorage.setItem(`expert-profile-data-${userId}`, JSON.stringify(expertProfilePayload));
                localStorage.setItem('expert-profile-data', JSON.stringify(expertProfilePayload));
            }
            
            // Xóa thông tin guest trong localStorage sau khi đã hoàn tất hồ sơ tài khoản chính thức
            localStorage.removeItem('guestId');
            localStorage.removeItem('guestProfile');

            toast.success('Cập nhật hồ sơ thành công!');

            // 5. Redirect based on role
            if (role === 'EXPERT') {
                router.push(`/expert/pending`);
            } else if (role === 'ADMIN') {
                router.push(`/admin/dashboard`);
            } else {
                router.push('/dashboard');
            }
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
                className="relative z-10 w-full max-w-lg my-8"
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

                        {/* Role Selection Slider */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.45 }}
                            className="space-y-2"
                        >
                            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                                Vai trò của bạn
                            </label>
                            <div className="relative flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner overflow-hidden">
                                {/* Sliding Background */}
                                <motion.div
                                    className="absolute top-1 bottom-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-purple-600/30"
                                    style={{
                                        width: 'calc(33.333% - 6px)',
                                        left: '4px',
                                    }}
                                    animate={{
                                        x: role === 'USER' ? '0%' : role === 'EXPERT' ? 'calc(100% + 6px)' : 'calc(200% + 12px)'
                                    }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                />

                                {(['USER', 'EXPERT', 'ADMIN'] as const).map((r) => {
                                    const isActive = role === r;
                                    const displayLabel = r === 'USER' ? 'Người dùng' : r === 'EXPERT' ? 'Chuyên gia' : 'Admin';
                                    return (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`relative flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                                                }`}
                                        >
                                            {displayLabel}
                                        </button>
                                    );
                                })}
                            </div>
                            <motion.p
                                key={role}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-center text-purple-300 mt-2 font-medium tracking-wide italic min-h-[20px]"
                            >
                                {role === 'USER' && '🔮 Vai trò Người dùng: Tìm kiếm tư vấn Tử Vi, Tarot, Chiêm Tinh & Thần Số Học.'}
                                {role === 'EXPERT' && '💼 Vai trò Chuyên gia: Thiết lập hồ sơ cá nhân và tư vấn các gói huyền học.'}
                                {role === 'ADMIN' && '🛡️ Vai trò Quản trị viên: Quản trị hệ thống, duyệt hồ sơ & quản lý người dùng.'}
                            </motion.p>
                        </motion.div>

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

                        {/* Conditional Expert Fields */}
                        <AnimatePresence>
                            {role === 'EXPERT' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -20 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-5 border-t border-white/10 pt-5 mt-5 overflow-hidden"
                                >
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                                        <Award size={18} />
                                        Thông tin Chuyên gia
                                    </h3>

                                    {/* Avatar Upload */}
                                    <div className="flex flex-col items-center gap-3">
                                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                            Ảnh đại diện
                                        </label>
                                        <div className="relative group/avatar cursor-pointer">
                                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 hover:border-purple-500 flex items-center justify-center overflow-hidden bg-white/5 transition-all">
                                                {avatar ? (
                                                    <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Camera className="w-8 h-8 text-gray-400 group-hover/avatar:text-purple-400 transition-colors" />
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Bio Textarea */}
                                    <div className="group relative">
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 ml-1">Giới thiệu ngắn (Bio)</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all min-h-[80px]"
                                            placeholder="Định hướng sự nghiệp, tình duyên thông qua..."
                                        />
                                    </div>

                                    {/* Experience Years */}
                                    <div className="group relative">
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 ml-1">Số năm kinh nghiệm</label>
                                        <input
                                            type="number"
                                            value={experienceYears}
                                            onChange={(e) => setExperienceYears(e.target.value === '' ? '' : Number(e.target.value))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                                            placeholder="Ví dụ: 5"
                                        />
                                    </div>

                                    {/* Specialties Selection */}
                                    <div className="group relative">
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 ml-1">Chuyên môn</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableSpecialties.map(spec => {
                                                const isSelected = selectedSpecs.includes(spec);
                                                return (
                                                    <button
                                                        key={spec}
                                                        type="button"
                                                        onClick={() => toggleSpec(spec)}
                                                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${isSelected
                                                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                                            }`}
                                                    >
                                                        {spec}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="space-y-3">
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 ml-1">Liên kết Mạng xã hội</label>

                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                                <Facebook size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={facebook}
                                                onChange={(e) => setFacebook(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                                                placeholder="Link Facebook (Ví dụ: www.facebook.com/yourname)"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                                <Instagram size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={instagram}
                                                onChange={(e) => setInstagram(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                                                placeholder="Link Instagram (Ví dụ: www.instagram.com/yourname)"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

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
