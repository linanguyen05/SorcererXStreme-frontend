'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  User, Briefcase, Plus, DollarSign, Star, Calendar, 
  MessageSquare, Clock, CheckCircle, AlertCircle, Trash2, Edit3,
  Bell, Search, Filter, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ExpertDashboard() {
  // --- STATES ---
  const [isVerified, setIsVerified] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // Dữ liệu gốc từ "Server" (giả lập)
  const [profileData, setProfileData] = useState({ 
    name: "Master Lina", 
    experience: "5 năm nghiên cứu Tarot...",
    specs: ['Tarot'] 
  });
  const [tempData, setTempData] = useState({ ...profileData });
  const [isProfileChanged, setIsProfileChanged] = useState(false);

  const [services] = useState([
    { id: 1, name: 'Trải bài Tarot định hướng sự nghiệp', price: '200.000đ', duration: '30 phút', status: 'active' },
    { id: 2, name: 'Phân tích bản đồ sao cá nhân', price: '500.000đ', duration: '60 phút', status: 'pending' },
  ]);

  const appointmentRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const specialties = ['Tarot', 'Astrology', 'Numerology', 'Tử vi'];

  useEffect(() => {
    const isNameChanged = tempData.name !== profileData.name;
    const isExpChanged = tempData.experience !== profileData.experience;
    const isSpecsChanged = JSON.stringify([...tempData.specs].sort()) !== JSON.stringify([...profileData.specs].sort());

    setIsProfileChanged(isNameChanged || isExpChanged || isSpecsChanged);
  }, [tempData, profileData]);

  const toggleSpec = (spec: string) => {
    setTempData(prev => ({
      ...prev,
      specs: prev.specs.includes(spec) 
        ? prev.specs.filter(s => s !== spec) 
        : [...prev.specs, spec]
    }));
  };

  const handleUpdateProfile = () => {
    if (window.confirm("Xác nhận cập nhật thay đổi hồ sơ?")) {
      setProfileData({ ...tempData });
      toast.success("Cập nhật thành công!");
    }
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen pt-20 pb-20 px-4 md:px-8 bg-transparent overflow-x-hidden">
      {/* DRAWER NOTIFICATIONS */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-2xl z-[100] border-l border-white/10 shadow-2xl transition-transform duration-300 transform ${showNotifications ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2"><Bell className="w-5 h-5 text-red-500" /> Thông báo</h2>
            <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <NotificationItem title="Lịch hẹn mới" desc="Khách hàng Nguyễn Văn A vừa đặt lịch." time="5 phút trước" icon={<Calendar className="text-purple-400" />} />
            <NotificationItem title="Hệ thống" desc="Gói dịch vụ 'Tử vi' đã được duyệt." time="2 giờ trước" icon={<CheckCircle className="text-green-400" />} />
            <NotificationItem title="Admin" desc="Vui lòng cập nhật CCCD để xác thực." time="1 ngày trước" icon={<AlertCircle className="text-red-400" />} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10 font-['Be_Vietnam_Pro']">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold font-['Pacifico'] text-white leading-[1.2]">Expert <span className="text-red-500">Workspace</span></h1>
            <p className="text-gray-400 text-sm uppercase tracking-[0.3em]">Hệ thống quản lý chuyên gia tâm linh</p>
          </div>
          <button onClick={() => setShowNotifications(true)} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/30 transition-all group relative">
            <Bell className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900"></span>
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<DollarSign className="text-green-400" />} label="Doanh thu" value="1.250.000đ" />
          <StatCard icon={<Calendar className="text-purple-400" />} label="Lịch hẹn mới" value="03" onClick={() => scrollTo(appointmentRef)} isClickable />
          <StatCard icon={<Star className="text-yellow-400" />} label="Đánh giá TB" value="4.9" />
          <StatCard icon={<MessageSquare className="text-blue-400" />} label="Phản hồi" value="12" onClick={() => scrollTo(feedbackRef)} isClickable />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: PROFILE */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><User className="w-5 h-5 text-red-500" /> Hồ sơ năng lực</h2>
                <Link href="/dashboard_expert/verify" className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase transition-all border ${isVerified ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white"}`}>
                  {isVerified ? 'Verified' : 'Verify Now'}
                </Link>
              </div>
              <div className="space-y-6">
                <Input label="Tên" value={tempData.name} onChange={(e) => setTempData({...tempData, name: e.target.value})} />
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Lĩnh vực chuyên môn (Có thể chọn nhiều)</label>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map(tag => (
                      <button key={tag} onClick={() => toggleSpec(tag)} className={`text-xs px-4 py-2 rounded-xl border transition-all ${tempData.specs.includes(tag) ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"}`}>{tag}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Kinh nghiệm</label>
                  <textarea className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-red-500/50 h-32 outline-none transition-all" value={tempData.experience} onChange={(e) => setTempData({...tempData, experience: e.target.value})} />
                </div>
                <Button variant={isProfileChanged ? "primary" : "secondary"} className={`w-full py-4 rounded-2xl transition-all ${!isProfileChanged ? "opacity-40 cursor-not-allowed grayscale" : "shadow-red-500/20 shadow-xl scale-[1.02]"}`} disabled={!isProfileChanged} onClick={handleUpdateProfile}>Cập nhật thông tin</Button>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-8 space-y-8">
            {/* PACKAGE SERVICES */}
            <section className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-red-500" /> Quản lý dịch vụ đăng bán</h2>
                <Link href="/dashboard_expert/package">
                  <Button variant="ghost" size="sm" className="text-xs text-red-400">
                    <Plus className="w-3 h-3 mr-1" /> Thêm gói
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div key={s.id} className="group bg-black/40 border border-white/5 p-5 rounded-2xl hover:border-red-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${s.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {s.status === 'active' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-lg">{s.name}</h3>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}</span>
                      <span className="font-bold text-red-400">{s.price}</span>
                    </div>
                    {/* Hiển thị trạng thái duyệt */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                        s.status === 'active' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'
                      }`}>
                        {s.status === 'active' ? 'Đang hiển thị' : 'Chờ Admin duyệt'}
                      </span>
                    </div>
                  </div>
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
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/20 text-sm">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-widest">
                    <tr><th className="px-6 py-4">Khách hàng</th><th className="px-6 py-4">Lĩnh vực</th><th className="px-6 py-4">Thời gian</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AppointmentRow name="Nguyễn Văn A" type="Tarot" time="14:00 - 05/03/2026" />
                    <AppointmentRow name="Trần Thị B" type="Tử vi" time="09:30 - 06/03/2026" />
                  </tbody>
                </table>
              </div>
            </section>

            {/* FEEDBACK */}
            <section ref={feedbackRef} className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-red-500" /> Phản hồi khách hàng</h2>
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl"><p className="text-gray-500 text-sm italic italic">Chưa có đánh giá nào mới.</p></div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

// SUB-COMPONENTS
function StatCard({ icon, label, value, onClick, isClickable }: any) {
  return (
    <div onClick={onClick} className={`bg-gray-900/40 border border-white/10 p-6 rounded-[2rem] flex items-center gap-5 backdrop-blur-md transition-all ${isClickable ? "cursor-pointer hover:bg-white/5 hover:scale-[1.02]" : ""}`}>
      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">{icon}</div>
      <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">{label}</p><p className="text-2xl font-black text-white">{value}</p></div>
    </div>
  );
}

function NotificationItem({ title, desc, time, icon }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
      <div className="flex gap-3">
        <div className="mt-1">{icon}</div>
        <div><p className="text-sm font-bold text-white">{title}</p><p className="text-xs text-gray-400 mt-1">{desc}</p><p className="text-[10px] text-gray-500 mt-2 font-medium">{time}</p></div>
      </div>
    </div>
  );
}

function AppointmentRow({ name, type, time }: any) {
  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4 font-medium text-white">{name}</td>
      <td className="px-6 py-4"><span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-md text-[10px] font-bold border border-red-500/20">{type}</span></td>
      <td className="px-6 py-4 text-gray-400 flex items-center gap-2"><Clock className="w-3 h-3" /> {time}</td>
      <td className="px-6 py-4 text-right"><button className="text-xs text-gray-500 hover:text-white underline">Chi tiết</button></td>
    </tr>
  );
}