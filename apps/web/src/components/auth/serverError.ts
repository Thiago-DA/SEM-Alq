/**
 * serverError.ts — textos del estado "Error del servidor" (Autenticación · 05).
 *
 * Qué es: cuando un service falla por algo que no es culpa de la persona
 * (el back no respondió o respondió 5xx), el formulario se reemplaza por un
 * bloque con "Reintentar". Acá se decide qué texto va según el error.
 * Quién lo usa: `LoginForm` y `RegistroForm`.
 */
import { ServiceError } from '@/services/shared/errors'

export interface ServerErrorCopy {
  title: string
  description: string
}

/**
 * `true` si el error es "del servidor o de la conexión" (se muestra el
 * bloque con Reintentar) y no un error de los datos (que va en el formulario).
 * `not_found` entra acá: en login y registro significa que la ruta del back
 * todavía no existe, no que la persona escribió algo mal.
 */
export function isServerError(error: unknown): boolean {
  return (
    !(error instanceof ServiceError) || error.code === 'server' || error.code === 'network' || error.code === 'not_found'
  )
}

/** Título y texto del bloque, con las palabras del diseño. */
export function serverErrorCopy(error: unknown): ServerErrorCopy {
  if (error instanceof ServiceError && error.code === 'network') {
    return {
      title: 'Parece que te quedaste sin internet',
      description: 'Revisá tu conexión y probá de nuevo; tus datos quedaron escritos.',
    }
  }
  return {
    title: 'No pudimos procesar tu pedido',
    description: 'El problema es nuestro, no tuyo. Probá de nuevo en un momento; tus datos quedaron escritos.',
  }
}
