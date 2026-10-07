'use client'

/**
 * DetallePostulante.tsx — el detalle de una solicitud recibida: quién la
 * mandó, cuándo, su mensaje y las acciones.
 *
 * Qué muestra (Claude Design, "Flujo de solicitudes" · 02, panel del
 * costado): avatar, nombre y apellido (US-36), "Solicitó el 14/09/2026 ·
 * hace 2 días", el estado con su línea, la propiedad, el mensaje opcional
 * del postulante (US-36: "se debe leer el mensaje opcional incluido por el
 * locatario, si lo hubiera") y los botones grandes de acción.
 * En escritorio va al costado de la lista; en móvil, en un Drawer a pantalla
 * completa (· 05: "el detalle del postulante se abre como pantalla propia").
 *
 * NOTA: el diseño muestra la ficha del postulante (DNI, teléfono, email,
 * convivientes, mascotas, garantía, ingresos). El modal de US-35 no pide
 * esos datos y la solicitud no los trae: no van.
 *
 * Quién lo usa: `SolicitudesRecibidas`.
 */
import { Avatar } from 'antd'
import type { Solicitud } from '@rentar/shared-types'
import { StatusTag } from '@rentar/ui'
import { enviadaHace, fechaLargaNumerica, lineaRecibida } from '@/lib/solicitudes/textos'
import { iniciales } from '@/lib/utils/iniciales'
import type { AccionSolicitud } from '@/lib/validation/solicitud.rules'
import { AccionesSolicitudRecibida } from './FilaSolicitudRecibida'
import styles from './SolicitudesRecibidas.module.css'

/** Props de {@link DetallePostulante}. */
interface DetallePostulanteProps {
  solicitud: Solicitud
  /** La aceptada de la misma propiedad, si es otra. */
  otraAceptada: Solicitud | undefined
  onAccion: (accion: AccionSolicitud, solicitud: Solicitud) => void
}

/** El detalle de la solicitud elegida. */
export function DetallePostulante({ solicitud, otraAceptada, onAccion }: DetallePostulanteProps) {
  const propiedad = [solicitud.property.address, solicitud.property.neighborhoodName].filter(Boolean).join(' · ')

  return (
    <article className={styles.detail} aria-label={`Solicitud de ${solicitud.applicant.fullName}`} data-testid="solicitudes-detalle">
      <header className={styles.detailHeader}>
        <Avatar size={46} className={styles.avatarSelected} aria-hidden="true">
          {iniciales(solicitud.applicant.fullName)}
        </Avatar>
        <div className={styles.detailTitle}>
          <span className={styles.detailName}>{solicitud.applicant.fullName}</span>
          <span className={styles.detailSub}>
            Solicitó el {fechaLargaNumerica(solicitud.createdAt)} · {enviadaHace(solicitud)}
          </span>
        </div>
      </header>

      <div className={styles.detailBody}>
        <div className={styles.detailStatus}>
          <StatusTag domain="solicitud" status={solicitud.status} />
          <span className={styles.rowLine}>{lineaRecibida(solicitud, otraAceptada)}</span>
        </div>

        {propiedad && (
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Propiedad</span>
            <span className={styles.detailValue}>{propiedad}</span>
          </div>
        )}

        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Su mensaje</span>
          {solicitud.message ? (
            <p className={styles.detailMessage} data-testid="solicitudes-detalle-mensaje">
              {solicitud.message}
            </p>
          ) : (
            <span className={styles.detailEmpty} data-testid="solicitudes-detalle-mensaje">
              No dejó ningún mensaje.
            </span>
          )}
        </div>

        <AccionesSolicitudRecibida solicitud={solicitud} otraAceptada={otraAceptada} onAccion={onAccion} variante="detalle" testIdPrefix="solicitudes-detalle" />
      </div>
    </article>
  )
}
