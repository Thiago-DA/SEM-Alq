/**
 * solicitudes.service.ts — frontera con el backend para las solicitudes de
 * alquiler.
 *
 * Qué es: todo lo que las pantallas piden sobre solicitudes pasa por acá.
 * Cada función tiene dos ramas: la mock (activa hoy, elenco de
 * `lib/mocks/solicitudes.mock.ts` más lo enviado en el navegador) y la real
 * contra `apps/api`; el interruptor es `NEXT_PUBLIC_USE_MOCKS`.
 * Cubre: US-35 Enviar solicitud de alquiler, US-36 Consultar solicitudes,
 * US-37 Aceptar o rechazar y US-38 Cancelar (numeración de Jira).
 *
 * NOTA: NINGUNA ruta de este archivo existe todavía en el back. Las firmas
 * son las definitivas para todo el Sprint 2: al conectar se cambia el cuerpo
 * o el adaptador (`adapters/solicitud.adapter.ts`), nunca la firma. Rutas,
 * cuerpos y respuestas propuestos: `docs/api-endpoints.md`, "Solicitudes".
 * NOTA: qué cambio de estado puede hacer cada uno está en la tabla
 * `TRANSICIONES_SOLICITUD` de `lib/validation/solicitud.rules.ts`; la rama
 * mock la aplica tal cual, y el back tiene que aplicar la misma.
 *
 * Quién lo usa: el detalle público de la propiedad (`/propiedad/[id]`),
 * `/panel/mis-solicitudes`, `/panel/solicitudes` y `panel.service.ts`
 * (solicitudes pendientes del locador).
 */
import type { Solicitud, SolicitudNueva } from '@rentar/shared-types'
import { solicitudes as solicitudesElenco, type SolicitudMock } from '@/lib/mocks'
import { readSessionFromDocument } from '@/lib/auth/session-cookie'
import { hoy } from '@/lib/utils/fechas'
import {
  aceptadaDeLaPropiedad,
  esSolicitudActiva,
  mensajeSolicitudValido,
  normalizarMensajeSolicitud,
  SOLICITUD_MENSAJE_LARGO_MESSAGE,
  textoYaAceptaste,
  transicionSolicitud,
  type AccionSolicitud,
  type ActorSolicitud,
} from '@/lib/validation/solicitud.rules'
import { solicitudMockToSolicitud } from './adapters/solicitud-mock.adapter'
import { solicitudNuevaToCrearRequest, solicitudResponseToSolicitud } from './adapters/solicitud.adapter'
import { readPropiedadesMock } from './propiedades.service'
import { apiRequest } from './shared/apiClient'
import type { SolicitudResponse } from './shared/backend-dtos'
import { USE_MOCKS } from './shared/config'
import { delay } from './shared/delay'
import { ServiceError } from './shared/errors'
import { readMockCollection, saveMockRecord } from './shared/mockStore'
import { requireSessionUserId } from './shared/session'
import { readUsuariosMock } from './usuarios.service'

// ─── Mensajes ───────────────────────────────────────────────────────────

/** 409: ya hay una solicitud pendiente o aceptada de esta persona para esta propiedad. */
export const SOLICITUD_DUPLICADA_MESSAGE = 'Ya habías enviado una solicitud para esta propiedad.'

/** La propiedad se alquiló o se pausó (Detalle de propiedad · 02, "Ya no está disponible"). */
export const PROPIEDAD_NO_SOLICITABLE_MESSAGE = 'Esta propiedad ya no recibe solicitudes.'

/** El dueño intentó solicitar su propia publicación. */
export const SOLICITUD_PROPIA_MESSAGE = 'No podés solicitar tu propia publicación.'

/** 409: la solicitud cambió de estado mientras se miraba (ej. el postulante la canceló). */
export const SOLICITUD_YA_NO_PENDIENTE_MESSAGE = 'Esta solicitud ya no está pendiente.'

/** 409: el locador quiso cancelar una que ya no está aceptada. */
export const SOLICITUD_YA_NO_ACEPTADA_MESSAGE = 'Esta solicitud ya no está aceptada.'

/** No se encontró la solicitud (o no es de quien la pide). */
const SOLICITUD_NO_ENCONTRADA_MESSAGE = 'No encontramos esa solicitud.'

