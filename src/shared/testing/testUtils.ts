import type { TokenStorage, StoredSession } from '../storage/tokenStorage';

export function memoryStorage(initial: StoredSession | null = null) {
  let data = initial;
  const storage: TokenStorage & { current(): StoredSession | null } = {
    load: jest.fn(async () => data),
    save: jest.fn(async (s: StoredSession) => {
      data = s;
    }),
    clear: jest.fn(async () => {
      data = null;
    }),
    current: () => data,
  };
  return storage;
}

export const jsonResponse = (status: number, body?: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: (h: string) =>
        h.toLowerCase() === 'content-type' && body !== undefined
          ? 'application/json'
          : null,
    },
    json: async () => body,
  } as unknown as Response);

export const FUTURE = new Date(Date.now() + 3600_000).toISOString();
export const PAST = new Date(Date.now() - 3600_000).toISOString();
