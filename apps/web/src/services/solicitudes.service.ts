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
 * NOTA: en esta tanda (tanda 1 del Sprint 2) las pantallas usan solo
 * `enviarSolicitud` y `getMiSolicitudParaPropiedad`; el resto queda con una
 * rama mock simple para `/panel/mis-solicitudes` y `/panel/solicitudes`
 * (tanda 2).
 *
 * Quién lo usa: el detalle público de la propiedad (`/propiedad/[id]`) y
 * `panel.service.ts` (solicitudes pendientes del locador).
 */
import type { Solicitud, SolicitudNueva } from '@rentar/shared-types'
import { solicitudes as solicitudesElenco, type SolicitudMock } from '@/lib/mocks'
import { readSessionFromDocument } from '@/lib/auth/session-cookie'
import { hoy } from '@/lib/utils/fechas'
import { esSolicitudActiva, mensajeSolicitudValido, normalizarMensajeSolicitud, SOLICITUD_MENSAJE_LARGO_MESSAGE } from '@/lib/validation/solicitud.rules'
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

/** `SolicitudMock` → `Solicitud`, buscando su propiedad en el elenco. */
function aVista(solicitud: SolicitudMock): Solicitud {
  const propiedad = readPropiedadesMock().find((item) => item.id === solicitud.propertyId) ?? null
  return solicitudMockToSolicitud(solicitud, propiedad)
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
 * Guarda el cambio de estado de una solicitud mock.
 * NOTA: rama mock simple (tanda 2): solo valida que la solicitud exista y
 * esté pendiente. Quién puede hacer cada cambio lo decide cada función.
 */
function cambiarEstadoMock(solicitud: SolicitudMock, estado: SolicitudMock['status']): Solicitud {
  if (solicitud.status !== 'pendiente') {
    throw new ServiceError('conflict', 'Esta solicitud ya no está pendiente.')
  }
  const actualizada: SolicitudMock = { ...solicitud, status: estado }
  if (!saveMockRecord('solicitudes', actualizada)) throw new ServiceError('server', MOCK_STORAGE_FULL_MESSAGE)
  return aVista(actualizada)
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
      // "Hoy" del elenco (23/09/2026) con la hora actual, así ordena después de las del día.
      createdAt: hoy().hour(new Date().getHours()).minute(new Date().getMinutes()).format('YYYY-MM-DDTHH:mm:ss'),
    }
    if (!saveMockRecord('solicitudes', solicitud)) throw new ServiceError('server', MOCK_STORAGE_FULL_MESSAGE)
    return aVista(solicitud)
  }

  const dto = await apiRequest<SolicitudResponse>('/solicitudes', {
    method: 'POST',
    body: solicitudNuevaToCrearRequest({ propertyId: nueva.propertyId, message }),
  })
  return solicitudResponseToSolicitud(dto)
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
    return mia ? aVista(mia) : null
  }
  const items = await apiRequest<SolicitudResponse[]>('/solicitudes/mias', { query: { inmueble: propertyId } })
  const mia = items.map(solicitudResponseToSolicitud).sort(masNuevasPrimero)[0]
  return mia ?? null
}

// ─── Consultar (US-36) · se usa en la tanda 2 ───────────────────────────

/**
 * US-36 Consultar solicitudes — las que envió el usuario en sesión
 * (`/panel/mis-solicitudes`), de la más nueva a la más vieja.
 * @backend GET /api/v1/solicitudes/mias   (no existe — propuesto) → SolicitudResponse[]
 * @returns Solicitud[]
 * @throws {ServiceError} `unauthorized` sin sesión (US-36: "se debe haber iniciado sesión").
 */
export async function listarMisSolicitudes(): Promise<Solicitud[]> {
  if (USE_MOCKS) {
    await delay()
    const userId = requireSessionUserId()
    return readSolicitudesMock()
      .filter((item) => item.applicantUserId === userId)
      .sort(masNuevasPrimero)
      .map(aVista)
  }
  const items = await apiRequest<SolicitudResponse[]>('/solicitudes/mias')
  return items.map(solicitudResponseToSolicitud)
}

