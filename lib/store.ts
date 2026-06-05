import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, profileApi, partnerApi } from './api-client';

interface User {
  id: string;
  email: string;
  name?: string;
  gender?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  is_vip?: boolean;
  vipTier?: string;
  vipExpiresAt?: string;
  isProfileComplete?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, role: string) => Promise<boolean>;
  confirmRegistration: (email: string, code: string) => Promise<boolean>;
  completeProfile: (name: string, gender: string, birth_date: string, birth_time: string, birth_place: string, token: string) => Promise<void>;
  updateProfile: (name: string, birthDate: string, birthTime: string, birthPlace: string, token: string) => Promise<void>;
  logout: () => void;
  upgradeToVip: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (email, password) => {
        try {
          // authApi.login now returns { token, user: { email } } using Amplify
          const { token, sub, user } = await authApi.login(email, password);

          // Cookie fallback
          document.cookie = `token=${token}; path=/; max-age=604800;`;

          // Fetch full profile from backend to get name, birthdate etc.
          // The initial login only returns email from Cognito
          let fullUser: any = { ...user, isProfileComplete: false };
          try {
            // Try to fetch profile from backend using the new token
            const profile = await profileApi.get(token);
            if (profile) {
              fullUser = { ...fullUser, ...profile };
            }
          } catch (e: any) {
            // Ignore profile fetch error on first login (Profile might not exist yet)
            console.log('Profile fetch failed or empty', e);
          }

          const isProfileComplete = !!(fullUser.name && fullUser.birth_date && fullUser.birth_time && fullUser.birth_place);

          // Map snake_case from backend to camelCase for frontend
          const mappedUser: User = {
            id: fullUser.id || 'temp-id',
            email: fullUser.email,
            name: fullUser.name,
            gender: fullUser.gender,
            birth_date: fullUser.birth_date,
            birth_time: fullUser.birth_time,
            birth_place: fullUser.birth_place,
            isProfileComplete,
            vipTier: fullUser.vip_tier,
            vipExpiresAt: fullUser.vip_expires_at,
          };

          set({ user: mappedUser, isAuthenticated: true, token });
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      register: async (email: string, password: string, role: string) => {
        try {
          // authApi.register now handles Cognito signUp + Backend Sync
          await authApi.register(email, password, role);

          // Auto-login removed as flow is now Register -> Verify -> Manual Login
          return true;


        } catch (error) {
          console.error(error);
          return false;
        }
      },

      confirmRegistration: async (email: string, code: string) => {
        try {
          await authApi.confirmSignUp(email, code);
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      completeProfile: async (name: string, gender: string, birth_date: string, birth_time: string, birth_place: string, token: string) => {
        if (token) {
          try {
            const updatedUser = await profileApi.update({ name, gender, birth_date, birth_time, birth_place }, token);
            const mappedUser = {
              ...get().user,
              ...updatedUser,
              isProfileComplete: true,
              vipTier: updatedUser.vip_tier || get().user?.vipTier,
              vipExpiresAt: updatedUser.vip_expires_at || get().user?.vipExpiresAt,
            };
            set({ user: mappedUser });
          } catch (error) {
            console.error(error);
            throw error;
          }
        }
      },

      updateProfile: async (name, birthDate, birthTime, birthPlace, token) => {
        try {
          const payloadForBackend = {
            name,
            birth_date: birthDate,
            birth_time: birthTime,
            birth_place: birthPlace
          };

          await profileApi.update(payloadForBackend, token);

          set((state) => {
            if (!state.user) return {}; 
            
            return {
              user: {
                ...state.user, 
                name,
                birth_date: birthDate, 
                birth_time: birthTime,
                birth_place: birthPlace
              }
            };
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        document.cookie = 'token=; path=/; max-age=0';
        set({ user: null, isAuthenticated: false, token: null });
        useProfileStore.getState().clear();
      },

      upgradeToVip: async () => {
        const { token, user } = get();
        if (!token || !user) {
          throw new Error('Not authenticated');
        }

        try {
          // Instead of calling a manual upgrade endpoint, we re-fetch the profile 
          // because the payment/webhook flow already updated the DB.
          const profile = await profileApi.get(token);

          if (profile) {
            const updatedUser = {
              ...user,
              is_vip: profile.is_vip || profile.vipTier === 'VIP',
              vipTier: profile.vip_tier || user.vipTier,
              vipExpiresAt: profile.vip_expires_at || user.vipExpiresAt,
              isProfileComplete: true
            };
            set({ user: updatedUser });
          }
          return true;
        } catch (error) {
          console.error('Upgrade VIP sync error:', error);
          // Don't throw, just log. The user is likely already VIP in DB.
          return false;
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'tarot' | 'astrology' | 'numerology';
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string | null;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setSessionId: (sessionId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  sessionId: null,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]
  })),

  clearMessages: () => set({ messages: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSessionId: (sessionId) => set({ sessionId })
}));

export interface Partner {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: 'male' | 'female' | 'other';
  startDate: string;
  relationship?: string;
}

export interface BreakupData {
  isActive: boolean;
  partnerName: string;
  partnerInfo: Partner;
  breakupDate: string;
  autoDeleteDate: string;
  weeklyCheckDone: boolean[];
}

interface ProfileState {
  partner: Partner | null;
  breakupData: BreakupData | null;
  isLoading: boolean;
  error: string | null;
  fetchPartner: () => Promise<void>;
  addPartner: (partnerData: Omit<Partner, 'id' | 'startDate'>) => Promise<void>;
  updatePartner: (partnerData: Partial<Partner>) => void;
  breakup: () => Promise<void>;
  moveOn: () => void;
  confirmRecovery: () => void;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      partner: null,
      breakupData: null,
      isLoading: false,
      error: null,

      fetchPartner: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
          const partnerData = await partnerApi.get(token);

          if (partnerData) {
            // Map snake_case to camelCase
            // Backend returns partner_name, partner_gender, partner_birth_date, relationship start date (or created_at)
            const mappedPartner: Partner = {
              id: partnerData.id?.toString() || partnerData.partner_id?.toString() || 'unknown',
              name: partnerData.partner_name,
              gender: partnerData.partner_gender,
              birthDate: partnerData.partner_birth_date,
              birthTime: partnerData.partner_birth_time || '',
              birthPlace: partnerData.partner_birth_place || '',
              startDate: partnerData['relationship start date'] || partnerData.created_at || partnerData.createdAt || new Date().toISOString()
            };
            set({ partner: mappedPartner, breakupData: null });
          } else {
            set({ partner: null });
          }
        } catch (error: any) {
          // Silence expected 404/No partner errors
          if (error.message?.includes('404') || error.message?.includes('No partner') || error.message?.includes('not found') || error.message === 'Request failed') {
            set({ partner: null });
          } else {
            console.error('Failed to fetch partner:', error);
            set({ error: error.message });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      addPartner: async (partnerData) => {
        const token = useAuthStore.getState().token;
        if (!token) {
          throw new Error('Not authenticated');
        }

        set({ isLoading: true, error: null });
        try {
          const validGender = (partnerData.gender === 'male' || partnerData.gender === 'female') ? partnerData.gender : 'female';

          const payload = {
            partner_name: partnerData.name,
            partner_gender: validGender,
            // Backend validation requires ISO string for date
            partner_birth_date: new Date(partnerData.birthDate).toISOString(),
            partner_birth_time: partnerData.birthTime,
            partner_birth_place: partnerData.birthPlace
          };

          const response = await partnerApi.add(payload, token);
          const backendPartner = response.partner || response.data || response;

          const newPartner: Partner = {
            id: backendPartner.id?.toString() || 'temp-id',
            name: backendPartner.partner_name,
            gender: backendPartner.partner_gender,
            birthDate: backendPartner.partner_birth_date,
            birthTime: backendPartner.partner_birth_time || '',
            birthPlace: backendPartner.partner_birth_place || '',
            startDate: backendPartner['relationship start date'] || backendPartner.created_at || new Date().toISOString()
          };

          set({ partner: newPartner, breakupData: null });
        } catch (error: any) {
          console.error('Failed to add partner:', error);
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updatePartner: (partnerData) => {
        const { partner } = get();
        if (partner) {
          const updated = { ...partner, ...partnerData };
          set({ partner: updated });
        }
      },

      breakup: async () => {
        const { partner } = get();
        const token = useAuthStore.getState().token;

        if (partner) {
          try {
            if (token) {
              await partnerApi.remove(token);
            }

            const breakupDate = new Date();
            const autoDeleteDate = new Date(breakupDate);
            autoDeleteDate.setMonth(autoDeleteDate.getMonth() + 1);

            const breakupData: BreakupData = {
              isActive: true,
              partnerName: partner.name,
              partnerInfo: partner,
              breakupDate: breakupDate.toISOString(),
              autoDeleteDate: autoDeleteDate.toISOString(),
              weeklyCheckDone: []
            };

            set({ partner: null, breakupData });
          } catch (e) {
            console.error('Breakup sync failed', e);
            // Still perform local breakup
            const breakupDate = new Date();
            const autoDeleteDate = new Date(breakupDate);
            autoDeleteDate.setMonth(autoDeleteDate.getMonth() + 1);
            const breakupData: BreakupData = {
              isActive: true,
              partnerName: partner.name,
              partnerInfo: partner,
              breakupDate: breakupDate.toISOString(),
              autoDeleteDate: autoDeleteDate.toISOString(),
              weeklyCheckDone: []
            };
            set({ partner: null, breakupData });
          }
        }
      },

      moveOn: () => {
        set({ breakupData: null, partner: null });
      },

      confirmRecovery: () => {
        set({ breakupData: null });
      },

      clear: () => set({ partner: null, breakupData: null, error: null, isLoading: false })
    }),
    {
      name: 'profile-storage',
    }
  )
);
