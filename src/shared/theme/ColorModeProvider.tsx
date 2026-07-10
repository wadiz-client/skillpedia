'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

interface ColorModeProviderProps {
  children: ReactNode;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export const useColorMode = () => {
  const context = useContext(ColorModeContext);

  if (context) {
    return context;
  }

  throw new Error('useColorMode는 ColorModeProvider 안에서 사용해야 합니다.');
};

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [colorMode, setColorMode] = useState<ColorMode>('light');

  const toggleColorMode = () => {
    setColorMode((mode) => {
      return mode === 'light' ? 'dark' : 'light';
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', colorMode);
  }, [colorMode]);

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setColorMode(isDarkMode ? 'dark' : 'light');
  }, []);

  return <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>{children}</ColorModeContext.Provider>;
};
