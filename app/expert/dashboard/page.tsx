'use client';

import React from 'react';
import ExpertDashboardClient from './dashboard-client';
import { useAuthStore } from '@/lib/store';

export default function Page() {
  // Route tĩnh: id chuyên gia lấy từ phiên đăng nhập (Cognito), không từ URL.
  const id = useAuthStore((s) => s.user?.id);
  if (!id) return null; // ExpertGuard lo điều hướng khi chưa đăng nhập.
  return <ExpertDashboardClient id={id} />;
}
