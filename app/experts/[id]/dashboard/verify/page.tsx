import VerifyExpertClient from './verify-client';
import { experts } from '@/lib/services-data';

export function generateStaticParams() {
  return experts.map((e) => ({ id: e.id }));
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <VerifyExpertClient id={params.id} />;
}