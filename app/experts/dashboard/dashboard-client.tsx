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

import { expertApi } from '@/lib/api-client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { useRouter } from 'next/navigation';

const mapSpecialtyToUI = (spec: string): string => {
  if (!spec) return 'Tarot';
  const upper = spec.toUpperCase();
  if (upper === 'TAROT') return 'Tarot';
  if (upper === 'ASTROLOGY') return 'Astrology';
  if (upper === 'NUMEROLOGY') return 'Numerology';
  if (upper === 'HOROSCOPE') return 'Tử vi';
  return spec;
};

export default function ExpertDashboard({ id }: { id: string }) {
  const router = useRouter();
  const { token } = useAuthStore();
  const baseUrl = `/experts/${id}/dashboard`;

  // --- STATES ---
  const [isVerified, setIsVerified] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  // Profile Data
  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    bio: "",
    experience: "",
    yoe: 0,
    avatar: null as string | null,
    specs: [] as string[]
  });

  // Notifications simulation state
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Lịch hẹn mới", desc: "Khách hàng đã đăng ký lịch Tarot trực tuyến.", time: "10 phút trước", icon: <Calendar className="w-4 h-4 text-purple-400" /> },
    { id: 2, title: "Yêu cầu dịch vụ", desc: "Các thay đổi dịch vụ của bạn đang đợi hệ thống phê duyệt.", time: "1 giờ trước", icon: <Clock className="w-4 h-4 text-yellow-400" /> },
  ]);

  const appointmentRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Load profile, services, and appointments from backend
  useEffect(() => {
    let isSubscribed = true;

    const fetchAll = async () => {
      if (!token) return;

      // Check approval status via API
      try {
        const profileRes = await expertApi.getProfile(id, token);
        const exp = profileRes?.expert || profileRes;
        if (exp && exp.status === 'PENDING') {
          router.push(`/experts/${id}/pending`);
          return;
        }
      } catch (err) {
        console.warn('API check failed in dashboard client', err);
      }

      if (!isSubscribed) return;

      try {
        // Fetch Profile
        const profileRes = await expertApi.getProfile(id, token);
        if (profileRes && isSubscribed) {
          const exp = profileRes.expert || profileRes;
          setProfileData({
            name: exp.user?.name || exp.name || "Chuyên gia",
            title: exp.specialty 
              ? `Chuyên gia ` + (Array.isArray(exp.specialty) 
                 ? exp.specialty.map(mapSpecialtyToUI).join(', ') 
                 : mapSpecialtyToUI(exp.specialty)) 
              : "Chuyên gia tư vấn",
            bio: exp.bio || "",
            experience: exp.experience || "",
            yoe: exp.experience_years !== undefined ? exp.experience_years : 5,
            avatar: exp.user?.avatar || exp.avatar || null,
            specs: exp.specialty 
              ? (Array.isArray(exp.specialty) 
                 ? exp.specialty.map(mapSpecialtyToUI) 
                 : [mapSpecialtyToUI(exp.specialty)]) 
              : ['Tarot']
          });
          setIsVerified(exp.status === 'APPROVED' || exp.is_verified || false);
        }

        // Fetch Services
        const servicesRes = await expertApi.getServices(id, token);
        if (servicesRes && isSubscribed) {
          setServices(servicesRes.map((s: any) => ({
            id: s.id,
            name: s.name,
            price: `${s.price.toLocaleString()}đ`,
            duration: `${s.duration} phút`,
            status: s.status?.toLowerCase() || 'pending'
          })));
        }

        // Fetch Appointments
        const appointmentsRes = await expertApi.getAppointments(id, token);
        if (appointmentsRes && isSubscribed) {
          setAppointments(appointmentsRes);
        }
      } catch (error) {
        console.error('Lỗi khi đồng bộ dữ liệu với API backend:', error);
      }
    };

    fetchAll();

    return () => {
      isSubscribed = false;
    };
  }, [id, token, router]);

  const handleDeleteService = async (serviceId: string) => {
    if (!token) {
      toast.error('Phiên đăng nhập hết hạn.');
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) return;

    const loadToast = toast.loading('Đang xóa gói dịch vụ...');
    try {
      await expertApi.deleteService(id, serviceId, token);
      setServices(prev => prev.filter(s => String(s.id) !== String(serviceId)));
      toast.success('Xóa gói dịch vụ thành công!', { id: loadToast });
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409 || err.status === 409) {
        toast.error('Không thể xóa gói dịch vụ đang có lịch hẹn đã đăng ký.', { id: loadToast });
      } else {
        toast.error('Có lỗi xảy ra khi xóa dịch vụ.', { id: loadToast });
      }
    }
  };

  // Tính số lượng lịch hẹn mới (Paid hoặc Pending)
  const pendingAppointmentsCount = appointments.filter(a => a.status === 'PAID' || a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-['Be_Vietnam_Pro'] overflow-x-hidden selection:bg-red-500/30 selection:text-red-200">
      {/* Horizontal Header */}
      <ExpertHeader
        onScrollToSection={(sectionId) => {
          if (sectionId === 'appointments') {
            appointmentRef.current?.scrollIntoView({ behavior: 'smooth' });
          } else if (sectionId === 'feedbacks') {
            feedbackRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onShowNotifications={() => setShowNotifications(true)}
      />

      {/* DRAWER NOTIFICATIONS */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />
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
            onClick={() => setShowNotifications(true)}
            className="hidden md:flex p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group relative items-center justify-center"
          >
            <Bell className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900"></span>
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<DollarSign className="text-green-400 w-6 h-6" />} label="Doanh thu" value="0.0đ" />
          <StatCard icon={<Calendar className="text-purple-400 w-6 h-6" />} label="Lịch hẹn mới" value={String(pendingAppointmentsCount).padStart(2, '0')} onClick={() => appointmentRef.current?.scrollIntoView({ behavior: 'smooth' })} isClickable />
          <StatCard icon={<Star className="text-yellow-400 w-6 h-6" />} label="Đánh giá TB" value="0.0" />
          <StatCard icon={<MessageSquare className="text-blue-400 w-6 h-6" />} label="Phản hồi" value="0" onClick={() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth' })} isClickable />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: PROFILE SUMMARY */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <div className="h-28 bg-gradient-to-r from-purple-900/40 to-red-900/40 w-full relative" />
              <div className="p-8 pt-0 relative">
                <div className="absolute top-[-40px] left-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-900 shadow-2xl bg-gray-800 flex items-center justify-center">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Expert Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Link href={`${baseUrl}/verify`} className={`text-[10px] px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all border ${isVerified ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white"}`}>
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

                  {profileData.bio && (
                    <p className="text-xs text-gray-300 italic bg-white/5 p-4 rounded-2xl border border-white/5 leading-relaxed">
                      "{profileData.bio}"
                    </p>
                  )}

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

                  <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-4 text-center">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <p className="text-xs font-black text-yellow-400">⭐ 4.9</p>
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-wider mt-0.5">Đánh giá</p>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <p className="text-xs font-black text-purple-400">{profileData.yoe} năm</p>
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-wider mt-0.5">Kinh nghiệm</p>
                    </div>
                  </div>

                  <Link href={`${baseUrl}/profile`} className="block pt-2">
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
            <section className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-red-500" /> Quản lý dịch vụ cá nhân</h2>
                <Link href={`${baseUrl}/package`}>
                  <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-1">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Thêm gói
                  </Button>
                </Link>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-gray-500 text-sm italic">Chưa có gói dịch vụ nào. Hãy thêm gói mới!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((s) => (
                    <div key={s.id} className="group bg-black/40 border border-white/5 p-5 rounded-2xl hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-2 rounded-lg ${s.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                            {s.status === 'active' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`${baseUrl}/package?edit=${s.id}`}>
                              <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteService(s.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <h3 className="font-bold text-white text-lg">{s.name}</h3>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="text-gray-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration}</span>
                          <span className="font-bold text-red-400">{s.price}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                          s.status === 'active' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : s.status === 'rejected'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {s.status === 'active' ? 'Đang hoạt động' : s.status === 'rejected' ? 'Bị từ chối' : 'Chờ duyệt'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* APPOINTMENTS */}
        <section ref={appointmentRef} className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Calendar className="w-6 h-6 text-red-500" /> Quản lý lịch hẹn</h2>
            <div className="flex gap-2">
              <Link href={`${baseUrl}/schedule`}>
                <Button variant="primary" size="sm" className="px-4 whitespace-nowrap"><Calendar className="w-4 h-4 mr-1" /> Lịch &amp; Giờ rảnh</Button>
              </Link>
            </div>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-gray-500 text-sm italic">Chưa có lịch hẹn nào của khách hàng.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/30">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-widest font-black">
                  <tr>
                    <th className="px-6 py-4">Khách hàng</th>
                    <th className="px-6 py-4">Dịch vụ</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Thời gian</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {appointments.filter(a => a.status !== 'AVAILABLE').map((apt: any) => (
                    <AppointmentRow
                      key={apt.id}
                      name={apt.customer_name || apt.user?.name || 'Khách hàng'}
                      serviceName={apt.service_name || apt.service?.name || 'Dịch vụ'}
                      time={apt.start_time ? format(new Date(apt.start_time), 'HH:mm - dd/MM/yyyy', { locale: vi }) : 'Chưa định ngày'}
                      status={apt.status}
                      id={apt.id}
                      expertId={id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

function AppointmentRow({ name, serviceName, time, status, id, expertId }: any) {
  const statusLabels: Record<string, string> = {
    PENDING: 'Chờ thanh toán',
    PAID: 'Đã thanh toán',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy'
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    PAID: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/20',
    CANCELLED: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  };

  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4 font-bold text-white">{name}</td>
      <td className="px-6 py-4">
        <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg text-[10px] font-black border border-purple-500/20 uppercase tracking-wider">
          🔮 {serviceName}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${statusColors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
          {statusLabels[status] || status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-400 font-medium">
        <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-500" /> {time}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <Link href={`/experts/${expertId}/dashboard/schedule`}>
          <button className="text-xs text-red-400 hover:text-red-300 font-black hover:underline transition-all">Chi tiết</button>
        </Link>
      </td>
    </tr>
  );
}
