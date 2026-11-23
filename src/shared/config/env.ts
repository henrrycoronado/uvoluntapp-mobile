/**
 * Configuración de entorno. Android emulador accede al host por 10.0.2.2.
 * Producción debe usar HTTPS (el manifest solo permite cleartext en debug).
 */
const DEV_API_BASE_URL = 'http://10.0.2.2:5207/api/v1';
const PROD_API_BASE_URL = 'https://api.uvoluntapp.example/api/v1';

export const API_BASE_URL = __DEV__ ? DEV_API_BASE_URL : PROD_API_BASE_URL;
export const REQUEST_TIMEOUT_MS = 15000;
/** Renovar el access token si le quedan menos de estos ms de vida. */
export const REFRESH_SKEW_MS = 30000;
