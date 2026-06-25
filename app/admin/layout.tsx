import AdminGuard from '@/components/auth/AdminGuard';

// Route tĩnh /admin/... — không còn segment động [id] nên bỏ generateStaticParams.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
