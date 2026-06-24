'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { expertApi } from '@/lib/api-client';

export default function ExpertGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, token } = useAuthStore();

  const [isCheckingApproval, setIsCheckingApproval] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Authenticated Check
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // 2. Role Check
    if (user?.role?.toUpperCase() !== 'EXPERT') {
      router.push('/dashboard');
      return;
    }

    // 3. Approval status check
    const checkApprovalStatus = async () => {
      if (!token || !user?.id) return;
      
      let approved = false;
      try {
        const profileRes = await expertApi.getProfile(user.id, token);
        const exp = profileRes?.expert || profileRes;
        if (exp && exp.status === 'APPROVED') {
          approved = true;
        }
      } catch (err) {
        console.warn('API check failed in ExpertGuard, checking local fallback', err);
        // Fallback to local storage
        const storedExperts = localStorage.getItem('mock-admin-experts');
        if (storedExperts) {
          try {
            const allExperts = JSON.parse(storedExperts);
            const matched = allExperts.find((e: any) => e.id === user.id || (user.email && e.email === user.email));
            if (matched && matched.status === 'APPROVED') {
              approved = true;
            }
          } catch (e) {
            console.error('Error parsing mock-admin-experts:', e);
          }
        }
      }

      // Redirection behavior
      const isPendingPage = pathname.endsWith('/pending');
      
      if (approved) {
        if (isPendingPage) {
          router.push(`/expert/dashboard`);
        } else {
          setIsAuthorized(true);
          setIsCheckingApproval(false);
        }
      } else {
        if (isPendingPage) {
          setIsAuthorized(true);
          setIsCheckingApproval(false);
        } else {
          router.push(`/expert/pending`);
        }
      }
    };

    checkApprovalStatus();
  }, [isAuthenticated, user, token, pathname, router]);

  // Render loader during redirect check
  if (!isAuthenticated || user?.role?.toUpperCase() !== 'EXPERT' || isCheckingApproval || !isAuthorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Đang xác thực quyền chuyên gia...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
