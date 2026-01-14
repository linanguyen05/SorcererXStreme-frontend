'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowLeft, Send } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        toast.error('Vui lòng nhập email');
        return;
    }

    setIsLoading(true);
    try {
      // Gọi API gửi mã xác nhận
      await authApi.forgotPassword(email);
      
      toast.success('Mã xác nhận đã được gửi! Đang chuyển hướng...');
      
      // --- LOGIC MỚI: CHUYỂN HƯỚNG ---
      // Chuyển sang trang Reset Password (Giao diện đẹp + Ô nhập 6 số)
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`); 
      }, 1000);
      // -----------------------------

    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || 'Không tìm thấy email hoặc có lỗi xảy ra';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans text-white">
      <Link href="/auth/login" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Quay lại đăng nhập</span>
      </Link>

      <AnimatedBackground />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-md">
        <div className="relative backdrop-blur-xl bg-black/30 rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_-12px_rgba(168,85,247,0.25)] overflow-hidden">
          
          {/* Header */}
          <div className="relative text-center mb-8">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent" style={{ fontFamily: 'Pacifico, cursive' }}>Quên mật khẩu?</h1>
            <p className="text-gray-400 text-sm mt-2">Nhập email để nhận mã xác nhận 6 số.</p>
          </div>

          {/* Form Nhập Email */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email" required placeholder="example@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="w-full relative group overflow-hidden rounded-xl p-[1px]" disabled={isLoading}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 animate-gradient-xy opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/90 hover:bg-gray-900/80 rounded-xl py-4 px-6 transition-all flex items-center justify-center gap-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span className="font-medium">Gửi mã xác nhận</span><Send size={16} /></>}
              </div>
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}