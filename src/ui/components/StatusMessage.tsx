import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

interface Props {
  kind: 'error' | 'offline';
  message: string;
  onRetry?: () => void;
}

/** Estado de error / sin conexión reutilizable por todas las pantallas. */
export function StatusMessage({ kind, message, onRetry }: Props) {
  const { colors, radius, spacing } = useTheme();
  const isOffline = kind === 'offline';
  return (
    <View
      accessibilityRole="alert"
      style={{
        backgroundColor: isOffline
          ? colors.warningBackground
          : colors.errorBackground,
        borderRadius: radius.md,
        padding: spacing.md,
        gap: spacing.md,
      }}
    >
      <AppText style={{ color: isOffline ? colors.warning : colors.error }}>
        {message}
      </AppText>
      {onRetry ? <AppButton label="Reintentar" onPress={onRetry} /> : null}
    </View>
  );
}
