'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Check,
  Zap,
  Star,
  Shield,
  ArrowLeft,
  CreditCard,
  Copy,
  QrCode,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { VIPPlanInfo, VIPTier } from '@/lib/vip-types';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Footer } from '@/components/layout/Footer';

// Updated Pricing & Plan Info
const VIP_PLANS_DISPLAY: (VIPPlanInfo & { badge?: string })[] = [
  {
    tier: VIPTier.FREE,
    name: 'Thành viên',
    nameEn: 'Free Tier',
    price: 0,
    duration: 'vĩnh viễn',
    color: 'from-gray-500 to-gray-600',
    description: 'Miễn phí & Cơ bản',
    icon: 'free',
    features: [
      '3 lượt Tarot/ngày',
      '10 tin nhắn AI/ngày',
      'Tử vi cơ bản',
    ]
  },
  {
    tier: VIPTier.VIP,
    name: 'VIP Premium',
    nameEn: 'VIP',
    price: 18000,
    duration: 'tháng',
    color: 'from-amber-400 to-yellow-600',
    description: 'Mở khóa toàn bộ sức mạnh',
    icon: 'crown',
    badge: 'PHỔ BIẾN NHẤT',
    popular: true,
    features: [
      'Không giới hạn Tarot & AI',
      'Biểu đồ chiêm tinh 3D',
      'Phân tích chuyên sâu',
      'Nội dung độc quyền',
      'Hỗ trợ ưu tiên 24/7'
    ]
  }
];

