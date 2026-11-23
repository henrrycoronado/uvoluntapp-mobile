import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SessionManager } from '../../shared/session/sessionManager';
import { SessionProvider } from '../../shared/session/SessionProvider';
import { FUTURE, memoryStorage } from '../../shared/testing/testUtils';
import { ThemeProvider } from '../../ui';
import { RootNavigator } from '../navigation/RootNavigator';

async function renderApp(manager: SessionManager) {
  return await render(
    <ThemeProvider>
      <SessionProvider manager={manager}>
        <RootNavigator />
      </SessionProvider>
    </ThemeProvider>,
  );
}

describe('navegación según sesión', () => {
  it('sin sesión muestra inicio de sesión', async () => {
    await renderApp(new SessionManager(memoryStorage(null)));
    expect(
      await screen.findByText('Inicia sesión para continuar.'),
    ).toBeTruthy();
  });

  it('con sesión guardada muestra Home', async () => {
    const m = new SessionManager(
      memoryStorage({ accessToken: 'a', refreshToken: 'r', expiresAt: FUTURE }),
    );
    await renderApp(m);
    expect(await screen.findByText('Cerrar sesión')).toBeTruthy();
  });
});
