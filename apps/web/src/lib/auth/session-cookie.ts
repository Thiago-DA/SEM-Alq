/**
 * session-cookie.ts — forma única de la cookie de sesión simulada (US-39).
 *
 * Qué es: el shape que comparten `AuthProvider` (cliente), `proxy.ts`
 * (servidor, protege `/panel/*`) y los services (cliente, para saber quién
 * está en sesión y armar el header `x-user-id`). Se define acá una sola vez
 * para que todos lean y escriban exactamente lo mismo.
 *
 * NOTA: no es httpOnly a propósito — `AuthProvider` necesita leerla desde el
 * cliente al hidratar la sesión. Solo guarda `{ userId, activeRole }`; el
 * perfil completo se resuelve con `services/usuarios.service.ts#getUsuarioSesion`.
 * Es una sesión simulada: con el backend real se reemplaza por un JWT o una
 * sesión de servidor (ver `docs/HANDOFF-BACKEND.md`, US-39).
 */
import type { UserRole } from '@rentar/shared-types'

export const SESSION_COOKIE_NAME = 'rentar_session'

/**
 * Duración de la sesión con "Recordarme en este dispositivo" marcado: 30
 * días. Sin marcar, la cookie no lleva `max-age` y el navegador la borra al
 * cerrarse (cookie de sesión).
 */
export const REMEMBER_ME_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export interface SessionCookiePayload {
  /** `UsuarioSesion.id` del usuario en sesión (texto, ver `usuario-sesion.ts`). */
  userId: string
  activeRole: UserRole
  /** `true` si se marcó "Recordarme": la cookie dura 30 días en vez de lo que dure el navegador abierto. */
  persistent?: boolean
}

/** Arma el valor (ya URI-encodeado) que se guarda en la cookie. */
export function serializeSessionCookie(payload: SessionCookiePayload): string {
  return encodeURIComponent(JSON.stringify(payload))
}

/**
 * Parsea el valor crudo de la cookie. Devuelve `null` ante cualquier valor
 * ausente o corrupto — tanto `proxy.ts` como `AuthProvider` tratan eso
 * igual que "sin sesión", nunca como un error a mostrar.
 */
export function parseSessionCookie(raw: string | undefined): SessionCookiePayload | null {
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw))
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as SessionCookiePayload).userId === 'string' &&
      typeof (parsed as SessionCookiePayload).activeRole === 'string'
    ) {
      return parsed as SessionCookiePayload
    }
    return null
  } catch {
    return null
  }
}

// ─── Lectura y escritura desde el navegador (document.cookie) ─────────────
// Del lado del servidor no hay `document`: ahí la cookie la lee `proxy.ts`
// con `request.cookies`, y estas funciones devuelven "sin sesión".

/** Lee la sesión actual desde `document.cookie`. `null` si no hay sesión (o si corre en el servidor). */
export function readSessionFromDocument(): SessionCookiePayload | null {
  if (typeof document === 'undefined') return null
  const row = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`))
  return parseSessionCookie(row?.slice(SESSION_COOKIE_NAME.length + 1))
}

/**
 * Guarda la sesión en `document.cookie` (visible para `proxy.ts` en el
 * próximo request). Con `persistent` dura {@link REMEMBER_ME_MAX_AGE_SECONDS};
 * sin él, hasta que se cierre el navegador.
 */
export function writeSessionToDocument(payload: SessionCookiePayload): void {
  const maxAge = payload.persistent ? `; max-age=${REMEMBER_ME_MAX_AGE_SECONDS}` : ''
  document.cookie = `${SESSION_COOKIE_NAME}=${serializeSessionCookie(payload)}; path=/${maxAge}; samesite=lax`
}

/** Borra la sesión de `document.cookie` (US-39: "desvincular la sesión del navegador"). */
export function clearSessionFromDocument(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`
}
