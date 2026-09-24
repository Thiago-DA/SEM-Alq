'use client'

/**
 * ResultadosBusqueda.tsx — la grilla de resultados de `/buscar` con sus
 * estados: cargando, error, sin resultados y la paginación (US-34).
 *
 * Diseño: "Búsqueda de propiedades" · 01 (grilla y paginación) y 04
 * (sin resultados, cargando y error).
 * Quién lo usa: `BuscarPropiedades`.
 */
import { Button, Pagination, Skeleton } from 'antd'
import type { BusquedaFiltros, Paginado, PropiedadResumen } from '@rentar/shared-types'
import { EmptyState, PropertyCard } from '@rentar/ui'
import { characteristicShortLabel } from '@/lib/catalogs/characteristics'
import { hoy } from '@/lib/utils/fechas'
import { formatARS } from '@rentar/ui/src/utils/formatARS'
import styles from './Buscar.module.css'

/** Cantidad de tarjetas "esqueleto" mientras carga (diseño: "Seis Skeleton"). */
const SKELETON_COUNT = 6

// ─── Estados ────────────────────────────────────────────────────────────

/** Seis tarjetas vacías con la silueta de la PropertyCard. */
export function ResultadosCargando() {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Cargando propiedades" data-testid="buscar-cargando">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <Skeleton.Node active className={styles.skeletonImage}>
            <span />
          </Skeleton.Node>
          <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 2 }} className={styles.skeletonBody} />
        </div>
      ))}
    </div>
  )
}

/** Error de red al traer la primera página ("No pudimos traer las propiedades"). */
export function ResultadosError({ onReintentar }: { onReintentar: () => void }) {
  return (
    <div className={styles.errorBlock} role="alert" data-testid="buscar-error">
      <span className={styles.errorIcon} aria-hidden="true">
        !
      </span>
      <span className={styles.errorTitle}>No pudimos traer las propiedades</span>
      <span className={styles.errorText}>Puede ser un problema momentáneo de conexión. Tus filtros quedaron guardados.</span>
      <div className={styles.stateActions}>
        <Button type="primary" onClick={onReintentar} data-testid="buscar-reintentar">
          Reintentar
        </Button>
        <Button href="/" data-testid="buscar-volver-inicio">
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}

/**
 * Sugerencia de "Ampliar a $ X": si hay precio máximo, se propone subirlo un
 * 50% (redondeado a $ 50.000), que es el filtro que más suele recortar. El
 * diseño lo pide así: "el action lleva la sugerencia concreta".
 */
function precioSugerido(filtros: BusquedaFiltros): number | null {
  if (filtros.maxPrice === null) return null
  return Math.ceil((filtros.maxPrice * 1.5) / 50_000) * 50_000
}

interface SinResultadosProps {
  filtros: BusquedaFiltros
  onAmpliarPrecio: (maxPrice: number) => void
  onQuitarFiltros: () => void
}

/** US-34: "mensaje indicando que no hay resultados", con una sugerencia concreta. */
export function SinResultados({ filtros, onAmpliarPrecio, onQuitarFiltros }: SinResultadosProps) {
  const sugerido = precioSugerido(filtros)
  return (
    <div className={styles.emptyBlock} data-testid="buscar-sin-resultados">
      <EmptyState
        title="No encontramos propiedades con esos filtros"
        // NOTA: el diseño nombra barrios de ejemplo (Cerro de las Rosas, Villa
        // Belgrano) que no están en el piloto; se deja la sugerencia genérica.
        description="Probá ampliar el rango de precio, sumar barrios cercanos o bajar la cantidad de dormitorios."
        action={
          <div className={styles.stateActions}>
            {sugerido !== null && (
              <Button type="primary" onClick={() => onAmpliarPrecio(sugerido)} data-testid="buscar-ampliar-precio">
                Ampliar a {formatARS(sugerido)}
              </Button>
            )}
            <Button onClick={onQuitarFiltros} data-testid="buscar-quitar-filtros">
              Quitar todos los filtros
            </Button>
          </div>
        }
      />
    </div>
  )
}

// ─── Grilla ─────────────────────────────────────────────────────────────

interface ResultadosGrillaProps {
  resultado: Paginado<PropiedadResumen>
  onPagina: (pagina: number) => void
}

/** Grilla de tarjetas, "Mostrando X a Y de N propiedades" y la paginación. */
export function ResultadosGrilla({ resultado, onPagina }: ResultadosGrillaProps) {
  const desde = (resultado.page - 1) * resultado.pageSize + 1
  const hasta = desde + resultado.items.length - 1

  return (
    <div className={styles.results}>
      <div className={styles.grid} data-testid="buscar-resultados">
        {resultado.items.map((propiedad) => (
          <PropertyCard
            key={propiedad.id}
            layout="busqueda"
            href={`/propiedad/${propiedad.id}`}
            title={propiedad.title}
            neighborhoodName={propiedad.neighborhoodName}
            propertyType={propiedad.type}
            priceMonthly={propiedad.priceMonthly}
            expenses={propiedad.expenses ?? undefined}
            bedrooms={propiedad.bedrooms}
            areaM2={propiedad.areaM2}
            adjustmentIndex={propiedad.adjustmentIndex}
            imageSrc={propiedad.imageSrc}
            photoSrcs={propiedad.photoSrcs}
            address={propiedad.address}
            description={propiedad.description}
            availableFrom={propiedad.availableFrom}
            characteristicLabel={propiedad.characteristics[0] ? characteristicShortLabel[propiedad.characteristics[0]] : undefined}
            referenceDate={hoy().toDate()}
            data-testid="buscar-tarjeta"
          />
        ))}
      </div>

      <div className={styles.paginationRow}>
        <span className={styles.paginationText} data-testid="buscar-mostrando">
          Mostrando {desde} a {hasta} de {resultado.total} {resultado.total === 1 ? 'propiedad' : 'propiedades'}
        </span>
        {/* US-34: paginar cuando hay más de 10 resultados; con 10 o menos no hay páginas. */}
        {resultado.total > resultado.pageSize && (
          <Pagination
            className={styles.pagination}
            current={resultado.page}
            pageSize={resultado.pageSize}
            total={resultado.total}
            showSizeChanger={false}
            onChange={onPagina}
            data-testid="buscar-paginacion"
          />
        )}
      </div>
    </div>
  )
}
