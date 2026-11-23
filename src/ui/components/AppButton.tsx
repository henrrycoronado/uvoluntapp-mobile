import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { AppText } from './AppText';

interface Props {
  label: string;
  onPress(): void;
  loading?: boolean;
  disabled?: boolean;
}

export function AppButton({ label, onPress, loading, disabled }: Props) {
  const { colors, radius, spacing } = useTheme();
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        },
        inactive && styles.inactive,
        {},
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <AppText style={[styles.label, { color: colors.onPrimary }]}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inactive: { opacity: 0.6 },
  label: { fontWeight: '600' },
  base: { alignItems: 'center', justifyContent: 'center', minHeight: 48 },
});
