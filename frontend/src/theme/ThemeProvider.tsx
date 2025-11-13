import { ReactNode, useEffect } from 'react';

import { defaultTheme } from './defaultTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

const CSS_VARIABLES = {
  '--accent': 'accent',
  '--accent-muted': 'accentMuted',
  '--accent-text': 'accentText',
  '--surface': 'surface',
  '--surface-subtle': 'surfaceSubtle',
  '--text-primary': 'textPrimary',
  '--text-muted': 'textMuted',
  '--border-subtle': 'borderSubtle',
  '--danger-muted': 'dangerMuted',
  '--danger-text': 'dangerText',
  '--shadow-xs': 'shadowXs',
  '--shadow-sm': 'shadowSm',
  '--shadow-lg': 'shadowLg'
} as const;

type ThemeVariableKey = keyof typeof CSS_VARIABLES;

type ThemeKey = (typeof CSS_VARIABLES)[ThemeVariableKey];

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(CSS_VARIABLES).forEach(([cssVar, themeKey]) => {
      root.style.setProperty(cssVar, defaultTheme[themeKey as ThemeKey]);
    });
  }, []);

  return <>{children}</>;
};
