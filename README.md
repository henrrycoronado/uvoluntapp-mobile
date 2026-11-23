# uvoluntapp-mobile

App móvil de Uvoluntapp (React Native CLI + TypeScript, sin Expo; Android primero).
Reglas del repositorio: ver `AGENTS.md`.

## Comandos
| Comando | Uso |
| --- | --- |
| `npm run android` | Compila y ejecuta en dispositivo/emulador |
| `npm run lint` · `npm run typecheck` · `npm test` | Verificaciones (también en pre-commit/CI) |
| `npm run gen:api` | Copia `contracts/openapi.yaml` del backend y regenera `src/shared/api/generated` (no editar a mano) |
| `npm run android:release` | APK release → `android/app/build/outputs/apk/release/` |

## APK de prueba firmado
Define (variables de entorno o `~/.gradle/gradle.properties`, nunca en el repo):
`UVOLUNTAPP_STORE_FILE`, `UVOLUNTAPP_STORE_PASSWORD`, `UVOLUNTAPP_KEY_ALIAS`, `UVOLUNTAPP_KEY_PASSWORD`.
Sin ellas, release se firma con el keystore debug (solo desarrollo).
Verificar: `apksigner verify --print-certs app-release.apk`.

## Estructura
`src/app` (navegación, providers) · `src/ui` (tokens y componentes) · `src/shared` (cliente HTTP, sesión, almacenamiento seguro) · `src/features/<módulo>`.

## Sesión y conectividad
- Tokens en Android Keystore (`react-native-keychain`), nunca en texto plano; `allowBackup=false`.
- Renovación automática (previa al vencimiento y ante 401, una sola en vuelo). Refresh rechazado ⇒ sesión borrada y vuelta a inicio de sesión. Fallo de red durante refresh ⇒ se conserva la sesión.
- Sin conexión: `OfflineError` ("la operación no se realizó"); no hay colas ni reintentos diferidos.
- Errores del servidor / versión incompatible: mensajes genéricos en `src/shared/api/errors.ts`, sin detalles técnicos.
