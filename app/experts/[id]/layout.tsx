import { experts } from '@/lib/services-data';

export function generateStaticParams() {
  return experts.map((e) => ({ id: e.id }));
}

export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
