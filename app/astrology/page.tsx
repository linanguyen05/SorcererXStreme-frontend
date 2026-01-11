'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, MapPin, Eye, Heart, Sparkles, Clock, RotateCcw } from 'lucide-react';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useAuthStore, useProfileStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FormattedContent } from '@/components/ui/FormattedContent';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import AstrologyScene3D from '@/components/astrology/AstrologyScene3D';
import HouseChart3D from '@/components/astrology/HouseChart3D';
import StarMap3D from '@/components/astrology/StarMap3D';
import toast from 'react-hot-toast';

const zodiacSigns = [
  { name: 'Bạch Dương', date: '21/3 - 19/4', element: 'Hỏa', traits: 'Năng động, dũng cảm, lãnh đạo' },
  { name: 'Kim Ngưu', date: '20/4 - 20/5', element: 'Thổ', traits: 'Bền bỉ, thực tế, đáng tin cậy' },
  { name: 'Song Tử', date: '21/5 - 20/6', element: 'Khí', traits: 'Thông minh, linh hoạt, giao tiếp' },
  { name: 'Cự Giải', date: '21/6 - 22/7', element: 'Thủy', traits: 'Nhạy cảm, chu đáo, bảo vệ' },
  { name: 'Sư Tử', date: '23/7 - 22/8', element: 'Hỏa', traits: 'Tự tin, hào phóng, sáng tạo' },
  { name: 'Xử Nữ', date: '23/8 - 22/9', element: 'Thổ', traits: 'Hoàn hảo, phân tích, tỉ mỉ' },
  { name: 'Thiên Bình', date: '23/9 - 22/10', element: 'Khí', traits: 'Cân bằng, hòa hợp, thẩm mỹ' },
  { name: 'Hổ Cáp', date: '23/10 - 21/11', element: 'Thủy', traits: 'Mạnh mẽ, bí ẩn, đam mê' },
  { name: 'Nhân Mã', date: '22/11 - 21/12', element: 'Hỏa', traits: 'Tự do, phiêu lưu, triết học' },
  { name: 'Ma Kết', date: '22/12 - 19/1', element: 'Thổ', traits: 'Kỷ luật, tham vọng, truyền thống' },
  { name: 'Bảo Bình', date: '20/1 - 18/2', element: 'Khí', traits: 'Độc lập, sáng tạo, nhân đạo' },
  { name: 'Song Ngư', date: '19/2 - 20/3', element: 'Thủy', traits: 'Trực giác, nghệ thuật, đồng cảm' }
];

const getZodiacSign = (dateString: string) => {
  if (!dateString) return zodiacSigns[11];
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[2];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[6];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[7];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[10];
  return zodiacSigns[11];
};

type Tab = 'overview' | 'love';

