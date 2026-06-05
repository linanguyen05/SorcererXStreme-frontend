'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  User, Briefcase, CheckCircle, AlertCircle,
  Bell, Search, X, ShieldCheck, UserCheck, Users, BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { adminApi } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for demo fallback
const mockPendingExperts = [
  {
    id: "exp-1",
    name: "Master Alistair",
    title: "Chuyên gia Thần Số Học & Tarot",
    email: "alistair.numerology@gmail.com",
    experience: "7 năm kinh nghiệm",
    specs: ["Tarot", "Thần Số Học"],
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    id: "exp-2",
    name: "Astrologer Celine",
    title: "Chuyên gia Bản đồ sao & Chiêm tinh học",
    email: "celine.astrology@outlook.com",
    experience: "4 năm kinh nghiệm",
    specs: ["Chiêm Tinh"],
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: "exp-3",
    name: "Thầy Minh Tuệ",
    title: "Chuyên gia Kinh Dịch & Tử Vi Phương Đông",
    email: "minhtue.tuvi@vietnam.vn",
    experience: "12 năm kinh nghiệm",
    specs: ["Tử Vi", "Kinh Dịch"],
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  }
];

const mockPendingServices = [
  {
    id: "ser-1",
    name: "Tư vấn tình duyên chuyên sâu qua Thần Số Học",
    expertName: "Master Alistair",
    price: "450.000đ",
    duration: "45 phút",
    status: "pending"
  },
  {
    id: "ser-2",
    name: "Giải mã bản đồ sao cặp đôi (Synastry Chart)",
    expertName: "Astrologer Celine",
    price: "750.000đ",
    duration: "90 phút",
    status: "pending"
  },
  {
    id: "ser-3",
    name: "Lập lá số tử vi trọn đời & Luận giải đại vận",
    expertName: "Thầy Minh Tuệ",
    price: "1.200.000đ",
    duration: "120 phút",
    status: "pending"
  }
];

