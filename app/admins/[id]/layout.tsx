export function generateStaticParams() {
  const numericIds = Array.from({ length: 20 }, (_, i) => ({ id: (i + 1).toString() }));
  return [
    ...numericIds,
    { id: 'admin' },
    { id: 'admin-root' }
  ];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
