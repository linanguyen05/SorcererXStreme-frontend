'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Trang tìm kiếm chuyên gia đã được gộp vào trang "Khám Phá Dịch Vụ".
// Giữ route này để không vỡ link cũ — tự động chuyển sang tab Chuyên gia.
export default function ExpertListingRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/service-listing?tab=experts');
    }, [router]);

    return null;
}
