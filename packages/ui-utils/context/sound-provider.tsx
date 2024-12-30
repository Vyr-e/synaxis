'use client';

import { type ReactNode, createContext, useState } from 'react';

interface SoundContextType {
  globalVolume: number;
  setGlobalVolume: (volume: number) => void;
}

export const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [globalVolume, setGlobalVolume] = useState(0.5);

  return (
    <SoundContext.Provider value={{ globalVolume, setGlobalVolume }}>
      {children}
    </SoundContext.Provider>
  );
}
