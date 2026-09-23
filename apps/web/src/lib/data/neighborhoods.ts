import type { Neighborhood } from '@rentar/shared-types'

/** Barrios de Córdoba Capital cubiertos por el piloto; alimentan el filtro de zona. */
export const neighborhoods: Neighborhood[] = [
  { slug: 'nueva-cordoba', name: 'Nueva Córdoba', tier: 'alta demanda' },
  { slug: 'guemes', name: 'Güemes', tier: 'alternativo' },
  { slug: 'centro', name: 'Centro', tier: 'alternativo' },
  { slug: 'general-paz', name: 'General Paz', tier: 'alternativo' },
  { slug: 'cofico', name: 'Cofico', tier: 'alternativo' },
  { slug: 'alta-cordoba', name: 'Alta Córdoba', tier: 'alternativo' },
]
