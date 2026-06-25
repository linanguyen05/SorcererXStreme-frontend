'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { configureAmplify } from '@/lib/amplify-config';

const USER_ONLY_ROUTES = [
  '/chat',
  '/tarot',
  '/astrology',
  '/fortune',
  '/numerology',
  '/vip',
  '/profile',
  '/dashboard'
];

// Expert routes pattern: /expert/dashboard, /expert/pending and sub-routes (route tĩnh)
const EXPERT_ROUTE_PATTERN = /^\/expert\/(dashboard|pending)(\/.*)?$/;
// Admin routes pattern: /admin/dashboard và sub-routes (route tĩnh)
const ADMIN_ROUTE_PATTERN = /^\/admin(\/.*)?$/;
// Các trang onboarding/auth — không bao giờ bị chặn bởi guard hồ sơ.
const AUTH_ROUTE_PREFIX = '/auth';

function isExpertRoute(pathname: string): boolean {
  return EXPERT_ROUTE_PATTERN.test(pathname);
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTE_PATTERN.test(pathname);
}

function isUserOnlyRoute(pathname: string): boolean {
  return USER_ONLY_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    configureAmplify();
  }, []);

  // Wait for zustand persist to finish hydrating from localStorage
  useEffect(() => {
    // Check if already hydrated (fast path)
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // If the store has already finished hydrating before the effect runs
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return unsub;
  }, []);

  // Route guard — only runs AFTER store has hydrated
  useEffect(() => {
    if (!hasHydrated) return; // Don't guard until store is ready

    if (!isAuthenticated) {
      // Redirect unauthenticated users trying to access protected routes
      if (isUserOnlyRoute(pathname) || isExpertRoute(pathname) || isAdminRoute(pathname)) {
        router.replace('/auth/login');
      }
      return;
    }

    const role = user?.role?.toUpperCase();

    // EXPERT chỉ được ở khu /expert → đẩy khỏi route user-only và admin.
    if (role === 'EXPERT') {
      if (isUserOnlyRoute(pathname) || isAdminRoute(pathname)) {
        router.replace('/expert/dashboard');
        return;
      }
    }

    // ADMIN chỉ được ở khu /admin → đẩy khỏi route user-only và expert.
    if (role === 'ADMIN') {
      if (isUserOnlyRoute(pathname) || isExpertRoute(pathname)) {
        router.replace('/admin/dashboard');
        return;
      }
    }

    // USER (hoặc role rỗng) không được vào khu expert/admin.
    if (role === 'USER' || !role) {
      if (isExpertRoute(pathname) || isAdminRoute(pathname)) {
        router.replace('/');
        return;
      }

      // Chưa hoàn tất hồ sơ → ép về trang thiết lập trước khi dùng route bảo vệ.
      // (trừ khi đang ở trang /auth/... để tránh vòng lặp điều hướng)
      if (
        !user?.isProfileComplete &&
        isUserOnlyRoute(pathname) &&
        !pathname.startsWith(AUTH_ROUTE_PREFIX)
      ) {
        router.replace('/auth/setup');
        return;
      }
    }
  }, [hasHydrated, isAuthenticated, user, pathname, router]);

  return <>{children}</>;
}

