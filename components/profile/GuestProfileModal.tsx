'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Calendar, Clock, MapPin, User as UserIcon } from 'lucide-react';
import { guestApi } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface GuestProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (guestId: string, profile: any) => void;
}

export function GuestProfileModal({ isOpen, onClose, onSuccess }: GuestProfileModalProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [birthPlace, setBirthPlace] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error('Tên phải có ít nhất 2 ký tự');
      return;
    }
    if (!birthDate) {
      toast.error('Vui lòng chọn ngày sinh');
      return;
    }
    if (!birthTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      toast.error('Giờ sinh không đúng định dạng HH:MM');
      return;
    }
    if (birthPlace.trim().length < 2) {
      toast.error('Nơi sinh phải có ít nhất 2 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Sinh UUID ngẫu nhiên làm guestId
      const guestId = 'guest_' + crypto.randomUUID();

      const profile = {
        name: name.trim(),
        gender,
        birth_date: new Date(birthDate).toISOString(),
        birth_time: birthTime,
        birth_place: birthPlace.trim()
      };

      // 2. Gọi API đăng ký guest xuống Backend
      await guestApi.register({
        guestId,
        ...profile
      });

      // 3. Lưu localStorage
      localStorage.setItem('guestId', guestId);
      localStorage.setItem('guestProfile', JSON.stringify(profile));

      toast.success('Hồ sơ dùng thử đã được tạo!');
      onSuccess(guestId, profile);
      onClose();
    } catch (error: any) {
      console.error('Lỗi đăng ký guest:', error);
      toast.error(error.message || 'Không thể đăng ký thông tin dùng thử.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
        >
          {/* Background Gradient Effect */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Thiết lập hồ sơ dùng thử
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-zinc-400 text-xs md:text-sm mb-6">
            Để AI luận giải chính xác nhất, vui lòng cung cấp thông tin cá nhân của bạn dưới đây.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tên */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Họ và tên</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Giới tính */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Giới tính</label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                      gender === g
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 animate-pulse'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Ngày sinh */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Ngày sinh</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Giờ sinh */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Giờ sinh (HH:MM)</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    placeholder="VD: 08:30"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Nơi sinh */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Nơi sinh (Tỉnh/Thành phố)</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="VD: Hà Nội"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all"
              >
                Lưu hồ sơ và Bắt đầu
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
