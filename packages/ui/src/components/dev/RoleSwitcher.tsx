'use client'

import { Segmented } from 'antd'
import type { UserRole } from '@rentar/shared-types'
import styles from './RoleSwitcher.module.css'

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'Locador', value: 'locador' },
  { label: 'Locatario', value: 'locatario' },
  { label: 'Garante', value: 'garante' },
  { label: 'Admin', value: 'admin' },
]

/** Props de {@link RoleSwitcher}. */
interface RoleSwitcherProps {
  role: UserRole
  onChange: (role: UserRole) => void
  'data-testid'?: string
}

/**
 * Selector flotante para ver la app como locador, locatario, garante o
 * admin sin autenticación real. Solo de desarrollo: no renderiza nada si
 * `NODE_ENV === 'production'`, para que nunca termine expuesto en producción.
 */
export function RoleSwitcher({ role, onChange, ...rest }: RoleSwitcherProps) {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className={styles.wrap} {...rest}>
      <Segmented
        value={role}
        onChange={(value) => onChange(value as UserRole)}
        options={ROLE_OPTIONS}
      />
    </div>
  )
}
