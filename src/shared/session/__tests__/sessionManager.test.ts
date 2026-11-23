import { configure } from '../../api/generated';
import { createTransport } from '../../api/transport';
import { OfflineError, SessionExpiredError } from '../../api/errors';
import { SessionManager } from '../sessionManager';
import {
  FUTURE,
  PAST,
  jsonResponse,
  memoryStorage,
} from '../../testing/testUtils';

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  (globalThis as { fetch: unknown }).fetch = fetchMock;
});

function setup(
  initial = { accessToken: 'a1', refreshToken: 'r1', expiresAt: PAST },
) {
  const storage = memoryStorage(initial);
  const manager = new SessionManager(storage);
  configure({ baseUrl: 'http://api', fetch: createTransport(manager) });
  return { storage, manager };
}

const newTokens = { accessToken: 'a2', refreshToken: 'r2', expiresAt: FUTURE };

describe('SessionManager', () => {
  it('restaura la sesión guardada', async () => {
    const { manager } = setup();
    await manager.restore();
    expect(manager.getStatus()).toBe('authenticated');
  });

  it('sin sesión guardada queda unauthenticated', async () => {
    const manager = new SessionManager(memoryStorage(null));
    await manager.restore();
    expect(manager.getStatus()).toBe('unauthenticated');
  });

  it('renueva el token vencido, guarda el par rotado y devuelve el nuevo', async () => {
    const { manager, storage } = setup();
    await manager.restore();
    fetchMock.mockResolvedValueOnce(jsonResponse(200, newTokens));
    await expect(manager.getAccessToken()).resolves.toBe('a2');
    expect(fetchMock.mock.calls[0][0]).toBe('http://api/auth/refresh');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      refreshToken: 'r1',
    });
    expect(storage.current()).toEqual(newTokens);
  });

  it('una sola renovación en vuelo ante llamadas concurrentes', async () => {
    const { manager } = setup();
    await manager.restore();
    fetchMock.mockResolvedValue(jsonResponse(200, newTokens));
    await Promise.all([manager.getAccessToken(), manager.getAccessToken()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('si el refresh es rechazado borra la sesión y vuelve a unauthenticated', async () => {
    const { manager, storage } = setup();
    await manager.restore();
    fetchMock.mockResolvedValueOnce(jsonResponse(401, { status: 401 }));
    await expect(manager.refresh()).rejects.toBeInstanceOf(SessionExpiredError);
    expect(manager.getStatus()).toBe('unauthenticated');
    expect(storage.current()).toBeNull();
  });

  it('si el refresh falla por falta de red conserva la sesión', async () => {
    const { manager, storage } = setup();
    await manager.restore();
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    await expect(manager.refresh()).rejects.toBeInstanceOf(OfflineError);
    expect(manager.getStatus()).toBe('authenticated');
    expect(storage.current()).not.toBeNull();
  });
});
