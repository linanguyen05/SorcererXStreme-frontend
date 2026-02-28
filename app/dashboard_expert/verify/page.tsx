'use client';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Upload, ArrowLeft, FileText, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function VerifyExpert() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 font-['Be_Vietnam_Pro']">
        <Link href="/dashboard_expert" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white font-['Pacifico']">Xác thực danh tính</h1>
          <p className="text-gray-400 text-sm">Thông tin này được bảo mật và chỉ dùng để phê duyệt hồ sơ.</p>
        </div>

        <div className="space-y-6">
          <Input label="Số CCCD / Định danh" placeholder="Nhập số hồ sơ" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UploadBox label="CCCD Mặt trước" icon={<ImageIcon className="w-6 h-6" />} />
            <UploadBox label="CCCD Mặt sau" icon={<ImageIcon className="w-6 h-6" />} />
          </div>

          <UploadBox 
            label="Chứng chỉ / Bằng cấp chuyên môn" 
            icon={<FileText className="w-6 h-6" />} 
            description="Tải lên bằng cấp liên quan đến Tarot, Tử vi..."
          />

          <Button className="w-full py-4 shadow-xl shadow-red-500/20">Gửi hồ sơ phê duyệt</Button>
        </div>
      </div>
    </main>
  );
}

function UploadBox({ label, icon, description }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:bg-white/5 hover:border-red-500/30 transition-all cursor-pointer group">
        <div className="text-gray-500 group-hover:text-red-500 flex justify-center mb-2 transition-colors">{icon}</div>
        <p className="text-[10px] text-gray-500">{description || "Nhấn để tải ảnh lên"}</p>
      </div>
    </div>
  );
}