'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const id = params.id as string;

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

    // If user's ID does not match the URL parameter [id], redirect to their own admin dashboard
    if (user?.id && user.id !== id) {
      router.push(`/admins/${user.id}/dashboard`);
    }
  }, [isAuthenticated, user, id, router]);

  // Loading state / barrier
  if (!isAuthenticated || user?.role?.toUpperCase() !== 'ADMIN' || (user?.id && user.id !== id)) {
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
