const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RequestOptions {
  method?: string;
  body?: any;
  token?: string;
}

async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const text = await response.text();
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      error = { message: text || 'Request failed' };
    }
    throw new Error(error.message || 'Request failed');
  }

  if (response.status === 204) {
    return {};
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

import { signUp, signIn, signOut, fetchAuthSession, confirmSignUp, resetPassword, confirmResetPassword, resendSignUpCode } from 'aws-amplify/auth';

export const authApi = {
  confirmSignUp: async (email: string, code: string) => {
    return await confirmSignUp({ username: email, confirmationCode: code });
  },

  register: async (email: string, password: string, role: string) => {
    // 1. Create user in Cognito (No Backend Sync)
    try {
      const { userId } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:role': role,
          },
        },
      });
      return { userId };
    } catch (error: any) {
      console.log("SignUp Error:", error);
      if (error.name === 'UsernameExistsException' || error.message?.includes('User already exists')) {
        try {
          await resendSignUpCode({ username: email });
          return { message: 'Verification code resent' };
        } catch (resendError: any) {
          console.warn('Resend failed:', resendError);
          throw new Error('Email này đã được đăng ký. Vui lòng đăng nhập.');
        }
      } else {
        throw error;
      }
    }
  },

  login: async (email: string, password: string) => {
    let signInResult;
    try {
      signInResult = await signIn({ username: email, password });
    } catch (error: any) {
      if (error.name === 'UserAlreadyAuthenticatedException' ||
        error.message?.includes('already a signed in user')) {
        await signOut();
        signInResult = await signIn({ username: email, password });
      } else {
        throw error;
      }
    }

    const { isSignedIn, nextStep } = signInResult;

    if (isSignedIn) {
      const session = await fetchAuthSession();
      // Use Access Token for Backend Verification
      const token = session.tokens?.accessToken?.toString();

      if (!token) {
        throw new Error('Failed to retrieve access token from Cognito session');
      }

      const role = session.tokens?.idToken?.payload?.['custom:role'] as string || 'USER';
      return {
        token,
        sub: session.userSub,
        user: { email, role }
      };
    }

    throw new Error(`Login incomplete. Next step: ${nextStep?.signInStep}`);
  },

  forgotPassword: async (email: string) => {
    return await resetPassword({ username: email });
  },

  resetPassword: async (email: string, code: string, newPassword: string) => {
    return await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword
    });
  },

  logout: async () => {
    await signOut();
  }
};


export const profileApi = {
  get: (token: string) =>
    apiRequest('/api/users/profile', { token }),

  update: (data: any, token: string) =>
    apiRequest('/api/users/update-profile', {
      method: 'PATCH',
      body: data,
      token,
    }),

  upgradeToVIP: (token: string, tier: string = 'VIP', durationDays: number = 30) =>
    apiRequest('/api/users/upgrade-vip', {
      method: 'POST',
      body: { tier, durationDays },
      token,
    }),
};

export const chatApi = {
  createSession: (token: string) =>
    apiRequest('/api/chat/new-session', {
      method: 'POST',
      token,
    }),

  sendMessage: (sessionId: string, message: string, token: string) =>
    apiRequest('/api/chat/message', {
      method: 'POST',
      body: { sessionId, message },
      token,
    }),
};

export const tarotApi = {
  getReading: (data: {
    domain: 'tarot';
    feature_type: 'overview' | 'question';
    user_context: {
      name: string;
      gender: string;
      birth_date: string;
      [key: string]: any;
    };
    partner_context?: {
      name: string;
      gender: string;
      birth_date: string;
      [key: string]: any;
    };
    data: {
      question: string | null;
      cards_drawn: Array<{
        card_name: string;
        is_upright: boolean;
        position?: string;
      }>;
    };
  }, token: string) =>
    apiRequest('/api/tarot/reading', {
      method: 'POST',
      body: data,
      token,
    }),
};

export const astrologyApi = {
  getReading: (data: {
    domain: 'astrology';
    feature_type: 'overview' | 'love';
    user_context: {
      name: string;
      gender: string;
      birth_date: string;
      birth_time?: string;
      birth_place?: string;
      [key: string]: any;
    };
    partner_context?: {
      name: string;
      gender: string;
      birth_date: string;
      birth_time?: string;
      birth_place?: string;
      [key: string]: any;
    };
  }, token: string) =>
    apiRequest('/api/astrology/reading', {
      method: 'POST',
      body: data,
      token,
    }),
};

export const numerologyApi = {
  getAnalysis: (data: {
    domain: 'numerology';
    feature_type: 'overview';
    user_context: {
      name: string;
      gender: string;
      birth_date: string;
      [key: string]: any;
    };
  }, token: string) =>
    apiRequest('/api/numerology', {
      method: 'POST',
      body: data,
      token,
    }),
};

