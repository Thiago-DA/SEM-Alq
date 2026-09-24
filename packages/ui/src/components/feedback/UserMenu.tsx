'use client'

import { useState, type ReactNode } from 'react'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Drawer, Dropdown, Grid, type MenuProps } from 'antd'
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
  /** Contador rojo a la derecha del ítem (ej. notificaciones sin leer). Sin valor o en 0, no se muestra. */
  badgeCount?: number
}

/** Props de {@link UserMenu}. */
interface UserMenuProps {
  name: string
  role: UserRole
  avatarUrl?: string
  /**
   * Segunda línea de la cabecera del menú desplegado, debajo del nombre (ej.
   * "Locatario · Obispo Trejo 1250"). Si no se pasa, se muestra el rol.
   */
  subtitle?: string
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

/** Iniciales para el avatar sin foto: "Sofía Ledesma" → "SL". */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Menú de usuario del `AppShell`: el botón con avatar, nombre y rol abre la
 * "puerta de todo lo que no está en el menú lateral" (Claude Design, "Mi
 * perfil y legajo" · 02): cabecera con avatar, nombre y subtítulo; los ítems
 * configurables (con contador opcional); un separador y "Cerrar sesión", en
 * rojo, siempre último.
 *
 * En escritorio se despliega como dropdown. En móvil (debajo de 768px) sube
 * como una hoja desde abajo, con ítems de 48px de alto para el dedo.
 */
export function UserMenu({ name, role, avatarUrl, subtitle, items = [], onLogout, ...rest }: UserMenuProps) {
  const { LinkComponent } = useNextBridge()
  const screens = Grid.useBreakpoint()
  // NOTA: en el primer render (y en el servidor) `screens` viene vacío; se
  // asume escritorio hasta saber el ancho real, para no abrir una hoja
  // móvil en escritorio.
  const isMobile = screens.md === false
  const [sheetOpen, setSheetOpen] = useState(false)

  const secondLine = subtitle ?? ROLE_LABEL[role]
  const avatar = (size: number) => (
    <Avatar src={avatarUrl} size={size} className={styles.avatar}>
      {!avatarUrl && (initials(name) || <UserOutlined />)}
    </Avatar>
  )

  /** Texto del ítem con su contador, si tiene. */
  const itemLabel = (item: UserMenuItem) => (
    <span className={styles.itemLabel}>
      <span>{item.label}</span>
      {item.badgeCount ? (
        <span className={styles.badge} aria-label={`${item.badgeCount} sin leer`}>
          {item.badgeCount}
        </span>
      ) : null}
    </span>
  )

  // ─── Escritorio: dropdown ───────────────────────────────────────────
  const menuItems: MenuProps['items'] = [
    ...items.map((item) => ({
      key: item.key,
      icon: item.icon,
      danger: item.danger,
      label: item.href ? <LinkComponent href={item.href}>{itemLabel(item)}</LinkComponent> : itemLabel(item),
      onClick: item.onClick,
      'data-testid': `user-menu-item-${item.key}`,
    })),
    { type: 'divider' as const },
    {
      key: 'logout',
      label: <span data-testid="user-menu-logout">Cerrar sesión</span>,
      icon: <LogoutOutlined />,
      danger: true,
      onClick: onLogout,
    },
  ]

  const header = (
    <div className={styles.header}>
      {avatar(36)}
      <span className={styles.headerText}>
        <span className={styles.headerName}>{name}</span>
        <span className={styles.headerSubtitle}>{secondLine}</span>
      </span>
    </div>
  )

  const trigger = (
    <button
      type="button"
      className={styles.trigger}
      data-testid="user-menu-trigger"
      aria-haspopup="menu"
      onClick={isMobile ? () => setSheetOpen(true) : undefined}
      {...rest}
    >
      <Avatar src={avatarUrl} icon={!avatarUrl && <UserOutlined />} size="small" />
      <span className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.role}>{ROLE_LABEL[role]}</span>
      </span>
    </button>
  )

  if (!isMobile) {
    return (
      <Dropdown
        trigger={['click']}
        menu={{ items: menuItems }}
        popupRender={(menu) => (
          <div className={styles.popup} data-testid="user-menu-popup">
            {header}
            {menu}
          </div>
        )}
      >
        {trigger}
      </Dropdown>
    )
  }

  // ─── Móvil: hoja desde abajo ────────────────────────────────────────
  /** Cierra la hoja y después ejecuta la acción del ítem. */
  const run = (action?: () => void) => () => {
    setSheetOpen(false)
    action?.()
  }

  return (
    <>
      {trigger}
      <Drawer
        placement="bottom"
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        closable={false}
        size="auto"
        className={styles.sheet}
        styles={{ body: { padding: 0 } }}
        data-testid="user-menu-sheet"
      >
        <div className={styles.sheetBody}>
          <span className={styles.handle} aria-hidden="true" />
          <div className={styles.sheetHeader}>
            {avatar(44)}
            <span className={styles.headerText}>
              <span className={styles.sheetName}>{name}</span>
              <span className={styles.headerSubtitle}>{secondLine}</span>
            </span>
          </div>
          <nav aria-label="Menú de usuario" className={styles.sheetList}>
            {items.map((item) =>
              item.href ? (
                <LinkComponent
                  key={item.key}
                  href={item.href}
                  className={styles.sheetItem}
                  onClick={run(item.onClick)}
                  data-testid={`user-menu-item-${item.key}`}
                >
                  <span className={styles.sheetIcon}>{item.icon}</span>
                  {itemLabel(item)}
                </LinkComponent>
              ) : (
                <button
                  key={item.key}
                  type="button"
                  className={styles.sheetItem}
                  onClick={run(item.onClick)}
                  data-testid={`user-menu-item-${item.key}`}
                >
                  <span className={styles.sheetIcon}>{item.icon}</span>
                  {itemLabel(item)}
                </button>
              ),
            )}
            <button type="button" className={`${styles.sheetItem} ${styles.sheetLogout}`} onClick={run(onLogout)} data-testid="user-menu-logout">
              <span className={styles.sheetIcon}>
                <LogoutOutlined />
              </span>
              Cerrar sesión
            </button>
          </nav>
        </div>
      </Drawer>
    </>
  )
}