export default function AdminDashboard() {
  const { token } = useAuthStore();

  // --- STATES ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingExperts, setPendingExperts] = useState<any[]>([]);
  const [pendingServices, setPendingServices] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [activeApprovalTab, setActiveApprovalTab] = useState<'experts' | 'services'>('experts');
  const [pendingSearch, setPendingSearch] = useState('');

  // Notifications simulation state
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Đăng ký mới", desc: "Chuyên gia Master Alistair đã nộp hồ sơ đăng ký tài khoản.", time: "10 phút trước", icon: <UserCheck className="w-4 h-4 text-purple-400" /> },
    { id: 2, title: "Dịch vụ mới", desc: "Dịch vụ 'Giải mã bản đồ sao cặp đôi' đang chờ phê duyệt.", time: "1 giờ trước", icon: <Briefcase className="w-4 h-4 text-yellow-400" /> },
  ]);

  // Helper functions for mock persistence
  const getMockExpertsFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock-pending-experts');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('mock-pending-experts', JSON.stringify(mockPendingExperts));
    }
    return mockPendingExperts;
  };

  const getMockServicesFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock-pending-services');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('mock-pending-services', JSON.stringify(mockPendingServices));
    }
    return mockPendingServices;
  };

  // Load from localStorage & APIs on mount
  useEffect(() => {
    const fetchPendingData = async () => {
      setLoadingPending(true);
      try {
        let expertsData = [];
        let servicesData = [];
        if (token) {
          try {
            expertsData = await adminApi.getPendingExperts(token);
          } catch (e) {
            expertsData = getMockExpertsFromLocalStorage();
          }
          try {
            servicesData = await adminApi.getPendingServices(token);
          } catch (e) {
            servicesData = getMockServicesFromLocalStorage();
          }
        } else {
          expertsData = getMockExpertsFromLocalStorage();
          servicesData = getMockServicesFromLocalStorage();
        }

        setPendingExperts(expertsData);
        setPendingServices(servicesData);
      } catch (error) {
        console.error("Error loading pending queue:", error);
      } finally {
        setLoadingPending(false);
      }
    };

    fetchPendingData();
  }, [token]);

  // Handle Approve / Reject Expert via PATCH
  const handleApproveExpert = async (id: string, action: 'approve' | 'reject') => {
    const expert = pendingExperts.find(e => e.id === id);
    if (!expert) return;

    const actionText = action === 'approve' ? 'phê duyệt' : 'từ chối';

    toast.promise(
      (async () => {
        if (token) {
          try {
            await adminApi.approveExpert(id, action, token);
          } catch (e) {
            console.warn("API PATCH failed, fallback to local updating.", e);
          }
        }

        // Update local state and persist
        const updated = pendingExperts.filter(e => e.id !== id);
        setPendingExperts(updated);
        localStorage.setItem('mock-pending-experts', JSON.stringify(updated));

        // Add simulation notification
        const newNotif = {
          id: Date.now(),
          title: action === 'approve' ? 'Duyệt chuyên gia thành công' : 'Đã từ chối chuyên gia',
          desc: `Chuyên gia ${expert.name} đã được ${actionText}.`,
          time: 'Vừa xong',
          icon: action === 'approve' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />
        };
        setNotifications(prev => [newNotif, ...prev]);
      })(),
      {
        loading: `Đang thực hiện ${actionText} chuyên gia...`,
        success: `Đã ${actionText} chuyên gia ${expert.name}!`,
        error: `Có lỗi xảy ra khi cập nhật chuyên gia.`,
      }
    );
  };

  // Handle Approve / Reject Service via PATCH
  const handleApproveService = async (id: string, action: 'approve' | 'reject') => {
    const service = pendingServices.find(s => s.id === id);
    if (!service) return;

    const actionText = action === 'approve' ? 'phê duyệt' : 'từ chối';

    toast.promise(
      (async () => {
        if (token) {
          try {
            await adminApi.approveService(id, action, token);
          } catch (e) {
            console.warn("API PATCH failed, fallback to local updating.", e);
          }
        }

        // Update local state and persist
        const updated = pendingServices.filter(s => s.id !== id);
        setPendingServices(updated);
        localStorage.setItem('mock-pending-services', JSON.stringify(updated));

        // Add simulation notification
        const newNotif = {
          id: Date.now(),
          title: action === 'approve' ? 'Duyệt dịch vụ thành công' : 'Đã từ chối dịch vụ',
          desc: `Dịch vụ "${service.name}" của ${service.expertName} đã được ${actionText}.`,
          time: 'Vừa xong',
          icon: action === 'approve' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />
        };
        setNotifications(prev => [newNotif, ...prev]);
      })(),
      {
        loading: `Đang thực hiện ${actionText} dịch vụ...`,
        success: `Đã ${actionText} dịch vụ "${service.name}"!`,
        error: `Có lỗi xảy ra khi cập nhật dịch vụ.`,
      }
    );
  };

  // Search filter implementation
  const filteredExperts = pendingExperts.filter(e =>
    e.name.toLowerCase().includes(pendingSearch.toLowerCase()) ||
    e.email.toLowerCase().includes(pendingSearch.toLowerCase()) ||
    e.title.toLowerCase().includes(pendingSearch.toLowerCase())
  );

  const filteredServices = pendingServices.filter(s =>
    s.name.toLowerCase().includes(pendingSearch.toLowerCase()) ||
    s.expertName.toLowerCase().includes(pendingSearch.toLowerCase())
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
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* WELCOME BANNER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-[0.25em] font-medium">Hệ thống phê duyệt tài khoản chuyên gia & dịch vụ</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard icon={<Users className="text-purple-400 w-6 h-6" />} label="Chuyên gia chờ duyệt" value={pendingExperts.length.toString()} />
          <StatCard icon={<Briefcase className="text-yellow-400 w-6 h-6" />} label="Dịch vụ chờ duyệt" value={pendingServices.length.toString()} />
          <StatCard icon={<BarChart3 className="text-green-400 w-6 h-6" />} label="Tổng yêu cầu tồn đọng" value={(pendingExperts.length + pendingServices.length).toString()} />
        </div>

        {/* FULL WIDTH: DATA TABLE APPROVAL QUEUE */}
        <section id="approval-table" className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />

          {/* Heading and controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-red-500" /> Yêu cầu đang chờ phê duyệt
              </h2>
              <p className="text-gray-400 text-xs">Phê duyệt hoặc từ chối các Chuyên gia và Dịch vụ mới đăng ký trên hệ thống</p>
            </div>

            {/* Switch tabs */}
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
              <button
                onClick={() => { setActiveApprovalTab('experts'); setPendingSearch(''); }}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${activeApprovalTab === 'experts' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white'}`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Chuyên gia ({pendingExperts.length})
              </button>
              <button
                onClick={() => { setActiveApprovalTab('services'); setPendingSearch(''); }}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${activeApprovalTab === 'services' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white'}`}
              >
                <Briefcase className="w-3.5 h-3.5" /> Dịch vụ ({pendingServices.length})
              </button>
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
                Xóa lọc
              </Button>
            )}
          </div>

          {/* TABLE CONTAINER */}
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/30">
            {loadingPending ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-400">Đang tải danh sách chờ duyệt...</p>
              </div>
            ) : activeApprovalTab === 'experts' ? (
              /* EXPERTS TABLE */
              filteredExperts.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5 text-gray-400 uppercase text-[10px] tracking-widest font-black">
                      <th className="px-6 py-4">Chuyên gia</th>
                      <th className="px-6 py-4">Kinh nghiệm</th>
                      <th className="px-6 py-4">Lĩnh vực</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredExperts.map((exp) => (
                      <tr key={exp.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={exp.avatar} alt={exp.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                            <div>
                              <p className="font-bold text-white group-hover:text-red-400 transition-colors">{exp.name}</p>
                              <p className="text-xs text-gray-400">{exp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white text-xs font-semibold">{exp.experience}</p>
                          <p className="text-[10px] text-gray-500">{exp.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {exp.specs.map((s: string) => (
                              <span key={s} className="text-[9px] font-black uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
                            Chờ duyệt
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveExpert(exp.id, 'approve')}
                              className="px-3 py-1.5 rounded-xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Phê duyệt
                            </button>
                            <button
                              onClick={() => handleApproveExpert(exp.id, 'reject')}
                              className="px-3 py-1.5 rounded-xl text-xs font-black bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Từ chối
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
                  <p className="text-gray-400 font-medium text-sm">Không tìm thấy chuyên gia nào chờ duyệt.</p>
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
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white">
                            {ser.expertName.charAt(0)}
                          </div>
                          {ser.expertName}
                        </td>
                        <td className="px-6 py-4 text-gray-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" /> {ser.duration}
                        </td>
                        <td className="px-6 py-4 text-red-400 font-bold">
                          {ser.price}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
                            Chờ duyệt
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveService(ser.id, 'approve')}
                              className="px-3 py-1.5 rounded-xl text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Phê duyệt
                            </button>
                            <button
                              onClick={() => handleApproveService(ser.id, 'reject')}
                              className="px-3 py-1.5 rounded-xl text-xs font-black bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Từ chối
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
                  <p className="text-gray-400 font-medium text-sm">Không tìm thấy dịch vụ nào chờ duyệt.</p>
                </div>
              )
            )}
          </div>
        </section>
      </main>
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
