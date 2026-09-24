import { useState } from 'react'
import { SearchFilters } from '@rentar/ui'

// Barrios y características reales del piloto (Córdoba Capital).
const neighborhoods = [
  { slug: 'nueva-cordoba', name: 'Nueva Córdoba', tier: 'alta demanda' as const },
  { slug: 'guemes', name: 'Güemes', tier: 'alternativo' as const },
  { slug: 'centro', name: 'Centro', tier: 'alternativo' as const },
  { slug: 'general-paz', name: 'General Paz', tier: 'alternativo' as const },
  { slug: 'cofico', name: 'Cofico', tier: 'alternativo' as const },
  { slug: 'alta-cordoba', name: 'Alta Córdoba', tier: 'alternativo' as const },
]

const characteristics = [
  { key: 'amoblado' as const, label: 'Amoblado' },
  { key: 'mascotas' as const, label: 'Acepta mascotas' },
  { key: 'cochera' as const, label: 'Cochera' },
  { key: 'balcon' as const, label: 'Balcón' },
  { key: 'apto-profesional' as const, label: 'Apto profesional' },
]

/** Buscador de la landing: Nueva Córdoba, departamentos de 1 dormitorio entre $ 400.000 y $ 650.000. */
export function Default() {
  const [value, setValue] = useState({
    neighborhoodSlug: 'nueva-cordoba',
    minPrice: 400000,
    maxPrice: 650000,
    type: 'departamento' as 'departamento' | 'casa' | 'ph' | 'monoambiente' | 'todos',
    bedrooms: 1 as number | 'todos',
    characteristics: ['balcon'] as ('amoblado' | 'mascotas' | 'cochera' | 'balcon' | 'apto-profesional')[],
  })
  return (
    <div style={{ maxWidth: 1100 }}>
      <SearchFilters neighborhoods={neighborhoods} characteristics={characteristics} value={value} onChange={setValue} resultCount={8} />
    </div>
  )
}
