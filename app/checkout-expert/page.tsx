'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Star, Clock, Calendar, CreditCard, QrCode,
    CheckCircle2, ArrowLeft, MapPin, Phone, Mail,
    Shield, Sparkles, MessageSquare, ChevronLeft, ChevronRight,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { useEffect, useState, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookedPackage {
    packageId: string;
    packageName: string;
    duration: string;
    price: number;
    originalPrice?: number;
    expertId: string;
    expertName: string;
    expertAvatar?: string;
    expertCoverImage?: string;
    expertRating?: number;
    expertLocation?: string;
    expertSpecialties?: string[];
}
interface UserInfo {
    name: string;
    phone: string;
    email: string;
    dob: string;
    note: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const VN_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const VN_MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

const TIME_SLOTS = [
    { time: '08:00', end: '09:30', period: 'Sáng' },
    { time: '10:00', end: '11:30', period: 'Sáng' },
    { time: '13:00', end: '14:30', period: 'Chiều' },
    { time: '15:00', end: '16:30', period: 'Chiều' },
    { time: '19:00', end: '20:30', period: 'Tối' },
    { time: '21:00', end: '22:00', period: 'Tối' },
];

const FALLBACK: BookedPackage = {
    packageId: 'demo-1', packageName: 'Tư Vấn Chuyên Sâu', duration: '60 phút',
    price: 450000, originalPrice: 600000, expertId: 'tri-duc',
    expertName: 'Master Trí Đức', expertRating: 4.9,
    expertLocation: 'Hà Nội', expertSpecialties: ['Tử Vi', 'Phong Thủy'],
};

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// ─── Step Bar ────────────────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
    const steps = [
        { label: 'Thông tin', sublabel: 'Bước 1' },
        { label: 'Chọn lịch hẹn', sublabel: 'Bước 2' },
        { label: 'Xác nhận & Thanh toán', sublabel: 'Bước 3' },
    ];
    return (
        <div className="flex items-start justify-center gap-0 mb-10 select-none">
            {steps.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                    <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                                ${done ? 'bg-yellow-500 border-yellow-500 text-black' :
                                    active ? 'bg-purple-500/20 border-purple-500 text-purple-200' :
                                        'bg-transparent border-gray-700 text-gray-600'}`}>
                                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                            </div>
                            <div className="mt-1.5 text-center hidden sm:block max-w-[80px]">
                                <p className={`text-[9px] font-semibold ${active ? 'text-purple-300' : done ? 'text-yellow-400/70' : 'text-gray-600'}`}>{s.sublabel}</p>
                                <p className={`text-[10px] leading-tight ${active ? 'text-white' : done ? 'text-gray-500' : 'text-gray-600'}`}>{s.label}</p>
                            </div>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`h-px w-12 sm:w-20 mx-1 mt-[-18px] sm:mt-[-28px] transition-all duration-500 ${i < step ? 'bg-yellow-500' : 'bg-gray-800'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Mini expert card ────────────────────────────────────────────────────────
function ExpertCard({ booked }: { booked: BookedPackage }) {
    const discountPct = booked.originalPrice ? Math.round((1 - booked.price / booked.originalPrice) * 100) : 0;
    return (
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden shadow-xl mb-6">
            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
            <div className="p-4 flex items-center gap-4">
                {booked.expertCoverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={booked.expertCoverImage} alt={booked.expertName} className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500/30 flex-shrink-0" />
                ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-purple-300" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h2 className="text-white font-bold text-sm">{booked.expertName}</h2>
                        {booked.expertRating && <span className="flex items-center gap-0.5 text-yellow-400 text-xs font-semibold"><Star className="w-3 h-3 fill-yellow-400" />{booked.expertRating}</span>}
                        {booked.expertLocation && <span className="flex items-center gap-0.5 text-gray-400 text-xs"><MapPin className="w-3 h-3" />{booked.expertLocation}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-300 font-semibold text-xs">{booked.packageName}</span>
                        <span className="text-gray-500 text-xs flex items-center gap-0.5"><Clock className="w-3 h-3" />{booked.duration}</span>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    {booked.originalPrice && (
                        <div className="flex items-center gap-1 justify-end mb-0.5">
                            <span className="text-xs text-gray-500 line-through">{formatPrice(booked.originalPrice)}</span>
                            <span className="text-[10px] font-bold text-red-400 bg-red-500/15 px-1 py-0.5 rounded">-{discountPct}%</span>
                        </div>
                    )}
                    <span className="text-base font-bold text-yellow-400">{formatPrice(booked.price)}</span>
                </div>
            </div>
        </div>
    );
}

// ─── Month Calendar ───────────────────────────────────────────────────────────
function MonthCalendar({
    selectedDate, onSelect, selectedTime, onSelectTime,
}: {
    selectedDate: Date | null;
    onSelect: (d: Date) => void;
    selectedTime: string;
    onSelectTime: (t: string) => void;
}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // group time slots by period
    const periods = ['Sáng', 'Chiều', 'Tối'];

    return (
        <div className="space-y-5">
            {/* Calendar grid */}
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
                <div className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 opacity-50" />
                <div className="p-5">
                    {/* Month nav */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h3 className="text-white font-bold text-sm">
                            {VN_MONTHS[viewMonth]} {viewYear}
                        </h3>
                        <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {VN_DAYS.map((d, i) => (
                            <div key={d} className={`text-center text-[10px] font-semibold py-1 ${i === 0 ? 'text-red-400' : 'text-gray-500'}`}>{d}</div>
                        ))}
                    </div>

                    {/* Date cells */}
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} />;
                            const isPast = day < today;
                            const isSun = day.getDay() === 0;
                            const disabled = isPast || isSun;
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isToday = isSameDay(day, today);

                            return (
                                <button
                                    key={day.toISOString()}
                                    disabled={disabled}
                                    onClick={() => onSelect(day)}
                                    className={`
                                        aspect-square rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center leading-none
                                        ${disabled ? 'text-gray-700 cursor-not-allowed' :
                                            isSelected ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] font-bold scale-105' :
                                                isToday ? 'bg-purple-500/10 border border-purple-500/40 text-purple-300 hover:bg-purple-500/20' :
                                                    isSun ? 'text-red-400/40' :
                                                        'text-gray-300 hover:bg-white/10 hover:text-white'}
                                    `}
                                >
                                    {day.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-800/50">
                        <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                            <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" />Đã chọn
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                            <span className="w-2.5 h-2.5 rounded border border-purple-500/40 bg-purple-500/10 inline-block" />Hôm nay
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                            <span className="w-2.5 h-2.5 rounded bg-gray-800 inline-block" />Không khả dụng
                        </span>
                    </div>
                </div>
            </div>

            {/* Time slots — shown after date selected */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden shadow-xl"
                    >
                        <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 opacity-40" />
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-wider">
                                    Khung giờ —{' '}
                                    <span className="text-white normal-case tracking-normal text-sm">
                                        {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                                    </span>
                                </h3>
                            </div>
                            {periods.map(period => {
                                const slots = TIME_SLOTS.filter(s => s.period === period);
                                return (
                                    <div key={period} className="mb-4 last:mb-0">
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{period}</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {slots.map(slot => {
                                                const label = `${slot.time} – ${slot.end}`;
                                                const sel = selectedTime === label;
                                                return (
                                                    <button key={label} onClick={() => onSelectTime(label)}
                                                        className={`flex flex-col items-center py-3 px-2 rounded-xl border transition-all duration-200
                                                            ${sel ? 'bg-yellow-500/20 border-yellow-500/60 text-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                                                                'bg-white/[0.03] border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-white/[0.06] hover:text-gray-200'}`}>
                                                        <span className="text-sm font-bold">{slot.time}</span>
                                                        <span className="text-[9px] text-gray-500 mt-0.5">đến {slot.end}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Input style ─────────────────────────────────────────────────────────────
const inp = "w-full bg-white/[0.04] border border-gray-700 focus:border-purple-500/70 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-all text-sm";
const inpErr = "border-red-500/60 focus:border-red-400";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CheckoutExpertPage() {
    const router = useRouter();
    const sidebarCollapsed = useSidebarCollapsed();
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState(0); // 0=info, 1=calendar, 2=confirm+pay
    const [booked, setBooked] = useState<BookedPackage>(FALLBACK);
    const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', phone: '', email: '', dob: '', note: '' });
    const [errors, setErrors] = useState<Partial<UserInfo>>({});
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [paid, setPaid] = useState(false);

    // derive display values
    const formattedDate = useMemo(() =>
        selectedDate?.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) ?? '',
        [selectedDate]);

    useEffect(() => {
        setMounted(true);
        const resize = () => setIsMobile(window.innerWidth < 768);
        resize();
        window.addEventListener('resize', resize);
        try {
            const raw = localStorage.getItem('expert_checkout');
            if (raw) {
                const parsed = JSON.parse(raw);
                const { userInfo: saved, ...rest } = parsed as BookedPackage & { userInfo?: UserInfo };
                setBooked(rest as BookedPackage);
                if (saved) setUserInfo(saved);
                localStorage.removeItem('expert_checkout');
            }
            const legacySvc = localStorage.getItem('checkout_service');
            if (legacySvc) {
                const svc = JSON.parse(legacySvc);
                setBooked({ packageId: svc.packageId || 'x', packageName: svc.packageName || svc.name || '', duration: svc.duration || '', price: svc.price || 0, originalPrice: svc.originalPrice, expertId: svc.expertId || '', expertName: svc.expert || svc.expertName || '', expertRating: svc.expertRating, expertLocation: svc.expertLocation, expertSpecialties: svc.expertSpecialties });
                localStorage.removeItem('checkout_service');
            }
            const savedUser = localStorage.getItem('checkout_user_info');
            if (savedUser) { setUserInfo(JSON.parse(savedUser)); localStorage.removeItem('checkout_user_info'); }
        } catch (_) { }
        return () => window.removeEventListener('resize', resize);
    }, []);

    if (!mounted) return null;

    // ── Validate step 0 ──
    const validateInfo = () => {
        const e: Partial<UserInfo> = {};
        if (!userInfo.name.trim()) e.name = 'Vui lòng nhập họ và tên';
        if (!userInfo.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
        else if (!/^(0|\+84)[0-9]{8,10}$/.test(userInfo.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ';
        if (!userInfo.email.trim()) e.email = 'Vui lòng nhập email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) e.email = 'Email không hợp lệ';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const field = (k: keyof UserInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserInfo(prev => ({ ...prev, [k]: e.target.value }));
        if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
    };

    // ── Success ──
    if (paid) {
        return (
            <div className="flex h-screen overflow-hidden bg-black text-white">
                <AnimatedBackground />
                <Sidebar />
                <main className="flex-1 relative z-10 overflow-auto" style={{ marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px') }}>
                    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                            <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-6 mx-auto">
                                <CheckCircle2 className="w-12 h-12 text-green-400" />
                            </div>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-bold text-green-400 mb-2">Đặt lịch thành công!</motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-gray-400 text-sm mb-1">
                            Bạn đã đặt <span className="text-yellow-300 font-semibold">{booked.packageName}</span> với <span className="text-white font-semibold">{booked.expertName}</span>
                        </motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="text-purple-400 text-sm font-semibold mb-8">
                            📅 {formattedDate} &nbsp;·&nbsp; 🕐 {selectedTime}
                        </motion.p>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-3 justify-center">
                            <Button onClick={() => router.push('/service-listing?tab=experts')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-xl text-sm">Xem thêm chuyên gia</Button>
                            <Button onClick={() => router.push('/')} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold px-6 py-2.5 rounded-xl text-sm">Về trang chủ</Button>
                        </motion.div>
                    </div>
                </main>
            </div>
        );
    }

    const sidebarWidth = isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px');
    const STEP_TITLES = ['Thông tin khách hàng', 'Chọn lịch hẹn', 'Xác nhận & Thanh toán'];

    return (
        <div className="flex h-screen overflow-hidden bg-black text-white" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            <AnimatedBackground />
            <Sidebar />
            <main className="flex-1 relative z-10 overflow-auto transition-all duration-200" style={{ marginLeft: sidebarWidth }}>
                <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">

                    {/* Back */}
                    <button onClick={() => step === 0 ? router.back() : setStep(s => s - 1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mb-6 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {step === 0 ? 'Quay lại' : 'Bước trước'}
                    </button>

                    {/* Header */}
                    <motion.div key={step} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-purple-300 text-xs font-semibold">Đặt lịch tư vấn 1:1</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            {STEP_TITLES[step]}
                        </h1>
                    </motion.div>

                    <StepBar step={step} />

                    {/* Expert card — always visible */}
                    <ExpertCard booked={booked} />

                    {/* ══════════════════════════════════════════════════════════
                        BƯỚC 1 — Thông tin khách hàng
                    ══════════════════════════════════════════════════════════ */}
                    {step === 0 && (
                        <motion.div key="step0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-yellow-500/20 shadow-xl overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400 opacity-50" />
                                <div className="p-6 space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 font-medium">
                                            <User className="w-3.5 h-3.5" /> Họ và tên <span className="text-red-400">*</span>
                                        </label>
                                        <input type="text" placeholder="Nguyễn Văn A" value={userInfo.name} onChange={field('name')}
                                            className={`${inp} ${errors.name ? inpErr : ''}`} />
                                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    {/* Phone + Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 font-medium">
                                                <Phone className="w-3.5 h-3.5" /> Số điện thoại <span className="text-red-400">*</span>
                                            </label>
                                            <input type="tel" placeholder="0912 345 678" value={userInfo.phone} onChange={field('phone')}
                                                className={`${inp} ${errors.phone ? inpErr : ''}`} />
                                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 font-medium">
                                                <Mail className="w-3.5 h-3.5" /> Email <span className="text-red-400">*</span>
                                            </label>
                                            <input type="email" placeholder="email@example.com" value={userInfo.email} onChange={field('email')}
                                                className={`${inp} ${errors.email ? inpErr : ''}`} />
                                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                    </div>
                                    {/* DOB */}
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 font-medium">
                                            <Calendar className="w-3.5 h-3.5" /> Ngày sinh
                                            <span className="text-gray-600 text-[10px] font-normal">(tùy chọn — giúp chuyên gia đọc lá số chính xác hơn)</span>
                                        </label>
                                        <input type="date" value={userInfo.dob} onChange={field('dob')}
                                            className={`${inp} [color-scheme:dark]`} />
                                    </div>
                                    {/* Note */}
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 font-medium">
                                            <MessageSquare className="w-3.5 h-3.5" /> Câu hỏi / Vấn đề muốn tư vấn
                                            <span className="text-gray-600 text-[10px] font-normal">(tùy chọn)</span>
                                        </label>
                                        <textarea rows={3} placeholder="Tình cảm, sự nghiệp, tài lộc, sức khoẻ... bạn muốn hỏi gì?" value={userInfo.note} onChange={field('note')}
                                            className={`${inp} resize-none`} />
                                    </div>
                                    <Button onClick={() => { if (validateInfo()) setStep(1); }}
                                        className="w-full mt-2 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl uppercase tracking-wide transition-all">
                                        Chọn lịch hẹn
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════════════════════
                        BƯỚC 2 — Chọn lịch hẹn (tháng + giờ)
                    ══════════════════════════════════════════════════════════ */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
                            <MonthCalendar
                                selectedDate={selectedDate}
                                onSelect={d => { setSelectedDate(d); setSelectedTime(''); }}
                                selectedTime={selectedTime}
                                onSelectTime={setSelectedTime}
                            />
                            <div className="mt-5">
                                <Button
                                    disabled={!selectedDate || !selectedTime}
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl uppercase tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                    {selectedDate && selectedTime
                                        ? `Tiếp theo`
                                        : 'Chọn ngày và khung giờ để tiếp tục'}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════════════════════
                        BƯỚC 3 — Xác nhận toàn bộ + Thanh toán
                    ══════════════════════════════════════════════════════════ */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">

                            {/* Summary grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Thông tin khách hàng */}
                                <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-yellow-500/20 overflow-hidden shadow-lg">
                                    <div className="h-0.5 bg-gradient-to-r from-yellow-500 to-amber-400 opacity-50" />
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-wider">👤 Thông tin</h3>
                                            <button onClick={() => setStep(0)} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors">✏️ Sửa</button>
                                        </div>
                                        <div className="space-y-2.5 text-sm">
                                            {[
                                                { icon: <User className="w-3 h-3" />, v: userInfo.name },
                                                { icon: <Phone className="w-3 h-3" />, v: userInfo.phone },
                                                { icon: <Mail className="w-3 h-3" />, v: userInfo.email },
                                                ...(userInfo.dob ? [{ icon: <Calendar className="w-3 h-3" />, v: userInfo.dob }] : []),
                                            ].map(({ icon, v }, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs">
                                                    <span className="text-gray-500 flex-shrink-0">{icon}</span>
                                                    <span className="text-gray-200 truncate">{v}</span>
                                                </div>
                                            ))}
                                            {userInfo.note && (
                                                <div className="flex items-start gap-2 text-xs pt-2 border-t border-gray-800">
                                                    <MessageSquare className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-400 italic line-clamp-2">{userInfo.note}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Lịch hẹn */}
                                <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden shadow-lg">
                                    <div className="h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-50" />
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-purple-400 font-bold text-xs uppercase tracking-wider">📅 Lịch hẹn</h3>
                                            <button onClick={() => setStep(1)} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors">✏️ Sửa</button>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-2 text-xs">
                                                <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                                <span className="text-gray-200">{formattedDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                                <span className="text-yellow-300 font-semibold">{selectedTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Zap className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                                <span className="text-gray-200">{booked.packageName} · {booked.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thanh toán */}
                            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
                                <div className="h-0.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 opacity-40" />
                                <div className="p-5 sm:p-6">
                                    <div className="flex items-center gap-2 text-yellow-400 mb-5">
                                        <CreditCard className="w-4 h-4" />
                                        <h3 className="font-bold text-xs uppercase tracking-wider">Thanh toán</h3>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                        {/* QR */}
                                        <div className="flex-shrink-0 flex flex-col items-center">
                                            <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.08)]">
                                                <QrCode className="w-36 h-36 text-black" strokeWidth={1.5} />
                                            </div>
                                            <p className="text-gray-600 text-[10px] text-center mt-2 leading-relaxed">
                                                Quét QR bằng<br />App Ngân hàng / Ví điện tử
                                            </p>
                                        </div>

                                        {/* Price + CTA */}
                                        <div className="flex-1 w-full">
                                            <div className="space-y-2 text-sm mb-5">
                                                <div className="flex justify-between text-gray-400">
                                                    <span>{booked.packageName}</span>
                                                    <span>{formatPrice(booked.price)}</span>
                                                </div>
                                                {booked.originalPrice && (
                                                    <div className="flex justify-between text-gray-500 text-xs">
                                                        <span>Giảm giá</span>
                                                        <span className="text-green-400">-{formatPrice(booked.originalPrice - booked.price)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-gray-500 text-xs">
                                                    <span>Phí dịch vụ</span>
                                                    <span className="text-green-400">Miễn phí</span>
                                                </div>
                                                <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
                                                    <span className="text-gray-200 font-semibold">Tổng thanh toán</span>
                                                    <span className="text-2xl font-bold text-yellow-400 tabular-nums">
                                                        {formatPrice(booked.price)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
                                                <Shield className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                                Nhấn xác nhận đồng nghĩa bạn đồng ý điều khoản dịch vụ của HuyenHocAI.
                                            </div>

                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-500" />
                                                <Button onClick={() => setPaid(true)}
                                                    className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-bold py-4 rounded-xl text-sm shadow-lg uppercase tracking-wider transition-all">
                                                    Xác nhận
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}

                </div>
                <Footer forceRender={true} />
            </main>
        </div>
    );
}
