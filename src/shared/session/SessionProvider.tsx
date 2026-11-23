import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { logout as logoutRequest } from '../api/generated';
import type { TokenResponse } from '../api/generated';
import type { SessionManager, SessionStatus } from './sessionManager';

interface SessionContextValue {
  status: SessionStatus;
  signIn(tokens: TokenResponse): Promise<void>;
  signOut(): Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  manager,
  children,
}: {
  manager: SessionManager;
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<SessionStatus>(manager.getStatus());

  useEffect(() => {
    const unsubscribe = manager.subscribe(setStatus);
    manager.restore();
    return unsubscribe;
  }, [manager]);

  const signIn = useCallback(
    (tokens: TokenResponse) => manager.startSession(tokens),
    [manager],
  );

  const signOut = useCallback(async () => {
    const refreshToken = manager.getRefreshToken();
    try {
      if (refreshToken) {
        await logoutRequest({ refreshToken });
      }
    } catch {
      // Sin conexión o error: igual se cierra la sesión local.
    }
    await manager.endSession();
  }, [manager]);

  const value = useMemo(
    () => ({ status, signIn, signOut }),
    [status, signIn, signOut],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession debe usarse dentro de SessionProvider');
  }
  return ctx;
}