/** No se pudo guardar en `localStorage` (modo mock). */
const MOCK_STORAGE_FULL_MESSAGE = 'No pudimos guardar la solicitud en este navegador. Tocá "Reiniciar datos de prueba" y probá de nuevo.'

// ─── Helpers de la rama mock ────────────────────────────────────────────

/**
 * Todas las solicitudes mock: el elenco más las enviadas en el navegador.
 * La comparte `panel.service.ts` (solicitudes nuevas del locador).
 */
export function readSolicitudesMock(): SolicitudMock[] {
  return readMockCollection('solicitudes', solicitudesElenco)
}

/**
 * `SolicitudMock` → `Solicitud`, buscando su propiedad en el elenco. `vista`
 * elige la dirección: exacta para el locador, aproximada para el postulante.
 */
function aVista(solicitud: SolicitudMock, vista: ActorSolicitud): Solicitud {
  const propiedad = readPropiedadesMock().find((item) => item.id === solicitud.propertyId) ?? null
  return solicitudMockToSolicitud(solicitud, propiedad, vista)
}

/** "Ahora" en el elenco: el "hoy" fijo (23/09/2026) con la hora actual, así ordena después de las del día. */
function ahoraMock(): string {
  const ahora = new Date()
  return hoy().hour(ahora.getHours()).minute(ahora.getMinutes()).format('YYYY-MM-DDTHH:mm:ss')
}

/** De la más nueva a la más vieja. */
function masNuevasPrimero(a: { createdAt: string }, b: { createdAt: string }): number {
  return b.createdAt.localeCompare(a.createdAt)
}

/** Próximo id `SOL-2026-XXXX` (prefijo del elenco, ver `lib/mocks/README.md`). */
function siguienteIdMock(existentes: SolicitudMock[]): string {
  const numeros = existentes.map((item) => Number(item.id.match(/^SOL-2026-(\d+)$/)?.[1] ?? 0))
  const siguiente = Math.max(0, ...numeros) + 1
  return `SOL-2026-${String(siguiente).padStart(4, '0')}`
}

/**
 * Aplica un cambio de estado a una solicitud mock, siguiendo la tabla
 * `TRANSICIONES_SOLICITUD` (`lib/validation/solicitud.rules.ts`): si esa
 * acción no se permite a ese actor en el estado actual, `conflict` (409),
 * como respondería el back. Guarda `respondedAt` con "ahora".
 * Quién es parte de la solicitud (dueño o postulante) lo valida antes cada
 * función: acá llega solo lo que ya es suyo.
 */
function cambiarEstadoMock(solicitud: SolicitudMock, accion: AccionSolicitud, actor: ActorSolicitud): Solicitud {
  const transicion = transicionSolicitud(accion, actor, solicitud.status)
  if (!transicion) {
    // La única que parte de `aceptada` es la cancelación del locador (US-38).
    const message = accion === 'cancelar' && actor === 'locador' ? SOLICITUD_YA_NO_ACEPTADA_MESSAGE : SOLICITUD_YA_NO_PENDIENTE_MESSAGE
    throw new ServiceError('conflict', message)
  }
  const actualizada: SolicitudMock = { ...solicitud, status: transicion.hacia, respondedAt: ahoraMock() }
  if (!saveMockRecord('solicitudes', actualizada)) throw new ServiceError('server', MOCK_STORAGE_FULL_MESSAGE)
  return aVista(actualizada, actor)
}

// ─── Enviar (US-35) ─────────────────────────────────────────────────────

/**
 * US-35 Enviar solicitud de alquiler — el usuario en sesión solicita una
 * propiedad publicada, con un mensaje opcional al locador.
 * @backend POST /api/v1/solicitudes   (no existe — propuesto) body { id_inmueble, mensaje? } → 201 SolicitudResponse
 * @returns Solicitud (la recién creada, `pendiente`)
 * @throws {ServiceError}
 *   - `unauthorized`: sin sesión (US-35: "se debe haber iniciado sesión").
 *   - `validation`: mensaje de más de 1000 caracteres (US-35, prueba "más de
 *     1000, falla") o la propiedad ya no se puede solicitar (alquilada o pausada).
 *   - `forbidden`: es su propia publicación.
 *   - `conflict`: ya tiene una solicitud pendiente o aceptada para esa propiedad.
 *   - `not_found`: la propiedad no existe.
 *
 * TODO(backend): crear la ruta y la tabla. Al crear la solicitud, el back
 * manda un mail al locador con el nombre del postulante y el mensaje, si lo
 * hay (US-35, cuarto criterio). El front no manda mails: solo muestra "Le
 * avisamos por mail a <dueño>".
 * TODO(backend): repetir las validaciones de `lib/validation/solicitud.rules.ts`
 * (largo del mensaje, duplicada, propia, disponible).
 */
