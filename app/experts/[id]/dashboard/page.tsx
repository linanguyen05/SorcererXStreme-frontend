'use client';

import React from 'react';
import ExpertDashboardClient from './dashboard-client';

export default function Page({ params }: { params: { id: string } }) {
  return <ExpertDashboardClient id={params.id} />;
}
