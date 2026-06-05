import ExpertScheduleClient from './schedule-client';
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
  return <ExpertScheduleClient id={params.id} />;
}
