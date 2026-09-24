/**
 * propiedad-mock.adapter.ts — traduce una propiedad del elenco mock a los
 * tipos de vista.
 *
 * Qué es: el equivalente, en modo mock, de `propiedad.adapter.ts`. El elenco
 * guarda cada propiedad completa (`PropiedadMock`, como la guardaría el
 * back); las pantallas reciben solo lo que muestran.
 * Cubre: US-34 (`PropiedadResumen`) y US-02 (`PropiedadLocador`).
 * Quién lo usa: la rama mock de `services/propiedades.service.ts` y el
 * catálogo `/design-system`.
 */
import type { PropiedadLocador, PropiedadResumen } from '@rentar/shared-types'
import type { PropiedadMock } from '@/lib/mocks'
import { formatApproxAddress } from './direccion'

/** Dirección exacta: "Calle 123, 7° B". Solo para el locador (US-02), nunca en la zona pública. */
export function formatAddress(propiedad: Pick<PropiedadMock, 'street' | 'streetNumber' | 'floor'>): string {
  const base = `${propiedad.street} ${propiedad.streetNumber}`
  return propiedad.floor ? `${base}, ${propiedad.floor}` : base
}

/** URL de la foto principal (US-01: la elegida como principal; si falta, la primera). */
export function mainPhotoSrc(propiedad: Pick<PropiedadMock, 'photos' | 'mainPhotoIndex'>): string {
  return propiedad.photos[propiedad.mainPhotoIndex]?.src ?? propiedad.photos[0]?.src ?? ''
}

/** Todas las fotos, con la principal primero (para el carrusel de la tarjeta). */
export function photosMainFirst(propiedad: Pick<PropiedadMock, 'photos' | 'mainPhotoIndex'>): string[] {
  const principal = mainPhotoSrc(propiedad)
  return [principal, ...propiedad.photos.map((foto) => foto.src).filter((src, index) => index !== propiedad.mainPhotoIndex)]
}

/**
 * `true` si la propiedad aparece en `/buscar` (US-34: "publicadas o
 * publicadas/alquiladas"). Una `alquilada` a secas o una `pausada`, nunca.
 */
export function isSearchable(propiedad: PropiedadMock): propiedad is PropiedadMock & { status: PropiedadResumen['status'] } {
  return propiedad.status === 'publicada' || propiedad.status === 'alquilada_publicada'
}

/**
 * `PropiedadMock` → `PropiedadResumen` (tarjeta de la landing y de `/buscar`).
 * Solo acepta propiedades buscables: filtrar antes con {@link isSearchable}.
 */
export function propiedadMockToResumen(propiedad: PropiedadMock & { status: PropiedadResumen['status'] }): PropiedadResumen {
  return {
    id: propiedad.id,
    title: propiedad.title,
    // Zona pública: dirección aproximada (ver la NOTA de privacidad en direccion.ts).
    address: formatApproxAddress(propiedad.street, propiedad.streetNumber),
    province: propiedad.province,
    city: propiedad.city,
    neighborhoodSlug: propiedad.neighborhoodSlug,
    neighborhoodName: propiedad.neighborhoodName,
    type: propiedad.type,
    priceMonthly: propiedad.priceMonthly,
    expenses: propiedad.expenses,
    bedrooms: propiedad.bedrooms,
    rooms: propiedad.rooms,
    areaM2: propiedad.totalAreaM2,
    adjustmentIndex: propiedad.adjustmentIndex,
    characteristics: propiedad.characteristics,
    description: propiedad.description,
    availableFrom: propiedad.availableFrom,
    imageSrc: mainPhotoSrc(propiedad),
    photoSrcs: photosMainFirst(propiedad),
    publishedAt: propiedad.publishedAt,
    status: propiedad.status,
  }
}

/** `PropiedadMock` → `PropiedadLocador` (fila de `/panel/propiedades`, US-02). */
export function propiedadMockToLocador(propiedad: PropiedadMock): PropiedadLocador {
  return {
    id: propiedad.id,
    title: propiedad.title,
    address: formatAddress(propiedad),
    neighborhoodSlug: propiedad.neighborhoodSlug,
    neighborhoodName: propiedad.neighborhoodName,
    type: propiedad.type,
    status: propiedad.status,
    priceMonthly: propiedad.priceMonthly,
    expenses: propiedad.expenses,
    imageSrc: mainPhotoSrc(propiedad),
    tenantName: propiedad.rental?.tenantName ?? null,
    paymentStatus: propiedad.rental?.paymentStatus ?? null,
    hasOpenClaims: propiedad.rental?.hasOpenClaims ?? false,
    nextAdjustment: propiedad.rental?.nextAdjustment ?? null,
    availableFrom: propiedad.availableFrom,
  }
}
