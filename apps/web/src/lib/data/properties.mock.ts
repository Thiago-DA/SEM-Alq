import type { StaticImageData } from 'next/image'
import type { AdjustmentIndex, CharacteristicKey, CharacteristicOption, PropertyStatus, PropertyType } from '@rentar/shared-types'

// TEMPORAL: copia local del tipo `Property` del origen, solo para migrar la
// landing tal cual. Se elimina en el commit siguiente, cuando estas 16
// propiedades pasan al elenco (`lib/mocks/propiedades.mock.ts`).
interface Property {
  id: string
  title: string
  neighborhoodSlug: string
  neighborhoodName: string
  type: PropertyType
  priceMonthly: number
  bedrooms: number
  areaM2: number
  adjustmentIndex: AdjustmentIndex
  characteristics: CharacteristicKey[]
  directOwner: boolean
  status: PropertyStatus
  ownerId: string
}
import altaCordoba1 from '@/assets/properties/alta-cordoba-1.jpg'
import altaCordoba2 from '@/assets/properties/alta-cordoba-2.jpg'
import altaCordoba3 from '@/assets/properties/alta-cordoba-3.jpg'
import centro1 from '@/assets/properties/centro-1.jpg'
import centro2 from '@/assets/properties/centro-2.jpg'
import centro3 from '@/assets/properties/centro-3.jpg'
import cofico1 from '@/assets/properties/cofico-1.jpg'
import cofico2 from '@/assets/properties/cofico-2.jpg'
import generalPaz1 from '@/assets/properties/general-paz-1.jpg'
import generalPaz2 from '@/assets/properties/general-paz-2.jpg'
import guemes1 from '@/assets/properties/guemes-1.jpg'
import guemes2 from '@/assets/properties/guemes-2.jpg'
import nuevaCordoba1 from '@/assets/properties/nueva-cordoba-1.jpg'
import nuevaCordoba2 from '@/assets/properties/nueva-cordoba-2.jpg'
import nuevaCordoba3 from '@/assets/properties/nueva-cordoba-3.jpg'
import nuevaCordoba4 from '@/assets/properties/nueva-cordoba-4.jpg'

/**
 * Propiedad de mock con la imagen ya resuelta por Next.js. `StaticImageData`
 * es específico de `next/image` y no existe en el tipo de dominio `Property`
 * de `@rentar/shared-types` (ese paquete no depende de Next), así que se
 * compone acá.
 */
export type MockProperty = Property & { image: StaticImageData }

/**
 * NOTA: este dataset es de la landing (`Landing`/`SearchBar`/`PropertyGrid`),
 * anterior al elenco único de `apps/web/src/lib/mocks/` que sí tiene dueños
 * reales (Nicolás Arrieta, Sofía Ledesma). La landing no se toca en el Paso
 * 5, así que estas 16 propiedades siguen existiendo aparte — es deuda
 * documentada a unificar cuando `/buscar` se implemente de verdad (tanda
 * "Pública" del Paso 6). Hasta entonces, ninguna pantalla nueva debe
 * importar este archivo: el panel del locador usa
 * `apps/web/src/lib/mocks/propiedades.mock.ts`.
 */
export const characteristicOptions: CharacteristicOption[] = [
  { key: 'amoblado', label: 'Amoblado' },
  { key: 'mascotas', label: 'Acepta mascotas' },
  { key: 'cochera', label: 'Cochera' },
  { key: 'balcon', label: 'Balcón' },
  { key: 'apto-profesional', label: 'Apto profesional' },
]

