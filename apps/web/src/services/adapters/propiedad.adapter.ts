/**
 * propiedad.adapter.ts — traduce inmuebles y publicaciones del back a los
 * tipos de vista de propiedad.
 *
 * Qué es: la frontera entre `Inmueble`/`Publicacion` (modelos del back,
 * tablas `inmueble` y `publicacion`) y `PropiedadResumen` (tipo de vista).
 * Cada función comenta, campo por campo, lo que el back todavía no devuelve.
 * Cubre: US-34 (y, en la tanda "Locador", US-01 y US-02).
 * Quién lo usa: la rama real de `services/propiedades.service.ts`.
 */
import type { CharacteristicKey, Inmueble, PropertyType, PropiedadResumen, Publicacion } from '@rentar/shared-types'

/**
 * Foto que se muestra mientras el back no tenga fotos.
 * TODO(backend): el back no guarda fotos (en curso en
 * `feature/registrar-usuario`, tabla `foto_inmueble`).
 */
export const PLACEHOLDER_PHOTO_SRC = '/placeholder-propiedad.svg'

// ─── Catálogos: id del back ↔ clave del front ───────────────────────────

/**
 * `tipo_inmueble.id` → `PropertyType`. Mismos ids que el seed del back
 * (`apps/api/src/repositories/lookup.repository.ts`).
 */
const PROPERTY_TYPE_BY_TIPO_ID: Record<number, PropertyType> = {
  1: 'departamento',
  2: 'casa',
  3: 'ph',
  4: 'monoambiente',
}

/** Traduce `inmueble.tipo` al `PropertyType` del front. Un id desconocido se muestra como departamento. */
export function propertyTypeFromTipoId(tipoId: number): PropertyType {
  return PROPERTY_TYPE_BY_TIPO_ID[tipoId] ?? 'departamento'
}

/** `PropertyType` → `tipo_inmueble.id` (para el alta, US-01). */
export function tipoIdFromPropertyType(type: PropertyType): number {
  const entry = Object.entries(PROPERTY_TYPE_BY_TIPO_ID).find(([, value]) => value === type)
  return Number(entry?.[0] ?? 1)
}

/**
 * `tag_inmueble.id` → `CharacteristicKey`. Mismos ids que el seed del back.
 * NOTA: `apto-profesional` no existe en el back (y el id 4 del back,
 * "Balcón con vista abierta", se muestra como `balcon`).
 * TODO(db): sumar el tag "Apto profesional".
 */
const CHARACTERISTIC_BY_TAG_ID: Record<number, CharacteristicKey> = {
  1: 'mascotas',
  2: 'cochera',
  3: 'amoblado',
  4: 'balcon',
}

/** Traduce `inmueble.tags` a una característica; `null` si el id no tiene equivalente. */
export function characteristicFromTagId(tagId: number): CharacteristicKey | null {
  return CHARACTERISTIC_BY_TAG_ID[tagId] ?? null
}

// ─── Inmueble + Publicación → PropiedadResumen ──────────────────────────

/** Los datos de la publicación que usa el resumen (vienen en `Publicacion` o en `InmuebleDetalleResponse.publicacion`). */
export type PublicacionResumen = Pick<Publicacion, 'titulo' | 'precio'> & { created_at?: string | Date }

/**
 * `Inmueble` + `Publicacion` → `PropiedadResumen` (tarjeta de `/buscar`, US-34).
 *
 * Campo por campo, lo que el back todavía no devuelve (TODO(backend) en
 * `docs/HANDOFF-BACKEND.md`, "Brechas contra la API actual"):
 * - `title`, `priceMonthly`: vienen de la publicación. `GET /inmuebles/disponibles`
 *   no la incluye; el service la busca aparte. Sin publicación: título =
 *   dirección y precio 0.
 * - `neighborhoodSlug`/`neighborhoodName`: no hay barrio; se usa la ciudad.
 * - `expenses`: no existe; 0.
 * - `adjustmentIndex`: no existe; `null`.
 * - `availableFrom`: no existe; `null` (= disponible ya).
 * - `imageSrc`: no hay fotos; {@link PLACEHOLDER_PHOTO_SRC}.
 * - `characteristics`: el back guarda UN tag (`tags: number`), no una lista.
 * - `status`: `/disponibles` solo devuelve publicadas; `'publicada'`.
 */
export function inmuebleToPropiedadResumen(inmueble: Inmueble, publicacion: PublicacionResumen | null): PropiedadResumen {
  const address = inmueble.piso
    ? `${inmueble.direccion} ${inmueble.numero}, ${inmueble.piso}`
    : `${inmueble.direccion} ${inmueble.numero}`
  const characteristic = inmueble.tags ? characteristicFromTagId(inmueble.tags) : null
  const publishedAt = publicacion?.created_at ?? inmueble.created_at

  return {
    id: String(inmueble.id),
    title: publicacion?.titulo ?? address,
    address,
    neighborhoodSlug: '',
    neighborhoodName: inmueble.ciudad,
    type: propertyTypeFromTipoId(inmueble.tipo),
    priceMonthly: publicacion?.precio ?? 0,
    expenses: 0,
    bedrooms: inmueble.dormitorios,
    rooms: inmueble.ambientes,
    areaM2: inmueble.m2,
    adjustmentIndex: null,
    characteristics: characteristic ? [characteristic] : [],
    description: inmueble.descripcion ?? '',
    availableFrom: null,
    imageSrc: PLACEHOLDER_PHOTO_SRC,
    publishedAt: publishedAt ? new Date(publishedAt).toISOString() : '',
    status: 'publicada',
  }
}
