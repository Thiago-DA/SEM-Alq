'use client'

/**
 * StatCard.tsx — tarjeta de una cifra (KPI) con variación opcional.
 *
 * Quién lo usa: `/panel` y el catálogo `/design-system`.
 */
// NOTA: `@ant-design/icons` crea un Context de React a nivel de módulo —
// rompe cualquier Server Component que importe este archivo sin
// `'use client'` (ver el mismo comentario en `tokens/status-meta.ts`).
import type { ReactNode } from 'react'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import styles from './StatCard.module.css'

interface StatCardDelta {
  /** Texto de la variación, ej. "+12% vs. mes anterior". */
  label: string
  trend: 'up' | 'down' | 'neutral'
}

/** Props de {@link StatCard}. */
interface StatCardProps {
  title: string
  /** Valor principal, ya formateado por quien use el componente (`formatARS`, un número, etc.). */
  value: ReactNode
  delta?: StatCardDelta
  icon?: ReactNode
  'data-testid'?: string
}

const DELTA_ICON: Record<StatCardDelta['trend'], ReactNode> = {
  up: <ArrowUpOutlined />,
  down: <ArrowDownOutlined />,
  neutral: null,
}

const DELTA_CLASS: Record<StatCardDelta['trend'], string> = {
  up: styles.deltaUp,
  down: styles.deltaDown,
  neutral: styles.deltaNeutral,
}

/** Tarjeta de KPI: título, valor principal, variación opcional (con flecha) e ícono. */
export function StatCard({ title, value, delta, icon, ...rest }: StatCardProps) {
  return (
    <div className={styles.card} {...rest}>
      <div className={styles.header}>
        <p className={styles.title}>{title}</p>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <p className={styles.value}>{value}</p>
      {delta && (
        <span className={`${styles.delta} ${DELTA_CLASS[delta.trend]}`}>
          {DELTA_ICON[delta.trend]}
          {delta.label}
        </span>
      )}
    </div>
  )
}
