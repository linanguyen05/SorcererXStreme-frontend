'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Star, Search, Filter, Crown, MapPin, Users, Award,
    Facebook, Youtube, Instagram, ChevronRight, Zap, ExternalLink, Clock
} from 'lucide-react';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Footer } from '@/components/layout/Footer';
import ContentHeader from "@/components/layout/ContentHeader";
import { experts, Expert, ExpertSpecialty, SocialLinks, formatPrice } from '@/lib/services-data';
import { useAuthStore } from '@/lib/store';

// ─── Specialty config ───────────────────────────────────────────────────────
const ALL_SPECIALTIES: ExpertSpecialty[] = [
    'Tarot', 'Chiêm Tinh', 'Tử Vi', 'Thần Số Học', 'Phong Thủy', 'Bói Bài', 'Năng Lượng', 'Tâm Linh',
];

const PILL: Record<string, string> = {
    'Tarot': 'bg-violet-500/25 text-violet-200 border-violet-400/40',
    'Chiêm Tinh': 'bg-sky-500/25 text-sky-200 border-sky-400/40',
    'Tử Vi': 'bg-amber-500/25 text-amber-200 border-amber-400/40',
    'Thần Số Học': 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40',
    'Phong Thủy': 'bg-teal-500/25 text-teal-200 border-teal-400/40',
    'Bói Bài': 'bg-rose-500/25 text-rose-200 border-rose-400/40',
    'Năng Lượng': 'bg-orange-500/25 text-orange-200 border-orange-400/40',
    'Tâm Linh': 'bg-indigo-500/25 text-indigo-200 border-indigo-400/40',
};

// ─── Custom icons ────────────────────────────────────────────────────────────
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.28 8.28 0 004.84 1.55V7.07a4.85 4.85 0 01-1.07-.38z" />
        </svg>
    );
}

function ThreadsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 192 192" fill="currentColor">
            <path d="M141.537 88.988a66.667 66.667 0 00-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.15-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C57.053 24.425 74.303 17.11 97.113 16.94c22.96.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.27 0h-.484C69.82.195 48.265 9.6 33.857 27.994 20.95 44.505 14.223 67.932 14.001 96v.027c.222 28.068 6.949 51.495 19.856 68.006C48.265 182.4 69.82 191.805 96.786 192h.484c24.802-.2 42.412-6.667 56.84-21.075 18.943-18.929 18.345-42.437 12.14-56.904-4.452-10.381-13.009-18.682-24.713-23.033zm-43.232 51.081c-10.44.579-21.286-4.098-21.82-14.135-.397-7.442 5.278-15.745 22.303-16.732 1.953-.113 3.868-.168 5.747-.168 6.107 0 11.822.606 17.035 1.765-1.938 24.056-12.954 28.679-23.265 29.27z" />
        </svg>
    );
}

// ─── Social row ──────────────────────────────────────────────────────────────
const SOCIAL_CFG = [
    { key: 'facebook', Icon: Facebook, label: 'Facebook', bg: 'hover:bg-blue-600/20 hover:border-blue-400/50 hover:text-blue-300' },
    { key: 'youtube', Icon: Youtube, label: 'YouTube', bg: 'hover:bg-red-600/20 hover:border-red-400/50 hover:text-red-300' },
    { key: 'instagram', Icon: Instagram, label: 'Instagram', bg: 'hover:bg-pink-600/20 hover:border-pink-400/50 hover:text-pink-300' },
    { key: 'tiktok', Icon: TikTokIcon, label: 'TikTok', bg: 'hover:bg-white/10 hover:border-gray-300/50 hover:text-white' },
    { key: 'threads', Icon: ThreadsIcon, label: 'Threads', bg: 'hover:bg-gray-600/20 hover:border-gray-300/50 hover:text-gray-200' },
] as const;

function SocialRow({ social }: { social?: SocialLinks }) {
    if (!social) return null;
    const links = SOCIAL_CFG.filter(c => !!social[c.key as keyof SocialLinks]);
    if (!links.length) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap pointer-events-auto">
            {links.map(({ key, Icon, label, bg }) => (
                <a
                    key={key}
                    href={social[key as keyof SocialLinks]!}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    onClick={e => e.stopPropagation()}
                    className={`group/s flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium transition-all duration-200 ${bg}`}
                >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                </a>
            ))}
        </div>
    );
}

