import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  lastAccessed: string | null;
  fromSignup: boolean;
  createdAt: string | null;
  method: 'email' | 'google' | 'facebook' | 'twitter' | null;
  setNewUserInfo: () => void;
  resetAuthInfo: () => void;
  setMethod: (method: 'email' | 'google' | 'facebook' | 'twitter') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      lastAccessed: null,
      fromSignup: false,
      createdAt: null,
      method: null,
      setMethod: (method: 'email' | 'google' | 'facebook' | 'twitter') =>
        set({ method }),

      setNewUserInfo: () =>
        set({
          fromSignup: true,
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
        }),

      resetAuthInfo: () =>
        set({
          lastAccessed: null,
          fromSignup: false,
          createdAt: null,
        }),
    }),
    {
      name: 'synaxis-auth-info',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