export async function enviarSolicitud(nueva: SolicitudNueva): Promise<Solicitud> {
  const message = normalizarMensajeSolicitud(nueva.message)
  // Se valida en las dos ramas: el TextArea ya corta en 1000, pero la regla es de la US.
  if (!mensajeSolicitudValido(message)) throw new ServiceError('validation', SOLICITUD_MENSAJE_LARGO_MESSAGE)

  if (USE_MOCKS) {
    await delay(800)
    const userId = requireSessionUserId()
    const propiedad = readPropiedadesMock().find((item) => item.id === nueva.propertyId)
    if (!propiedad) throw new ServiceError('not_found', 'Esta publicación ya no está disponible.')
    if (propiedad.ownerId === userId) throw new ServiceError('forbidden', SOLICITUD_PROPIA_MESSAGE)
    // Se solicita lo que aparece en /buscar: publicada o alquilada con fecha de disponibilidad.
    if (propiedad.status !== 'publicada' && propiedad.status !== 'alquilada_publicada') {
      throw new ServiceError('validation', PROPIEDAD_NO_SOLICITABLE_MESSAGE)
    }
    const existentes = readSolicitudesMock()
    const repetida = existentes.some(
      (item) => item.propertyId === nueva.propertyId && item.applicantUserId === userId && esSolicitudActiva(item.status),
    )
    if (repetida) throw new ServiceError('conflict', SOLICITUD_DUPLICADA_MESSAGE)

    const usuario = readUsuariosMock().find((item) => item.id === userId)
    const solicitud: SolicitudMock = {
      id: siguienteIdMock(existentes),
      propertyId: nueva.propertyId,
      applicantUserId: userId,
      applicantName: usuario ? `${usuario.nombre} ${usuario.apellido}` : '',
      message,
      status: 'pendiente',
      createdAt: ahoraMock(),
      respondedAt: null,
    }
    if (!saveMockRecord('solicitudes', solicitud)) throw new ServiceError('server', MOCK_STORAGE_FULL_MESSAGE)
    return aVista(solicitud, 'postulante')
  }

  const dto = await apiRequest<SolicitudResponse>('/solicitudes', {
    method: 'POST',
    body: solicitudNuevaToCrearRequest({ propertyId: nueva.propertyId, message }),
  })
  return solicitudResponseToSolicitud(dto, 'postulante')
}

/**
 * US-35 y US-36 — la solicitud más reciente del usuario en sesión para una
 * propiedad, o `null` si nunca la solicitó. El detalle la usa para elegir el
 * estado del botón "Solicitar alquiler" (Detalle de propiedad · 02).
 * @backend GET /api/v1/solicitudes/mias?inmueble=:id   (no existe — propuesto) → SolicitudResponse[]
 * @returns Solicitud | null
 *
 * NOTA: devuelve la más reciente en cualquier estado; quien llama decide con
 * `esSolicitudActiva` si bloquea una nueva (una rechazada o cancelada no bloquea).
 * NOTA: sin sesión devuelve `null` (no hay "mi solicitud"), no un error.
 * TODO(backend): alternativa más barata, que `GET /inmuebles/disponibles/:id`
 * devuelva `mi_solicitud` cuando llega con token (ver `HANDOFF-BACKEND.md` §7, US-41).
 */
export async function getMiSolicitudParaPropiedad(propertyId: string): Promise<Solicitud | null> {
  if (USE_MOCKS) {
    await delay(300)
    const session = readSessionFromDocument()
    if (!session) return null
    const mia = readSolicitudesMock()
      .filter((item) => item.propertyId === propertyId && item.applicantUserId === session.userId)
      .sort(masNuevasPrimero)[0]
    return mia ? aVista(mia, 'postulante') : null
  }
  const items = await apiRequest<SolicitudResponse[]>('/solicitudes/mias', { query: { inmueble: propertyId } })
  const mia = items.map((item) => solicitudResponseToSolicitud(item, 'postulante')).sort(masNuevasPrimero)[0]
  return mia ?? null
}

