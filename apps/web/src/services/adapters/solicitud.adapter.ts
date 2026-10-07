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
import { PLACEHOLDER_PHOTO_SRC } from '@/lib/imagenes/fotoConRespaldo'
import type { CrearSolicitudRequest, SolicitudResponse } from '../shared/backend-dtos'
import { formatApproxAddress } from './direccion'
import { barrioDe } from './propiedad.adapter'

/**
 * `SolicitudResponse` → `Solicitud`.
 *
 * Campo por campo:
 * - `property.address`: dirección APROXIMADA ("Rondeau al 400"), igual que en
 *   la zona pública. NOTA: el diseño muestra la exacta en Mis solicitudes;
 *   cuándo se le revela al postulante (¿al aceptar?) se define en la tanda 2
 *   con US-36. Mientras tanto no se expone.
 * - `property.neighborhoodSlug` / `neighborhoodName`: `inmueble.barrio` (texto
 *   libre), con el slug del catálogo si lo tiene (`barrioDe`).
 * - `property.imageSrc`: `foto_principal`, o el placeholder si no tiene fotos.
 * - `applicant.fullName`: "Nombre Apellido".
 * - `message`: `null` si vino vacío.
 * - `respondedAt`: `fecha_respuesta` (TODO(backend): la columna no existe).
 */
export function solicitudResponseToSolicitud(dto: SolicitudResponse): Solicitud {
  const barrio = barrioDe(dto.inmueble.barrio)
  return {
    id: String(dto.id),
    property: {
      id: String(dto.inmueble.id),
      address: formatApproxAddress(dto.inmueble.direccion, dto.inmueble.numero),
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
