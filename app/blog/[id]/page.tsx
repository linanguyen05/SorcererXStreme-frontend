import BlogDetailClient from './BlogDetailClient';

export function generateStaticParams() {
    // Generate static paths for mock blog posts (IDs 1 through 10)
    return Array.from({ length: 10 }, (_, i) => ({
        id: (i + 1).toString()
    }));
}

export default function BlogPostPage() {
    return <BlogDetailClient />;
}
