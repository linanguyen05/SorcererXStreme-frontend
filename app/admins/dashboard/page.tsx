'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  User, Briefcase, CheckCircle, AlertCircle,
  Bell, Search, X, ShieldCheck, UserCheck, Users, BarChart3,
  Eye, Ban, Mail, Phone, Award, FileText,
  DollarSign, Zap, TrendingUp, Activity, Calendar, ArrowUpRight, Lock,
  Globe, BookOpen, Star, UserX, ShieldAlert
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { adminApi } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for demo fallback
const mockExperts = [
  {
    id: "exp-1",
    name: "Master Alistair",
    title: "Chuyên gia Thần Số Học & Tarot",
    email: "alistair.numerology@gmail.com",
    phone: "0912.345.678",
    experience: "7 năm kinh nghiệm",
    experienceDetail: "Hơn 7 năm học hỏi và tư vấn thực tế. Đã giải luận thành công cho hơn 1.000 bản đồ số học và trải bài Tarot, giúp nhiều người định hình rõ ràng hướng đi sự nghiệp.",
    specs: ["Tarot", "Thần Số Học"],
    status: "PENDING",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    cccdNumber: "031092008472",
    certifications: [
      "Chứng chỉ Chuyên gia Thần Số Học - Học viện Mystic Việt Nam",
      "Chứng nhận Tarot Reader Chuyên Nghiệp AAT (American Association of Tarot)"
    ]
  },
  {
    id: "exp-2",
    name: "Astrologer Celine",
    title: "Chuyên gia Bản đồ sao & Chiêm tinh học",
    email: "celine.astrology@outlook.com",
    phone: "0988.777.666",
    experience: "4 năm kinh nghiệm",
    experienceDetail: "Chuyên sâu về chiêm tinh phương Tây, bản đồ sao cặp đôi (synastry) và bản đồ sao vận hạn. Thấu cảm sâu sắc và định hướng tâm lý nhẹ nhàng.",
    specs: ["Chiêm Tinh"],
    status: "PENDING",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    cccdNumber: "030095018243",
    certifications: [
      "Chứng chỉ Chiêm Tinh Học Căn Bản & Nâng Cao - LSA (London School of Astrology)",
      "Bằng tốt nghiệp tâm lý học tham vấn - ĐH KHXH&NV"
    ]
  },
  {
    id: "exp-3",
    name: "Thầy Minh Tuệ",
    title: "Chuyên gia Kinh Dịch & Tử Vi Phương Đông",
    email: "minhtue.tuvi@vietnam.vn",
    phone: "0905.123.456",
    experience: "12 năm kinh nghiệm",
    experienceDetail: "Hơn một thập kỷ nghiên cứu cổ thư phương Đông, chuyên lập lá số tử vi trọn đời, đoán giải vận hạn năm, phong thủy gia trạch và gieo quẻ Kinh Dịch giải quyết bế tắc tức thời.",
    specs: ["Tử Vi", "Kinh Dịch"],
    status: "APPROVED",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    cccdNumber: "001094002847",
    certifications: [
      "Bằng Viện Sĩ Nghiên Cứu Di Sản Cổ Học Đông Á",
      "Ủy Viên Hiệp Hội Phong Thủy Kinh Dịch Việt Nam"
    ]
  },
  {
    id: "exp-4",
    name: "Master Lina",
    title: "Chuyên gia Tarot & Chiêm tinh học",
    email: "lina.mystic@gmail.com",
    phone: "0934.567.890",
    experience: "5 năm kinh nghiệm",
    experienceDetail: "Định hướng sự nghiệp, tình duyên thông qua các trải bài Tarot chuyên sâu và bản đồ sao cá nhân. Hơn 5 năm kinh nghiệm thấu cảm và chữa lành tâm lý.",
    specs: ["Tarot", "Chiêm Tinh"],
    status: "BANNED",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    cccdNumber: "002095001948",
    certifications: [
      "Chứng nhận Tarot Reader Chuyên Nghiệp - Hiệp Hội Tarot Việt Nam",
      "Khóa huấn luyện chữa lành đứa trẻ bên trong (Inner Child Healing)"
    ]
  },
  {
    id: "exp-5",
    name: "Cô Diệu Lâm",
    title: "Chuyên gia Phong Thủy Hôn Nhân & Gia Đình",
    email: "dieulam.fengshui@gmail.com",
    phone: "0976.223.344",
    experience: "8 năm kinh nghiệm",
    experienceDetail: "Tư vấn hòa hợp gia đạo, phong thủy phòng ngủ, phong thủy nhà bếp và ngày lành tháng tốt cho việc đại sự như cưới hỏi, làm nhà.",
    specs: ["Phong Thủy"],
    status: "REJECTED",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    cccdNumber: "003096001859",
    certifications: [
      "Chứng nhận Chuyên Gia Phong Thủy - Viện Nghiên Cứu Phong Thủy Quốc Tế",
      "Chứng nhận Tham Vấn Tâm Lý Gia Đình"
    ]
  }
];

const mockServices = [
  {
    id: "ser-1",
    name: "Tư vấn tình duyên chuyên sâu qua Thần Số Học",
    expertName: "Master Alistair",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    expertEmail: "alistair.numerology@gmail.com",
    price: "450.000đ",
    duration: "45 phút",
    status: "PENDING",
    category: "Thần Số Học",
    format: "Online (Google Meet)",
    description: "Giải mã các chỉ số Đường đời, Sứ mệnh và Thái độ để thấu hiểu năng lượng tình duyên bản thân và định hướng mối quan hệ tương lai. Khám phá các năm cá nhân thuận lợi cho hôn đạo."
  },
  {
    id: "ser-2",
    name: "Giải mã bản đồ sao cặp đôi (Synastry Chart)",
    expertName: "Astrologer Celine",
    expertAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    expertEmail: "celine.astrology@outlook.com",
    price: "750.000đ",
    duration: "90 phút",
    status: "PENDING",
    category: "Chiêm Tinh",
    format: "Online (Zoom)",
    description: "Phân tích so sánh hai bản đồ sao cá nhân để tìm ra điểm tương hợp, xung khắc, bài học nhân quả và tiềm năng gắn kết lâu dài giữa hai người. Thích hợp cho các cặp đôi đang muốn tiến tới hôn nhân."
  },
  {
    id: "ser-3",
    name: "Lập lá số tử vi trọn đời & Luận giải đại vận",
    expertName: "Thầy Minh Tuệ",
    expertAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    expertEmail: "minhtue.tuvi@vietnam.vn",
    price: "1.200.000đ",
    duration: "120 phút",
    status: "APPROVED",
    category: "Tử Vi",
    format: "Gọi thoại trực tiếp",
    description: "Luận giải chi tiết 12 cung số trên lá số Tử Vi. Dự báo chi tiết về tài lộc, gia đạo, công danh, sức khỏe và các hạn lớn trong cuộc đời. Giải đáp các câu hỏi cụ thể của đương số."
  },
  {
    id: "ser-4",
    name: "Trải bài Tarot định hướng sự nghiệp 6 tháng tới",
    expertName: "Master Lina",
    expertAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    expertEmail: "lina.mystic@gmail.com",
    price: "350.000đ",
    duration: "30 phút",
    status: "BANNED",
    category: "Tarot",
    format: "Online (Google Meet)",
    description: "Sử dụng bộ bài Rider-Waite để phân tích tình trạng công việc hiện tại, các cơ hội mới, thách thức ẩn giấu và lời khuyên hành động cụ thể để đạt bước tiến lớn trong sự nghiệp."
  },
  {
    id: "ser-5",
    name: "Giải quẻ dịch học vấn thi cử & Phong thủy phòng học",
    expertName: "Cô Diệu Lâm",
    expertAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    expertEmail: "dieulam.fengshui@gmail.com",
    price: "500.000đ",
    duration: "60 phút",
    status: "REJECTED",
    category: "Phong Thủy",
    format: "Tư vấn tại gia / Online",
    description: "Gieo quẻ Kinh Dịch hỏi về kết quả thi cử, xin học bổng. Đồng thời tư vấn sắp xếp bàn học, hướng ngồi theo phong thủy bản mệnh của học sinh để tăng cường tập trung và may mắn."
  }
];

