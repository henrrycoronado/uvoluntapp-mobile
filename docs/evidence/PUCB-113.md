# Evidencia PUCB-113 · Base React Native y sesión segura

Verificado localmente (2026-11-23): `npm run lint` OK · `npm run typecheck` OK · `npm test` 15/15 OK.

| Criterio | Estado | Evidencia |
| --- | --- | --- |
| 1. APK de prueba firmado instalable en Android | **PENDIENTE** | Firma release configurada en `android/app/build.gradle` (variables `UVOLUNTAPP_*`). El build `assembleRelease` fue interrumpido por falta de memoria del sistema; no hay APK ni prueba en dispositivo real. |
| 2. Tokens en almacenamiento seguro; renovación automática; refresh fallido ⇒ login | Cumplido en pruebas unitarias (falta dispositivo real) | `src/shared/storage/tokenStorage.ts` (Keychain), `sessionManager.test.ts`, `transport.test.ts`, `App.test.tsx` |
| 3. Sin conexión: informa que no se realizó, sin colas | Cumplido en pruebas unitarias | `OfflineError`; test "sin conexión lanza OfflineError y no reintenta ni encola" |
| 4. API incompatible / error de servidor con mensaje comprensible | Parcial | Mensajes en `errors.ts` (500, 410/426, respuesta no JSON). **Brecha de contrato**: `openapi.yaml` no define mecanismo de versión de API; proponer ajuste en `uvoluntapp-backend`. |

Otras notas: tokens de diseño provisionales (la tarea no enlaza Figma); `.github/` (CI) no se tocó, por regla de AGENTS.md.
