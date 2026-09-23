import { Col, Empty, Row } from 'antd'
import type { PropiedadResumen } from '@rentar/shared-types'
import PropertyCard from './PropertyCard'

/** Props de {@link PropertyGrid}. */
interface PropertyGridProps {
  /** Propiedades ya filtradas a mostrar (la landing las recorta a 8 antes de pasarlas). */
  properties: PropiedadResumen[]
}

/**
 * Grilla responsive de tarjetas de propiedad. Muestra un estado vacío
 * (`Empty`) cuando el filtrado no encuentra resultados.
 */
export default function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <Empty
        style={{
          border: '1px dashed rgba(18, 32, 46, 0.15)',
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.6)',
          padding: '2.5rem',
        }}
        description={
          <>
            <p style={{ margin: 0, fontWeight: 600, color: '#12202E' }}>
              No encontramos propiedades con esos filtros
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'rgba(18, 32, 46, 0.7)' }}>
              Probá ampliar el precio máximo o cambiar de zona.
            </p>
          </>
        }
      />
    )
  }

  return (
    <Row gutter={[20, 20]}>
      {properties.map((property) => (
        <Col key={property.id} xs={24} sm={12} lg={8} xl={6}>
          <PropertyCard property={property} />
        </Col>
      ))}
    </Row>
  )
}
