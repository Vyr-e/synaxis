import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FormData = {
  username: string;
  firstName: string;
  lastName: string;
  accountType: string;
  bio?: string;
  profilePicture: File | null;
  profilePictureUrl?: string;
  profilePicturePreview?: string;
  bannerColor?: string;
  interests?: string[];
  instagram?: string;
  twitter?: string;
  facebook?: string;
  brandName?: string;
  brandDescription?: string;
  website?: string;
  communityPrivacy?: 'public' | 'private';
  slug?: string;
  logo?: string;
  isPrivate?: boolean;
  brandColor?: string;
  location?: string;
  linkedin?: string;
  isProfilePublic?: boolean;
  showLocation?: boolean;
  allowMessages?: boolean;
  generatedAvatarMetadata: string | null;
};

type ValidationState = {
  isCurrentStepValid: boolean;
  validationErrors: Record<string, string>;
};

type FormStore = {
  formData: FormData;
  isCurrentStepValid: boolean;
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
  isComplete: boolean;
  setFormData: (data: Partial<FormData>) => void;
  setField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  setProfilePicture: (file: File | null, url: string) => void;
  setGeneratedAvatar: (metadata: string) => void;
  clearAvatar: () => void;
  toggleInterest: (interest: string) => void;
  setValidation: (isValid: boolean) => void;
  setValidationError: (field: string, error: string | null) => void;
  validateCurrentStep: (stepType: 'user' | 'brand', subStep: string) => boolean;
  // Add a computed validation getter
  getStepValidation: (stepType: 'user' | 'brand', subStep: string) => boolean;
  setSubmitting: (isSubmitting: boolean) => void;
  setComplete: (isComplete: boolean) => void;
  clear: () => void;
};

const initialFormData: FormData = {
  username: '',
  firstName: '',
  lastName: '',
  accountType: 'user', // Default to user account
  bio: '',
  profilePicture: null,
  profilePictureUrl: '',
  profilePicturePreview: '',
  bannerColor: '#0057FF',
  interests: [],
  instagram: '',
  twitter: '',
  facebook: '',
  brandName: '',
  brandDescription: '',
  website: '',
  communityPrivacy: 'public',
  slug: '',
  logo: '',
  isPrivate: false,
  brandColor: '#0057FF',
  location: '',
  linkedin: '',
  isProfilePublic: true,
  showLocation: true,
  allowMessages: true,
  generatedAvatarMetadata: null,
};

const initialValidation: ValidationState = {
  isCurrentStepValid: false,
  validationErrors: {},
};

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      formData: { ...initialFormData },
      ...initialValidation,
      isSubmitting: false,
      isComplete: false,

      setFormData: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
          },
        })),

      setField: (field, value) =>
        set((state) => {
          const newFormData = {
            ...state.formData,
            [field]: value,
          };

          // Auto-validate after field update
          const newState = { formData: newFormData };

          // You could add auto-validation here if needed
          // For now, we'll rely on the computed getter

          return newState;
        }),

      setProfilePicture: (file, url) =>
        set((state) => ({
          formData: {
            ...state.formData,
            profilePicture: file,
            profilePictureUrl: url,
            profilePicturePreview: file ? URL.createObjectURL(file) : url,
            generatedAvatarMetadata: null, // Clear generated avatar when uploading
          },
        })),

      setGeneratedAvatar: (metadata) =>
        set((state) => ({
          formData: {
            ...state.formData,
            generatedAvatarMetadata: metadata,
            profilePicture: null,
            profilePictureUrl: '',
            profilePicturePreview: '',
          },
        })),

      clearAvatar: () =>
        set((state) => ({
          formData: {
            ...state.formData,
            profilePicture: null,
            profilePictureUrl: '',
            profilePicturePreview: '',
            generatedAvatarMetadata: null,
          },
        })),

      toggleInterest: (interest) =>
        set((state) => {
          const currentInterests = state.formData.interests;
          const newInterests = currentInterests?.includes(interest)
            ? currentInterests.filter((i) => i !== interest)
            : [...(currentInterests || []), interest];
          return {
            formData: {
              ...state.formData,
              interests: newInterests,
            },
          };
        }),

      setValidation: (isValid) =>
        set(() => ({
          isCurrentStepValid: isValid,
        })),

      setValidationError: (field, error) =>
        set((state) => ({
          validationErrors: {
            ...state.validationErrors,
            [field]: error || '',
          },
        })),

      // Keep the original validateCurrentStep for explicit validation
      validateCurrentStep: (stepType, subStep) => {
        const isValid = get().getStepValidation(stepType, subStep);
        set({ isCurrentStepValid: isValid });
        return isValid;
      },

      // Add a synchronous getter that doesn't trigger state updates
      getStepValidation: (stepType, subStep) => {
        const { formData } = get();

        const validations: Record<string, Record<string, () => boolean>> = {
          user: {
            identity: () =>
              Boolean(
                formData.username &&
                  formData.username.length >= 3 &&
                  formData.firstName &&
                  formData.firstName.trim().length >= 2 &&
                  formData.lastName &&
                  formData.lastName.trim().length >= 2
              ),
            profile: () =>
              Boolean(
                formData.username &&
                  formData.firstName &&
                  formData.lastName &&
                  formData.bio
              ),
            interests: () => (formData.interests?.length ?? 0) > 0,
          },
          brand: {
            profile: () =>
              Boolean(
                formData.brandName &&
                  formData.brandName.trim().length >= 2 &&
                  formData.brandDescription &&
                  formData.brandDescription.trim().length >= 10 &&
                  formData.slug &&
                  formData.slug.trim().length >= 3
              ),
          },
        };

        return validations[stepType]?.[subStep]?.() ?? false;
      },

      setSubmitting: (isSubmitting) =>
        set(() => ({
          isSubmitting,
        })),

      setComplete: (isComplete) =>
        set(() => ({
          isComplete,
        })),

      clear: () =>
        set({
          formData: { ...initialFormData },
          ...initialValidation,
          isSubmitting: false,
          isComplete: false,
        }),
    }),
    {
      name: 'user-setup-form',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: {
          ...state.formData,
          profilePicture: null,
        },
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { formData } = state;
          if (formData.username && formData.username.length >= 3) {
            state.setValidation(true);
          }
          // Reset submission states on rehydration
          state.setSubmitting(false);
          state.setComplete(false);
        }
      },
    }
  )
);
