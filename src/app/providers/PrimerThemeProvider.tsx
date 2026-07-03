'use client';

import type { ReactNode } from 'react';

import { ThemeProvider } from '@primer/react';
import { ThemeProvider as BrandThemeProvider } from '@primer/react-brand';

import { useColorMode } from './ColorModeProvider';

interface PrimerThemeProviderProps {
  children: ReactNode;
}

export const PrimerThemeProvider = ({ children }: PrimerThemeProviderProps) => {
  const { colorMode } = useColorMode();

  return (
    <ThemeProvider colorMode={colorMode} contextOnly>
      <BrandThemeProvider colorMode={colorMode}>{children}</BrandThemeProvider>
    </ThemeProvider>
  );
};
