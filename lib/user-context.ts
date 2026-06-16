import { useAuthStore, useProfileStore } from './store';

/**
 * Helper function to create consistent user context for AI API calls
 */
export function createUserContext() {
  const { user } = useAuthStore.getState();
  const { partner, breakupData } = useProfileStore.getState();

  let name = user?.name;
  let birthDate = user?.birth_date;
  let birthTime = user?.birth_time;
  let birthPlace = user?.birth_place;
  let gender = user?.gender;

  if (!user && typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('guestProfile');
      if (stored) {
        const guest = JSON.parse(stored);
        name = guest.name;
        birthDate = guest.birth_date || guest.birthDate;
        birthTime = guest.birth_time || guest.birthTime;
        birthPlace = guest.birth_place || guest.birthPlace;
        gender = guest.gender;
      }
    } catch (e) {
      console.error('Error parsing guestProfile in createUserContext', e);
    }
  }

  return {
    name,
    gender,
    birthDate,
    birthTime,
    birthPlace,
    hasPartner: !!partner,
    isInBreakup: !!breakupData?.isActive,
    partnerName: partner?.name || breakupData?.partnerName,
    partnerData: partner ? {
      name: partner.name,
      birthDate: partner.birthDate,
      birthTime: partner.birthTime,
      birthPlace: partner.birthPlace,
      startDate: partner.startDate
    } : undefined,
    breakupData: breakupData?.isActive ? {
      partnerName: breakupData.partnerName,
      breakupDate: breakupData.breakupDate,
      autoDeleteDate: breakupData.autoDeleteDate,
      weeklyCheckDone: breakupData.weeklyCheckDone || []
    } : undefined
  };
}

/**
 * React hook to get user context
 */
export function useUserContext() {
  const { user } = useAuthStore();
  const { partner, breakupData } = useProfileStore();

  let name = user?.name;
  let birthDate = user?.birth_date;
  let birthTime = user?.birth_time;
  let birthPlace = user?.birth_place;
  let gender = user?.gender;

  if (!user && typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('guestProfile');
      if (stored) {
        const guest = JSON.parse(stored);
        name = guest.name;
        birthDate = guest.birth_date || guest.birthDate;
        birthTime = guest.birth_time || guest.birthTime;
        birthPlace = guest.birth_place || guest.birthPlace;
        gender = guest.gender;
      }
    } catch (e) {
      console.error('Error parsing guestProfile in useUserContext', e);
    }
  }

  return {
    name,
    gender,
    birthDate,
    birthTime,
    birthPlace,
    hasPartner: !!partner,
    isInBreakup: !!breakupData?.isActive,
    partnerName: partner?.name || breakupData?.partnerName,
    partnerData: partner ? {
      name: partner.name,
      birthDate: partner.birthDate,
      birthTime: partner.birthTime,
      birthPlace: partner.birthPlace,
      startDate: partner.startDate
    } : undefined,
    breakupData: breakupData?.isActive ? {
      partnerName: breakupData.partnerName,
      breakupDate: breakupData.breakupDate,
      autoDeleteDate: breakupData.autoDeleteDate,
      weeklyCheckDone: breakupData.weeklyCheckDone || []
    } : undefined
  };
}