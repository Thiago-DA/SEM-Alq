/**
 * solicitud.ts — solicitudes de alquiler tal como las muestra el frontend.
 *
 * Qué es: TIPOS DE VISTA DEL FRONT. El back todavía no tiene el módulo de
 * solicitudes (ni tabla ni rutas): cuando exista, el adaptador
 * `apps/web/src/services/adapters/solicitud.adapter.ts` traduce su DTO a
 * estos tipos, y las pantallas no cambian.
 * Cubre: US-35 Enviar solicitud de alquiler, US-36 Consultar solicitudes,
 * US-37 Aceptar o rechazar y US-38 Cancelar solicitud (numeración de Jira).
 *
 * Quién lo usa: `services/solicitudes.service.ts`, el detalle público de la
 * propiedad (`/propiedad/[id]`) y, desde la tanda 2 del Sprint 2,
 * `/panel/mis-solicitudes` y `/panel/solicitudes`.
 */
import type { SolicitudStatus } from './status'

/**
 * Estado de una solicitud: `pendiente`, `aceptada`, `rechazada` o `cancelada`.
 * Alias de {@link SolicitudStatus} (el tipo que entiende `StatusTag`), con el
 * nombre en castellano que usan los services y las pantallas.
 * NOTA: US-36 dice "en espera"; acá es `pendiente` (así lo muestra el diseño
 * y el `StatusTag` del dominio `solicitud`).
 */
export type EstadoSolicitud = SolicitudStatus

/**
 * Una solicitud de alquiler, vista por quien la envió (US-36: dirección de la
 * propiedad) o por el locador que la recibe (US-36: nombre y apellido del
 * postulante). Las dos vistas comparten el tipo.
 */
export interface Solicitud {
  /** Id de la solicitud, ej. `SOL-2026-0031` en modo mock. */
  id: string
  property: {
    id: string
    /** Dirección de la propiedad (US-36: la ve el locatario). */
    address: string
    /** Foto principal (US-36: "la imagen principal de la propiedad"). */
    imageSrc: string
  }
  applicant: {
    id: string
    /** Nombre y apellido de quien la envió (US-36: lo ve el locador). */
    fullName: string
  }
  /** Mensaje opcional al locador (US-35: hasta 1000 caracteres, ver `SOLICITUD_MENSAJE_MAX` en `apps/web/src/lib/validation/solicitud.rules.ts`); `null` si no escribió nada. */
  message: string | null
  status: EstadoSolicitud
  /** Fecha y hora ISO de envío. */
  createdAt: string
}

/** Lo que manda el modal "Solicitar alquiler" (US-35). El postulante sale de la sesión. */
export interface SolicitudNueva {
  propertyId: string
  /** `null` o texto de hasta 1000 caracteres (US-35). */
  message: string | null
}
