/**
 * propiedad.ts — propiedades tal como las muestra el frontend.
 *
 * Qué es: TIPOS DE VISTA DEL FRONT. El back guarda una propiedad repartida
 * en varias tablas (`inmueble`, `publicacion`, `contrato`, catálogos de
 * tipo/tag/servicio — ver los modelos del back en `index.ts`). Las pantallas
 * no conocen esas tablas: reciben estos tipos ya armados por los adaptadores
 * de `apps/web/src/services/adapters/propiedad.adapter.ts`.
 *
 * Quién lo usa: `@rentar/ui` (`PropertyCard`, `SearchFilters`) y las
 * pantallas de la landing, `/buscar` (US-34), `/panel/propiedades` (US-02)
 * y `/panel/propiedades/nueva` (US-01).
 */
import type { PropertyStatus } from './status'

/**
 * Tipología de la propiedad (US-01: casa, departamento, monoambiente; el
 * back además tiene PH).
 * Adaptador: `propiedad.adapter.ts#propertyTypeFromTipoId` ↔ `tipo_inmueble.id`.
 */
export type PropertyType = 'departamento' | 'casa' | 'ph' | 'monoambiente'

/**
 * Índice legal de ajuste periódico del alquiler en Argentina: IPC (INDEC) o
 * ICL (BCRA) — los dos únicos índices habilitados para contratos de alquiler.
 * TODO(db): el back todavía no guarda el índice (en curso en
 * `feature/registrar-usuario`, `contrato.indice_aumento`).
 */
export type AdjustmentIndex = 'IPC' | 'ICL'

/** Cada cuánto se ajusta el monto del alquiler por índice (US-01, opcional). */
export type AdjustmentFrequency = 'trimestral' | 'cuatrimestral' | 'semestral' | 'anual'

/**
 * Clave de una característica opcional de la propiedad (los "tags" de US-01).
 * Adaptador: `propiedad.adapter.ts#characteristicFromTagId` ↔ `tag_inmueble.id`.
 */
export type CharacteristicKey = 'amoblado' | 'mascotas' | 'cochera' | 'balcon' | 'apto-profesional'

/** Opción de característica tal como se muestra en filtros y tarjetas. */
export interface CharacteristicOption {
  key: CharacteristicKey
  label: string
}

/**
 * Medio de pago que el locador prefiere recibir (US-01, al menos uno).
 * TODO(db): el back todavía no tiene medios de pago (en curso en
 * `feature/registrar-usuario`, tabla `medio_pago`).
 */
export type MedioPagoPreferido = 'transferencia' | 'efectivo' | 'mercadopago'

/** Estado del pago del alquiler de una propiedad alquilada (US-02). */
export type EstadoPago = 'al_dia' | 'pago_pendiente' | 'retrasada'

/**
 * Una propiedad buscable, tal como se ve en una tarjeta de la landing y de
 * `/buscar` (US-34).
 *
 * Adaptador: `propiedad.adapter.ts#inmuebleToPropiedadResumen`
 * (`Inmueble` + `Publicacion` → `PropiedadResumen`). Los campos que el back
 * todavía no devuelve están marcados en ese adaptador.
 */
export interface PropiedadResumen {
  id: string
  /** Título de la publicación, ej. "Monoambiente luminoso a metros de Plaza España". */
  title: string
  /**
   * Dirección APROXIMADA, ej. "Rondeau al 400" (US-34: dirección visible).
   * NOTA: decisión de privacidad del diseño: en la zona pública nunca se
   * muestra la altura exacta ni el piso; se redondea al centenar. La
   * dirección exacta la ve solo el locador y, más adelante, quien firma el
   * contrato.
   */
  address: string
  province: string
  city: string
  neighborhoodSlug: string
  neighborhoodName: string
  type: PropertyType
  /** Monto mensual del alquiler, en pesos (US-34: precio visible). */
  priceMonthly: number
  /**
   * Expensas mensuales, en pesos (US-34: expensas visibles). `0` = sin
   * expensas; `null` = no informadas (el back todavía no las devuelve): en
   * ese caso no se muestra nada, en vez de decir "Sin expensas".
   */
  expenses: number | null
  bedrooms: number
  rooms: number
  /** Superficie total en m² (US-34: m² visibles). */
  areaM2: number
  /** `null` si el locador no cargó índice (es opcional en US-01). */
  adjustmentIndex: AdjustmentIndex | null
  characteristics: CharacteristicKey[]
  /** Descripción libre (US-34: descripción visible). */
  description: string
  /**
   * Fecha ISO desde la que se puede alquilar (US-34: fecha de
   * disponibilidad visible). `null` = disponible ya.
   */
  availableFrom: string | null
  /** URL de la foto principal (US-01: la primera foto cargada, cambiable). */
  imageSrc: string
  /** Todas las fotos, empezando por la principal (el carrusel de la tarjeta). */
  photoSrcs: string[]
  /** Fecha ISO de publicación; se usa para ordenar por "más recientes". */
  publishedAt: string
  /** Solo los dos estados buscables: una propiedad `alquilada` o `pausada` nunca llega acá. */
  status: Extract<PropertyStatus, 'publicada' | 'alquilada_publicada'>
}

/**
 * Próximo ajuste del monto de un alquiler vigente (US-02: "fecha del
 * próximo ajuste y el tipo de ajuste").
 */
export interface ProximoAjuste {
  /** Fecha ISO del ajuste. */
  date: string
  index: AdjustmentIndex
  frequency: AdjustmentFrequency
}

/**
 * Una propiedad del locador en sesión, tal como se ve en `/panel/propiedades`
 * (US-02): cualquier estado, con los datos del alquiler si está alquilada.
 *
 * Adaptador: `propiedad.adapter.ts#misAlquileresItemToPropiedadLocador`
 * (`MisAlquileresItem` → `PropiedadLocador`).
 */
export interface PropiedadLocador {
  id: string
  title: string
  address: string
  neighborhoodSlug: string
  neighborhoodName: string
  type: PropertyType
  /** Estado de la publicación (US-02: publicada, pausada, alquilada, alquilada/publicada). */
  status: PropertyStatus
  priceMonthly: number
  expenses: number
  imageSrc: string
  /** Nombre del locatario; solo para alquiladas (US-02). */
  tenantName: string | null
  /** Estado del pago; solo para alquiladas (US-02). */
  paymentStatus: EstadoPago | null
  /** `true` si la propiedad tiene reclamos sin resolver (US-02). */
  hasOpenClaims: boolean
  /** Próximo ajuste; solo para alquiladas con contrato vigente (US-02). */
  nextAdjustment: ProximoAjuste | null
  /** Fecha ISO desde la que vuelve a estar disponible, si se cargó (US-01). */
  availableFrom: string | null
}
