/**
 * solicitud-mock.adapter.ts — traduce una solicitud del elenco mock al tipo
 * de vista.
 *
 * Qué es: el equivalente, en modo mock, de `solicitud.adapter.ts`. La
 * solicitud mock guarda solo el id de la propiedad; la dirección y la foto
 * salen de la propiedad del elenco.
 * Cubre: US-35 a US-38 (numeración de Jira).
 * Quién lo usa: la rama mock de `services/solicitudes.service.ts`.
 */
import type { Solicitud } from '@rentar/shared-types'
import type { PropiedadMock, SolicitudMock } from '@/lib/mocks'
import { PLACEHOLDER_PHOTO_SRC } from '@/lib/imagenes/fotoConRespaldo'
import { formatApproxAddress } from './direccion'
import { mainPhotoSrc } from './propiedad-mock.adapter'

/**
 * `SolicitudMock` → `Solicitud`. Con las mismas reglas que la rama real
 * (`solicitud.adapter.ts#solicitudResponseToSolicitud`): dirección
 * aproximada y placeholder si la propiedad no tiene foto.
 * `propiedad` es `null` si ya no existe (por ejemplo, se reiniciaron los
 * datos de prueba): la solicitud se muestra igual, sin dirección.
 */
export function solicitudMockToSolicitud(solicitud: SolicitudMock, propiedad: PropiedadMock | null): Solicitud {
  return {
    id: solicitud.id,
    property: {
      id: solicitud.propertyId,
      address: propiedad ? formatApproxAddress(propiedad.street, propiedad.streetNumber) : '',
      neighborhoodSlug: propiedad?.neighborhoodSlug ?? '',
      neighborhoodName: propiedad?.neighborhoodName ?? '',
      imageSrc: (propiedad && mainPhotoSrc(propiedad)) || PLACEHOLDER_PHOTO_SRC,
    },
    applicant: { id: solicitud.applicantUserId, fullName: solicitud.applicantName },
    message: solicitud.message,
    status: solicitud.status,
    createdAt: solicitud.createdAt,
    // `?? null`: las enviadas en el navegador antes de la tanda 2 no tienen el campo.
    respondedAt: solicitud.respondedAt ?? null,
  }
}
