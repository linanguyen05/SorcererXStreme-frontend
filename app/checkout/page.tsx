'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, User, CreditCard, QrCode, MapPin, Package, Info, CheckCircle2, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';


const initialServices = [
    {
        id: 1,
        image: 'https://cdn.thuvienphapluat.vn/uploads/laodongtienluong/20230301/LLT/08-03-25/Hinh-3243.jpg',
        name: 'Luận giải Tử vi Trọn đời',
        category: 'Gói Chuyên sâu',
        expert: 'Master Trí Đức',
        price: 350000,
    },
    {
        id: 2,
        image: 'https://images2.thanhnien.vn/thumb_w/640/528068263637045248/2026/2/17/horse-1771291587491100789433.jpg',
        name: 'Xem Ngày Lành Tháng Tốt',
        category: 'Tư vấn nhanh',
        expert: 'Master Minh Thiện',
        price: 200000,
    },
    {
        id: 3,
        image: 'https://cdn2.fptshop.com.vn/unsafe/bai_tarot_la_gi_ce473104d3.png',
        name: 'Xem Tarot Tình Duyên',
        category: 'Tư vấn chuyên sâu',
        expert: 'Master Minh Trí',
        price: 400000,
    }
];

export default function CheckoutPage() {
    const router = useRouter();
    const sidebarCollapsed = useSidebarCollapsed();
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [quantity] = useState(1);
    const [userInfo, setUserInfo] = useState({
        name: '',
        dob: '',
        email: '',
        phone: '',
        note: ''
    });

    const [tempInfo, setTempInfo] = useState({ ...userInfo });

    const handleSave = () => {
        setUserInfo({ ...tempInfo });
        setIsPopupOpen(false);
    };
    const [services, setServices] = useState(initialServices);
    const [quantities, setQuantities] = useState<Record<number, number>>(
        initialServices.reduce((acc, s) => ({ ...acc, [s.id]: 1 }), {})
    );
    const updateQuantity = (id: number, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta) // Chỉ cập nhật ID tương ứng, tối thiểu là 1
        }));
    };
    // 4. Hàm xóa dịch vụ
    const removeService = (id: number) => {
        setServices(prev => prev.filter(service => service.id !== id));
    };

    // 5. Tính toán lại tổng tiền dựa trên danh sách 'services' hiện tại
    const totalAllServices = services.reduce((sum, s) => {
        const q = quantities[s.id] || 1;
        return sum + (s.price * q);
    }, 0);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setMounted(true);

        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Nếu bạn muốn ép đóng sidebar khi vào checkout trên mobile:
            // Chỉ gọi nếu bạn đã có quyền truy cập vào store của Sidebar
            // if (mobile && typeof setSidebarCollapsed === 'function') {
            //    setSidebarCollapsed(true);
            // }
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
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            THANH TOÁN DỊCH VỤ
                        </h1>
                    </motion.div>

                    {/* SECTION 1: Thông tin cá nhân */}
                    {/* <motion.section
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20 shadow-lg relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 opacity-30" />
                            <div className="flex items-center gap-3 mb-4 text-yellow-400">
                                <MapPin className="w-5 h-5" />
                                <h2 className="font-bold uppercase tracking-wider text-sm">Thông tin khách hàng</h2>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-200">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">{mockUser.name}</span>
                                    <span className="text-gray-500">|</span>                                
                                </div>
                                <div className="hidden md:block w-px h-4 bg-gray-700" />
                                <div className="flex gap-4 text-sm text-gray-400">
                                    <span>Phone: {mockUser.phone}</span>
                                    <span>Email: {mockUser.email}</span>
                                </div>
                            </div>
                        </motion.section>*/}

                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20 shadow-lg relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 opacity-30" />

                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3 text-yellow-400">
                                <MapPin className="w-5 h-5" />
                                <h2 className="font-bold uppercase tracking-wider text-sm">Thông tin khách hàng</h2>
                            </div>
                            <button
                                onClick={() => { setTempInfo({ ...userInfo }); setIsPopupOpen(true); }}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                                Thay đổi
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{userInfo.name}</span>
                                {userInfo.phone && (
                                    <>
                                        <span className="text-gray-500">|</span>
                                        <span className="font-bold">{userInfo.phone}</span>
                                    </>
                                )}
                            </div>
                            <div className="hidden md:block w-px h-4 bg-gray-700" />
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                                <span>Email: {userInfo.email}</span>
                                {userInfo.note && <span className="italic text-gray-500">Ghi chú: {userInfo.note}</span>}
                            </div>
                        </div>
                    </motion.section>

                    {/* SECTION 2: Thông tin dịch vụ */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-lg overflow-hidden"
                    >
                        {/* Table Header */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 opacity-30" />
                        <div className="p-6 border-b border-gray-800 flex items-center gap-3 text-yellow-400">
                            <ShoppingCart className="w-5 h-5" />
                            <h2 className="font-bold uppercase tracking-wider text-sm">Thông tin dịch vụ</h2>
                        </div>

                        {/* Product Row */}
                        {services.map((service) => (
                            <div key={service.id} className="relative px-6 py-8 flex flex-col md:flex-row md:items-center border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors gap-6 group">

                                {/* (Thùng rác) */}
                                <button
                                    onClick={() => removeService(service.id)}
                                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    title="Xóa dịch vụ"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>


                                {/* PHẦN 1: Thông tin sản phẩm*/}
                                <div className="flex gap-4 flex-1 min-w-0">
                                    <div className="relative flex-shrink-0">
                                        <img src={service.image} alt="service" className="w-20 h-20 rounded-xl object-cover border border-gray-700 shadow-inner" />
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h3 className="font-bold text-white text-lg leading-tight mb-2 truncate">{service.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 text-[10px] uppercase">{service.category}</span>
                                            <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20 text-[10px] uppercase">{service.expert}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* PHẦN 2: Nhóm Thông tin giá  */}
                                <div className="flex flex-col items-start gap-3 flex-shrink-0 min-w-[200px] md:pl-8 md:border-l md:border-gray-800/50">

                                    {/* Đơn giá */}
                                    <div className="grid grid-cols-2 w-full gap-4 items-center text-gray-400">
                                        <span className="text-[10px] uppercase tracking-wider opacity-60">Đơn giá:</span>
                                        <span className="text-sm font-medium text-gray-200">{service.price.toLocaleString()}đ</span>
                                    </div>

                                    {/* Số lượng */}
                                    <div className="grid grid-cols-2 w-full gap-4 items-center">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400 opacity-60">Số lượng:</span>
                                        <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden bg-black/40 h-8 w-fit">
                                            <button onClick={() => updateQuantity(service.id, -1)} className="w-7 h-full hover:bg-white/10 text-gray-400 transition-colors border-r border-gray-700">-</button>
                                            <input type="text" readOnly value={quantities[service.id] || 1} className="w-8 text-center bg-transparent text-yellow-500 font-bold text-xs outline-none" />
                                            <button onClick={() => updateQuantity(service.id, 1)} className="w-7 h-full hover:bg-white/10 text-gray-400 transition-colors border-l border-gray-700">+</button>
                                        </div>
                                    </div>

                                    {/* Thành tiền */}
                                    <div className="grid grid-cols-2 w-full gap-4 items-center pt-2 border-t border-gray-800/50">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500">Thành tiền:</span>
                                        <span className="text-xl font-bold text-yellow-500 leading-none">
                                            {(service.price * quantities[service.id]).toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {services.length === 0 && (
                            <div className="p-20 text-center text-gray-500 italic">
                                Chưa có dịch vụ nào trong danh sách thanh toán.
                            </div>
                        )}
                        {/* Summary Bar */}
                        <div className="bg-white/[0.03] p-6 flex justify-end items-center gap-4 flex">
                            <span className="text-gray-400 text-xs italic flex items-center gap-2">
                                <Info className="w-4 h-4" /> Tổng số tiền ({quantity} dịch vụ):
                            </span>
                            <span className="md:text-xl text-3xl font-bold text-yellow-500">
                                {(totalAllServices).toLocaleString()}đ
                            </span>
                        </div>
                    </motion.section>

                    {/* SECTION 3: Phương thức thanh toán */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-lg overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 opacity-30" />
                        <div className="p-6 border-b border-gray-800 flex items-center gap-3 text-yellow-400">
                            <CreditCard className="w-5 h-5" />
                            <h2 className="font-bold uppercase tracking-wider text-sm">Thanh toán</h2>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* QR Section */}
                            <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-dashed border-gray-700">
                                <div className="bg-white p-3 rounded-xl mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    <QrCode className="w-40 h-40 text-black" strokeWidth={1.5} />
                                </div>
                                <p className="text-gray-400 text-xs text-center leading-relaxed">
                                    Vui lòng sử dụng ứng dụng Ngân hàng hoặc Ví điện tử <br /> quét mã QR để thanh toán tự động
                                </p>
                            </div>

                            {/* Final Total & Action */}
                            <div className="flex flex-col justify-between space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span>Tiền dịch vụ:</span>
                                        <span>{totalAllServices.toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span>Phí vận hành:</span>
                                        <span className="text-green-400">Miễn phí</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                                        <span className="text-gray-200">Tổng thanh toán:</span>
                                        <div className="text-right">
                                            <span className="block md:text-2xl text-3xl font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                                                {totalAllServices.toLocaleString()}đ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                                        <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                                        Nhấn "Thanh toán" đồng nghĩa với việc bạn đồng ý tuân thủ các điều khoản dịch vụ tâm linh.
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                                        <Button
                                            className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-bold py-4 text-base rounded-xl shadow-lg transition-all border border-yellow-300/50 uppercase tracking-wider"
                                        >
                                            Thanh Toán Ngay
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>

                <AnimatePresence>
                    {isPopupOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsPopupOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative bg-gray-900 border border-yellow-500/30 rounded-2xl w-full max-w-md p-8 shadow-2xl"
                            >
                                <button
                                    onClick={() => setIsPopupOpen(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <h2 className="text-2xl font-bold mb-6 text-yellow-400">Cập nhật thông tin</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Họ và tên</label>
                                        <input
                                            type="text"
                                            value={tempInfo.name}
                                            onChange={(e) => setTempInfo({ ...tempInfo, name: e.target.value })}
                                            className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-2 focus:border-yellow-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Số điện thoại</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập số điện thoại..."
                                            value={tempInfo.phone}
                                            onChange={(e) => setTempInfo({ ...tempInfo, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-2 focus:border-yellow-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={tempInfo.email}
                                            onChange={(e) => setTempInfo({ ...tempInfo, email: e.target.value })}
                                            className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-2 focus:border-yellow-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Ghi chú (Không bắt buộc)</label>
                                        <textarea
                                            rows={3}
                                            value={tempInfo.note}
                                            onChange={(e) => setTempInfo({ ...tempInfo, note: e.target.value })}
                                            className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-2 focus:border-yellow-500 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <Button
                                        onClick={() => setIsPopupOpen(false)}
                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold"
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <div className="mt-auto">
                    <Footer forceRender={true} />
                </div>
            </main>
        </div>
    );
}