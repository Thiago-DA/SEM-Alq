/**
 * shared/backend-dtos.ts — copias de DTOs del back que `@rentar/shared-types`
 * todavía no exporta.
 *
 * Qué es: la forma exacta de algunas respuestas y cuerpos de `apps/api` que
 * viven solo en `apps/api/src/` (controllers o `dtos/`). El frontend no puede
 * importar de `apps/api`, así que se copian acá, campo por campo. Lo que sí
 * exporta `@rentar/shared-types` (`Inmueble`, `MisAlquileresItem`,
 * `CreateInmuebleCompletoPayload`, `Usuario`) se importa de ahí, no se copia.
 * TODO(backend): mover estos DTOs a `@rentar/shared-types` y reemplazar esta
 * copia por un import.
 *
 * Quién lo usa: la rama real de los services y los adaptadores.
 */

/**
 * Respuesta de `GET /api/v1/usuarios/me` (existe): el usuario del token con
 * sus roles. Copia del `data` que arma `usuarioController.obtenerMiPerfil`
 * (`apps/api/src/controllers/usuario.controller.ts`).
 */
export interface UsuarioMeResponse {
  id: number
  nombre: string
  apellido?: string | null
  email: string
  /** Descripciones de la tabla `rol`: `'locatario'`, `'locador'` o `'administrador'`. */
  roles: string[]
}

/**
 * Respuesta de `GET /api/v1/inmuebles/:id` (existe). Copia de
 * `InmuebleDetalleDTO` de `apps/api/src/dtos/inmueble.dto.ts`.
 * NOTA: no trae precio, fotos ni contrato; `/buscar` lo usa solo para los
 * tags (ver `propiedades.service.ts`).
 */
export interface InmuebleDetalleResponse {
  id: number
  tipo_inmueble: string
  direccion: string
  numero: number
  piso?: string | null
  ciudad: string
  barrio?: string
  provincia?: string
  ambientes: number
  dormitorios: number
  banos: number
  m2_totales?: number
  m2_cubiertos?: number
  descripcion?: string | null
  /** El primer tag (se mantiene por compatibilidad); usar `tags`. */
  tag?: string | null
  /** Descripciones de `tags_inmueble` (ej. "Acepta mascotas"). */
  tags?: string[]
  servicio?: string | null
  id_locador: number
}

/**
 * Cuerpo de `POST /api/v1/registrar-usuario` (existe). Es
 * `CreateUsuarioPayload` de `@rentar/shared-types` más el rol. Las claves con
 * ñ (`contraseña`) son las que espera el back, tal cual.
 *
 * TODO(backend): hoy el back ignora `rol` y registra a todos como locatario.
 * Aceptarlo está en revisión en `feature/registro-con-rol`; cuando se mergee,
 * empieza a funcionar sin cambios en el front.
 */
export interface RegistrarUsuarioRequest {
  nombre: string
  apellido: string
  email: string
  contraseña: string
  confirmar_contraseña: string
  telefono: string
  numero_documento: string
  /** Formato ISO `YYYY-MM-DD`. */
  fecha_nacimiento: string
  acepta_terminos: boolean
  rol: 'locador' | 'locatario'
}
