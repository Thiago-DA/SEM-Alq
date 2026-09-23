'use client'

import type { ReactNode } from 'react'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown } from 'antd'
import type { UserRole } from '@rentar/shared-types'
import { useNextBridge } from '../../providers/NextBridge'
import styles from './UserMenu.module.css'

const ROLE_LABEL: Record<UserRole, string> = {
  locador: 'Locador',
  locatario: 'Locatario',
  garante: 'Garante',
  admin: 'Administrador',
}

/**
 * Ítem configurable del menú (Mi perfil, Notificaciones, cambio de
 * contexto, Administración...). `href` navega, `onClick` ejecuta una
 * acción — un ítem usa uno u otro, no los dos.
 */
export interface UserMenuItem {
  key: string
  label: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
  danger?: boolean
}

/** Props de {@link UserMenu}. */
interface UserMenuProps {
  name: string
  role: UserRole
  avatarUrl?: string
  /**
   * Ítems por arriba de "Cerrar sesión" (que siempre es el último, fijo).
   * Los arma `apps/web` según el usuario en sesión — ver
   * `(app)/panel/layout.tsx`: "Mi perfil"/"Notificaciones" siempre,
   * "Cambiar a locador/locatario" solo con dos roles, "Administración"
   * solo con rol admin.
   */
  items?: UserMenuItem[]
  onLogout?: () => void
  'data-testid'?: string
}

/** Menú de usuario del `AppShell`: avatar, nombre, rol, ítems configurables y salir. */
export function UserMenu({ name, role, avatarUrl, items = [], onLogout, ...rest }: UserMenuProps) {
  const { LinkComponent } = useNextBridge()

  const menuItems = [
    ...items.map((item) => ({
      key: item.key,
      icon: item.icon,
      danger: item.danger,
      label: item.href ? <LinkComponent href={item.href}>{item.label}</LinkComponent> : item.label,
      onClick: item.onClick,
    })),
    {
      key: 'logout',
      label: <span data-testid="user-menu-logout">Cerrar sesión</span>,
      icon: <LogoutOutlined />,
      danger: true,
      onClick: onLogout,
    },
  ]

  return (
    <Dropdown trigger={['click']} menu={{ items: menuItems }}>
      <button type="button" className={styles.trigger} data-testid="user-menu-trigger" {...rest}>
        <Avatar src={avatarUrl} icon={!avatarUrl && <UserOutlined />} size="small" />
        <span className={styles.info}>
          <span className={styles.name}>{name}</span>
          <span className={styles.role}>{ROLE_LABEL[role]}</span>
        </span>
      </button>
    </Dropdown>
  )
}