/**
 * US-36 Consultar solicitudes — las que recibió el locador en sesión sobre
 * sus propiedades (`/panel/solicitudes`), de la más nueva a la más vieja.
 * @backend GET /api/v1/solicitudes/recibidas   (no existe — propuesto) → SolicitudResponse[]
 *          Acepta `?estado=pendiente` (lo usa el panel, `panel.service#getSolicitudesPendientes`).
 * @returns Solicitud[]
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
      .map(aVista)
  }
  const items = await apiRequest<SolicitudResponse[]>('/solicitudes/recibidas')
  return items.map(solicitudResponseToSolicitud)
}

// ─── Aceptar o rechazar (US-37) · se usa en la tanda 2 ──────────────────

/** Rama mock: una solicitud recibida por el locador en sesión, o `not_found`. */
function solicitudRecibidaMock(solicitudId: string): SolicitudMock {
  const userId = requireSessionUserId()
  const solicitud = readSolicitudesMock().find((item) => item.id === solicitudId)
  const propiedad = solicitud && readPropiedadesMock().find((item) => item.id === solicitud.propertyId)
  if (!solicitud || propiedad?.ownerId !== userId) throw new ServiceError('not_found', SOLICITUD_NO_ENCONTRADA_MESSAGE)
  return solicitud
}

/**
 * US-37 Aceptar o rechazar solicitud — el locador acepta una solicitud
 * pendiente sobre una propiedad suya.
 * @backend PATCH /api/v1/solicitudes/:id/aceptar   (no existe — propuesto) → SolicitudResponse
 * @returns Solicitud (`aceptada`)
 * @throws {ServiceError} `not_found` si no es una solicitud suya; `conflict`
 *   si ya no está pendiente (la cancelaron mientras miraba).
 * TODO(backend): mandar un mail al locatario avisando que se aceptó (US-37).
 * NOTA: aceptar no rechaza las otras solicitudes de la propiedad (Flujo de
 * solicitudes · 02).
 */
export async function aceptarSolicitud(solicitudId: string): Promise<Solicitud> {
  if (USE_MOCKS) {
    await delay()
    return cambiarEstadoMock(solicitudRecibidaMock(solicitudId), 'aceptada')
  }
  const dto = await apiRequest<SolicitudResponse>(`/solicitudes/${encodeURIComponent(solicitudId)}/aceptar`, { method: 'PATCH' })
  return solicitudResponseToSolicitud(dto)
}

/**
 * US-37 Aceptar o rechazar solicitud — el locador rechaza una solicitud
 * pendiente sobre una propiedad suya.
 * @backend PATCH /api/v1/solicitudes/:id/rechazar   (no existe — propuesto) → SolicitudResponse
 * @returns Solicitud (`rechazada`)
 * @throws {ServiceError} `not_found` si no es una solicitud suya; `conflict` si ya no está pendiente.
 * NOTA: el diseño suma un motivo opcional; US-37 no lo pide. Se define en la tanda 2.
 */
export async function rechazarSolicitud(solicitudId: string): Promise<Solicitud> {
  if (USE_MOCKS) {
    await delay()
    return cambiarEstadoMock(solicitudRecibidaMock(solicitudId), 'rechazada')
  }
  const dto = await apiRequest<SolicitudResponse>(`/solicitudes/${encodeURIComponent(solicitudId)}/rechazar`, { method: 'PATCH' })
  return solicitudResponseToSolicitud(dto)
}

// ─── Cancelar (US-38) · se define en la tanda 2 ─────────────────────────

/**
 * US-38 Cancelar solicitud de alquiler — pasa una solicitud a `cancelada`.
 * @backend PATCH /api/v1/solicitudes/:id/cancelar   (no existe — propuesto) → SolicitudResponse
 * @returns Solicitud (`cancelada`)
 * @throws {ServiceError} `not_found` si no es suya; `conflict` si ya no se puede cancelar.
 *
 * NOTA: US-38 (Jira) dice "como LOCADOR quiero dar de baja una solicitud tras
 * haberla aceptado"; el diseño (Flujo de solicitudes · 04) hace que el
 * LOCATARIO cancele una solicitud PENDIENTE. Quién cancela y desde qué estado
 * se define en la tanda 2. Mientras tanto, la rama mock sigue al diseño: la
 * cancela quien la envió, si está pendiente.
 * TODO(backend): mandar un mail al locatario avisando la cancelación (US-38).
 */
export async function cancelarSolicitud(solicitudId: string): Promise<Solicitud> {
  if (USE_MOCKS) {
    await delay()
    const userId = requireSessionUserId()
    const solicitud = readSolicitudesMock().find((item) => item.id === solicitudId && item.applicantUserId === userId)
    if (!solicitud) throw new ServiceError('not_found', SOLICITUD_NO_ENCONTRADA_MESSAGE)
    return cambiarEstadoMock(solicitud, 'cancelada')
  }
  const dto = await apiRequest<SolicitudResponse>(`/solicitudes/${encodeURIComponent(solicitudId)}/cancelar`, { method: 'PATCH' })
  return solicitudResponseToSolicitud(dto)
}
