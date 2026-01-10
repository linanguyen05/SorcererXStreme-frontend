'use client';

import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Text, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Heart, Search, BookOpen, Send, Sparkles } from 'lucide-react';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FormattedContent } from '@/components/ui/FormattedContent';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { TAROT_DECK, TarotCard } from '@/lib/tarotData';
import * as THREE from 'three';
import ContentHeader from '@/components/layout/ContentHeader';

// Types
type ReadingMode = 'overview' | 'question' | null;
type ReadingPhase = 'selection' | 'question_input' | 'shuffling' | 'picking' | 'reveal';

// 3D Card Component
const Card3D = ({
  position,
  rotation,
  onClick,
  hovered,
  setHover,
  index,
  phase,
  isSelected
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  onClick?: () => void;
  hovered?: boolean;
  setHover?: (h: boolean) => void;
  index: number;
  phase: ReadingPhase;
  isSelected: boolean;
}) => {
  const mesh = useRef<THREE.Group>(null);
  // Load texture
  const texture = useTexture('/tarot/card_back.png');

  // Smooth animation for position and rotation
  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Slower damp for smoother, heavier feel
    const damp = 3;

    // Target scale
    const targetScale = hovered || isSelected ? 1.15 : 1;

    // Lerp position
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, position[0], delta * damp);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, position[1], delta * damp);
    mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, position[2], delta * damp);

    // Lerp rotation
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, rotation[0], delta * damp);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, rotation[1], delta * damp);
    mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, rotation[2], delta * damp);

    // Lerp scale
    mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, targetScale, delta * damp);
    mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, targetScale, delta * damp);
    mesh.current.scale.z = THREE.MathUtils.lerp(mesh.current.scale.z, targetScale, delta * damp);
  });

  return (
    <group
      ref={mesh}
      onClick={onClick}
      onPointerOver={() => setHover && setHover(true)}
      onPointerOut={() => setHover && setHover(false)}
    >
      {/* Card Body (Thickness) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 3.5, 0.02]} />
        <meshStandardMaterial
          color="#1e1b4b" // Dark indigo side
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Card Back with Texture */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[1.9, 3.4]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.4}
          metalness={0.2}
          emissive="#4c1d95"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Gold Border */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2, 3.5]} />
        <meshStandardMaterial
          color="#fbbf24" // Gold
          roughness={0.2}
          metalness={1}
        />
      </mesh>

      {/* Selection Glow */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[2.2, 3.7]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
};

