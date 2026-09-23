/**
 * usuario.adapter.ts — traduce usuarios y roles del back al tipo de vista
 * del front, y el id de sesión al header `x-user-id`.
 *
 * Qué es: la frontera entre `Usuario`/`Rol` (modelos del back, tablas
 * `usuario` y `rol`) y `UsuarioSesion`/`UserRole` (tipos de vista). Las
 * pantallas nunca ven un `Usuario` del back.
 * Cubre: US-19 (registro), US-39 (sesión).
 * Quién lo usa: `services/auth.service.ts`, `services/usuarios.service.ts` y
 * `services/shared/apiClient.ts` (solo `toBackendUserId`).
 */
import type { Rol, Usuario, UserRole, UsuarioSesion } from '@rentar/shared-types'

// ─── Roles ──────────────────────────────────────────────────────────────

/**
 * Traduce un `Rol` del back (tabla `rol`) al `UserRole` del front.
 *
 * NOTA: el back llama `'administrador'` a lo que el front llama `'admin'`.
 * Esta es la única línea del frontend que conoce esa diferencia.
 * `'garante'` no existe como rol del back: el garante firma sin cuenta.
 * Devuelve `null` para un rol desconocido (se descarta, no rompe la sesión).
 */
export function rolDtoToUserRole(rol: Rol): UserRole | null {
  switch (rol.nombre) {
    case 'locador':
      return 'locador'
    case 'locatario':
      return 'locatario'
    case 'administrador':
      return 'admin'
    default:
      return null
  }
}

// ─── Usuario ────────────────────────────────────────────────────────────

/**
 * Arma el `UsuarioSesion` a partir del `Usuario` del back y sus roles
 * (`usuario_x_rol` → `rol`).
 *
 * Campo por campo:
 * - `id`: el back usa un número; el front lo guarda como texto.
 * - `nombre` / `apellido`: TODO(backend): la tabla `usuario` de develop
 *   tiene un solo campo `nombre` (en `feature/registrar-usuario` ya se suma
 *   `apellido`). Mientras tanto se toma la primera palabra como nombre y el
 *   resto como apellido.
 * - `status`: TODO(backend): el back no tiene estado de cuenta; se asume
 *   `'activo'`.
 * - `dni` y `fechaNacimiento`: TODO(backend): no existen en develop (en curso
 *   en `feature/registrar-usuario`: `numero_documento`, `fecha_nacimiento`).
 */
export function usuarioDtoToSesion(usuario: Usuario, roles: Rol[]): UsuarioSesion {
  const [nombre, ...resto] = usuario.nombre.trim().split(/\s+/)
  return {
    id: String(usuario.id),
    nombre: nombre ?? '',
    apellido: resto.join(' '),
    email: usuario.email,
    roles: roles.map(rolDtoToUserRole).filter((role): role is UserRole => role !== null),
    status: 'activo',
    telefono: usuario.telefono ?? undefined,
  }
}

// ─── Id de sesión → header x-user-id ────────────────────────────────────

/**
 * Equivalencia entre las personas del elenco del front (ids de texto, ver
 * `lib/mocks/usuarios.mock.ts`) y los usuarios de prueba que ya tiene el
 * back en memoria (`apps/api/src/repositories/lookup.repository.ts`).
 *
 * NOTA: solo sirve para probar la rama real (`NEXT_PUBLIC_USE_MOCKS=false`)
 * con una sesión iniciada en modo mock. Son personas distintas en cada lado
 * — se eligió la de rol equivalente:
 * - Nicolás Arrieta (locador) → 1, "Carlos Propietario" (locador).
 * - Julieta Peralta (locataria) → 2, "Ana Inquilina" (locataria).
 * - Sofía Ledesma (locadora y locataria) → 3, "Segundo Propietario" (solo
 *   locador: el back no tiene una cuenta con dos roles).
 * TODO(backend): cuando exista `POST /api/v1/auth/login`, la sesión ya trae
 * el id numérico real y esta tabla se puede borrar.
 */
const ELENCO_TO_BACKEND_USER_ID: Record<string, number> = {
  'usr-nicolas': 1,
  'usr-julieta': 2,
  'usr-sofia': 3,
}

/**
 * Devuelve el valor del header `x-user-id` para el id de la sesión, o
 * `null` si no hay equivalente en el back.
 *
 * - Si el id ya es numérico (sesión iniciada contra el back real), va tal cual.
 * - Si es un id del elenco, se traduce con la tabla de arriba.
 * - Un usuario registrado en modo mock (`usr-<timestamp>`) no existe en el
 *   back: `null`, y `apiClient` no manda el header.
 */
export function toBackendUserId(sessionUserId: string): string | null {
  if (/^\d+$/.test(sessionUserId)) return sessionUserId
  const backendId = ELENCO_TO_BACKEND_USER_ID[sessionUserId]
  return backendId === undefined ? null : String(backendId)
}
