'use client'

/**
 * ConfirmActionModal.tsx — modal de confirmación para acciones que no se pueden deshacer.
 *
 * Quién lo usa: el catálogo `/design-system` (lo usará el detalle, por ejemplo para eliminar,
 * US-04).
 */
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'

/** Props de {@link ConfirmActionModal}. */
interface ConfirmActionModalProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Si es `true`, el botón de confirmar se pinta en rojo (eliminar, dar de baja). */
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
  'data-testid'?: string
}

/**
 * Confirmación de una acción destructiva o irreversible (eliminar una
 * propiedad, cerrar un reclamo, dar de baja la suscripción). Nunca ejecuta
 * la acción por su cuenta — solo confirma, `onConfirm` decide qué pasa.
 */
export function ConfirmActionModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel,
  ...rest
}: ConfirmActionModalProps) {
  return (
    <Modal
      open={open}
      title={
        <span>
          <ExclamationCircleFilled style={{ color: danger ? 'var(--rentar-color-error)' : 'var(--rentar-color-warning)', marginRight: 8 }} />
          {title}
        </span>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmLabel}
      cancelText={cancelLabel}
      okButtonProps={{ danger, 'data-testid': 'confirm-action-ok' }}
      cancelButtonProps={{ 'data-testid': 'confirm-action-cancel' }}
      {...rest}
    >
      {description && <p>{description}</p>}
    </Modal>
  )
}
