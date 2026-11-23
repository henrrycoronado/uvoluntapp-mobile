import type { ProblemDetails } from './generated';

export const OFFLINE_MESSAGE =
  'Sin conexión: la operación no se realizó. Vuelve a intentarlo cuando tengas internet.';
export const INCOMPATIBLE_MESSAGE =
  'Esta versión de la aplicación no es compatible con el servidor. Actualiza la aplicación e inténtalo de nuevo.';
export const SERVER_MESSAGE =
  'El servicio no está disponible en este momento. La operación no se realizó; inténtalo más tarde.';
export const SESSION_EXPIRED_MESSAGE =
  'Tu sesión expiró. Inicia sesión nuevamente.';
export const GENERIC_MESSAGE =
  'No se pudo completar la operación. Inténtalo de nuevo.';

/** El dispositivo no pudo contactar al servidor. La operación NO se realizó y NO se encola. */
export class OfflineError extends Error {
  readonly userMessage = OFFLINE_MESSAGE;
  constructor() {
    super('offline');
    this.name = 'OfflineError';
  }
}

/** El refresh falló de forma definitiva: la app debe volver al inicio de sesión. */
export class SessionExpiredError extends Error {
  readonly userMessage = SESSION_EXPIRED_MESSAGE;
  constructor() {
    super('session-expired');
    this.name = 'SessionExpiredError';
  }
}

export class ApiError extends Error {
  readonly status: number;
  /** Cuerpo RFC 9457 si el servidor lo envió; para que las features decidan por `type`. */
  readonly problem?: ProblemDetails;
  readonly userMessage: string;

  constructor(status: number, problem?: ProblemDetails, userMessage?: string) {
    super(`api-error-${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.problem = problem;
    this.userMessage = userMessage ?? messageForStatus(status);
  }
}

/** Versión de API incompatible: 410/426 o respuesta que no cumple el contrato. */
export function incompatibleApiError(status = 426): ApiError {
  return new ApiError(status, undefined, INCOMPATIBLE_MESSAGE);
}

function messageForStatus(status: number): string {
  if (status === 410 || status === 426) {
    return INCOMPATIBLE_MESSAGE;
  }
  if (status >= 500) {
    return SERVER_MESSAGE;
  }
  if (status === 429) {
    return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  }
  return GENERIC_MESSAGE;
}

/** Mensaje comprensible para mostrar al usuario; nunca incluye detalles técnicos. */
export function toUserMessage(error: unknown): string {
  if (
    error instanceof OfflineError ||
    error instanceof SessionExpiredError ||
    error instanceof ApiError
  ) {
    return error.userMessage;
  }
  return GENERIC_MESSAGE;
}
