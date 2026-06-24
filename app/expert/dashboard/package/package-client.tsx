'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Briefcase, ArrowLeft, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { expertApi } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-hot-toast';

export default function CreateOrEditPackage({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { token } = useAuthStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (editId && token) {
      const loadService = async () => {
        setIsFetching(true);
        try {
          const res = await expertApi.getServices(id, token);
          if (res) {
            const service = res.find((s: any) => String(s.id) === String(editId));
            if (service) {
              setName(service.name || '');
              setPrice(service.price || '');
              setDuration(service.duration || '');
              setDescription(service.description || '');
            } else {
              toast.error('Không tìm thấy gói dịch vụ cần chỉnh sửa');
            }
          }
        } catch (err) {
          console.error(err);
          toast.error('Lỗi khi tải thông tin gói dịch vụ.');
        } finally {
          setIsFetching(false);
        }
      };
      loadService();
    }
  }, [editId, id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Phiên đăng nhập hết hạn.');
      return;
    }

    if (!name.trim()) {
      toast.error('Vui lòng điền tên gói dịch vụ.');
      return;
    }

    if (price === '' || price <= 0) {
      toast.error('Vui lòng điền giá tiền hợp lệ.');
      return;
    }

    if (duration === '' || duration <= 0) {
      toast.error('Vui lòng điền thời lượng hợp lệ.');
      return;
    }

    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả chi tiết.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        price: Number(price),
        duration: Number(duration),
        description,
      };

      if (editId) {
        await expertApi.updateService(id, editId, payload, token);
        toast.success('Cập nhật gói dịch vụ thành công!');
      } else {
        await expertApi.createService(id, payload, token);
        toast.success('Gửi yêu cầu tạo gói dịch vụ mới thành công! Đang chờ Admin duyệt.');
      }

      router.push(`/expert/dashboard`);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lưu gói dịch vụ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 flex justify-center bg-black font-['Be_Vietnam_Pro'] text-white">
      <div className="max-w-2xl w-full bg-gray-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8">
        <Link href={`/expert/dashboard`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại Workspace
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white font-['Pacifico']">
            {editId ? 'Chỉnh sửa gói dịch vụ' : 'Tạo gói dịch vụ mới'}
          </h1>
          <p className="text-gray-400 text-sm">
            {editId ? 'Cập nhật lại thông tin dịch vụ của bạn.' : 'Gói dịch vụ sẽ được Admin kiểm duyệt trước khi hiển thị công khai.'}
          </p>
        </div>

        {isFetching ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <p className="text-sm text-gray-400">Đang tải thông tin dịch vụ...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <Input
                label="Thời lượng (Phút)"
                type="number"
                placeholder="45"
                value={duration}
                onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Mô tả chi tiết</label>
              <textarea
                className="w-full px-4 py-3 rounded-2xl bg-gray-850/50 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-red-500/50 h-40 outline-none transition-all resize-y"
                placeholder="Khách hàng sẽ nhận được gì từ gói dịch vụ này?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              <p className="text-xs text-blue-200/80 leading-relaxed font-sans">
                Lưu ý: Bạn nên mô tả rõ ràng quy trình tư vấn. Các gói dịch vụ có mô tả sơ sài thường bị Admin từ chối phê duyệt.
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-2xl font-bold">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...
                </span>
              ) : (
                editId ? 'Lưu thay đổi' : 'Gửi yêu cầu đăng bài'
              )}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
