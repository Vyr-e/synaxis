import type { Metadata } from 'next';

const metadataMap: Record<string, Metadata> = {
  'sign-in': {
    title: 'Sign In',
    description: 'Access your Synaxis account.',
  },
  'sign-up': {
    title: 'Sign Up',
    description: 'Create a new account to join Synaxis.',
  },
  'reset-password': {
    title: 'Reset Password',
    description: 'Set a new password for your account.',
  },
  'forgot-password': {
    title: 'Forgot Password',
    description: 'Recover access to your Synaxis account.',
  },
  verify: {
    title: 'Verify Your Email',
    description: 'Complete your registration by verifying your email address.',
  },
  verified: {
    title: 'Email Verified',
    description: 'Your email has been successfully verified. Welcome aboard!',
  },
  default: {
    title: 'Authentication',
    description: 'Authentication for Synaxis.',
  },
};

export function getAuthMetadata(page: keyof typeof metadataMap): Metadata {
  return metadataMap[page] || metadataMap.default;
}
