import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock auth client
vi.mock('@repo/auth/client', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  authClient: {
    signIn: {
      social: vi.fn(),
      email: vi.fn(),
    },
    signUp: {
      email: vi.fn(),
    },
  },
})); 