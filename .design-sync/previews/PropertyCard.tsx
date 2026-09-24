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

/** Tarjeta de /buscar (layout="busqueda"): dirección aproximada, descripción, disponibilidad y chips. */
export function Busqueda() {
  return (
    <div style={{ width: 300 }}>
      <PropertyCard
        layout="busqueda"
        title="1 dormitorio en planta baja con cochera"
        neighborhoodName="Güemes"
        propertyType="departamento"
        priceMonthly={385000}
        expenses={62000}
        bedrooms={1}
        areaM2={42}
        adjustmentIndex="IPC"
        imageSrc={fotoNuevaCordoba as unknown as string}
        photoSrcs={[fotoNuevaCordoba as unknown as string, fotoAltaCordoba as unknown as string]}
        address="Rondeau al 400"
        description="Departamento de un dormitorio en planta baja, con cochera, a una cuadra del Paseo de las Artes."
        availableFrom="2026-10-01"
        referenceDate={new Date('2026-09-23T00:00:00-03:00')}
        characteristicLabel="Cochera"
        href="#"
      />
    </div>
  )
}
