'use client';

import React from 'react';
import ExpertScheduleClient from './schedule-client';

export default function Page({ params }: { params: { id: string } }) {
  return <ExpertScheduleClient id={params.id} />;
}
