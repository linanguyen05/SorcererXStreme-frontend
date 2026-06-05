'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  User, Briefcase, Plus, DollarSign, Star, Calendar,
  MessageSquare, Clock, CheckCircle, AlertCircle, Trash2, Edit3,
  Bell, Search, Filter, X, ChevronRight, Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ExpertHeader } from '@/components/layout/ExpertHeader';
import { useAuthStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';



export default function ExpertDashboard() {
  const { token } = useAuthStore();

  // --- STATES ---
  const [isVerified, setIsVerified] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dữ liệu profile
  const [profileData, setProfileData] = useState({
    name: "Master Lina",
    title: "Chuyên gia Tarot & Chiêm tinh học",
    bio: "Định hướng sự nghiệp, tình duyên thông qua các trải bài Tarot chuyên sâu và bản đồ sao cá nhân.",
    experience: "5 năm nghiên cứu Tarot...",
    yoe: 5,
    avatar: null as string | null,
    specs: ['Tarot']
  });

  // Notifications simulation state
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Lịch hẹn mới", desc: "Khách hàng Nguyễn Văn A đã đặt lịch Tarot lúc 14:00 ngày mai.", time: "10 phút trước", icon: <Calendar className="w-4 h-4 text-purple-400" /> },
    { id: 2, title: "Yêu cầu dịch vụ", desc: "Dịch vụ 'Giải mã bản đồ sao' của bạn đang đợi hệ thống phê duyệt.", time: "1 giờ trước", icon: <Clock className="w-4 h-4 text-yellow-400" /> },
  ]);

  const [services] = useState([
    { id: 1, name: 'Trải bài Tarot định hướng sự nghiệp', price: '200.000đ', duration: '30 phút', status: 'active' },
    { id: 2, name: 'Phân tích bản đồ sao cá nhân', price: '500.000đ', duration: '60 phút', status: 'pending' },
  ]);

  const appointmentRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('expert-profile-data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.profile) {
            setProfileData({
              name: parsed.profile.name || "Master Lina",
              title: parsed.profile.title || "Chuyên gia Tarot & Chiêm tinh học",
              bio: parsed.profile.bio || "",
              experience: parsed.profile.experience || "",
              yoe: parsed.profile.yoe !== undefined ? parsed.profile.yoe : 5,
              avatar: parsed.avatar || null,
              specs: parsed.profile.specs || ['Tarot']
            });
          }
          if (parsed.isVerified) {
            setIsVerified(true);
          }
        } catch (e) {
          console.error("Error loading localStorage data in dashboard", e);
        }
      }
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-['Be_Vietnam_Pro'] overflow-x-hidden selection:bg-red-500/30 selection:text-red-200">

      {/* Horizontal Header (Sticky Top Nav replacing Vertical Sidebar) */}
      <ExpertHeader
        onScrollToSection={(id) => {
          if (id === 'appointments') {
            appointmentRef.current?.scrollIntoView({ behavior: 'smooth' });
          } else if (id === 'feedbacks') {
            feedbackRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                  <Bell className="w-5 h-5 text-red-500" /> Thông báo hệ thống
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
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* WELCOME BANNER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Workspace</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-[0.25em] font-medium">Hệ thống quản lý chuyên gia &amp; Dịch vụ cá nhân</p>
          </div>
          <button
            onClick={() => setShowNotifications(false)}
            className="hidden md:flex p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group relative items-center justify-center"
          >
            <Bell className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900"></span>
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<DollarSign className="text-green-400 w-6 h-6" />} label="Doanh thu" value="1.250.000đ" />
          <StatCard icon={<Calendar className="text-purple-400 w-6 h-6" />} label="Lịch hẹn mới" value="02" onClick={() => appointmentRef.current?.scrollIntoView({ behavior: 'smooth' })} isClickable />
          <StatCard icon={<Star className="text-yellow-400 w-6 h-6" />} label="Đánh giá TB" value="4.9" />
          <StatCard icon={<MessageSquare className="text-blue-400 w-6 h-6" />} label="Phản hồi" value="12" onClick={() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth' })} isClickable />
        </div>

<<<<<<< HEAD
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<DollarSign className="text-green-400" />} label="Doanh thu" value="1.250.000đ" />
            <Link href="/dashboard_expert/schedule">
              <StatCard icon={<Calendar className="text-purple-400" />} label="Lịch hẹn mới" value="03" isClickable />
            </Link>
            <StatCard icon={<Star className="text-yellow-400" />} label="Đánh giá TB" value="4.9" />
            <StatCard icon={<MessageSquare className="text-blue-400" />} label="Phản hồi" value="12" onClick={() => scrollTo(feedbackRef)} isClickable />
          </div>
=======
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: PROFILE SUMMARY */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              {/* Profile Cover Banner Header */}
              <div className="h-28 bg-gradient-to-r from-purple-900/40 to-red-900/40 w-full relative" />
>>>>>>> dev

              {/* Main Profile Info */}
              <div className="p-8 pt-0 relative">
                {/* Overlap Avatar */}
                <div className="absolute top-[-40px] left-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-900 shadow-2xl bg-gray-800 flex items-center justify-center">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Expert Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="flex justify-end pt-4">
                  <Link href="/dashboard_expert/verify" className={`text-[10px] px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all border ${isVerified ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white"}`}>
                    {isVerified ? 'Verified' : 'Verify Now'}
                  </Link>
                </div>

                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {profileData.name}
                    </h3>
                    <p className="text-xs text-red-400 font-semibold mt-1">{profileData.title}</p>
                  </div>

                  {/* Bio */}
                  {profileData.bio && (
                    <p className="text-xs text-gray-300 italic bg-white/5 p-4 rounded-2xl border border-white/5 leading-relaxed">
                      "{profileData.bio}"
                    </p>
                  )}

                  {/* Specialties */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Chuyên môn</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profileData.specs.map(tag => (
                        <span key={tag} className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-lg font-bold">
                          🔮 {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats list */}
                  <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-4 text-center">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <p className="text-xs font-black text-yellow-400">⭐ 4.9</p>
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-wider mt-0.5">Đánh giá</p>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <p className="text-xs font-black text-purple-400">{profileData.yoe !== undefined ? profileData.yoe : 5} năm</p>
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-wider mt-0.5">Kinh nghiệm</p>
                    </div>
                  </div>

                  {/* Edit button */}
                  <Link href="/dashboard_expert/profile" className="block pt-2">
                    <Button variant="primary" className="w-full py-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-red-500/20">
                      <Edit3 className="w-4 h-4" /> Thiết lập trang cá nhân
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: SERVICES */}
          <div className="lg:col-span-8 space-y-8">
            {/* PACKAGE SERVICES */}
            <section className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-red-500" /> Quản lý dịch vụ cá nhân</h2>
                <Link href="/dashboard_expert/package">
                  <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-1">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Thêm gói
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div key={s.id} className="group bg-black/40 border border-white/5 p-5 rounded-2xl hover:border-red-500/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${s.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {s.status === 'active' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
<<<<<<< HEAD
                  ))}
                </div>
              </section>

              {/* APPOINTMENTS */}
              <section ref={appointmentRef} className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Calendar className="w-6 h-6 text-red-500" /> Quản lý lịch hẹn</h2>
                  <div className="flex gap-2">
                    <div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-red-500" placeholder="Tìm tên khách..." /></div>
                    <Button variant="secondary" size="sm" className="px-3"><Filter className="w-4 h-4" /></Button>
                    <Link href="/dashboard_expert/schedule">
                      <Button variant="primary" size="sm" className="px-4 whitespace-nowrap"><Calendar className="w-4 h-4 mr-1" /> Lịch &amp; Giờ rảnh</Button>
                    </Link>
=======
                    <h3 className="font-bold text-white text-lg">{s.name}</h3>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-gray-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration}</span>
                      <span className="font-bold text-red-400">{s.price}</span>
                    </div>
                    {/* Hiển thị trạng thái duyệt */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${s.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                        {s.status === 'active' ? 'Đang hoạt động' : 'Chờ Admin duyệt'}
                      </span>
                    </div>
>>>>>>> dev
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>



        {/* APPOINTMENTS */}
        <section ref={appointmentRef} className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Calendar className="w-6 h-6 text-red-500" /> Quản lý lịch hẹn</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-red-500 transition-colors" placeholder="Tìm tên khách..." />
              </div>
              <Button variant="secondary" size="sm" className="px-3 hover:bg-white/15 transition-colors border border-white/10"><Filter className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/30">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-widest font-black">
                <tr>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Lĩnh vực</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                <AppointmentRow name="Nguyễn Văn A" type="Tarot" time="14:00 - 05/03/2026" />
                <AppointmentRow name="Trần Thị B" type="Tử vi" time="09:30 - 06/03/2026" />
              </tbody>
            </table>
          </div>
        </section>

        {/* FEEDBACK */}
        <section ref={feedbackRef} className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-red-500" /> Phản hồi khách hàng</h2>
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-gray-500 text-sm italic">Chưa có đánh giá nào mới.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

// SUB-COMPONENTS
function StatCard({ icon, label, value, onClick, isClickable }: any) {
  return (
    <div onClick={onClick} className={`bg-gray-900/40 border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-5 backdrop-blur-md transition-all ${isClickable ? "cursor-pointer hover:bg-white/5 hover:scale-[1.02]" : ""}`}>
      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">{icon}</div>
      <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">{label}</p><p className="text-2xl font-black text-white">{value}</p></div>
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

function AppointmentRow({ name, type, time }: any) {
  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4 font-bold text-white">{name}</td>
      <td className="px-6 py-4">
        <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-[10px] font-black border border-red-500/20 uppercase tracking-wider">
          🔮 {type}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-400 font-medium">
        <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-500" /> {time}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-xs text-red-400 hover:text-red-300 font-black hover:underline transition-all">Chi tiết</button>
      </td>
    </tr>
  );
}