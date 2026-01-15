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
      // // Key fix: h-20 (80px) để khớp với Sidebar sửa ở Bước 2
      // MOBILE: Căn giữa toàn bộ
      // "flex flex-col items-center text-center gap-4 py-8 px-6 mb-8", 
      "h-20 px-6 flex items-center justify-between flex-shrink-0", 
      "backdrop-blur-xl border-b border-white/10 bg-black/20 z-40",
      className
      // MOBILE: Căn giữa toàn bộ
      // "flex flex-col items-center text-center gap-4 py-8 px-6 mb-8", 

      // // LAPTOP (md): Reset về căn trái, dàn hàng ngang 2 đầu
      // "md:flex-row md:justify-between md:items-center md:text-left md:h-20 md:py-0 md:px-8 md:mb-0",

      // "backdrop-blur-xl border-b border-white/10 bg-black/20 z-40 flex-shrink-0 w-full",
      // className
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

    // <div className={cn(
    //   // MOBILE: h-auto để nội dung giãn nở, py-5 để thoáng, bám lề trái (items-start)
    //   "flex flex-col items-start justify-start gap-4 py-5 px-5 sm:px-6 w-full mb-6",

    //   // LAPTOP (md): h-20 cố định, quay lại dàn hàng ngang (flex-row)
    //   "md:flex-row md:items-center md:justify-between md:h-20 md:py-0 md:mb-0",

    //   "backdrop-blur-xl border-b border-white/10 bg-black/20 z-40 flex-shrink-0",
    //   className
    // )}>
    //   {/* Khối Text: Luôn bám lề trái trên mọi thiết bị */}
    //   <div className="flex flex-col">
    //     <h1
    //       className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
    //       style={{ fontFamily: 'Pacifico, cursive' }}
    //     >
    //       {title}
    //     </h1>
    //     {description && (
    //       <p className="text-xs sm:text-sm text-gray-400 font-light mt-1">
    //         {description}
    //       </p>
    //     )}
    //   </div>

    //   {/* Khối Children: Tự động xuống hàng trên mobile, nằm bên phải trên laptop */}
    //   {children && (
    //     <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
    //       {children}
    //     </div>
    //   )}
    // </div>

    // <div className={cn(
    //   // MOBILE: Cho phép giãn nở tự nhiên, bám lề trái (items-start), tăng padding để làm nổi bật tiêu đề
    //   "flex flex-col items-start gap-4 p-5 sm:p-6 w-full mb-6",

    //   // LAPTOP (md): Quay lại dàn hàng ngang truyền thống, bám giữa trục dọc
    //   "md:flex-row md:items-center md:justify-between md:h-20 md:py-0 md:px-8 md:mb-0",

    //   "backdrop-blur-xl border-b border-white/10 bg-black/20 z-40 flex-shrink-0",
    //   className
    // )}>
    //   {/* Phần Text: Cố định bên trái */}
    //   <div className="flex flex-col space-y-1">
    //     <h1
    //       className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
    //       style={{ fontFamily: 'Pacifico, cursive' }}
    //     >
    //       {title}
    //     </h1>
    //     {description && (
    //       <p className="text-xs sm:text-sm text-gray-400 font-light leading-tight">
    //         {description}
    //       </p>
    //     )}
    //   </div>

    //   {/* Phần Children: Tự động nằm dưới tiêu đề trên mobile, nằm bên phải trên laptop */}
    //   {children && (
    //     <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
    //       {/* Mẹo: w-full giúp các nút bấm có không gian dàn trải trên mobile. 
    //      overflow-x-auto cho phép vuốt ngang nếu bạn có quá nhiều nút.
    //   */}
    //       {children}
    //     </div>
    //   )}
    // </div>
  );
}