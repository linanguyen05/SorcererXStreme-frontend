'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Briefcase, ArrowLeft, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { expertManagementApi } from '@/lib/api-client';

export default function CreatePackage({ id }: { id: string }) {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!token || !userId) {
      toast.error('Bạn cần đăng nhập bằng tài khoản chuyên gia.');
      return;
    }
    if (!name.trim()) return toast.error('Vui lòng nhập tên gói dịch vụ.');
    const priceNum = Number(price);
    const durationNum = Number(duration);
    if (!Number.isFinite(priceNum) || priceNum < 0) return toast.error('Giá tiền không hợp lệ.');
    if (!Number.isInteger(durationNum) || durationNum <= 0) return toast.error('Thời lượng (phút) phải > 0.');

    setSubmitting(true);
    try {
      // expertId = chính chủ đang đăng nhập (userId), KHÔNG dùng route [id] (mock).
      await expertManagementApi.createService(
        userId,
        { name: name.trim(), price: priceNum, duration: durationNum, description: description.trim() || undefined },
        token,
      );
      toast.success('Đã gửi yêu cầu đăng gói. Gói đang chờ Admin duyệt (PENDING).');
      setName('');
      setPrice('');
      setDuration('');
      setDescription('');
    } catch (e: any) {
      toast.error(e?.message || 'Tạo gói dịch vụ thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-gray-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <Link href={`/experts/${id}/dashboard`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white font-['Pacifico']">Tạo gói dịch vụ mới</h1>
          <p className="text-gray-400 text-sm">Gói dịch vụ sẽ được Admin kiểm duyệt trước khi hiển thị công khai.</p>
        </div>

        <div className="space-y-6">
          <Input
            label="Tên gói dịch vụ"
            placeholder="Ví dụ: Xem Tarot tình duyên 12 tháng"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giá tiền (VNĐ)"
              type="number"
              placeholder="500000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              label="Thời lượng (Phút)"
              type="number"
              placeholder="45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Mô tả chi tiết</label>
            <textarea
              className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-red-500/50 h-40 outline-none"
              placeholder="Khách hàng sẽ nhận được gì từ gói dịch vụ này?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Lưu ý: Bạn nên mô tả rõ ràng quy trình tư vấn. Các gói dịch vụ có mô tả sơ sài thường bị Admin từ chối phê duyệt.
            </p>
          </div>

          <Button className="w-full py-4 flex items-center justify-center gap-2" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang gửi...</> : <><Briefcase className="w-4 h-4" /> Gửi yêu cầu đăng bài</>}
          </Button>
        </div>
      </div>
    </main>
  );
}
