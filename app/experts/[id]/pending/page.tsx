'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckSquare, Square, ShieldCheck, 
  Clock, AlertCircle, LogOut, RefreshCw, Mail, Phone, ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { expertApi } from '@/lib/api-client';

function ExpertPendingClient({ id }: { id: string }) {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  // State
  const [agreements, setAgreements] = useState({
    guidelines: false,
    revShare: false,
    truthfulness: false
  });
  
  const [isChecking, setIsChecking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Check all agreement terms
  const allAgreed = agreements.guidelines && agreements.revShare && agreements.truthfulness;

  // Poll status from local storage or API
  const checkApprovalStatus = async (silent = false) => {
    if (!silent) setIsChecking(true);
    
    try {
      let isApproved = false;
      let status: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';

      // Check status via API
      if (token && id !== 'temp-id') {
        try {
          const profileRes = await expertApi.getProfile(id, token);
          const exp = profileRes?.expert || profileRes;
          if (exp && exp.status) {
            status = exp.status;
            isApproved = (exp.status === 'APPROVED');
          }
        } catch (apiError) {
          console.warn("API check failed.", apiError);
        }
      }

      setCurrentStatus(status);

      if (isApproved) {
        if (!silent) {
          toast.success('Tài khoản của bạn đã được phê duyệt! Đang chuyển hướng...');
        }
        // Save agreement acceptance to localStorage
        localStorage.setItem(`expert-agreed-${id}`, 'true');
        
        // Wait a short moment then redirect
        setTimeout(() => {
          router.push(`/experts/${id}/dashboard`);
        }, 1500);
      } else if (!silent) {
        if (status === 'REJECTED') {
          toast.error('Hồ sơ của bạn đã bị từ chối phê duyệt. Vui lòng liên hệ hỗ trợ.');
        } else {
          toast.success('Hồ sơ vẫn đang trong quá trình xét duyệt.');
        }
      }
    } catch (error) {
      console.error("Error checking status:", error);
      if (!silent) {
        toast.error('Có lỗi xảy ra khi kiểm tra trạng thái.');
      }
    } finally {
      if (!silent) setIsChecking(false);
    }
  };

  // Real-time polling
  useEffect(() => {
    // Initial check on mount
    checkApprovalStatus(true);

    // Poll every 3 seconds
    const interval = setInterval(() => {
      checkApprovalStatus(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [id, token]);

  const handleToggle = (key: keyof typeof agreements) => {
    setAgreements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất thành công.');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-['Be_Vietnam_Pro'] relative overflow-x-hidden select-none">
      {/* Cosmic background effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
            SORCERERXSTREME
          </span>
          <span className="text-[10px] uppercase font-black tracking-widest bg-white/10 text-gray-300 px-2 py-0.5 rounded border border-white/5">
            EXPERT
          </span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-400 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/30"
        >
          <LogOut className="w-3.5 h-3.5" /> Đăng xuất
        </button>
      </header>

      {/* Main content grid */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left column: Approval Card and Terms Agreement */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Main Status Card */}
          <div className="bg-gray-950/80 border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                <Clock className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-500/20">
                  {currentStatus === 'PENDING' ? 'ĐANG CHỜ PHÊ DUYỆT' : currentStatus === 'APPROVED' ? 'ĐÃ PHÊ DUYỆT' : 'ĐÃ TỪ CHỐI'}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">Hồ sơ của bạn đang được kiểm duyệt</h2>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Chào mừng bạn đến với mạng lưới chuyên gia của SorcererXstreme. 
              Để bảo vệ chất lượng tư vấn và uy tín của nền tảng, Ban quản trị đang tiến hành xác minh thông tin bằng cấp, chứng chỉ và hồ sơ chuyên môn của bạn. 
              Quá trình kiểm duyệt thường được hoàn tất trong vòng <strong>12 đến 24 giờ làm việc</strong>.
            </p>

            {/* Check status controls */}
            <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                Tự động kiểm tra trạng thái mỗi 3 giây...
              </span>
              <button
                onClick={() => checkApprovalStatus(false)}
                disabled={isChecking}
                className="flex items-center gap-2 text-xs font-black text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-4 py-2.5 transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                Kiểm tra ngay
              </button>
            </div>
          </div>

          {/* Terms Agreement Accordion Section */}
          <div className="bg-gray-950/80 border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <FileText className="w-5 h-5 text-red-500" /> Điều khoản & Cam kết hợp tác
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Vui lòng đọc kỹ và đồng ý với các thỏa thuận hoạt động dưới đây. 
              Bạn chỉ có thể truy cập đầy đủ vào trang quản trị (Expert Dashboard) sau khi đã được Admin duyệt tài khoản và đồng ý với các điều khoản này.
            </p>

            <div className="space-y-4">
              {/* Checkbox 1 */}
              <div 
                onClick={() => handleToggle('guidelines')}
                className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                  agreements.guidelines 
                    ? 'bg-purple-950/20 border-purple-500/40 text-white' 
                    : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {agreements.guidelines ? (
                    <CheckSquare className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-1">Tuân thủ Quy tắc & Đạo đức nghề nghiệp</p>
                  <p className="text-[11px] leading-relaxed">
                    Cam kết tư vấn có tâm, bảo mật tuyệt đối thông tin khách hàng. 
                    Tuyệt đối không đe dọa, ép buộc hay dụ dỗ khách hàng mua thêm các sản phẩm tâm linh ngoài hệ thống.
                  </p>
                </div>
              </div>

              {/* Checkbox 2 */}
              <div 
                onClick={() => handleToggle('revShare')}
                className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                  agreements.revShare 
                    ? 'bg-purple-950/20 border-purple-500/40 text-white' 
                    : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {agreements.revShare ? (
                    <CheckSquare className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-1">Thỏa thuận Phân chia Doanh thu (80/20 Split)</p>
                  <p className="text-[11px] leading-relaxed">
                    Đồng ý với tỷ lệ chia sẻ doanh thu: Chuyên gia nhận 80%, Nền tảng giữ lại 20% trên mỗi giao dịch đặt lịch thành công để duy trì vận hành hệ thống.
                  </p>
                </div>
              </div>

              {/* Checkbox 3 */}
              <div 
                onClick={() => handleToggle('truthfulness')}
                className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                  agreements.truthfulness 
                    ? 'bg-purple-950/20 border-purple-500/40 text-white' 
                    : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {agreements.truthfulness ? (
                    <CheckSquare className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-1">Cam kết tính Xác thực & Trung thực</p>
                  <p className="text-[11px] leading-relaxed">
                    Xác nhận mọi thông tin cá nhân, bằng cấp, kinh nghiệm làm việc đã tải lên hệ thống là hoàn toàn trung thực. 
                    Chịu trách nhiệm pháp lý nếu phát hiện gian lận.
                  </p>
                </div>
              </div>
            </div>

            {/* Locked Action Button */}
            <div className="pt-2">
              <button
                disabled={!allAgreed || currentStatus !== 'APPROVED'}
                onClick={() => router.push(`/experts/${id}/dashboard`)}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                  allAgreed && currentStatus === 'APPROVED'
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white hover:shadow-lg hover:shadow-red-600/20 active:scale-[0.98]'
                    : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                {currentStatus === 'APPROVED' 
                  ? (allAgreed ? 'Vào Expert Dashboard' : 'Hãy đồng ý với tất cả điều khoản') 
                  : 'Đang đợi phê duyệt từ Admin'}
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Vertical Steps and Help/Support */}
        <div className="md:col-span-5 space-y-6">
          {/* Vertical Steps Progress */}
          <div className="bg-gray-950/80 border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-base font-bold text-white mb-6 border-b border-white/5 pb-4">
              Tiến trình tài khoản
            </h3>

            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
              {/* Step 1 */}
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500 text-green-400 flex items-center justify-center font-bold text-xs shrink-0 z-10 bg-black">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Đăng ký tài khoản</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Xác thực email qua Cognito</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500 text-green-400 flex items-center justify-center font-bold text-xs shrink-0 z-10 bg-black">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Thiết lập hồ sơ chuyên gia</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Kinh nghiệm, chuyên môn, avatar</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 bg-black border ${
                  currentStatus === 'PENDING' 
                    ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10 animate-pulse' 
                    : currentStatus === 'APPROVED'
                      ? 'border-green-500 text-green-400 bg-green-500/10'
                      : 'border-red-500 text-red-400 bg-red-500/10'
                }`}>
                  {currentStatus === 'APPROVED' ? '✓' : currentStatus === 'REJECTED' ? '✕' : '3'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Kiểm duyệt hồ sơ</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Admin xác minh chứng chỉ nghề nghiệp</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 relative">
                <div className={`w-8 h-8 rounded-full border border-white/10 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0 z-10 bg-black ${
                  currentStatus === 'APPROVED' && allAgreed ? 'border-purple-500 text-purple-400 bg-purple-500/10' : ''
                }`}>
                  4
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500">Kích hoạt trang quản trị</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">Mở lịch hẹn, định cấu hình dịch vụ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help & Support Card */}
          <div className="bg-gray-950/80 border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Bạn cần hỗ trợ?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Nếu bạn có bất kỳ thắc mắc nào về quá trình kiểm duyệt hoặc cần bổ sung các tài liệu chuyên môn (chứng chỉ, bằng cấp), vui lòng liên hệ Ban quản trị:
            </p>

            <div className="space-y-3 pt-2">
              <a 
                href="mailto:support@sorcererxstreme.com" 
                className="flex items-center gap-2.5 text-xs text-gray-300 hover:text-red-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-red-500" />
                support@sorcererxstreme.com
              </a>
              <div className="flex items-center gap-2.5 text-xs text-gray-300">
                <Phone className="w-4 h-4 text-red-500" />
                0988.123.456 (8h - 18h)
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <a 
                href="/guidelines" 
                target="_blank" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Xem Hướng dẫn Cộng đồng Chuyên gia <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  return <ExpertPendingClient id={params.id} />;
}
