import React, { createContext, useContext } from 'react';
import { colors, radius, spacing, typography } from './tokens';

export const theme = { colors, spacing, radius, typography };
export type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = (): Theme => useContext(ThemeContext);
