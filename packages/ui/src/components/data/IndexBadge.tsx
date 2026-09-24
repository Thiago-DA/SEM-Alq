'use client'

/**
 * IndexBadge.tsx — insignia del índice de ajuste (ICL o IPC), con la explicación en un tooltip.
 *
 * Quién lo usa: `PropertyCard`, `SearchSidebarFilters`, `/panel/propiedades`, el alta y el
 * catálogo.
 */
// NOTA: `@ant-design/icons` crea un Context de React a nivel de módulo —
// rompe cualquier Server Component que importe este archivo sin
// `'use client'` (ver el mismo comentario en `tokens/status-meta.ts`).
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import type { AdjustmentIndex } from '@rentar/shared-types'
import styles from './IndexBadge.module.css'

const EXPLANATIONS: Record<AdjustmentIndex, string> = {
  IPC: 'Índice de Precios al Consumidor (INDEC): mide la inflación general del país.',
  ICL: 'Índice para Contratos de Locación (BCRA): combina salarios e inflación, pensado específicamente para alquileres.',
}

/** Props de {@link IndexBadge}. */
interface IndexBadgeProps {
  /** Índice de ajuste del contrato. */
  index: AdjustmentIndex
  'data-testid'?: string
}

/**
 * Badge del índice de ajuste (IPC/ICL) con tooltip explicativo — para que
 * un locador o locatario sin conocimiento técnico entienda qué significa
 * sin salir de la pantalla (RNF-10, usabilidad para perfiles no técnicos).
 */
export function IndexBadge({ index, ...rest }: IndexBadgeProps) {
  return (
    <Tooltip title={EXPLANATIONS[index]}>
      <span className={styles.badge} {...rest}>
        {index}
        <InfoCircleOutlined className={styles.icon} />
      </span>
    </Tooltip>
  )
}
