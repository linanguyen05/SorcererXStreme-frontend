'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Star,
  Moon,
  Hash,
  MessageCircle,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import Link from 'next/link';
import { useSidebarCollapsed } from '@/components/layout/Sidebar';
import { expertApi } from '@/lib/api-client';

const tools = [
  {
    name: 'AI Chat',
    description: 'Trò chuyện với AI huyền thuật',
    icon: MessageCircle,
    href: '/chat',
    color: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/20',
    border: 'border-blue-500/20'
  },
  {
    name: 'Tarot',
    description: 'Xem bài Tarot dự đoán tương lai',
    icon: Sparkles,
    href: '/tarot',
    color: 'from-purple-500 to-pink-600',
    shadow: 'shadow-purple-500/20',
    border: 'border-purple-500/20'
  },
  {
    name: 'Cung Hoàng Đạo',
    description: 'Khám phá vận mệnh qua sao',
    icon: Star,
    href: '/astrology',
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-500/20',
    border: 'border-amber-500/20'
  },
  {
    name: 'Tử Vi',
    description: 'Xem tử vi theo ngày sinh',
    icon: Moon,
    href: '/fortune',
    color: 'from-indigo-500 to-violet-600',
    shadow: 'shadow-indigo-500/20',
    border: 'border-indigo-500/20'
  },
  {
    name: 'Thần Số Học',
    description: 'Khám phá ý nghĩa con số',
    icon: Hash,
    href: '/numerology',
    color: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/20'
  },
  {
    name: 'Dịch Vụ & Chuyên Gia',
    description: 'Đặt gói dịch vụ & tư vấn 1:1 với chuyên gia',
    icon: Compass,
    href: '/service-listing',
    color: 'from-rose-500 to-yellow-500',
    shadow: 'shadow-rose-500/20',
    border: 'border-rose-500/20'
  }
];

const stats = [
  {
    label: 'Lượt sử dụng hôm nay',
    value: '12',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    label: 'Công cụ yêu thích',
    value: 'Tarot',
    icon: Sparkles,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  {
    label: 'Lần cuối truy cập',
    value: 'Hôm nay',
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  }
];

export default function DashboardPage() {
  const { user, isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const sidebarCollapsed = useSidebarCollapsed();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role === 'ADMIN') {
      router.push(`/admin/dashboard`);
      return;
    }

    if (user?.role === 'EXPERT') {
      const checkStatus = async () => {
        let isApproved = false;
        if (token && user.id !== 'temp-id') {
          try {
            const profile = await expertApi.getProfile(user.id, token);
            if (profile && profile.status === 'APPROVED') {
              isApproved = true;
            }
          } catch (e) {
            console.warn("API check failed:", e);
          }
        }
        
        // localStorage check fallback
        if (!isApproved) {
          const storedExperts = localStorage.getItem('mock-admin-experts');
          if (storedExperts) {
            const allExperts = JSON.parse(storedExperts);
            const matchedExpert = allExperts.find((e: any) => e.id === user.id || (user.email && e.email === user.email));
            if (matchedExpert && matchedExpert.status === 'APPROVED') {
              isApproved = true;
            }
          }
        }

        if (isApproved) {
          router.push(`/expert/dashboard`);
        } else {
          router.push(`/expert/pending`);
        }
      };
      
      checkStatus();
    }
  }, [isAuthenticated, user, token, router]);

  if (!isAuthenticated || user?.role === 'EXPERT' || user?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Đang chuyển hướng đến không gian làm việc...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-white">
      <AnimatedBackground />
      <Sidebar />

      <main
        className="flex-1 relative z-10 overflow-auto transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? '10px' : '280px' }}
      >
        <div className="p-8 pt-6 max-w-7xl mx-auto">{/* Header Section */}
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 relative"
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            <h1 className="text-4xl font-bold mb-2 relative z-10">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent" style={{ fontFamily: 'Pacifico, cursive' }}>
                Chào mừng trở lại,
              </span>{' '}
              <span className="text-white">{user?.name || 'Khách'}!</span> 🌟
            </h1>
            <p className="text-gray-400 text-lg font-light">
              Hôm nay các vì sao đang nói gì về bạn?
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`relative backdrop-blur-xl bg-black/40 rounded-2xl p-6 border ${stat.border} overflow-hidden group`}
                >
                  <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1 font-medium">{stat.label}</p>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                        className="text-2xl font-bold text-white"
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center border ${stat.border}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Tools Grid */}
          <div className="mb-10">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Công cụ huyền thuật
              </span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.href} href={tool.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`h-full bg-black/40 backdrop-blur-xl rounded-2xl p-6 border ${tool.border} ${tool.shadow} hover:shadow-2xl transition-all duration-300 relative group overflow-hidden`}
                    >
                      {/* Hover Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} p-0.5 mb-4 shadow-lg group-hover:shadow-${tool.color.split('-')[1]}-500/40 transition-shadow duration-300`}>
                          <div className="w-full h-full bg-black/90 rounded-[14px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                          {tool.name}
                        </h3>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors">
                          {tool.description}
                        </p>

                        <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors gap-1">
                          Khám phá ngay <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-400" />
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Hoạt động gần đây
              </span>
            </h2>

            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                  <Calendar className="w-10 h-10 text-gray-600" />
                </div>
              </motion.div>

              <h3 className="text-lg font-medium text-white mb-2 relative z-10">Chưa có hoạt động nào</h3>
              <p className="text-gray-400 text-sm relative z-10 max-w-md mx-auto">
                Hãy bắt đầu hành trình khám phá bản thân với các công cụ huyền thuật của chúng tôi. Lịch sử hoạt động của bạn sẽ xuất hiện tại đây.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
