/**
 * registro.adapter.ts — traduce el formulario de registro al cuerpo que
 * espera el back, y la respuesta del back al tipo de vista.
 *
 * Qué es: la frontera entre `RegistroInput` (lo que junta la pantalla
 * `/registro`) y el contrato de `POST /api/v1/registrar-usuario`
 * (`RegistrarUsuarioRequest` de ida; `Usuario` de `@rentar/shared-types` de
 * vuelta).
 * Cubre: US-19 Registrar usuario.
 * Quién lo usa: `services/auth.service.ts#registrarUsuario`.
 */
import type { Usuario, UsuarioSesion } from '@rentar/shared-types'
import type { RegistrarUsuarioRequest } from '../shared/backend-dtos'
import type { RegistroInput } from '../auth.service'

/**
 * `RegistroInput` → cuerpo del request. El back pide la contraseña dos veces
 * (`confirmar_contraseña`) y valida que coincidan; el front ya lo validó,
 * así que se manda la misma.
 */
export function registroInputToRequest(input: RegistroInput): RegistrarUsuarioRequest {
  return {
    nombre: input.nombre.trim(),
    apellido: input.apellido.trim(),
    email: input.email.trim().toLowerCase(),
    contraseña: input.password,
    confirmar_contraseña: input.password,
    telefono: input.telefono,
    numero_documento: input.dni,
    fecha_nacimiento: input.fechaNacimiento,
    acepta_terminos: input.aceptaTerminos,
    rol: input.rol,
  }
}

/**
 * Respuesta del back → `UsuarioSesion`.
 * - `roles`: el back no los devuelve; se usa el rol elegido en el registro.
 *   TODO(backend): devolver los roles del usuario creado.
 * - `status`: el back no tiene estado de cuenta; se asume `'activo'`.
 */
export function registroResponseToSesion(response: Usuario, rol: RegistroInput['rol']): UsuarioSesion {
  return {
    id: String(response.id),
    nombre: response.nombre,
    apellido: response.apellido ?? '',
    email: response.email,
    roles: [rol],
    status: 'activo',
    telefono: response.telefono ?? undefined,
    dni: response.numero_documento,
    fechaNacimiento: response.fecha_nacimiento ?? undefined,
  }
}
