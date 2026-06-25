import ExpertGuard from '@/components/auth/ExpertGuard';

// Route tĩnh /expert/... — không còn segment động [id] nên không cần
// generateStaticParams. Mọi trang dưới đây được build sẵn 1 lần.
export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExpertGuard>{children}</ExpertGuard>;
}
