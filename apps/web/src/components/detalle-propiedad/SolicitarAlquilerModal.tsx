'use client'

/**
 * SolicitarAlquilerModal.tsx — el modal "Solicitar alquiler": cabecera de la
 * propiedad, mensaje opcional al dueño y "Antes de enviar"; después, la
 * pantalla de éxito.
 *
 * Diseño: Claude Design, "Flujo de solicitudes" · 01 (modal y "Enviada ·
 * confirmación") y · 05 (en móvil, pantalla completa con las acciones fijas
 * al pie).
 * Cubre: US-35 Enviar solicitud de alquiler (numeración de Jira).
 * Datos: `solicitudes.service#enviarSolicitud`.
 * Quién lo usa: `DetallePropiedad`.
 *
 * NOTA (decisión del PO): el diseño también pide "Tus datos" (nombre, DNI,
 * teléfono, email), ocupación, ingresos, convivientes, mascotas, garantía y
 * un check final obligatorio. Ninguna US del sprint los pide: quedan afuera.
 * El modal tiene solo lo que US-35 pide (el mensaje opcional) y el texto de
 * "Antes de enviar".
 * NOTA: el mail al locador lo manda el back (TODO(backend) en el service);
 * acá solo se avisa que se mandó.
 */
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Alert, Button, Input, Modal } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import type { PropiedadDetalle } from '@rentar/shared-types'
import { MoneyAmount } from '@rentar/ui'
import { useAuth } from '@/lib/auth/AuthProvider'
import { hrefBuscarEnBarrio } from '@/lib/search/busquedaParams'
import { SOLICITUD_MENSAJE_MAX } from '@/lib/validation/solicitud.rules'
import { enviarSolicitud } from '@/services/solicitudes.service'
import { ServiceError } from '@/services/shared/errors'
import { hrefLoginParaSolicitar } from './estadoAccion'
import styles from './SolicitarAlquilerModal.module.css'

// ─── Tipos ──────────────────────────────────────────────────────────────

/**
 * En qué parte del flujo está el modal:
 * - `formulario`: escribiendo (con un error opcional arriba de las acciones).
 * - `exito`: se envió (Flujo · 01, "Enviada · confirmación").
 * - `duplicada`: el back respondió 409 (ya la había solicitado).
 * - `sesion_vencida`: 401 con un mensaje escrito (se avisa que se pierde).
 */
type Fase =
  | { tipo: 'formulario'; error: string | null }
  | { tipo: 'exito' }
  | { tipo: 'duplicada' }
  | { tipo: 'sesion_vencida' }

/** Props de {@link SolicitarAlquilerModal}. */
interface SolicitarAlquilerModalProps {
  open: boolean
  propiedad: PropiedadDetalle
  /**
   * Se cerró el modal. `cambioElEstado` es `true` si ya existe una solicitud
   * (se envió o el back dijo que ya había una): el detalle vuelve a pedir
   * "mi solicitud" para mostrar su estado en el botón.
   */
  onClose: (cambioElEstado: boolean) => void
}

/** Mis solicitudes (placeholder hasta la tanda 2). */
const HREF_MIS_SOLICITUDES = '/panel/mis-solicitudes'

