'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Calculator, RefreshCw, Sparkles, Star, ArrowRight, Zap, Crown, Infinity as InfinityIcon } from 'lucide-react';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { FormattedContent } from '@/components/ui/FormattedContent';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import ContentHeader from '@/components/layout/ContentHeader';

const numerologyMeanings = {
  1: {
    title: 'Người Lãnh Đạo',
    traits: 'Độc lập, sáng tạo, tham vọng, tiên phong',
    description: 'Bạn là người có khả năng lãnh đạo tự nhiên, luôn muốn đi đầu và khởi xướng những điều mới mẻ.',
    career: 'CEO, doanh nhân, nhà phát minh, lãnh đạo',
    lucky: 'Màu đỏ, kim cương, ngày Chủ nhật'
  },
  2: {
    title: 'Người Hòa Giải',
    traits: 'Hợp tác, nhạy cảm, kiên nhẫn, hòa thuận',
    description: 'Bạn là người có khả năng làm việc nhóm tốt, luôn tạo được sự hòa hợp trong mọi mối quan hệ.',
    career: 'Ngoại giao, tư vấn, giáo dục, dịch vụ khách hàng',
    lucky: 'Màu cam, ngọc trai, ngày Thứ hai'
  },
  3: {
    title: 'Người Sáng Tạo',
    traits: 'Nghệ thuật, giao tiếp, lạc quan, sáng tạo',
    description: 'Bạn có tài năng nghệ thuật và khả năng giao tiếp xuất sắc, luôn mang đến niềm vui cho mọi người.',
    career: 'Nghệ sĩ, nhà văn, diễn viên, designer',
    lucky: 'Màu vàng, topaz, ngày Thứ ba'
  },
  4: {
    title: 'Người Xây Dựng',
    traits: 'Thực tế, tổ chức, kỷ luật, đáng tin cậy',
    description: 'Bạn là người thực tế, có khả năng tổ chức tốt và luôn hoàn thành công việc một cách chỉn chu.',
    career: 'Kỹ sư, kiến trúc sư, kế toán, quản lý dự án',
    lucky: 'Màu xanh lá, ngọc lục bảo, ngày Thứ tư'
  },
  5: {
    title: 'Người Tự Do',
    traits: 'Phiêu lưu, linh hoạt, tò mò, năng động',
    description: 'Bạn yêu thích tự do và khám phá, không thích bị ràng buộc bởi những quy tắc cứng nhắc.',
    career: 'Du lịch, báo chí, bán hàng, marketing',
    lucky: 'Màu xanh dương, sapphire, ngày Thứ năm'
  },
  6: {
    title: 'Người Nuôi Dưỡng',
    traits: 'Quan tâm, trách nhiệm, gia đình, chữa lành',
    description: 'Bạn có bản tính quan tâm đến người khác, luôn muốn giúp đỡ và bảo vệ những người mình yêu thương.',
    career: 'Y tế, giáo dục, tư vấn tâm lý, dịch vụ xã hội',
    lucky: 'Màu hồng, ruby, ngày Thứ sáu'
  },
  7: {
    title: 'Người Tìm Kiếm',
    traits: 'Trí tuệ, tâm linh, phân tích, bí ẩn',
    description: 'Bạn là người có tư duy sâu sắc, thích nghiên cứu và tìm hiểu những điều bí ẩn của cuộc sống.',
    career: 'Nghiên cứu, triết học, tâm linh, khoa học',
    lucky: 'Màu tím, amethyst, ngày Thứ bảy'
  },
  8: {
    title: 'Người Thành Đạt',
    traits: 'Quyền lực, vật chất, tổ chức, thành công',
    description: 'Bạn có khả năng quản lý tài chính và kinh doanh xuất sắc, luôn hướng tới thành công vật chất.',
    career: 'Kinh doanh, tài chính, bất động sản, quản lý cấp cao',
    lucky: 'Màu đen, onyx, ngày Thổ'
  },
  9: {
    title: 'Người Nhân Đạo',
    traits: 'Từ bi, rộng lượng, hoàn thiện, phục vụ',
    description: 'Bạn có tấm lòng nhân ái, luôn muốn đóng góp cho xã hội và giúp đỡ những người khó khăn.',
    career: 'Từ thiện, phi lợi nhuận, nghệ thuật, giáo dục',
    lucky: 'Màu trắng, kim cương, tất cả các ngày'
  }
};

