/**
 * Tokens base del sistema de diseño.
 * Provisionales: alinear con Figma cuando se enlace el archivo de diseño de la tarea.
 */
export const colors = {
  primary: '#1B4F9C',
  onPrimary: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F4F6FA',
  text: '#14213D',
  textMuted: '#5B6472',
  border: '#D5DAE3',
  error: '#B3261E',
  errorBackground: '#FCEAE8',
  warning: '#8A5A00',
  warningBackground: '#FFF4DB',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 6, md: 12, lg: 20 } as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
} as const;

export type Colors = typeof colors;
export type TypographyVariant = keyof typeof typography;
