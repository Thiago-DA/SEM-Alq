/**
 * solicitud.rules.ts — reglas de las solicitudes de alquiler (US-35 a US-38).
 *
 * Qué es: el largo máximo del mensaje, cuándo una solicitud ya existente
 * impide mandar otra y qué cambios de estado se permiten y a quién, cada regla
 * con el criterio que cubre. Las usan el modal "Solicitar alquiler" (para
 * ayudar mientras se escribe), las pantallas de solicitudes (para decidir qué
 * botón mostrar) y la rama mock de `services/solicitudes.service.ts` (para
 * responder como respondería el back).
 *
 * TODO(backend): el back tiene que repetir estas mismas reglas; el front
 * valida para ayudar, no para proteger.
 * Quién lo usa: `services/solicitudes.service.ts`,
 * `components/detalle-propiedad/*`, `components/solicitudes/*` y
 * `components/mis-solicitudes/*`.
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

// ─── Cambios de estado (US-37, US-38) ───────────────────────────────────

/** Quién hace el cambio: el dueño de la propiedad o quien envió la solicitud. */
export type ActorSolicitud = 'locador' | 'postulante'

/** Los cambios de estado que se piden desde las pantallas. */
export type AccionSolicitud = 'aceptar' | 'rechazar' | 'cancelar'

/** Un cambio de estado permitido: quién lo hace, desde qué estado y a cuál. */
export interface TransicionSolicitud {
  accion: AccionSolicitud
  actor: ActorSolicitud
  desde: EstadoSolicitud
  hacia: EstadoSolicitud
}

/**
 * Las únicas transiciones permitidas. Cualquier otra combinación de acción,
 * actor y estado es un 409 (o un 403/404 si quien llama no es parte).
 *
 * | Acción | Quién | Desde | Hacia | Por qué |
 * |---|---|---|---|---|
 * | aceptar | locador | pendiente | aceptada | US-37. Además, **una sola aceptada por propiedad** (ver {@link aceptadaDeLaPropiedad}). |
 * | rechazar | locador | pendiente | rechazada | US-37 (sin motivo: la US no lo pide). |
 * | cancelar | locador | aceptada | cancelada | US-38 (Jira): "dar de baja una solicitud tras haberla aceptado inicialmente para considerar otros posibles locatarios". |
 * | cancelar | postulante | pendiente | cancelada | Sin US en Sprint 0 (mapa US-39): el locatario retira una solicitud que todavía no se respondió (Flujo de solicitudes · 04). |
 *
 * NOTA: nada vuelve a `pendiente` (Flujo de solicitudes · 07): para volver a
 * intentar se crea una nueva. La aceptada no la puede cancelar el
 * postulante: si se arrepiente, se lo dice al locador y la cancela él.
 */
export const TRANSICIONES_SOLICITUD: readonly TransicionSolicitud[] = [
  { accion: 'aceptar', actor: 'locador', desde: 'pendiente', hacia: 'aceptada' },
  { accion: 'rechazar', actor: 'locador', desde: 'pendiente', hacia: 'rechazada' },
  { accion: 'cancelar', actor: 'locador', desde: 'aceptada', hacia: 'cancelada' },
  { accion: 'cancelar', actor: 'postulante', desde: 'pendiente', hacia: 'cancelada' },
]

/** La transición que corresponde, o `null` si esa acción no se permite a ese actor en ese estado. */
export function transicionSolicitud(accion: AccionSolicitud, actor: ActorSolicitud, estado: EstadoSolicitud): TransicionSolicitud | null {
  return TRANSICIONES_SOLICITUD.find((item) => item.accion === accion && item.actor === actor && item.desde === estado) ?? null
}

/** `true` si ese actor puede hacer esa acción sobre una solicitud en ese estado. */
export function puedeHacerAccion(accion: AccionSolicitud, actor: ActorSolicitud, estado: EstadoSolicitud): boolean {
  return transicionSolicitud(accion, actor, estado) !== null
}

/**
 * `true` si ese actor puede cancelar una solicitud en ese estado: el locador
 * una aceptada (US-38) o el postulante una pendiente (sin US en Sprint 0).
 */
export function puedeCancelar(estado: EstadoSolicitud, actor: ActorSolicitud): boolean {
  return puedeHacerAccion('cancelar', actor, estado)
}

/**
 * La solicitud aceptada de una propiedad, si hay una. Regla del PO (tanda 2
 * del Sprint 2): **una sola aceptada por propiedad**. Mientras haya una, no
 * se puede aceptar otra (409); el locador primero la cancela (US-38) y
 * vuelve a poder elegir. Aceptar NO rechaza a las demás: siguen pendientes.
 * Recibe las solicitudes de UNA propiedad (de cualquier forma: elenco o vista).
 */
export function aceptadaDeLaPropiedad<T extends { status: EstadoSolicitud }>(solicitudesDeLaPropiedad: readonly T[]): T | undefined {
  return solicitudesDeLaPropiedad.find((item) => item.status === 'aceptada')
}

/** Por qué no se puede aceptar otra: el tooltip del botón y el 409 del service. */
export function textoYaAceptaste(nombre: string): string {
  return `Ya aceptaste a ${nombre}. Cancelá esa solicitud para aceptar otra.`
}
