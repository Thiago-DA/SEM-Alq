/**
 * StatusBlock.tsx — bloque centrado de resultado: error del servidor o éxito.
 *
 * Qué es: los estados de "Autenticación" · 05 que reemplazan al formulario:
 * - `error`: "No pudimos procesar tu pedido" (o "sin internet") + Reintentar.
 * - `success`: "¡Listo, …!" + el siguiente paso (cuenta creada, US-19).
 * El texto lo pone quien lo usa; este componente solo arma el bloque.
 *
 * Quién lo usa: `LoginForm` y `RegistroForm`.
 */
import type { ReactNode } from 'react'
import styles from './StatusBlock.module.css'

interface StatusBlockProps {
  variant: 'error' | 'success'
  title: string
  description: ReactNode
  /** Botones y links del pie (Reintentar, "Buscar propiedades"...). */
  actions?: ReactNode
  'data-testid'?: string
}

/** Bloque de resultado con ícono, título, texto y acciones. */
export function StatusBlock({ variant, title, description, actions, ...rest }: StatusBlockProps) {
  return (
    // aria-live: el cambio de formulario a resultado se anuncia sin mover el foco.
    <div className={`${styles.block} ${styles[variant]}`} aria-live="polite" {...rest}>
      <span className={styles.icon} aria-hidden="true">
        {variant === 'error' ? '!' : '✓'}
      </span>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
