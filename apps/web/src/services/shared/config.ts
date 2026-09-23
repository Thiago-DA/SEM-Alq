/**
 * shared/config.ts — el interruptor de mocks y la URL del backend.
 *
 * Qué es: las dos variables de entorno que deciden si los services hablan
 * con `apps/api` o devuelven datos de prueba. Conectar el backend es cambiar
 * `NEXT_PUBLIC_USE_MOCKS` a `false`, no reescribir services (ver
 * `docs/HANDOFF-BACKEND.md`, "Cómo conectar un endpoint").
 *
 * Quién lo usa: cada función de `services/*.service.ts` (rama mock o rama
 * real) y `shared/apiClient.ts`.
 *
 * NOTA: se lee `process.env.NEXT_PUBLIC_...` escrito así, literal. Next.js
 * reemplaza esas expresiones por su valor al compilar; si se leyeran de forma
 * dinámica (`process.env[nombre]`) llegarían `undefined` al navegador.
 */

/**
 * `true` (por defecto): los services devuelven datos del elenco
 * (`lib/mocks/`) con latencia simulada. `false`: llaman a `apps/api`.
 * Solo el texto exacto `'false'` apaga los mocks, así un valor vacío o mal
 * escrito nunca conecta el backend por accidente.
 */
export const USE_MOCKS: boolean = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false'

/** URL base de la API versionada. `apps/api` corre en el puerto 3000 (la web, en el 3001). */
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'