export default function VIPPlansPage() {
  const router = useRouter();
  const sidebarCollapsed = useSidebarCollapsed();
  const { token, upgradeToVip, user } = useAuthStore();
  // Payment State
  const [selectedPlan, setSelectedPlan] = useState<VIPTier | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  // Default to FREE if user data not fully loaded, but try to use actual tier
  const [currentTier, setCurrentTier] = useState<VIPTier>(VIPTier.FREE);

  useEffect(() => {
    if (user?.vipTier) {
      setCurrentTier(user.vipTier as VIPTier);
    }
  }, [user?.vipTier]);

  // Reset payment state when switching accounts or logging out
  useEffect(() => {
    console.log('Auth state changed:', { userId: user?.id, hasToken: !!token });
    if (!user || !token) {
      console.log('Resetting payment state due to logout/missing auth');
      setPaymentData(null);
      setShowPayment(false);
    } else {
      // If user changed but still logged in (switching accounts directly?), we should also reset
      // We can track previous user ID if needed, but for now rely on unmount or simple logic.
      // Actually, let's just force reset if the paymentData doesn't belong to this user? 
      // No, paymentData doesn't store owner ID. 
      // Let's just always reset on mount or user change to be safe?
      // No, we don't want to reset if we just refreshed page (persist).
      // BUT this component is not persisting paymentData in localStore, only React State.
      // So refresh wipes it anyway.
    }
  }, [user, token]);

  // Separate effect to track User ID changes specifically for switching accounts
  useEffect(() => {
    if (user?.id) {
      console.log('User ID changed to:', user.id);
      // Optional: Check if we have a stale payment session
      setPaymentData(null);
      setShowPayment(false);
    }
  }, [user?.id]);

  const [paymentData, setPaymentData] = useState<{
    subscriptionId: string;
    qrUrl: string;
    amount: number;
    transactionCode: string;
    bankInfo: any;
    expiresAt: string;
  } | null>(null);

  // Poll for payment success
  useEffect(() => {
    let pollTimer: NodeJS.Timeout;

    if (paymentData?.subscriptionId && showPayment) {
      pollTimer = setInterval(async () => {
        try {
          if (!token) return;
          const statusRes = await import('@/lib/api-client').then(m => m.paymentApi.checkStatus(paymentData.subscriptionId, token));

          console.log('Polling Status RAW:', statusRes);

          if (!statusRes) {
            console.warn('Empty response from checkStatus');
            return;
          }

          // Safe access & Normalize
          const rawStatus = (statusRes?.data?.status || statusRes?.status || '').toString().toLowerCase();
          const isPaid = statusRes?.data?.isPaid || statusRes?.isPaid === true;

          console.log(`Polling check: status="${rawStatus}", isPaid=${isPaid}`);

          if (rawStatus === 'active' || rawStatus === 'paid' || rawStatus === 'success' || isPaid) {
            clearInterval(pollTimer);
            toast.success('Nâng cấp VIP thành công! 🎉');
            upgradeToVip();
            router.push('/dashboard');
          } else if (rawStatus === 'expired' || rawStatus === 'cancelled') {
            clearInterval(pollTimer);
            toast.error('Giao dịch đã hết hạn hoặc bị hủy.');
            setShowPayment(false);
            setPaymentData(null);
          }
        } catch (error) {
          console.error('Polling error', error);
        }
      }, 3000);
    }

    return () => clearInterval(pollTimer);
  }, [paymentData, showPayment, token, upgradeToVip, router]);

  const handleSelectPlan = async (tier: VIPTier) => {
    if (tier === VIPTier.FREE) {
      toast.error('Bạn đang dùng gói miễn phí');
      return;
    }

    if (showPayment && selectedPlan === tier) {
      document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setSelectedPlan(tier);
    setLoading(true);

    try {
      if (!token) {
        toast.error('Vui lòng đăng nhập để nâng cấp');
        return;
      }

      const { paymentApi } = await import('@/lib/api-client');
      const res = await paymentApi.create({ tier: 'VIP', durationMonths: 1 }, token); // Default 1 month for now, logic can be expanded

      if (res.success) {
        setPaymentData(res.data);
        setShowPayment(true);
        setTimeout(() => {
          document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        toast.error('Không thể tạo giao dịch. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        // Optional: clear auth via useAuthStore if accessible, or just redirect
        router.push('/auth/login');
      } else {
        toast.error('Lỗi kết nối server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = () => {
    toast.loading('Đang kiểm tra giao dịch...');
    // The polling will catch it, but we can force a check or just give feedback
    setTimeout(() => toast.dismiss(), 2000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-black font-sans text-white">
      <AnimatedBackground />
      <Sidebar />

      <main
        className="flex-1 flex flex-col transition-all duration-200 relative z-10 overflow-auto"
        style={{ marginLeft: sidebarCollapsed ? '10px' : '280px' }}
      >
        {/* Header Section */}
        <div className="relative pt-20 pb-12 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
          >
            <Crown className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="text-yellow-200 font-medium tracking-wide text-sm uppercase">Nâng tầm trải nghiệm tâm linh</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent"
            style={{ fontFamily: 'Pacifico, cursive' }}
          >
            Trở thành VIP Member
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Đầu tư <span className="text-yellow-400 font-bold">1.300đ mỗi ngày</span> để thấu hiểu bản thân và định hướng tương lai chuẩn xác nhất.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto px-6 pb-20 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {VIP_PLANS_DISPLAY.map((plan, idx) => {
              const isVip = plan.tier === VIPTier.VIP;
              const isCurrent = currentTier === plan.tier;

              return (
                <motion.div
                  key={plan.tier}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className={`relative group rounded-[2rem] border transition-all duration-500 overflow-hidden
                                ${isVip
                      ? 'bg-gradient-to-b from-gray-900/80 to-black/90 border-yellow-500/50 shadow-2xl shadow-yellow-900/20'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }
                            `}
                >
                  {/* Popular Badge */}
                  {isVip && (
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-500 to-amber-600 text-black text-xs font-bold px-4 py-2 rounded-bl-2xl z-20">
                      PHỔ BIẾN NHẤT
                    </div>
                  )}

                  {/* Glow Effect for VIP */}
                  {isVip && (
                    <div className="absolute -inset-1 bg-gradient-to-br from-yellow-500/20 to-purple-600/20 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  )}

                  <div className="relative p-8 z-10 h-full flex flex-col">
                    <div className="mb-6">
                      <h3 className={`text-xl font-medium mb-2 ${isVip ? 'text-yellow-400' : 'text-gray-300'}`}>
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-bold ${isVip ? 'text-white' : 'text-gray-400'}`}>
                          {plan.price.toLocaleString('vi-VN')}đ
                        </span>
                        {plan.price > 0 && <span className="text-gray-500">/{plan.duration}</span>}
                      </div>
                      <p className="text-gray-500 text-sm mt-3">{plan.description}</p>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`mt-1 p-0.5 rounded-full ${isVip ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400'}`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className={`text-sm ${isVip ? 'text-gray-200' : 'text-gray-400'}`}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleSelectPlan(plan.tier)}
                      disabled={isCurrent || (plan.tier === VIPTier.FREE) || loading}
                      className={`w-full py-6 rounded-xl font-bold tracking-wide transition-all
                                        ${isCurrent
                          ? 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/70'
                          : isVip
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black hover:shadow-lg hover:shadow-yellow-500/25 hover:scale-[1.02]'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }
                                    `}
                    >
                      {loading && selectedPlan === plan.tier ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      {isCurrent ? 'Đang sử dụng' : (plan.price === 0 ? 'Gói hiện tại' : 'Nâng cấp ngay')}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Payment Section */}
        <AnimatePresence>
          {showPayment && paymentData && (
            <motion.div
              id="payment-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full bg-black/10 backdrop-blur-sm border-t border-white/5"
            >
              <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-3">Thông tin thanh toán</h2>
                  <p className="text-gray-400">Vui lòng chuyển khoản theo thông tin bên dưới để kích hoạt VIP</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                  {/* QR Code Column */}
                  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    {/* Dynamic QR */}
                    <div className="w-56 h-auto bg-white rounded-lg flex items-center justify-center mb-4 relative p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={paymentData.qrUrl} alt="VietQR Code" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-black font-bold text-xl mb-1">{paymentData.amount?.toLocaleString('vi-VN')} VNĐ</div>
                    <div className="text-gray-500 text-xs uppercase tracking-wider text-center px-4 break-all">
                      Nội dung: <span className="font-bold text-gray-800">{paymentData.transactionCode}</span>
                    </div>
                  </div>

                  {/* Bank Info Column */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="space-y-4">

                      {/* Bank Name */}
                      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-colors group shadow-lg">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ngân hàng</div>
                        <div className="flex justify-between items-center text-white font-medium">
                          <span>{paymentData.bankInfo?.bankId || 'MB BANK'}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(paymentData.bankInfo?.bankId || 'MB BANK', 'Ngân hàng')} className="text-gray-400 hover:text-white group-hover:bg-white/10">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Account Number */}
                      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-colors group shadow-lg">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Số tài khoản</div>
                        <div className="flex justify-between items-center text-white font-medium">
                          <span className="text-xl tracking-wider">{paymentData.bankInfo?.accountNo}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(paymentData.bankInfo?.accountNo, 'Số tài khoản')} className="text-gray-400 hover:text-white group-hover:bg-white/10">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Account Name */}
                      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-colors group shadow-lg">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Chủ tài khoản</div>
                        <div className="flex justify-between items-center text-white font-medium">
                          <span>{paymentData.bankInfo?.accountName}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(paymentData.bankInfo?.accountName, 'Tên chủ TK')} className="text-gray-400 hover:text-white group-hover:bg-white/10">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-colors group shadow-lg">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nội dung chuyển khoản</div>
                        <div className="flex justify-between items-center text-white font-medium">
                          <span className="break-all">{paymentData.transactionCode}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(paymentData.transactionCode, 'Nội dung')} className="text-gray-400 hover:text-white group-hover:bg-white/10">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleManualCheck}
                      className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 text-lg flex items-center justify-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang chờ xác nhận...
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Hệ thống sẽ tự động kích hoạt sau 1-3 phút
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto">
          <Footer forceRender={true} />
        </div>
      </main>
    </div >
  );
}

