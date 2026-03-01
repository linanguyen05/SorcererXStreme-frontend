// Server Component — required for generateStaticParams with output: 'export'
import { experts } from '@/lib/services-data';
import { ExpertDetailClient } from '@/components/services/ExpertDetailClient';

// Pre-generate all expert detail pages at build time (required for static export)
export function generateStaticParams() {
    return experts.map((e) => ({ id: e.id }));
}

export default function ExpertDetailPage({ params }: { params: { id: string } }) {
    return <ExpertDetailClient expertId={params.id} />;
}