export const properties: MockProperty[] = [
  {
    id: 'p1',
    title: 'Monoambiente luminoso a metros de Plaza España',
    neighborhoodSlug: 'nueva-cordoba',
    neighborhoodName: 'Nueva Córdoba',
    type: 'departamento',
    priceMonthly: 580000,
    bedrooms: 1,
    areaM2: 38,
    adjustmentIndex: 'ICL',
    characteristics: ['amoblado', 'balcon'],
    image: nuevaCordoba1,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p2',
    title: 'Depto de 1 dormitorio con balcón terraza',
    neighborhoodSlug: 'nueva-cordoba',
    neighborhoodName: 'Nueva Córdoba',
    type: 'departamento',
    priceMonthly: 610000,
    bedrooms: 1,
    areaM2: 42,
    adjustmentIndex: 'ICL',
    characteristics: ['balcon', 'apto-profesional'],
    image: nuevaCordoba2,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p3',
    title: 'Departamento a estrenar cerca de la peatonal',
    neighborhoodSlug: 'centro',
    neighborhoodName: 'Centro',
    type: 'departamento',
    priceMonthly: 470000,
    bedrooms: 1,
    areaM2: 40,
    adjustmentIndex: 'IPC',
    characteristics: ['amoblado', 'apto-profesional'],
    image: centro1,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p4',
    title: 'Amplio 2 ambientes con living comedor integrado',
    neighborhoodSlug: 'centro',
    neighborhoodName: 'Centro',
    type: 'departamento',
    priceMonthly: 495000,
    bedrooms: 2,
    areaM2: 55,
    adjustmentIndex: 'IPC',
    characteristics: ['mascotas', 'balcon'],
    image: centro2,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p5',
    title: 'PH de dos dormitorios con patio propio',
    neighborhoodSlug: 'guemes',
    neighborhoodName: 'Güemes',
    type: 'ph',
    priceMonthly: 460000,
    bedrooms: 2,
    areaM2: 60,
    adjustmentIndex: 'IPC',
    characteristics: ['mascotas', 'cochera'],
    image: guemes1,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p6',
    title: 'Departamento reciclado sobre calle arbolada',
    neighborhoodSlug: 'cofico',
    neighborhoodName: 'Cofico',
    type: 'departamento',
    priceMonthly: 450000,
    bedrooms: 1,
    areaM2: 45,
    adjustmentIndex: 'ICL',
    characteristics: ['amoblado', 'mascotas'],
    image: cofico1,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p7',
    title: 'Casa de 2 dormitorios con cochera cubierta',
    neighborhoodSlug: 'general-paz',
    neighborhoodName: 'General Paz',
    type: 'casa',
    priceMonthly: 505000,
    bedrooms: 2,
    areaM2: 70,
    adjustmentIndex: 'IPC',
    characteristics: ['cochera', 'mascotas'],
    image: generalPaz1,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p8',
    title: 'Monoambiente ideal para estudiante, a metros del FFyH',
    neighborhoodSlug: 'alta-cordoba',
    neighborhoodName: 'Alta Córdoba',
    type: 'departamento',
    priceMonthly: 445000,
    bedrooms: 1,
    areaM2: 32,
    adjustmentIndex: 'ICL',
    characteristics: ['amoblado'],
    image: altaCordoba1,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p9',
    title: 'Departamento moderno con vista abierta',
    neighborhoodSlug: 'nueva-cordoba',
    neighborhoodName: 'Nueva Córdoba',
    type: 'departamento',
    priceMonthly: 595000,
    bedrooms: 1,
    areaM2: 40,
    adjustmentIndex: 'ICL',
    characteristics: ['amoblado', 'apto-profesional'],
    image: nuevaCordoba3,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p10',
    title: 'Torre a metros de Plaza España, piso alto',
    neighborhoodSlug: 'nueva-cordoba',
    neighborhoodName: 'Nueva Córdoba',
    type: 'departamento',
    priceMonthly: 600000,
    bedrooms: 2,
    areaM2: 52,
    adjustmentIndex: 'ICL',
    characteristics: ['cochera', 'balcon'],
    image: nuevaCordoba4,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p11',
    title: 'PH luminoso con living comedor y patio',
    neighborhoodSlug: 'guemes',
    neighborhoodName: 'Güemes',
    type: 'ph',
    priceMonthly: 470000,
    bedrooms: 1,
    areaM2: 48,
    adjustmentIndex: 'IPC',
    characteristics: ['amoblado', 'balcon'],
    image: guemes2,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p12',
    title: 'Departamento renovado a dos cuadras del ferrocarril',
    neighborhoodSlug: 'alta-cordoba',
    neighborhoodName: 'Alta Córdoba',
    type: 'departamento',
    priceMonthly: 460000,
    bedrooms: 2,
    areaM2: 50,
    adjustmentIndex: 'IPC',
    characteristics: ['mascotas', 'cochera'],
    image: altaCordoba2,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p13',
    title: 'Departamento con vista abierta y mucha luz natural',
    neighborhoodSlug: 'centro',
    neighborhoodName: 'Centro',
    type: 'departamento',
    priceMonthly: 485000,
    bedrooms: 2,
    areaM2: 58,
    adjustmentIndex: 'IPC',
    characteristics: ['balcon', 'apto-profesional'],
    image: centro3,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p14',
    title: 'Casa de 2 dormitorios con habitaciones amplias',
    neighborhoodSlug: 'general-paz',
    neighborhoodName: 'General Paz',
    type: 'casa',
    priceMonthly: 495000,
    bedrooms: 2,
    areaM2: 68,
    adjustmentIndex: 'IPC',
    characteristics: ['amoblado', 'mascotas'],
    image: generalPaz2,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p15',
    title: 'Monoambiente con escritorio, ideal para estudiar',
    neighborhoodSlug: 'alta-cordoba',
    neighborhoodName: 'Alta Córdoba',
    type: 'departamento',
    priceMonthly: 450000,
    bedrooms: 1,
    areaM2: 30,
    adjustmentIndex: 'ICL',
    characteristics: ['amoblado', 'apto-profesional'],
    image: altaCordoba3,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
  {
    id: 'p16',
    title: 'Departamento con cocina integrada a estrenar',
    neighborhoodSlug: 'cofico',
    neighborhoodName: 'Cofico',
    type: 'departamento',
    priceMonthly: 465000,
    bedrooms: 1,
    areaM2: 44,
    adjustmentIndex: 'IPC',
    characteristics: ['cochera'],
    image: cofico2,
    directOwner: true,
    status: 'publicada',
    // NOTA: 'generic' porque estas 16 propiedades son de relleno de la
    // landing (anteriores al elenco único con dueño real de
    // apps/web/src/lib/mocks/) — no representan a ningún locador del
    // elenco. Ver apps/web/src/lib/mocks/README.md.
    ownerId: 'generic',
  },
]