export default function AstrologyPage() {
  const sidebarCollapsed = useSidebarCollapsed();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [userZodiac, setUserZodiac] = useState<any>(null);
  const [showRelationChart, setShowRelationChart] = useState(false);
  const [showStarMap, setShowStarMap] = useState(false);
  const [starMapGenerated, setStarMapGenerated] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { partner, breakupData } = useProfileStore();

  const analyzeChart = async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem chiêm tinh');
      return;
    }

    // Use snake_case properties from user store
    const birthPlace = user?.birth_place || 'Việt Nam';
    
    // Format birth_date to YYYY-MM-DD
    let birthDate = '';
    if (user?.birth_date) {
      const dateStr = String(user.birth_date);
      // Check if already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        birthDate = dateStr;
      } else {
        // Try to parse and convert to YYYY-MM-DD
        try {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            birthDate = `${year}-${month}-${day}`;
          }
        } catch (e) {
          console.error('Invalid birth_date:', dateStr);
        }
      }
    }
    
    // Validate birth_date
    if (!birthDate) {
      toast.error('Vui lòng cập nhật ngày sinh trong hồ sơ');
      setIsAnalyzing(false);
      return;
    }
    
    const birthTime = user?.birth_time || '';
    const userName = user?.name || '';
    const userGender = user?.gender || 'other';

    setIsAnalyzing(true);
    setStarMapGenerated(false);
    setAnalysis('');

    const zodiac = getZodiacSign(birthDate);
    setUserZodiac(zodiac);

    // Determine feature_type based on active tab (backend chỉ chấp nhận 'overview' hoặc 'love')
    const featureType = activeTab === 'love' ? 'love' : 'overview';

    // Prepare user_context with snake_case
    const userContext = {
      name: userName,
      gender: userGender,
      birth_date: birthDate,
      birth_time: birthTime,
      birth_place: birthPlace
    };

    // Prepare partner_context if in love mode
    let partnerContext = undefined;
    if (featureType === 'love' && partner) {
      // Format partner birth_date to YYYY-MM-DD
      let partnerBirthDate = '';
      if (partner.birthDate) {
        const dateStr = String(partner.birthDate);
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          partnerBirthDate = dateStr;
        } else {
          try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              partnerBirthDate = `${year}-${month}-${day}`;
            }
          } catch (e) {
            console.error('Invalid partner birth_date:', dateStr);
          }
        }
      }
      
      if (!partnerBirthDate) {
        toast.error('Ngày sinh của người yêu không hợp lệ');
        setIsAnalyzing(false);
        return;
      }
      
      partnerContext = {
        name: partner.name,
        gender: partner.gender,
        birth_date: partnerBirthDate,
        birth_time: partner.birthTime,
        birth_place: partner.birthPlace
      };
    }

    try {
      // Endpoint động dựa vào feature_type
      const endpoint = featureType === 'love' 
        ? '/api/astrology/love' 
        : '/api/astrology/overview';

      const requestBody: any = {
        domain: 'astrology',
        feature_type: featureType,
        user_context: userContext
      };

      // Thêm partner_context nếu là love mode
      if (featureType === 'love' && partnerContext) {
        requestBody.partner_context = partnerContext;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 403 && errorData.error === 'LIMIT_REACHED') {
          setAnalysis(
            `⚠️ **Đã hết lượt sử dụng**\n\n` +
            `Bạn đã dùng hết ${errorData.currentUsage}/${errorData.limit} lượt cho tính năng này.\n\n` +
            `Nâng cấp lên **${errorData.tier === 'FREE' ? 'PREMIUM' : 'ULTIMATE'}** để tiếp tục sử dụng!`
          );
          setIsAnalyzing(false);
          return;
        }

        if (response.status === 500) {
          const errorMsg = errorData.message || errorData.error || 'Internal server error';
          setAnalysis(
            `❌ **Lỗi 500 - Lỗi Server**\n\n` +
            `${errorMsg}\n\n` +
            `Backend đang gặp sự cố. Vui lòng thử lại sau.\n\n` +
            `_Chi tiết: ${JSON.stringify(errorData, null, 2)}_`
          );
          setIsAnalyzing(false);
          return;
        }

        toast.error(errorData.message || 'Không thể lấy được phân tích từ AI');
        setIsAnalyzing(false);
        return;
      }

      const data = await response.json();
      
      // Backend trả về: { analysis: "string" } hoặc { analysis: { body: "string" } }
      if (data.analysis) {
        let analysisText = '';
        
        // Nếu analysis là object (Lambda response format)
        if (typeof data.analysis === 'object') {
          // Lambda trả về { statusCode, headers, body }
          if (data.analysis.body) {
            // Body là string JSON, cần parse
            try {
              const bodyData = typeof data.analysis.body === 'string' 
                ? JSON.parse(data.analysis.body) 
                : data.analysis.body;
              
              // Lấy answer từ bodyData
              analysisText = bodyData.answer || bodyData.analysis || bodyData.message || JSON.stringify(bodyData, null, 2);
            } catch (e) {
              // Nếu parse lỗi, dùng body trực tiếp
              analysisText = data.analysis.body;
            }
          }
          // Fallback: thử các field khác
          else if (data.analysis.data) {
            analysisText = data.analysis.data;
          }
          else if (data.analysis.message) {
            analysisText = data.analysis.message;
          }
          else {
            analysisText = JSON.stringify(data.analysis, null, 2);
          }
        } else {
          // analysis is already a string
          analysisText = data.analysis;
        }
        
        setAnalysis(analysisText);
        if (activeTab === 'overview') {
          setShowStarMap(true);
        } else if (activeTab === 'love') {
          setShowRelationChart(true);
        }
      } else {
        console.error('[Astrology] No analysis in response:', data);
        toast.error('Không nhận được nội dung phân tích từ AI');
      }
    } catch (error: any) {
      console.error('[Astrology] Error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi kết nối với AI');
    }

    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setAnalysis('');
    setUserZodiac(null);
    setShowRelationChart(false);
    setShowStarMap(false);
    setStarMapGenerated(false);
  };

  const handleStarMapGenerated = () => {
    setStarMapGenerated(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-white">
      <AnimatedBackground />
      <AstrologyScene3D isActive={isAnalyzing || showRelationChart || showStarMap} mode="general" />
      <Sidebar />

      <main 
        className="flex-1 flex flex-col transition-all duration-200 relative z-10"
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth < 768 
            ? '0' 
            : (sidebarCollapsed ? '80px' : '280px')  }}
      >
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6 sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Star className="w-6 h-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 bg-clip-text text-transparent" style={{ fontFamily: 'Pacifico, cursive' }}>
                Chiêm Tinh Học 3D
              </h1>
              <p className="text-sm text-gray-400 font-light">Khám phá vận mệnh qua vị trí các vì sao</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 backdrop-blur-md">
          <button
            onClick={() => { setActiveTab('overview'); resetAnalysis(); }}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === 'overview' ? 'text-yellow-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              Tổng Quan & Bản Đồ Sao
            </div>
            {activeTab === 'overview' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab('love'); resetAnalysis(); }}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === 'love' ? 'text-pink-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              Tình Duyên
            </div>
            {activeTab === 'love' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {!showStarMap ? (
                    <>
                      {/* Birth Info Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto"
                      >
                        <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-500">
                          {/* Decorative Elements */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-amber-500/20 transition-colors duration-700" />
                          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -ml-32 -mb-32 group-hover:bg-yellow-500/20 transition-colors duration-700" />

                          <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-yellow-400 mr-2 animate-pulse" />
                              Thông tin sinh của bạn
                              <Sparkles className="w-5 h-5 text-yellow-400 ml-2 animate-pulse" />
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                              <div className="bg-black/30 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-yellow-300/80">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-xs uppercase tracking-wider font-semibold">Ngày sinh</span>
                                </div>
                                <p className="text-white font-medium text-lg">
                                  {user?.birth_date ? (() => {
                                    const date = new Date(user.birth_date);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    return `${day}-${month}-${year}`;
                                  })() : 'Chưa có'}
                                </p>
                              </div>
                              <div className="bg-black/30 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-yellow-300/80">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-xs uppercase tracking-wider font-semibold">Giờ sinh</span>
                                </div>
                                <p className="text-white font-medium text-lg">{user?.birth_time || 'Chưa có'}</p>
                              </div>
                              <div className="bg-black/30 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-yellow-300/80">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-xs uppercase tracking-wider font-semibold">Nơi sinh</span>
                                </div>
                                <p className="text-white font-medium text-lg truncate">{user?.birth_place || 'Việt Nam'}</p>
                              </div>
                            </div>

                            <Button
                              onClick={analyzeChart}
                              disabled={isAnalyzing}
                              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 hover:from-yellow-500 hover:via-amber-500 hover:to-orange-500 shadow-lg shadow-amber-500/25 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              {isAnalyzing ? (
                                <>
                                  <LoadingSpinner size="sm" className="mr-3" />
                                  Đang kết nối các vì sao...
                                </>
                              ) : (
                                <>
                                  <Star className="w-6 h-6 mr-3" />
                                  Phân Tích Bản Đồ Sao
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-8"
                    >
                      {/* Star Map 3D */}
                      {user?.birth_date && user?.birth_time && (
                        <div className="relative">
                          <StarMap3D
                            birthDate={String(user.birth_date)}
                            birthTime={user.birth_time}
                            birthPlace={user.birth_place || 'Việt Nam'}
                            userZodiac={userZodiac}
                            onMapGenerated={handleStarMapGenerated}
                          />
                          <div className="mt-4 flex justify-end">
                            <Button
                              onClick={resetAnalysis}
                              variant="secondary"
                              size="sm"
                              className="bg-black/50 backdrop-blur-md border border-white/20 hover:bg-black/70"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Phân tích lại
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Analysis Result */}
                      {analysis && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-10 border border-white/10 shadow-2xl"
                        >
                          <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30 animate-float">
                              <Star className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">
                              Luận Giải Chi Tiết
                            </h3>
                            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
                          </div>

                          <div className="prose prose-invert max-w-none">
                            <div className="bg-black/20 rounded-2xl p-8 border border-white/5">
                              <FormattedContent content={analysis} className="text-gray-200 leading-relaxed text-lg" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'love' && (
                <motion.div
                  key="love"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {!showRelationChart ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-w-2xl mx-auto text-center"
                    >
                      <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                          <Heart className="w-12 h-12 text-pink-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Phân Tích Tình Duyên</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                          Khám phá vận mệnh tình duyên của bạn qua góc nhìn chiêm tinh học. Tìm hiểu về sự tương hợp, thời điểm gặp gỡ định mệnh và lời khuyên cho mối quan hệ.
                        </p>
                        <Button
                          onClick={analyzeChart}
                          disabled={isAnalyzing}
                          className="w-full py-4 text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-500/25 rounded-xl"
                        >
                          {isAnalyzing ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Đang tính toán...
                            </>
                          ) : (
                            <>
                              <Heart className="w-5 h-5 mr-2" />
                              Xem Tình Duyên
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-8"
                    >
                      {/* House Chart 3D */}
                      {user?.birth_date && user?.birth_time && (
                        <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                          <HouseChart3D
                            birthDate={String(user.birth_date)}
                            birthTime={user.birth_time}
                            birthPlace={user.birth_place || 'Việt Nam'}
                            userZodiac={userZodiac}
                          />
                          <div className="absolute bottom-4 right-4 z-10">
                            <Button
                              onClick={resetAnalysis}
                              variant="secondary"
                              size="sm"
                              className="bg-black/50 backdrop-blur-md border border-white/20 hover:bg-black/70"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Xem lại
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Analysis Result */}
                      {analysis && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-10 border border-white/10 shadow-2xl"
                        >
                          <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/30">
                              <Heart className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">
                              Luận Giải Tình Duyên
                            </h3>
                            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto rounded-full" />
                          </div>

                          <div className="prose prose-invert max-w-none">
                            <div className="bg-black/20 rounded-2xl p-8 border border-white/5">
                              <FormattedContent content={analysis} className="text-gray-200 leading-relaxed text-lg" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );  

}