'use client';

import React from 'react';
import VerifyExpertClient from './verify-client';

export default function Page({ params }: { params: { id: string } }) {
  return <VerifyExpertClient id={params.id} />;
}