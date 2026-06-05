'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeft, Camera, User, Star, Calendar, MessageSquare, Clock,
  CheckCircle, Globe, Mail, Phone, Sparkles, ShieldCheck, Upload,
  Facebook, Instagram, Award, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { experts } from '@/lib/services-data';
import { useAuthStore } from '@/lib/store';
import { expertManagementApi } from '@/lib/api-client';

export default function ExpertProfilePage({ id }: { id: string }) {
  // Token + id chính chủ (= token.sub). expertId cho API LUÔN là userId, KHÔNG
  // phải route [id] (vốn là mock id từ generateStaticParams).
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  const [saving, setSaving] = useState(false);

  // --- STATES ---
  const [avatar, setAvatar] = useState<string | null>(null);
  const [savedAvatar, setSavedAvatar] = useState<string | null>(null);
  const [coverColor, setCoverColor] = useState<string>('from-purple-900/60 to-red-900/60');
  const [savedCoverColor, setSavedCoverColor] = useState<string>('from-purple-900/60 to-red-900/60');

  const [profile, setProfile] = useState<{
    name: string;
    title: string;
    bio: string;
    experience: string;
    yoe: number | '';
    email: string;
    phone: string;
    facebook: string;
    instagram: string;
    specs: string[];
    price: string;
  }>({
    name: 'Master Lina',
    title: 'Chuyên gia Tarot & Chiêm tinh học',
    bio: 'Định hướng sự nghiệp, tình duyên thông qua các trải bài Tarot chuyên sâu và bản đồ sao cá nhân. Hơn 5 năm kinh nghiệm thấu cảm.',
    experience: 'Tôi đã có hơn 5 năm nghiên cứu và thực hành Tarot chuyên sâu kết hợp với Chiêm tinh học phương Tây. Đã giúp đỡ hơn 1000 khách hàng tìm lại định hướng trong cuộc sống, hàn gắn các mối quan hệ đổ vỡ và định hình lộ trình sự nghiệp tương lai.',
    yoe: 5,
    email: 'lina.mystic@gmail.com',
    phone: '0987.654.321',
    facebook: 'fb.com/master.lina.tarot',
    instagram: 'instagr.am/lina.mystic',
    specs: ['Tarot', 'Astrology'],
    price: '200.000đ',
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit'); // for mobile responsive toggling

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from mock data & localStorage on mount
  useEffect(() => {
    // 1. First set mock data based on ID
    const expertInfo = experts.find(e => e.id === id);
    let initialProfile = {
      name: 'Master Lina',
      title: 'Chuyên gia Tarot & Chiêm tinh học',
      bio: 'Định hướng sự nghiệp, tình duyên thông qua các trải bài Tarot chuyên sâu và bản đồ sao cá nhân. Hơn 5 năm kinh nghiệm thấu cảm.',
      experience: 'Tôi đã có hơn 5 năm nghiên cứu và thực hành Tarot chuyên sâu kết hợp với Chiêm tinh học phương Tây. Đã giúp đỡ hơn 1000 khách hàng tìm lại định hướng trong cuộc sống, hàn gắn các mối quan hệ đổ vỡ và định hình lộ trình sự nghiệp tương lai.',
      yoe: 5 as number | '',
      email: 'lina.mystic@gmail.com',
      phone: '0987.654.321',
      facebook: 'fb.com/master.lina.tarot',
      instagram: 'instagr.am/lina.mystic',
      specs: ['Tarot', 'Astrology'],
      price: '200.000đ',
    };

    if (expertInfo) {
      initialProfile = {
        name: expertInfo.name,
        title: expertInfo.title,
        bio: expertInfo.bio || "",
        experience: expertInfo.about || "",
        yoe: parseInt(expertInfo.experience) || 5,
        email: `${expertInfo.id}@gmail.com`,
        phone: '0987.654.321',
        facebook: expertInfo.social?.facebook || 'fb.com',
        instagram: expertInfo.social?.threads || 'instagr.am',
        specs: expertInfo.specialties || ['Tarot'],
        price: expertInfo.packages?.[0] ? `${expertInfo.packages[0].price.toLocaleString()}đ` : '200.000đ',
      };
      setAvatar(expertInfo.avatar || null);
      setSavedAvatar(expertInfo.avatar || null);
    }

    setProfile(initialProfile);
    setTempProfile(initialProfile);

    // 2. Override with localStorage if exists
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`expert-profile-data-${id}`) || localStorage.getItem('expert-profile-data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.profile) {
            const mergedProfile = { ...initialProfile, ...parsed.profile };
            setProfile(mergedProfile);
            setTempProfile(mergedProfile);
          }
          if (parsed.avatar) {
            setAvatar(parsed.avatar);
            setSavedAvatar(parsed.avatar);
          }
          if (parsed.coverColor) {
            setCoverColor(parsed.coverColor);
            setSavedCoverColor(parsed.coverColor);
          }
        } catch (e) {
          console.error("Error loading stored profile data", e);
        }
      }
    }
  }, [id]);

  // Prefill các trường CÓ THẬT trong DB (bio, experience_years, specialty) từ
  // backend. Các trường khác (title, email, social, price, avatar...) vẫn dùng
  // mock/localStorage vì DB không có cột tương ứng.
  useEffect(() => {
    if (!token || !userId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await expertManagementApi.getProfile(userId, token);
        const data = res?.data;
        if (!data || cancelled) return;
        const patch = {
          bio: data.bio ?? '',
          yoe: (typeof data.experienceYears === 'number' ? data.experienceYears : '') as number | '',
          specs: data.specialty
            ? String(data.specialty).split(',').map((s: string) => s.trim()).filter(Boolean)
            : [] as string[],
        };
        setProfile((prev) => ({ ...prev, ...patch }));
        setTempProfile((prev) => ({ ...prev, ...patch }));
      } catch (e) {
        // Chưa có hồ sơ expert / lỗi mạng -> giữ nguyên mock, không chặn UI.
        console.warn('Prefill expert profile failed:', e);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  // Check for changes
  useEffect(() => {
    const isChanged =
      JSON.stringify(tempProfile) !== JSON.stringify(profile) ||
      avatar !== savedAvatar ||
      coverColor !== savedCoverColor;
    setHasChanges(isChanged);
  }, [tempProfile, profile, avatar, savedAvatar, coverColor, savedCoverColor]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Kích thước ảnh tối đa là 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success("Tải ảnh đại diện thành công!");
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSpec = (spec: string) => {
    setTempProfile(prev => ({
      ...prev,
      specs: prev.specs.includes(spec)
        ? prev.specs.filter(s => s !== spec)
        : [...prev.specs, spec]
    }));
  };

  const handleSave = async () => {
    // 1. Lưu localStorage cho toàn bộ field (gồm cả field không có ở DB).
    if (typeof window !== 'undefined') {
      localStorage.setItem(`expert-profile-data-${id}`, JSON.stringify({
        profile: tempProfile,
        avatar,
        coverColor
      }));
    }

    // 2. Đẩy các field CÓ THẬT trong DB lên backend (bio, specialty, experience_years).
    if (token && userId) {
      setSaving(true);
      try {
        await expertManagementApi.updateProfile(
          userId,
          {
            bio: tempProfile.bio,
            specialty: tempProfile.specs.join(', '),
            experience_years: tempProfile.yoe === '' ? 0 : Number(tempProfile.yoe),
          },
          token,
        );
        toast.success('Đã cập nhật trang cá nhân (đã lưu lên hệ thống).');
      } catch (e: any) {
        toast.error(e?.message || 'Lưu lên hệ thống thất bại (đã lưu cục bộ).');
      } finally {
        setSaving(false);
      }
    } else {
      toast.success('Đã lưu cục bộ. Đăng nhập tài khoản chuyên gia để đồng bộ hệ thống.');
    }

    setProfile({ ...tempProfile });
    setSavedAvatar(avatar);
    setSavedCoverColor(coverColor);
    setHasChanges(false);
  };

  const specialties = ['Tarot', 'Astrology', 'Numerology', 'Tử vi', 'Phong thủy'];
  const coverGradients = [
    { id: 'purple-red', class: 'from-purple-900/60 to-red-900/60', label: 'Tím Đỏ (Huyền Bí)' },
    { id: 'blue-indigo', class: 'from-blue-900/60 to-indigo-900/60', label: 'Xanh Chàm (Trí Tuệ)' },
    { id: 'amber-red', class: 'from-amber-900/60 to-red-900/60', label: 'Hổ Phách (Năng Lượng)' },
    { id: 'dark-emerald', class: 'from-emerald-950/60 to-teal-900/60', label: 'Lục Bảo (Chữa Lành)' },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-black text-white font-['Be_Vietnam_Pro'] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <Link href={`/experts/${id}/dashboard`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-2 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại Workspace
            </Link>
            <h1 className="text-4xl font-bold font-['Pacifico'] tracking-wide">
              Trang cá nhân <span className="text-red-500">Chuyên gia</span>
            </h1>
            <p className="text-gray-400 text-xs uppercase tracking-widest">
              Tùy chỉnh thông tin hiển thị công khai tới khách hàng
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Tab Toggle buttons */}
            <div className="flex md:hidden bg-gray-900/80 border border-white/10 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
              >
                Xem trước
              </button>
            </div>

            <Button
              variant={hasChanges ? 'primary' : 'secondary'}
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`py-3 px-6 rounded-xl text-sm font-bold shadow-2xl transition-all ${!hasChanges || saving ? 'opacity-40 cursor-not-allowed' : 'shadow-red-500/20 hover:scale-105'
                }`}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>

        {/* Main Workspace Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: EDITING INTERFACE */}
          <div className={`lg:col-span-6 space-y-6 ${activeTab === 'edit' ? 'block' : 'hidden md:block'}`}>

            {/* SECTION 1: AVATAR & BACKGROUND */}
            <section className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                <Camera className="w-5 h-5 text-red-500" />
                Ảnh đại diện & Giao diện
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar upload block */}
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] bg-gray-800 flex items-center justify-center relative">
                    {avatar ? (
                      <img src={avatar} alt="Expert Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-500" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[10px] uppercase font-black">Tải ảnh</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="absolute bottom-1 right-1 bg-red-500 p-2 rounded-full border-2 border-gray-900 shadow-md">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h3 className="font-bold text-base text-gray-200">Ảnh đại diện chân dung</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Khuyến nghị sử dụng ảnh rõ mặt, ánh sáng tốt và có năng lượng thân thiện. Hỗ trợ JPG, PNG dưới 2MB.
                  </p>
                  {avatar && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setAvatar(null); }}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold underline mt-2"
                    >
                      Xóa ảnh hiện tại
                    </button>
                  )}
                </div>
              </div>

              {/* Cover Gradient Choose */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 block">Chọn tông màu bìa cá nhân (Bản xem trước)</label>
                <div className="grid grid-cols-2 gap-3">
                  {coverGradients.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setCoverColor(g.class)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${coverColor === g.class
                        ? 'border-red-500 bg-red-500/10 text-white'
                        : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'
                        }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${g.class} shrink-0`} />
                      <span className="truncate">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 2: BASIC INFO */}
            <section className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                <User className="w-5 h-5 text-red-500" />
                Thông tin cơ bản
              </h2>

              <div className="space-y-4">
                <Input
                  label="Họ và Tên Chuyên Gia"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  placeholder="Ví dụ: Master Lina"
                />

                <Input
                  label="Danh hiệu / Khẩu hiệu phụ"
                  value={tempProfile.title}
                  onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                  placeholder="Ví dụ: Chuyên gia Tarot & Chiêm tinh học"
                />

                <Input
                  label="Số năm kinh nghiệm"
                  type="number"
                  min="0"
                  value={tempProfile.yoe !== undefined ? tempProfile.yoe : ''}
                  onChange={(e) => setTempProfile({ ...tempProfile, yoe: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                  placeholder="Ví dụ: 5"
                />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-200">Tiểu sử ngắn (Bio)</label>
                    <span className={`text-[10px] font-bold ${tempProfile.bio.length > 150 ? 'text-red-500' : 'text-gray-500'}`}>
                      {tempProfile.bio.length}/150 kí tự
                    </span>
                  </div>
                  <textarea
                    value={tempProfile.bio}
                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value.slice(0, 150) })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 h-20 resize-none"
                    placeholder="Giới thiệu nhanh về bản thân bạn trong 1-2 câu ngắn gọn..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Lĩnh vực tư vấn chuyên môn</label>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleSpec(tag)}
                        className={`text-xs px-4 py-2 rounded-xl border transition-all ${tempProfile.specs.includes(tag)
                          ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200 font-sans">Mô tả kinh nghiệm / Giới thiệu chi tiết</label>
                  <textarea
                    value={tempProfile.experience}
                    onChange={(e) => setTempProfile({ ...tempProfile, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 h-40 resize-y"
                    placeholder="Mô tả kỹ năng, trường phái huyền học bạn theo đuổi, và cách bạn tư vấn cho khách hàng..."
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3: CONTACT & LINKS */}
            <section className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                <Globe className="w-5 h-5 text-red-500" />
                Thông tin liên hệ & Mạng xã hội
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email address"
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                />
                <Input
                  label="Phone number"
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                />
                <Input
                  label="Facebook link"
                  value={tempProfile.facebook}
                  onChange={(e) => setTempProfile({ ...tempProfile, facebook: e.target.value })}
                />
                <Input
                  label="Instagram link"
                  value={tempProfile.instagram}
                  onChange={(e) => setTempProfile({ ...tempProfile, instagram: e.target.value })}
                />
              </div>
            </section>

          </div>

          {/* RIGHT: LIVE PREVIEW LAYOUT */}
          <div className={`lg:col-span-6 space-y-6 ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}>

            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" /> Bản xem trước trực tiếp (Client View)
                </span>
                <span className="text-[10px] text-gray-500">Mẫu giao diện người dùng nhìn thấy</span>
              </div>

              {/* CARD PREVIEW */}
              <div className="bg-gray-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">

                {/* 1. Cover Gradient Banner */}
                <div className={`h-36 bg-gradient-to-r ${coverColor} w-full relative transition-all duration-300`}>
                  <div className="absolute inset-0 bg-black/20" />
                  {/* Astrology circles styling overlay */}
                  <div className="absolute right-6 bottom-4 text-white/5 select-none pointer-events-none font-serif text-6xl">
                    🔮
                  </div>
                </div>

                {/* 2. Profile Details Overlap Section */}
                <div className="px-6 md:px-8 pb-8 relative pt-16">

                  {/* Floating Avatar */}
                  <div className="absolute top-[-48px] left-6 md:left-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-950 shadow-2xl bg-gray-900">
                      {avatar ? (
                        <img src={avatar} alt="Preview Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                          <User className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verified Badge and Save Status */}
                  <div className="absolute top-4 right-6 md:right-8 flex items-center gap-2">
                    <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Chuyên Gia Uy Tín
                    </span>
                  </div>

                  {/* Expert Name and Tagline */}
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white flex items-center gap-2 tracking-wide font-sans">
                      {tempProfile.name || 'Họ và Tên Chuyên Gia'}
                    </h3>
                    <p className="text-red-400 text-sm font-semibold">{tempProfile.title || 'Danh hiệu chuyên gia'}</p>
                  </div>

                  {/* Bio Description (Tiểu sử ngắn) */}
                  <p className="text-gray-300 text-xs italic mt-4 bg-white/5 p-4 rounded-2xl border border-white/5 leading-relaxed">
                    "{tempProfile.bio || 'Chưa thiết lập tiểu sử ngắn (Bio)...'}"
                  </p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mt-6 border-y border-white/5 py-4 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-black">4.9</span>
                      </div>
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-wider">120+ Lượt Đánh Giá</p>
                    </div>
                    <div className="space-y-1 border-x border-white/5">
                      <div className="text-white text-sm font-black flex items-center justify-center gap-1">
                        <Award className="w-4 h-4 text-red-500" />
                        <span>{tempProfile.yoe !== undefined ? tempProfile.yoe : 0} Năm</span>
                      </div>
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-wider">Kinh Nghiệm</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-red-400 text-sm font-black flex items-center justify-center gap-1">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        <span>98%</span>
                      </div>
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-wider">Phản Hồi Nhanh</p>
                    </div>
                  </div>

                  {/* Specialties List */}
                  <div className="mt-6 space-y-2">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Lĩnh vực chuyên môn</h4>
                    <div className="flex flex-wrap gap-2">
                      {tempProfile.specs.length > 0 ? (
                        tempProfile.specs.map(s => (
                          <span
                              key={s}
                              className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1"
                          >
                            🔮 {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-600 italic">Chưa chọn lĩnh vực</span>
                      )}
                    </div>
                  </div>

                  {/* Experience Section (Giới thiệu chi tiết) */}
                  <div className="mt-6 space-y-2">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Giới thiệu chi tiết & Kinh nghiệm</h4>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300 cursor-pointer">
                      {tempProfile.experience || 'Chưa thiết lập giới thiệu kinh nghiệm chi tiết...'}
                    </p>
                  </div>

                  {/* Contact Info (if available) */}
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t border-white/5 pt-4">
                    {tempProfile.email && (
                      <span className="flex items-center gap-1 hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {tempProfile.email}
                      </span>
                    )}
                    {tempProfile.phone && (
                      <span className="flex items-center gap-1 hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5" /> {tempProfile.phone}
                      </span>
                    )}
                    {tempProfile.facebook && (
                      <span className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                        <Facebook className="w-3.5 h-3.5" /> Facebook
                      </span>
                    )}
                    {tempProfile.instagram && (
                      <span className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors">
                        <Instagram className="w-3.5 h-3.5" /> Instagram
                      </span>
                    )}
                  </div>

                  {/* Action Booking Card Mockup */}
                  <div className="mt-8 bg-gradient-to-br from-red-500/10 to-purple-500/10 border border-red-500/20 p-5 rounded-3xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Chi phí tư vấn dự kiến</p>
                      <p className="text-xl font-black text-white">{tempProfile.price || '200.000đ'} <span className="text-xs text-gray-400 font-normal">/ 30 phút</span></p>
                    </div>
                    <Button variant="primary" className="py-2.5 px-5 rounded-2xl text-xs font-bold shadow-lg shadow-red-500/20 cursor-default pointer-events-none">
                      Đặt lịch ngay
                    </Button>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
