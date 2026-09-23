'use client'

import { useState, type ReactNode } from 'react'
import { Drawer, Layout, Menu } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import type { UserRole } from '@rentar/shared-types'
import { useNextBridge } from '../../providers/NextBridge'
import { LOGO } from '../../assets/logo'
import { NotificationBell, type NotificationItem } from '../feedback/NotificationBell'
import { UserMenu, type UserMenuItem } from '../feedback/UserMenu'
import styles from './AppShell.module.css'

const { Sider, Header: LayoutHeader, Content } = Layout

export interface AppShellNavItem {
  key: string
  label: string
  href: string
  icon?: ReactNode
}

interface AppShellUser {
  name: string
  role: UserRole
  avatarUrl?: string
}

/** Props de {@link AppShell}. */
interface AppShellProps {
  /** Ítems de navegación — armados por rol en `apps/web` (ver `navConfig`). */
  navItems: AppShellNavItem[]
  /** `key` del ítem de navegación activo. */
  activeKey: string
  user: AppShellUser
  notifications?: NotificationItem[]
  /** Ítems de `UserMenu` por arriba de "Cerrar sesión" (Mi perfil, Notificaciones, cambio de contexto, Administración...). */
  userMenuItems?: UserMenuItem[]
  onLogout?: () => void
  children: ReactNode
  /** Igual que en `AuthLayout`: `min-height: 100%` en vez de `100vh`, para previsualizarlo acotado. */
  compact?: boolean
  /**
   * Selector "Viendo como..." del header (`RoleContextSwitcher`), para
   * cuentas con más de un rol — se monta entre el toggle mobile y las
   * acciones del header. `undefined`/`null` no ocupa espacio.
   */
  contextSwitcher?: ReactNode
  /**
   * `'admin'` aplica el header oscuro del rol admin (US-44/US-45): setea
   * `data-rentar-theme="dark"` sobre el header, reusando la paleta dark ya
   * calibrada de `tokens/css-vars.css` (la misma que usa el toggle de tema
   * de `/design-system`) en vez de inventar tokens nuevos. NOTA: los
   * paneles flotantes de `NotificationBell`/`UserMenu` se renderizan en un
   * portal fuera de este subárbol, así que siguen viéndose claros — alcance
   * de esta tanda es solo la barra del header.
   */
  variant?: 'default' | 'admin'
  'data-testid'?: string
}

/**
 * Layout base de los paneles autenticados (locador, locatario, garante,
 * admin): sidebar con el menú (fijo en desktop, `Drawer` en mobile) +
 * header con campanita de notificaciones y menú de usuario + área de
 * contenido. La navegación se recibe por props — este componente no sabe
 * nada de rutas de RentAR en particular.
 */
export function AppShell({
  navItems,
  activeKey,
  user,
  notifications = [],
  userMenuItems,
  onLogout,
  children,
  compact = false,
  contextSwitcher,
  variant = 'default',
  ...rest
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { ImageComponent, LinkComponent } = useNextBridge()

  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <LinkComponent href={item.href} onClick={() => setMobileOpen(false)}>
        {item.label}
      </LinkComponent>
    ),
  }))

  return (
    <Layout className={`${styles.layout} ${compact ? styles.layoutCompact : ''}`} {...rest}>
      <Sider width={240} className={styles.sider}>
        <div className={styles.logoWrap}>
          {/* `priority`: el logo del sider está siempre arriba del pliegue. Con lazy-loading, bajo
              1024px (sider en `display: none`) el `<img>` nunca carga y su `decode()` queda
              pendiente para siempre — colgaba la captura de previews de /design-sync. */}
          <ImageComponent src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="RentAR" style={{ height: '2rem', width: 'auto' }} priority />
        </div>
        <Menu mode="inline" selectedKeys={[activeKey]} items={menuItems} style={{ borderInlineEnd: 'none' }} />
      </Sider>

      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        closable={false}
        size={240}
        styles={{ body: { padding: 0 } }}
      >
        <div className={styles.logoWrap}>
          <ImageComponent src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="RentAR" style={{ height: '2rem', width: 'auto' }} />
        </div>
        <Menu mode="inline" selectedKeys={[activeKey]} items={menuItems} style={{ borderInlineEnd: 'none' }} />
      </Drawer>

      <Layout>
        <LayoutHeader className={styles.header} {...(variant === 'admin' ? { 'data-rentar-theme': 'dark' } : {})}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Abrir menú"
            onClick={() => setMobileOpen(true)}
            data-testid="app-shell-menu-toggle"
          >
            <MenuOutlined />
          </button>
          {contextSwitcher && <div className={styles.contextSwitcherSlot}>{contextSwitcher}</div>}
          <div className={styles.headerActions}>
            <NotificationBell notifications={notifications} />
            <UserMenu name={user.name} role={user.role} avatarUrl={user.avatarUrl} items={userMenuItems} onLogout={onLogout} />
          </div>
        </LayoutHeader>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
