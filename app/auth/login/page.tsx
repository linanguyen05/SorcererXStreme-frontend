'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Sparkles, Star, Moon, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { expertApi } from '@/lib/api-client';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Đăng nhập thành công!');
        const { user, token } = useAuthStore.getState();
        if (user?.role?.toUpperCase() === 'EXPERT') {
          let isApproved = false;
          if (token && user.id !== 'temp-id') {
            try {
              const profileRes = await expertApi.getProfile(user.id, token);
              const exp = profileRes?.expert || profileRes;
              if (exp && exp.status === 'APPROVED') {
                isApproved = true;
              }
            } catch (e) {
              console.warn("API check failed during login:", e);
            }
          }
          if (isApproved) {
            router.push(`/experts/${user.id}/dashboard`);
          } else {
            router.push(`/experts/${user.id}/pending`);
          }
        } else if (user?.role === 'ADMIN') {
          router.push(`/admins/${user.id || '1'}/dashboard`);
        } else {
          if (user?.isProfileComplete) {
            router.push('/profile'); 
          } else {
            router.push('/auth/setup');
          }
        }
      } else {
        toast.error('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans text-white">
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Trang chủ</span>
      </Link>
      <AnimatedBackground />

      {/* Mystical Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 text-purple-500/20"
        >
          <Moon size={100} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 text-red-500/20"
        >
          <Star size={80} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card Container */}
        <div className="relative backdrop-blur-xl bg-black/30 rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_-12px_rgba(255,0,0,0.25)] overflow-hidden">

          {/* Card Glow Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative text-center mb-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-white/10 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <Sparkles className="w-8 h-8 text-red-400" />
            </motion.div>
            <motion.h1
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent"
              style={{ fontFamily: 'Pacifico, cursive' }}
            >
              SorcererXStreme
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm mt-2 font-light tracking-wide"
            >
              Cánh cổng dẫn đến thế giới huyền bí
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="group relative"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-400 transition-colors duration-300">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-300"
                disabled={isLoading}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500 -z-10 blur-sm" />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="group relative"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-400 transition-colors duration-300">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500 -z-10 blur-sm" />
            </motion.div>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-gray-400 hover:text-red-300 transition-colors hover:underline decoration-red-500/30 underline-offset-4"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-xl p-[1px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-purple-600 animate-gradient-xy opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/90 hover:bg-gray-900/80 rounded-xl py-4 px-6 transition-all duration-300 flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="font-medium bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Khai mở cánh cổng</span>
                    <Sparkles size={16} className="text-yellow-200" />
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm">
              Chưa là thành viên?{' '}
              <Link href="/auth/register" className="text-red-400 hover:text-red-300 font-semibold transition-colors hover:shadow-[0_0_10px_rgba(248,113,113,0.4)] rounded px-1">
                Đăng ký ngay
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
