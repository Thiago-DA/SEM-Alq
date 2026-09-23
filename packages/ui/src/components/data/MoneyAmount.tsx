import { formatARS } from '../../utils/formatARS'
import styles from './MoneyAmount.module.css'

/** Props de {@link MoneyAmount}. */
interface MoneyAmountProps {
  /** Monto en pesos argentinos. */
  amount: number
  /** Tamaño tipográfico. @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Si es `true`, se muestra en dorado (ver "The Money-Is-Gold Rule" en
   * docs/DESIGN.md) — usar solo para el monto principal de una vista, no
   * para cada número de dinero que aparezca en una tabla.
   */
  emphasis?: boolean
  'data-testid'?: string
}

/**
 * Monto formateado en pesos argentinos (`formatARS`). El dorado queda
 * reservado a `emphasis`, para no diluir la regla de "dorado = dinero
 * destacado" repitiéndolo en cada celda de una tabla.
 */
export function MoneyAmount({ amount, size = 'md', emphasis = false, ...rest }: MoneyAmountProps) {
  return (
    <span
      className={`${styles.amount} ${styles[size]} ${emphasis ? styles.emphasis : ''}`}
      {...rest}
    >
      {formatARS(amount)}
    </span>
  )
}
