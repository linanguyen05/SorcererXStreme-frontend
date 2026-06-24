'use client';

import React from 'react';
import ExpertScheduleClient from './schedule-client';
import { useAuthStore } from '@/lib/store';

export default function Page() {
  const id = useAuthStore((s) => s.user?.id);
  if (!id) return null;
  return <ExpertScheduleClient id={id} />;
}
