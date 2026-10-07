/**
 * titulo.ts — título de una publicación cuando el back no manda uno.
 *
 * Qué es: el back no guarda un título de la publicación, así que el front lo
 * arma con tipo + dormitorios + barrio ("Departamento de 1 dormitorio en
 * Nueva Córdoba"). Vive en un solo lugar para que la tarjeta de `/buscar`
 * (US-34) y el detalle (US-41) digan lo mismo de la misma propiedad.
 *
 * NOTA de privacidad: el título nunca lleva la dirección. Se ve en la
 * tarjeta, en las migas y en el subtítulo del detalle, y la zona pública no
 * muestra la altura ni el piso (ver `direccion.ts`).
 * TODO(backend): el back no guarda un título de la publicación.
 *
 * Quién lo usa: `propiedad.adapter.ts` (rama real de `/inmuebles/disponibles`
 * y de `/inmuebles/disponibles/:id`).
 */
import type { PropertyType } from '@rentar/shared-types'
import { PROPERTY_TYPE_LABEL } from '@/lib/catalogs/propiedad'

/** Lo que hace falta para armar el título. */
interface DatosTitulo {
  type: PropertyType
  bedrooms: number
  /** Nombre del barrio; vacío si no se conoce (el título va sin "en …"). */
  neighborhoodName: string
}

/**
 * Título de una publicación: tipo + dormitorios + barrio.
 * Ej.: "Departamento de 1 dormitorio en Nueva Córdoba", "Casa de 2
 * dormitorios en Güemes", "Monoambiente en Centro" (un monoambiente no
 * nombra dormitorios), "PH de 2 dormitorios" (sin barrio conocido).
 */
export function tituloDePublicacion({ type, bedrooms, neighborhoodName }: DatosTitulo): string {
  const tipo = PROPERTY_TYPE_LABEL[type]
  const base = type === 'monoambiente' ? tipo : `${tipo} de ${bedrooms} ${bedrooms === 1 ? 'dormitorio' : 'dormitorios'}`
  return neighborhoodName ? `${base} en ${neighborhoodName}` : base
}
