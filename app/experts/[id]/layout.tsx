import ExpertGuard from '@/components/auth/ExpertGuard';

export function generateStaticParams() {
  return [
    { id: 'exp-1' },
    { id: 'exp-2' },
    { id: 'exp-3' },
    { id: 'expert' }
  ];
}

export const dynamicParams = true;

export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExpertGuard>{children}</ExpertGuard>;
}

