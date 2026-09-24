'use client'

/**
 * PropertyCardBusqueda.tsx — la tarjeta de `/buscar`: precio, dirección aproximada, barrio,
 * descripción, disponibilidad, chips y carrusel.
 *
 * Diseño: "Búsqueda de propiedades" · 01.
 * Quién lo usa: `PropertyCard` (con `layout="busqueda"`).
 */
import { useState } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import type { AdjustmentIndex, PropertyType } from '@rentar/shared-types'
import { useNextBridge } from '../../providers/NextBridge'
import { formatARS } from '../../utils/formatARS'
import { formatDate } from '../../utils/formatDate'
import { IndexBadge } from './IndexBadge'
import styles from './PropertyCardBusqueda.module.css'

// ─── Props ─────────────────────────────────────────────────────────────────

/** Props de {@link PropertyCardBusqueda}. */
export interface PropertyCardBusquedaProps {
  title: string
  neighborhoodName: string
  propertyType: PropertyType
  priceMonthly: number
  bedrooms: number
  areaM2: number
  /** `null` si la propiedad no tiene índice cargado: no se muestra el badge. */
  adjustmentIndex: AdjustmentIndex | null
  imageSrc: string
  imageAlt?: string
  href: string
  /** Expensas mensuales. `0` muestra "Sin expensas"; sin valor, no se muestra la línea. */
  expenses?: number
  /** Dirección aproximada, ej. "Rondeau al 400". Es el link principal de la tarjeta. */
  address?: string
  /** Descripción; se recorta a 2 líneas. */
  description?: string
  /** Fecha ISO desde la que se puede alquilar. `null` o pasada = "Disponible ahora". */
  availableFrom?: string | null
  /** Todas las fotos; con más de una aparece el carrusel ("Foto 1 de N" y flechas). */
  photoSrcs?: string[]
  /** Una característica destacada para los chips (ej. "Mascotas"). */
  characteristicLabel?: string
  /**
   * "Hoy" contra el que se decide entre "Disponible desde" y "Disponible
   * ahora". Por defecto, la fecha actual. `apps/web` le pasa su "hoy"
   * (fijo en modo mock, ver `lib/utils/fechas.ts`), así la tarjeta no
   * contradice al resto de la app.
   */
  referenceDate?: Date
  'data-testid'?: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * "Disponible desde dd/mm/aaaa" si la fecha es posterior a `referenceDate`;
 * si no, "Disponible ahora".
 */
function availabilityLabel(availableFrom: string | null | undefined, referenceDate: Date): string {
  if (!availableFrom) return 'Disponible ahora'
  const date = new Date(availableFrom)
  return date.getTime() > referenceDate.getTime() ? `Disponible desde ${formatDate(availableFrom)}` : 'Disponible ahora'
}

// ─── Componente ────────────────────────────────────────────────────────────

/**
 * Tarjeta de propiedad de `/buscar` (Claude Design, "Búsqueda de
 * propiedades" · 01 y 03): foto (con carrusel si hay más de una), precio en
 * dorado "por mes", expensas, dirección aproximada, "barrio · título",
 * descripción, disponibilidad y chips (dormitorios o ambientes, m², una
 * característica e índice).
 *
 * La descripción y la disponibilidad no están en el diseño: las pide US-34
 * ("mostrar la descripción" y "la fecha de disponibilidad").
 *
 * NOTA: accesibilidad — toda la tarjeta navega al detalle, pero el link es
 * solo la dirección (un `<a>` "estirado" con `::after` que cubre la tarjeta).
 * Así las flechas del carrusel pueden ser `<button>` de verdad: un botón
 * dentro de un link es HTML inválido.
 *
 * Se usa a través de `PropertyCard` con `layout="busqueda"`.
 */
export function PropertyCardBusqueda({
  title,
  neighborhoodName,
  propertyType,
  priceMonthly,
  bedrooms,
  areaM2,
  adjustmentIndex,
  imageSrc,
  imageAlt,
  href,
  expenses,
  address,
  description,
  availableFrom,
  photoSrcs,
  characteristicLabel,
  referenceDate,
  ...rest
}: PropertyCardBusquedaProps) {
  const { ImageComponent, LinkComponent } = useNextBridge()
  const photos = photoSrcs && photoSrcs.length > 0 ? photoSrcs : [imageSrc]
  const [photoIndex, setPhotoIndex] = useState(0)
  const hasCarousel = photos.length > 1

  /** Pasa a la foto anterior o siguiente, dando la vuelta en los extremos. */
  function movePhoto(step: number): void {
    setPhotoIndex((current) => (current + step + photos.length) % photos.length)
  }

  const sizeChip = propertyType === 'monoambiente' ? '1 amb.' : `${bedrooms} dorm.`

  return (
    <article className={styles.card} {...rest}>
      <div className={styles.imageWrap}>
        <ImageComponent
          src={photos[photoIndex]}
          alt={imageAlt ?? `Foto ${photoIndex + 1} de ${address ?? title}`}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
          className={styles.image}
        />
        {hasCarousel && (
          <>
            <span className={styles.photoCount}>
              Foto {photoIndex + 1} de {photos.length}
            </span>
            <button type="button" className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => movePhoto(-1)} aria-label="Foto anterior" data-testid="property-card-prev-photo">
              <LeftOutlined />
            </button>
            <button type="button" className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => movePhoto(1)} aria-label="Foto siguiente" data-testid="property-card-next-photo">
              <RightOutlined />
            </button>
          </>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatARS(priceMonthly)}</span>
          <span className={styles.perMonth}>por mes</span>
        </div>
        {expenses !== undefined && (
          <span className={styles.expenses}>{expenses > 0 ? `+ ${formatARS(expenses)} de expensas` : 'Sin expensas'}</span>
        )}

        <div className={styles.titleBlock}>
          <LinkComponent href={href} className={styles.addressLink} data-testid="property-card-link">
            {address ?? title}
          </LinkComponent>
          <span className={styles.subtitle}>
            {neighborhoodName} · {title}
          </span>
        </div>

        {description && <p className={styles.description}>{description}</p>}
        <span className={styles.availability} data-testid="property-card-availability">
          {availabilityLabel(availableFrom, referenceDate ?? new Date())}
        </span>

        <div className={styles.chips}>
          <span className={styles.chip}>{sizeChip}</span>
          <span className={styles.chip}>{areaM2} m²</span>
          {characteristicLabel && <span className={styles.chip}>{characteristicLabel}</span>}
          {adjustmentIndex && <IndexBadge index={adjustmentIndex} />}
        </div>
      </div>
    </article>
  )
}
