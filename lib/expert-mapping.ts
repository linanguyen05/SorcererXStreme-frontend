// ============================================================
// Map chuyên gia THẬT từ API (GET /api/experts) về shape Expert
// mà ExpertTile / ExpertDetailClient đang dùng (lib/services-data).
// BE chỉ trả chuyên gia có ít nhất 1 gói dịch vụ ACTIVE.
// ============================================================

import { Expert, ExpertSpecialty, ServicePackage } from '@/lib/services-data';

// DB lưu specialty CSV proper-case tiếng Anh/không dấu chuẩn hoá từ form đăng ký
// (vd "Tarot,Astrology"). UI dùng nhãn tiếng Việt -> map lại cho khớp bộ lọc/pill.
const SPECIALTY_VI: Record<string, ExpertSpecialty> = {
    'Tarot': 'Tarot',
    'Astrology': 'Chiêm Tinh',
    'Numerology': 'Thần Số Học',
    'Tử vi': 'Tử Vi',
    'Tử Vi': 'Tử Vi',
    'Phong thủy': 'Phong Thủy',
    'Phong Thủy': 'Phong Thủy',
};

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face';
const DEFAULT_COVER = '/services/mystical-fortune.jpg';

export interface ApiExpert {
    expertId: string;
    name: string | null;
    specialty: string | null;      // CSV, vd "Tarot,Astrology"
    experienceYears: number;
    rating: number;
    bio: string | null;
    avatar?: string | null;
    title?: string | null;
    services: Array<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        duration: number;            // phút
    }>;
}

export function mapApiSpecialties(csv: string | null): ExpertSpecialty[] {
    if (!csv) return [];
    return csv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => SPECIALTY_VI[s] ?? (s as ExpertSpecialty));
}

export function mapApiExpert(e: ApiExpert): Expert {
    const specialties = mapApiSpecialties(e.specialty);

    const packages: ServicePackage[] = (e.services ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        duration: `${s.duration} phút`,
        price: Number(s.price),
        description: s.description ?? '',
        includes: [],
    }));

    return {
        id: e.expertId,
        name: e.name ?? 'Chuyên gia',
        title: e.title ?? (specialties.length ? `Chuyên gia ${specialties.join(' & ')}` : 'Chuyên gia tư vấn'),
        specialties,
        avatar: e.avatar ?? DEFAULT_AVATAR,
        coverImage: DEFAULT_COVER,
        gallery: [],
        experience: `${e.experienceYears ?? 0} năm`,
        sessionsCompleted: 0,
        rating: e.rating || 5,
        reviewCount: 0,
        bio: e.bio ?? '',
        about: e.bio ?? '',
        packages,
        testimonials: [],
        badges: [],
        availableOnline: true,
    };
}