export const horoscopeApi = {
  getHoroscope: (data: {
    domain: 'horoscope';
    feature_type: 'daily' | 'natal_chart';
    user_context: {
      name: string;
      gender: string;
      birth_date: string;
      birth_time?: string;
      birth_place?: string;
      [key: string]: any;
    };
    data?: {
      target_date?: string;
    };
  }, token: string) => {
    // Xác định endpoint dựa vào feature_type
    const endpoint = data.feature_type === 'daily'
      ? '/api/horoscope/daily'
      : '/api/horoscope/natal';

    return apiRequest(endpoint, {
      method: 'POST',
      body: data,
      token,
    });
  },
};

export const partnerApi = {
  add: (data: {
    partner_name: string;
    partner_gender: 'male' | 'female' | 'other';
    partner_birth_date: string;
    partner_birth_time?: string;
    partner_birth_place?: string;
  }, token: string) =>
    apiRequest('/api/partners/', {
      method: 'POST',
      body: data,
      token,
    }),

  remove: (token: string) =>
    apiRequest('/api/partners/', {
      method: 'DELETE',
      token,
    }),

  get: (token: string) =>
    apiRequest('/api/partners/', {
      method: 'GET',
      token,
    }),
};

export const reminderApi = {
  get: (token: string) =>
    apiRequest('/api/reminders/', { token }),

  update: (data: {
    is_subscribed: boolean;
    preferred_time?: string;
  }, token: string) =>
    apiRequest('/api/reminders/', {
      method: 'PATCH',
      body: data,
      token,
    }),
};

export const subscriptionApi = {
  getPlans: () =>
    apiRequest('/api/subscription/plans'),

  getCurrentSubscription: (token: string) =>
    apiRequest('/api/subscription/current', { token }),

  subscribe: (data: any, token: string) =>
    apiRequest('/api/subscription/subscribe', {
      method: 'POST',
      body: data,
      token,
    }),

  cancel: (token: string) =>
    apiRequest('/api/subscription/cancel', {
      method: 'POST',
      token,
    }),

  getHistory: (token: string) =>
    apiRequest('/api/subscription/history', { token }),

  checkFeatureAccess: (feature: string, token: string) =>
    apiRequest(`/api/subscription/check-access?feature=${feature}`, { token }),
};

export const paymentApi = {
  create: (data: { tier: 'VIP'; durationMonths: number }, token: string) =>
    apiRequest('/api/payments/create', {
      method: 'POST',
      body: data,
      token,
    }),

  checkStatus: (subscriptionId: string, token: string) =>
    apiRequest(`/api/payments/status/${subscriptionId}`, {
      method: 'GET',
      token,
    }),
};

export const adminApi = {
  getPendingExperts: (token: string) =>
    apiRequest('/api/admin/experts?status=PENDING', { token }),

  getPendingServices: (token: string) =>
    apiRequest('/api/admin/services?status=PENDING', { token }),

  approveExpert: (id: string, action: 'approve' | 'reject', token: string) =>
    apiRequest(`/api/experts/${id}/status`, {
      method: 'PUT',
      body: { status: action === 'approve' ? 'APPROVED' : 'REJECTED' },
      token,
    }),

  approveService: (id: string, action: 'approve' | 'reject', token: string) =>
    apiRequest(`/api/services/${id}/status`, {
      method: 'PUT',
      body: { status: action === 'approve' ? 'APPROVED' : 'REJECTED' },
      token,
    }),

  getExperts: (token: string, status?: string) => {
    const url = status ? `/api/admin/experts?status=${status}` : '/api/admin/experts';
    return apiRequest(url, { token });
  },

  updateExpertStatus: (expertId: string, status: string, token: string) =>
    apiRequest(`/api/experts/${expertId}/status`, {
      method: 'PUT',
      body: { status },
      token,
    }),

  deleteExpert: (expertId: string, token: string) =>
    apiRequest(`/api/experts/${expertId}`, {
      method: 'DELETE',
      token,
    }),

  getServices: (token: string, status?: string) => {
    const url = status ? `/api/admin/services?status=${status}` : '/api/admin/services';
    return apiRequest(url, { token });
  },

  updateServiceStatus: (serviceId: string, status: string, token: string) =>
    apiRequest(`/api/services/${serviceId}/status`, {
      method: 'PUT',
      body: { status },
      token,
    }),

  deleteService: (serviceId: string, token: string) =>
    apiRequest(`/api/services/${serviceId}`, {
      method: 'DELETE',
      token,
    }),
};