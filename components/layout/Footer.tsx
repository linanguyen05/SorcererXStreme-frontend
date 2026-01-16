'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const Footer = ({ forceRender = false }: { forceRender?: boolean }) => {
    const pathname = usePathname();

    // List of paths that have the fixed Sidebar
    // On these pages, we will render the Footer manually inside the page content to avoid overlap
    const sidebarPaths = ['/vip', '/dashboard', '/profile', '/chat', '/tarot', '/astrology', '/numerology', '/fortune'];
    const shouldHideGlobalFooter = sidebarPaths.some(path => pathname?.startsWith(path));

    if (shouldHideGlobalFooter && !forceRender) {
        return null;
    }

    return (
        <footer className="bg-gray-950 border-t border-white/10 pt-12 md:pt-16 pb-8 w-full">
            <div className="max-w-[1440px] px-6 md:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">

                    {/* Brand Info */}
                    <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-block">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white" style={{ fontFamily: 'Pacifico, cursive' }}>
                                SorcererXStreme
                            </h2>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Khám phá vận mệnh của bạn thông qua sự kết hợp hoàn hảo giữa trí tuệ nhân tạo và các bộ môn huyền học cổ xưa.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-500 hover:text-white transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Khám Phá</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/chat" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Chat AI</Link>
                            </li>
                            <li>
                                <Link href="/tarot" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Tarot</Link>
                            </li>
                            <li>
                                <Link href="/astrology" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Cung Hoàng Đạo</Link>
                            </li>
                            <li>
                                <Link href="/numerology" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Thần Số Học</Link>
                            </li>
                            <li>
                                <Link href="/fortune" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Tử Vi</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Hỗ Trợ</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Về Chúng Tôi</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Liên Hệ</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Chính Sách Bảo Mật</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Điều Khoản Sử Dụng</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Liên Hệ</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                <span>54-47 Đường Lê Duẩn, Phường Sài Gòn, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                <span>+84 373 939 617</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                <span>contact@sorcererxstreme.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © {new Date().getFullYear()} SorcererXStreme. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                        Made with <span className="text-red-500">❤</span> by TEEJ Sorcerer Team
                    </p>
                </div>
            </div>
        </footer>
    );
};
