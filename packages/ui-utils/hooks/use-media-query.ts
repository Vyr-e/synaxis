'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  // Default to false for SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Skip if not in browser
    // biome-ignore lint/style/useBlockStatements: <quick return statement>
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', listener);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
