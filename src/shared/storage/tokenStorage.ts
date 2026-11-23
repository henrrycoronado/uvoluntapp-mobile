import * as Keychain from 'react-native-keychain';

const SERVICE = 'uvoluntapp.session';

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  /** ISO-8601 UTC del vencimiento del access token. */
  expiresAt: string;
}

export interface TokenStorage {
  load(): Promise<StoredSession | null>;
  save(session: StoredSession): Promise<void>;
  clear(): Promise<void>;
}

function isStoredSession(value: unknown): value is StoredSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.accessToken === 'string' &&
    typeof v.refreshToken === 'string' &&
    typeof v.expiresAt === 'string'
  );
}

/** Almacenamiento seguro (Android Keystore vía react-native-keychain). Nunca texto plano. */
export const keychainTokenStorage: TokenStorage = {
  async load() {
    const creds = await Keychain.getGenericPassword({ service: SERVICE });
    if (!creds) {
      return null;
    }
    try {
      const parsed: unknown = JSON.parse(creds.password);
      return isStoredSession(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },
  async save(session) {
    await Keychain.setGenericPassword('session', JSON.stringify(session), {
      service: SERVICE,
      accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
  },
  async clear() {
    await Keychain.resetGenericPassword({ service: SERVICE });
  },
};
