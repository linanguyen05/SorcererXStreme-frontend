'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Heart, Search, BookOpen, Send, Sparkles } from 'lucide-react';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FormattedContent } from '@/components/ui/FormattedContent';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { TAROT_DECK, TarotCard } from '@/lib/tarotData';
import ContentHeader from '@/components/layout/ContentHeader';
// Import Component Giao diện Grid mới
import { TarotSceneNew } from '@/components/tarot/TarotSceneNew';

// --- Types ---
type ReadingMode = 'overview' | 'question' | null;
type ReadingPhase = 'selection' | 'question_input' | 'shuffling' | 'picking' | 'reveal';

export default function TarotPage() {
  const { isAuthenticated, user, token } = useAuthStore();
  const sidebarCollapsed = useSidebarCollapsed();
  const [isMobile, setIsMobile] = useState(false);

  // --- State & Logic (GIỮ NGUYÊN HOÀN TOÀN) ---
  const [readingMode, setReadingMode] = useState<ReadingMode>(null);
  const [phase, setPhase] = useState<ReadingPhase>('selection');
  const [selectedCards, setSelectedCards] = useState<(TarotCard & { isReversed: boolean })[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [question, setQuestion] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const hasCalledApiRef = useRef(false);
  const isPickingCardRef = useRef(false);

  // Kiểm tra screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startReading = (mode: ReadingMode) => {
    setReadingMode(mode);
    if (mode === 'question') setPhase('question_input');
    else beginShuffling();
  };

  const beginShuffling = () => {
    const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
    setShuffledDeck(shuffled);
    setPhase('shuffling');
    // Giảm thời gian chờ xuống 1.5s cho mượt mà hơn với giao diện mới
    setTimeout(() => setPhase('picking'), 1500); 
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    beginShuffling();
  };

  const handleCardPick = async (index: number) => {
    if (isLoadingAnalysis || isPickingCardRef.current) return;
    const requiredCards = readingMode === 'question' ? 1 : 3;
    if (selectedIndices.length >= requiredCards || selectedIndices.includes(index)) return;

    isPickingCardRef.current = true;
    const newIndices = [...selectedIndices, index];
    setSelectedIndices(newIndices);

    const pickedCard = shuffledDeck[index];
    const isReversed = Math.random() > 0.8;
    const newCard = { ...pickedCard, isReversed } as any;
    const newSelectedCards = [...selectedCards, newCard];
    setSelectedCards(newSelectedCards);

    if (newIndices.length === requiredCards) {
      hasCalledApiRef.current = false;
      setTimeout(async () => {
        setPhase('reveal');
        if (!hasCalledApiRef.current) {
          hasCalledApiRef.current = true;
          await fetchTarotAnalysis(newSelectedCards);
        }
        isPickingCardRef.current = false;
      }, 1000);
    } else {
      setTimeout(() => { isPickingCardRef.current = false; }, 300);
    }
  };

  const fetchTarotAnalysis = async (cards: any[]) => {
    if (!token || !user) return;
    setIsLoadingAnalysis(true);
    try {
      const featureType = readingMode === 'question' ? 'question' : 'overview';
      const endpoint = featureType === 'question' ? '/api/tarot/question' : '/api/tarot/overview';
      const cardsDrawn = cards.map((card, index) => ({
        card_name: card.name,
        is_upright: !card.isReversed,
        ...(featureType === 'overview' && {
          position: index === 0 ? 'past' : index === 1 ? 'present' : 'future'
        })
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          domain: 'tarot',
          feature_type: featureType,
          user_context: { name: user.name, gender: user.gender, birth_date: user.birth_date },
          data: { cards_drawn: cardsDrawn, ...(featureType === 'question' && { question }) }
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAiAnalysis(typeof data.analysis === 'string' ? data.analysis : (data.analysis.body ? JSON.parse(data.analysis.body).answer : JSON.stringify(data.analysis)));
      }
    } catch (error: any) {
      setAiAnalysis(`❌ Lỗi: ${error.message}`);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const resetReading = () => {
    setReadingMode(null);
    setPhase('selection');
    setSelectedCards([]);
    setSelectedIndices([]);
    setShuffledDeck([]);
    setQuestion('');
    setAiAnalysis('');
    setIsLoadingAnalysis(false);
    hasCalledApiRef.current = false;
    isPickingCardRef.current = false;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-white">
      <AnimatedBackground />
      <Sidebar />

      <main
        className={`flex-1 flex flex-col transition-all duration-200 relative z-10
          ${sidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[280px]'}
          ml-0`}
      >
        <ContentHeader
          title="Bói Bài Tarot"
          description="Khám phá định mệnh qua 78 lá bài huyền bí"
        >
          {phase !== 'selection' && phase !== 'reveal' && (
            <Button
              onClick={resetReading}
              variant="secondary"
              className="border-white/20 hover:bg-white/10 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Trải bài mới</span>
            </Button>
          )}
        </ContentHeader>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === 'selection' && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto"
              >
                <div className="text-center mb-8 md:mb-12 max-w-3xl">
                  <motion.div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 md:mb-6">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs md:text-sm font-medium text-purple-300">Khám Phá Vận Mệnh</span>
                  </motion.div>
                  <motion.h1 className="text-3xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Bói Bài Tarot
                  </motion.h1>
                  <p className="text-sm md:text-lg text-gray-400">Chọn phương thức bạn muốn và bắt đầu hành trình khám phá.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl w-full">
                  <ReadingOption
                    icon={<BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />}
                    title="Tổng Quan Ngày Mới"
                    desc="Xem vận mệnh trong ngày qua 3 lá bài."
                    color="purple"
                    onClick={() => startReading('overview')}
                  />
                  <ReadingOption
                    icon={<Search className="w-8 h-8 md:w-10 md:h-10 text-white" />}
                    title="Hỏi Đáp Cụ Thể"
                    desc="Đặt một câu hỏi cụ thể và nhận lời khuyên."
                    color="blue"
                    onClick={() => startReading('question')}
                  />
                </div>
              </motion.div>
            )}

            {phase === 'question_input' && (
              <motion.div
                key="question_input"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 flex items-center justify-center p-8 z-50"
              >
                <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 max-w-2xl w-full shadow-2xl">
                  <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Thông Điệp Từ Vũ Trụ
                  </h2>
                 
                  <div className="text-center mb-8">
                    <p className="text-gray-300 text-lg mb-2">
                      Bạn đang băn khoăn điều gì?
                    </p>
                    <p className="text-gray-500 text-sm italic">
                      "Hãy đặt câu hỏi cụ thể, tập trung vào 'Thế nào', 'Tại sao' hoặc 'Lời khuyên' thay vì câu hỏi Có/Không."
                    </p>
                  </div>

                  <form onSubmit={handleQuestionSubmit} className="space-y-6">
                    <div className="relative space-y-2">
                      <label className="text-sm font-medium text-blue-300 ml-1">Nội dung câu hỏi</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="VD: Chuyện tình cảm của tôi tháng này sẽ ra sao?"
                          className="w-full bg-white/5 border border-white/20 rounded-xl pl-6 pr-14 py-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={!question.trim()}
                          className={`
                            absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200
                            ${!question.trim()
                              ? 'text-gray-600 cursor-not-allowed'
                              : 'text-blue-400 hover:text-white hover:bg-blue-500/20 hover:scale-110 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                            }
                          `}
                        >
                        <Send className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs text-gray-500 ml-1">Gợi ý nhanh:</span>
                        <div className="flex flex-wrap gap-2">
                            {[
                                "Công việc sắp tới có thuận lợi không?",
                                "Người ấy đang nghĩ gì về tôi?",
                                "Lời khuyên cho tình hình tài chính hiện tại?",
                                "Tôi cần lưu ý điều gì trong tháng này?"
                            ].map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setQuestion(suggestion)}
                                    className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/50 transition-all text-gray-400 hover:text-blue-300 text-left"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                  </form>
                </div>
              </motion.div>
            )}

            {/* --- GIAO DIỆN CHỌN BÀI MỚI (GRID SYSTEM) --- */}
            {(phase === 'shuffling' || phase === 'picking') && (
              <motion.div
                key="deck"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* --- LỚP OVERLAY THÔNG TIN (Giữ nguyên của bản cũ) --- */}
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between h-full">
                  
                  {/* TOP: Tiêu đề & Bộ đếm */}
                  <div className="pt-4 px-4 w-full flex flex-col items-center bg-gradient-to-b from-black/90 via-black/50 to-transparent pb-8 md:pb-12">
                    {phase === 'shuffling' ? (
                       <div className="flex flex-col items-center gap-2">
                          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 animate-pulse text-center">
                            Vũ Trụ Đang Kết Nối...
                          </h2>
                          <div className="flex items-center gap-2 text-xs text-purple-200/70 font-medium tracking-widest uppercase">
                            <Sparkles className="w-3 h-3 animate-spin-slow" />
                            <span>Đang hòa trộn năng lượng</span>
                          </div>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center gap-3">
                          <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] text-center" style={{ fontFamily: 'Pacifico, cursive' }}>
                            {readingMode === 'question' ? 'Rút 1 Lá Bài' : 'Rút 3 Lá Bài'}
                          </h2>
                         
                          <div className="px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-3 pointer-events-auto">
                             <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">Tiến trình</span>
                             <div className="h-3 w-[1px] bg-white/20"></div>
                             <span className="text-lg font-bold text-blue-400 leading-none">
                                {selectedIndices.length} <span className="text-gray-500 text-sm font-normal">/ {readingMode === 'question' ? 1 : 3}</span>
                             </span>
                          </div>
                       </div>
                    )}
                  </div>

                  {/* BOTTOM: Hiển thị lại câu hỏi */}
                  <div className="w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-24 pb-8 px-4 flex justify-center">
                    {question && (
                      <div className="max-w-xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 relative shadow-2xl">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 rounded-full p-1.5 shadow-lg shadow-blue-600/40">
                             <Search className="w-3 h-3 text-white" />
                          </div>
                          <p className="text-white/90 text-base md:text-lg font-medium text-center italic break-words line-clamp-2 md:line-clamp-3">
                             "{question}"
                          </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* --- LỚP BÀI (Thay thế Canvas bằng CSS Grid Component) --- */}
                {/* overflow-y-auto và padding lớn để đảm bảo nội dung không bị overlay che mất */}
                <div className="w-full h-full absolute inset-0 z-10 overflow-y-auto pt-32 pb-32 no-scrollbar">
                   <div className="min-h-full flex items-center justify-center">
                    <TarotSceneNew
                      cards={shuffledDeck.length > 0 ? shuffledDeck : TAROT_DECK}
                      selectedCards={selectedCards}
                      pickedPositions={selectedIndices}
                      // Adapter: Chuyển đổi từ (index, card) về (index) cho khớp logic cũ
                      onCardClick={(index, card) => handleCardPick(index)}
                      isSelectable={phase === 'picking'}
                      phase={phase}
                    />
                   </div>
                </div>
              </motion.div>
            )}

            {phase === 'reveal' && (
              <motion.div key="reveal" className="absolute inset-0 overflow-y-auto p-4 md:p-8">
                <div className="max-w-6xl mx-auto pb-20">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Pacifico, cursive' }}>Kết Quả Trải Bài</h2>
                    {question && <p className="text-blue-300 italic">"{question}"</p>}
                  </div>

                  <div className={`grid grid-cols-1 ${selectedCards.length === 1 ? 'max-w-xs mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6 md:gap-8 mb-12`}>
                    {selectedCards.map((card, index) => (
                      <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10">
                        <div className="aspect-[2/3] bg-gray-900 rounded-xl mb-4 relative overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(card.suit)} opacity-20`} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <span className="text-3xl mb-2">{getSuitIcon(card.suit)}</span>
                            <h4 className="text-lg font-serif font-bold text-center">{card.name}</h4>
                          </div>
                          {card.isReversed && <div className="absolute top-2 right-2 bg-red-500 text-[10px] px-2 py-1 rounded-full">Ngược</div>}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{card.name}</h3>
                        <p className="text-xs text-gray-400 line-clamp-4">{card.isReversed ? card.meaning.reversed : card.meaning.upright}</p>
                      </motion.div>
                    ))}
                  </div>

                  {(isLoadingAnalysis || aiAnalysis) && (
                    <div className="bg-white/5 rounded-2xl p-4 md:p-8 border border-purple-500/20 shadow-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h3 className="text-xl md:text-2xl font-bold">Phân Tích AI</h3>
                      </div>
                      {isLoadingAnalysis ? (
                        <div className="flex items-center gap-3"><LoadingSpinner size="sm" /> <span>Đang phân tích...</span></div>
                      ) : (
                        <div className="text-sm md:text-base prose prose-invert max-w-none"><FormattedContent content={aiAnalysis} /></div>
                      )}
                    </div>
                  )}

                  <div className="mt-8 flex justify-center">
                    <Button onClick={resetReading} className="bg-purple-600 hover:bg-purple-500 px-8 py-4"><RotateCcw className="mr-2" /> Trải bài khác</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Helper Components & Functions ---
const ReadingOption = ({ icon, title, desc, color, onClick }: any) => {
  const colorMap: any = {
    purple: { gradient: "from-purple-500 to-indigo-600", border: "border-purple-500/20", text: "text-purple-300" },
    blue: { gradient: "from-blue-500 to-cyan-600", border: "border-blue-500/20", text: "text-blue-300" }
  };
  const colors = colorMap[color];

  return (
    <motion.div
      whileHover={{ y: -5 }} onClick={onClick}
      className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-10 border ${colors.border} cursor-pointer overflow-hidden`}
    >
      <div className={`w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6`}>{icon}</div>
      <h3 className="text-xl md:text-3xl font-bold mb-2">{title}</h3>
      <p className="text-xs md:text-base text-gray-400 mb-4">{desc}</p>
      <div className={`flex items-center gap-2 font-semibold ${colors.text} text-sm md:text-base`}>
        <span>Bắt đầu ngay</span> <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
};

function getCardGradient(suit: string | undefined) {
  switch (suit) {
    case 'wands': return 'from-orange-500 to-red-600';
    case 'cups': return 'from-blue-400 to-cyan-600';
    case 'swords': return 'from-gray-300 to-slate-500';
    case 'pentacles': return 'from-yellow-400 to-amber-600';
    default: return 'from-purple-500 to-indigo-600';
  }
}

function getSuitIcon(suit: string | undefined) {
  switch (suit) {
    case 'wands': return '🔥';
    case 'cups': return '🏆';
    case 'swords': return '⚔️';
    case 'pentacles': return '🪙';
    default: return '✨';
  }
}