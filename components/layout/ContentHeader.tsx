import React from 'react';
import { cn } from '@/lib/utils';

interface ContentHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function ContentHeader({ title, description, children, className }: ContentHeaderProps) {
  return (
    <div className={cn(
      // MOBILE: Căn giữa toàn bộ
      "flex flex-col items-center text-center gap-4 py-8 px-6 mb-8", 
      // LAPTOP (md): Reset về căn trái, dàn hàng ngang 2 đầu
      "md:flex-row md:justify-between md:items-center md:text-left md:h-20 md:py-0 md:pl-20 md:mb-0",
      "backdrop-blur-xl border-b border-white/10 bg-black/20 z-40 flex-shrink-0 w-full",
      className
    )}>
      <div>
        <h1 
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent" 
          style={{ fontFamily: 'Pacifico, cursive' }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-400 font-light mt-0.5">{description}</p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
