/**
 * catalogs/neighborhoods.ts — barrios de Córdoba Capital del piloto.
 *
 * Qué es: la lista fija de barrios válidos. Es un catálogo (opciones de un
 * filtro o de un select), no datos de prueba: el elenco (`lib/mocks/`) solo
 * usa estos barrios.
 * TODO(backend): el back no tiene barrios todavía. Cuando exista la columna
 * `inmueble.barrio` (en curso en `feature/registrar-usuario`), este catálogo
 * puede venir de un endpoint (propuesto: `GET /api/v1/catalogos`).
 *
 * Quién lo usa: el `SearchBar` de la landing, `/buscar` (US-34), el filtro
 * de `/panel/propiedades` (US-02) y el alta (US-01).
 */
import type { Neighborhood } from '@rentar/shared-types'

/** Barrios de Córdoba Capital cubiertos por el piloto. */
export const neighborhoods: Neighborhood[] = [
  { slug: 'nueva-cordoba', name: 'Nueva Córdoba', tier: 'alta demanda' },
  { slug: 'guemes', name: 'Güemes', tier: 'alternativo' },
  { slug: 'centro', name: 'Centro', tier: 'alternativo' },
  { slug: 'general-paz', name: 'General Paz', tier: 'alternativo' },
  { slug: 'cofico', name: 'Cofico', tier: 'alternativo' },
  { slug: 'alta-cordoba', name: 'Alta Córdoba', tier: 'alternativo' },
]
