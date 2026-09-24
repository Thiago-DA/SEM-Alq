/**
 * shared/errors.ts — el error tipado que tiran todos los services.
 *
 * Qué es: `ServiceError` lleva un `code` para que las pantallas distingan
 * el caso ("credenciales inválidas" vs. "mail ya registrado" vs. "sin
 * conexión") sin mirar textos. Lo tiran igual la rama mock y la rama real,
 * así la pantalla no sabe (ni le importa) de dónde vino el error.
 *
 * Quién lo usa: todos los `services/*.service.ts`, `shared/apiClient.ts` y
 * las pantallas que muestran estados de error.
 */

/**
 * Motivo del error. Cada uno se corresponde con un status HTTP del backend
 * (ver {@link errorCodeFromHttpStatus}); `network` es "no hubo respuesta".
 */
export type ServiceErrorCode =
  | 'validation' // 400 / 422
  | 'unauthorized' // 401
  | 'forbidden' // 403
  | 'not_found' // 404
  | 'conflict' // 409
  | 'server' // 5xx o cualquier otro status inesperado
  | 'network' // el backend no respondió (apagado, CORS, sin red)

/** Error tipado de un service. `message` ya está en español, listo para mostrar. */
export class ServiceError extends Error {
  code: ServiceErrorCode

  constructor(code: ServiceErrorCode, message: string) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
  }
}

/** Traduce un status HTTP de `apps/api` al `ServiceErrorCode` correspondiente. */
export function errorCodeFromHttpStatus(status: number): ServiceErrorCode {
  if (status === 400 || status === 422) return 'validation'
  if (status === 401) return 'unauthorized'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'not_found'
  if (status === 409) return 'conflict'
  return 'server'
}
