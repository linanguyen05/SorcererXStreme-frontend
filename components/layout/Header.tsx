// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence, useScroll } from 'framer-motion';
// import { cn } from '@/lib/utils';
// import { Menu, X, User, LogOut, LayoutDashboard, Settings, ChevronDown, Sparkles, Search } from 'lucide-react';
// import { useAuthStore } from '@/lib/store';

// export const Header = () => {
//     const router = useRouter();
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

//     // JS-based responsive state
//     const [isDesktop, setIsDesktop] = useState(true);
//     const [mounted, setMounted] = useState(false);

//     const { scrollY } = useScroll();
//     const { user, isAuthenticated, logout } = useAuthStore();

//     // Handle scroll effect
//     useEffect(() => {
//         const unsubscribe = scrollY.on("change", (latest) => {
//             setIsScrolled(latest > 20);
//         });
//         return () => unsubscribe();
//     }, [scrollY]);

//     // Handle screen resize (JS-based media query)
//     useEffect(() => {
//         setMounted(true);
//         const handleResize = () => {
//             const width = window.innerWidth;
//             const desktop = width >= 1024; // lg breakpoint
//             setIsDesktop(desktop);

//             if (desktop) {
//                 setIsMobileMenuOpen(false);
//             }
//         };

//         // Initial check
//         handleResize();

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const navLinks = [
//         { name: 'Tarot', href: '/tarot' },
//         { name: 'Tử Vi', href: '/fortune' },
//         { name: 'Chiêm Tinh', href: '/astrology' },
//         { name: 'Thần Số Học', href: '/numerology' },
//         // Blog removed as requested
//     ];

//     const handleLogout = () => {
//         logout();
//         setIsUserMenuOpen(false);
//         setIsMobileMenuOpen(false);
//         router.push('/auth/login');
//     };

//     return (
//         <motion.header
//             className={cn(
//                 "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
//                 isScrolled
//                     ? "bg-gray-950/80 backdrop-blur-2xl border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
//                     : "bg-transparent py-6"
//             )}
//             initial={{ y: -100 }}
//             animate={{ y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//         >
//             <div className="container mx-auto px-6">
//                 <div className="flex items-center justify-between">
//                     {/* Logo */}
//                     <Link href="/" className="relative z-50 flex-shrink-0 group">
//                         <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                         <h1 className="relative text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white group-hover:via-purple-400 transition-all duration-300" style={{ fontFamily: 'Pacifico, cursive' }}>
//                             SorcererXStreme
//                         </h1>
//                     </Link>

//                     {/* Desktop Navigation - Controlled by JS */}
//                     <nav
//                         className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-lg"
//                         style={{ display: isDesktop ? 'flex' : 'none' }}
//                     >
//                         {navLinks.map((link) => (
//                             <Link
//                                 key={link.name}
//                                 href={link.href}
//                                 className="relative px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-white/10 group overflow-hidden"
//                             >
//                                 <span className="relative z-10">{link.name}</span>
//                                 <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                             </Link>
//                         ))}
//                     </nav>

//                     {/* Right Section: Search + Auth - Controlled by JS */}
//                     <div
//                         className="flex items-center gap-4 lg:gap-6"
//                         style={{ display: isDesktop ? 'flex' : 'none' }}
//                     >
//                         {/* Search Button */}
//                         <button className="text-gray-300 hover:text-white transition-colors p-2.5 hover:bg-white/10 rounded-full group relative overflow-hidden">
//                             <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                             <Search className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
//                         </button>

//                         <div className="h-6 w-[1px] bg-white/20"></div>

//                         {isAuthenticated && user ? (
//                             <div className="relative">
//                                 <button
//                                     onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                                     className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
//                                 >
//                                     <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all">
//                                         {user.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
//                                     </div>
//                                     <div className="hidden xl:flex flex-col items-start">
//                                         <span className="text-sm font-medium text-white leading-none max-w-[120px] truncate">
//                                             {user.name || 'User'}
//                                         </span>
//                                         {user.is_vip && (
//                                             <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-1 mt-0.5">
//                                                 <Sparkles className="w-2 h-2" /> VIP Member
//                                             </span>
//                                         )}
//                                     </div>
//                                     <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isUserMenuOpen ? "rotate-180" : "")} />
//                                 </button>

//                                 {/* User Dropdown */}
//                                 <AnimatePresence>
//                                     {isUserMenuOpen && (
//                                         <motion.div
//                                             initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                                             animate={{ opacity: 1, y: 0, scale: 1 }}
//                                             exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                                             transition={{ duration: 0.2 }}
//                                             className="absolute right-0 top-full mt-3 w-72 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden py-2 z-50"
//                                         >
//                                             <div className="px-5 py-4 border-b border-white/5 bg-white/5">
//                                                 <p className="text-sm text-white font-bold truncate">{user.name}</p>
//                                                 <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
//                                             </div>

//                                             <div className="p-2">
//                                                 <Link
//                                                     href="/dashboard"
//                                                     onClick={() => setIsUserMenuOpen(false)}
//                                                     className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all group"
//                                                 >
//                                                     <div className="p-1.5 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-400 transition-colors">
//                                                         <LayoutDashboard className="w-4 h-4" />
//                                                     </div>
//                                                     Dashboard
//                                                 </Link>
//                                                 <Link
//                                                     href="/profile"
//                                                     onClick={() => setIsUserMenuOpen(false)}
//                                                     className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all group"
//                                                 >
//                                                     <div className="p-1.5 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-400 transition-colors">
//                                                         <Settings className="w-4 h-4" />
//                                                     </div>
//                                                     Cài đặt tài khoản
//                                                 </Link>
//                                             </div>

//                                             <div className="border-t border-white/5 mx-3 my-1"></div>

//                                             <div className="p-2">
//                                                 <button
//                                                     onClick={handleLogout}
//                                                     className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group text-left"
//                                                 >
//                                                     <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
//                                                         <LogOut className="w-4 h-4" />
//                                                     </div>
//                                                     Đăng xuất
//                                                 </button>
//                                             </div>
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </div>
//                         ) : (
//                             <div className="flex items-center gap-3">
//                                 <Link
//                                     href="/auth/login"
//                                     className="px-5 py-2.5 text-sm font-medium text-white hover:text-purple-300 transition-colors whitespace-nowrap"
//                                 >
//                                     Đăng Nhập
//                                 </Link>
//                                 <Link
//                                     href="/auth/register"
//                                     className="px-6 py-2.5 text-sm font-bold bg-white text-black rounded-full hover:bg-purple-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transform hover:-translate-y-0.5 whitespace-nowrap"
//                                 >
//                                     Đăng Ký
//                                 </Link>
//                             </div>
//                         )}
//                     </div>

//                     {/* Mobile Menu Button - Controlled by JS */}
//                     <button
//                         className="relative z-50 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
//                         style={{ display: isDesktop ? 'none' : 'block' }}
//                         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                     >
//                         {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile Menu Overlay */}
//             <AnimatePresence>
//                 {isMobileMenuOpen && !isDesktop && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 bg-gray-950/95 backdrop-blur-xl z-40 flex items-center justify-center"
//                     >
//                         <div className="flex flex-col items-center gap-8 w-full max-w-md px-6">
//                             {navLinks.map((link) => (
//                                 <Link
//                                     key={link.name}
//                                     href={link.href}
//                                     onClick={() => setIsMobileMenuOpen(false)}
//                                     className="text-2xl font-medium text-white hover:text-purple-400 transition-colors w-full text-center py-4 border-b border-white/5"
//                                 >
//                                     {link.name}
//                                 </Link>
//                             ))}

//                             <div className="flex flex-col gap-4 mt-8 w-full">
//                                 {isAuthenticated && user ? (
//                                     <>
//                                         <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
//                                             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
//                                                 {user.name?.charAt(0).toUpperCase() || <User />}
//                                             </div>
//                                             <div className="flex-1">
//                                                 <p className="text-white font-bold">{user.name}</p>
//                                                 <p className="text-sm text-gray-400">{user.email}</p>
//                                             </div>
//                                         </div>
//                                         <Link
//                                             href="/dashboard"
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="w-full py-4 text-center text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors font-medium flex items-center justify-center gap-2"
//                                         >
//                                             <LayoutDashboard className="w-5 h-5" /> Dashboard
//                                         </Link>
//                                         <button
//                                             onClick={handleLogout}
//                                             className="w-full py-4 text-center text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors font-medium flex items-center justify-center gap-2"
//                                         >
//                                             <LogOut className="w-5 h-5" /> Đăng xuất
//                                         </button>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Link
//                                             href="/auth/login"
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="w-full py-4 text-center text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors font-medium"
//                                         >
//                                             Đăng Nhập
//                                         </Link>
//                                         <Link
//                                             href="/auth/register"
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="w-full py-4 text-center bg-white text-black rounded-xl hover:bg-purple-100 transition-colors font-bold shadow-lg shadow-white/10"
//                                         >
//                                             Đăng Ký Ngay
//                                         </Link>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </motion.header>


//     );
// };

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu, X, User, LogOut, LayoutDashboard, Settings, ChevronDown, Sparkles, Search } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export const Header = () => {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { scrollY } = useScroll();
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        setMounted(true);
        const unsubscribe = scrollY.on("change", (latest) => {
            setIsScrolled(latest > 20);
        });
        return () => unsubscribe();
    }, [scrollY]);

    const navLinks = [
        { name: 'Tarot', href: '/tarot' },
        { name: 'Tử Vi', href: '/fortune' },
        { name: 'Chiêm Tinh', href: '/astrology' },
        { name: 'Thần Số Học', href: '/numerology' },
    ];

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        router.push('/auth/login');
    };

    if (!mounted) return <div className="h-20" />; // Giữ khoảng trống khi chưa mount

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
                isScrolled
                    ? "bg-gray-950/80 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl"
                    : "bg-transparent py-6",
                // Nếu chưa mounted thì tạm thời ẩn đi bằng opacity để tránh giật giao diện
                // !mounted ? "opacity-0" : "opacity-100"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative z-[110] flex-shrink-0 group">
                        <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h1 className="relative text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white group-hover:via-purple-400 transition-all duration-300" style={{ fontFamily: 'Pacifico, cursive' }}>
                            SorcererXStreme
                        </h1>
                    </Link>

                    {/* Desktop Navigation - CHỈ DÙNG CSS ĐỂ ẨN HIỆN */}
                    <nav className=" md:flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-lg">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-white/10 group overflow-hidden"
                            >
                                <span className="relative z-10">{link.name}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section - CHỈ DÙNG CSS ĐỂ ẨN HIỆN */}
                    <div className=" md:flex items-center gap-4 lg:gap-6">
                        <button className="text-gray-300 hover:text-white transition-colors p-2.5 hover:bg-white/10 rounded-full group relative overflow-hidden">
                            <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Search className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                        </button>

                        <div className="h-6 w-[1px] bg-white/20"></div>

                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all">
                                        {user.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                                    </div>
                                    <div className="hidden xl:flex flex-col items-start text-left">
                                        <span className="text-sm font-medium text-white leading-none max-w-[120px] truncate">
                                            {user.name || 'User'}
                                        </span>
                                        {user.is_vip && (
                                            <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-1 mt-0.5">
                                                <Sparkles className="w-2 h-2" /> VIP Member
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isUserMenuOpen ? "rotate-180" : "")} />
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-3 w-72 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                                        >
                                            <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                                                <p className="text-sm text-white font-bold truncate">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all group">
                                                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400"><LayoutDashboard className="w-4 h-4" /></div>
                                                    Dashboard
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all group text-left">
                                                    <div className="p-1.5 rounded-lg bg-red-500/10"><LogOut className="w-4 h-4" /></div>
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/auth/login" className="px-5 py-2.5 text-sm font-medium text-white hover:text-purple-300 transition-colors whitespace-nowrap">Đăng Nhập</Link>
                                <Link href="/auth/register" className="px-6 py-2.5 text-sm font-bold bg-white text-black rounded-full hover:bg-purple-50 transition-all duration-300 whitespace-nowrap">Đăng Ký</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button - CHỈ HIỆN TRÊN MOBILE BẰNG CSS */}
                    <button
                        className="relative z-[110] text-white p-2 hover:bg-white/10 rounded-lg transition-colors block md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-gray-950/98 backdrop-blur-2xl z-40 md:hidden flex flex-col items-center pt-24 pb-10 overflow-y-auto"
                    >
                        <div className="flex flex-col items-center gap-4 w-full max-w-md px-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xl font-medium text-white hover:text-purple-400 transition-colors w-full text-center py-4 border-b border-white/5 active:bg-white/5"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="flex flex-col gap-4 mt-6 w-full">
                                {isAuthenticated && user ? (
                                    <>
                                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">{user.name?.charAt(0).toUpperCase()}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-bold truncate text-left">{user.name}</p>
                                                <p className="text-sm text-gray-400 truncate text-left">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-white border border-white/20 rounded-xl flex items-center justify-center gap-2"><LayoutDashboard className="w-5 h-5" /> Dashboard</Link>
                                        <button onClick={handleLogout} className="w-full py-4 text-center text-red-400 border border-red-500/20 rounded-xl flex items-center justify-center gap-2"><LogOut className="w-5 h-5" /> Đăng xuất</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-white border border-white/20 rounded-xl">Đăng Nhập</Link>
                                        <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center bg-white text-black rounded-xl font-bold">Đăng Ký Ngay</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};