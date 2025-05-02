'use client'; // This component needs to be a client component

import { QueryClient, type QueryClientProviderProps, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { useState } from 'react';

export function QueryProvider({ children }: Omit<QueryClientProviderProps, 'client'>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            networkMode: 'always',
          },
        },
      })
  );

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
