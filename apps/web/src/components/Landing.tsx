'use client'

import { useMemo, useState } from 'react'
import { Button } from 'antd'
import type { FilterState } from '@rentar/shared-types'
import Hero from './Hero'
import HowItWorks from './HowItWorks'
import PropertyGrid from './PropertyGrid'
import { properties, type MockProperty } from '@/lib/data/properties.mock'
import { defaultFilters } from '@/lib/types/filters'
import styles from './Landing.module.css'

const PREVIEW_LIMIT = 8

/** Evalúa si una propiedad matchea el estado de filtros actual. */
function matchesFilters(property: MockProperty, filters: FilterState): boolean {
  if (filters.neighborhoodSlug !== 'todos' && property.neighborhoodSlug !== filters.neighborhoodSlug) {
    return false
  }
  if (property.priceMonthly > filters.maxPrice) {
    return false
  }
  if (filters.minPrice != null && property.priceMonthly < filters.minPrice) {
    return false
  }
  if (filters.type !== 'todos' && property.type !== filters.type) {
    return false
  }
  if (filters.bedrooms !== 'todos') {
    if (filters.bedrooms === 3) {
      if (property.bedrooms < 3) return false
    } else if (property.bedrooms !== filters.bedrooms) {
      return false
    }
  }
  if (filters.characteristics.length > 0) {
    const hasAll = filters.characteristics.every((c) => property.characteristics.includes(c))
    if (!hasAll) return false
  }
  return true
}

/**
 * Contenido de la landing: arma el estado de filtros (client-side, sin
 * backend) y orquesta Hero (con el buscador), el grid de propiedades
 * filtradas (recortado a `PREVIEW_LIMIT`) y HowItWorks.
 *
 * NOTA: ya no envuelve en `PublicLayout` — eso lo hace
 * `app/(public)/layout.tsx`, compartido con `/buscar`, `/propiedad/[id]` y
 * `/planes`. Mismo output visual que antes, solo se movió el wrap un nivel
 * arriba para no repetirlo en cada ruta pública nueva.
 */
export default function Landing() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const filteredProperties = useMemo(
    () => properties.filter((property) => matchesFilters(property, filters)),
    [filters],
  )

  return (
    <>
      <Hero filters={filters} onChange={setFilters} resultCount={filteredProperties.length} />

      <section className={styles.section}>
        <h2 className={styles.heading}>Propiedades disponibles cerca tuyo en Córdoba</h2>
        <PropertyGrid properties={filteredProperties.slice(0, PREVIEW_LIMIT)} />
        <div className={styles.moreWrap}>
          <Button type="primary" size="large" data-testid="landing-more-properties-button">
            Buscar más propiedades
          </Button>
        </div>
      </section>

      <HowItWorks />
    </>
  )
}
