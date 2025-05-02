import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FormData = {
  username: string;
  firstName: string;
  lastName: string;
  accountType: string;
  bio: string;
  profilePicture: File | null; // Temporary file for upload
  profilePictureUrl: string; // URL reference after upload
  profilePicturePreview: string;
  bannerColor: string;
  interests: string[];
  // Social media
  instagram: string;
  twitter: string;
  facebook: string;
  // Brand specific
  brandName: string;
  brandDescription: string;
  website: string;
  communityPrivacy: 'public' | 'private';
};

// Add validation state
type ValidationState = {
  isCurrentStepValid: boolean;
  validationErrors: Record<string, string>;
};

type FormStore = {
  formData: FormData;
  // Validation state
  isCurrentStepValid: boolean;
  validationErrors: Record<string, string>;
  // Form actions
  setFormData: (data: Partial<FormData>) => void;
  setField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  setProfilePicture: (file: File | null, url: string) => void;
  // Add toggleInterest action type
  toggleInterest: (interest: string) => void;
  // Validation actions
  setValidation: (isValid: boolean) => void;
  setValidationError: (field: string, error: string | null) => void;
  validateCurrentStep: (stepType: 'user' | 'brand', subStep: string) => boolean;
  // Reset
  clear: () => void;
};

const initialFormData: FormData = {
  username: '',
  firstName: '',
  lastName: '',
  accountType: '',
  bio: '',
  profilePicture: null,
  profilePictureUrl: '',
  profilePicturePreview: '',
  bannerColor: '#0057FF',
  interests: [],
  // Social media
  instagram: '',
  twitter: '',
  facebook: '',
  // Brand specific
  brandName: '',
  brandDescription: '',
  website: '',
  communityPrivacy: 'public',
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

      setFormData: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
          },
        })),

      setField: (field, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        })),

      setProfilePicture: (file, url) =>
        set((state) => ({
          formData: {
            ...state.formData,
            profilePicture: file,
            profilePictureUrl: url,
            profilePicturePreview: file ? URL.createObjectURL(file) : url,
          },
        })),

      // Add toggleInterest implementation
      toggleInterest: (interest) =>
        set((state) => {
          const currentInterests = state.formData.interests;
          const newInterests = currentInterests.includes(interest)
            ? currentInterests.filter((i) => i !== interest)
            : [...currentInterests, interest];
          return {
            formData: {
              ...state.formData,
              interests: newInterests,
            },
          };
        }),

      // Validation methods
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

      validateCurrentStep: (stepType, subStep) => {
        const { formData } = get();
        let isValid = false;

        // Step-specific validation logic
        if (stepType === 'user') {
          if (subStep === 'profile') {
            // Validate user profile fields
            isValid = Boolean(
              formData.username &&
                formData.firstName &&
                formData.lastName &&
                formData.bio
            );
          } else if (subStep === 'interests') {
            // Validate interests
            isValid = formData.interests.length > 0;
          }
        } else if (stepType === 'brand' && subStep === 'profile') {
          // Validate brand profile fields
          isValid = Boolean(formData.brandName && formData.brandDescription);
        }

        // Update the validation state
        set({ isCurrentStepValid: isValid });
        return isValid;
      },

      clear: () =>
        set({
          formData: { ...initialFormData },
          ...initialValidation,
        }),
    }),
    {
      name: 'user-setup-form',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: {
          ...state.formData,
          profilePicture: null, // Don't store the File object
        },
        // Don't persist validation state
        // isCurrentStepValid and validationErrors are omitted
      }),
    }
  )
);
