/**
 * shared/backend-dtos.ts — copias de DTOs del back que `@rentar/shared-types`
 * todavía no exporta.
 *
 * Qué es: la forma exacta de algunas respuestas y cuerpos de `apps/api` que
 * viven solo en `apps/api/src/dtos/index.ts`. El frontend no puede importar
 * de `apps/api`, así que se copian acá, campo por campo.
 * TODO(backend): mover estos DTOs a `@rentar/shared-types` y reemplazar esta
 * copia por un import.
 *
 * Quién lo usa: la rama real de los services y los adaptadores.
 */

/**
 * Respuesta de `GET /api/v1/inmuebles/:id` (existe).
 * Copia de `InmuebleDetalleDTO` de `apps/api/src/dtos/index.ts`.
 */
export interface InmuebleDetalleResponse {
  id: number
  tipo_inmueble: string
  direccion: string
  numero: number
  piso?: string | null
  ciudad: string
  ambientes: number
  dormitorios: number
  banos: number
  m2: number
  descripcion?: string | null
  tag?: string | null
  servicio?: string | null
  id_locador: number
  created_at?: string
  publicacion?: {
    id: number
    titulo: string
    precio: number
    activa: boolean
    created_at?: string
  } | null
}
