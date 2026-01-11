'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean; 
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 whitespace-nowrap cursor-pointer font-['Be_Vietnam_Pro']";
  
  const variants = {
    primary: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 border border-red-500/20",
    secondary: "bg-gray-800/60 backdrop-blur-xl text-gray-100 hover:bg-gray-700/60 border border-gray-600/30 shadow-lg",
    ghost: "text-gray-300 hover:text-white hover:bg-gray-800/30 border border-transparent"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: (disabled || isLoading) ? 1 : 1.02 }} // Không scale khi loading/disabled
      whileTap={{ scale: (disabled || isLoading) ? 1 : 0.98 }}
      disabled={disabled || isLoading} // Tự động disable khi loading
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && "opacity-70 cursor-not-allowed grayscale-[0.2]", // Hiệu ứng mờ khi loading
        className
      )}
      {...(props as any)}
    >
      {/* Logic hiển thị Spinner tự động */}
      {isLoading && (
        <span className="mr-2">
           <LoadingSpinner size="sm" />
        </span>
      )}
      {children}
    </motion.button>
  );
};