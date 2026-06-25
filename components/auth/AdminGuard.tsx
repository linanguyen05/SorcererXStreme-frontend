'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // If role is not ADMIN, redirect to /dashboard
    if (user?.role?.toUpperCase() !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Loading state / barrier
  if (!isAuthenticated || user?.role?.toUpperCase() !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Đang xác thực quyền Admin...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