// ─── Card Flip Tile ──────────────────────────────────────────────────────────
function ExpertTile({ expert, index }: { expert: Expert; index: number }) {
    const router = useRouter();
    const [flipped, setFlipped] = useState(false);
    const minPrice = Math.min(...expert.packages.map(p => p.price));

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="relative aspect-[3/4]"
            style={{ perspective: '1200px' }}
        >
            {/* ── Flipper ── */}
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* ✦ Premium holographic ring — thin sparkly border using outline */}
                {expert.isPremium && (
                    <div className="absolute pointer-events-none" style={{
                        inset: 0, borderRadius: '16px', zIndex: 5,
                        outline: '2.5px solid transparent',
                        backgroundClip: 'padding-box',
                        animation: 'premiumGlow 2.5s ease-in-out infinite alternate',
                        boxShadow: 'inset 0 0 0 2.5px transparent, 0 0 0 2.5px #a855f7, 0 0 18px 4px rgba(168,85,247,0.55), 0 0 36px 8px rgba(6,182,212,0.25)',
                        backfaceVisibility: 'hidden',
                    }}>
                        {/* Corner sparkles */}
                        {([['0s'], ['0.7s'], ['1.4s'], ['2.1s']] as [string][]).map(([delay], i) => (
                            <span key={i} style={{
                                position: 'absolute',
                                top: i < 2 ? '5px' : 'auto',
                                bottom: i >= 2 ? '5px' : 'auto',
                                left: i % 2 === 0 ? '5px' : 'auto',
                                right: i % 2 === 1 ? '5px' : 'auto',
                                fontSize: '10px',
                                animation: `sparkle 2s ease-in-out ${delay} infinite`,
                                zIndex: 6
                            }}>✦</span>
                        ))}
                    </div>
                )}

                {/* ══ FRONT FACE ══ */}
                <div
                    onClick={() => setFlipped(true)}
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    className="absolute inset-0 rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.08] hover:border-purple-400/30 transition-colors duration-300 shadow-md hover:shadow-2xl hover:shadow-purple-900/15 bg-[#0f0f14]"
                >
                    {/* Cover image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={expert.coverImage} alt={expert.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


                    {/* Top badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            {expert.availableOnline ? (
                                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-green-500/30">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                                    <span className="text-green-300 text-[9px] font-semibold">Online</span>
                                </div>
                            ) : (
                                <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-gray-600/30">
                                    <span className="text-gray-400 text-[9px] font-semibold">Booking</span>
                                </div>
                            )}
                            {/* Sale badge */}
                            {expert.packages.some(p => p.originalPrice) && (
                                <div className="flex items-center gap-1 bg-red-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                    <span className="text-white text-[9px] font-extrabold">🔥 SALE</span>
                                </div>
                            )}
                        </div>
                        {expert.isPremium ? (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/90 to-amber-600/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-yellow-400/60">
                                <span className="text-yellow-100 text-[9px] font-extrabold">✦ PREMIUM</span>
                            </div>
                        ) : expert.badges[0] ? (
                            <span className="text-[8px] font-extrabold px-2 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-200 backdrop-blur-sm uppercase tracking-wide">
                                {expert.badges[0]}
                            </span>
                        ) : null}
                    </div>

                    {/* Avatar — shifts up on hover */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:-translate-y-[68%] transition-transform duration-300">
                        <div className="relative">
                            <div className="absolute -inset-[3px] bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full blur-sm opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={expert.avatar} alt={expert.name}
                                className="relative w-[68px] h-[68px] rounded-full object-cover border-2 border-white/20 group-hover:border-yellow-400/70 transition-all shadow-2xl" />
                        </div>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-bold text-white text-[15px] text-center leading-tight drop-shadow-md">{expert.name}</p>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-yellow-300 text-xs font-bold">{expert.rating}</span>
                            <span className="text-gray-400 text-[11px]">({expert.reviewCount})</span>
                        </div>
                        <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-300 mt-0 group-hover:mt-2 space-y-1.5">
                            <div className="flex flex-wrap gap-1 justify-center">
                                {expert.specialties.slice(0, 3).map(s => (
                                    <span key={s} className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${PILL[s] ?? 'bg-gray-700/60 text-gray-300 border-gray-600/50'}`}>{s}</span>
                                ))}
                            </div>
                            <p className="text-center text-yellow-300 font-bold text-sm">Từ {formatPrice(minPrice)}</p>
                        </div>
                    </div>

                    {/* Flip hint */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-500/30">
                            <span className="text-yellow-300 text-[9px] font-semibold">✦ Xem chi tiết</span>
                        </div>
                    </div>
                </div>

                {/* ══ BACK FACE ══ */}
                <div
                    onClick={() => setFlipped(false)}
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 rounded-2xl overflow-hidden border border-yellow-500/30 bg-[#0d0d14] shadow-2xl shadow-yellow-900/20 flex flex-col cursor-pointer"
                >
                    {/* Mystical top pattern */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-yellow-500/[0.06] to-transparent" />
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/[0.04] rounded-full blur-2xl" />
                    </div>

                    {/* ── HEADER (fixed) ── */}
                    <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/[0.07] relative">
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="absolute -inset-[2px] bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full blur-[3px] opacity-70" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={expert.avatar} alt={expert.name}
                                    className="relative w-12 h-12 rounded-full object-cover border-2 border-[#0d0d14]" />
                                {expert.availableOnline && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#0d0d14] rounded-full" />
                                )}
                            </div>
                            {/* Name block */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1">
                                    <p className="font-bold text-white text-[14px] leading-tight truncate">{expert.name}</p>
                                    <div className="flex items-center gap-0.5 flex-shrink-0">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-yellow-300 font-bold text-[12px]">{expert.rating}</span>
                                    </div>
                                </div>
                                <p className="text-amber-300/70 text-[10px] mt-0.5 leading-tight truncate">{expert.title}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {expert.location && (
                                        <div className="flex items-center gap-0.5">
                                            <MapPin className="w-2.5 h-2.5 text-gray-500" />
                                            <span className="text-gray-400 text-[10px]">{expert.location}</span>
                                        </div>
                                    )}
                                    {expert.availableOnline ? (
                                        <span className="flex items-center gap-1 text-[9px] text-green-300 font-semibold">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />Online ngay
                                        </span>
                                    ) : (
                                        <span className="text-[9px] text-gray-500">Chỉ đặt lịch</span>
                                    )}
                                    <span className="text-[9px] text-gray-600">{expert.reviewCount} đánh giá</span>
                                </div>
                            </div>
                        </div>
                        {/* Specialty pills */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                            {expert.specialties.map(s => (
                                <span key={s} className={`text-[9px] font-semibold px-2 py-[2px] rounded-full border ${PILL[s] ?? 'bg-gray-700/50 text-gray-300 border-gray-600/50'}`}>{s}</span>
                            ))}
                        </div>
                        {/* Flip-back hint */}
                        <div className="mt-2 flex items-center justify-center gap-1 opacity-50">
                            <span className="text-yellow-400 text-[9px]">↩</span>
                            <span className="text-gray-500 text-[9px] font-medium">Nhấn vào thẻ để lật lại</span>
                        </div>
                    </div>

                    {/* ── SCROLLABLE BODY ── */}
                    <div onClick={e => e.stopPropagation()} className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'none' }}>
                        <div className="p-3 space-y-3">
                            {/* Bio */}
                            <p className="text-gray-300 text-[11px] leading-relaxed">{expert.bio}</p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { Icon: Award, val: expert.experience, label: 'Kinh nghiệm' },
                                    { Icon: Users, val: `${expert.sessionsCompleted.toLocaleString()}+`, label: 'Buổi xem' },
                                    { Icon: Clock, val: `${expert.packages.length} gói`, label: 'Gói dịch vụ' },
                                ].map(({ Icon, val, label }) => (
                                    <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-2 text-center">
                                        <Icon className="w-3 h-3 text-yellow-400/80 mx-auto mb-0.5" />
                                        <p className="text-white text-[11px] font-bold">{val}</p>
                                        <p className="text-gray-500 text-[8px] leading-tight">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Packages */}
                            <div>
                                <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-gray-500 mb-1.5">📦 Gói dịch vụ</p>
                                <div className="space-y-1">
                                    {expert.packages.map(p => {
                                        const discountPct = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
                                        return (
                                            <div key={p.id}
                                                className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 ${p.highlight
                                                    ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/6 border border-yellow-500/25'
                                                    : 'bg-white/[0.03] border border-white/[0.06]'}`}>
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    {p.highlight && <Zap className="w-2.5 h-2.5 text-yellow-400 flex-shrink-0" />}
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-semibold text-white truncate">{p.name}</p>
                                                        <p className="text-[9px] text-gray-500">{p.duration}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end ml-2 flex-shrink-0">
                                                    {p.originalPrice && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-[8px] text-gray-500 line-through">{formatPrice(p.originalPrice)}</span>
                                                            <span className="text-[8px] font-extrabold text-red-400 bg-red-500/20 px-1 py-0.5 rounded">-{discountPct}%</span>
                                                        </div>
                                                    )}
                                                    <span className={`font-bold text-[11px] ${p.highlight ? 'text-yellow-300' : p.originalPrice ? 'text-red-300' : 'text-gray-200'}`}>
                                                        {formatPrice(p.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Social */}
                            {expert.social && (
                                <div>
                                    <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-gray-500 mb-1.5">🌐 Theo dõi</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {SOCIAL_CFG.filter(c => !!expert.social![c.key as keyof SocialLinks]).map(({ key, Icon, label, bg }) => (
                                            <a
                                                key={key}
                                                href={expert.social![key as keyof SocialLinks]!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-300 text-[10px] font-medium transition-all ${bg}`}
                                            >
                                                <Icon className="w-3 h-3 flex-shrink-0" />
                                                <span>{label}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── STICKY CTA ── */}
                    <div className="flex-shrink-0 border-t border-yellow-500/[0.15] bg-[#0d0d14] px-3 py-2.5 flex items-center justify-between gap-2">
                        <div>
                            <p className="text-gray-500 text-[8px] uppercase tracking-wider font-bold">Giá từ</p>
                            <p className="text-yellow-300 font-extrabold text-[16px] leading-tight">{formatPrice(minPrice)}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/expert-listing/${expert.id}`);
                            }}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[11px] font-extrabold px-4 py-2 rounded-xl shadow-lg shadow-yellow-900/25 hover:from-yellow-300 hover:to-amber-400 transition-all"
                        >
                            Xem &amp; Đặt lịch
                            <ExternalLink className="w-3 h-3" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}



// ─── Page ────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
    const sidebarCollapsed = useSidebarCollapsed();
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<ExpertSpecialty | 'all'>('all');
    const { isAuthenticated } = useAuthStore();

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         router.push('/auth/login');
    //     }
    // }, [isAuthenticated, router]);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // if (!isAuthenticated) return null;
    if (!mounted) return null;

    const filtered = experts.filter(e => {
        const q = query.toLowerCase();
        const matchQ = !q || e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q) ||
            e.specialties.some(s => s.toLowerCase().includes(q)) || e.location?.toLowerCase().includes(q);
        const matchF = filter === 'all' || e.specialties.includes(filter);
        return matchQ && matchF;
    });

    return (
        <div className="flex min-h-screen bg-[#07070c] text-white" style={{ fontFamily: 'Be Vietnam Pro, Inter, sans-serif' }}>
            <AnimatedBackground />
            <Sidebar />

            <main className="flex-1 relative z-10 overflow-auto transition-all duration-200"
                style={{ marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px') }}>

                <ContentHeader
                    title="Chuyên Gia Huyền Học"
                    description="Tư vấn 1:1 trực tiếp với chuyên gia hàng đầu"
                />

                {/* Hero
                <section className="relative border-b border-white/[0.06] py-14 md:py-20 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
                            <Crown className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-200 text-sm font-medium">Tư vấn 1:1 cùng chuyên gia hàng đầu</span>
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                            <span className="bg-gradient-to-r from-yellow-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                                Chuyên Gia Huyền Học
                            </span>
                        </motion.h1>

                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
                            className="text-gray-400 text-base max-w-xl mx-auto mb-8">
                            Đa dạng lĩnh vực · Nhiều mức giá · Di chuột để xem nhanh thông tin
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
                            className="relative max-w-md mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, lĩnh vực, tỉnh thành..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/[0.1] focus:border-yellow-400/40 rounded-2xl pl-11 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none transition-all text-sm"
                            />
                        </motion.div>
                    </div>
                </section> */}

                {/* Filter bar */}
                <div className="max-w-5xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <Filter className="w-4 h-4 text-gray-500 flex-shrink-0 mr-1" />
                        {(['all', ...ALL_SPECIALTIES] as string[]).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as ExpertSpecialty | 'all')}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${filter === f
                                    ? 'bg-yellow-400 text-black border-yellow-400 shadow shadow-yellow-900/30'
                                    : 'bg-white/[0.04] text-gray-400 border-white/[0.08] hover:border-white/20 hover:text-gray-200'
                                    }`}
                            >
                                {f === 'all' ? 'Tất cả' : f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="max-w-7xl mx-auto px-6 pb-24">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-400 text-sm">
                            <span className="text-white font-semibold">{filtered.length}</span> chuyên gia
                            {filter !== 'all' && <> · <span className="text-yellow-300">{filter}</span></>}
                        </p>
                        <p className="text-gray-600 text-xs hidden sm:flex items-center gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5" />
                            Nhấn vào thẻ bài để xem chi tiết · Nhấn nữa để lật lại
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-24 text-gray-500">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">Không tìm thấy chuyên gia phù hợp</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {filtered.map((expert, i) => (
                                <ExpertTile key={expert.id} expert={expert} index={i} />
                            ))}
                        </div>
                    )}
                </div>

                <Footer forceRender={true} />
            </main>
        </div>
    );
}
