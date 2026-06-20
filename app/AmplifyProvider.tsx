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

// Expert routes pattern: /experts/:id/dashboard and all sub-routes
const EXPERT_ROUTE_PATTERN = /^\/experts\/[^/]+\/(dashboard|pending)(\/.*)?$/;

function isExpertRoute(pathname: string): boolean {
  return EXPERT_ROUTE_PATTERN.test(pathname);
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
      if (isUserOnlyRoute(pathname) || isExpertRoute(pathname)) {
        router.replace('/auth/login');
      }
      return;
    }

    const role = user?.role?.toUpperCase();

    // EXPERT trying to access user-only routes → redirect to expert dashboard
    if (role === 'EXPERT') {
      if (isUserOnlyRoute(pathname)) {
        router.replace(`/experts/${user!.id}/dashboard`);
        return;
      }
    }

    // USER trying to access expert routes → redirect to home
    if (role === 'USER' || !role) {
      if (isExpertRoute(pathname)) {
        router.replace('/');
        return;
      }
    }
  }, [hasHydrated, isAuthenticated, user, pathname, router]);

  return <>{children}</>;
}

