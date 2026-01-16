'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store'; // Import store thật
import { Shield, ShieldAlert, CheckCircle, LogOut, ArrowRight, FlaskConical } from 'lucide-react';
import { useRouter, notFound } from 'next/navigation'; // Thêm notFound

export default function TestLabPage() {
    // --- CODE BẢO VỆ ---
    // Kiểm tra: Nếu là môi trường Production (Web thật) -> Trả về lỗi 404 (Không tìm thấy trang)
    if (process.env.NODE_ENV === 'production') {
        notFound();
    }
    // ---------------------------------------------

    const router = useRouter();
    
    // Lấy user từ store để hiển thị trạng thái realtime
    // Lưu ý: Không lấy hàm login/logout từ store vì chúng gọi API thật
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    const [message, setMessage] = useState('');

    // --- HÀM GIẢ LẬP ĐĂNG NHẬP (QUAN TRỌNG) ---
    const forceLogin = () => {
        // Tạo một user giả khớp với interface User trong lib/store.ts
        const fakeUser = {
            id: 'test-id-9999',
            email: 'tester@local.com',
            name: 'Tester Sorcerer',
            gender: 'female',
            birth_date: '2000-01-01',
            birth_time: '12:00',
            birth_place: 'Vietnam',
            is_vip: true, // Giả lập luôn là VIP để test cho sướng
            vipTier: 'PREMIUM',
            isProfileComplete: true
        };

        // CAN THIỆP TRỰC TIẾP VÀO STORE (Bỏ qua API)
        useAuthStore.setState({ 
            user: fakeUser,
            isAuthenticated: true,
            token: 'fake-jwt-token-for-testing-only' 
        });

        setMessage('🔓 Đã TIÊM trạng thái ĐĂNG NHẬP vào Store!');
    };

    // --- HÀM GIẢ LẬP ĐĂNG XUẤT ---
    const forceLogout = () => {
        // Xóa cookie token
        document.cookie = 'token=; path=/; max-age=0';
        
        // Reset store về null
        useAuthStore.setState({ 
            user: null, 
            isAuthenticated: false, 
            token: null 
        });

        setMessage('🔒 Đã RESET trạng thái về CHƯA ĐĂNG NHẬP!');
    };

    // --- HÀM TEST ĐIỀU HƯỚNG ---
    const handleNavigationTest = (path: string) => {
        // Logic mô phỏng giống hệt trang chủ
        if (!user) {
            setMessage(`⛔ CHẶN: User chưa đăng nhập. Logic sẽ đẩy sang /auth/register`);
        } else {
            setMessage(`✅ HỢP LỆ: Đang chuyển hướng sang ${path}...`);
            // setTimeout(() => router.push(path), 1000); // Bỏ comment nếu muốn chuyển thật
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10 font-sans">
            <div className="max-w-2xl mx-auto border border-slate-800 rounded-3xl p-8 bg-slate-900 shadow-2xl">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
                    <FlaskConical className="w-8 h-8 text-purple-500" />
                    <h1 className="text-3xl font-bold text-white">
                        Phòng Thí Nghiệm Frontend
                    </h1>
                </div>

                {/* KHU VỰC 1: TRẠNG THÁI STORE */}
                <div className="mb-8 p-6 rounded-2xl bg-black/40 border border-slate-800">
                    <h2 className="text-xs text-slate-400 mb-4 uppercase font-bold tracking-wider">Trạng thái Store hiện tại</h2>
                    
                    <div className="flex items-center gap-4 mb-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-bold">Đã Đăng Nhập (Authenticated)</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-full border border-red-400/20">
                                <ShieldAlert className="w-5 h-5" />
                                <span className="font-bold">Chưa Đăng Nhập (Guest)</span>
                            </div>
                        )}
                    </div>

                    {user && (
                        <div className="text-xs font-mono text-slate-400 bg-slate-950 p-4 rounded-lg overflow-hidden border border-slate-800">
                            <p className="mb-1"><span className="text-purple-400">Name:</span> {user.name}</p>
                            <p className="mb-1"><span className="text-purple-400">Email:</span> {user.email}</p>
                            <p><span className="text-purple-400">VIP:</span> {user.is_vip ? 'Yes' : 'No'}</p>
                        </div>
                    )}
                </div>

                {/* KHU VỰC 2: BẢNG ĐIỀU KHIỂN */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button 
                        onClick={forceLogin}
                        className="p-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
                    >
                        <Shield className="w-5 h-5" /> Tiêm User Giả (Login)
                    </button>
                    <button 
                        onClick={forceLogout}
                        className="p-4 bg-slate-700 hover:bg-slate-600 active:scale-95 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-5 h-5" /> Xóa User (Logout)
                    </button>
                </div>

                <hr className="border-slate-800 my-8" />

                {/* KHU VỰC 3: TEST CHỨC NĂNG */}
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    Test Logic Điều Hướng
                </h2>
                <div className="grid grid-cols-1 gap-3">
                    {[
                        { name: 'Xem Tarot', path: '/tarot' },
                        { name: 'Chat với AI', path: '/chat' },
                        { name: 'Xem Tử Vi', path: '/fortune' }
                    ].map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavigationTest(item.path)}
                            className="p-4 bg-slate-800 hover:bg-purple-900/20 hover:border-purple-500/50 border border-transparent rounded-xl text-left flex justify-between items-center group transition-all"
                        >
                            <span className="text-slate-300">Thử bấm nút: <span className="font-bold text-white">{item.name}</span></span>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>

                {/* KHU VỰC 4: KẾT QUẢ LOG */}
                {message && (
                    <div className={`mt-6 p-4 rounded-xl text-center font-bold text-sm border animate-in fade-in slide-in-from-bottom-2 ${
                        message.includes('HỢP LỆ') || message.includes('TIÊM') 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                        : message.includes('RESET') ? 'bg-slate-700 border-slate-600 text-slate-300'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}