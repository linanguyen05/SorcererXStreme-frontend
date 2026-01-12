'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TarotCard3DNewProps {
  card: { id: number; name: string; meaning: { upright: string; reversed: string; }; image?: string; suit?: string; };
  index: number;      
  totalIndex: number; 
  phase: string;
  isRevealed: boolean;
  isPicked: boolean;
  isSelectable: boolean;
  onClick?: () => void;
  layoutId?: string;
}

export const TarotCard3DNew: React.FC<TarotCard3DNewProps> = ({
  card,
  index,
  totalIndex,
  phase,
  isRevealed,
  isPicked,
  isSelectable,
  onClick,
  layoutId
}) => {
  
  const isFirstInRow = index === 0; 
  const overlapClass = (phase === 'picking' && !isFirstInRow) ? '-ml-10 md:-ml-12 lg:-ml-14' : '';

  // Class cho lá bài đã chọn:
  // - brightness-75 (tối nhẹ, không đen kịt)
  // - ring-2 ring-yellow-400 (viền vàng)
  // - shadow-yellow (phát sáng vàng)
  const pickedClass = isPicked 
    ? 'brightness-75 contrast-125 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] translate-y-2 pointer-events-none' 
    : '';

  const variants = {
    // HIỆU ỨNG CHIA BÀI (Dealing)
    picking: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring', 
        damping: 20, 
        stiffness: 100,
        delay: totalIndex * 0.015 // Tạo hiệu ứng bài bay ra lần lượt
      }
    }
  };

  return (
    <motion.div
      layoutId={layoutId}
      className={`
        relative cursor-pointer perspective-1000 flex-shrink-0
        w-[80px] h-[120px] md:w-[100px] md:h-[150px] 
        ${overlapClass}
        ${pickedClass}
      `}
    
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      variants={variants}
      animate="picking"
      
      whileHover={isSelectable && phase === 'picking' ? { 
        y: -40, 
        marginRight: 60,
        marginLeft: 60,
        scale: 1.3,
        zIndex: 1000,
        transition: { duration: 0.2, ease: "easeOut" }
      } : {}}
      
      whileTap={isSelectable ? { scale: 0.95 } : {}}
      onClick={isSelectable ? onClick : undefined}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-700"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
      >
        <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden border border-white/20 shadow-xl z-10 group bg-[#1e1b4b]">
            <div className="w-full h-full relative flex items-center justify-center">
                <div className="absolute inset-1 border border-yellow-600/30 rounded-md"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
                <div className="w-8 h-8 rounded-full bg-black/60 border border-yellow-500/50 flex items-center justify-center backdrop-blur-md z-20 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
        </div>

        <div 
          className="absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-slate-900 border border-yellow-500 shadow-2xl"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-black"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-2 text-center">
             <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-1 shadow-md">
                <span className="text-[9px] font-bold text-black font-serif">{totalIndex + 1}</span>
             </div>
            <h3 className="text-[10px] font-bold text-yellow-100 uppercase border-b border-white/10 pb-0.5 mb-1 line-clamp-1">{card.name}</h3>
            <p className="text-[7px] text-gray-300 line-clamp-3 leading-tight px-0.5">{card.meaning.upright}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};