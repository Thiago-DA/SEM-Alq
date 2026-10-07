/**
 * solicitudes.mock.ts — solicitudes de alquiler del elenco.
 *
 * Qué es: las solicitudes que ya existen el "hoy" del elenco (23/09/2026).
 * Las que se envían desde el modal "Solicitar alquiler" (US-35) se guardan
 * en el navegador encima de estas (`rentar:mock:solicitudes`, ver
 * `services/shared/mockStore.ts`), así la que se envía en el detalle aparece
 * después en Mis solicitudes y en el panel del locador.
 * Cubre: US-35 a US-38 (numeración de Jira).
 *
 * Reglas del elenco (ver `README.md` de esta carpeta):
 * - Rondeau 480, PB es la publicada de la narrativa y Julieta Peralta, la
 *   postulante: SOL-2026-0031 queda pendiente para mostrar el estado "ya la
 *   solicitaste" del detalle.
 * - Una propiedad alquilada (sin fecha de disponibilidad) o pausada no recibe
 *   solicitudes: no hay ninguna sobre esas.
 * - Prefijo de id: `SOL-2026-XXXX`.
 *
 * Quién lo usa: la rama mock de `services/solicitudes.service.ts` y de
 * `services/panel.service.ts`. Ninguna pantalla lo importa directo.
 *
 * TODO(db): son filas de la tabla de solicitudes, que todavía no existe.
 */
import type { EstadoSolicitud } from '@rentar/shared-types'

// ─── Tipos ──────────────────────────────────────────────────────────────

/**
 * Una solicitud de alquiler sobre una propiedad publicada, como la guardaría
 * el back. JSON puro, para poder guardarla en `localStorage`.
 */
export interface SolicitudMock {
  /** Prefijo `SOL-2026-`. */
  id: string
  propertyId: string
  /** `UsuarioSesion.id` de quien la envió. */
  applicantUserId: string
  /** Nombre y apellido de quien la envió (US-36: lo ve el locador). */
  applicantName: string
  /** Mensaje opcional al locador (US-35: hasta 1000 caracteres); `null` = sin mensaje. */
  message: string | null
  status: EstadoSolicitud
  /** Fecha (o fecha y hora) ISO en que se envió. */
  createdAt: string
  /** Fecha (o fecha y hora) ISO en que dejó de estar pendiente; `null` si sigue pendiente. */
  respondedAt: string | null
}

// ─── Solicitudes del elenco ─────────────────────────────────────────────

export const solicitudes: SolicitudMock[] = [
  {
    id: 'SOL-2026-0031',
    propertyId: 'prop-rondeau-480',
    applicantUserId: 'usr-julieta',
    // Mapa: Julieta encuentra Rondeau 480 en /buscar y la solicita. Todavía
    // no se aceptó (después termina en CT-2026-0207).
    applicantName: 'Julieta Peralta',
    // NOTA: el mapa no define un mensaje; no se inventa uno.
    message: null,
    status: 'pendiente',
    createdAt: '2026-09-20',
    respondedAt: null,
  },
]
