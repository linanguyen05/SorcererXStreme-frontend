'use client';

import React, { Suspense } from 'react';
import CreatePackageClient from './package-client';
import { useAuthStore } from '@/lib/store';

export default function Page() {
  const id = useAuthStore((s) => s.user?.id);
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Đang tải...</p>
        </div>
      </div>
    }>
      {id ? <CreatePackageClient id={id} /> : null}
    </Suspense>
  );
}
