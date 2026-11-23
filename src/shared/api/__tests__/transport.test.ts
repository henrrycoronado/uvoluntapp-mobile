import { configure, getMyProfile } from '../generated';
import { ApiError, OfflineError, SessionExpiredError } from '../errors';
import { createTransport } from '../transport';
import { SessionManager } from '../../session/sessionManager';
import { FUTURE, jsonResponse, memoryStorage } from '../../testing/testUtils';

const fetchMock = jest.fn();
let manager: SessionManager;

const failure = (p: Promise<unknown>) =>
  p.then(
    () => {
      throw new Error('se esperaba un error');
    },
    (e: ApiError) => e,
  );

beforeEach(async () => {
  fetchMock.mockReset();
  (globalThis as { fetch: unknown }).fetch = fetchMock;
  manager = new SessionManager(
    memoryStorage({ accessToken: 'a1', refreshToken: 'r1', expiresAt: FUTURE }),
  );
  await manager.restore();
  configure({ baseUrl: 'http://api', fetch: createTransport(manager) });
});

describe('transport', () => {
  it('envía el Bearer en operaciones autenticadas', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { id: 'u' }));
    await getMyProfile();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer a1');
  });

  it('ante 401 renueva y reintenta una vez', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, {}))
      .mockResolvedValueOnce(
        jsonResponse(200, {
          accessToken: 'a2',
          refreshToken: 'r2',
          expiresAt: FUTURE,
        }),
      )
      .mockResolvedValueOnce(jsonResponse(200, { id: 'u' }));
    await expect(getMyProfile()).resolves.toEqual({ id: 'u' });
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe('Bearer a2');
  });

  it('si el refresh falla, lanza SessionExpiredError y cierra la sesión', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, {}))
      .mockResolvedValueOnce(jsonResponse(401, {}));
    await expect(getMyProfile()).rejects.toBeInstanceOf(SessionExpiredError);
    expect(manager.getStatus()).toBe('unauthenticated');
  });

  it('sin conexión lanza OfflineError y no reintenta ni encola', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    const err = await failure(getMyProfile());
    expect(err).toBeInstanceOf(OfflineError);
    expect(err.userMessage).toMatch(/no se realizó/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('error 500 muestra mensaje comprensible sin detalles técnicos', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(500, { detail: 'NullReferenceException at Foo.Bar' }),
    );
    const err = await failure(getMyProfile());
    expect(err).toBeInstanceOf(ApiError);
    expect(err.userMessage).not.toMatch(/NullReference|500/);
  });

  it('426 se informa como versión incompatible', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(426, {}));
    const err = await failure(getMyProfile());
    expect(err.userMessage).toMatch(/versión.*no es compatible/i);
  });

  it('respuesta 200 que no es JSON se trata como API incompatible', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200));
    const err = await failure(getMyProfile());
    expect(err.userMessage).toMatch(/no es compatible/i);
  });
});
