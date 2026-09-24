/**
 * shared/apiClient.ts — el único cliente HTTP del frontend.
 *
 * Qué es: la función que usa la rama real de cada service para hablar con
 * `apps/api`. Se encarga de tres cosas, para que ningún service las repita:
 * 1. Armar la URL: `API_BASE_URL` + ruta + query params.
 * 2. Identificar al usuario: el header `x-user-id` que hoy usa el back como
 *    "sesión" (ver `apps/api/src/gateway/middlewares/auth.middleware.ts`).
 * 3. Desarmar el sobre de respuesta del back, `{ success, message?, data?, error? }`
 *    (`ApiResponse<T>` de `@rentar/shared-types`): devuelve `data` o tira un
 *    `ServiceError`.
 *
 * Quién lo usa: solo `services/*.service.ts` (rama real). Las pantallas
 * nunca lo importan.
 *
 * Status HTTP que espera el front (para backend):
 * - 400 / 422 → `validation`: un dato vino mal. El `error` del sobre se
 *   muestra tal cual arriba del formulario, así que tiene que estar en
 *   español y decir qué hacer.
 * - 401 → `unauthorized`: credenciales inválidas o sesión vencida. En el
 *   login se muestra el mensaje genérico de credenciales (US-39).
 * - 403 → `forbidden`: hay sesión pero no el rol necesario.
 * - 404 → `not_found`: el recurso (o la RUTA) no existe. NOTA: nunca se
 *   interpreta como "credenciales incorrectas": un endpoint que todavía no
 *   existe se ve como error del servidor, con "Reintentar".
 * - 409 → `conflict`: ya existe (ej. mail registrado, US-19).
 * - 5xx → `server`; sin respuesta → `network`.
 */
import type { ApiResponse } from '@rentar/shared-types'
import { readSessionFromDocument } from '@/lib/auth/session-cookie'
import { toBackendUserId } from '../adapters/usuario.adapter'
import { API_BASE_URL } from './config'
import { errorCodeFromHttpStatus, ServiceError } from './errors'

/** Valor aceptado en un query param. Los arrays se mandan repetidos (`?tags=a&tags=b`). */
export type QueryValue = string | number | boolean | string[] | undefined

/** Opciones de {@link apiRequest}: método, query params y cuerpo. */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Query params. Los `undefined` se omiten. */
  query?: Record<string, QueryValue>
  /** Cuerpo del request; se manda como JSON. */
  body?: unknown
}

// ─── Helpers ────────────────────────────────────────────────────────────

/** Arma la URL completa con sus query params. */
function buildUrl(path: string, query: ApiRequestOptions['query']): string {
  const url = new URL(`${API_BASE_URL}${path}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item))
    } else {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

/**
 * Headers del request. `x-user-id` sale de la cookie de sesión, traducido
 * por el adaptador (`toBackendUserId`) — este archivo no sabe nada de ids
 * del elenco.
 *
 * NOTA: sin sesión no se manda `x-user-id`. OJO: hoy el back asume el
 * usuario 1 cuando falta el header (ver "Observaciones para backend" en
 * `docs/HANDOFF-BACKEND.md`).
 */
function buildHeaders(hasBody: boolean): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (hasBody) headers['Content-Type'] = 'application/json'

  const session = readSessionFromDocument()
  const backendUserId = session ? toBackendUserId(session.userId) : null
  if (backendUserId) headers['x-user-id'] = backendUserId

  return headers
}

/** Lee el cuerpo como JSON; `null` si viene vacío o no es JSON (por ejemplo, un 502 con HTML). */
async function readJson(response: Response): Promise<ApiResponse<unknown> | null> {
  try {
    return (await response.json()) as ApiResponse<unknown>
  } catch {
    return null
  }
}

// ─── Request ────────────────────────────────────────────────────────────

/**
 * Hace un request a `apps/api` y devuelve el `data` del sobre de respuesta.
 *
 * @param path Ruta relativa a `API_BASE_URL`, empezando con `/` (ej. `/inmuebles/disponibles`).
 * @throws {ServiceError} `network` si el back no respondió; el código que
 *   corresponda al status HTTP si respondió con error o con `success: false`.
 *
 * @example
 * const inmuebles = await apiRequest<Inmueble[]>('/inmuebles/disponibles')
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body } = options

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: buildHeaders(body !== undefined),
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ServiceError('network', 'No pudimos conectarnos con el servidor. Probá de nuevo en unos minutos.')
  }

  const envelope = await readJson(response)

  if (!response.ok || !envelope || envelope.success === false) {
    // El back pone el detalle en `error` (y a veces un resumen en `message`).
    const message = envelope?.error ?? envelope?.message ?? 'Ocurrió un error inesperado. Probá de nuevo.'
    const code = response.ok ? 'server' : errorCodeFromHttpStatus(response.status)
    throw new ServiceError(code, message)
  }

  // NOTA: algunos endpoints responden `success: true` sin `data` (ej. un
  // DELETE). En ese caso se devuelve `undefined`; el service que llama sabe
  // si espera datos o no, y lo tipa con `apiRequest<void>`.
  return envelope.data as T
}
