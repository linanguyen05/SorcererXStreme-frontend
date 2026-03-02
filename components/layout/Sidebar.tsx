// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import {
//   Home,
//   MessageCircle,
//   Sparkles,
//   Star,
//   Moon,
//   Hash,
//   LogOut,
//   User,
//   Settings,
//   Crown,
//   ChevronLeft,
//   ChevronRight,
//   Menu
// } from 'lucide-react';
// import { useAuthStore } from '@/lib/store';
// import { cn } from '@/lib/utils';
// import { VIPBadge } from '@/components/ui/VIPBadge';
// import { VIPTier } from '@/lib/vip-types';

// // Create a global state for sidebar collapse with localStorage persistence
// const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed';
// let sidebarCollapsedState = false;
// const sidebarListeners: Array<(collapsed: boolean) => void> = [];

// // Initialize from localStorage on client side
// if (typeof window !== 'undefined') {
//   const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
//   sidebarCollapsedState = stored ? JSON.parse(stored) : false;
// }

// export const useSidebarCollapsed = () => {
//   const [isCollapsed, setIsCollapsed] = useState(sidebarCollapsedState);

//   useEffect(() => {
//     const listener = (collapsed: boolean) => setIsCollapsed(collapsed);
//     sidebarListeners.push(listener);
//     return () => {
//       const index = sidebarListeners.indexOf(listener);
//       if (index > -1) sidebarListeners.splice(index, 1);
//     };
//   }, []);

//   return isCollapsed;
// };

// const notifySidebarListeners = (collapsed: boolean) => {
//   sidebarCollapsedState = collapsed;
//   if (typeof window !== 'undefined') {
//     localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(collapsed));
//   }
//   sidebarListeners.forEach(listener => listener(collapsed));
// };

// const navigationItems = [
//   {
//     name: 'Dashboard',
//     href: '/dashboard',
//     icon: Home
//   },
//   {
//     name: 'AI Chat',
//     href: '/chat',
//     icon: MessageCircle
//   },
//   {
//     name: 'Tarot',
//     href: '/tarot',
//     icon: Sparkles
//   },
//   {
//     // name: 'Chiêm Tinh',
//     name: 'Cung Hoàng Đạo',
//     href: '/astrology',
//     icon: Star
//   },
//   {
//     name: 'Tử Vi',
//     href: '/fortune',
//     icon: Moon
//   },
//   {
//     name: 'Thần Số Học',
//     href: '/numerology',
//     icon: Hash
//   },
//   {
//     name: 'Hồ Sơ',
//     href: '/profile',
//     icon: Settings
//   }
// ];

// export const Sidebar = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { user, logout } = useAuthStore();
//   const [isCollapsed, setIsCollapsed] = useState(() => {
//     // Initialize from localStorage or default to false
//     if (typeof window !== 'undefined') {
//       const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
//       return stored ? JSON.parse(stored) : false;
//     }
//     return false;
//   });
//   const [isMobile, setIsMobile] = useState(false);

//   // Check if user is VIP - check both is_vip flag and vipTier
//   const isVIP = user?.is_vip === true || user?.vipTier === VIPTier.VIP || user?.vipTier === 'VIP' || user?.vipTier === 'PREMIUM' || user?.vipTier === 'ULTIMATE';
//   const vipExpiresAt = user?.vipExpiresAt ? new Date(user.vipExpiresAt) : null;

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);

//       // On mobile, always collapse. On desktop, keep user's preference
//       if (mobile && !isCollapsed) {
//         const newCollapsed = true;
//         setIsCollapsed(newCollapsed);
//         notifySidebarListeners(newCollapsed);
//       }
//     };

//     // Initial check
//     handleResize();

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [isCollapsed]);

//   const handleLogout = () => {
//     logout();
//     router.push('/auth/login');
//   };

