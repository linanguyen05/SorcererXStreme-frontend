'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Sparkles, Star, Check, X, AlertTriangle } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import toast from 'react-hot-toast';
import Link from 'next/link';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
    match: false
  });

  const [isTouched, setIsTouched] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setIsInvalidToken(true);
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      match: password === confirmPassword && password !== ''
    });
  }, [password, confirmPassword]);

  const isFormValid = Object.values(validations).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setShowConfirmModal(true);
  };

  const handleConfirmReset = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Đặt lại mật khẩu thành công!');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        const error = await response.json();
        if (error.message?.includes('expired') || error.message?.includes('invalid')) {
          setIsInvalidToken(true);
          toast.error('Liên kết đã hết hạn hoặc không hợp lệ');
        } else {
          toast.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
      met ? 'text-green-400' : isTouched && password.length > 0 ? 'text-red-400' : 'text-gray-500'
    }`}>
      {met ? <Check size={14} /> : isTouched && password.length > 0 ? <X size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-600" />}
      <span>{text}</span>
    </div>
  );

  if (isInvalidToken) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans text-white">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="relative backdrop-blur-xl bg-black/30 rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_-12px_rgba(255,0,0,0.25)] text-center overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <XCircle className="w-10 h-10 text-red-400" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent mb-4" style={{ fontFamily: 'Pacifico, cursive' }}>
              Liên kết không hợp lệ
            </h2>
            <p className="text-gray-400 mb-8 text-sm font-light">
              Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu liên kết mới.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/auth/forgot-password')}
                className="w-full relative group overflow-hidden rounded-xl p-[1px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-purple-600 animate-gradient-xy opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gray-900/90 hover:bg-gray-900/80 rounded-xl py-3.5 px-6 transition-all duration-300">
                  <span className="font-medium text-white">Yêu cầu liên kết mới</span>
                </div>
              </button>
              <Link
                href="/auth/login"
                className="block w-full text-gray-400 hover:text-white transition-colors py-2 text-sm"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans text-white">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="relative backdrop-blur-xl bg-black/30 rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_-12px_rgba(255,0,0,0.25)] text-center overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-600/20 rounded-full blur-3xl" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <CheckCircle className="w-10 h-10 text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent mb-4" style={{ fontFamily: 'Pacifico, cursive' }}>
              Thành công!
            </h2>
            <p className="text-gray-400 mb-8 text-sm font-light">
              Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển đến trang đăng nhập.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full relative group overflow-hidden rounded-xl p-[1px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 animate-gradient-xy opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/90 hover:bg-gray-900/80 rounded-xl py-3.5 px-6 transition-all duration-300">
                <span className="font-medium text-white">Đăng nhập ngay</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans text-white">
      <AnimatedBackground />

      {/* Mystical Floating Elements */}
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

          {/* Card Glow Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />

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
              Thiết lập mật khẩu mới an toàn cho tài khoản của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
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
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500 -z-10 blur-sm" />
              </div>

              {/* Password Strength Checklist */}
              <div className="bg-white/5 rounded-xl p-4 space-y-2 border border-white/5">
                <p className="text-xs text-gray-400 font-medium mb-2">Yêu cầu mật khẩu:</p>
                <div className="grid grid-cols-1 gap-2">
                  <RequirementItem met={validations.length} text="Ít nhất 8 ký tự" />
                  <RequirementItem met={validations.upper} text="Có chữ cái in hoa (A-Z)" />
                  <RequirementItem met={validations.lower} text="Có chữ cái thường (a-z)" />
                  <RequirementItem met={validations.number} text="Có chứa số (0-9)" />
                  <RequirementItem met={validations.special} text="Ký tự đặc biệt (!@#...)" />
                </div>
              </div>

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
                
                {confirmPassword && (
                   <div className="absolute right-12 top-1/2 -translate-y-1/2 mr-2">
                     {validations.match ? (
                       <CheckCircle size={16} className="text-green-400" />
                     ) : (
                       <XCircle size={16} className="text-red-400" />
                     )}
                   </div>
                )}
              </div>
            </motion.div>

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
                      <span className="font-medium text-white">Đặt lại mật khẩu</span>
                      {isFormValid && <Sparkles size={16} className="text-purple-200" />}
                    </>
                  )}
                </div>
              </button>
            </motion.div>
          </form>

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

      {/* Confirmation Modal Popup */}
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
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl" />
              
              <div className="relative z-10 text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 border border-yellow-500/20">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Xác nhận thay đổi?</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Bạn có chắc chắn muốn thay đổi mật khẩu cho tài khoản này không? Hành động này không thể hoàn tác.
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