'use client'

import { CheckOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { MoneyAmount } from './MoneyAmount'
import styles from './PlanCard.module.css'

/** Props de {@link PlanCard}. */
interface PlanCardProps {
  name: string
  priceMonthly: number
  description?: string
  features: string[]
  /** Marca visualmente el plan recomendado en la comparativa (no más de uno por vez). */
  highlighted?: boolean
  /** Si es `true`, reemplaza el CTA por un estado "Plan actual" sin acción. */
  currentPlan?: boolean
  ctaLabel?: string
  /** No navega por sí solo — quien compone (`/planes`, `/panel/suscripcion`) decide qué hacer al elegir el plan. */
  onSelect?: () => void
  'data-testid'?: string
}

/**
 * Tarjeta de un plan de suscripción, para la comparativa de `/planes` y
 * `/panel/suscripcion` (upgrade/downgrade). El precio va en dorado
 * (`MoneyAmount` con `emphasis`) — es el único elemento de la tarjeta que
 * lleva ese color, siguiendo la regla de `docs/DESIGN.md`.
 */
export function PlanCard({ name, priceMonthly, description, features, highlighted = false, currentPlan = false, ctaLabel = 'Elegir plan', onSelect, ...rest }: PlanCardProps) {
  return (
    <div className={`${styles.wrap} ${highlighted ? styles.highlighted : ''}`} {...rest}>
      {highlighted && <span className={styles.highlightTag}>Recomendado</span>}

      <h3 className={styles.name}>{name}</h3>
      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.priceRow}>
        <MoneyAmount amount={priceMonthly} size="lg" emphasis />
        <span className={styles.pricePeriod}>/mes</span>
      </div>

      <ul className={styles.features}>
        {features.map((feature) => (
          <li key={feature} className={styles.feature}>
            <CheckOutlined className={styles.featureIcon} />
            {feature}
          </li>
        ))}
      </ul>

      {currentPlan ? (
        <span className={styles.currentPlanTag} data-testid="plan-card-current">
          Plan actual
        </span>
      ) : (
        <Button type={highlighted ? 'primary' : 'default'} block onClick={onSelect} data-testid="plan-card-select-button">
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
