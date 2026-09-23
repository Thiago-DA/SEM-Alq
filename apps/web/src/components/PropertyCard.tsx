import Image from 'next/image'
import { Button, Card } from 'antd'
import type { PropertyType } from '@rentar/shared-types'
import { formatMonthlyPrice } from '@/lib/utils/format'
import type { MockProperty } from '@/lib/data/properties.mock'
import styles from './PropertyCard.module.css'

const typeLabels: Record<PropertyType, string> = {
  departamento: 'Departamento',
  casa: 'Casa',
  ph: 'PH',
  monoambiente: 'Monoambiente',
}

/** Props de {@link PropertyCard}. */
interface PropertyCardProps {
  /** Propiedad a mostrar, con la imagen ya resuelta por `next/image`. */
  property: MockProperty
}

/**
 * Tarjeta de una propiedad. Se usa en el grid de resultados de la landing
 * (`PropertyGrid`) y como ejemplo en vivo en la sección "Tarjetas" de
 * `/design-system`.
 */
export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card
      hoverable
      cover={
        <div className={styles.imageWrap}>
          <Image
            src={property.image}
            alt={`${typeLabels[property.type]} en ${property.neighborhoodName}`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={styles.image}
          />
          <span className={styles.badge}>Trato directo con el dueño</span>
        </div>
      }
    >
      <h3 className={styles.title}>{property.title}</h3>
      <p className={styles.subtitle}>
        {property.neighborhoodName} · {typeLabels[property.type]}
      </p>

      <div className={styles.metaRow}>
        <span>
          {property.bedrooms} {property.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}
        </span>
        <span>{property.areaM2} m²</span>
        <span>Ajuste por {property.adjustmentIndex}</span>
      </div>

      <div className={styles.footerRow}>
        <p className={styles.price}>{formatMonthlyPrice(property.priceMonthly)}</p>
        <Button
          size="small"
          style={{ background: '#E3F2FB', color: '#004D98', border: 'none' }}
          data-testid="property-card-detail-button"
        >
          Ver detalle
        </Button>
      </div>
    </Card>
  )
}