// Scene Controller for managing card positions
const TarotScene = ({
  phase,
  onCardPick,
  selectedIndices
}: {
  phase: ReadingPhase;
  onCardPick: (index: number) => void;
  selectedIndices: number[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate positions based on phase
  const cards = useMemo(() => {
    // 20 cards for display
    return Array.from({ length: 20 }).map((_, i) => {
      let pos: [number, number, number] = [0, 0, -10];
      let rot: [number, number, number] = [0, 0, 0];

      if (phase === 'shuffling') {
        // Gentle floating stack
        const time = Date.now() * 0.001;
        // Cards float in a loose stack
        pos = [
          Math.sin(time + i * 0.1) * 0.5, // Slight X wobble
          Math.cos(time * 0.8 + i * 0.1) * 0.5, // Slight Y wobble
          i * 0.02 // Stacked in Z
        ];
        // Very slight rotation
        rot = [0, 0, Math.sin(time * 0.5 + i * 0.1) * 0.1];

      } else if (phase === 'picking') {
        // Clean horizontal arc (Fan)
        const totalCards = 20;
        const width = 14; // Total width of the spread
        const x = (i - (totalCards - 1) / 2) * (width / totalCards);

        // Arch effect
        const y = -Math.pow(x * 0.15, 2) + 1; // Parabola for gentle arc

        const isSelected = selectedIndices.includes(i);
        const isHovered = hoveredIndex === i;

        pos = [
          x,
          y,
          isSelected ? 2 : (isHovered ? 0.5 : i * 0.01) // Bring forward if selected/hovered
        ];

        if (isSelected) {
          pos[1] += 1; // Move up
        }

        if (isHovered && !isSelected) {
          pos[1] += 0.5; // Slight lift on hover
          pos[2] = 1; // Ensure it pops over neighbors
        }

        // Slight rotation to face center, but keep it readable
        // If hovered, straighten it out
        rot = [0, 0, isHovered ? 0 : -x * 0.05];
      }

      return { pos, rot };
    });
  }, [phase, hoveredIndex, selectedIndices]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {cards.map((card, i) => (
        <Card3D
          key={i}
          index={i}
          phase={phase}
          position={card.pos}
          rotation={card.rot}
          hovered={hoveredIndex === i}
          setHover={(h) => setHoveredIndex(h ? i : null)}
          onClick={() => phase === 'picking' && onCardPick(i)}
          isSelected={selectedIndices.includes(i)}
        />
      ))}
    </>
  );
};

export default function TarotPage() {
  const { isAuthenticated, user, token } = useAuthStore();
  const sidebarCollapsed = useSidebarCollapsed();
  const [readingMode, setReadingMode] = useState<ReadingMode>(null);
  const [phase, setPhase] = useState<ReadingPhase>('selection');
  const [selectedCards, setSelectedCards] = useState<(TarotCard & { isReversed: boolean })[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]); // Deck đã shuffle
  const [question, setQuestion] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const hasCalledApiRef = useRef(false); // Track để tránh gọi API nhiều lần
  const isPickingCardRef = useRef(false); // Track để tránh pick nhiều cards cùng lúc

  const startReading = (mode: ReadingMode) => {
    setReadingMode(mode);
    if (mode === 'question') {
      setPhase('question_input');
    } else {
      beginShuffling();
    }
  };

  const beginShuffling = () => {
    // Shuffle deck một lần duy nhất
    const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
    setShuffledDeck(shuffled);
    setPhase('shuffling');
    // Shuffle animation duration
    setTimeout(() => {
      setPhase('picking');
    }, 3000);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    beginShuffling();
  };

  const handleCardPick = async (index: number) => {
    // Ngăn chọn card khi đang loading hoặc đang pick
    if (isLoadingAnalysis || isPickingCardRef.current) return;
    
    // Xác định số lá bài cần chọn dựa trên mode
    const requiredCards = readingMode === 'question' ? 1 : 3;
    
    if (selectedIndices.length >= requiredCards || selectedIndices.includes(index)) return;

    // Set flag để prevent multiple picks
    isPickingCardRef.current = true;

    const newIndices = [...selectedIndices, index];
    setSelectedIndices(newIndices);

    // Lấy lá bài từ shuffled deck theo index đã chọn
    const pickedCard = shuffledDeck[index];
    const isReversed = Math.random() > 0.8; // 20% chance reversed

    const newCard = { ...pickedCard, isReversed } as TarotCard & { isReversed: boolean };
    const newSelectedCards = [...selectedCards, newCard];
    setSelectedCards(newSelectedCards);

    // Khi đã chọn đủ số lá bài yêu cầu
    if (newIndices.length === requiredCards) {
      // Reset ref khi bắt đầu reading mới
      hasCalledApiRef.current = false;
      
      setTimeout(async () => {
        setPhase('reveal');
        
        // Chỉ gọi API nếu chưa gọi lần nào
        if (!hasCalledApiRef.current) {
          hasCalledApiRef.current = true;
          await fetchTarotAnalysis(newSelectedCards);
        }
        
        // Reset picking flag after analysis
        isPickingCardRef.current = false;
      }, 1500);
    } else {
      // Reset picking flag if not done yet
      setTimeout(() => {
        isPickingCardRef.current = false;
      }, 500);
    }
  };

  const fetchTarotAnalysis = async (cards: (TarotCard & { isReversed: boolean })[]) => {
    if (!token || !user) return;
    
    // Ngăn gọi API nhiều lần
    if (isLoadingAnalysis) return;

    setIsLoadingAnalysis(true);

    try {
      const featureType = readingMode === 'question' ? 'question' : 'overview';
      
      // Xác định endpoint dựa vào feature_type
      const endpoint = featureType === 'question' 
        ? '/api/tarot/question' 
        : '/api/tarot/overview';
      
      const cardsDrawn = cards.map((card, index) => ({
        card_name: card.name,
        is_upright: !card.isReversed,
        // Position chỉ cần cho overview (3 lá)
        ...(featureType === 'overview' && {
          position: index === 0 ? 'past' : index === 1 ? 'present' : 'future'
        })
      }));

      const requestBody: any = {
        domain: 'tarot',
        feature_type: featureType,
        user_context: {
          name: user.name || 'User',
          gender: user.gender || 'other',
          birth_date: user.birth_date || '2000-01-01'
        },
        data: {
          cards_drawn: cardsDrawn
        }
      };

      // Thêm question nếu là question mode
      if (featureType === 'question' && question) {
        requestBody.data.question = question;
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
        console.error('Tarot API error:', errorData);

        if (response.status === 403 && errorData.error === 'LIMIT_REACHED') {
          setAiAnalysis(
            `⚠️ **Đã hết lượt sử dụng**\n\n` +
            `Bạn đã dùng hết ${errorData.currentUsage}/${errorData.limit} lượt cho tính năng này.\n\n` +
            `Nâng cấp lên **${errorData.tier === 'FREE' ? 'PREMIUM' : 'ULTIMATE'}** để tiếp tục sử dụng!`
          );
          setIsLoadingAnalysis(false);
          return;
        }

        if (response.status === 500) {
          const errorMsg = errorData.message || errorData.error || 'Internal server error';
          setAiAnalysis(
            `❌ **Lỗi 500 - Lỗi Server**\n\n` +
            `${errorMsg}\n\n` +
            `Backend đang gặp sự cố kết nối với AI Service. Vui lòng thử lại sau hoặc liên hệ admin.\n\n` +
            `_Chi tiết: ${JSON.stringify(errorData, null, 2)}_`
          );
          setIsLoadingAnalysis(false);
          return;
        }

        throw new Error(errorData.message || 'Không thể lấy phân tích tarot');
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
        
        setAiAnalysis(analysisText);
      } else {
        console.error('No analysis found in response:', data);
        setAiAnalysis('AI không trả lời được. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Error fetching tarot analysis:', error);
      setAiAnalysis(`❌ Lỗi: ${error.message || 'Không thể kết nối với server'}`);
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
    hasCalledApiRef.current = false; // Reset ref
    isPickingCardRef.current = false; // Reset picking flag
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
        {/* Header */}
        <ContentHeader 
          title="Bói Bài Tarot" 
          description="Khám phá định mệnh qua 78 lá bài huyền bí"
        >
          {phase !== 'selection' && (
            <Button
              onClick={resetReading}
              variant="secondary"
              className="border-white/20 hover:bg-white/10 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Trải bài mới
            </Button>
          )}
        </ContentHeader>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === 'selection' && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                {/* Hero Section */}
                <div className="text-center mb-12 max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">Khám Phá Vận Mệnh</span>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                  >
                    Bói Bài Tarot
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-gray-400 leading-relaxed"
                  >
                    Để AI giải mã thông điệp từ vũ trụ qua các lá bài Tarot bí ẩn.<br />
                    Chọn phương thức bạn muốn và bắt đầu hành trình khám phá.
                  </motion.p>
                </div>

                {/* Cards - Centered and Larger */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                  {/* Daily Reading */}
                  <ReadingOption
                    icon={<BookOpen className="w-10 h-10 text-white" />}
                    title="Tổng Quan Ngày Mới"
                    desc="Xem vận mệnh, công việc và tình cảm trong ngày của bạn qua 3 lá bài."
                    color="purple"
                    onClick={() => startReading('overview')}
                  />
                  {/* Question Reading */}
                  <ReadingOption
                    icon={<Search className="w-10 h-10 text-white" />}
                    title="Hỏi Đáp Cụ Thể"
                    desc="Đặt một câu hỏi cụ thể và nhận lời khuyên từ những lá bài Tarot."
                    color="blue"
                    onClick={() => startReading('question')}
                  />
                </div>

                {/* Decorative Elements */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-12 flex items-center gap-8 text-sm text-gray-500"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span>78 Lá Bài</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <span>AI Phân Tích</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: '1s' }} />
                    <span>Kết Quả Chính Xác</span>
                  </div>
                </motion.div>
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
                  
                  {/* UX Improvement: Hướng dẫn rõ ràng hơn */}
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
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                      </div>
                    </div>

                    {/* UX Improvement: Thêm gợi ý câu hỏi (Chips) */}
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

                    <div className="flex justify-center pt-2">
                      <Button
                        type="submit"
                        disabled={!question.trim()}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-lg font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Bắt đầu trải bài <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {(phase === 'shuffling' || phase === 'picking') && (
              <motion.div
                key="deck"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* --- FIX UI FINAL: Giữ bài nguyên vị trí, Đẩy Text lên cao 1cm --- */}
                
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between h-full">
                  
                  {/* TOP: Tiêu đề & Bộ đếm */}
                  {/* pt-8 (32px): Đẩy sát lên trên (Cao hơn bản cũ ~1.2cm), đảm bảo an toàn */}
                  <div className="pt-8 px-4 w-full flex flex-col items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-12">
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
                          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] text-center" style={{ fontFamily: 'Pacifico, cursive' }}>
                            {readingMode === 'question' ? 'Rút 1 Lá Bài' : 'Rút 3 Lá Bài'}
                          </h2>
                          
                          <div className="px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-3">
                             <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">Tiến trình</span>
                             <div className="h-3 w-[1px] bg-white/20"></div>
                             <span className="text-lg font-bold text-blue-400 leading-none">
                                {selectedIndices.length} <span className="text-gray-500 text-sm font-normal">/ {readingMode === 'question' ? 1 : 3}</span>
                             </span>
                          </div>
                       </div>
                    )}
                  </div>

                  {/* BOTTOM: Câu hỏi (Giữ nguyên vị trí đẹp ở đáy) */}
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

                {/* LAYER 3D: Camera giữ nguyên [0, 0, 12] như ý bạn */}
                <div className="w-full h-full absolute inset-0 z-10">
                  <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                    <TarotScene
                      phase={phase}
                      onCardPick={handleCardPick}
                      selectedIndices={selectedIndices}
                    />
                  </Canvas>
                </div>
              </motion.div>
            )}

            {phase === 'reveal' && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 overflow-auto p-8"
              >
                <div className="max-w-6xl mx-auto pb-20">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Pacifico, cursive' }}>
                      Kết Quả Trải Bài
                    </h2>
                    {question && (
                      <div className="inline-block bg-blue-500/10 border border-blue-500/20 px-8 py-4 rounded-2xl backdrop-blur-sm">
                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Câu hỏi của bạn</p>
                        <p className="text-xl text-blue-300 font-medium italic">"{question}"</p>
                      </div>
                    )}
                  </div>

                  <div className={`grid grid-cols-1 ${selectedCards.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : 'md:grid-cols-3'} gap-8 mb-12`}>
                    {selectedCards.map((card, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50, rotateY: 90 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        transition={{ delay: index * 0.3, duration: 0.8, type: "spring" }}
                        className="relative group perspective"
                      >
                        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all shadow-2xl">
                          {/* Card Image Placeholder */}
                          <div className="aspect-[2/3] bg-gray-900 rounded-xl mb-6 relative overflow-hidden shadow-inner border border-white/5 group-hover:shadow-purple-500/20 transition-all">
                            <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(card.suit)} opacity-20`} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                              <span className="text-4xl mb-2">{getSuitIcon(card.suit)}</span>
                              <h4 className="text-xl font-serif font-bold text-white/90">{card.name}</h4>
                              {card.image && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <span className="text-xs text-white">Image Placeholder</span>
                                </div>
                              )}
                            </div>

                            {/* Reversed Label */}
                            {/* @ts-ignore */}
                            {card.isReversed && (
                              <div className="absolute top-2 right-2 bg-red-500/80 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                                Ngược
                              </div>
                            )}
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            {card.name}
                          </h3>

                          <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                            <div className="p-3 bg-white/5 rounded-lg">
                              <span className="text-purple-400 font-semibold block mb-1 uppercase text-xs tracking-wider">Ý nghĩa chung</span>
                              {/* @ts-ignore */}
                              {card.isReversed ? card.meaning.reversed : card.meaning.upright}
                            </div>
                            {readingMode === 'overview' && (
                              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <span className="text-blue-400 font-semibold block mb-1 uppercase text-xs tracking-wider">Công việc</span>
                                {card.meaning.career}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* AI Analysis Section */}
                  {(isLoadingAnalysis || aiAnalysis) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="mb-12 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        <h3 className="text-2xl font-bold text-white">Phân Tích Chuyên Sâu từ AI</h3>
                      </div>
                      {isLoadingAnalysis ? (
                        <div className="flex items-center justify-center py-8">
                          <LoadingSpinner size="md" />
                          <span className="ml-3 text-gray-300">AI đang phân tích lá bài của bạn...</span>
                        </div>
                      ) : (
                        <div className="prose prose-invert max-w-none">
                          <FormattedContent content={aiAnalysis} />
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="flex justify-center">
                    <Button
                      onClick={resetReading}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-500/20 text-lg font-medium transition-all hover:scale-105"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Trải bài khác
                    </Button>
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

// Helper Components & Functions

const ReadingOption = ({ icon, title, desc, color, onClick }: any) => {
  const colorMap: any = {
    purple: {
      gradient: "from-purple-500 to-indigo-600",
      border: "border-purple-500/20 hover:border-purple-500/50",
      shadow: "shadow-lg shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/40",
      text: "text-purple-300",
      glow: "group-hover:shadow-[0_0_50px_rgba(168,85,247,0.3)]"
    },
    blue: {
      gradient: "from-blue-500 to-cyan-600",
      border: "border-blue-500/20 hover:border-blue-500/50",
      shadow: "shadow-lg shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40",
      text: "text-blue-300",
      glow: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]"
    },
    pink: {
      gradient: "from-pink-500 to-rose-600",
      border: "border-pink-500/20 hover:border-pink-500/50",
      shadow: "shadow-lg shadow-pink-500/20 hover:shadow-2xl hover:shadow-pink-500/40",
      text: "text-pink-300",
      glow: "group-hover:shadow-[0_0_50px_rgba(236,72,153,0.3)]"
    }
  };

  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, translateY: -8 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-10 border ${colors.border} ${colors.shadow} ${colors.glow} transition-all duration-500 cursor-pointer overflow-hidden`}
      onClick={onClick}
    >
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
      
      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1.5s_ease-in-out] skew-x-12" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon */}
        <div className={`w-20 h-20 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl ${colors.shadow} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-400 text-base leading-relaxed mb-6 flex-grow">
          {desc}
        </p>
        
        {/* CTA */}
        <div className={`flex items-center justify-between font-semibold ${colors.text} group-hover:gap-3 transition-all duration-300`}>
          <span>Bắt đầu ngay</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>

      {/* Corner Accent */}
      <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${colors.gradient} opacity-10 blur-xl group-hover:opacity-30 transition-opacity duration-500`} />
    </motion.div>
  );
};

function getCardGradient(suit: string | undefined) {
  switch (suit) {
    case 'wands': return 'from-orange-500 to-red-600';
    case 'cups': return 'from-blue-400 to-cyan-600';
    case 'swords': return 'from-gray-300 to-slate-500';
    case 'pentacles': return 'from-yellow-400 to-amber-600';
    default: return 'from-purple-500 to-indigo-600'; // Major
  }
}

function getSuitIcon(suit: string | undefined) {
  switch (suit) {
    case 'wands': return '🔥';
    case 'cups': return '🏆';
    case 'swords': return '⚔️';
    case 'pentacles': return '🪙';
    default: return '✨'; // Major
  }
}
