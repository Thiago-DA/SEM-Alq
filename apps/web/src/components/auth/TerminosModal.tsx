'use client'

/**
 * TerminosModal.tsx — marcador para "Términos y condiciones" y "Política de
 * privacidad" del registro (US-19).
 *
 * Qué es: el registro pide aceptar los términos, pero los textos legales
 * todavía no existen. Para que los links del checkbox no queden rotos (y sin
 * inventar rutas nuevas), abren este modal con un aviso.
 * TODO: reemplazar por el texto legal real cuando exista (no es de backend).
 *
 * Quién lo usa: `RegistroForm`.
 */
import { Modal } from 'antd'

/** Qué documento se abrió. */
export type DocumentoLegal = 'terminos' | 'privacidad'

const TITULOS: Record<DocumentoLegal, string> = {
  terminos: 'Términos y condiciones',
  privacidad: 'Política de privacidad',
}

interface TerminosModalProps {
  /** Documento abierto; `null` = modal cerrado. */
  documento: DocumentoLegal | null
  onClose: () => void
}

/** Modal de marcador para los textos legales. */
export function TerminosModal({ documento, onClose }: TerminosModalProps) {
  return (
    <Modal
      open={documento !== null}
      title={documento ? TITULOS[documento] : ''}
      onCancel={onClose}
      onOk={onClose}
      okText="Entendido"
      cancelButtonProps={{ style: { display: 'none' } }}
      data-testid="terminos-modal"
    >
      <p>El texto de este documento está en redacción y va a estar disponible próximamente.</p>
    </Modal>
  )
}
