import React from 'react';
import { cn } from '@/lib/utils';

interface ContentHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // Dùng cho nút bấm bên phải (ví dụ: Reset bài)
  className?: string;
}

export default function ContentHeader({ title, description, children, className }: ContentHeaderProps) {
  return (
    <div className={cn(
      // Key fix: h-20 (80px) để khớp với Sidebar sửa ở Bước 2
      "h-20 px-6 flex items-center justify-between flex-shrink-0", 
      "backdrop-blur-xl border-b border-white/10 bg-black/20 z-40",
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