'use client';

import React from 'react';
import ExpertProfileClient from './profile-client';
import { useAuthStore } from '@/lib/store';

export default function Page() {
  const id = useAuthStore((s) => s.user?.id);
  if (!id) return null;
  return <ExpertProfileClient id={id} />;
}
