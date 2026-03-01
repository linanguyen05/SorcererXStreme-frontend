'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, CalendarDays, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Expert, ServicePackage, formatPrice } from '@/lib/services-data';

interface PersonalInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    expert: Expert;
    selectedPackage: ServicePackage;
}

interface UserInfo {
    name: string;
    phone: string;
    email: string;
    dob: string;
    note: string;
}

export function PersonalInfoModal({ isOpen, onClose, expert, selectedPackage }: PersonalInfoModalProps) {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: '',
        phone: '',
        email: '',
        dob: '',
        note: '',
    });
    const [errors, setErrors] = useState<Partial<UserInfo>>({});

    const validate = (): boolean => {
        const newErrors: Partial<UserInfo> = {};
        if (!userInfo.name.trim()) newErrors.name = 'Vui lòng nhập họ và tên';
        if (!userInfo.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
        else if (!/^(0|\+84)[0-9]{9,10}$/.test(userInfo.phone.replace(/\s/g, '')))
            newErrors.phone = 'Số điện thoại không hợp lệ';
        if (!userInfo.email.trim()) newErrors.email = 'Vui lòng nhập email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email))
            newErrors.email = 'Email không hợp lệ';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate → save → go to /checkout-expert (chọn giờ + thanh toán ở đó)
    const handleNext = () => {
        if (!validate()) return;
        const bookingData = {
            packageId: selectedPackage.id,
            packageName: selectedPackage.name,
            duration: selectedPackage.duration,
            price: selectedPackage.price,
            originalPrice: (selectedPackage as ServicePackage & { originalPrice?: number }).originalPrice,
            expertId: expert.id,
            expertName: expert.name,
            expertAvatar: expert.avatar,
            expertCoverImage: expert.coverImage,
            expertRating: expert.rating,
            expertLocation: expert.location,
            expertSpecialties: expert.specialties,
            // user info pre-filled from this form
            userInfo,
        };
        localStorage.setItem('expert_checkout', JSON.stringify(bookingData));
        window.location.href = '/checkout-expert';
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const inputClass = (field: keyof UserInfo) =>
        `w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${errors[field]
            ? 'border-red-500/70 focus:border-red-400'
            : 'border-gray-700/60 focus:border-yellow-500/70'
        }`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-gray-900 border border-yellow-500/20 rounded-3xl w-full max-w-lg shadow-2xl shadow-yellow-900/20 overflow-hidden"
                    >
                        {/* Top gradient bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors p-1 z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                    <span className="text-yellow-400 text-xs font-medium uppercase tracking-wider">
                                        Bước 1/3 — Thông tin cá nhân
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Thông tin cá nhân</h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    Điền thông tin để chuyên gia chuẩn bị tốt nhất cho bạn
                                </p>
                            </div>

                            {/* Step progress (3 bars) */}
                            <div className="flex items-center gap-2 mb-7">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`h-1.5 rounded-full transition-all duration-300 flex-1 ${s === 1
                                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                                            : 'bg-gray-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Package mini-summary */}
                            <div className="flex items-center justify-between bg-white/[0.03] border border-yellow-500/15 rounded-xl px-4 py-2.5 mb-6">
                                <div className="flex items-center gap-2.5">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={expert.avatar} alt={expert.name}
                                        className="w-8 h-8 rounded-full object-cover border border-yellow-500/30" />
                                    <div>
                                        <p className="text-white text-xs font-semibold leading-tight">{expert.name}</p>
                                        <p className="text-gray-500 text-[10px]">{selectedPackage.name}</p>
                                    </div>
                                </div>
                                <span className="text-yellow-400 font-bold text-sm">{formatPrice(selectedPackage.price)}</span>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5 font-medium">
                                        <User className="w-3.5 h-3.5" /> Họ và tên <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nguyễn Văn A"
                                        value={userInfo.name}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, name: e.target.value });
                                            if (errors.name) setErrors({ ...errors, name: undefined });
                                        }}
                                        className={inputClass('name')}
                                    />
                                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5 font-medium">
                                        <Phone className="w-3.5 h-3.5" /> Số điện thoại <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="0901 234 567"
                                        value={userInfo.phone}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, phone: e.target.value });
                                            if (errors.phone) setErrors({ ...errors, phone: undefined });
                                        }}
                                        className={inputClass('phone')}
                                    />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5 font-medium">
                                        <Mail className="w-3.5 h-3.5" /> Email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={userInfo.email}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, email: e.target.value });
                                            if (errors.email) setErrors({ ...errors, email: undefined });
                                        }}
                                        className={inputClass('email')}
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* DOB */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5 font-medium">
                                        <CalendarDays className="w-3.5 h-3.5" /> Ngày sinh{' '}
                                        <span className="text-gray-500 font-normal">(Không bắt buộc)</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={userInfo.dob}
                                        onChange={(e) => setUserInfo({ ...userInfo, dob: e.target.value })}
                                        className={`${inputClass('dob')} [color-scheme:dark]`}
                                    />
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5 font-medium">
                                        <MessageSquare className="w-3.5 h-3.5" /> Câu hỏi / Ghi chú{' '}
                                        <span className="text-gray-500 font-normal">(Không bắt buộc)</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Bạn muốn hỏi về điều gì? (tình cảm, sự nghiệp, tài lộc...)"
                                        value={userInfo.note}
                                        onChange={(e) => setUserInfo({ ...userInfo, note: e.target.value })}
                                        className={`${inputClass('note')} resize-none`}
                                    />
                                </div>

                                <Button
                                    onClick={handleNext}
                                    className="w-full mt-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    Tiếp theo — Chọn lịch hẹn
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
