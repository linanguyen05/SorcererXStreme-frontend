'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, // Không set default text ở đây nữa
  className,
  color = 'border-t-red-500' // Màu mặc định
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${text ? 'space-y-3' : ''} ${className ?? ''}`}>
      <motion.div
        className={`${sizes[size]} border-gray-700/50 rounded-full ${color}`}
        style={{ borderTopColor: 'currentColor' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <p className="text-sm font-medium text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
};