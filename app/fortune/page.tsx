'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Star, Heart, Calendar, ArrowRight, MapPin, Clock, RotateCcw, User as UserIcon } from 'lucide-react';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useAuthStore, useProfileStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { FormattedContent } from '@/components/ui/FormattedContent';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { horoscopeApi } from '@/lib/api-client';
import ContentHeader from '@/components/layout/ContentHeader';

type Tab = 'daily' | 'tuvi' | 'love';

export default function FortunePage() {
  const sidebarCollapsed = useSidebarCollapsed();
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const { user, isAuthenticated, token } = useAuthStore();
  const { partner, breakupData } = useProfileStore();

  // States for Tu Vi
  const [tuviInput, setTuviInput] = useState({
    name: user?.name || '',
    gender: user?.gender || 'male',
    birthDate: user?.birth_date || '',
    birthTime: user?.birth_time || '',
    birthPlace: user?.birth_place || ''
  });
  const [tuviResult, setTuviResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // States for Daily Horoscope
  const [dailyInput, setDailyInput] = useState({
    targetDate: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD
  });
  const [dailyResult, setDailyResult] = useState<any>(null);
  const [isDailyLoading, setIsDailyLoading] = useState(false);

  // Sync user data to form when user loads
  useEffect(() => {
    if (user) {
      // Format birth_date to dd/mm/yyyy for display
      let formattedBirthDate = '';
      if (user.birth_date) {
        const date = new Date(user.birth_date);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          formattedBirthDate = `${day}/${month}/${year}`;
        }
      }
      
      setTuviInput({
        name: user.name || '',
        gender: user.gender || 'male',
        birthDate: formattedBirthDate,
        birthTime: user.birth_time || '',
        birthPlace: user.birth_place || ''
      });
    }
  }, [user]);

  // Handler for Daily Horoscope
  const handleDailySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDailyLoading(true);

    try {
      if (!token || !isAuthenticated) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
        setIsDailyLoading(false);
        return;
      }

      if (!user?.birth_time) {
        toast.error('Vui lòng cập nhật giờ sinh trong hồ sơ cá nhân');
        setIsDailyLoading(false);
        return;
      }

      if (!user?.birth_place) {
        toast.error('Vui lòng cập nhật nơi sinh trong hồ sơ cá nhân');
        setIsDailyLoading(false);
        return;
      }

      if (!dailyInput.targetDate) {
        toast.error('Vui lòng chọn ngày xem tử vi');
        setIsDailyLoading(false);
        return;
      }

      // Format user birth_date to YYYY-MM-DD
      const formatBirthDate = (dateStr: string): string => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };

      console.log('[Fortune Daily] Sending request:', {
        target_date: dailyInput.targetDate,
        birth_time: user.birth_time,
        birth_place: user.birth_place
      });

      // Call daily horoscope API
      const response = await horoscopeApi.getHoroscope({
        domain: 'horoscope',
        feature_type: 'daily',
        user_context: {
          name: user.name || 'User',
          gender: user.gender || 'male',
          birth_date: formatBirthDate(user.birth_date || ''),
          birth_time: user.birth_time,  // ✅ REQUIRED
          birth_place: user.birth_place  // ✅ REQUIRED
        },
        data: {
          target_date: dailyInput.targetDate  // ✅ REQUIRED for daily
        }
      }, token);

      // Parse giống như Tarot - backend trả về: { analysis: {...} }
      let analysis = '';
      
      try {
        // Nếu response có analysis field (như Tarot)
        if (response.analysis) {
          // Analysis là object (Lambda format)
          if (typeof response.analysis === 'object') {
            // Lambda response: { statusCode, headers, body }
            if (response.analysis.body) {
              const bodyData = typeof response.analysis.body === 'string' 
                ? JSON.parse(response.analysis.body) 
                : response.analysis.body;
              
              // Lấy answer từ bodyData
              analysis = bodyData.answer?.analysis || bodyData.answer || bodyData.analysis || bodyData.message || JSON.stringify(bodyData, null, 2);
            } else {
              analysis = response.analysis.data || response.analysis.message || JSON.stringify(response.analysis, null, 2);
            }
          } else {
            // analysis is string
            analysis = response.analysis;
          }
        }
        // Nếu response có data field (như Chat)
        else if (response.data) {
          analysis = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
        }
        // Direct Lambda format: { statusCode, headers, body }
        else if (response.statusCode && response.body) {
          const bodyData = typeof response.body === 'string'
            ? JSON.parse(response.body)
            : response.body;
          analysis = bodyData.answer?.analysis || bodyData.answer || bodyData.analysis || JSON.stringify(bodyData, null, 2);
        }
        
      } catch (parseError) {
        console.error('[Fortune Daily] Parse error:', parseError);
        analysis = 'Có lỗi khi xử lý kết quả. Vui lòng thử lại.';
      }
      
      if (!analysis || analysis.trim() === '') {
        toast.error('Không nhận được kết quả từ hệ thống. Vui lòng thử lại');
        setIsDailyLoading(false);
        toast.error('Không nhận được kết quả từ hệ thống. Vui lòng thử lại');
        setIsDailyLoading(false);
        return;
      }

      setDailyResult({
        analysis: analysis,
        date: dailyInput.targetDate
      });

      toast.success('Đã xem tử vi thành công!');
    } catch (error: any) {
      console.error('[Fortune Daily] Error:', error);
      
      if (error.message && error.message.includes('LIMIT_REACHED')) {
        setDailyResult({
          analysis: `⚠️ **Đã hết lượt sử dụng**\n\n` +
            `Bạn đã hết lượt xem Tử Vi hàng ngày.\n\n` +
            `Nâng cấp lên **PREMIUM** hoặc **ULTIMATE** để tiếp tục!`,
          date: dailyInput.targetDate
        });
        toast.error('Đã hết lượt sử dụng');
      } else {
        toast.error(error.message || 'Có lỗi xảy ra khi xem tử vi');
      }
    } finally {
      setIsDailyLoading(false);
    }
  };

  // Mock Daily Horoscope - Remove this when API is working
  const dailyHoroscope = {
    general: "Hôm nay là một ngày tràn đầy năng lượng tích cực. Bạn sẽ cảm thấy hứng khởi và sẵn sàng đối mặt với mọi thử thách.",
    love: "Tình cảm thăng hoa, hãy dành thời gian cho người ấy.",
    career: "Công việc thuận lợi, có cơ hội thăng tiến hoặc nhận được lời khen ngợi.",
    luckyNumber: "8, 16, 24",
    luckyColor: "Xanh dương, Tím"
  };

  const handleTuviSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('[Fortune] Checking auth:', { 
        hasToken: !!token, 
        isAuthenticated, 
        user: user?.email 
      });
      
      if (!token || !isAuthenticated) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
        setIsLoading(false);
        return;
      }

      // Validate required fields
      if (!tuviInput.name || !tuviInput.birthDate) {
        toast.error('Vui lòng điền đầy đủ họ tên và ngày sinh');
        setIsLoading(false);
        return;
      }

      // ⚠️ CRITICAL: birth_time and birth_place REQUIRED for horoscope
      if (!tuviInput.birthTime) {
        toast.error('Vui lòng nhập giờ sinh (bắt buộc cho Tử Vi)');
        setIsLoading(false);
        return;
      }

      if (!tuviInput.birthPlace) {
        toast.error('Vui lòng nhập nơi sinh (bắt buộc cho Tử Vi)');
        setIsLoading(false);
        return;
      }

      // Format birth_date from dd/mm/yyyy to YYYY-MM-DD for backend
      const formatBirthDate = (dateStr: string): string => {
        if (!dateStr) return dateStr;
        // Check if already in dd/mm/yyyy format
        if (dateStr.includes('/')) {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        // Fallback for other formats
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };

      const formattedBirthDate = formatBirthDate(tuviInput.birthDate);

      console.log('[Fortune] Sending natal chart request:', { 
        birth_date: formattedBirthDate,
        birth_time: tuviInput.birthTime,
        birth_place: tuviInput.birthPlace
      });

      // Call natal chart API - NO target_date needed
      const response = await horoscopeApi.getHoroscope({
        domain: 'horoscope',
        feature_type: 'natal_chart',
        user_context: {
          name: tuviInput.name,
          gender: tuviInput.gender,
          birth_date: formattedBirthDate,
          birth_time: tuviInput.birthTime,  // ✅ REQUIRED
          birth_place: tuviInput.birthPlace  // ✅ REQUIRED
        }
        // ❌ NO data.target_date for natal chart
      }, token);

      // Parse giống như Tarot
      let analysis = '';
      
      try {
        if (response.analysis) {
          if (typeof response.analysis === 'object') {
            if (response.analysis.body) {
              const bodyData = typeof response.analysis.body === 'string' 
                ? JSON.parse(response.analysis.body) 
                : response.analysis.body;
              analysis = bodyData.answer?.analysis || bodyData.answer || bodyData.analysis || bodyData.message || JSON.stringify(bodyData, null, 2);
            } else {
              analysis = response.analysis.data || response.analysis.message || JSON.stringify(response.analysis, null, 2);
            }
          } else {
            analysis = response.analysis;
          }
        } else if (response.data) {
          analysis = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
        } else if (response.statusCode && response.body) {
          const bodyData = typeof response.body === 'string'
            ? JSON.parse(response.body)
            : response.body;
          analysis = bodyData.answer?.analysis || bodyData.answer || bodyData.analysis || JSON.stringify(bodyData, null, 2);
        }
        
      } catch (parseError) {
        console.error('[Fortune] Parse error:', parseError);
        analysis = 'Có lỗi khi xử lý kết quả. Vui lòng thử lại.';
      }
      
      if (!analysis || analysis.trim() === '') {
        toast.error('Không nhận được kết quả từ hệ thống. Vui lòng thử lại');
        setIsLoading(false);
        return;
      }

      setTuviResult({
        analysis: analysis
      });

      toast.success('Đã lập lá số tử vi thành công!');
    } catch (error: any) {
      console.error('[Fortune] Error:', error);
      
      // Xử lý error từ API
      if (error.message && error.message.includes('LIMIT_REACHED')) {
        setTuviResult({
          analysis: `⚠️ **Đã hết lượt sử dụng**\n\n` +
            `Bạn đã hết lượt xem lá số Tử Vi.\n\n` +
            `Nâng cấp lên **PREMIUM** hoặc **ULTIMATE** để tiếp tục!`
        });
        toast.error('Đã hết lượt sử dụng');
      } else if (error.message && error.message.includes('500')) {
        toast.error('Lỗi server. Vui lòng thử lại sau');
      } else {
        toast.error(error.message || 'Có lỗi xảy ra khi lập lá số');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-white">
      <AnimatedBackground />
      <Sidebar />

      <main 
        className="flex-1 flex flex-col transition-all duration-200 relative z-10"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '280px' }}
      >
        {/* Header */}
        <ContentHeader
          title="Bói Toán & Tử Vi"
          description="Khám phá vận mệnh qua các vì sao"
        />

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === 'daily' ? 'text-yellow-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Star className="w-4 h-4" />
              Tử Vi Hàng Ngày
            </div>
            {activeTab === 'daily' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('tuvi')}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === 'tuvi' ? 'text-purple-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Moon className="w-4 h-4" />
              Lập Lá Số Tử Vi
            </div>
            {activeTab === 'tuvi' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('love')}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === 'love' ? 'text-pink-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              Bói Tình Duyên
            </div>
            {activeTab === 'love' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'daily' && (
                <motion.div
                  key="daily"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {!dailyResult ? (
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2">Tử Vi Hàng Ngày</h2>
                          <p className="text-gray-400">Chọn ngày để xem vận mệnh và những điều cần lưu ý</p>
                        </div>

                        {/* Check if user has birth_time and birth_place */}
                        {(!user?.birth_time || !user?.birth_place) && (
                          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                            <div className="flex items-start">
                              <Star className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-yellow-300 font-medium mb-1">⚠️ Thiếu thông tin bắt buộc</p>
                                <p className="text-yellow-200 text-sm">
                                  Tử Vi yêu cầu <strong>giờ sinh</strong> và <strong>nơi sinh</strong>. 
                                  Vui lòng cập nhật trong hồ sơ cá nhân.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <form onSubmit={handleDailySubmit} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Chọn ngày xem tử vi
                            </label>
                            <input
                              type="date"
                              value={dailyInput.targetDate}
                              onChange={(e) => setDailyInput({ ...dailyInput, targetDate: e.target.value })}
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Có thể xem quá khứ, hiện tại hoặc tương lai
                            </p>
                          </div>

                          <div className="bg-black/20 rounded-xl p-4 space-y-2 text-sm">
                            <h3 className="text-white font-medium mb-3">Thông tin của bạn:</h3>
                            <div className="grid grid-cols-2 gap-3 text-gray-400">
                              <div>
                                <span className="text-gray-500">Họ tên:</span>
                                <p className="text-white">{user?.name || 'Chưa cập nhật'}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Ngày sinh:</span>
                                <p className="text-white">{user?.birth_date ? new Date(user.birth_date).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Giờ sinh:</span>
                                <p className={user?.birth_time ? "text-white" : "text-red-400"}>{user?.birth_time || '⚠️ Bắt buộc'}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Nơi sinh:</span>
                                <p className={user?.birth_place ? "text-white" : "text-red-400"}>{user?.birth_place || '⚠️ Bắt buộc'}</p>
                              </div>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            isLoading={isDailyLoading} // Sử dụng prop isLoading
                            disabled={!user?.birth_time || !user?.birth_place} // Button tự disable khi loading, chỉ cần check điều kiện input
                            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 py-4 text-lg shadow-lg shadow-yellow-500/25"
                          >
                            {/* Đơn giản hóa nội dung bên trong */}
                            {isDailyLoading ? (
                              "Đang xem tử vi..."
                            ) : (
                              <>
                                <Star className="w-5 h-5 mr-2" />
                                Xem Tử Vi
                              </>
                            )}
                          </Button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">
                          Tử Vi Ngày {new Date(dailyResult.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </h2>
                        <Button
                          onClick={() => setDailyResult(null)}
                          variant="secondary"
                          size="sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Xem ngày khác
                        </Button>
                      </div>

                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center mb-6">
                          <Star className="w-6 h-6 text-yellow-400 mr-3" />
                          <h3 className="text-xl font-bold text-white">Lời Giải Đoán</h3>
                        </div>
                        <FormattedContent content={dailyResult.analysis} className="text-gray-300 leading-relaxed space-y-4" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'tuvi' && (
                <motion.div
                  key="tuvi"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {!tuviResult ? (
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2">Lập Lá Số Tử Vi</h2>
                          <p className="text-gray-400">Nhập thông tin chính xác để có kết quả luận giải chi tiết nhất</p>
                        </div>

                        <form onSubmit={handleTuviSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Họ và tên</label>
                              <input
                                type="text"
                                value={tuviInput.name}
                                onChange={(e) => setTuviInput({ ...tuviInput, name: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                                placeholder="Nguyễn Văn A"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Giới tính</label>
                              <select
                                value={tuviInput.gender}
                                onChange={(e) => setTuviInput({ ...tuviInput, gender: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all appearance-none"
                              >
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Ngày sinh (Dương lịch)</label>
                              <input
                                type="text"
                                value={tuviInput.birthDate}
                                onChange={(e) => setTuviInput({ ...tuviInput, birthDate: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                                placeholder="dd/mm/yyyy"
                                pattern="\d{2}/\d{2}/\d{4}"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Giờ sinh</label>
                              <input
                                type="time"
                                value={tuviInput.birthTime}
                                onChange={(e) => setTuviInput({ ...tuviInput, birthTime: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Nơi sinh</label>
                            <input
                              type="text"
                              value={tuviInput.birthPlace}
                              onChange={(e) => setTuviInput({ ...tuviInput, birthPlace: e.target.value })}
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                              placeholder="Hà Nội, TP.HCM..."
                            />
                          </div>

                          <Button
                            type="submit"
                            isLoading={isLoading} // Sử dụng prop isLoading
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-4 text-lg shadow-lg shadow-purple-500/25"
                          >
                            {/* Đơn giản hóa nội dung bên trong */}
                            {isLoading ? (
                              "Đang luận giải..."
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Lập Lá Số
                              </>
                            )}
                          </Button>
                          
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Kết Quả Luận Giải Tử Vi</h2>
                        <Button
                          onClick={() => setTuviResult(null)}
                          variant="secondary"
                          size="sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Lập lá số khác
                        </Button>
                      </div>

                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center mb-6">
                          <Sparkles className="w-6 h-6 text-purple-400 mr-3" />
                          <h3 className="text-xl font-bold text-white">Lá Số Tử Vi - {tuviInput.name}</h3>
                        </div>
                        <FormattedContent content={tuviResult.analysis} className="text-gray-300 leading-relaxed space-y-4" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'love' && (
                <motion.div
                  key="love"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Heart className="w-12 h-12 text-pink-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Bói Tình Duyên</h2>
                  <p className="text-gray-400 max-w-md mx-auto mb-8">
                    Tính năng đang được cập nhật. Hãy quay lại sau để khám phá những bí ẩn về tình yêu của bạn!
                  </p>
                  <Button variant="secondary" disabled>
                    Sắp ra mắt
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
