import type { User as DatabaseUser } from '@repo/database/types';
import type { User } from 'better-auth/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatUserData } from './index';

interface ProfileFormData {
  // Basic info
  firstName: string;
  lastName: string;
  username: string;
  accountType: 'individual' | 'brand' | null;

  // Profile details
  bio: string;
  image: string | undefined;

  // Interests (for individuals)
  interests: string[];

  // Community (for brands)
  communityName: string;
  communityDescription: string;
  communityPrivacy: 'public' | 'private';

  // Saved state
  currentStep: number;

  // Completion state
  isComplete: boolean;
}

interface ProfileSetupStore extends ProfileFormData {
  // Update helpers
  setField: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;

  updateFields: (data: Partial<ProfileFormData>) => void;

  // Step helpers
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Account type specific
  setAccountType: (type: 'individual' | 'brand') => void;

  // Clear all data
  resetStore: () => void;

  // Format data for submission
  getFormattedData: () => {
    name?: string;
    username?: string;
    bio?: string;
    image?: string | undefined;
    interests?: string[];
    community?: {
      name: string;
      description: string;
      privacy: 'public' | 'private';
    };
  };

  // Initialize from user data
  initFromUser: (user: User & Partial<DatabaseUser>) => void;
}

const initialState: ProfileFormData = {
  firstName: '',
  lastName: '',
  username: '',
  accountType: null,
  bio: '',
  image: undefined,
  interests: [],
  communityName: '',
  communityDescription: '',
  communityPrivacy: 'public',
  currentStep: 1,
  isComplete: false,
};

export const useProfileSetupStore = create<ProfileSetupStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setField: (field, value) => set({ [field]: value }),

      updateFields: (data) => set((state) => ({ ...state, ...data })),

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep, accountType } = get();

        // Logic for step progression based on account type
        if (currentStep === 2 && accountType === 'brand') {
          // Skip interests for brands
          set({ currentStep: 4 });
        } else if (currentStep < 4) {
          set((state) => ({ currentStep: state.currentStep + 1 }));
        }
      },

      prevStep: () => {
        const { currentStep, accountType } = get();

        // Logic for step regression based on account type
        if (currentStep === 4 && accountType === 'brand') {
          // Skip back over interests for brands
          set({ currentStep: 2 });
        } else if (currentStep > 1) {
          set((state) => ({ currentStep: state.currentStep - 1 }));
        }
      },

      setAccountType: (type) => set({ accountType: type }),

      resetStore: () => set(initialState),

      getFormattedData: () => {
        const {
          firstName,
          lastName,
          username,
          bio,
          image,
          interests,
          accountType,
          communityName,
          communityDescription,
          communityPrivacy,
        } = get();

        const userData = formatUserData({
          firstName,
          lastName,
          username,
          bio,
          image,
        });

        if (accountType === 'individual') {
          return {
            ...userData,
            interests,
          };
        }

        return {
          ...userData,
          community: {
            name: communityName,
            description: communityDescription,
            privacy: communityPrivacy,
          },
        };
      },

      initFromUser: (user) => {
        if (!user) {
          return;
        }

        const nameParts = user.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        set({
          firstName,
          lastName,
          username: user.username || '',
          image: user.image || undefined,
          bio: user.bio || '',
        });
      },
    }),
    {
      name: 'profile-setup-storage',
      partialize: (state) => {
        const {
          setField,
          updateFields,
          setStep,
          nextStep,
          prevStep,
          setAccountType,
          resetStore,
          getFormattedData,
          initFromUser,
          ...rest
        } = state;

        return rest;
      },
    }
  )
);
