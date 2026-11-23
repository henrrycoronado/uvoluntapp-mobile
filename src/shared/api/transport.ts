import type { FetchImpl } from './generated';
import {
  ApiError,
  OfflineError,
  SessionExpiredError,
  incompatibleApiError,
} from './errors';
import type { ProblemDetails } from './generated';
import type { SessionManager } from '../session/sessionManager';
import { REQUEST_TIMEOUT_MS } from '../config/env';

const PUBLIC_PATHS = ['/auth/login', '/auth/refresh'];

interface Init {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

async function rawFetch(url: string, init: Init): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    // Sin red, DNS, timeout: la operación no se realizó. Nunca se encola.
    throw new OfflineError();
  } finally {
    clearTimeout(timer);
  }
}

async function readProblem(res: Response): Promise<ProblemDetails | undefined> {
  try {
    const data: unknown = await res.json();
    return typeof data === 'object' && data !== null
      ? (data as ProblemDetails)
      : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Transporte para el cliente generado: agrega el Bearer, renueva una vez ante 401,
 * traduce fallos a ApiError/OfflineError/SessionExpiredError y valida el contrato.
 */
export function createTransport(session: SessionManager): FetchImpl {
  return async (url, init) => {
    const isPublic = PUBLIC_PATHS.some(p => url.includes(p));

    const send = async (): Promise<Response> => {
      const headers = { ...init.headers };
      if (!isPublic) {
        const token = await session.getAccessToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }
      return rawFetch(url, { ...init, headers });
    };

    let res = await send();
    if (res.status === 401 && !isPublic && session.getRefreshToken()) {
      await session.refresh(); // lanza SessionExpiredError si fue rechazado
      res = await send();
      if (res.status === 401) {
        await session.endSession();
        throw new SessionExpiredError();
      }
    }

    if (!res.ok) {
      throw new ApiError(res.status, await readProblem(res));
    }
    const contentType = res.headers.get('content-type') ?? '';
    if (res.status !== 204 && !contentType.includes('json')) {
      throw incompatibleApiError(res.status);
    }
    return res;
  };
}