// ─── Consultar (US-36) ──────────────────────────────────────────────────

/**
 * US-36 Consultar solicitudes — las que envió el usuario en sesión
 * (`/panel/mis-solicitudes`), de la más nueva a la más vieja.
 * @backend GET /api/v1/solicitudes/mias   (no existe — propuesto) → SolicitudResponse[]
 * @returns Solicitud[] con la dirección APROXIMADA de cada propiedad.
 * @throws {ServiceError} `unauthorized` sin sesión (US-36: "se debe haber iniciado sesión").
 */
export async function listarMisSolicitudes(): Promise<Solicitud[]> {
  if (USE_MOCKS) {
    await delay()
    const userId = requireSessionUserId()
    return readSolicitudesMock()
      .filter((item) => item.applicantUserId === userId)
      .sort(masNuevasPrimero)
      .map((item) => aVista(item, 'postulante'))
  }
  const items = await apiRequest<SolicitudResponse[]>('/solicitudes/mias')
  return items.map((item) => solicitudResponseToSolicitud(item, 'postulante'))
}

/**
 * US-36 Consultar solicitudes — las que recibió el locador en sesión sobre
 * sus propiedades (`/panel/solicitudes`), de la más nueva a la más vieja.
 * @backend GET /api/v1/solicitudes/recibidas   (no existe — propuesto) → SolicitudResponse[]
 *          Acepta `?estado=pendiente` (lo usa el panel, `panel.service#getSolicitudesPendientes`).
 * @returns Solicitud[] con la dirección EXACTA (son sus propias propiedades).
 * @throws {ServiceError} `unauthorized` sin sesión; `forbidden` si la cuenta no es locadora.
 */
export async function listarSolicitudesRecibidas(): Promise<Solicitud[]> {
  if (USE_MOCKS) {
    await delay()
    const userId = requireSessionUserId()
    const propias = new Set(readPropiedadesMock().filter((item) => item.ownerId === userId).map((item) => item.id))
    return readSolicitudesMock()
      .filter((item) => propias.has(item.propertyId))
      .sort(masNuevasPrimero)
      .map((item) => aVista(item, 'locador'))
  }
  const items = await apiRequest<SolicitudResponse[]>('/solicitudes/recibidas')
  return items.map((item) => solicitudResponseToSolicitud(item, 'locador'))
}

// ─── Aceptar o rechazar (US-37) ─────────────────────────────────────────

/** Rama mock: la solicitud y quién es el usuario en sesión para ella (dueño de la propiedad o postulante), o `not_found`. */
function solicitudPropiaMock(solicitudId: string): { solicitud: SolicitudMock; actor: ActorSolicitud } {
  const userId = requireSessionUserId()
  const solicitud = readSolicitudesMock().find((item) => item.id === solicitudId)
  if (!solicitud) throw new ServiceError('not_found', SOLICITUD_NO_ENCONTRADA_MESSAGE)
  const propiedad = readPropiedadesMock().find((item) => item.id === solicitud.propertyId)
  if (propiedad?.ownerId === userId) return { solicitud, actor: 'locador' }
  if (solicitud.applicantUserId === userId) return { solicitud, actor: 'postulante' }
  throw new ServiceError('not_found', SOLICITUD_NO_ENCONTRADA_MESSAGE)
}

/** Rama mock: una solicitud recibida por el locador en sesión, o `not_found`. */
function solicitudRecibidaMock(solicitudId: string): SolicitudMock {
  const { solicitud, actor } = solicitudPropiaMock(solicitudId)
  if (actor !== 'locador') throw new ServiceError('not_found', SOLICITUD_NO_ENCONTRADA_MESSAGE)
  return solicitud
}

/**
 * US-37 Aceptar o rechazar solicitud — el locador acepta una solicitud
 * pendiente sobre una propiedad suya.
 * @backend PATCH /api/v1/solicitudes/:id/aceptar   (no existe — propuesto) → SolicitudResponse
 * @returns Solicitud (`aceptada`)
 * @throws {ServiceError} `not_found` si no es una solicitud suya; `conflict`
 *   si ya no está pendiente (la cancelaron mientras miraba) o si la
 *   propiedad ya tiene otra aceptada.
 * TODO(backend): mandar un mail al locatario avisando que se aceptó (US-37).
 * NOTA: una sola aceptada por propiedad (regla del PO, tanda 2 del Sprint 2,
 * `aceptadaDeLaPropiedad`): para aceptar a otro postulante, el locador
 * primero cancela la aceptada (US-38). Aceptar no rechaza las otras
 * solicitudes de la propiedad: siguen pendientes (Flujo de solicitudes · 02).
 */
