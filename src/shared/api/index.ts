import { configure } from './generated';
import { createTransport } from './transport';
import { API_BASE_URL } from '../config/env';
import { SessionManager } from '../session/sessionManager';
import { keychainTokenStorage } from '../storage/tokenStorage';

export const sessionManager = new SessionManager(keychainTokenStorage);

/** Conecta el cliente generado con la sesión segura. Llamar una vez al iniciar la app. */
export function setupApi(): void {
  configure({
    baseUrl: API_BASE_URL,
    fetch: createTransport(sessionManager),
  });
}

export * from './generated';
export * from './errors';
