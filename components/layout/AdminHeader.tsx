'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Bell, Shield, Layout } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

interface AdminHeaderProps {
  onScrollToSection?: (sectionId: string) => void;
  onShowNotifications?: () => void;
}

export function AdminHeader({ onScrollToSection, onShowNotifications }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close menus on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const navLinks = [
    { name: 'Duyệt yêu cầu', id: 'approval-table', href: '/dashboard_admin#approval-table' },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    if (pathname === '/dashboard_admin' && onScrollToSection) {
      e.preventDefault();
      onScrollToSection(link.id);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-[90] w-full bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group relative flex-shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h1 className="relative text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-red-200 to-white group-hover:via-red-400 transition-all duration-300 font-['Pacifico']">
                SorcererXStreme
              </h1>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-black uppercase tracking-wider">
              <Shield className="w-3 h-3" /> Admin Hub
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="relative px-4 py-2 text-xs font-bold text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-white/10 group overflow-hidden"
              >
                <span className="relative z-10">{link.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Notification Bell */}
            {onShowNotifications && (
              <button
                onClick={onShowNotifications}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-all group relative"
              >
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />
              </button>
            )}

            {/* User Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-red-500/20 group-hover:ring-red-500/40 transition-all overflow-hidden">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                    {user.name}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 z-[100] space-y-1"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tài khoản Admin</p>
                        <p className="text-sm font-bold text-white truncate mt-0.5">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      <div className="p-1 space-y-1">
                        <Link href="/" className="flex items-center gap-2 px-3 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <Layout className="w-4 h-4 text-purple-400" />
                          Trang chủ khách hàng
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2 px-4 rounded-xl">
                  Đăng nhập
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="block px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-gray-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
