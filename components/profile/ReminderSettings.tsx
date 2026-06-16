'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Clock, Check, Loader2, BellRing, BellOff, Sparkles, XCircle } from 'lucide-react';
import { reminderApi } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';

export function ReminderSettings() {
    const { token, user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        emailEnabled: false,
        email: user?.email || '',
    });

    // Sub-notification categories state
    const [categories, setCategories] = useState({
        dailyHoroscope: true,
        appointments: true,
        transactions: true,
    });

    // 1. Load settings từ Backend & localStorage
    useEffect(() => {
        const loadSettings = async () => {
            if (!token) return;
            try {
                const data = await reminderApi.get(token);
                // Backend trả về field: is_subscribed
                const isSubscribed = data.is_subscribed ?? false;
                setSettings({
                    emailEnabled: isSubscribed,
                    email: user?.email || '',
                });

                // Load categories from localStorage if exists
                if (typeof window !== 'undefined') {
                    const storedCats = localStorage.getItem(`email_cats_${user?.email}`);
                    if (storedCats) {
                        setCategories(JSON.parse(storedCats));
                    } else if (!isSubscribed) {
                        // If backend is unsubscribed, sync categories to false
                        setCategories({
                            dailyHoroscope: false,
                            appointments: false,
                            transactions: false,
                        });
                    }
                }
            } catch (error) {
                console.log('No existing settings found, using defaults');
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, [token, user?.email]);

    // 2. Logic cập nhật (Đăng ký / Hủy đăng ký)
    const handleUpdateStatus = async (shouldSubscribe: boolean) => {
        if (!token) {
            toast.error('Vui lòng đăng nhập lại');
            return;
        }

        setSaving(true);
        try {
            // Khớp với updateReminderSchema của Backend
            const payload = {
                is_subscribed: shouldSubscribe
            };

            const response = await reminderApi.update(payload, token);

            // Cập nhật state local dựa trên kết quả trả về từ Backend
            const updatedStatus = response.settings?.is_subscribed ?? shouldSubscribe;

            setSettings(prev => ({ ...prev, emailEnabled: updatedStatus }));
            toast.success(response.message || 'Cập nhật thành công');

            // Synchronize categories if unsubscribed
            if (!updatedStatus) {
                const offCats = { dailyHoroscope: false, appointments: false, transactions: false };
                setCategories(offCats);
                if (typeof window !== 'undefined') {
                    localStorage.setItem(`email_cats_${user?.email}`, JSON.stringify(offCats));
                }
            } else {
                // If subscribed, enable all if they were all false
                const allDisabled = !categories.dailyHoroscope && !categories.appointments && !categories.transactions;
                if (allDisabled) {
                    const onCats = { dailyHoroscope: true, appointments: true, transactions: true };
                    setCategories(onCats);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(`email_cats_${user?.email}`, JSON.stringify(onCats));
                    }
                }
            }

        } catch (error: any) {
            console.error('Update Error:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật';
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleCategory = async (key: keyof typeof categories) => {
        const nextCats = {
            ...categories,
            [key]: !categories[key]
        };
        setCategories(nextCats);
        
        if (typeof window !== 'undefined') {
            localStorage.setItem(`email_cats_${user?.email}`, JSON.stringify(nextCats));
        }

        // Determine if we should change main is_subscribed status
        const atLeastOneChecked = nextCats.dailyHoroscope || nextCats.appointments || nextCats.transactions;
        if (atLeastOneChecked && !settings.emailEnabled) {
            await handleUpdateStatus(true);
        } else if (!atLeastOneChecked && settings.emailEnabled) {
            await handleUpdateStatus(false);
        } else {
            toast.success('Đã lưu tùy chọn nhận tin');
        }
    };

    const confirmUnsubscribe = () => {
        if (confirm('Bạn có chắc chắn muốn ngừng nhận thông báo không?')) {
            handleUpdateStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl w-full rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/10 shadow-xl mb-8 relative overflow-hidden"
        >
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            {/* Header Section*/}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 relative z-10">
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Icon Ring Bell*/}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-black/50 transition-all duration-500 ${settings.emailEnabled
                            ? 'bg-gradient-to-br from-green-400 to-emerald-600 rotate-6 shadow-green-500/20'
                            : 'bg-gradient-to-br from-gray-600 to-gray-800 -rotate-6'
                        }`}>
                        {settings.emailEnabled ? (
                            <BellRing className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
                        ) : (
                            <BellOff className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg md:text-2xl font-bold text-white">Thông báo Email</h2>
                        <p className={`flex items-center gap-2 text-sm md:text-base ${settings.emailEnabled ? 'text-green-400' : 'text-gray-400'}`}>
                            <Sparkles className="w-4 h-4" />
                            {settings.emailEnabled ? 'Đang hoạt động' : 'Chưa đăng ký'}
                        </p>
                    </div>
                </div>

                {/* Nút bật/tắt nhanh*/}
                {!settings.emailEnabled ? (
                    <Button
                        onClick={() => handleUpdateStatus(true)}
                        disabled={saving}
                        variant="secondary"
                        size="sm"
                        className="backdrop-blur-md bg-blue-500/20 hover:bg-blue-500/40 border-blue-500/30 text-blue-200"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Đăng ký ngay
                    </Button>
                ) : (
                    <Button
                        onClick={confirmUnsubscribe}
                        disabled={saving}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10 border border-red-500/20"
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Hủy đăng ký
                    </Button>
                )}
            </div>

            {/* Body Section: Email Badge & Info */}
            <div className="relative z-10 space-y-6">
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {settings.emailEnabled
                        ? "Tuyệt vời! Bạn sẽ nhận được thông điệp chữa lành vào hòm thư mỗi sáng."
                        : "Nhận lời dẫn lối từ vũ trụ trực tiếp vào hòm thư của bạn lúc 08:00 mỗi ngày."
                    }
                </p>

                <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-black/30 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${settings.emailEnabled ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                        <Mail className={`w-5 h-5 ${settings.emailEnabled ? 'text-green-400' : 'text-blue-400'}`} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Địa chỉ nhận tin</p>
                        <p className="text-sm md:text-base text-blue-100 truncate font-medium italic">{user?.email}</p>
                    </div>
                </div>

                {/* Email categories toggle switches */}
                <AnimatePresence>
                    {settings.emailEnabled && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden space-y-4 pt-6 border-t border-white/10"
                        >
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-black">Phân loại nhận thông báo</p>
                            
                            <div className="grid grid-cols-1 gap-3">
                                {/* Category 1: Daily Horoscope */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-purple-500/30 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Sparkles className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Vận mệnh & Thông điệp vũ trụ</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Lời khuyên tarot, tử vi và chiêm tinh học hàng ngày</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={categories.dailyHoroscope} 
                                            onChange={() => handleToggleCategory('dailyHoroscope')} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-10 h-6 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-purple-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500/20 border border-white/10"></div>
                                    </label>
                                </div>

                                {/* Category 2: Appointments */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-blue-500/30 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Lịch hẹn & Tư vấn</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Thông báo về lịch hẹn sắp diễn ra, thay đổi trạng thái duyệt</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={categories.appointments} 
                                            onChange={() => handleToggleCategory('appointments')} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-10 h-6 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-blue-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500/20 border border-white/10"></div>
                                    </label>
                                </div>

                                {/* Category 3: System / Promos */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-green-500/30 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-green-300 transition-colors">Ưu đãi VIP & Bản tin hệ thống</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Các thông báo cập nhật tính năng mới và chương trình tri ân</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={categories.transactions} 
                                            onChange={() => handleToggleCategory('transactions')} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-10 h-6 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-green-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/20 border border-white/10"></div>
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Info ẩn hiện mượt mà */}
                <AnimatePresence>
                    {settings.emailEnabled && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-xs text-green-500/60 font-medium pl-2"
                        >
                            <Clock className="w-3 h-3" />
                            <span>Lịch gửi cố định: 08:00 AM hàng ngày</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
