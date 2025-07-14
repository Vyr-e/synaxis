'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Separator } from '@repo/design-system/components/ui/separator';
import { captureException } from '@sentry/nextjs';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import type NextError from 'next/error';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

type ErrorPageProps = {
  readonly error?: NextError & { digest?: string };
  readonly reset?: () => void;
  readonly isNotFound?: boolean;
};

const ErrorPage = ({ error, reset, isNotFound = false }: ErrorPageProps) => {
  useEffect(() => {
    if (error) {
      captureException(error);
    }
  }, [error]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const errorCode = isNotFound ? '404' : '500';
  const title = isNotFound ? 'Page Not Found' : 'Something Went Wrong';
  const description = isNotFound
    ? 'The page you are looking for does not exist or has been moved.'
    : 'An unexpected error occurred. Please try again or contact support if the problem persists.';

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-4">
            {errorCode}
          </h1>
          <Separator className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-500 mx-auto rounded-full" />
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            {title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all duration-200 hover:shadow-lg flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>

          {reset && (
            <Button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all duration-200 hover:shadow-lg flex items-center gap-2 justify-center"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // For global error, wrap in html/body
  if (error && !isNotFound) {
    return (
      <html lang="en" className={inter.className}>
        <body>{content}</body>
      </html>
    );
  }

  return content;
};

// Export variants for different use cases
export const GlobalError = ({
  error,
  reset,
}: { error: NextError & { digest?: string }; reset: () => void }) => (
  <ErrorPage error={error} reset={reset} />
);

export const NotFoundPage = () => <ErrorPage isNotFound={true} />;

export default ErrorPage;
