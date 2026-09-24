import { Card } from 'antd'
import type { AdjustmentIndex, PropertyType } from '@rentar/shared-types'
import { useNextBridge } from '../../providers/NextBridge'
import { IndexBadge } from './IndexBadge'
import { MoneyAmount } from './MoneyAmount'
import { PropertyCardBusqueda, type PropertyCardBusquedaProps } from './PropertyCardBusqueda'
import styles from './PropertyCard.module.css'

const TYPE_LABEL: Record<PropertyType, string> = {
  departamento: 'Departamento',
  casa: 'Casa',
  ph: 'PH',
  monoambiente: 'Monoambiente',
}

/**
 * Props de {@link PropertyCard}. Las que hereda de `PropertyCardBusquedaProps`
 * (`expenses`, `address`, `description`, `availableFrom`, `photoSrcs`,
 * `characteristicLabel`) solo se usan con `layout="busqueda"`.
 */
interface PropertyCardProps extends Omit<PropertyCardBusquedaProps, 'adjustmentIndex'> {
  /**
   * `'default'` (tarjeta original: título, barrio · tipo, dormitorios/m²/índice
   * y precio con "Ver detalle") o `'busqueda'` (la de `/buscar`, Claude
   * Design "Búsqueda de propiedades"). Por defecto, `'default'`.
   */
  layout?: 'default' | 'busqueda'
  title: string
  neighborhoodName: string
  propertyType: PropertyType
  priceMonthly: number
  bedrooms: number
  areaM2: number
  /** `null` si la propiedad no tiene índice cargado: no se muestra el badge. */
  adjustmentIndex: AdjustmentIndex | null
  /**
   * URL de la imagen principal, ya resuelta por quien use el componente
   * (`apps/web` resuelve el `.src` de una imagen importada estáticamente,
   * o una URL remota si la propiedad viene del backend).
   */
  imageSrc: string
  imageAlt?: string
  /** Texto del chip sobre la imagen, ej. "Trato directo con el dueño". */
  badgeLabel?: string
  /** Ruta al detalle de la propiedad — toda la tarjeta navega ahí. */
  href: string
  'data-testid'?: string
}

/**
 * Tarjeta de una propiedad publicada: foto, badge, título, barrio +
 * tipología, dormitorios/m²/índice de ajuste y precio destacado. Se usa en
 * `/buscar`, en el listado de propiedades del locador
 * (`/panel/propiedades`) y en el paso de revisión del alta.
 *
 * Portado desde `apps/web/src/components/PropertyCard.tsx` (que seguía
 * acoplado a `MockProperty`/`StaticImageData`, específicos de la landing) —
 * mismo markup, props desacopladas del tipo de dato para poder usarlo
 * también fuera de `apps/web`.
 */
export function PropertyCard(props: PropertyCardProps) {
  if (props.layout === 'busqueda') {
    const { layout, badgeLabel, ...busqueda } = props
    void layout
    void badgeLabel // la tarjeta de búsqueda no lleva el chip sobre la foto
    return <PropertyCardBusqueda {...busqueda} />
  }
  return <PropertyCardDefault {...props} />
}

/** La tarjeta original (`layout="default"`). */
function PropertyCardDefault({
  title,
  neighborhoodName,
  propertyType,
  priceMonthly,
  bedrooms,
  areaM2,
  adjustmentIndex,
  imageSrc,
  imageAlt,
  badgeLabel = 'Trato directo con el dueño',
  href,
  'data-testid': dataTestId,
}: PropertyCardProps) {
  const { ImageComponent, LinkComponent } = useNextBridge()

  return (
    <LinkComponent href={href} className={styles.link} data-testid={dataTestId}>
      <Card
        hoverable
        cover={
          <div className={styles.imageWrap}>
            <ImageComponent
              src={imageSrc}
              alt={imageAlt ?? `${TYPE_LABEL[propertyType]} en ${neighborhoodName}`}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={styles.image}
            />
            {badgeLabel && <span className={styles.badge}>{badgeLabel}</span>}
          </div>
        }
      >
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>
          {neighborhoodName} · {TYPE_LABEL[propertyType]}
        </p>

        <div className={styles.metaRow}>
          <span>
            {bedrooms} {bedrooms === 1 ? 'dormitorio' : 'dormitorios'}
          </span>
          <span>{areaM2} m²</span>
          {adjustmentIndex && <IndexBadge index={adjustmentIndex} />}
        </div>

        <div className={styles.footerRow}>
          <MoneyAmount amount={priceMonthly} size="lg" emphasis />
          {/* `<span>`, no `<Button>`: la tarjeta entera ya es un <a> (`LinkComponent`), y anidar un elemento interactivo (<button>) dentro de otro (<a>) es HTML inválido. */}
          <span className={styles.detailButton} data-testid="property-card-detail-button">
            Ver detalle
          </span>
        </div>
      </Card>
    </LinkComponent>
  )
}