//   const toggleSidebar = () => {
//     const newCollapsed = !isCollapsed;
//     setIsCollapsed(newCollapsed);
//     notifySidebarListeners(newCollapsed);
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ width: isCollapsed ? 80 : 280 }}
//         animate={{ width: isCollapsed ? 80 : 280 }}
//         transition={{ duration: 0.2, ease: "easeInOut" }}
//         className={cn(
//           "h-screen backdrop-blur-xl border-r flex flex-col shadow-2xl fixed left-0 top-0",
//           isVIP
//             ? "bg-black/80 border-yellow-500/20 shadow-yellow-500/10"
//             : "bg-black/80 border-white/10",
//           isMobile && isCollapsed ? "-translate-x-full" : "z-40"
//         )}
//         style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}
//       >
//         {/* Header with Toggle Button */}
//         <div className={cn(
//           "px-6 py-7 border-b flex-shrink-0 flex items-center justify-between",
//           isVIP ? "border-yellow-500/20" : "border-white/10"
//         )}>
//           {!isCollapsed && (
//             <Link href="/" className="flex items-center gap-3 overflow-hidden flex-1">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key="expanded-logo"
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   className="flex flex-col overflow-hidden whitespace-nowrap"
//                 >
//                   <h1 className={cn(
//                     "text-xl font-bold bg-clip-text text-transparent leading-tight",
//                     isVIP
//                       ? "bg-gradient-to-r from-yellow-400 via-yellow-200 to-amber-400"
//                       : "bg-gradient-to-r from-white via-purple-200 to-white"
//                   )} style={{ fontFamily: 'Pacifico, cursive' }}>
//                     SorcererXStreme
//                   </h1>
//                   <p className={cn(
//                     "text-[10px] tracking-widest font-medium uppercase",
//                     isVIP ? "text-yellow-500" : "text-gray-400"
//                   )}>
//                     Huyền Thuật AI
//                   </p>
//                 </motion.div>
//               </AnimatePresence>
//             </Link>
//           )}

//           {/* Toggle Button in Header */}
//           <button
//             onClick={toggleSidebar}
//             className={cn(
//               "p-2 rounded-lg flex items-center justify-center border transition-all duration-200 flex-shrink-0",
//               isVIP
//                 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20"
//                 : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
//             )}
//           >
//             {isMobile ? (
//               <Menu className="w-5 h-5" />
//             ) : (
//               isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
//             )}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
//           <div className="space-y-1">
//             {navigationItems.map((item, index) => {
//               const Icon = item.icon;
//               const isActive = pathname === item.href;

//               return (
//                 <Link key={item.href} href={item.href}>
//                   <motion.div
//                     whileHover={{ x: isCollapsed ? 0 : 4, scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className={cn(
//                       "flex items-center px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden mb-1",
//                       isCollapsed ? "justify-center" : "space-x-3",
//                       isActive
//                         ? isVIP
//                           ? "bg-gradient-to-r from-yellow-500/20 to-amber-600/10 text-yellow-100 border border-yellow-500/30"
//                           : "bg-white/10 text-white border border-white/20"
//                         : "text-gray-400 hover:text-white hover:bg-white/5"
//                     )}
//                     title={isCollapsed ? item.name : undefined}
//                   >
//                     {isActive && (
//                       <div className={cn(
//                         "absolute inset-0 opacity-20",
//                         isVIP ? "bg-yellow-400 blur-xl" : "bg-purple-500 blur-xl"
//                       )} />
//                     )}

//                     <Icon className={cn(
//                       "w-5 h-5 relative z-10 transition-colors flex-shrink-0",
//                       isActive
//                         ? isVIP ? "text-yellow-400" : "text-purple-400"
//                         : "group-hover:text-white"
//                     )} />

//                     {!isCollapsed && (
//                       <motion.span
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="font-medium relative z-10 truncate"
//                       >
//                         {item.name}
//                       </motion.span>
//                     )}

//                     {isActive && !isCollapsed && (
//                       <motion.div
//                         layoutId="activeIndicator"
//                         className={cn(
//                           "ml-auto w-1.5 h-1.5 rounded-full relative z-10",
//                           isVIP ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" : "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"
//                         )}
//                       />
//                     )}
//                   </motion.div>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* VIP Status / Upgrade Box */}
//           <div className="mt-6">
//             {isVIP ? (
//               <motion.div
//                 whileHover={!isCollapsed ? { scale: 1.02 } : {}}
//                 className={cn(
//                   "relative rounded-2xl overflow-hidden border transition-all duration-300",
//                   isCollapsed ? "p-2 bg-transparent border-none" : "p-4 bg-gradient-to-br from-yellow-900/40 to-black border-yellow-500/30"
//                 )}
//               >
//                 {!isCollapsed && (
//                   <>
//                     <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
//                     <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-500/20 blur-2xl rounded-full" />
//                   </>
//                 )}

