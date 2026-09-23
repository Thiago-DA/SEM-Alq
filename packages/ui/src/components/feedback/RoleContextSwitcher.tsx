'use client'

import { DownOutlined, SwapOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import type { UserRole } from '@rentar/shared-types'
import styles from './RoleContextSwitcher.module.css'

export interface RoleContextOption {
  role: UserRole
  label: string
}

/** Props de {@link RoleContextSwitcher}. */
interface RoleContextSwitcherProps {
  roles: RoleContextOption[]
  activeRole: UserRole
  onChange: (role: UserRole) => void
  'data-testid'?: string
}

/**
 * Selector "Viendo como..." del header del `AppShell`, para cuentas con más
 * de un rol (hoy, solo Sofía Ledesma: locadora de Mariano Moreno 285 y
 * locataria de Obispo Trejo 1250 7° B — ver "Cambio de rol" en
 * `docs/MapaDePantallas.pdf`). Se monta en el slot `contextSwitcher` de
 * `AppShell` solo cuando `roles.length > 1`.
 *
 * Distinto de `packages/ui/src/components/dev/RoleSwitcher.tsx`: ese es
 * una herramienta de desarrollo (previsualizar sin sesión, gateada por
 * `NODE_ENV`) — este es producto real, cablea con la sesión simulada de
 * `apps/web` (`AuthProvider#switchRole`).
 */
export function RoleContextSwitcher({ roles, activeRole, onChange, ...rest }: RoleContextSwitcherProps) {
  const activo = roles.find((option) => option.role === activeRole) ?? roles[0]

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        selectedKeys: [activeRole],
        items: roles.map((option) => ({
          key: option.role,
          label: option.label,
          onClick: () => onChange(option.role),
        })),
      }}
    >
      <button type="button" className={styles.trigger} {...rest}>
        <SwapOutlined className={styles.swapIcon} />
        <span className={styles.text}>
          Viendo como <strong>{activo.label}</strong>
        </span>
        <DownOutlined className={styles.chevron} />
      </button>
    </Dropdown>
  )
}
