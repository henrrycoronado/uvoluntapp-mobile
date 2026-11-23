import { refreshToken as refreshTokenRequest } from '../api/generated';
import type { TokenResponse } from '../api/generated';
import { ApiError, SessionExpiredError } from '../api/errors';
import { REFRESH_SKEW_MS } from '../config/env';
import type { StoredSession, TokenStorage } from '../storage/tokenStorage';

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';
type Listener = (status: SessionStatus) => void;

/**
 * Dueño de los tokens: memoria + almacenamiento seguro.
 * Renueva el access token sin intervención (una sola renovación en vuelo)
 * y, si el refresh es rechazado, borra la sesión y avisa para volver al login.
 */
export class SessionManager {
  private session: StoredSession | null = null;
  private status: SessionStatus = 'loading';
  private inflight: Promise<string> | null = null;
  private listeners = new Set<Listener>();

  constructor(
    private readonly storage: TokenStorage,
    private readonly now: () => number = Date.now,
  ) {}

  getStatus(): SessionStatus {
    return this.status;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Restaura la sesión guardada al abrir la app. */
  async restore(): Promise<void> {
    try {
      this.session = await this.storage.load();
    } catch {
      this.session = null;
    }
    this.setStatus(this.session ? 'authenticated' : 'unauthenticated');
  }

  async startSession(tokens: TokenResponse): Promise<void> {
    this.session = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    };
    await this.storage.save(this.session);
    this.setStatus('authenticated');
  }

  getRefreshToken(): string | null {
    return this.session?.refreshToken ?? null;
  }

  async endSession(): Promise<void> {
    this.session = null;
    this.inflight = null;
    try {
      await this.storage.clear();
    } finally {
      this.setStatus('unauthenticated');
    }
  }

  /** Access token vigente; renueva antes si está por vencer. Null sin sesión. */
  async getAccessToken(): Promise<string | null> {
    if (!this.session) {
      return null;
    }
    const expiresIn = Date.parse(this.session.expiresAt) - this.now();
    if (Number.isNaN(expiresIn) || expiresIn <= REFRESH_SKEW_MS) {
      return this.refresh();
    }
    return this.session.accessToken;
  }

  /**
   * Renueva los tokens. Rechazo del servidor (400/401) => sesión terminada y
   * SessionExpiredError. Error de red => se propaga y la sesión se conserva.
   */
  refresh(): Promise<string> {
    if (!this.inflight) {
      this.inflight = this.doRefresh().finally(() => {
        this.inflight = null;
      });
    }
    return this.inflight;
  }

  private async doRefresh(): Promise<string> {
    const current = this.session?.refreshToken;
    if (!current) {
      throw new SessionExpiredError();
    }
    try {
      const tokens = await refreshTokenRequest({ refreshToken: current });
      await this.startSession(tokens);
      return tokens.accessToken;
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 400 || error.status === 401)
      ) {
        await this.endSession();
        throw new SessionExpiredError();
      }
      throw error;
    }
  }

  private setStatus(status: SessionStatus) {
    this.status = status;
    this.listeners.forEach(l => l(status));
  }
}
