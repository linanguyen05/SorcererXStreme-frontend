'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExpertsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/service-listing?tab=experts');
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">
            <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 text-sm">Đang chuyển hướng...</p>
            </div>
        </div>
    );
}