// --- VIP Revenue Data & Component ---
const vipRevenueData = [
  { month: "Tháng 1", revenue: 15400000, subscribers: 120 },
  { month: "Tháng 2", revenue: 18900000, subscribers: 150 },
  { month: "Tháng 3", revenue: 24500000, subscribers: 190 },
  { month: "Tháng 4", revenue: 22000000, subscribers: 175 },
  { month: "Tháng 5", revenue: 31200000, subscribers: 240 },
  { month: "Tháng 6", revenue: 38500000, subscribers: 298 },
];

function VipRevenueChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const maxRevenue = Math.max(...vipRevenueData.map(d => d.revenue));
  const minRevenue = Math.min(...vipRevenueData.map(d => d.revenue));
  
  const width = 500;
  const height = 180;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = vipRevenueData.map((d, index) => {
    const x = padding + (index / (vipRevenueData.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.revenue - minRevenue * 0.8) / (maxRevenue - minRevenue * 0.8)) * chartHeight;
    return { x, y, ...d };
  });
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  
  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl group hover:border-red-500/30 transition-all duration-300">
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-red-500/10 transition-colors duration-500"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">VIP Revenue</span>
          <h3 className="text-lg font-bold text-white mt-1">Doanh thu VIP Account</h3>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-green-400 font-bold text-sm bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+23.4%</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-[200px] w-full mt-4 z-10 flex flex-col justify-between">
        <svg className="w-full h-[180px] overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="vipAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="vipLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
          </defs>
          
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding + chartHeight * ratio;
            return (
              <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            );
          })}
          
          <path d={areaPath} fill="url(#vipAreaGrad)" />
          <path d={linePath} fill="none" stroke="url(#vipLineGrad)" strokeWidth="3" strokeLinecap="round" />
          
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 6 : 4}
                className={`${hoveredIndex === i ? 'fill-red-400 stroke-white' : 'fill-[#121214] stroke-red-500'} stroke-2 transition-all duration-150 cursor-pointer`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={15}
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}
        </svg>
        
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bg-[#1a1a1e] border border-white/10 rounded-xl p-3 shadow-2xl z-20 pointer-events-none text-xs flex flex-col gap-1"
              style={{
                left: `${(points[hoveredIndex].x / width) * 100}%`,
                top: `${(points[hoveredIndex].y / height) * 100 - 35}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <p className="text-gray-400 font-medium">{points[hoveredIndex].month}</p>
              <p className="text-white font-bold text-sm">{formatVND(points[hoveredIndex].revenue)}</p>
              <p className="text-red-400 font-semibold">{points[hoveredIndex].subscribers} VIP members</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between px-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-2">
          {vipRevenueData.map((d, i) => (
            <span key={i}>{d.month.replace("Tháng ", "T")}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Service Packages Revenue Data & Component ---
const serviceRevenueData = [
  { name: "Tarot", revenue: 84500000, bookings: 420, color: "from-purple-500 to-indigo-500" },
  { name: "Thần Số Học", revenue: 112000000, bookings: 560, color: "from-red-500 to-rose-500" },
  { name: "Chiêm Tinh", revenue: 67000000, bookings: 310, color: "from-blue-500 to-cyan-500" },
  { name: "Phong Thủy", revenue: 95000000, bookings: 190, color: "from-amber-500 to-orange-500" },
];

function ServiceRevenueChart() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const maxRevenue = Math.max(...serviceRevenueData.map(s => s.revenue));
  
  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl group hover:border-red-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">Services Statistics</span>
          <h3 className="text-lg font-bold text-white mt-1">Doanh thu theo Gói Dịch vụ</h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">Tổng quan 4 lĩnh vực chính</span>
      </div>

      <div className="flex flex-col gap-5">
        {serviceRevenueData.map((service, index) => {
          const percentage = (service.revenue / maxRevenue) * 100;
          const isSelected = selectedService === index;
          
          return (
            <div 
              key={index} 
              className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${isSelected ? 'bg-white/5 border border-white/10' : 'bg-transparent border border-transparent'}`}
              onClick={() => setSelectedService(isSelected ? null : index)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">{service.name}</span>
                <span className="text-sm font-black text-white">{formatVND(service.revenue)}</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${service.color}`} 
                />
              </div>
              
              <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3 flex items-center justify-between text-xs text-gray-400"
                  >
                    <span>Lượt đặt: <strong>{service.bookings} lượt</strong></span>
                    <span>Đơn giá TB: <strong>{formatVND(service.revenue / service.bookings)} / lượt</strong></span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Participant Distribution Panel (Real API data) ---
function UserDistributionPanel({ data }: { data: { total: number; byRole: { user: number; guest: number; expert: number; admin: number } } | null }) {
  const userCount = data?.byRole.user ?? 0;
  const guestCount = data?.byRole.guest ?? 0;
  const expertCount = data?.byRole.expert ?? 0;
  const adminCount = data?.byRole.admin ?? 0;
  const total = data?.total ?? 0;

  const segments = [
    { label: 'User', count: userCount, color: '#ef4444', borderColor: 'border-red-400/20', bgClass: 'bg-red-500' },
    { label: 'Guest', count: guestCount, color: '#a855f7', borderColor: 'border-purple-400/20', bgClass: 'bg-purple-500' },
    { label: 'Expert', count: expertCount, color: '#3b82f6', borderColor: 'border-blue-400/20', bgClass: 'bg-blue-500' },
    { label: 'Admin', count: adminCount, color: '#f59e0b', borderColor: 'border-amber-400/20', bgClass: 'bg-amber-500' },
  ];

  // Build donut segments
  let cumulativePercent = 0;
  const donutSegments = segments.map((seg) => {
    const pct = total > 0 ? (seg.count / total) * 100 : 0;
    const offset = cumulativePercent;
    cumulativePercent += pct;
    return { ...seg, pct, offset };
  });

  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl group hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">User Matrix</span>
        <h3 className="text-lg font-bold text-white mt-1 mb-6">Phân bố Người dùng theo Role</h3>
      </div>

      {!data ? (
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500 text-sm animate-pulse">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-around gap-6 mb-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                {donutSegments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="3.2"
                    strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                    strokeDashoffset={`-${seg.offset}`}
                    strokeLinecap="round"
                  />
                ))}
              </svg>
              <div className="absolute text-center">
                <p className="text-2xl font-black text-white">{total}</p>
                <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Tổng</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {segments.map((seg, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded ${seg.bgClass} mt-0.5 border ${seg.borderColor}`} />
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{seg.label}</p>
                    <p className="text-base font-black text-white">
                      {seg.count} ({total > 0 ? Math.round((seg.count / total) * 100) : 0}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Dữ liệu thời gian thực</span>
            <span className="text-green-400 flex items-center gap-1 font-bold">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// --- VIP Tier Statistics Panel (Real API data) ---
const vipTierConfig: Record<string, { label: string; color: string; bgClass: string; borderColor: string; icon: string }> = {
  FREE: { label: 'Miễn phí', color: '#6b7280', bgClass: 'bg-gray-500', borderColor: 'border-gray-400/20', icon: '🆓' },
  BASIC: { label: 'Basic', color: '#3b82f6', bgClass: 'bg-blue-500', borderColor: 'border-blue-400/20', icon: '⭐' },
  PRO: { label: 'Pro', color: '#a855f7', bgClass: 'bg-purple-500', borderColor: 'border-purple-400/20', icon: '💎' },
  PREMIUM: { label: 'Premium', color: '#f59e0b', bgClass: 'bg-amber-500', borderColor: 'border-amber-400/20', icon: '👑' },
};

function VipTierStatsPanel({ data }: { data: { total: number; totalVip: number; byTier: Record<string, number> } | null }) {
  if (!data) {
    return (
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl group hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">VIP Breakdown</span>
          <h3 className="text-lg font-bold text-white mt-1 mb-6">Thống kê gói VIP</h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500 text-sm animate-pulse">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  const tiers = Object.entries(data.byTier).map(([tier, count]) => {
    const config = vipTierConfig[tier] ?? { label: tier, color: '#6b7280', bgClass: 'bg-gray-500', borderColor: 'border-gray-400/20', icon: '📦' };
    return { tier, count, ...config };
  });

  // Sort: FREE first, then by count descending
  tiers.sort((a, b) => {
    if (a.tier === 'FREE') return -1;
    if (b.tier === 'FREE') return 1;
    return b.count - a.count;
  });

  const maxCount = Math.max(...tiers.map((t) => t.count), 1);
  const vipRatio = data.total > 0 ? Math.round((data.totalVip / data.total) * 100) : 0;

  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl group hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-amber-500/10 transition-colors duration-500"></div>

      <div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">VIP Breakdown</span>
            <h3 className="text-lg font-bold text-white mt-1">Thống kê gói VIP</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">{data.totalVip}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase">VIP Users</p>
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium">Tỷ lệ VIP / Tổng người dùng</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${vipRatio}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                />
              </div>
              <span className="text-sm font-black text-amber-400">{vipRatio}%</span>
            </div>
          </div>
        </div>

        {/* Tier breakdown */}
        <div className="flex flex-col gap-4">
          {tiers.map((t, i) => {
            const barPct = (t.count / maxCount) * 100;
            return (
              <div key={t.tier} className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">{t.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-300">{t.label}</span>
                    <span className="text-xs font-black text-white">{t.count} người</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-medium">
        <span>Dữ liệu thời gian thực</span>
        <span className="text-amber-400 flex items-center gap-1 font-bold">
          <Zap className="w-3 h-3" /> {data.totalVip} / {data.total} users
        </span>
      </div>
    </div>
  );
}

// --- Top Performing Services Component ---
const topServices = [
  { id: 1, name: "Giải mã bản đồ sao cá nhân nâng cao", category: "Chiêm Tinh", expert: "Astrologer Celine", bookings: 124, revenue: "31.000.000đ", trend: "up" },
  { id: 2, name: "Bản đồ vận mệnh cuộc đời trọn đời", category: "Thần Số Học", expert: "Master Alistair", bookings: 98, revenue: "49.000.000đ", trend: "up" },
  { id: 3, name: "Trải bài Tarot định hướng sự nghiệp 6 tháng", category: "Tarot", expert: "Master Lina", bookings: 85, revenue: "21.250.000đ", trend: "down" },
  { id: 4, name: "Tư vấn thiết kế Phong thủy nhà phố hợp mệnh", category: "Phong Thủy", expert: "Cô Diệu Lâm", bookings: 42, revenue: "50.400.000đ", trend: "up" },
];

function TopPerformingServices() {
  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl group hover:border-red-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">High Performance</span>
          <h3 className="text-lg font-bold text-white mt-1">Dịch vụ Thịnh hành nhất</h3>
        </div>
        <span className="text-xs text-red-400 font-bold border border-red-500/20 bg-red-500/5 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> VIP Choice
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-gray-500 uppercase tracking-widest font-black">
              <th className="pb-3 text-left">Dịch vụ</th>
              <th className="pb-3 text-center">Số lượt đặt</th>
              <th className="pb-3 text-right">Tổng Doanh thu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {topServices.map((ser, i) => (
              <tr key={ser.id} className="group hover:bg-white/5 transition-colors duration-150">
                <td className="py-3.5 pr-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-xs font-black flex items-center justify-center text-red-500">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors duration-150 line-clamp-1">{ser.name}</p>
                      <p className="text-[9px] text-gray-500 font-semibold mt-0.5">{ser.expert} • {ser.category}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 text-center text-xs font-bold text-gray-300">
                  {ser.bookings}
                </td>
                <td className="py-3.5 text-right">
                  <span className="text-xs font-black text-white">{ser.revenue}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Traffic Chart Component ---
const trafficData = {
  day: [
    { label: "T2", views: 420, visitors: 280 },
    { label: "T3", views: 550, visitors: 390 },
    { label: "T4", views: 680, visitors: 480 },
    { label: "T5", views: 490, visitors: 310 },
    { label: "T6", views: 820, visitors: 560 },
    { label: "T7", views: 950, visitors: 710 },
    { label: "CN", views: 1100, visitors: 820 },
  ],
  week: [
    { label: "Tuần 1", views: 4100, visitors: 2900 },
    { label: "Tuần 2", views: 4900, visitors: 3500 },
    { label: "Tuần 3", views: 5600, visitors: 4200 },
    { label: "Tuần 4", views: 6800, visitors: 5100 },
  ],
  month: [
    { label: "T1", views: 12000, visitors: 8900 },
    { label: "T2", views: 14500, visitors: 10200 },
    { label: "T3", views: 18900, visitors: 14100 },
    { label: "T4", views: 16000, visitors: 11500 },
    { label: "T5", views: 22000, visitors: 16800 },
    { label: "T6", views: 28500, visitors: 21000 },
  ]
};

function TrafficChart() {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const activeData = trafficData[timeframe];
  
  const maxVal = Math.max(...activeData.map(d => Math.max(d.views, d.visitors)));

  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl group hover:border-red-500/30 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">Traffic Analyzer</span>
          <h3 className="text-lg font-bold text-white mt-1">Lưu lượng Truy cập</h3>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-fit self-start sm:self-auto">
          {(['day', 'week', 'month'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-150 ${timeframe === tab ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              {tab === 'day' ? 'Ngày' : tab === 'week' ? 'Tuần' : 'Tháng'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between h-[180px] pt-4 px-2 relative">
        {activeData.map((d, i) => {
          const viewHeight = (d.views / maxVal) * 100;
          const visitorHeight = (d.visitors / maxVal) * 100;

          return (
            <div key={i} className="flex flex-col items-center gap-3 w-full group/bar">
              <div className="flex items-end justify-center gap-1.5 w-full h-[130px] relative">
                <div className="w-2.5 sm:w-3.5 bg-red-500/20 hover:bg-red-500 border border-red-500/30 rounded-t transition-all duration-300 relative group/view" style={{ height: `${viewHeight}%` }}>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#1a1a1e] border border-white/10 text-[9px] text-white font-bold py-1 px-1.5 rounded opacity-0 group-hover/view:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-30">
                    Views: {d.views}
                  </div>
                </div>

                <div className="w-2.5 sm:w-3.5 bg-indigo-500/20 hover:bg-indigo-500 border border-indigo-500/30 rounded-t transition-all duration-300 relative group/visitor" style={{ height: `${visitorHeight}%` }}>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#1a1a1e] border border-white/10 text-[9px] text-white font-bold py-1 px-1.5 rounded opacity-0 group-hover/visitor:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-30">
                    Visitors: {d.visitors}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{d.label}</span>
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-4 mt-6 text-xs justify-center pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-red-500" />
          <span className="text-gray-400 font-medium">Lượt xem trang (Views)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
          <span className="text-gray-400 font-medium">Khách truy cập (Visitors)</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { token } = useAuthStore();

  // --- STATES ---
  const [activeTab, setActiveTab] = useState<'stats' | 'approval'>('stats');
  const [showNotifications, setShowNotifications] = useState(false);
  const [experts, setExperts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeApprovalTab, setActiveApprovalTab] = useState<'experts' | 'services'>('experts');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED'>('PENDING');
  const [pendingSearch, setPendingSearch] = useState('');
  const [selectedExpertForDetails, setSelectedExpertForDetails] = useState<any | null>(null);
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState<any | null>(null);

  // Stats for cards (uses total pending across mock local storage)
  const [stats, setStats] = useState({
    pendingExpertsCount: 0,
    pendingServicesCount: 0
  });

  // Real-time statistics from API
  const [userStatsData, setUserStatsData] = useState<{ total: number; byRole: { user: number; guest: number; expert: number; admin: number } } | null>(null);
  const [vipTierData, setVipTierData] = useState<{ total: number; totalVip: number; byTier: Record<string, number> } | null>(null);

  // Notifications simulation state
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Đăng ký mới", desc: "Chuyên gia Master Alistair đã nộp hồ sơ đăng ký tài khoản.", time: "10 phút trước", icon: <UserCheck className="w-4 h-4 text-purple-400" /> },
    { id: 2, title: "Dịch vụ mới", desc: "Dịch vụ 'Giải mã bản đồ sao cặp đôi' đang chờ phê duyệt.", time: "1 giờ trước", icon: <Briefcase className="w-4 h-4 text-yellow-400" /> },
  ]);

  // Helper functions for mock persistence
  const getMockExpertsFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock-admin-experts');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('mock-admin-experts', JSON.stringify(mockExperts));
    }
    return mockExperts;
  };

  const getMockServicesFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock-admin-services');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('mock-admin-services', JSON.stringify(mockServices));
    }
    return mockServices;
  };

  // Load and fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      let expertsData = [];
      let servicesData = [];
      const statusParam = statusFilter === 'ALL' ? undefined : statusFilter;

      if (token) {
        try {
          expertsData = await adminApi.getExperts(token, statusParam);
        } catch (e) {
          console.warn("API getExperts failed, fallback to local updating.", e);
          const allMocks = getMockExpertsFromLocalStorage();
          expertsData = statusParam ? allMocks.filter((e: any) => e.status === statusParam) : allMocks;
        }
        try {
          servicesData = await adminApi.getServices(token, statusParam);
        } catch (e) {
          console.warn("API getServices failed, fallback to local updating.", e);
          const allMocks = getMockServicesFromLocalStorage();
          servicesData = statusParam ? allMocks.filter((s: any) => s.status === statusParam) : allMocks;
        }
      } else {
        const allMocksExp = getMockExpertsFromLocalStorage();
        expertsData = statusParam ? allMocksExp.filter((e: any) => e.status === statusParam) : allMocksExp;

        const allMocksSer = getMockServicesFromLocalStorage();
        servicesData = statusParam ? allMocksSer.filter((s: any) => s.status === statusParam) : allMocksSer;
      }

      setExperts(expertsData);
      setServices(servicesData);

      // Update total pending stats counts from local mock list for consistency
      const allMockExp = getMockExpertsFromLocalStorage();
      const allMockSer = getMockServicesFromLocalStorage();
      setStats({
        pendingExpertsCount: allMockExp.filter((e: any) => e.status === 'PENDING').length,
        pendingServicesCount: allMockSer.filter((s: any) => s.status === 'PENDING').length
      });

      // Fetch user & VIP statistics from API
      if (token) {
        try {
          const userStats = await adminApi.getUserStats(token);
          setUserStatsData(userStats);
        } catch (e) {
          console.warn("API getUserStats failed:", e);
        }
        try {
          const vipStats = await adminApi.getVipTierStats(token);
          setVipTierData(vipStats);
        } catch (e) {
          console.warn("API getVipTierStats failed:", e);
        }
      }
    } catch (error) {
      console.error("Error loading admin dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, statusFilter]);

  // Handle status update (Approve, reject, ban, or send to Pending)
  const handleUpdateExpertStatus = async (id: string, newStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED') => {
    const allMocks = getMockExpertsFromLocalStorage();
    const expert = allMocks.find((e: any) => e.id === id);
    const displayName = expert ? expert.name : id;
    
    let actionText = '';
    let notifTitle = '';
    let notifIcon = <AlertCircle className="w-4 h-4 text-yellow-400" />;

    if (newStatus === 'APPROVED') {
      actionText = 'phê duyệt';
      notifTitle = 'Duyệt chuyên gia thành công';
      notifIcon = <CheckCircle className="w-4 h-4 text-green-400" />;
    } else if (newStatus === 'PENDING') {
      actionText = 'chuyển về chờ duyệt';
      notifTitle = 'Chuyển về chờ duyệt';
      notifIcon = <AlertCircle className="w-4 h-4 text-yellow-400" />;
    } else if (newStatus === 'REJECTED') {
      actionText = 'từ chối';
      notifTitle = 'Từ chối chuyên gia';
      notifIcon = <X className="w-4 h-4 text-orange-400" />;
    } else if (newStatus === 'BANNED') {
      actionText = 'cấm hoạt động';
      notifTitle = 'Cấm tài khoản';
      notifIcon = <Ban className="w-4 h-4 text-red-500" />;
    }

    toast.promise(
      (async () => {
        if (token) {
          try {
            await adminApi.updateExpertStatus(id, newStatus, token);
          } catch (e) {
            console.warn("API updateExpertStatus failed, fallback to local updating.", e);
          }
        }

        // Update local mock list
        const updated = allMocks.map((e: any) => {
          if (e.id === id) {
            const updatedExp = { ...e, status: newStatus };
            if (selectedExpertForDetails && selectedExpertForDetails.id === id) {
              setSelectedExpertForDetails(updatedExp);
            }
            return updatedExp;
          }
          return e;
        });
        localStorage.setItem('mock-admin-experts', JSON.stringify(updated));

        // Refetch data to show correct filter view
        await fetchData();

        // Add simulation notification
        const newNotif = {
          id: Date.now(),
          title: notifTitle,
          desc: `Chuyên gia ${displayName} đã bị/được ${actionText}.`,
          time: 'Vừa xong',
          icon: notifIcon
        };
        setNotifications(prev => [newNotif, ...prev]);
      })(),
      {
        loading: `Đang thực hiện ${actionText} chuyên gia...`,
        success: `Đã thực hiện ${actionText} chuyên gia ${displayName}!`,
        error: `Có lỗi xảy ra khi cập nhật chuyên gia.`,
      }
    );
  };

  // Handle delete expert
  const handleDeleteExpert = async (id: string) => {
    const allMocks = getMockExpertsFromLocalStorage();
    const expert = allMocks.find((e: any) => e.id === id);
    const displayName = expert ? expert.name : id;

    if (!confirm(`Bạn có chắc chắn muốn xóa chuyên gia ${displayName}?`)) return;

    toast.promise(
      (async () => {
        if (token) {
          try {
            await adminApi.deleteExpert(id, token);
          } catch (e) {
            console.warn("API deleteExpert failed, fallback to local updating.", e);
          }
        }

        // Update local mock list
        const updated = allMocks.filter((e: any) => e.id !== id);
        localStorage.setItem('mock-admin-experts', JSON.stringify(updated));

        await fetchData();

        const newNotif = {
          id: Date.now(),
          title: 'Đã xóa chuyên gia',
          desc: `Chuyên gia ${displayName} đã bị xóa khỏi hệ thống.`,
          time: 'Vừa xong',
          icon: <X className="w-4 h-4 text-red-400" />
        };
        setNotifications(prev => [newNotif, ...prev]);
      })(),
      {
        loading: `Đang xóa chuyên gia...`,
        success: `Đã xóa chuyên gia ${displayName}!`,
        error: `Có lỗi xảy ra khi xóa chuyên gia.`,
      }
    );
  };

  // Handle status update for Service
  const handleUpdateServiceStatus = async (id: string, newStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED') => {
    const allMocks = getMockServicesFromLocalStorage();
    const service = allMocks.find((s: any) => s.id === id);
    const displayName = service ? service.name : id;
    
    let actionText = '';
    let notifTitle = '';
    let notifIcon = <AlertCircle className="w-4 h-4 text-yellow-400" />;

    if (newStatus === 'APPROVED') {
      actionText = 'phê duyệt';
      notifTitle = 'Duyệt dịch vụ thành công';
      notifIcon = <CheckCircle className="w-4 h-4 text-green-400" />;
    } else if (newStatus === 'PENDING') {
      actionText = 'chuyển về chờ duyệt';
      notifTitle = 'Chuyển về chờ duyệt';
      notifIcon = <AlertCircle className="w-4 h-4 text-yellow-400" />;
    } else if (newStatus === 'REJECTED') {
      actionText = 'từ chối';
      notifTitle = 'Từ chối dịch vụ';
      notifIcon = <X className="w-4 h-4 text-orange-400" />;
    } else if (newStatus === 'BANNED') {
      actionText = 'tạm ngưng hoạt động';
      notifTitle = 'Đình chỉ dịch vụ';
      notifIcon = <Ban className="w-4 h-4 text-red-500" />;
    }

    toast.promise(
      (async () => {
        if (token) {
          try {
            await adminApi.updateServiceStatus(id, newStatus, token);
          } catch (e) {
            console.warn("API updateServiceStatus failed, fallback to local updating.", e);
          }
        }

        // Update local mock list
        const updated = allMocks.map((s: any) => {
          if (s.id === id) {
            const updatedSer = { ...s, status: newStatus };
            if (selectedServiceForDetails && selectedServiceForDetails.id === id) {
              setSelectedServiceForDetails(updatedSer);
            }
            return updatedSer;
          }
          return s;
        });
        localStorage.setItem('mock-admin-services', JSON.stringify(updated));

        await fetchData();

        const newNotif = {
          id: Date.now(),
          title: notifTitle,
          desc: `Dịch vụ "${displayName}" đã được ${actionText}.`,
          time: 'Vừa xong',
          icon: notifIcon
        };
        setNotifications(prev => [newNotif, ...prev]);
      })(),
      {
        loading: `Đang thực hiện ${actionText} dịch vụ...`,
        success: `Đã ${actionText} dịch vụ "${displayName}"!`,
        error: `Có lỗi xảy ra khi cập nhật dịch vụ.`,
      }
    );
  };

  // Handle delete service
  const handleDeleteService = async (id: string) => {
    const allMocks = getMockServicesFromLocalStorage();
    const service = allMocks.find((s: any) => s.id === id);
    const displayName = service ? service.name : id;

    if (!confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${displayName}"?`)) return;

    toast.promise(
      (async () => {
        if (token) {
          try {
            await adminApi.deleteService(id, token);
          } catch (e) {
            console.warn("API deleteService failed, fallback to local updating.", e);
          }
        }

        const updated = allMocks.filter((s: any) => s.id !== id);
        localStorage.setItem('mock-admin-services', JSON.stringify(updated));

        await fetchData();

        const newNotif = {
          id: Date.now(),
          title: 'Đã xóa dịch vụ',
          desc: `Dịch vụ "${displayName}" đã bị xóa khỏi hệ thống.`,
          time: 'Vừa xong',
          icon: <X className="w-4 h-4 text-red-400" />
        };
        setNotifications(prev => [newNotif, ...prev]);
      })(),
      {
        loading: `Đang xóa dịch vụ...`,
        success: `Đã xóa dịch vụ "${displayName}"!`,
        error: `Có lỗi xảy ra khi xóa dịch vụ.`,
      }
    );
  };

  // Search filter implementation
  const filteredExperts = experts.filter(e =>
    e.name.toLowerCase().includes(pendingSearch.toLowerCase()) ||
    e.email.toLowerCase().includes(pendingSearch.toLowerCase()) ||
    e.title.toLowerCase().includes(pendingSearch.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(pendingSearch.toLowerCase()) ||
    (s.expertName && s.expertName.toLowerCase().includes(pendingSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-['Be_Vietnam_Pro'] overflow-x-hidden selection:bg-red-500/30 selection:text-red-200">
      
      {/* Horizontal Admin Header */}
      <AdminHeader
        onScrollToSection={(id) => {
          if (id === 'approval-table') {
            document.getElementById('approval-table')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
        onShowNotifications={() => setShowNotifications(true)}
      />

      {/* DRAWER NOTIFICATIONS */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />
            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 sm:w-96 bg-gray-950/95 backdrop-blur-2xl z-[100] border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-500" /> Thông báo Admin
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1.5 hover:bg-white/15 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <NotificationItem key={n.id} title={n.title} desc={n.desc} time={n.time} icon={n.icon} />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-sm italic">
                    Không có thông báo mới nào.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-transparent relative">
        {/* PREMIUM GLASS TAB SWITCHER */}
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl w-full sm:w-fit gap-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'stats' ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <BarChart3 className="w-4 h-4" /> Thống kê & Báo cáo
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'approval' ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Duyệt yêu cầu
          </button>
        </div>

        {activeTab === 'stats' ? (
          <div className="space-y-10">
            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* VIP Users Count */}
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 relative overflow-hidden shadow-xl group hover:border-red-500/30 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Khách VIP</p>
                    <h4 className="text-2xl font-black text-white mt-1.5">{vipTierData ? vipTierData.totalVip.toLocaleString() : '—'}</h4>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs">
                  <span className="text-amber-400 font-bold flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5" /> {vipTierData && vipTierData.total > 0 ? Math.round((vipTierData.totalVip / vipTierData.total) * 100) : 0}%
                  </span>
                  <span className="text-gray-500 font-medium">trên tổng người dùng</span>
                </div>
              </div>

              {/* Total Users */}
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 relative overflow-hidden shadow-xl group hover:border-red-500/30 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng Người Dùng</p>
                    <h4 className="text-2xl font-black text-white mt-1.5">{userStatsData ? userStatsData.total.toLocaleString() : '—'}</h4>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs">
                  <span className="text-green-400 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Live
                  </span>
                  <span className="text-gray-500 font-medium">dữ liệu thời gian thực</span>
                </div>
              </div>

              {/* Experts */}
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 relative overflow-hidden shadow-xl group hover:border-red-500/30 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chuyên Gia</p>
                    <h4 className="text-2xl font-black text-white mt-1.5">{userStatsData ? userStatsData.byRole.expert.toLocaleString() : '—'}</h4>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs">
                  <span className="text-green-400 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Live
                  </span>
                  <span className="text-gray-500 font-medium">từ cơ sở dữ liệu</span>
                </div>
              </div>

              {/* Guests */}
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 relative overflow-hidden shadow-xl group hover:border-red-500/30 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Khách (Guest)</p>
                    <h4 className="text-2xl font-black text-white mt-1.5">{userStatsData ? userStatsData.byRole.guest.toLocaleString() : '—'}</h4>
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs">
                  <span className="text-green-400 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Live
                  </span>
                  <span className="text-gray-500 font-medium">từ cơ sở dữ liệu</span>
                </div>
              </div>
            </div>

            {/* CHART GRID 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VipRevenueChart />
              <ServiceRevenueChart />
            </div>

            {/* CHART GRID 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <UserDistributionPanel data={userStatsData} />
              </div>
              <div className="lg:col-span-2">
                <TopPerformingServices />
              </div>
            </div>

            {/* VIP TIER STATISTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VipTierStatsPanel data={vipTierData} />
              <TrafficChart />
            </div>
          </div>
        ) : (
          <>
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={<Users className="text-purple-400 w-6 h-6" />} label="Chuyên gia chờ duyệt" value={stats.pendingExpertsCount.toString()} />
              <StatCard icon={<Briefcase className="text-yellow-400 w-6 h-6" />} label="Dịch vụ chờ duyệt" value={stats.pendingServicesCount.toString()} />
              <StatCard icon={<BarChart3 className="text-green-400 w-6 h-6" />} label="Tổng yêu cầu tồn đọng" value={(stats.pendingExpertsCount + stats.pendingServicesCount).toString()} />
            </div>

            {/* FULL WIDTH: DATA TABLE APPROVAL QUEUE */}
            <section id="approval-table" className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />

              {/* Heading and controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-red-500" /> Quản lý tài nguyên
                  </h2>
                  <p className="text-gray-400 text-xs">Phê duyệt, thu hồi hoặc xóa các Chuyên gia và Dịch vụ trên hệ thống</p>
                </div>

                {/* Switch tabs & Status Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Type Switcher */}
                  <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10">
                    <button
                      onClick={() => { setActiveApprovalTab('experts'); setPendingSearch(''); }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${activeApprovalTab === 'experts' ? 'bg-white/10 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Chuyên gia
                    </button>
                    <button
                      onClick={() => { setActiveApprovalTab('services'); setPendingSearch(''); }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${activeApprovalTab === 'services' ? 'bg-white/10 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Briefcase className="w-3.5 h-3.5" /> Dịch vụ
                    </button>
                  </div>

                  {/* Status Switcher */}
                  <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 gap-1 flex-wrap">
                    {(['PENDING', 'APPROVED', 'REJECTED', 'BANNED', 'ALL'] as const).map((status) => {
                      const isActive = statusFilter === status;
                      const label = 
                        status === 'PENDING' ? 'Chờ duyệt' : 
                        status === 'APPROVED' ? 'Đã duyệt' : 
                        status === 'REJECTED' ? 'Từ chối' :
                        status === 'BANNED' ? 'Bị cấm' : 'Tất cả';
                      return (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-600/20'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 hover:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-red-500 focus:bg-white/10 transition-all font-medium"
                    placeholder={activeApprovalTab === 'experts' ? "Tìm kiếm chuyên gia theo tên, email, chuyên môn..." : "Tìm kiếm dịch vụ theo tên, tên chuyên gia..."}
                  />
                </div>
                {pendingSearch && (
                  <Button
                    onClick={() => setPendingSearch('')}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white border border-white/5 rounded-xl px-3"
                  >
                    Xóa tìm kiếm
                  </Button>
                )}
              </div>

              {/* TABLE CONTAINER */}
              <div className="overflow-x-auto w-full border border-white/5 rounded-[1.5rem] bg-black/30">
                {activeApprovalTab === 'experts' ? (
                  /* EXPERTS TABLE */
                  filteredExperts.length > 0 ? (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] text-gray-400 uppercase font-black tracking-wider">
                          <th className="py-4.5 px-6">Chuyên gia</th>
                          <th className="py-4.5 px-6">Kinh nghiệm</th>
                          <th className="py-4.5 px-6">Lĩnh vực</th>
                          <th className="py-4.5 px-6">Liên hệ</th>
                          <th className="py-4.5 px-6">Trạng thái</th>
                          <th className="py-4.5 px-6 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                        {filteredExperts.map((exp) => (
                          <tr key={exp.id} className="hover:bg-white/5 transition-colors group">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={exp.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80"}
                                  alt={exp.name}
                                  className="w-8 h-8 rounded-full object-cover border border-white/10"
                                />
                                <div>
                                  <p className="font-bold text-white group-hover:text-red-400 transition-colors">{exp.name}</p>
                                  <p className="text-[9px] text-gray-500 mt-0.5">{exp.title}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 font-medium text-white">{exp.experience}</td>
                            <td className="py-4 px-6">
                              <div className="flex flex-wrap gap-1">
                                {exp.specs?.map((spec: string) => (
                                  <span key={spec} className="text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded">
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="space-y-0.5 text-gray-400">
                                <p className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gray-500" /> {exp.email}</p>
                                <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-500" /> {exp.phone}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {exp.status === 'PENDING' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full">
                                  <AlertCircle className="w-3 h-3" /> Chờ duyệt
                                </span>
                              )}
                              {exp.status === 'APPROVED' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                                  <CheckCircle className="w-3 h-3" /> Hoạt động
                                </span>
                              )}
                              {exp.status === 'REJECTED' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                                  <X className="w-3 h-3" /> Bị từ chối
                                </span>
                              )}
                              {exp.status === 'BANNED' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
                                  <Ban className="w-3 h-3" /> Bị khóa
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2 flex-wrap">
                                <button
                                  onClick={() => setSelectedExpertForDetails(exp)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-white/5 border border-white/10 text-gray-300 hover:bg-white/15 hover:text-white transition-all flex items-center gap-1 shadow-sm"
                                >
                                  <Eye className="w-3.5 h-3.5" /> Chi tiết
                                </button>
                                {exp.status === 'PENDING' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateExpertStatus(exp.id, 'APPROVED')}
                                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" /> Duyệt
                                    </button>
                                    <button
                                      onClick={() => handleUpdateExpertStatus(exp.id, 'REJECTED')}
                                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                    >
                                      <X className="w-3.5 h-3.5" /> Từ chối
                                    </button>
                                  </>
                                )}
                                {exp.status === 'APPROVED' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateExpertStatus(exp.id, 'PENDING')}
                                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                    >
                                      <AlertCircle className="w-3.5 h-3.5" /> Thu hồi
                                    </button>
                                    <button
                                      onClick={() => handleUpdateExpertStatus(exp.id, 'BANNED')}
                                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-red-950/40 border border-red-500/20 text-red-400 hover:bg-red-650 hover:text-white transition-all flex items-center gap-1 shadow-sm"
                                    >
                                      <Ban className="w-3.5 h-3.5" /> Khóa
                                    </button>
                                  </>
                                )}
                                {exp.status === 'BANNED' && (
                                  <button
                                    onClick={() => handleUpdateExpertStatus(exp.id, 'APPROVED')}
                                    className="px-3 py-1.5 rounded-xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> Mở khóa
                                  </button>
                                )}
                                {exp.status === 'REJECTED' && (
                                  <button
                                    onClick={() => handleUpdateExpertStatus(exp.id, 'PENDING')}
                                    className="px-3 py-1.5 rounded-xl text-xs font-black bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5" /> Xem xét lại
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteExpert(exp.id)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1 shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" /> Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-16">
                      <UserCheck className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium text-sm">Không tìm thấy chuyên gia nào phù hợp.</p>
                    </div>
                  )
                ) : (
                  /* SERVICES TABLE */
                  filteredServices.length > 0 ? (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-gray-400 uppercase text-[10px] tracking-widest font-black">
                          <th className="px-6 py-4">Tên dịch vụ</th>
                          <th className="px-6 py-4">Chuyên gia phụ trách</th>
                          <th className="px-6 py-4">Thời lượng</th>
                          <th className="px-6 py-4">Giá dịch vụ</th>
                          <th className="px-6 py-4">Trạng thái</th>
                          <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {filteredServices.map((ser) => (
                          <tr key={ser.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4 font-bold text-white group-hover:text-red-400 transition-colors">
                              {ser.name}
                            </td>
                            <td className="px-6 py-4 text-gray-300 font-semibold flex items-center gap-2">
                              <img
                                src={ser.expertAvatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"}
                                alt={ser.expertName}
                                className="w-6 h-6 rounded-full object-cover border border-white/10"
                              />
                              {ser.expertName}
                            </td>
                            <td className="px-6 py-4 text-gray-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-500" /> {ser.duration}
                            </td>
                            <td className="px-6 py-4 text-red-400 font-bold">
                              {ser.price}
                            </td>
                            <td className="px-6 py-4">
                              {ser.status === 'PENDING' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
                                  Chờ duyệt
                                </span>
                              ) : ser.status === 'APPROVED' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                  Đã duyệt
                                </span>
                              ) : ser.status === 'BANNED' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                                  Tạm ngưng
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-gray-500/10 text-gray-400 border border-gray-500/20 uppercase tracking-wider">
                                  Từ chối
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 flex-wrap">
                                <button
                                  onClick={() => setSelectedServiceForDetails(ser)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-white/5 border border-white/10 text-gray-300 hover:bg-white/15 hover:text-white transition-all flex items-center gap-1 shadow-sm"
                                >
                                  <Eye className="w-3.5 h-3.5" /> Chi tiết
                                </button>
                                {ser.status === 'PENDING' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateServiceStatus(ser.id, 'APPROVED')}
                                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" /> Duyệt
                                    </button>
                                    <button
                                      onClick={() => handleUpdateServiceStatus(ser.id, 'REJECTED')}
                                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                    >
                                      <X className="w-3.5 h-3.5" /> Từ chối
                                    </button>
                                  </>
                                )}
                                {ser.status === 'APPROVED' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateServiceStatus(ser.id, 'PENDING')}
                                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                    >
                                      <AlertCircle className="w-3.5 h-3.5" /> Thu hồi
                                    </button>
                                    <button
                                      onClick={() => handleUpdateServiceStatus(ser.id, 'BANNED')}
                                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-red-950/40 border border-red-500/20 text-red-400 hover:bg-red-650 hover:text-white transition-all flex items-center gap-1 shadow-sm"
                                    >
                                      <Ban className="w-3.5 h-3.5" /> Khóa
                                    </button>
                                  </>
                                )}
                                {ser.status === 'BANNED' && (
                                  <button
                                    onClick={() => handleUpdateServiceStatus(ser.id, 'APPROVED')}
                                    className="px-3 py-1.5 rounded-xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> Mở cấm
                                  </button>
                                )}
                                {ser.status === 'REJECTED' && (
                                  <button
                                    onClick={() => handleUpdateServiceStatus(ser.id, 'PENDING')}
                                    className="px-3 py-1.5 rounded-xl text-xs font-black bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5" /> Xem xét lại
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteService(ser.id)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1 shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" /> Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-16">
                      <Briefcase className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium text-sm">Không tìm thấy dịch vụ nào phù hợp.</p>
                    </div>
                  )
                )}
              </div>
            </section>
          </>
        )}
      </main>
      {/* EXPERT DETAILS MODAL */}
      <AnimatePresence>
        {selectedExpertForDetails && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExpertForDetails(null)}
              className="fixed inset-0 bg-black/80 z-[110] backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-0 m-auto z-[120] max-w-4xl h-fit max-h-[85vh] overflow-y-auto w-11/12 bg-gray-950/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 sm:p-10 flex flex-col font-['Be_Vietnam_Pro'] text-white selection:bg-red-500/30"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2.5 text-white">
                    <ShieldCheck className="w-6 h-6 text-red-500" /> Hồ sơ chi tiết Chuyên gia
                  </h3>
                  <p className="text-xs text-gray-400">Kiểm tra thông tin hồ sơ cá nhân và tài liệu pháp lý trước khi phê duyệt</p>
                </div>
                <button
                  onClick={() => setSelectedExpertForDetails(null)}
                  className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 overflow-y-visible">
                {/* Left Column: Avatar & Basic stats */}
                <div className="md:col-span-4 flex flex-col items-center text-center space-y-4 border-r border-white/5 pr-0 md:pr-6">
                  <div className="relative">
                    <img
                      src={selectedExpertForDetails.avatar}
                      alt={selectedExpertForDetails.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-red-500/30 shadow-2xl"
                    />
                    <span className="absolute bottom-1 right-1 bg-gray-900 border border-white/20 p-1.5 rounded-full text-xs">🔮</span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white">{selectedExpertForDetails.name}</h4>
                    <p className="text-xs text-red-400 font-bold mt-1">{selectedExpertForDetails.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{selectedExpertForDetails.experience}</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1">
                    {selectedExpertForDetails.specs.map((s: string) => (
                      <span key={s} className="text-[9px] font-black uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="w-full pt-4 border-t border-white/5 text-left space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className="truncate">{selectedExpertForDetails.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>{selectedExpertForDetails.phone || '0912.345.678'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">Trạng thái:</span>
                      {selectedExpertForDetails.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider">
                          Chờ duyệt
                        </span>
                      ) : selectedExpertForDetails.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                          Đã duyệt
                        </span>
                      ) : selectedExpertForDetails.status === 'BANNED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                          Bị cấm
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-gray-500/10 text-gray-400 border border-gray-500/20 uppercase tracking-wider">
                          Từ từ chối
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Bio & CCCD documents */}
                <div className="md:col-span-8 space-y-6">
                  {/* Bio & Intro */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-red-500" /> Giới thiệu chuyên môn & Kinh nghiệm
                    </h5>
                    <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                      {selectedExpertForDetails.experienceDetail || "Chuyên gia chưa cung cấp thông tin chi tiết về kinh nghiệm."}
                    </p>
                  </div>

                  {/* Legal Documents */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-red-500" /> Tài liệu xác minh (CCCD / Passport)
                    </h5>

                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Số định danh / CCCD:</span>
                        <span className="font-bold text-white tracking-widest">{selectedExpertForDetails.cccdNumber || '031092008472'}</span>
                      </div>

                      {/* Mock CCCD Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Front Card */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-cyan-500/30 p-3 rounded-xl relative overflow-hidden h-32 flex flex-col justify-between shadow-lg">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/5 rounded-full blur-xl pointer-events-none" />
                          <div className="text-[6px] font-bold text-cyan-200 text-center leading-none">
                            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
                            <span className="text-[5px] text-cyan-300 font-normal">Độc lập - Tự do - Hạnh phúc</span>
                          </div>
                          <div className="text-[8px] font-black text-cyan-300 text-center uppercase -mt-2">
                            CĂN CƯỚC CÔNG DÂN
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="w-8 h-10 bg-gray-800 border border-white/10 rounded flex-shrink-0 flex items-center justify-center text-[8px]">👤</div>
                            <div className="text-[7px] leading-tight text-white space-y-0.5">
                              <p className="font-black text-cyan-300">Số / No: <span className="text-white font-mono">{selectedExpertForDetails.cccdNumber || '031092008472'}</span></p>
                              <p>Họ tên: <span className="font-bold uppercase text-[8px]">{selectedExpertForDetails.name}</span></p>
                              <p>Ngày sinh: 15/08/1992</p>
                              <p>Quốc tịch: Việt Nam</p>
                            </div>
                          </div>
                          <div className="text-[5px] text-cyan-400 text-right font-medium">CCCD MẶT TRƯỚC (SIMULATED)</div>
                        </div>

                        {/* Back Card */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-cyan-500/30 p-3 rounded-xl relative overflow-hidden h-32 flex flex-col justify-between shadow-lg">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/5 rounded-full blur-xl pointer-events-none" />
                          <div className="text-[6px] font-bold text-cyan-200 leading-none">
                            ĐẶC ĐIỂM NHÂN DẠNG / PERSONAL IDENTIFICATION
                          </div>
                          <div className="text-[7px] text-white leading-normal space-y-1">
                            <p>Nốt ruồi cách 1cm trên sau cánh mũi trái.</p>
                            <p>Ngày cấp: 20/12/2021</p>
                            <p>Cơ quan cấp: Cục trưởng Cục Cảnh sát Quản lý hành chính về trật tự xã hội.</p>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="w-12 h-6 bg-gray-800/80 border border-white/10 rounded text-[5px] flex items-center justify-center">VAN TAY</div>
                            <span className="text-[5px] text-cyan-400 font-medium">CCCD MẶT SAU (SIMULATED)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certifications list */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-red-500" /> Bằng cấp / Chứng chỉ nghiệp vụ
                    </h5>
                    <ul className="space-y-2 text-xs">
                      {(selectedExpertForDetails.certifications && selectedExpertForDetails.certifications.length > 0) ? (
                        selectedExpertForDetails.certifications.map((cert: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
                            <Award className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="text-gray-300 font-medium">{cert}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">Chưa đăng ký chứng chỉ nào.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
                {selectedExpertForDetails.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleUpdateExpertStatus(selectedExpertForDetails.id, 'APPROVED')}
                      className="px-5 py-2.5 rounded-2xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-green-500/10"
                    >
                      <CheckCircle className="w-4 h-4" /> Phê duyệt hồ sơ
                    </button>
                    <button
                      onClick={() => handleUpdateExpertStatus(selectedExpertForDetails.id, 'REJECTED')}
                      className="px-5 py-2.5 rounded-2xl text-xs font-black bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-orange-500/10"
                    >
                      <X className="w-4 h-4" /> Từ chối hồ sơ
                    </button>
                  </>
                )}
                {selectedExpertForDetails.status === 'APPROVED' && (
                  <>
                    <button
                      onClick={() => handleUpdateExpertStatus(selectedExpertForDetails.id, 'PENDING')}
                      className="px-5 py-2.5 rounded-2xl text-xs font-black bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-yellow-500/10"
                    >
                      <AlertCircle className="w-4 h-4" /> Thu hồi quyền
                    </button>
                    <button
                      onClick={() => handleUpdateExpertStatus(selectedExpertForDetails.id, 'BANNED')}
                      className="px-5 py-2.5 rounded-2xl text-xs font-black bg-red-950/40 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5 shadow-lg shadow-red-500/10"
                    >
                      <Ban className="w-4 h-4" /> Khóa / Cấm tài khoản
                    </button>
                  </>
                )}
                {selectedExpertForDetails.status === 'BANNED' && (
                  <button
                    onClick={() => handleUpdateExpertStatus(selectedExpertForDetails.id, 'APPROVED')}
                    className="px-5 py-2.5 rounded-2xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-green-500/10"
                  >
                    <CheckCircle className="w-4 h-4" /> Gỡ cấm (Kích hoạt lại)
                  </button>
                )}
                {selectedExpertForDetails.status === 'REJECTED' && (
                  <button
                    onClick={() => handleUpdateExpertStatus(selectedExpertForDetails.id, 'PENDING')}
                    className="px-5 py-2.5 rounded-2xl text-xs font-black bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-yellow-500/10"
                  >
                    <AlertCircle className="w-4 h-4" /> Đưa về hàng chờ duyệt
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDeleteExpert(selectedExpertForDetails.id);
                    setSelectedExpertForDetails(null);
                  }}
                  className="px-5 py-2.5 rounded-2xl text-xs font-black bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <X className="w-4 h-4" /> Xóa tài khoản
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SERVICE DETAILS MODAL */}
      <AnimatePresence>
        {selectedServiceForDetails && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedServiceForDetails(null)}
              className="fixed inset-0 bg-black/80 z-[110] backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-0 m-auto z-[120] max-w-2xl h-fit max-h-[85vh] overflow-y-auto w-11/12 bg-gray-950/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 sm:p-10 flex flex-col font-['Be_Vietnam_Pro'] text-white selection:bg-red-500/30"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2.5 text-white">
                    <Briefcase className="w-6 h-6 text-red-500" /> Chi tiết gói Dịch vụ
                  </h3>
                  <p className="text-xs text-gray-400">Xem xét thông tin gói dịch vụ trước khi cập nhật trạng thái</p>
                </div>
                <button
                  onClick={() => setSelectedServiceForDetails(null)}
                  className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-6 flex-1 pr-1">
                {/* Service Name & Status */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-full">
                      {selectedServiceForDetails.category || "Dịch vụ"}
                    </span>
                    {selectedServiceForDetails.status === 'PENDING' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
                        Chờ duyệt
                      </span>
                    ) : selectedServiceForDetails.status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        Đã duyệt
                      </span>
                    ) : selectedServiceForDetails.status === 'BANNED' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        Tạm ngưng
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-gray-500/10 text-gray-400 border border-gray-500/20 uppercase tracking-wider">
                        Từ chối
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    {selectedServiceForDetails.name}
                  </h4>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Giá dịch vụ</p>
                    <p className="text-lg font-black text-red-400">{selectedServiceForDetails.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Thời lượng & Hình thức</p>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-gray-400" /> {selectedServiceForDetails.duration} ({selectedServiceForDetails.format || "Online"})
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h5 className="text-xs uppercase font-black tracking-widest text-gray-400">Mô tả dịch vụ</h5>
                  <p className="text-sm text-gray-300 leading-relaxed font-light bg-white/5 border border-white/5 p-5 rounded-3xl">
                    {selectedServiceForDetails.description || "Chưa có mô tả chi tiết cho dịch vụ này."}
                  </p>
                </div>

                {/* Expert In Charge */}
                <div className="space-y-3">
                  <h5 className="text-xs uppercase font-black tracking-widest text-gray-400">Chuyên gia phụ trách</h5>
                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-3xl">
                    <img
                      src={selectedServiceForDetails.expertAvatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"}
                      alt={selectedServiceForDetails.expertName}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <p className="font-bold text-white">{selectedServiceForDetails.expertName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{selectedServiceForDetails.expertEmail || "expert@sorcerer.com"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-6 mt-8">
                {selectedServiceForDetails.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleUpdateServiceStatus(selectedServiceForDetails.id, 'APPROVED')}
                      className="px-5 py-2.5 rounded-2xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-green-500/10"
                    >
                      <CheckCircle className="w-4 h-4" /> Phê duyệt dịch vụ
                    </button>
                    <button
                      onClick={() => handleUpdateServiceStatus(selectedServiceForDetails.id, 'REJECTED')}
                      className="px-5 py-2.5 rounded-2xl text-xs font-black bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-orange-500/10"
                    >
                      <X className="w-4 h-4" /> Từ chối dịch vụ
                    </button>
                  </>
                )}
                {selectedServiceForDetails.status === 'APPROVED' && (
                  <>
                    <button
                      onClick={() => handleUpdateServiceStatus(selectedServiceForDetails.id, 'PENDING')}
                      className="px-5 py-2.5 rounded-2xl text-xs font-black bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-yellow-500/10"
                    >
                      <AlertCircle className="w-4 h-4" /> Thu hồi (Chuyển về chờ duyệt)
                    </button>
                    <button
                      onClick={() => handleUpdateServiceStatus(selectedServiceForDetails.id, 'BANNED')}
                      className="px-5 py-2.5 rounded-2xl text-xs font-black bg-red-950/40 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5 shadow-lg"
                    >
                      <Ban className="w-4 h-4" /> Đình chỉ dịch vụ
                    </button>
                  </>
                )}
                {selectedServiceForDetails.status === 'BANNED' && (
                  <button
                    onClick={() => handleUpdateServiceStatus(selectedServiceForDetails.id, 'APPROVED')}
                    className="px-5 py-2.5 rounded-2xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-green-500/10"
                  >
                    <CheckCircle className="w-4 h-4" /> Gỡ đình chỉ (Kích hoạt lại)
                  </button>
                )}
                {selectedServiceForDetails.status === 'REJECTED' && (
                  <button
                    onClick={() => handleUpdateServiceStatus(selectedServiceForDetails.id, 'PENDING')}
                    className="px-5 py-2.5 rounded-2xl text-xs font-black bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1.5 shadow-lg shadow-yellow-500/10"
                  >
                    <AlertCircle className="w-4 h-4" /> Đưa về hàng chờ duyệt
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDeleteService(selectedServiceForDetails.id);
                    setSelectedServiceForDetails(null);
                  }}
                  className="px-5 py-2.5 rounded-2xl text-xs font-black bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <X className="w-4 h-4" /> Xóa dịch vụ
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// SUB-COMPONENTS
function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-gray-900/40 border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-5 backdrop-blur-md transition-all">
      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">{icon}</div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function NotificationItem({ title, desc, time, icon }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
      <div className="flex gap-3">
        <div className="mt-1 shrink-0">{icon}</div>
        <div>
          <p className="text-sm font-bold text-white leading-snug">{title}</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
          <p className="text-[10px] text-gray-500 mt-2 font-medium">{time}</p>
        </div>
      </div>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
