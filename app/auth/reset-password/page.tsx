'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Sparkles, Star, CheckCircle, XCircle, Check, X, KeyRound, AlertTriangle } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { authApi } from '@/lib/api-client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy email từ URL để tiện cho UX (không bắt buộc)
  const initialEmail = searchParams.get('email') || '';

  // --- THAY ĐỔI QUAN TRỌNG: State cho mã 6 số ---
  const [code, setCode] = useState(''); 
  // ---------------------------------------------

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Giữ lại Modal của bạn

  // Validate password logic
  const [isTouched, setIsTouched] = useState(false);
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    match: password === confirmPassword && password !== ''
  };

  // Form chỉ hợp lệ khi có đủ 6 số code VÀ mật khẩu chuẩn
  const isFormValid = code.length === 6 && Object.values(validations).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
        toast.error('Vui lòng nhập mã xác nhận 6 số');
        return;
    }
    if (!isFormValid) return;
    
    // Hiện Modal xác nhận trước khi gửi
    setShowConfirmModal(true);
  };

  const handleConfirmReset = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      // Gửi code 6 số và mật khẩu mới lên server
      // Lưu ý: authApi.resetPassword cần nhận (code, newPassword)
      await authApi.resetPassword(code, password); 
      
      toast.success('Đặt lại mật khẩu thành công! Đang chuyển hướng...');
      setTimeout(() => router.push('/auth/login'), 2000);

    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || error?.message || 'Mã xác nhận không đúng hoặc đã hết hạn';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Component hiển thị checklist mật khẩu
  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
      met ? 'text-green-400' : isTouched && password.length > 0 ? 'text-red-400' : 'text-gray-500'
    }`}>
      {met ? <Check size={14} /> : isTouched && password.length > 0 ? <X size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-600" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans text-white">
      <AnimatedBackground />

      {/* Các hiệu ứng bay bay nền */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-10 text-purple-500/20"
        >
          <Star size={60} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative backdrop-blur-xl bg-black/30 rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_-12px_rgba(255,0,0,0.25)] overflow-hidden">

          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />

          {/* Tiêu đề */}
          <div className="relative text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Pacifico, cursive' }}>
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Nhập mã xác nhận từ email và mật khẩu mới
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            
            {/* --- INPUT MÃ XÁC NHẬN (6 SỐ) --- */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="group relative"
            >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300">
                    <KeyRound size={20} />
                </div>
                <input
                    type="text"
                    maxLength={6}
                    placeholder="Mã xác nhận (6 số)"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} // Chỉ cho nhập số
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 tracking-widest font-mono text-lg"
                    disabled={isLoading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500 -z-10 blur-sm" />
            </motion.div>

            {/* Input Mật khẩu mới */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu mới"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!isTouched) setIsTouched(true);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Checklist điều kiện mật khẩu */}
              <div className="bg-white/5 rounded-xl p-4 space-y-2 border border-white/5">
                <div className="grid grid-cols-1 gap-2">
                  <RequirementItem met={validations.length} text="Ít nhất 8 ký tự" />
                  <RequirementItem met={validations.upper} text="Có chữ cái in hoa" />
                  <RequirementItem met={validations.number && validations.special} text="Có số & ký tự đặc biệt" />
                </div>
              </div>
            </motion.div>
            
            {/* Input Xác nhận mật khẩu */}
            <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300">
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                    confirmPassword && !validations.match 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-white/10 focus:border-purple-500/50'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* Nút Submit */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="submit"
                className={`w-full relative group overflow-hidden rounded-xl p-[1px] transition-all duration-300 ${
                  !isFormValid ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-[1.02]'
                }`}
                disabled={isLoading || !isFormValid}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-red-600 animate-gradient-xy opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gray-900/90 hover:bg-gray-900/80 rounded-xl py-4 px-6 transition-all duration-300 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="font-medium text-white">Tiếp tục</span>
                      {isFormValid && <Sparkles size={16} className="text-purple-200" />}
                    </>
                  )}
                </div>
              </button>
            </motion.div>
          </form>

          {/* Link quay lại đăng nhập */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm">
              Nhớ mật khẩu rồi?{' '}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline decoration-purple-500/30 underline-offset-4">
                Đăng nhập
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* --- MODAL XÁC NHẬN (CỦA BẠN) --- */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl" />
              
              <div className="relative z-10 text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 border border-yellow-500/20">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Xác nhận thay đổi?</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Bạn có chắc chắn muốn thay đổi mật khẩu cho tài khoản này không?
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors border border-white/5"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}