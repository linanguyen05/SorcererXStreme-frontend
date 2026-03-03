"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Star, Clock, MessageSquare, Sparkles, Check,
  User, Mail, Phone, Calendar, CreditCard, X
} from "lucide-react";
import { servicesData, type ServicePackage } from "@/lib/service-listing-data";

// IMPORT SIDEBAR CỦA TEAM
import { Sidebar, useSidebarCollapsed } from "@/components/layout/Sidebar";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const service = servicesData.find((s) => s.slug === slug);
  
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
  });

  // LOGIC SIDEBAR CO GIÃN
  const isCollapsed = useSidebarCollapsed();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-400 text-lg">Không tìm thấy dịch vụ</p>
        <button 
          onClick={() => router.push("/service-listing")} 
          className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const handleOpenCheckout = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đã gửi yêu cầu thanh toán gói ${selectedPackage?.name} cho khách hàng ${formData.fullName}`);
    setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex text-white">
      {/* 1. HIỂN THỊ SIDEBAR Ở BÊN TRÁI */}
      <Sidebar />

      {/* 2. BỌC TOÀN BỘ NỘI DUNG VÀO MOTION.MAIN ĐỂ TỰ ĐỘNG THỤT LỀ */}
      <motion.main
        animate={{ paddingLeft: isMobile ? 0 : (isCollapsed ? 80 : 280) }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex-1 min-h-screen relative overflow-y-auto custom-scrollbar pb-20"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-96 bg-purple-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-12 py-8 space-y-10">
          {/* Nút quay lại */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>

          {/* Thông tin Dịch vụ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-2">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-[400px] object-cover rounded-2xl"
                />
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  {service.category}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {service.title}
                </h1>
                <p className="text-lg text-gray-200 font-medium">{service.subtitle}</p>
              </div>
              
              <p className="text-gray-400 leading-relaxed">
                {service.description}
              </p>

              <div className="flex gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  <span>{service.format}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Danh sách Gói Dịch vụ */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-400" />
              Các Gói Dịch Vụ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.packages.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col relative border transition-all hover:bg-white/10 ${
                    pkg.popular ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-white/10'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      PHỔ BIẾN NHẤT
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                  <div className="text-2xl font-bold text-purple-400 mb-4">{pkg.price}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <Clock className="h-4 w-4" /> {pkg.duration}
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleOpenCheckout(pkg)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      pkg.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:scale-[1.02] shadow-lg' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/5'
                    }`}
                  >
                    Chọn gói này
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Đánh giá từ khách hàng */}
          {service.reviews && service.reviews.length > 0 && (
            <div className="space-y-6 pt-10 border-t border-white/10 mt-12">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-purple-400" />
                Đánh giá từ khách hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.reviews.map((review, i) => (
                  <motion.div 
                    key={review.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.1 }} 
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{review.name}</h4>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, index) => (
                        <Star 
                          key={index} 
                          className={`h-4 w-4 ${index < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">"{review.comment}"</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.main>

      {/* Popup Thanh toán (Modal) */}
      <AnimatePresence>
        {showCheckout && selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-white/20 shadow-2xl rounded-3xl w-full max-w-md p-6 sm:p-8 relative text-white"
            >
              <button 
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Thông tin cá nhân</h2>
              <p className="text-gray-400 text-sm mb-6">
                Vui lòng điền thông tin để bắt đầu gói <strong className="text-purple-400">{selectedPackage.name}</strong>
              </p>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm flex items-center gap-2 text-gray-300"><User className="h-4 w-4"/> Họ và tên</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm flex items-center gap-2 text-gray-300"><Mail className="h-4 w-4"/> Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm flex items-center gap-2 text-gray-300"><Phone className="h-4 w-4"/> Số điện thoại</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 transition-all"
                      placeholder="090..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm flex items-center gap-2 text-gray-300"><Calendar className="h-4 w-4"/> Ngày sinh</label>
                    <input
                      required
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      style={{ colorScheme: 'dark' }}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold hover:scale-[1.02] transition-transform flex justify-center items-center gap-2 shadow-lg">
                    <CreditCard className="h-5 w-5" />
                    {selectedPackage.priceValue === 0 ? "Xác nhận đăng ký" : `Thanh toán ${selectedPackage.price}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}