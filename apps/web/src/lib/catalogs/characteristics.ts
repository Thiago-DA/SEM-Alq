/**
 * catalogs/characteristics.ts — características opcionales de una propiedad.
 *
 * Qué es: las opciones de "tags" de US-01 (y del filtro de US-34), con su
 * texto visible. Es un catálogo, no datos de prueba.
 * TODO(backend): hoy el back tiene la tabla `tag_inmueble`; la equivalencia
 * id ↔ clave vive en `services/adapters/propiedad.adapter.ts`.
 *
 * Quién lo usa: el `SearchBar` de la landing, `/buscar` y el alta.
 */
import type { CharacteristicOption } from '@rentar/shared-types'

export const characteristicOptions: CharacteristicOption[] = [
  { key: 'amoblado', label: 'Amoblado' },
  { key: 'mascotas', label: 'Acepta mascotas' },
  { key: 'cochera', label: 'Cochera' },
  { key: 'balcon', label: 'Balcón' },
  { key: 'apto-profesional', label: 'Apto profesional' },
]