export default function NumerologyPage() {
  const sidebarCollapsed = useSidebarCollapsed();
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { user, isAuthenticated } = useAuthStore();

  const calculateLifePath = (birthDate: string) => {
    const numbers = birthDate.replace(/\D/g, '');
    let sum = 0;
    for (let digit of numbers) {
      sum += parseInt(digit);
    }

    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      const digits = sum.toString().split('');
      sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
    }

    return sum > 9 ? sum : sum;
  };

  const calculateNameNumber = (name: string) => {
    const letterValues: { [key: string]: number } = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
      'À': 1, 'Á': 1, 'Ả': 1, 'Ã': 1, 'Ạ': 1,
      'Ê': 5, 'È': 5, 'É': 5, 'Ẻ': 5, 'Ẽ': 5, 'Ẹ': 5,
      'Ô': 6, 'Ò': 6, 'Ó': 6, 'Ỏ': 6, 'Õ': 6, 'Ọ': 6,
      'Ư': 3, 'Ù': 3, 'Ú': 3, 'Ủ': 3, 'Ũ': 3, 'Ụ': 3,
      'Ì': 9, 'Í': 9, 'Ỉ': 9, 'Ĩ': 9, 'Ị': 9,
    };

    let sum = 0;
    const cleanName = name.toUpperCase().replace(/[^A-ZÀÁẢÃẠÊÈÉẺẼẸÔÒÓỎÕỌƯÙÚỦŨỤÌÍỈĨỊ]/g, '');

    for (let char of cleanName) {
      sum += letterValues[char] || 0;
    }

    while (sum > 9) {
      const digits = sum.toString().split('');
      sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
    }

    return sum;
  };

  const performCalculation = async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem thần số học');
      return;
    }

    const nameToUse = user?.name || '';
    const birthDateToUse = user?.birth_date || '';
    const genderToUse = user?.gender || 'other';

    if (!nameToUse || !birthDateToUse) {
      toast.error('Vui lòng cập nhật đầy đủ tên và ngày sinh trong hồ sơ');
      return;
    }

    // Format birth_date to YYYY-MM-DD
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

    const formattedBirthDate = formatBirthDate(birthDateToUse);

    setIsCalculating(true);

    try {
      const requestBody = {
        domain: 'numerology',
        feature_type: 'overview',
        user_context: {
          name: nameToUse,
          gender: genderToUse,
          birth_date: formattedBirthDate
        }
      };

      console.log('[Numerology] Sending request:', { ...requestBody, token: '***' });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/numerology`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[Numerology] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Numerology] Error response:', errorData);

        if (response.status === 403 && errorData.error === 'LIMIT_REACHED') {
          // Calculate local numbers for display even when limit reached
          const lifePath = calculateLifePath(birthDateToUse);
          const nameNumber = calculateNameNumber(nameToUse);
          const finalNumber = lifePath <= 9 ? lifePath : lifePath;
          const meaning = numerologyMeanings[finalNumber as keyof typeof numerologyMeanings];

          setResult({
            name: nameToUse,
            birthDate: birthDateToUse,
            lifePath,
            nameNumber,
            finalNumber,
            meaning,
            analysis: `⚠️ **Đã hết lượt sử dụng**\n\n` +
              `Bạn đã dùng hết ${errorData.currentUsage}/${errorData.limit} lượt cho tính năng này.\n\n` +
              `Nâng cấp lên **${errorData.tier === 'FREE' ? 'PREMIUM' : 'ULTIMATE'}** để xem phân tích AI chi tiết!\n\n` +
              `---\n\n**Kết quả cơ bản:**\n${meaning.description}`
          });
          setIsCalculating(false);
          return;
        }

        if (response.status === 500) {
          const errorMsg = errorData.message || errorData.error || 'Internal server error';
          toast.error(`Lỗi server: ${errorMsg}`);
          setIsCalculating(false);
          return;
        }

        toast.error(errorData.message || 'Không thể lấy phân tích thần số học');
        setIsCalculating(false);
        return;
      }

      const data = await response.json();
      console.log('[Numerology] Backend response:', data);
      
      // Calculate local numbers for display
      const lifePath = calculateLifePath(birthDateToUse);
      const nameNumber = calculateNameNumber(nameToUse);
      const finalNumber = lifePath <= 9 ? lifePath : lifePath;
      const meaning = numerologyMeanings[finalNumber as keyof typeof numerologyMeanings];

      // Parse response giống Fortune - 3 tier check
      let analysis = '';
      
      try {
        // Tier 1: Check response.analysis (object with body)
        if (data.analysis) {
          if (typeof data.analysis === 'object') {
            // Lambda format: { statusCode, headers, body }
            if (data.analysis.body) {
              const bodyData = typeof data.analysis.body === 'string' 
                ? JSON.parse(data.analysis.body) 
                : data.analysis.body;
              
              // Extract analysis from bodyData
              analysis = bodyData.answer?.analysis || bodyData.answer || bodyData.analysis || bodyData.message || JSON.stringify(bodyData, null, 2);
            } else {
              analysis = data.analysis.data || data.analysis.message || JSON.stringify(data.analysis, null, 2);
            }
          } else {
            // analysis is string
            analysis = data.analysis;
          }
        }
        // Tier 2: Check response.data (direct string)
        else if (data.data) {
          analysis = typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);
        }
        // Tier 3: Direct Lambda format
        else if (data.statusCode && data.body) {
          const bodyData = typeof data.body === 'string'
            ? JSON.parse(data.body)
            : data.body;
          analysis = bodyData.answer?.analysis || bodyData.answer || bodyData.analysis || JSON.stringify(bodyData, null, 2);
        }
      } catch (parseError) {
        console.error('[Numerology] Parse error:', parseError);
        analysis = '';
      }

      if (analysis && analysis.trim() !== '') {
        setResult({
          name: nameToUse,
          birthDate: birthDateToUse,
          lifePath,
          nameNumber,
          finalNumber,
          meaning,
          analysis: analysis,
        });
        toast.success('Đã tính toán thần số học thành công!');
      } else {
        console.error('[Numerology] No analysis in response:', data);
        toast.error('Không nhận được kết quả từ hệ thống');
        
        // Fallback to local calculation
        setResult({
          name: nameToUse,
          birthDate: birthDateToUse,
          lifePath,
          nameNumber,
          finalNumber,
          meaning,
          analysis: meaning.description,
        });
      }
    } catch (error: any) {
      console.error('[Numerology] Error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi tính toán');
      toast.error('Có lỗi xảy ra khi kết nối với AI');
      
      // Fallback to local calculation
      const lifePath = calculateLifePath(birthDateToUse);
      const nameNumber = calculateNameNumber(nameToUse);
      const finalNumber = lifePath <= 9 ? lifePath : lifePath;
      const meaning = numerologyMeanings[finalNumber as keyof typeof numerologyMeanings];

      setResult({
        name: nameToUse,
        birthDate: birthDateToUse,
        lifePath,
        nameNumber,
        finalNumber,
        meaning,
        analysis: meaning.description,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const resetCalculation = () => {
    setResult(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

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
          title="Thần Số Học"
          description="Khám phá bản chất qua sức mạnh của con số"
        />

        <div className="flex-1 overflow-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-6xl mx-auto">

            {/* Input Section */}
            <AnimatePresence mode="wait">
              {!result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="max-w-2xl mx-auto mb-16 mt-8"
                >
                  <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-500">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-purple-500/20 transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32 group-hover:bg-indigo-500/20 transition-colors duration-700" />

                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-8 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-400 mr-2 animate-pulse" />
                        Thông tin định danh
                        <Sparkles className="w-5 h-5 text-purple-400 ml-2 animate-pulse" />
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-black/30 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                          <p className="text-xs text-purple-300 uppercase tracking-wider mb-2 font-semibold">Họ và tên</p>
                          <p className="text-white font-medium text-xl truncate">{user?.name || 'Chưa cập nhật'}</p>
                        </div>
                        <div className="bg-black/30 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                          <p className="text-xs text-purple-300 uppercase tracking-wider mb-2 font-semibold">Ngày sinh</p>
                          <p className="text-white font-medium text-xl">{user?.birth_date ? new Date(user.birth_date).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                        </div>
                      </div>

                      <Button
                        onClick={performCalculation}
                        isLoading={isCalculating} 
                        className="w-full py-6 text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isCalculating ? (
                          "Đang kết nối vũ trụ..."
                        ) : (
                          <>
                            <Calculator className="w-6 h-6 mr-3" />
                            Khám Phá Ngay
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Display */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="max-w-5xl mx-auto space-y-12"
                >
                  {/* Numbers Display */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div variants={itemVariants} className="relative group">
                      <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-blue-500/20">
                          <span className="text-4xl font-bold text-blue-400">{result.lifePath}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Đường Đời</h3>
                        <p className="text-sm text-gray-400">Con số chủ đạo tiết lộ mục đích sống và bài học cuộc đời</p>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="relative group">
                      <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden hover:border-purple-500/50 transition-all duration-300 h-full">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-purple-500/20">
                          <span className="text-4xl font-bold text-purple-400">{result.nameNumber}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Sứ Mệnh</h3>
                        <p className="text-sm text-gray-400">Năng lực tiềm ẩn và sức mạnh nội tại từ cái tên</p>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="relative group">
                      <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/30 text-center relative overflow-hidden hover:border-amber-500/60 transition-all duration-300 h-full shadow-lg shadow-amber-900/20">
                        <div className="absolute top-0 right-0 p-3 opacity-50">
                          <Crown className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-amber-500/30">
                          <span className="text-4xl font-bold text-amber-400">{result.finalNumber}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Kết Quả</h3>
                        <p className="text-sm text-amber-200/80 font-medium">{result.meaning.title}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Analysis Display */}
                  <motion.div variants={itemVariants} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
                    <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
                      <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30 animate-float">
                          <InfinityIcon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          Phân Tích Chi Tiết
                        </h3>
                        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto rounded-full" />
                      </div>

                      <div className="prose prose-invert max-w-none">
                        <div className="bg-black/20 rounded-2xl p-8 border border-white/5">
                          <FormattedContent content={result.analysis} className="text-gray-200 leading-relaxed text-lg" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h4 className="text-purple-400 font-bold mb-2 text-sm uppercase">Nghề nghiệp phù hợp</h4>
                            <p className="text-gray-300 text-sm">{result.meaning.career}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h4 className="text-pink-400 font-bold mb-2 text-sm uppercase">Đặc điểm nổi bật</h4>
                            <p className="text-gray-300 text-sm">{result.meaning.traits}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h4 className="text-amber-400 font-bold mb-2 text-sm uppercase">May mắn</h4>
                            <p className="text-gray-300 text-sm">{result.meaning.lucky}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center mt-12">
                        <Button
                          onClick={resetCalculation}
                          variant="secondary"
                          className="group px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
                        >
                          <RefreshCw className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                          Tra cứu số khác
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Numbers Reference */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-24"
            >
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />
                <h2 className="text-2xl font-bold text-white text-center flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  Ý Nghĩa Các Con Số
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </h2>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(numerologyMeanings).map(([number, meaning], index) => (
                  <motion.div
                    key={number}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg mr-4 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300 border border-white/10">
                        <span className="text-xl font-bold text-white">{number}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{meaning.title}</h3>
                        <div className="h-0.5 w-0 group-hover:w-full bg-purple-500 transition-all duration-300" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">{meaning.description}</p>
                    <div className="flex items-center text-xs text-gray-500 font-medium group-hover:text-white transition-colors">
                      Xem chi tiết <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
