/**
 * auth.service.ts — frontera con el backend para iniciar y cerrar sesión.
 *
 * Qué es: login y logout. La sesión en sí (cookie, rol activo) la maneja
 * `lib/auth/AuthProvider.tsx`; este service solo valida credenciales.
 * Cubre: US-39 Iniciar y cerrar sesión. (El registro, US-19, se suma en la
 * tanda "Autenticación".)
 * Quién lo usa: `lib/auth/AuthProvider.tsx`.
 */
import type { Rol, Usuario, UsuarioSesion } from '@rentar/shared-types'
import { usuarioDtoToSesion } from './adapters/usuario.adapter'
import { apiRequest } from './shared/apiClient'
import { USE_MOCKS } from './shared/config'
import { delay } from './shared/delay'
import { ServiceError } from './shared/errors'
import { readUsuariosMock, toUsuarioSesion } from './usuarios.service'

export interface LoginCredentials {
  email: string
  password: string
}

/** Respuesta propuesta para `POST /api/v1/auth/login`. */
interface LoginResponse {
  usuario: Usuario
  roles: Rol[]
}

/**
 * Mensaje único para cualquier falla de credenciales.
 *
 * NOTA: es genérico a propósito (US-39): no dice si el mail existe o si lo
 * que falló fue la contraseña, para no revelar qué mails están registrados.
 */
export const INVALID_CREDENTIALS_MESSAGE = 'El email o la contraseña no son correctos.'

/**
 * US-39 Iniciar y cerrar sesión — iniciar sesión.
 * @backend POST /api/v1/auth/login   (no existe — propuesto)
 * @body    { email: string, contraseña: string }
 * @returns UsuarioSesion (el back responde `{ usuario, roles }`; lo traduce `usuarioDtoToSesion`)
 * TODO(backend): crear la ruta. Ante credenciales inválidas, responder 401
 * con un mensaje genérico (sin distinguir "no existe el mail" de
 * "contraseña incorrecta").
 * @throws {ServiceError} `unauthorized` con {@link INVALID_CREDENTIALS_MESSAGE}.
 */
export async function login(credentials: LoginCredentials): Promise<UsuarioSesion> {
  if (USE_MOCKS) {
    await delay()
    const email = credentials.email.trim().toLowerCase()
    const usuario = readUsuariosMock().find((item) => item.email.toLowerCase() === email)
    if (!usuario || usuario.password !== credentials.password) {
      throw new ServiceError('unauthorized', INVALID_CREDENTIALS_MESSAGE)
    }
    return toUsuarioSesion(usuario)
  }

  try {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email: credentials.email.trim(), contraseña: credentials.password },
    })
    return usuarioDtoToSesion(response.usuario, response.roles)
  } catch (error) {
    // Cualquier 401/404 del back se muestra con el mismo mensaje genérico.
    if (error instanceof ServiceError && (error.code === 'unauthorized' || error.code === 'not_found')) {
      throw new ServiceError('unauthorized', INVALID_CREDENTIALS_MESSAGE)
    }
    throw error
  }
}

/**
 * US-39 Iniciar y cerrar sesión — cerrar sesión.
 * @backend POST /api/v1/auth/logout   (no existe — propuesto)
 * @returns nada
 * TODO(backend): crear la ruta para invalidar la sesión del lado del
 * servidor. Hoy no hay nada que invalidar (la "sesión" es el header
 * `x-user-id`): quien borra la cookie es `AuthProvider`.
 */
export async function logout(): Promise<void> {
  if (USE_MOCKS) {
    await delay(150)
    return
  }
  await apiRequest<void>('/auth/logout', { method: 'POST' })
}