/** Modal "Solicitar alquiler" (US-35). Se monta de cero cada vez que se abre. */
export function SolicitarAlquilerModal({ open, propiedad, onClose }: SolicitarAlquilerModalProps) {
  const router = useRouter()
  const { logout } = useAuth()

  // ─── Estado local ───────────────────────────────────────────────────────
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [fase, setFase] = useState<Fase>({ tipo: 'formulario', error: null })

  const nombreDueno = propiedad.owner?.fullName ?? null
  const primerNombre = nombreDueno?.split(' ')[0] ?? null
  const hrefLogin = hrefLoginParaSolicitar(propiedad.id)

  // ─── Handlers ───────────────────────────────────────────────────────────

  /**
   * 401: vuelve a ingresar y retoma acá (`/login?next=/propiedad/[id]?solicitar=1`).
   * NOTA: primero se cierra la sesión que quedó en memoria (`logout({ quedarse: true })`):
   * si no, `/login` todavía ve al usuario y lo devuelve a `next` sin pedirle nada.
   */
  const reingresar = () => {
    logout({ quedarse: true })
    router.push(hrefLogin)
  }

  const cerrar = () => {
    if (enviando) return
    onClose(fase.tipo === 'exito' || fase.tipo === 'duplicada')
  }

  const enviar = async () => {
    setEnviando(true)
    setFase({ tipo: 'formulario', error: null })
    try {
      await enviarSolicitud({ propertyId: propiedad.id, message: mensaje })
      setFase({ tipo: 'exito' })
    } catch (error) {
      if (error instanceof ServiceError && error.code === 'conflict') {
        // 409: no se cierra sin explicar qué pasó.
        setFase({ tipo: 'duplicada' })
      } else if (error instanceof ServiceError && error.code === 'unauthorized') {
        // 401: se vuelve a ingresar y se retoma acá (?solicitar=1). Si escribió algo, primero se avisa.
        if (mensaje.trim()) setFase({ tipo: 'sesion_vencida' })
        else reingresar()
      } else {
        const texto = error instanceof ServiceError ? error.message : 'No pudimos enviar la solicitud. Probá de nuevo en un momento.'
        setFase({ tipo: 'formulario', error: texto })
      }
    } finally {
      setEnviando(false)
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  const footer = (() => {
    switch (fase.tipo) {
      case 'exito':
        return (
          <div className={styles.footerStack}>
            <Button type="primary" size="large" block href={HREF_MIS_SOLICITUDES} className={styles.action} data-testid="solicitar-ver-solicitudes-button">
              Ver mis solicitudes
            </Button>
            <Button size="large" block href={hrefBuscarEnBarrio(propiedad.neighborhoodSlug)} className={styles.action} data-testid="solicitar-seguir-buscando-button">
              Seguir buscando
            </Button>
          </div>
        )
      case 'duplicada':
        return (
          <div className={styles.footerRow}>
            <Button size="large" onClick={cerrar} className={styles.action} data-testid="solicitar-cerrar-button">
              Cerrar
            </Button>
            <Button type="primary" size="large" href={HREF_MIS_SOLICITUDES} className={styles.action} data-testid="solicitar-ver-mi-solicitud-button">
              Ver mi solicitud
            </Button>
          </div>
        )
      case 'sesion_vencida':
        return (
          <div className={styles.footerRow}>
            <Button size="large" onClick={() => setFase({ tipo: 'formulario', error: null })} className={styles.action} data-testid="solicitar-volver-button">
              Volver al mensaje
            </Button>
            <Button type="primary" size="large" onClick={reingresar} className={styles.action} data-testid="solicitar-reingresar-button">
              Ingresar de nuevo
            </Button>
          </div>
        )
      case 'formulario':
        return (
          <div className={styles.footerRow}>
            <Button size="large" onClick={cerrar} disabled={enviando} className={styles.action} data-testid="solicitar-cancelar-button">
              Cancelar
            </Button>
            <Button type="primary" size="large" onClick={enviar} loading={enviando} className={styles.action} data-testid="solicitar-enviar-button">
              Enviar solicitud
            </Button>
          </div>
        )
    }
  })()

  return (
    <Modal
      open={open}
      onCancel={cerrar}
      title={fase.tipo === 'exito' ? null : 'Solicitar alquiler'}
      footer={footer}
      width={560}
      centered
      destroyOnHidden
      mask={{ closable: !enviando }}
      keyboard={!enviando}
      className={styles.modal}
      classNames={{ container: styles.container, body: styles.body, footer: styles.footer }}
    >
      <div data-testid="solicitar-modal">
        {fase.tipo === 'exito' ? (
          // ─── Enviada · confirmación (Flujo · 01) ───
          <div className={styles.success} data-testid="solicitar-exito">
            <CheckCircleFilled className={styles.successIcon} aria-hidden="true" />
            <h2 className={styles.successTitle}>{primerNombre ? `Le mandamos tu solicitud a ${primerNombre}` : 'Le mandamos tu solicitud al dueño'}</h2>
            {/* US-35: el back le manda un mail al locador; acá solo se informa. */}
            <p className={styles.successText} data-testid="solicitar-exito-mail">
              {nombreDueno ? `Le avisamos por mail a ${nombreDueno}.` : 'Le avisamos por mail al dueño.'} Te avisamos cuando responda.
            </p>
            <p className={styles.successText}>Mientras tanto seguí mirando: podés tener varias solicitudes abiertas a la vez.</p>
          </div>
        ) : (
          <>
            {/* ─── Cabecera de la propiedad ─── */}
            <div className={styles.property}>
              {/* `unoptimized`, como en el alta: en modo mock la foto puede ser una data URL. */}
              <Image src={propiedad.imageSrc} alt="" width={96} height={72} unoptimized className={styles.propertyPhoto} />
              <div className={styles.propertyText}>
                <span className={styles.propertyAddress}>
                  {propiedad.address}
                  {propiedad.neighborhoodName && ` · ${propiedad.neighborhoodName}`}
                </span>
                <span className={styles.propertyMeta}>
                  {propiedad.rooms} {propiedad.rooms === 1 ? 'ambiente' : 'ambientes'} · {propiedad.areaM2} m²
                </span>
                <span className={styles.propertyPrice}>
                  {propiedad.priceMonthly === null ? 'Precio a consultar' : <><MoneyAmount amount={propiedad.priceMonthly} emphasis /> / mes</>}
                </span>
              </div>
            </div>

            {fase.tipo === 'duplicada' && (
              <Alert
                type="info"
                showIcon
                className={styles.alert}
                title="Ya habías enviado una solicitud para esta propiedad"
                description="Podés ver en qué estado está desde Mis solicitudes."
                data-testid="solicitar-duplicada"
              />
            )}

            {fase.tipo === 'sesion_vencida' && (
              <Alert
                type="warning"
                showIcon
                className={styles.alert}
                title="Tu sesión venció"
                description="Para enviarla tenés que ingresar de nuevo. Al volver se abre este formulario, pero el mensaje que escribiste se pierde: copialo antes si lo querés conservar."
                data-testid="solicitar-sesion-vencida"
              />
            )}

            {fase.tipo === 'formulario' && (
              <>
                {/* ─── Mensaje al dueño ─── */}
                <section className={styles.field}>
                  <label htmlFor="solicitar-mensaje" className={styles.label}>
                    Mensaje al dueño <span className={styles.optional}>· opcional</span>
                  </label>
                  <p className={styles.help}>Lo primero que lee. Contale cuándo te querés mudar y por cuánto tiempo.</p>
                  {/*
                   * US-35: "se puede adjuntar un mensaje de hasta 1000 caracteres" y "se debe
                   * informar en tiempo real la cantidad de caracteres ingresados": `maxLength`
                   * corta en 1000 y `showCount` muestra "N / 1000" mientras se escribe.
                   */}
                  <Input.TextArea
                    id="solicitar-mensaje"
                    value={mensaje}
                    onChange={(event) => setMensaje(event.target.value)}
                    maxLength={SOLICITUD_MENSAJE_MAX}
                    showCount
                    autoSize={{ minRows: 5, maxRows: 10 }}
                    disabled={enviando}
                    placeholder={primerNombre ? `Hola ${primerNombre}, …` : 'Hola, …'}
                    data-testid="solicitar-mensaje"
                  />
                </section>

                {/* ─── Antes de enviar ─── */}
                <section className={styles.before}>
                  <h3 className={styles.beforeTitle}>Antes de enviar</h3>
                  <p className={styles.beforeText}>
                    Enviás una solicitud {nombreDueno ? `a ${nombreDueno}` : 'al dueño'} por {propiedad.address}. Va a ver tu nombre y apellido y tu mensaje, y le
                    llega un aviso por mail. Enviarla no reserva la propiedad.
                  </p>
                </section>

                {fase.error && <Alert type="error" showIcon className={styles.alert} title={fase.error} data-testid="solicitar-error" />}
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
