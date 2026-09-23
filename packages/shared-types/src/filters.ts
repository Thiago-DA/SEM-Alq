/**
 * filters.ts — filtros, orden y paginación de los listados del frontend.
 *
 * Qué es: TIPOS DE VISTA DEL FRONT. Hoy el back no recibe filtros: los
 * services los mandan como query params (ver `docs/api-endpoints.md`) y,
 * mientras el back los ignore, filtran del lado del cliente.
 *
 * Quién lo usa: la landing (`FilterState`), `/buscar` (US-34) y
 * `/panel/propiedades` (US-02).
 */
import type { AdjustmentIndex, CharacteristicKey, PropertyType } from './propiedad'
import type { PropertyStatus } from './status'

/** Cantidad de dormitorios filtrable; `3` se interpreta como "3 o más". */
export type BedroomsFilter = number | 'todos'

/** Estado de los filtros de búsqueda de la landing (barrio, precio, tipología, dormitorios, características). */
export interface FilterState {
  neighborhoodSlug: string
  minPrice: number
  maxPrice: number
  type: PropertyType | 'todos'
  bedrooms: BedroomsFilter
  characteristics: CharacteristicKey[]
}

/**
 * Filtros de `/buscar` (US-34): los de la landing más ambientes, superficie
 * mínima e índice de ajuste.
 */
export interface BusquedaFiltros extends FilterState {
  /** Cantidad de ambientes; `4` se interpreta como "4 o más". */
  rooms: number | 'todos'
  /** Superficie total mínima en m²; `undefined` = sin mínimo. */
  minAreaM2?: number
  adjustmentIndex: AdjustmentIndex | 'todos'
}

/**
 * Orden de `/buscar` (US-34: precio, cantidad de habitaciones, m²; más
 * recientes lo pide el diseño). `predeterminado` = sin orden aplicado
 * ("quitar el orden" vuelve a este valor).
 */
export type OrdenBusqueda =
  | 'predeterminado'
  | 'precio_asc'
  | 'precio_desc'
  | 'dormitorios_desc'
  | 'm2_desc'
  | 'recientes'

/** Una página de resultados (US-34: paginar cuando hay más de 10). */
export interface Paginado<T> {
  items: T[]
  /** Página actual, empezando en 1. */
  page: number
  pageSize: number
  /** Total de resultados en todas las páginas. */
  total: number
}

/**
 * Filtros de `/panel/propiedades` (US-02): barrio (solo los de las
 * propiedades del locador), tipo, estado de publicación y reclamos.
 */
export interface MisPropiedadesFiltros {
  neighborhoodSlug: string | 'todos'
  type: PropertyType | 'todos'
  status: PropertyStatus | 'todos'
  /** `true` = solo las que tienen reclamos sin resolver. */
  onlyWithOpenClaims: boolean
}
