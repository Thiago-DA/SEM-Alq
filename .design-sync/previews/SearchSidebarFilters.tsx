import { useState } from 'react'
import { SearchSidebarFilters } from '@rentar/ui'

// Ubicaciones y características reales del piloto (Córdoba Capital y sus barrios).
const locations = {
  provinces: [
    {
      name: 'Córdoba',
      cities: [
        {
          name: 'Córdoba Capital',
          neighborhoods: [
            { slug: 'nueva-cordoba', name: 'Nueva Córdoba' },
            { slug: 'guemes', name: 'Güemes' },
            { slug: 'centro', name: 'Centro' },
            { slug: 'general-paz', name: 'General Paz' },
            { slug: 'cofico', name: 'Cofico' },
            { slug: 'alta-cordoba', name: 'Alta Córdoba' },
          ],
        },
      ],
    },
  ],
}

const characteristics = [
  { key: 'amoblado' as const, label: 'Amoblado' },
  { key: 'mascotas' as const, label: 'Acepta mascotas' },
  { key: 'cochera' as const, label: 'Cochera' },
  { key: 'balcon' as const, label: 'Balcón' },
  { key: 'apto-profesional' as const, label: 'Apto profesional' },
]

const iniciales = {
  province: 'Córdoba',
  city: 'Córdoba Capital',
  neighborhoodSlugs: [] as string[],
  minPrice: null as number | null,
  maxPrice: null as number | null,
  types: [] as ('departamento' | 'casa' | 'ph' | 'monoambiente')[],
  bedrooms: [] as number[],
  rooms: [] as number[],
  minAreaM2: null as number | null,
  maxAreaM2: null as number | null,
  characteristics: [] as ('amoblado' | 'mascotas' | 'cochera' | 'balcon' | 'apto-profesional')[],
  adjustmentIndex: null as 'IPC' | 'ICL' | null,
}

/** Barra lateral de /buscar (escritorio) con dos barrios, un tope de precio y 2 dormitorios elegidos. */
export function Sidebar() {
  const [value, setValue] = useState({ ...iniciales, neighborhoodSlugs: ['nueva-cordoba', 'guemes'], maxPrice: 600000, bedrooms: [2] })
  return (
    <div style={{ width: 300 }}>
      <SearchSidebarFilters
        value={value}
        onChange={setValue}
        onClear={() => setValue(iniciales)}
        onApply={() => {}}
        locations={locations}
        characteristics={characteristics}
      />
    </div>
  )
}

/** Contenido del Drawer de filtros en móvil: tipología en pastillas y precio con slider. */
export function Drawer() {
  const [value, setValue] = useState({ ...iniciales, types: ['departamento' as const], characteristics: ['mascotas' as const] })
  return (
    <div style={{ width: 360 }}>
      <SearchSidebarFilters
        variant="drawer"
        value={value}
        onChange={setValue}
        onClear={() => setValue(iniciales)}
        onClose={() => {}}
        locations={locations}
        characteristics={characteristics}
      />
    </div>
  )
}
