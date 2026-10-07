/**
 * solicitud.rules.ts — reglas de las solicitudes de alquiler (US-35).
 *
 * Qué es: el largo máximo del mensaje y cuándo una solicitud ya existente
 * impide mandar otra, cada regla con el criterio que cubre. Las usan el modal
 * "Solicitar alquiler" (para ayudar mientras se escribe) y la rama mock de
 * `services/solicitudes.service.ts` (para responder como respondería el back).
 *
 * TODO(backend): el back tiene que repetir estas mismas reglas; el front
 * valida para ayudar, no para proteger.
 * Quién lo usa: `services/solicitudes.service.ts` y
 * `components/detalle-propiedad/*`.
 */
import type { EstadoSolicitud } from '@rentar/shared-types'

/**
 * Largo máximo del mensaje opcional al locador (US-35: "se puede adjuntar un
 * mensaje de hasta 1000 caracteres"; prueba de usuario: "más de 1000
 * caracteres, falla").
 * NOTA: el diseño (Flujo de solicitudes · 01) muestra 600; manda el criterio
 * de aceptación de la US.
 */
export const SOLICITUD_MENSAJE_MAX = 1000

/** Mensaje de error si el mensaje supera {@link SOLICITUD_MENSAJE_MAX}. */
export const SOLICITUD_MENSAJE_LARGO_MESSAGE = `El mensaje puede tener hasta ${SOLICITUD_MENSAJE_MAX} caracteres.`

/**
 * Normaliza el mensaje antes de enviarlo: sin espacios en los bordes, y
 * `null` si quedó vacío (US-35: el mensaje es opcional; prueba de usuario
 * "sin adjuntar un mensaje, pasa").
 */
export function normalizarMensajeSolicitud(mensaje: string | null | undefined): string | null {
  const limpio = mensaje?.trim() ?? ''
  return limpio === '' ? null : limpio
}

/** `true` si el mensaje (ya normalizado) respeta el máximo de US-35. */
export function mensajeSolicitudValido(mensaje: string | null): boolean {
  return mensaje === null || mensaje.length <= SOLICITUD_MENSAJE_MAX
}

/**
 * `true` si la solicitud sigue viva y, por eso, impide mandar otra sobre la
 * misma propiedad: `pendiente` o `aceptada`.
 * NOTA: una `rechazada` o `cancelada` es historia (Flujo de solicitudes · 07:
 * "nada vuelve a pendiente; para volver a intentar se crea una nueva"), así
 * que no bloquea una nueva solicitud. El "no puede volver a solicitar por 30
 * días" que muestra el diseño al rechazar no tiene US: no se aplica.
 */
export function esSolicitudActiva(estado: EstadoSolicitud): boolean {
  return estado === 'pendiente' || estado === 'aceptada'
}
