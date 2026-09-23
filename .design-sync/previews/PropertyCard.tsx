import { PropertyCard } from '@rentar/ui'
// Fotos reales del dataset de la landing (el build de previews las inlinea como data URL).
import fotoNuevaCordoba from '../../apps/web/src/assets/properties/nueva-cordoba-2.jpg'
import fotoAltaCordoba from '../../apps/web/src/assets/properties/alta-cordoba-1.jpg'

const rowStyle = { display: 'flex', flexWrap: 'wrap' as const, gap: 24, maxWidth: 900 }

/** Dos propiedades reales del elenco lado a lado — foto, barrio, precio, ambientes y m². */
export function Default() {
  return (
    <div style={rowStyle}>
      <div style={{ width: 280 }}>
        <PropertyCard
          title="Monoambiente luminoso a metros de Plaza España"
          neighborhoodName="Nueva Córdoba"
          propertyType="departamento"
          priceMonthly={340000}
          bedrooms={1}
          areaM2={38}
          adjustmentIndex="ICL"
          imageSrc={fotoNuevaCordoba as unknown as string}
          href="#"
        />
      </div>
      <div style={{ width: 280 }}>
        <PropertyCard
          title="Casa con patio en Alta Córdoba"
          neighborhoodName="Alta Córdoba"
          propertyType="casa"
          priceMonthly={295000}
          bedrooms={3}
          areaM2={95}
          adjustmentIndex="IPC"
          imageSrc={fotoAltaCordoba as unknown as string}
          badgeLabel="Trato directo con el dueño"
          href="#"
        />
      </div>
    </div>
  )
}
