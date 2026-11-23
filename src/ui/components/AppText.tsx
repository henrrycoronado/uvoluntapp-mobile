import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../theme';
import type { TypographyVariant } from '../tokens';

interface Props extends TextProps {
  variant?: TypographyVariant;
  muted?: boolean;
}

export function AppText({ variant = 'body', muted, style, ...rest }: Props) {
  const { colors, typography } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        typography[variant],
        { color: muted ? colors.textMuted : colors.text },
        style,
      ]}
    />
  );
}
