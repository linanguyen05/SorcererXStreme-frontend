'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Shield, ShieldAlert, CheckCircle, LogOut, ArrowRight, FlaskConical } from 'lucide-react';
import { useRouter, notFound } from 'next/navigation';

export default function TestLabPage() {
    // --- CODE BẢO VỆ ---
    // Kiểm tra: Nếu là môi trường Production (Web thật) -> Trả về lỗi 404
    if (process.env.NODE_ENV === 'production') {
        notFound();
    }
    // ---------------------------------------------

    const router = useRouter();
    
    // Lấy user từ store để hiển thị trạng thái realtime
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    const [message, setMessage] = useState('');

    // --- HÀM GIẢ LẬP ĐĂNG NHẬP THEO VAI TRÒ (MỚI) ---
    const forceLogin = (role: 'USER' | 'EXPERT_PENDING' | 'EXPERT_APPROVED' | 'ADMIN') => {
        let finalRole = 'USER';
        let finalId = 'test-user-id';
        let finalEmail = 'user@local.com';
        let finalName = 'Tester Regular User';

        if (role === 'ADMIN') {
            finalRole = 'ADMIN';
            finalId = '1'; // Phù hợp với generateStaticParams của admin
            finalEmail = 'admin@local.com';
            finalName = 'Tester Administrator';
        } else if (role === 'EXPERT_PENDING') {
            finalRole = 'EXPERT';
            finalId = '2'; // Phù hợp với generateStaticParams của expert
            finalEmail = 'expert_pending@local.com';
            finalName = 'Tester Expert Pending';
            
            // Cập nhật trạng thái PENDING trong mock-admin-experts
            const mockListStr = localStorage.getItem('mock-admin-experts');
            let mockList = mockListStr ? JSON.parse(mockListStr) : [];
            mockList = mockList.filter((e: any) => e.id !== finalId && e.email !== finalEmail);
            mockList.push({
                id: finalId,
                email: finalEmail,
                name: finalName,
                status: 'PENDING',
                specialty: ['Tarot'],
                experience_years: 5,
                bio: 'Chuyên gia đang chờ duyệt hồ sơ...'
            });
            localStorage.setItem('mock-admin-experts', JSON.stringify(mockList));
        } else if (role === 'EXPERT_APPROVED') {
            finalRole = 'EXPERT';
            finalId = '3'; // Phù hợp với generateStaticParams của expert
            finalEmail = 'expert_approved@local.com';
            finalName = 'Tester Expert Approved';

            // Cập nhật trạng thái APPROVED trong mock-admin-experts
            const mockListStr = localStorage.getItem('mock-admin-experts');
            let mockList = mockListStr ? JSON.parse(mockListStr) : [];
            mockList = mockList.filter((e: any) => e.id !== finalId && e.email !== finalEmail);
            mockList.push({
                id: finalId,
                email: finalEmail,
                name: finalName,
                status: 'APPROVED',
                specialty: ['Astrology'],
                experience_years: 10,
                bio: 'Chuyên gia đã được duyệt thành công!'
            });
            localStorage.setItem('mock-admin-experts', JSON.stringify(mockList));
        }

        const fakeUser = {
            id: finalId,
            email: finalEmail,
            name: finalName,
            role: finalRole,
            gender: 'female',
            birth_date: '2000-01-01',
            birth_time: '12:00',
            birth_place: 'Vietnam',
            is_vip: role === 'USER',
            vipTier: 'PREMIUM',
            isProfileComplete: true
        };

        // Ghi đè trực tiếp trạng thái trong zustand store
        useAuthStore.setState({ 
            user: fakeUser,
            isAuthenticated: true,
            token: 'fake-jwt-token-for-testing-only' 
        });

        setMessage(`🔓 Đã TIÊM trạng thái ĐĂNG NHẬP: Vai trò = ${finalRole}, ID = ${finalId}!`);
    };

    // --- HÀM GIẢ LẬP ĐĂNG XUẤT ---
    const forceLogout = () => {
        document.cookie = 'token=; path=/; max-age=0';
        
        useAuthStore.setState({ 
            user: null, 
            isAuthenticated: false, 
            token: null 
        });

        setMessage('🔒 Đã RESET trạng thái về CHƯA ĐĂNG NHẬP!');
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
                                <span className="font-bold text-xs">Đã Đăng Nhập (Authenticated)</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-full border border-red-400/20">
                                <ShieldAlert className="w-5 h-5" />
                                <span className="font-bold text-xs">Chưa Đăng Nhập (Guest)</span>
                            </div>
                        )}
                    </div>

                    {user && (
                        <div className="text-xs font-mono text-slate-400 bg-slate-950 p-4 rounded-lg overflow-hidden border border-slate-800">
                            <p className="mb-1"><span className="text-purple-400 font-semibold">Tên hiển thị:</span> {user.name}</p>
                            <p className="mb-1"><span className="text-purple-400 font-semibold">Email:</span> {user.email}</p>
                            <p className="mb-1"><span className="text-purple-400 font-semibold">Mã ID:</span> {user.id}</p>
                            <p className="mb-1"><span className="text-purple-400 font-semibold">Vai trò (Role):</span> <span className="text-yellow-400 font-bold">{user.role}</span></p>
                            <p><span className="text-purple-400 font-semibold">Khách hàng VIP:</span> {user.is_vip ? 'Có' : 'Không'}</p>
                        </div>
                    )}
                </div>

                {/* KHU VỰC 2: KHU VỰC TIÊM PROFILE ĐĂNG NHẬP */}
                <h2 className="text-sm text-slate-400 mb-3 uppercase font-bold tracking-wider">Tiêm trạng thái tài khoản giả lập</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button 
                        onClick={() => forceLogin('USER')}
                        className="p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-xl font-bold transition-all text-xs text-blue-300"
                    >
                        👤 Tiêm USER (Khách hàng)
                    </button>
                    <button 
                        onClick={() => forceLogin('ADMIN')}
                        className="p-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 rounded-xl font-bold transition-all text-xs text-red-300"
                    >
                        🔑 Tiêm ADMIN (Quản trị viên)
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                        onClick={() => forceLogin('EXPERT_PENDING')}
                        className="p-3 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 hover:border-amber-500/50 rounded-xl font-bold transition-all text-xs text-amber-300"
                    >
                        ⏳ Tiêm EXPERT (Chờ duyệt)
                    </button>
                    <button 
                        onClick={() => forceLogin('EXPERT_APPROVED')}
                        className="p-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 hover:border-green-500/50 rounded-xl font-bold transition-all text-xs text-green-300"
                    >
                        ✅ Tiêm EXPERT (Đã duyệt)
                    </button>
                </div>

                <div className="mb-6">
                    <button 
                        onClick={forceLogout}
                        className="w-full p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl font-bold transition-all text-xs text-slate-300 border border-slate-700"
                    >
                        🔒 Đăng xuất / Reset trạng thái
                    </button>
                </div>

                <hr className="border-slate-800 my-6" />

                {/* KHU VỰC 3: TRIGGER VÀO ROUTE DASHBOARD ĐỂ KIỂM TRA ĐIỀU HƯỚNG */}
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    Chạy thử điều hướng thực tế
                </h2>
                
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-98 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 text-white"
                >
                    🚀 VÀO TRANG /DASHBOARD ĐỂ TEST ROUTING
                </button>

                {/* KHU VỰC 4: KẾT QUẢ LOG THAO TÁC KHẨN CẤP */}
                {message && (
                    <div className="mt-6 p-4 rounded-xl text-center font-bold text-xs border bg-purple-500/10 border-purple-500/20 text-purple-400 animate-in fade-in">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}