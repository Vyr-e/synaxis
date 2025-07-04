import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { middleware } from '../middleware';

vi.mock('@repo/auth/server', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('@repo/security/middleware', () => ({
  noseconeMiddleware: vi.fn(() => vi.fn()),
  noseconeConfig: {},
}));

vi.mock('@repo/env', () => ({
  env: {
    NODE_ENV: 'test',
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}));

const { auth } = await import('@repo/auth/server');
const { env } = await import('@repo/env');
const { NextRequest, NextResponse } = await import('next/server');

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-expect-error - We are mutating the env for test purposes
    env.NODE_ENV = 'test';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createRequest = (pathname: string) => {
    const url = new URL(`http://localhost:3000${pathname}`);
    return new NextRequest(url);
  };

  describe('Onboarding routes', () => {
    test('should allow access for unauthenticated user', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue(null);
      const request = createRequest('/onboard');
      const response = await middleware(request);
      expect(response.status).toBe(NextResponse.next().status);
    });

    test('should redirect to home if onboarding is completed', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue({
        user: { emailVerified: true, userProfileStep: 'completed' },
      });
      const request = createRequest('/onboard');
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/');
    });

    test('should redirect to verify-email if email is not verified', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue({
        user: { emailVerified: false, userProfileStep: 'started' },
      });
      const request = createRequest('/onboard');
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/auth/verify-email'
      );
    });

    test('should allow access if onboarding is not completed and email is verified', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue({
        user: { emailVerified: true, userProfileStep: 'started' },
      });
      const request = createRequest('/onboard');
      const response = await middleware(request);
      expect(response.status).toBe(NextResponse.next().status);
    });
  });

  describe('Public routes', () => {
    test('should allow access to public routes for unauthenticated users', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue(null);
      const request = createRequest('/auth/sign-in');
      const response = await middleware(request);
      expect(response.status).toBe(NextResponse.next().status);
    });

    test('should allow access to public routes for authenticated users', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue({ user: {} });
      const request = createRequest('/auth/sign-in');
      const response = await middleware(request);
      expect(response.status).toBe(NextResponse.next().status);
    });
  });

  describe('Protected routes', () => {
    test('should redirect unauthenticated users to sign-in', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue(null);
      const request = createRequest('/dashboard');
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/auth/sign-in'
      );
    });

    test('should allow authenticated users to access', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue({
        user: { emailVerified: true, userProfileStep: 'completed' },
      });
      const request = createRequest('/dashboard');
      const response = await middleware(request);
      expect(response.status).toBe(NextResponse.next().status);
    });
  });

  describe('Production environment', () => {
    test('should redirect unauthenticated users to sign-in for non-root path', async () => {
      // @ts-expect-error - We are mutating the env for test purposes
      env.NODE_ENV = 'production';
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue(null);
      const request = createRequest('/some-page');
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/auth/sign-in'
      );
    });

    // test('should allow access to root path for unauthenticated users in production', async () => {
    //   // @ts-expect-error - We are mutating the env for test purposes
    //   env.NODE_ENV = 'production';
    //   // @ts-expect-error - We are mocking the session for test purposes
    //   auth.api.getSession.mockResolvedValue(null);
    //   const request = createRequest('/');
    //   const response = await middleware(request);
    //   expect(response.status).toBe(NextResponse.next().status);
    // });
  });

  describe('Security Middleware', () => {
    test('should continue processing if noseconeMiddleware throws an error', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const { noseconeMiddleware } = await import('@repo/security/middleware');
      const mockError = new Error('Nosecone failed');
      // @ts-expect-error - We are mocking the implementation for test purposes
      noseconeMiddleware.mockImplementation(() => {
        return vi.fn().mockRejectedValue(mockError);
      });

      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue(null);
      const request = createRequest('/');
      const response = await middleware(request);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Nosecone Middleware Error:',
        mockError
      );
      expect(response.status).toBe(NextResponse.next().status);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Path Edge Cases', () => {
    test('should treat a deep auth path as a public route', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue(null);
      const request = createRequest('/auth/sign-in/magic-link');
      const response = await middleware(request);
      expect(response.status).toBe(NextResponse.next().status);
    });

    test('should handle protected routes with query parameters', async () => {
      // @ts-expect-error - We are mocking the session for test purposes
      auth.api.getSession.mockResolvedValue(null);
      const request = createRequest('/dashboard?from=email');
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/auth/sign-in'
      );
    });
  });
});
