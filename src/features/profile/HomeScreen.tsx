import React from 'react';
import { useSession } from '../../shared/session/SessionProvider';
import { AppButton, AppText, Screen } from '../../ui';

/** Marcador de posición de la pantalla principal autenticada. */
export function HomeScreen() {
  const { signOut } = useSession();
  return (
    <Screen>
      <AppText variant="title">Inicio</AppText>
      <AppButton label="Cerrar sesión" onPress={signOut} />
    </Screen>
  );
}
