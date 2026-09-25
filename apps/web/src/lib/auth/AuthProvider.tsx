'use client'

/**
 * AuthProvider.tsx — sesión y rol activo, en un solo contexto.
 *
 * Qué es: quién está logueado, sus roles y cuál está activo ahora mismo.
 * El rol activo vive en el mismo provider que la sesión: es lo que usa el
 * cambio de contexto del UserMenu para cuentas con dos roles (hoy, solo
 * Sofía Ledesma: locadora de Mariano Moreno 285 y locataria de Obispo Trejo
 * 1250).
 * Cubre: US-39 Iniciar y cerrar sesión ("vincular la sesión al navegador";
 * "desvincularla" al cerrar sesión).
 *
 * Dos ramas, según `NEXT_PUBLIC_USE_MOCKS`:
 * - Modo mock: la sesión ES la cookie `rentar_session` (`session-cookie.ts`).
 * - Modo real: la sesión es la de Supabase Auth (cookies `sb-…`, que maneja
 *   `@supabase/ssr`). La cookie `rentar_session` se sigue escribiendo, pero
 *   solo para recordar el rol activo y para que el layout del panel sepa que
 *   había una sesión (ver `app/(app)/panel/layout.tsx`); no autentica nada.
 *
 * De dónde saca los datos: `services/auth.service.ts` (login/logout) y
 * `services/usuarios.service.ts#getUsuarioActual` (el perfil al recargar).
 *
 * Quién lo usa: `useAuth()` desde cualquier Client Component (layout del
 * panel, pantallas de login y registro). Se monta una sola vez, en
 * `lib/AppProviders.tsx`.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { UserRole, UsuarioSesion } from '@rentar/shared-types'
import { login as loginRequest, logout as logoutRequest, type LoginCredentials } from '@/services/auth.service'
import { USE_MOCKS } from '@/services/shared/config'
import { getUsuarioActual } from '@/services/usuarios.service'
import { clearSessionFromDocument, readSessionFromDocument, writeSessionToDocument } from './session-cookie'
import { getSupabaseBrowserClient } from './supabase/client'

interface AuthContextValue {
  user: UsuarioSesion | null
  roles: UserRole[]
  activeRole: UserRole | null
  /** `true` mientras se resuelve la sesión al montar. */
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

/**
 * Rol activo al recargar: el guardado en la cookie si sigue siendo de este
 * usuario y todavía tiene ese rol; si no, el inicial.
 */
function restoredRole(user: UsuarioSesion): UserRole {
  const saved = readSessionFromDocument()
  return saved && saved.userId === user.id && user.roles.includes(saved.activeRole) ? saved.activeRole : initialRole(user)
}

/**
 * Resuelve el usuario en sesión al montar, en modo real.
 * Sin sesión de Supabase, ni siquiera se llama a la API.
 * @throws {ServiceError} si hay sesión pero `/usuarios/me` falla.
 */
async function resolveRealUser(): Promise<UsuarioSesion | null> {
  const { data } = await getSupabaseBrowserClient().auth.getSession()
  if (!data.session) return null
  return getUsuarioActual()
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

  // ─── Carga de datos: hidratar la sesión al montar ────────────────────
  // Todos los setState corren dentro de .then()/.finally() para que ninguno
  // se ejecute de forma síncrona en el cuerpo del efecto.
  useEffect(() => {
    let cancelled = false
    const saved = readSessionFromDocument()
    // En modo mock, sin cookie no hay nada que resolver (igual que antes de
    // conectar el back: sin espera simulada).
    const resolveUser = USE_MOCKS ? (saved ? getUsuarioActual() : Promise.resolve(null)) : resolveRealUser()

    resolveUser
      .then((usuario) => {
        if (cancelled) return
        if (usuario && USE_MOCKS && saved && usuario.roles.includes(saved.activeRole)) {
          setUser(usuario)
          setActiveRole(saved.activeRole)
          setPersistent(saved.persistent === true)
        } else if (usuario && !USE_MOCKS) {
          const role = restoredRole(usuario)
          writeSessionToDocument({ userId: usuario.id, activeRole: role, persistent: saved?.persistent === true })
          setUser(usuario)
          setActiveRole(role)
          setPersistent(saved?.persistent === true)
        } else if (saved) {
          // Cookie corrupta, sesión vencida, o usuario que ya no existe o
          // perdió ese rol: se descarta en vez de dejar la app en un estado
          // inconsistente.
          clearSessionFromDocument()
        }
      })
      .catch(() => {
        // Si el backend no responde al recargar, se sigue como "sin sesión"
        // y la cookie queda: el layout del panel manda a /login, y ahí el
        // login vuelve a pedir el perfil y muestra el error del servidor.
        // NOTA: nunca se inventan roles cuando `/usuarios/me` falla.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // ─── Modo real: la sesión de Supabase se cerró por fuera ────────────
  // Por ejemplo, el refresh token venció o se cerró sesión en otra pestaña.
  // NOTA: dentro del callback de onAuthStateChange no se llama a Supabase
  // (lo desaconseja supabase-js: puede trabar el cliente); solo se limpia el
  // estado local.
  useEffect(() => {
    if (USE_MOCKS) return
    const { data } = getSupabaseBrowserClient().auth.onAuthStateChange((event) => {
      if (event !== 'SIGNED_OUT') return
      setUser(null)
      setActiveRole(null)
      setPersistent(false)
    })
    return () => data.subscription.unsubscribe()
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

  /** Borra la sesión del navegador y vuelve a la landing. */
  function endSession(): void {
    clearSessionFromDocument()
    setUser(null)
    setActiveRole(null)
    router.push('/')
  }

  /** US-39: cerrar sesión desvincula la sesión del navegador y vuelve a la landing. */
  function logout(): void {
    if (USE_MOCKS) {
      void logoutRequest().catch(() => {
        // Aunque el back no responda, la sesión del navegador se cierra igual.
      })
      endSession()
      return
    }
    // NOTA: en modo real se espera a Supabase antes de salir, para que el
    // proxy no vea todavía las cookies de sesión si la persona vuelve al
    // panel enseguida. `logout` no tira errores de red (ver auth.service).
    // La cookie del rol se borra ANTES: `signOut` dispara SIGNED_OUT, y con
    // la cookie todavía puesta el layout del panel mandaría a /login en vez
    // de dejar que se vaya a la landing.
    clearSessionFromDocument()
    void logoutRequest()
      .catch(() => {
        // Igual se cierra la sesión de este navegador.
      })
      .finally(endSession)
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
