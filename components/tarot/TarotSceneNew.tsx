'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard3DNew } from './TarotCard3DNew';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TarotSceneNewProps {
  cards: Array<any>;
  selectedCards: any[];
  pickedPositions: number[];
  onCardClick: (index: number, card: any) => void;
  isSelectable: boolean;
  phase: string;
}

export const TarotSceneNew: React.FC<TarotSceneNewProps> = ({
  cards,
  selectedCards,
  pickedPositions,
  onCardClick,
  isSelectable,
  phase
}) => {
  const fullDeck = cards.length >= 78 ? cards.slice(0, 78) : cards;
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // 3 Hàng
  const chunkSize = Math.ceil(fullDeck.length / 3);
  const rows = [
    fullDeck.slice(0, chunkSize),
    fullDeck.slice(chunkSize, chunkSize * 2),
    fullDeck.slice(chunkSize * 2)
  ];

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [phase]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = window.innerWidth * 0.6; 
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderRow = (rowCards: any[], rowIndex: number) => (
    <div className="flex items-center px-12 md:px-4 relative w-max mx-auto">
      {rowCards.map((card, idx) => {
        const actualIndex = (rowIndex * chunkSize) + idx;
        const isPicked = pickedPositions.includes(actualIndex);
        
        return (
          <div key={card.id || actualIndex}>
             <TarotCard3DNew
                card={card}
                index={idx} 
                totalIndex={actualIndex} 
                phase={phase}
                isRevealed={phase === 'reveal' && isPicked}
                isPicked={isPicked}
                isSelectable={isSelectable && !isPicked}
                onClick={() => onCardClick(actualIndex, card)}
                layoutId={`card-${actualIndex}`}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative group">
      
      {/* NÚT TRÁI */}
      <AnimatePresence>
        {phase === 'picking' && showLeftArrow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black/80 to-transparent z-40 flex items-center justify-start pl-4 pointer-events-none">
            <button onClick={() => scroll('left')} className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-purple-500/50 border border-white/20 backdrop-blur-md text-white shadow-2xl transition-all hover:scale-110"><ChevronLeft className="w-8 h-8" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NÚT PHẢI */}
      <AnimatePresence>
        {phase === 'picking' && showRightArrow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/80 to-transparent z-40 flex items-center justify-end pr-4 pointer-events-none">
            <button onClick={() => scroll('right')} className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-purple-500/50 border border-white/20 backdrop-blur-md text-white shadow-2xl transition-all hover:scale-110"><ChevronRight className="w-8 h-8" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        ref={containerRef}
        onScroll={checkScroll}
        layout
        className="w-full h-[60vh] md:h-[80vh] overflow-x-auto overflow-y-hidden no-scrollbar flex flex-col justify-center transition-all duration-700"
      >
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        <div className="flex flex-col gap-6 md:gap-10 items-start min-w-full px-4 md:px-12">
            {rows.map((row, i) => (
                <React.Fragment key={i}>
                    {renderRow(row, i)}
                </React.Fragment>
            ))}
        </div>
      </motion.div>
    </div>
  );
};