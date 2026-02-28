'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Briefcase, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';

export default function CreatePackage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-gray-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <Link href="/dashboard_expert" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white font-['Pacifico']">Tạo gói dịch vụ mới</h1>
          <p className="text-gray-400 text-sm">Gói dịch vụ sẽ được Admin kiểm duyệt trước khi hiển thị công khai.</p>
        </div>

        <div className="space-y-6">
          <Input label="Tên gói dịch vụ" placeholder="Ví dụ: Xem Tarot tình duyên 12 tháng" />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Giá tiền (VNĐ)" type="number" placeholder="500,000" />
            <Input label="Thời lượng (Phút)" type="number" placeholder="45" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Mô tả chi tiết</label>
            <textarea className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-red-500/50 h-40 outline-none" placeholder="Khách hàng sẽ nhận được gì từ gói dịch vụ này?" />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Lưu ý: Bạn nên mô tả rõ ràng quy trình tư vấn. Các gói dịch vụ có mô tả sơ sài thường bị Admin từ chối phê duyệt.
            </p>
          </div>

          <Button className="w-full py-4">Gửi yêu cầu đăng bài</Button>
        </div>
      </div>
    </main>
  );
}