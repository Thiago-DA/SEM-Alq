import type { FilterState } from '@rentar/shared-types'

/** Techo superior del filtro de precio (slider y campo "hasta"). */
export const MAX_PRICE_CEILING = 650000

/** Filtros con los que arranca la landing al cargar. */
export const defaultFilters: FilterState = {
  neighborhoodSlug: 'nueva-cordoba',
  minPrice: 400000,
  maxPrice: MAX_PRICE_CEILING,
  type: 'todos',
  bedrooms: 'todos',
  characteristics: [],
}
