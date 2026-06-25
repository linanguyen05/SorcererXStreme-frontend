'use client';

import React from 'react';
import ExpertProfileClient from './profile-client';

export default function Page({ params }: { params: { id: string } }) {
  return <ExpertProfileClient id={params.id} />;
}
