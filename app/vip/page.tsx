'use client';

import { motion } from 'framer-motion';
import { Crown, Sparkles, Zap, Shield, Star, TrendingUp, Heart, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import { VIPBadge } from '@/components/ui/VIPBadge';
import { Footer } from '@/components/layout/Footer';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { useEffect, useState } from 'react';

const benefits = [
  {
    icon: Zap,
    title: 'Không giới hạn sử dụng',
    description: 'Xem Tarot, chiêm tinh, tử vi không giới hạn lượt',
    color: 'from-yellow-400 to-amber-500'
  },
  {
    icon: Sparkles,
    title: 'Giải thích chi tiết',
    description: 'Nhận các bài giải sâu sắc và cá nhân hóa từ AI',
    color: 'from-purple-400 to-pink-500'
  },
  {
    icon: Star,
    title: 'Tính năng độc quyền',
    description: 'Truy cập các tính năng premium chỉ dành cho VIP',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: TrendingUp,
    title: 'Phân tích nâng cao',
    description: 'Biểu đồ và báo cáo chi tiết về vận mệnh',
    color: 'from-red-400 to-orange-500'
  }
];

const features = [
  'AI Chat không giới hạn',
  'Xem Tarot Premium',
  'Biểu đồ chiêm tinh 3D',
  'Tử vi tổng quát hàng ngày',
  'Phân tích thần số học sâu',
  'Dự đoán tương lai chính xác',
  'Nội dung độc quyền hàng tuần',
  'Tư vấn huyền học cá nhân'
];

export default function VIPIntroPage() {
  const router = useRouter();
  const sidebarCollapsed = useSidebarCollapsed();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-white "
      style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <AnimatedBackground />
      <Sidebar />

      <main
        className="flex-1 relative z-10 overflow-auto transition-all duration-200"
        style={{ marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px') }}
      >
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border-b border-yellow-500/20"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-8 py-20 text-center">

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <Crown className="w-24 h-24 text-yellow-400 fill-yellow-400" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-3 -right-3"
                >
                  <Sparkles className="w-10 h-10 text-yellow-300" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Trở thành VIP
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Mở khóa toàn bộ sức mạnh huyền bí và trải nghiệm không giới hạn
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 w-full px-4"
            >
              <div className="relative group max-w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Button
                  onClick={() => router.push('/vip/plans')}
                  className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-bold
                  py-4 px-6 sm:py-6 sm:px-12 text-[16px] xs:text-lg sm:text-xl rounded-xl shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all border border-yellow-300/50
                  flex items-center justify-center max-w-full"
                >
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-pulse flex-shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">Nâng cấp ngay</span>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-yellow-400 text-sm"
            >
              <Check className="w-4 h-4" />
              <span>Dùng thử miễn phí 7 ngày</span>
              <span className="text-gray-500 mx-2">•</span>
              <Check className="w-4 h-4" />
              <span>Hủy bất cứ lúc nào</span>
            </motion.div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Quyền lợi đặc biệt dành cho{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                thành viên VIP
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Nâng tầm trải nghiệm huyền bí của bạn lên một tầng cao mới
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 shadow-lg hover:shadow-yellow-500/10"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border border-yellow-500/20 rounded-3xl p-10"
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                Tính năng đầy đủ
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </h3>
              <p className="text-gray-300">Mọi thứ bạn cần để khám phá vận mệnh</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 bg-gray-900/40 rounded-xl p-4 border border-gray-700/30 hover:border-yellow-500/30 transition-all"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-gray-900" />
                  </div>
                  <span className="text-gray-200">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-yellow-500/20 py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-8">
            <Crown className="w-16 h-16 text-yellow-400 fill-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Sẵn sàng bắt đầu hành trình VIP?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Tham gia hàng nghìn người dùng đã nâng cấp và khám phá tiềm năng tối đa
            </p>

            {/* <Button
              onClick={() => router.push('/vip/plans')}
              // className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-bold py-6 px-12 rounded-2xl shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all text-xl border-2 border-yellow-300"
              className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-bold
              py-4 px-6 sm:py-6 sm:px-12 text-[16px] xs:text-lg sm:text-xl rounded-xl shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all border border-yellow-300/50
              flex items-center justify-center max-w-full"
            >
              <Crown className="w-6 h-6 mr-2" />
              Chọn gói VIP ngay
            </Button> */}

            <Button
              onClick={() => router.push('/vip/plans')}
              className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-bold
                  py-4 px-6 sm:py-6 sm:px-12 text-[16px] xs:text-lg sm:text-xl rounded-xl shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all border border-yellow-300/50
                 items-center justify-center max-w-full"
            >
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-pulse flex-shrink-0" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">Chọn gói VIP ngay</span>
            </Button>

            <p className="text-gray-500 text-sm mt-6">
              Ưu đãi đặc biệt: Giảm 30% cho tháng đầu tiên!
            </p>
          </div>
        </motion.section>
        <div className="mt-auto">
          <Footer forceRender={true} />
        </div>
      </main>
    </div>
  );
}
