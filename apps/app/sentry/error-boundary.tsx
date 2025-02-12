'use client';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/nextjs';
import type { ReactNode } from 'react';

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <SentryErrorBoundary
      fallback={({ error }) => (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="font-bold text-2xl">Something went wrong</h1>
            <p className="mt-2 text-gray-600">{(error as Error).message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-black px-4 py-2 text-white hover:bg-black/95"
              type="button"
            >
              Try again
            </button>
          </div>
        </div>
      )}
      onError={(error) => {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error('React Error Boundary caught an error', {
          error: (error as Error).message,
          stack: (error as Error).stack,
        });
      }}
    >
      {children}
    </SentryErrorBoundary>
  );
}
