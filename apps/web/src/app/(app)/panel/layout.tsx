'use client'

/**
 * (app)/panel/layout.tsx — AppShell de todas las rutas `/panel/*`.
 *
 * Qué es: una sola raíz autenticada para locador y locatario; el rol activo
 * de `useAuth()` decide el menú (`lib/navigation/navConfig.tsx`), no la ruta.
 * También arma los ítems del UserMenu: Mi perfil, Notificaciones y, solo
 * para cuentas con dos roles, el cambio de contexto ("Cambiar a ..."). El
 * último ítem, "Cerrar sesión", lo agrega el propio UserMenu (US-39).
 *
 * De dónde saca los datos: `useAuth()` (`lib/auth/AuthProvider.tsx`).
 *
 * `'use client'` porque necesita hooks (`useAuth`, `usePathname`). La
 * pregunta "¿hay sesión?" ya la respondió `proxy.ts` antes de llegar acá.
 *
 * Quién lo usa: Next.js, para todas las páginas de `(app)/panel/*`.
 */
import { useEffect, useMemo, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { UserRole } from '@rentar/shared-types'
import { AppShell, RoleContextSwitcher, type UserMenuItem } from '@rentar/ui'
import { useAuth } from '@/lib/auth/AuthProvider'
import { navItemsByRole, type PanelRole } from '@/lib/navigation/navConfig'

const ROLE_LABEL: Record<PanelRole, string> = {
  locador: 'Locador',
  locatario: 'Locatario',
}

/** Reduce un `UserRole` a los dos roles que tienen panel propio. */
function isPanelRole(role: UserRole): role is PanelRole {
  return role === 'locador' || role === 'locatario'
}

/** AppShell del panel: menú por rol, UserMenu y cambio de contexto. */
export default function PanelLayout({ children }: { children: ReactNode }) {
  const { user, roles, activeRole, isLoading, logout, switchRole } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // ─── Sesión inválida ────────────────────────────────────────────────
  // Hay cookie (el proxy dejó pasar) pero AuthProvider no pudo resolver el
  // usuario: la sesión no sirve, se vuelve al login.
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, user, router, pathname])

  // ─── Menú y UserMenu ────────────────────────────────────────────────
  const panelRoles = useMemo(() => roles.filter(isPanelRole), [roles])
  const navItems = useMemo(() => (activeRole && isPanelRole(activeRole) ? navItemsByRole[activeRole] : []), [activeRole])

  const activeKey = useMemo(() => {
    const matches = navItems.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    // Gana el match más específico (href más largo): así "/panel" no le
    // gana a "/panel/propiedades" cuando la ruta activa es esta última.
    const mostSpecific = [...matches].sort((a, b) => b.href.length - a.href.length)[0]
    return mostSpecific?.key ?? navItems[0]?.key ?? ''
  }, [navItems, pathname])

  const userMenuItems = useMemo<UserMenuItem[]>(() => {
    if (!user || !activeRole) return []
    const items: UserMenuItem[] = [
      { key: 'perfil', label: 'Mi perfil', href: '/panel/perfil' },
      { key: 'notificaciones', label: 'Notificaciones', href: '/panel/notificaciones' },
    ]
    const otherRole = panelRoles.find((role) => role !== activeRole)
    if (otherRole) {
      items.push({
        key: 'switch-role',
        label: `Cambiar a ${ROLE_LABEL[otherRole]}`,
        onClick: () => {
          switchRole(otherRole)
          router.push('/panel')
        },
      })
    }
    return items
  }, [user, activeRole, panelRoles, switchRole, router])

  // ─── Render ─────────────────────────────────────────────────────────
  // Hueco breve mientras se lee la cookie y se resuelve el usuario (o
  // mientras corre el redirect a /login): no hay nada consistente que mostrar.
  if (isLoading || !user || !activeRole) {
    return null
  }

  return (
    <AppShell
      navItems={navItems}
      activeKey={activeKey}
      user={{ name: `${user.nombre} ${user.apellido}`, role: activeRole, avatarUrl: user.avatarUrl }}
      userMenuItems={userMenuItems}
      onLogout={logout}
      contextSwitcher={
        panelRoles.length > 1 ? (
          <RoleContextSwitcher
            roles={panelRoles.map((role) => ({ role, label: ROLE_LABEL[role] }))}
            activeRole={activeRole}
            onChange={(role) => {
              switchRole(role)
              router.push('/panel')
            }}
            data-testid="role-context-switcher"
          />
        ) : undefined
      }
      data-testid="app-shell-panel"
    >
      {children}
    </AppShell>
  )
}
