'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { clashDisplay } from '@repo/design-system/fonts';
import { captureException } from '@sentry/nextjs';
import type NextError from 'next/error';
import { useEffect } from 'react';

type GlobalErrorProperties = {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang="en" className={clashDisplay.className}>
      <body className="mx-auto flex w-full items-center justify-center">
        <h1>Oops, something went wrong</h1>
        <Button
          onClick={() => reset()}
          className="rounded-full bg-black px-4 py-2"
        >
          Try again
        </Button>
      </body>
    </html>
  );
};

export default GlobalError;
