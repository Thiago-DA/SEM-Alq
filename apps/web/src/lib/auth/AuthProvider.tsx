'use client'

/**
 * AuthProvider.tsx — sesión y rol activo, en un solo contexto.
 *
 * Qué es: quién está logueado, sus roles y cuál está activo ahora mismo.
 * El rol activo vive en el mismo provider que la sesión: es lo que usa el
 * cambio de contexto del UserMenu para cuentas con dos roles (hoy, solo
 * Sofía Ledesma: locadora de Mariano Moreno 285 y locataria de Obispo Trejo
 * 1250).
 * Cubre: US-39 Iniciar y cerrar sesión ("vincular la sesión al navegador" =
 * cookie `rentar_session`; "desvincularla" = borrarla).
 *
 * De dónde saca los datos: `services/auth.service.ts` (login/logout) y
 * `services/usuarios.service.ts` (recuperar el perfil al recargar).
 *
 * Quién lo usa: `useAuth()` desde cualquier Client Component (layout del
 * panel, pantallas de login y registro). Se monta una sola vez, en
 * `lib/AppProviders.tsx`.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { UserRole, UsuarioSesion } from '@rentar/shared-types'
import { login as loginRequest, logout as logoutRequest, type LoginCredentials } from '@/services/auth.service'
import { getUsuarioSesion } from '@/services/usuarios.service'
import { clearSessionFromDocument, readSessionFromDocument, writeSessionToDocument } from './session-cookie'

interface AuthContextValue {
  user: UsuarioSesion | null
  roles: UserRole[]
  activeRole: UserRole | null
  /** `true` mientras se resuelve la sesión desde la cookie al montar. */
  isLoading: boolean
  /**
   * Valida credenciales y guarda la sesión. `remember` = "Recordarme en este
   * dispositivo" (30 días). Devuelve el usuario para que la pantalla decida
   * adónde ir.
   */
  login: (credentials: LoginCredentials, options?: { remember?: boolean }) => Promise<UsuarioSesion>
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Rol con el que arranca la sesión. Si la cuenta es locadora, arranca como
 * locador (su panel es el que existe en el Sprint 1); si no, con el primero.
 */
function initialRole(user: UsuarioSesion): UserRole {
  return user.roles.includes('locador') ? 'locador' : user.roles[0]
}

/** Provider de sesión. Envuelve toda la app (ver `lib/AppProviders.tsx`). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  // ─── Estado local ───────────────────────────────────────────────────
  const [user, setUser] = useState<UsuarioSesion | null>(null)
  const [activeRole, setActiveRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Si la sesión actual se creó con "Recordarme"; se conserva al cambiar de rol.
  const [persistent, setPersistent] = useState(false)

  // ─── Carga de datos: hidratar la sesión desde la cookie al montar ────
  // Todos los setState corren dentro de .then()/.finally() (también el caso
  // "sin cookie", vía Promise.resolve(null)) para que ninguno se ejecute de
  // forma síncrona en el cuerpo del efecto.
  useEffect(() => {
    let cancelled = false
    const session = readSessionFromDocument()
    const resolveUser = session ? getUsuarioSesion(session.userId) : Promise.resolve(null)

    resolveUser
      .then((usuario) => {
        if (cancelled) return
        if (session && usuario && usuario.roles.includes(session.activeRole)) {
          setUser(usuario)
          setActiveRole(session.activeRole)
          setPersistent(session.persistent === true)
        } else if (session) {
          // Cookie corrupta, o usuario que ya no existe o perdió ese rol: se
          // descarta en vez de dejar la app en un estado inconsistente.
          clearSessionFromDocument()
        }
      })
      .catch(() => {
        // Si el backend no responde al recargar, se sigue como "sin sesión";
        // la cookie queda para el próximo intento.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // ─── Handlers ───────────────────────────────────────────────────────

  async function login(credentials: LoginCredentials, options?: { remember?: boolean }): Promise<UsuarioSesion> {
    const usuario = await loginRequest(credentials)
    const role = initialRole(usuario)
    const remember = options?.remember === true
    writeSessionToDocument({ userId: usuario.id, activeRole: role, persistent: remember })
    setUser(usuario)
    setActiveRole(role)
    setPersistent(remember)
    return usuario
  }

  /** US-39: cerrar sesión desvincula la sesión del navegador y vuelve a la landing. */
  function logout(): void {
    void logoutRequest().catch(() => {
      // Aunque el back no responda, la sesión del navegador se cierra igual.
    })
    clearSessionFromDocument()
    setUser(null)
    setActiveRole(null)
    router.push('/')
  }

  /** Cambio de contexto (cuentas con dos roles). Ignora un rol que el usuario no tiene. */
  function switchRole(role: UserRole): void {
    if (!user || !user.roles.includes(role)) return
    writeSessionToDocument({ userId: user.id, activeRole: role, persistent })
    setActiveRole(role)
  }

  // ─── Render ─────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    user,
    roles: user?.roles ?? [],
    activeRole,
    isLoading,
    login,
    logout,
    switchRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Acceso al contexto de {@link AuthProvider}. Tira un error si se usa afuera del provider. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  }
  return context
}
