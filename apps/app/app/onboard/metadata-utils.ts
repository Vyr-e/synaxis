import type { Metadata } from 'next';

interface OnboardingMetadata extends Metadata {
  title: string;
  description: string;
}

const metadataMap: Record<string, OnboardingMetadata> = {
  initial: {
    title: 'Welcome to Synaxis | Onboarding',
    description:
      "Let's get your account set up. Choose your path to get started.",
  },
  'user-identity': {
    title: 'Create Your Identity | Onboarding',
    description: 'Tell us who you are and create your unique username.',
  },
  'user-profile': {
    title: 'Complete Your Profile | Onboarding',
    description: 'Set up your public profile so others can connect with you.',
  },
  'user-interests': {
    title: 'Select Your Interests | Onboarding',
    description:
      "Choose topics you're passionate about to personalize your experience.",
  },
  'brand-community': {
    title: 'Set Up Your Community | Onboarding',
    description:
      'Establish your brand presence and create a space for your audience on Synaxis.',
  },
  completion: {
    title: 'Setup Complete! | Synaxis',
    description: "You're all set. Welcome aboard!",
  },
  default: {
    title: 'Onboarding | Synaxis',
    description: 'Follow the steps to complete your Synaxis profile.',
  },
};

export function getOnboardingMetadata(
  slugs: string[] | undefined
): OnboardingMetadata {
  if (!slugs || slugs.length === 0) {
    return metadataMap.initial;
  }

  if (slugs[0] === 'completion') {
    return metadataMap.completion;
  }

  const key = slugs.join('-'); // e.g., 'user-profile'
  return metadataMap[key] || metadataMap.default;
}
