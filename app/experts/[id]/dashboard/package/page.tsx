'use client';

import React, { Suspense } from 'react';
import CreatePackageClient from './package-client';

export async function generateStaticParams() {
  return [];
}
export const dynamicParams = true;

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Đang tải...</p>
        </div>
      </div>
    }>
      <CreatePackageClient id={params.id} />
    </Suspense>
  );
}
