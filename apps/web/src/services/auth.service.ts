/**
 * auth.service.ts — frontera con el backend para la cuenta: registro, login y logout.
 *
 * Qué es: crear la cuenta, validar credenciales y cerrar sesión. La sesión en
 * sí (cookie, rol activo) la maneja `lib/auth/AuthProvider.tsx`.
 * Cubre: US-19 Registrar usuario y US-39 Iniciar y cerrar sesión.
 * Quién lo usa: `lib/auth/AuthProvider.tsx` (login y logout) y
 * `components/auth/RegistroForm.tsx` (registro).
 */
import type { Rol, Usuario, UsuarioSesion } from '@rentar/shared-types'
import { registroInputToRequest, registroResponseToSesion } from './adapters/registro.adapter'
import { usuarioDtoToSesion } from './adapters/usuario.adapter'
import { apiRequest } from './shared/apiClient'
import { USE_MOCKS } from './shared/config'
import { delay } from './shared/delay'
import type { RegistrarUsuarioResponse } from './shared/backend-dtos'
import { ServiceError } from './shared/errors'
import { saveMockRecord } from './shared/mockStore'
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
export const INVALID_CREDENTIALS_MESSAGE = 'El email o la contraseña no coinciden.'

/**
 * US-39 Iniciar y cerrar sesión — iniciar sesión.
 * @backend POST /api/v1/auth/login   (no existe — propuesto)
 * @body    { email: string, contraseña: string }
 * @returns UsuarioSesion (el back responde `{ usuario, roles }`; lo traduce `usuarioDtoToSesion`)
 * TODO(backend): crear la ruta (hoy responde 404, y el login muestra el error
 * del servidor). Ante credenciales inválidas, responder 401 con un mensaje genérico (sin distinguir "no existe el mail" de
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
    // 401 (credenciales inválidas) y 400 (email o contraseña mal formados)
    // se muestran con el mismo mensaje genérico. Un 404 NO: es que la ruta no
    // existe, y sigue como error del servidor (ver apiClient).
    if (error instanceof ServiceError && (error.code === 'unauthorized' || error.code === 'validation')) {
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

/** Datos del registro (US-19): el rol del paso 1 y los datos del paso 2. */
export interface RegistroInput {
  rol: 'locador' | 'locatario'
  nombre: string
  apellido: string
  email: string
  password: string
  /** Solo dígitos, con característica y sin 0 ni 15 (ej. "3515123456"). */
  telefono: string
  /** Solo dígitos, 7 u 8. */
  dni: string
  /** Formato ISO `YYYY-MM-DD`. */
  fechaNacimiento: string
  aceptaTerminos: boolean
}

/** Mensaje de mail duplicado (diseño, "Validaciones del paso 2"). */
export const EMAIL_TAKEN_MESSAGE = 'Ya existe una cuenta con ese email.'

/**
 * US-19 Registrar usuario — crear la cuenta.
 * @backend POST /api/v1/registrar-usuario   (en curso en feature/registrar-usuario · todavía no está en develop)
 * @body    RegistrarUsuarioRequest (lo arma `registroInputToRequest`)
 * @returns UsuarioSesion (la respuesta la traduce `registroResponseToSesion`)
 * TODO(backend): feature/registrar-usuario hoy registra a todos como
 * locatario; hay que aceptar el rol en el body (`rol`).
 * @throws {ServiceError} `conflict` con {@link EMAIL_TAKEN_MESSAGE} si el mail ya existe.
 *
 * NOTA: no inicia sesión. Después de registrarse, el usuario entra por
 * `/login` (flujo registro → login → panel).
 */
export async function registrarUsuario(input: RegistroInput): Promise<UsuarioSesion> {
  if (USE_MOCKS) {
    await delay()
    const email = input.email.trim().toLowerCase()
    if (readUsuariosMock().some((usuario) => usuario.email.toLowerCase() === email)) {
      throw new ServiceError('conflict', EMAIL_TAKEN_MESSAGE)
    }
    const nuevo = {
      id: `usr-${Date.now()}`,
      nombre: input.nombre.trim(),
      apellido: input.apellido.trim(),
      email,
      // NOTA: solo en modo mock, y solo en este navegador: el back real guarda
      // un hash, nunca la contraseña.
      password: input.password,
      roles: [input.rol],
      status: 'activo' as const,
      telefono: input.telefono,
      dni: input.dni,
      fechaNacimiento: input.fechaNacimiento,
    }
    if (!saveMockRecord('usuarios', nuevo)) {
      throw new ServiceError('server', 'No pudimos guardar tu cuenta en este navegador. Probá de nuevo.')
    }
    return toUsuarioSesion(nuevo)
  }

  try {
    const response = await apiRequest<RegistrarUsuarioResponse>('/registrar-usuario', {
      method: 'POST',
      body: registroInputToRequest(input),
    })
    return registroResponseToSesion(response, input.rol)
  } catch (error) {
    // El back responde 409 con "Email o documento ya registrado".
    if (error instanceof ServiceError && error.code === 'conflict') {
      throw new ServiceError('conflict', error.message || EMAIL_TAKEN_MESSAGE)
    }
    throw error
  }
}
