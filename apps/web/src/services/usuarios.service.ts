/**
 * usuarios.service.ts — frontera con el backend para consultar cuentas.
 *
 * Qué es: resolver el usuario completo a partir de un id. Hoy lo usa solo
 * `AuthProvider`, al recargar la página: la cookie de sesión guarda el id y
 * de acá sale el resto del perfil.
 * Cubre: US-39 (mantener la sesión en el navegador).
 * Quién lo usa: `lib/auth/AuthProvider.tsx`.
 */
import type { Rol, Usuario, UsuarioSesion } from '@rentar/shared-types'
import { usuarios as usuariosElenco, type UsuarioMock } from '@/lib/mocks'
import { usuarioDtoToSesion } from './adapters/usuario.adapter'
import { apiRequest } from './shared/apiClient'
import { USE_MOCKS } from './shared/config'
import { delay } from './shared/delay'
import { ServiceError } from './shared/errors'
import { readMockCollection } from './shared/mockStore'

/** Respuesta propuesta para `GET /api/v1/usuarios/:id`: el usuario con sus roles. */
interface UsuarioConRolesResponse {
  usuario: Usuario
  roles: Rol[]
}

/**
 * Todas las cuentas mock: el elenco más las registradas en `/registro`
 * (guardadas en el navegador). Lo comparte `auth.service.ts`.
 */
export function readUsuariosMock(): UsuarioMock[] {
  return readMockCollection('usuarios', usuariosElenco)
}

/** Saca la contraseña de una cuenta mock: nunca sale de la rama mock. */
export function toUsuarioSesion(usuarioMock: UsuarioMock): UsuarioSesion {
  const { password, ...usuario } = usuarioMock
  void password // se descarta a propósito
  return usuario
}

/**
 * US-39 Iniciar y cerrar sesión — resolver el usuario de la sesión guardada.
 * @backend GET /api/v1/usuarios/:id   (no existe — propuesto)
 * @returns UsuarioSesion, o `null` si el usuario no existe.
 * TODO(backend): crear la ruta. Tiene que devolver el usuario con sus roles
 * (`{ usuario, roles }`), igual que el login propuesto.
 *
 * NOTA: devuelve `null` (no tira error) cuando el usuario no existe, porque
 * `AuthProvider` lo trata como "sin sesión", no como un error a mostrar.
 */
export async function getUsuarioSesion(usuarioId: string): Promise<UsuarioSesion | null> {
  if (USE_MOCKS) {
    await delay(200)
    const usuario = readUsuariosMock().find((item) => item.id === usuarioId)
    return usuario ? toUsuarioSesion(usuario) : null
  }

  try {
    const response = await apiRequest<UsuarioConRolesResponse>(`/usuarios/${encodeURIComponent(usuarioId)}`)
    return usuarioDtoToSesion(response.usuario, response.roles)
  } catch (error) {
    if (error instanceof ServiceError && error.code === 'not_found') return null
    throw error
  }
}