//                 <div className={cn("flex items-center relative z-10", isCollapsed ? "justify-center" : "gap-3")}>
//                   <div className={cn(
//                     "rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/20",
//                     isCollapsed ? "w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600" : "w-10 h-10 bg-yellow-500/20 text-yellow-400"
//                   )}>
//                     <Crown className={cn("fill-current", isCollapsed ? "w-5 h-5 text-white" : "w-5 h-5")} />
//                   </div>

//                   {!isCollapsed && (
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-bold text-yellow-100 text-sm">VIP Premium</h3>
//                       {vipExpiresAt && (
//                         <p className="text-[10px] text-yellow-300/70 truncate">
//                           Hết hạn: {vipExpiresAt.toLocaleDateString('vi-VN')}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ) : (
//               <Link href="/vip">
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className={cn(
//                     "relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group",
//                     isCollapsed
//                       ? "p-2 bg-transparent border-none"
//                       : "p-4 bg-gradient-to-r from-yellow-600/10 to-amber-700/10 border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10"
//                   )}
//                 >
//                   {!isCollapsed && (
//                     <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
//                   )}

//                   <div className={cn("flex items-center relative z-10", isCollapsed ? "justify-center" : "gap-3")}>
//                     <div className={cn(
//                       "rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
//                       isCollapsed
//                         ? "w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg shadow-yellow-500/20"
//                         : "w-10 h-10 bg-yellow-500/20 group-hover:bg-yellow-500/30"
//                     )}>
//                       <Crown className={cn("fill-current", isCollapsed ? "w-5 h-5 text-white" : "w-5 h-5 text-yellow-400")} />
//                     </div>

//                     {!isCollapsed && (
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-bold text-yellow-100 group-hover:text-white transition-colors">Nâng cấp VIP</p>
//                         <p className="text-[10px] text-yellow-200/60 group-hover:text-yellow-200/80">Mở khóa toàn bộ</p>
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               </Link>
//             )}
//           </div>
//         </nav>

//         {/* User Section */}
//         <div className={cn(
//           "border-t flex-shrink-0 backdrop-blur-md transition-all duration-300",
//           isVIP ? "border-yellow-500/20 bg-yellow-900/5" : "border-white/10 bg-black/20",
//           isCollapsed ? "p-3" : "p-4"
//         )}>
//           <div className={cn("flex items-center mb-3", isCollapsed ? "justify-center" : "space-x-3")}>
//             <div className={cn(
//               "rounded-full flex items-center justify-center shadow-lg flex-shrink-0 relative overflow-hidden ring-2 ring-offset-2 ring-offset-black",
//               isVIP
//                 ? "bg-gradient-to-br from-yellow-500 to-amber-600 ring-yellow-500/50"
//                 : "bg-gradient-to-br from-purple-600 to-blue-600 ring-purple-500/50",
//               isCollapsed ? "w-10 h-10" : "w-10 h-10"
//             )}>
//               <User className="w-5 h-5 text-white relative z-10" />
//               <div className="absolute inset-0 bg-white/20 animate-pulse" />
//             </div>

//             {!isCollapsed && (
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <p className={cn(
//                     "text-sm font-bold truncate",
//                     isVIP ? "text-yellow-100" : "text-white"
//                   )}>
//                     {user?.name || 'Người dùng'}
//                   </p>
//                   {isVIP && <VIPBadge tier={VIPTier.VIP} size="sm" animated={false} showText={false} />}
//                 </div>
//                 <p className={cn(
//                   "text-xs truncate",
//                   isVIP ? "text-yellow-300/70" : "text-gray-400"
//                 )}>
//                   {user?.email}
//                 </p>
//               </div>
//             )}
//           </div>

//           {!isCollapsed && (
//             <motion.button
//               whileHover={{ x: 4 }}
//               onClick={handleLogout}
//               className={cn(
//                 "flex items-center space-x-3 px-4 py-2.5 transition-colors w-full cursor-pointer rounded-lg group border",
//                 isVIP
//                   ? "text-yellow-300/70 hover:text-red-400 hover:bg-yellow-900/20 border-yellow-500/10 hover:border-red-500/30"
//                   : "text-gray-400 hover:text-red-400 hover:bg-white/5 border-white/5 hover:border-red-500/30"
//               )}
//             >
//               <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//               <span className="text-sm font-medium">Đăng xuất</span>
//             </motion.button>
//           )}
//         </div>
//       </motion.div>
//     </>
//   );
// };

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  MessageCircle,
  Sparkles,
  Star,
  Moon,
  Hash,
  LogOut,
  User,
  Settings,
  Crown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { VIPBadge } from '@/components/ui/VIPBadge';
import { VIPTier } from '@/lib/vip-types';

// Giữ nguyên logic global state của bạn...
const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed';
let sidebarCollapsedState = false;
const sidebarListeners: Array<(collapsed: boolean) => void> = [];

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
  sidebarCollapsedState = stored ? JSON.parse(stored) : false;
}

export const useSidebarCollapsed = () => {
  const [isCollapsed, setIsCollapsed] = useState(sidebarCollapsedState);
  useEffect(() => {
    const listener = (collapsed: boolean) => setIsCollapsed(collapsed);
    sidebarListeners.push(listener);
    return () => {
      const index = sidebarListeners.indexOf(listener);
      if (index > -1) sidebarListeners.splice(index, 1);
    };
  }, []);
  return isCollapsed;
};

const notifySidebarListeners = (collapsed: boolean) => {
  sidebarCollapsedState = collapsed;
  if (typeof window !== 'undefined') {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(collapsed));
  }
  sidebarListeners.forEach(listener => listener(collapsed));
};

const navigationItems = [
  { name: 'Trang Chủ', href: '/dashboard', icon: Home },
  { name: 'AI Chat', href: '/chat', icon: MessageCircle },
  { name: 'Tarot', href: '/tarot', icon: Sparkles },
  { name: 'Cung Hoàng Đạo', href: '/astrology', icon: Star },
  { name: 'Tử Vi', href: '/fortune', icon: Moon },
  { name: 'Thần Số Học', href: '/numerology', icon: Hash },
  { name: 'Tìm Kiếm Chuyên Gia', href: '/expert-listing', icon: Briefcase },
  { name: 'Hồ Sơ', href: '/profile', icon: Settings }
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isVIP = user?.is_vip === true || user?.vipTier === VIPTier.VIP || user?.vipTier === 'VIP' || user?.vipTier === 'PREMIUM' || user?.vipTier === 'ULTIMATE';
  const vipExpiresAt = user?.vipExpiresAt ? new Date(user.vipExpiresAt) : null;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
        notifySidebarListeners(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    notifySidebarListeners(newCollapsed);
  };

  return (
    <>
      {/* 1. Mobile Toggle Button - Chỉ hiện trên mobile khi sidebar đang đóng */}
      {isMobile && isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-[60] p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-xl md:hidden active:scale-90 transition-transform"
          title="Vuốt hoặc chạm để mở menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* 2. Backdrop Overlay - Làm mờ màn hình khi mở sidebar trên mobile */}
      <AnimatePresence>
        {isMobile && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // onClick={() => setIsCollapsed(true)}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          // width: isCollapsed ? (isMobile ? 0 : 80) : 280,
          // x: isMobile && isCollapsed ? -280 : 0,
          x: isMobile ? (isCollapsed ? "-100%" : "0%") : 0,
          width: isMobile ? 280 : (isCollapsed ? 80 : 280),
          opacity: isMobile && isCollapsed ? 0 : 1
        }}
        style={{
          fontFamily: 'Be Vietnam Pro, sans-serif',
          pointerEvents: isMobile && isCollapsed ? 'none' : 'auto'
        }}

        // transition={{ duration: 0.3, ease: "easeInOut" }}
        // className={cn(
        //   "h-screen backdrop-blur-xl border-r flex flex-col shadow-2xl fixed left-0 top-0 z-[50]",
        //   isVIP
        //     ? "bg-black/90 border-yellow-500/20 shadow-yellow-500/10"
        //     : "bg-black/90 border-white/10",
        // )}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "h-screen fixed left-0 top-0 z-[60] shadow-2xl", // z-index cao hơn để đè lên content
          isMobile ? "w-[280px]" : "", // Cố định chiều rộng trên mobile
          isVIP ? "bg-black/95 border-yellow-500/20" : "bg-black/95 border-white/10"
        )}
      >
        {/* Header with Toggle Button */}
        <div className={cn(
          "h-20 px-6 border-b flex-shrink-0 flex items-center justify-between",
          isVIP ? "border-yellow-500/20" : "border-white/10"
        )}>
          {(!isCollapsed) && (
            <Link href="/" className="flex items-center gap-3 overflow-hidden flex-1">
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <h1 className={cn(
                  "text-xl font-bold bg-clip-text text-transparent leading-tight",
                  isVIP
                    ? "bg-gradient-to-r from-yellow-400 via-yellow-200 to-amber-400"
                    : "bg-gradient-to-r from-white via-purple-200 to-white"
                )} style={{ fontFamily: 'Pacifico, cursive' }}>
                  SorcererXStreme
                </h1>
                <p className={cn(
                  "text-[10px] tracking-widest font-medium uppercase",
                  isVIP ? "text-yellow-500" : "text-gray-400"
                )}>
                  Huyền Thuật AI
                </p>
              </div>
            </Link>
          )}

          <button
            onClick={toggleSidebar}
            className={cn(
              "p-2 rounded-lg flex items-center justify-center border transition-all duration-200 flex-shrink-0",
              isVIP
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20"
                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
            )}
          >
            {isMobile && !isCollapsed ? (
              <X className="w-5 h-5" />
            ) : (
              isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation - Giữ nguyên toàn bộ style/nội dung */}
        <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => isMobile && toggleSidebar()}>
                  <motion.div
                    whileHover={{ x: isCollapsed ? 0 : 4, scale: 1.02 }}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden mb-1",
                      isCollapsed ? "justify-center" : "space-x-3",
                      isActive
                        ? isVIP
                          ? "bg-gradient-to-r from-yellow-500/20 to-amber-600/10 text-yellow-100 border border-yellow-500/30"
                          : "bg-white/10 text-white border border-white/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 relative z-10", isActive ? (isVIP ? "text-yellow-400" : "text-purple-400") : "group-hover:text-white")} />
                    {!isCollapsed && <span className="font-medium relative z-10 truncate">{item.name}</span>}
                  </motion.div>
                </Link>
              );
            })}
          </div>
          {/* VIP Upgrade Box - Giữ nguyên style */}
          <div className="mt-6">
            {isVIP ? (
              <div className={cn("relative rounded-2xl p-4 overflow-hidden border", isCollapsed ? "p-2 border-none" : "bg-gradient-to-br from-yellow-900/40 to-black border-yellow-500/30")}>
                <div className={cn("flex items-center gap-3 relative z-10", isCollapsed && "justify-center")}>
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-lg">
                    <Crown className="w-5 h-5 fill-current" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-yellow-100 text-sm">VIP Premium</h3>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/vip">
                <div className={cn("relative rounded-2xl p-4 border transition-all", isCollapsed ? "p-2 border-none" : "bg-gradient-to-r from-yellow-600/10 to-amber-700/10 border-yellow-500/30")}>
                  <div className={cn("flex items-center gap-3 relative z-10", isCollapsed && "justify-center")}>
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                      <Crown className="w-5 h-5 fill-current" />
                    </div>
                    {!isCollapsed && <p className="text-sm font-bold text-yellow-100">Nâng cấp VIP</p>}
                  </div>
                </div>
              </Link>
            )}
          </div>
        </nav>

        {/* User Section - Giữ nguyên style */}
        <div className={cn(
          "border-t flex-shrink-0 backdrop-blur-md p-4",
          isVIP ? "border-yellow-500/20 bg-yellow-900/5" : "border-white/10 bg-black/20",
          isCollapsed && "p-3"
        )}>
          <div className={cn("flex items-center mb-3", isCollapsed ? "justify-center" : "space-x-3")}>
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-black", isVIP ? "bg-yellow-500 ring-yellow-500/50" : "bg-purple-600 ring-purple-500/50")}>
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name || 'Người dùng'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg border border-white/5 text-gray-400 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
};