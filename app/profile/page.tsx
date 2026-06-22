'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, Plus, Edit, Trash2, Calendar, MapPin, Clock, Users, Sparkles, Camera, Save, X, HelpCircle, ArrowRight } from 'lucide-react';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useAuthStore, useProfileStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ReminderSettings } from '@/components/profile/ReminderSettings';
import ContentHeader from '@/components/layout/ContentHeader';
import { profileApi } from '@/lib/api-client';

const genderTypes = [
  { value: 'male', label: 'Nam', icon: User, color: 'text-blue-400' },
  { value: 'female', label: 'Nữ', icon: User, color: 'text-pink-400' },
  { value: 'other', label: 'Khác', icon: Sparkles, color: 'text-purple-400' }
];

export default function ProfilePage() {
  const router = useRouter();
  const sidebarCollapsed = useSidebarCollapsed();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [partnerForm, setPartnerForm] = useState<{
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    gender: 'male' | 'female' | 'other';
  }>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: 'female'
  });

  const { user, isAuthenticated, updateProfile, token } = useAuthStore();
  const { partner, breakupData, addPartner, updatePartner, breakup, confirmRecovery, fetchPartner, moveOn } = useProfileStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect to login if not authenticated or profile incomplete
  // useEffect(() => {
  //   if (!isAuthenticated || !user?.isProfileComplete) {
  //     router.push('/auth/login');
  //   }
  // }, [isAuthenticated, user, router]);

  // if (!isAuthenticated || !user?.isProfileComplete) {
  //   return null;
  // }

  // Load user profile and partner info from backend on mount
  useEffect(() => {
    const loadData = async () => {
      if (!token || !isAuthenticated) return;

      // Load Profile
      try {
        const userData = await profileApi.get(token);
        if (userData) {
          const currentUser = useAuthStore.getState().user;
          const { vip_tier, vip_expires_at, birth_date, birth_time, birth_place, ...otherData } = userData;

          useAuthStore.setState({
            user: {
              ...currentUser,
              ...otherData,
              isProfileComplete: !!(userData.name && userData.birth_date && userData.birth_time && userData.birth_place),
              vipTier: vip_tier || currentUser?.vipTier,
              vipExpiresAt: vip_expires_at || currentUser?.vipExpiresAt,
              birth_date: birth_date,
              birth_time: birth_time,
              birth_place: birth_place,
            }
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }

      // Load Partner
      try {
        await fetchPartner();
      } catch (error) {
        console.error('Failed to load partner:', error);
      }
    };

    loadData();
  }, [token, isAuthenticated, fetchPartner]);

  // Helper function to format date for input type="date"
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns "yyyy-MM-dd"
    } catch {
      return '';
    }
  };

  // Helper function to format date for display (dd-mm-yyyy)
  const formatDateDisplay = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString || '';
    }
  };

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    birthDate: formatDateForInput(user?.birth_date),
    birthTime: user?.birth_time || '',
    birthPlace: user?.birth_place || ''
  });

  // Update editForm when user data changes
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        birthDate: formatDateForInput(user.birth_date),
        birthTime: user.birth_time || '',
        birthPlace: user.birth_place || ''
      });
    }
  }, [user]);

  useEffect(() => {
    // Kiểm tra breakup data và hiện thông báo mỗi 5 ngày
    if (breakupData && breakupData.isActive) {
      const daysPassed = Math.floor((new Date().getTime() - new Date(breakupData.breakupDate).getTime()) / (24 * 60 * 60 * 1000));
      const checkInterval = 5; // Mỗi 5 ngày
      const checkNumber = Math.floor(daysPassed / checkInterval);

      // Kiểm tra nếu đã đến thời điểm check mới và chưa check lần này
      if (checkNumber > 0 && (!breakupData.weeklyCheckDone[checkNumber] || breakupData.weeklyCheckDone.length <= checkNumber)) {
        // Hiện thông báo mỗi 5 ngày
        setTimeout(() => {
          const message = `Đã ${daysPassed} ngày kể từ khi bạn chia tay với ${breakupData.partnerName}. Bạn có cảm thấy đã vượt qua và sẵn sàng bước tiếp chưa?`;
          if (confirm(message + '\n\nNếu đã vượt qua, chúng tôi sẽ xóa thông tin để giúp bạn bắt đầu lại.')) {
            confirmRecovery();
            toast.success('Chúc mừng bạn đã vượt qua! Thông tin đã được xóa để bạn có thể bắt đầu hành trình mới.');
          } else {
            // Đánh dấu đã check lần này
            const updatedChecks = [...(breakupData.weeklyCheckDone || [])];
            updatedChecks[checkNumber] = true;
            // Cập nhật lại store với thông tin check mới
            const updatedBreakupData = { ...breakupData, weeklyCheckDone: updatedChecks };
            useProfileStore.setState({ breakupData: updatedBreakupData });
            toast('Chúng tôi sẽ tiếp tục hỗ trợ bạn. Hãy kiên nhẫn, mọi thứ sẽ tốt lên!');
          }
        }, 2000);
      }

      // Kiểm tra tự động xóa sau 1 tháng
      const monthsPassed = (new Date().getTime() - new Date(breakupData.breakupDate).getTime()) / (30 * 24 * 60 * 60 * 1000);
      if (monthsPassed >= 1) {
        confirmRecovery();
        toast.success('Đã qua 1 tháng kể từ khi chia tay. Thông tin đã được tự động xóa để bạn có thể bắt đầu lại.');
      }
    }
  }, [breakupData, confirmRecovery]);

  const handleSaveProfile = async () => {
    if (token) {
      try {
        await updateProfile(editForm.name, editForm.birthDate, editForm.birthTime, editForm.birthPlace, token);
        setIsEditing(false);
        toast.success('Cập nhật thông tin thành công!');
      } catch (error) {
        toast.error('Lỗi lưu thông tin. Vui lòng kiểm tra định dạng ngày/giờ.');
      }
    } else {
      toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      router.push('/auth/login');
    }
  };

  const handleAddPartner = async () => {
    if (!partnerForm.name || !partnerForm.birthDate || !partnerForm.birthTime || !partnerForm.birthPlace) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await addPartner(partnerForm);
      setPartnerForm({
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        gender: 'female'
      });
      setShowAddPartner(false);
      toast.success('Đã thêm thông tin người phụ thuộc!');
    } catch (error: any) {
      toast.error(error.message || 'Không thể lưu thông tin partner');
    }
  };

  const handleBreakup = () => {
    if (!partner) return;

    if (confirm('Bạn có chắc chắn muốn xác nhận chia tay? Thông tin này sẽ được lưu trong 1 tháng để hỗ trợ bạn.')) {
      breakup();
      toast.success('Đã cập nhật trạng thái. Chúng tôi sẽ hỗ trợ bạn trong thời gian này.');
    }
  };

  const handleGetBackTogether = () => {
    if (!breakupData) return;

    if (confirm(`Bạn có muốn quay lại với ${breakupData.partnerName}? Điều này sẽ khôi phục thông tin mối quan hệ.`)) {
      // Khôi phục thông tin partner từ breakupData
      const restoredPartner = {
        ...breakupData.partnerInfo,
        startDate: new Date().toISOString() // Cập nhật ngày bắt đầu mới
      };

      useProfileStore.setState({
        partner: restoredPartner,
        breakupData: null
      });

      toast.success('Chúc mừng! Đã khôi phục mối quan hệ. Chúc bạn hạnh phúc!');
    }
  };

  const handleMoveOn = () => {
    if (confirm('Bạn có chắc chắn muốn thoát ly ngay lập tức? Hành động này sẽ xóa vĩnh viễn thông tin người cũ và cho phép bạn thêm người mới.')) {
      moveOn();
      toast.success('Đã thoát ly quá trình hồi phục. Chúc bạn sớm tìm được hạnh phúc mới!');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const getGenderInfo = (type: string) => {
    return genderTypes.find(g => g.value === type) || genderTypes[1];
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-white">
      <AnimatedBackground />
      <Sidebar />

      <main
        // className={`flex-1 flex flex-col transition-all duration-200 relative z-10 
        //   ${sidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[280px]'} 
        //   ml-0`}
        className="flex-1 relative z-10 overflow-x-hidden overflow-y-auto transition-all duration-200"
        style={{ marginLeft: isMobile ? '0' : (sidebarCollapsed ? '60px' : '280px') }}
      >
        {/* Header */}
        <ContentHeader
          title="Hồ Sơ Cá Nhân"
          description="Quản lý thông tin cá nhân và mối quan hệ"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-3xl mx-auto">

            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl w-full rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/10 shadow-xl mb-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 relative z-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-4 border-black/50">
                    <span className="text-lg md:text-2xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-white">{user?.name || 'Chưa cập nhật'}</h2>
                    <p className="text-purple-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Thành viên chính thức
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="secondary"
                  size="sm"
                  className="backdrop-blur-md"
                >
                  {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Hủy bỏ' : 'Chỉnh sửa'}
                </Button>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Họ và tên</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Nhập họ tên"
                      className="bg-black/40 border-white/10 focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Ngày sinh</label>
                    <Input
                      type="date"
                      value={editForm.birthDate}
                      onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                      className="bg-black/40 border-white/10 focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Giờ sinh</label>
                    <Input
                      type="time"
                      value={editForm.birthTime}
                      onChange={(e) => setEditForm({ ...editForm, birthTime: e.target.value })}
                      className="bg-black/40 border-white/10 focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Nơi sinh</label>
                    <Input
                      value={editForm.birthPlace}
                      onChange={(e) => setEditForm({ ...editForm, birthPlace: e.target.value })}
                      placeholder="Thành phố, Quốc gia"
                      className="bg-black/40 border-white/10 focus:border-purple-500/50"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:bg-black/30 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-sm text-gray-400">Họ tên</p>
                    </div>
                    <p className="text-white font-medium pl-11">{user?.name || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:bg-black/30 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-400">Ngày sinh</p>
                    </div>
                    <p className="text-white font-medium pl-11">
                      {user?.birth_date ? new Date(user.birth_date).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:bg-black/30 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                        <Clock className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-sm text-gray-400">Giờ sinh</p>
                    </div>
                    <p className="text-white font-medium pl-11">{user?.birth_time || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:bg-black/30 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mr-3">
                        <MapPin className="w-4 h-4 text-orange-400" />
                      </div>
                      <p className="text-sm text-gray-400">Nơi sinh</p>
                    </div>
                    <p className="text-white font-medium pl-11">{user?.birth_place || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Breakup Status Warning */}
            <AnimatePresence>
              {breakupData && breakupData.isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-3xl p-8 backdrop-blur-xl mb-8 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-orange-500/5 animate-pulse" />
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-8">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                          <Heart className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-orange-200">Đang trong thời kỳ hồi phục</h3>
                          <p className="text-orange-300/70 text-sm">Hãy dành thời gian yêu thương bản thân</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleMoveOn}
                          className="bg-gray-600/20 border-gray-500/30 text-gray-300 hover:bg-gray-600/30 whitespace-nowrap backdrop-blur-md"
                          variant="secondary"
                          size="sm"
                        >
                          Thoát ly
                        </Button>
                        <Button
                          onClick={handleGetBackTogether}
                          className="bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30 whitespace-nowrap backdrop-blur-md"
                          variant="secondary"
                          size="sm"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Lò vi sóng
                        </Button>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-2xl p-6 border border-orange-500/20">
                      <p className="text-orange-200 mb-4 text-md md:text-lg">
                        Bạn đang trải qua giai đoạn sau chia tay với <span className="font-bold">{breakupData.partnerName}</span>
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-orange-300/70 mb-1">Ngày chia tay</p>
                          <p className="text-orange-200 font-medium">{new Date(breakupData.breakupDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-orange-300/70 mb-1">Tự động xóa sau</p>
                          <p className="text-orange-200 font-medium">{new Date(breakupData.autoDeleteDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Partner Information - Hidden if breakup is active */}
            {!breakupData?.isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl relative overflow-hidden mb-8"
              >
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

                {/* <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 relative z-10">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg border-4 border-black/50 transition-transform hover:scale-105 duration-300">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Người Phụ Thuộc Tình Cảm</h2>
                  </div>
                  {!partner && !showAddPartner && (
                    <Button
                      onClick={() => setShowAddPartner(true)}
                      className="bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border-pink-500/30"
                      variant="secondary"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm người phụ thuộc
                    </Button>
                  )}
                </div> */}

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 relative z-10">
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Icon Heart: Style tròn, có viền dày đen/50 giống Profile Avatar */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg border-4 border-black/50 transition-transform hover:scale-105 duration-300">
                      <Heart className="w-8 h-8 md:w-10 md:h-10 text-white fill-white/20" />
                    </div>

                    <div>
                      {/* Tiêu đề: Size chữ và độ đậm đồng nhất với Profile */}
                      <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">
                        Người Phụ Thuộc Tình Cảm
                      </h2>
                      <p className="text-pink-300/80 flex items-center gap-2 text-sm md:text-base">
                        <Sparkles className="w-4 h-4" />
                        Kết nối năng lượng cặp đôi
                      </p>
                    </div>
                  </div>

                  {/* Button: Đưa về variant secondary và thêm hiệu ứng backdrop-blur */}
                  {!partner && !showAddPartner && (
                    <Button
                      onClick={() => setShowAddPartner(true)}
                      variant="secondary"
                      size="sm"
                      className="backdrop-blur-md bg-pink-500/20 hover:bg-pink-500/30 border-pink-500/30 text-pink-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm người phụ thuộc
                    </Button>
                  )}
                </div>

                {/* Add Partner Form */}
                <AnimatePresence>
                  {showAddPartner && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 relative z-10"
                    >
                      <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-6">Thêm thông tin người phụ thuộc</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Họ và tên</label>
                            <Input
                              value={partnerForm.name}
                              onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                              placeholder="Nhập họ tên"
                              className="bg-black/40 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Giới tính</label>
                            <div className="grid grid-cols-3 gap-4">
                              {genderTypes.map((type) => (
                                <button
                                  key={type.value}
                                  onClick={() => setPartnerForm({ ...partnerForm, gender: type.value as 'male' | 'female' | 'other' })}
                                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${partnerForm.gender === type.value
                                    ? 'bg-white/10 border-pink-500/50 shadow-lg shadow-pink-500/10'
                                    : 'bg-black/40 border-white/10 hover:bg-white/5'
                                    }`}
                                >
                                  <type.icon className={`w-6 h-6 mb-2 ${type.color}`} />
                                  <span className="text-sm text-gray-300">{type.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Ngày sinh</label>
                            <Input
                              type="date"
                              value={partnerForm.birthDate}
                              onChange={(e) => setPartnerForm({ ...partnerForm, birthDate: e.target.value })}
                              className="bg-black/40 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Giờ sinh</label>
                            <Input
                              type="time"
                              value={partnerForm.birthTime}
                              onChange={(e) => setPartnerForm({ ...partnerForm, birthTime: e.target.value })}
                              className="bg-black/40 border-white/10"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-300">Nơi sinh</label>
                            <Input
                              value={partnerForm.birthPlace}
                              onChange={(e) => setPartnerForm({ ...partnerForm, birthPlace: e.target.value })}
                              placeholder="Thành phố, Quốc gia"
                              className="bg-black/40 border-white/10"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                          <Button
                            onClick={handleAddPartner}
                            className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm người phụ thuộc
                          </Button>
                          <Button
                            onClick={() => setShowAddPartner(false)}
                            variant="secondary"
                            className="flex"
                          >
                            Hủy bỏ
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Current Partner Display */}
                {partner ? (
                  <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 rounded-2xl p-6 md:p-10 border border-pink-500/20 relative z-10 group hover:border-pink-500/40 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-8">
                      <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                        <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center text-3xl shadow-inner shrink-0">
                          {(() => {
                            const type = getGenderInfo(partner.gender);
                            const Icon = type.icon;
                            return <Icon className={`w-8 h-8 ${type.color}`} />;
                          })()}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{partner.name}</h3>
                          <p className="text-pink-300 font-medium">{getGenderInfo(partner.gender).label}</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleBreakup}
                        variant="secondary"
                        size="sm"
                        className="bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/20"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Chia tay
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-gray-400 mb-1">Ngày sinh</p>
                        <p className="text-white font-medium">{formatDateDisplay(partner.birthDate)}</p>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-gray-400 mb-1">Giờ sinh</p>
                        <p className="text-white font-medium">{partner.birthTime}</p>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-gray-400 mb-1">Nơi sinh</p>
                        <p className="text-white font-medium">{partner.birthPlace}</p>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-gray-400 mb-1">Bắt đầu từ</p>
                        <p className="text-white font-medium">
                          {formatDateDisplay(partner.startDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : !showAddPartner && (
                  <div className="text-center py-12 relative z-10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Heart className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-gray-400 mb-2 text-lg">Chưa có thông tin người phụ thuộc</p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      Thêm thông tin người yêu/vợ/chồng để AI có thể phân tích độ tương hợp và dự đoán tình duyên chính xác hơn
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Reminder Settings */}
            <ReminderSettings />

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-blue-900/20 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm"
            >
              <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Lưu ý quan trọng
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start text-blue-200/80 text-sm">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                  Thông tin người phụ thuộc giúp AI phân tích tình duyên chính xác hơn
                </li>
                <li className="flex items-start text-blue-200/80 text-sm">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                  Mỗi loại mối quan hệ chỉ được thêm 1 người để đảm bảo tính chính xác
                </li>
                <li className="flex items-start text-blue-200/80 text-sm">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                  Khi chia tay, thông tin sẽ được lưu 30 ngày để hỗ trợ bạn vượt qua giai đoạn khó khăn
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

      </main>
    </div>
  );
}
