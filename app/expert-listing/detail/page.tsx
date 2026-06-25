'use client';

// Route TĨNH cho trang chi tiết chuyên gia. Đọc id qua query string (?id=)
// thay vì segment động [id], nên hoạt động với cả id mock lẫn UUID thật từ
// backend mà không bị 404 dưới static export (output: 'export').
// Lưu ý: route động cũ /expert-listing/[id] vẫn được giữ cho các trang mock.
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExpertDetailClient } from '@/components/services/ExpertDetailClient';

function ExpertDetailFromQuery() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';
  if (!id) return null;
  return <ExpertDetailClient expertId={id} />;
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Đang tải...</p>
        </div>
      </div>
    }>
      <ExpertDetailFromQuery />
    </Suspense>
  );
}
