import { PhotoGallery } from '@rentar/ui'
// Fotos reales del dataset de la landing (el build de previews las inlinea como data URL).
import foto1 from '../../apps/web/src/assets/properties/nueva-cordoba-1.jpg'
import foto2 from '../../apps/web/src/assets/properties/nueva-cordoba-2.jpg'
import foto3 from '../../apps/web/src/assets/properties/nueva-cordoba-3.jpg'
import foto4 from '../../apps/web/src/assets/properties/nueva-cordoba-4.jpg'

const fotos = [
  { src: foto1 as unknown as string, alt: 'Living comedor con luz natural y biblioteca' },
  { src: foto2 as unknown as string, alt: 'Dormitorio principal' },
  { src: foto3 as unknown as string, alt: 'Living con ventanal' },
  { src: foto4 as unknown as string, alt: 'Sala de estar' },
]

/** 4 fotos de un departamento en Nueva Córdoba — imagen principal + tira de miniaturas. */
export function Default() {
  return <PhotoGallery images={fotos} />
}
