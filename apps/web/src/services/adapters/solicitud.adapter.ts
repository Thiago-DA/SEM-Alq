/**
 * solicitud.adapter.ts — traduce las solicitudes del back al tipo de vista,
 * y el envío del modal al cuerpo que esperaría el back.
 *
 * Qué es: la frontera entre `SolicitudResponse` / `CrearSolicitudRequest`
 * (DTOs PROPUESTOS, en `shared/backend-dtos.ts`: el back todavía no tiene el
 * módulo) y `Solicitud` / `SolicitudNueva` (tipos de vista de
 * `@rentar/shared-types`).
 * Cubre: US-35 Enviar solicitud, US-36 Consultar, US-37 Aceptar o rechazar y
 * US-38 Cancelar (numeración de Jira).
 * Quién lo usa: la rama real de `services/solicitudes.service.ts`.
 */
import type { Solicitud, SolicitudNueva } from '@rentar/shared-types'
import type { ActorSolicitud } from '@/lib/validation/solicitud.rules'
import { PLACEHOLDER_PHOTO_SRC } from '@/lib/imagenes/fotoConRespaldo'
import type { CrearSolicitudRequest, SolicitudResponse } from '../shared/backend-dtos'
import { formatApproxAddress, formatExactAddress } from './direccion'
import { barrioDe } from './propiedad.adapter'

/**
 * `SolicitudResponse` → `Solicitud`.
 *
 * `vista` dice quién la mira: `'locador'` (Solicitudes recibidas) o
 * `'postulante'` (Mis solicitudes, el detalle de la propiedad).
 *
 * Campo por campo:
 * - `property.address`: depende de quién mira (decisión del PO, tanda 2 del
 *   Sprint 2). El locador ve la EXACTA ("Rondeau 480, PB"): son sus propias
 *   propiedades, igual que en el panel. El postulante ve siempre la
 *   APROXIMADA ("Rondeau al 400"), como en la zona pública, en cualquier
 *   estado. NOTA: el diseño muestra la exacta en Mis solicitudes; manda la
 *   decisión del PO.
 * - `property.neighborhoodSlug` / `neighborhoodName`: `inmueble.barrio` (texto
 *   libre), con el slug del catálogo si lo tiene (`barrioDe`).
 * - `property.imageSrc`: `foto_principal`, o el placeholder si no tiene fotos.
 * - `applicant.fullName`: "Nombre Apellido".
 * - `message`: `null` si vino vacío.
 * - `respondedAt`: `fecha_respuesta` (TODO(backend): la columna no existe).
 */
export function solicitudResponseToSolicitud(dto: SolicitudResponse, vista: ActorSolicitud): Solicitud {
  const barrio = barrioDe(dto.inmueble.barrio)
  const { direccion, numero, piso } = dto.inmueble
  return {
    id: String(dto.id),
    property: {
      id: String(dto.inmueble.id),
      address: vista === 'locador' ? formatExactAddress(direccion, numero, piso) : formatApproxAddress(direccion, numero),
      neighborhoodSlug: barrio.slug,
      neighborhoodName: barrio.name,
      imageSrc: dto.inmueble.foto_principal ?? PLACEHOLDER_PHOTO_SRC,
    },
    applicant: {
      id: String(dto.postulante.id),
      fullName: [dto.postulante.nombre, dto.postulante.apellido].filter(Boolean).join(' '),
    },
    message: dto.mensaje?.trim() ? dto.mensaje : null,
    status: dto.estado,
    createdAt: dto.fecha_creacion,
    respondedAt: dto.fecha_respuesta ?? null,
  }
}

/**
 * `SolicitudNueva` → cuerpo de `POST /solicitudes`. El id de la propiedad
 * viaja como número (los ids del back son enteros; en el front, texto).
 * El mensaje ya llega normalizado (`null` si estaba vacío).
 */
export function solicitudNuevaToCrearRequest(nueva: SolicitudNueva): CrearSolicitudRequest {
  return { id_inmueble: Number(nueva.propertyId), mensaje: nueva.message }
}