export async function aceptarSolicitud(solicitudId: string): Promise<Solicitud> {
  if (USE_MOCKS) {
    await delay()
    const solicitud = solicitudRecibidaMock(solicitudId)
    const otras = readSolicitudesMock().filter((item) => item.propertyId === solicitud.propertyId && item.id !== solicitud.id)
    const aceptada = aceptadaDeLaPropiedad(otras)
    if (aceptada && solicitud.status === 'pendiente') throw new ServiceError('conflict', textoYaAceptaste(aceptada.applicantName))
    return cambiarEstadoMock(solicitud, 'aceptar', 'locador')
  }
  const dto = await apiRequest<SolicitudResponse>(`/solicitudes/${encodeURIComponent(solicitudId)}/aceptar`, { method: 'PATCH' })
  return solicitudResponseToSolicitud(dto, 'locador')
}

/**
 * US-37 Aceptar o rechazar solicitud — el locador rechaza una solicitud
 * pendiente sobre una propiedad suya.
 * @backend PATCH /api/v1/solicitudes/:id/rechazar   (no existe — propuesto) → SolicitudResponse
 * @returns Solicitud (`rechazada`)
 * @throws {ServiceError} `not_found` si no es una solicitud suya; `conflict` si ya no está pendiente.
 * NOTA: sin motivo. El diseño (Flujo de solicitudes · 03) suma un motivo
 * opcional; US-37 no lo pide y el PO decidió no incluirlo.
 */
export async function rechazarSolicitud(solicitudId: string): Promise<Solicitud> {
  if (USE_MOCKS) {
    await delay()
    return cambiarEstadoMock(solicitudRecibidaMock(solicitudId), 'rechazar', 'locador')
  }
  const dto = await apiRequest<SolicitudResponse>(`/solicitudes/${encodeURIComponent(solicitudId)}/rechazar`, { method: 'PATCH' })
  return solicitudResponseToSolicitud(dto, 'locador')
}

// ─── Cancelar (US-38 y sin US en Sprint 0) ──────────────────────────────

/**
 * US-38 Cancelar solicitud de alquiler — pasa una solicitud a `cancelada`.
 * Una sola ruta para los dos casos; el back decide según quién llama y el
 * estado (`TRANSICIONES_SOLICITUD`):
 * - **Locador + aceptada** (US-38, Jira: "dar de baja una solicitud tras
 *   haberla aceptado inicialmente para considerar otros posibles
 *   locatarios"). Desde Solicitudes recibidas. Después puede aceptar a otro
 *   postulante (una sola aceptada por propiedad).
 * - **Postulante + pendiente**: sin US en Sprint 0 (mapa US-39). El
 *   locatario retira una solicitud que todavía no se respondió, desde Mis
 *   solicitudes (Flujo de solicitudes · 04).
 * Cualquier otra combinación: `conflict` (409) si es parte de la solicitud
 * pero el estado no corresponde; `not_found` si no es parte.
 * @backend PATCH /api/v1/solicitudes/:id/cancelar   (no existe — propuesto) → SolicitudResponse
 * @returns Solicitud (`cancelada`)
 * @throws {ServiceError} `not_found` si no es suya; `conflict` si ya no se puede cancelar.
 *
 * NOTA: la rama real adapta la respuesta con la vista del postulante
 * (dirección aproximada), porque la firma no dice quién llama: las
 * pantallas toman de la respuesta solo el estado y la fecha.
 * TODO(backend): si cancela el locador, mandar un mail al locatario avisando
 * la cancelación (US-38).
 */
export async function cancelarSolicitud(solicitudId: string): Promise<Solicitud> {
  if (USE_MOCKS) {
    await delay()
    const { solicitud, actor } = solicitudPropiaMock(solicitudId)
    return cambiarEstadoMock(solicitud, 'cancelar', actor)
  }
  const dto = await apiRequest<SolicitudResponse>(`/solicitudes/${encodeURIComponent(solicitudId)}/cancelar`, { method: 'PATCH' })
  return solicitudResponseToSolicitud(dto, 'postulante')
}
