import React from 'react';
import { AppText, Screen } from '../../ui';

/** Marcador de posición: el formulario de acceso se implementa en HU-MOV-02. */
export function SignInScreen() {
  return (
    <Screen>
      <AppText variant="title">Uvoluntapp</AppText>
      <AppText muted>Inicia sesión para continuar.</AppText>
    </Screen>
  );
}
