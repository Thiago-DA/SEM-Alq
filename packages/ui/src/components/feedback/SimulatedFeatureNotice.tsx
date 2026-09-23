import { Alert } from 'antd'

/** Props de {@link SimulatedFeatureNotice}. */
interface SimulatedFeatureNoticeProps {
  /** Qué función es simulada, ej. "el pago" o "la firma electrónica". Si no se pasa, el mensaje queda genérico. */
  feature?: string
  'data-testid'?: string
}

/**
 * Aviso de que una función todavía es simulada (sin backend real detrás) —
 * pagos, firma electrónica, notificaciones. Sigue el principio de
 * "prototype honesty" de docs/PRODUCT.md: nunca simular que algo funciona
 * de verdad sin decirlo.
 */
export function SimulatedFeatureNotice({ feature, ...rest }: SimulatedFeatureNoticeProps) {
  return (
    <Alert
      type="info"
      showIcon
      title={
        feature
          ? `Esta función (${feature}) todavía es simulada — no hay backend conectado en esta etapa.`
          : 'Esta función todavía es simulada — no hay backend conectado en esta etapa.'
      }
      {...rest}
    />
  )
}
