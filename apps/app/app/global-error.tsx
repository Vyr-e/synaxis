'use client';

import { captureException } from '@sentry/nextjs';
import type NextError from 'next/error';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

interface GlobalErrorProps {
  error: NextError & { digest?: string };
  reset: () => void;
}

// Global error boundary - only for critical app-level errors
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical errors to monitoring service
    captureException(error);
    console.error('Global error boundary triggered:', error);
  }, [error]);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <html lang="en" className={inter.className}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#000000' }}>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '32rem',
            margin: '0 auto',
          }}>
            {/* Error Display */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: 'clamp(4rem, 8vw, 6rem)',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #dc2626, #ea580c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                margin: 0,
              }}>
                Critical Error
              </h1>
              <div style={{
                width: '6rem',
                height: '0.25rem',
                background: 'linear-gradient(45deg, #dc2626, #ea580c)',
                margin: '0 auto',
                borderRadius: '9999px',
              }} />
            </div>

            {/* Error Message */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                margin: '0 0 1rem 0',
              }}>
                Application Error
              </h2>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.5',
                margin: 0,
              }}>
                A critical error occurred that prevented the application from working properly.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <button
                onClick={reset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(45deg, #dc2626, #ea580c)',
                  color: '#ffffff',
                  fontWeight: '500',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                }}
              >
                Try Again
              </button>

              <button
                onClick={handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '400',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
