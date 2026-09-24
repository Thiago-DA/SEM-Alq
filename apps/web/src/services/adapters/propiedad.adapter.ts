/**
 * propiedad.adapter.ts — traduce inmuebles y publicaciones del back a los
 * tipos de vista de propiedad.
 *
 * Qué es: la frontera entre `Inmueble`/`Publicacion` (modelos del back,
 * tablas `inmueble` y `publicacion`) y `PropiedadResumen` (tipo de vista).
 * Cada función comenta, campo por campo, lo que el back todavía no devuelve.
 * Cubre: US-34 (`PropiedadResumen`), US-02 (`PropiedadLocador`) y US-01
 * (`PropiedadNueva` → cuerpos de `POST /inmuebles` y `POST /publicaciones`).
 * Quién lo usa: la rama real de `services/propiedades.service.ts`.
 */
import type {
  CharacteristicKey,
  Inmueble,
  MisAlquileresItem,
  PropertyStatus,
  PropertyType,
  PropiedadLocador,
  PropiedadNueva,
  PropiedadResumen,
  Publicacion,
} from '@rentar/shared-types'
import type { CrearInmuebleRequest, CrearPublicacionRequest } from '../shared/backend-dtos'
import { formatApproxAddress, formatFloorUnit } from './direccion'

/**
 * Foto que se muestra mientras el back no tenga fotos.
 * TODO(backend): el back no guarda fotos (en curso en
 * `feature/registrar-usuario`, tabla `foto_inmueble`).
 */
export const PLACEHOLDER_PHOTO_SRC = '/placeholder-propiedad.svg'

// ─── Catálogos: id del back ↔ clave del front ───────────────────────────

/**
 * `tipo_inmueble.id` → `PropertyType`. Mismos ids que el seed del back
 * (`apps/api/src/repositories/lookup.repository.ts`).
 */
const PROPERTY_TYPE_BY_TIPO_ID: Record<number, PropertyType> = {
  1: 'departamento',
  2: 'casa',
  3: 'ph',
  4: 'monoambiente',
}

/** Traduce `inmueble.tipo` al `PropertyType` del front. Un id desconocido se muestra como departamento. */
export function propertyTypeFromTipoId(tipoId: number): PropertyType {
  return PROPERTY_TYPE_BY_TIPO_ID[tipoId] ?? 'departamento'
}

/** `PropertyType` → `tipo_inmueble.id` (para el alta, US-01). */
export function tipoIdFromPropertyType(type: PropertyType): number {
  const entry = Object.entries(PROPERTY_TYPE_BY_TIPO_ID).find(([, value]) => value === type)
  return Number(entry?.[0] ?? 1)
}

/**
 * `tag_inmueble.id` → `CharacteristicKey`. Mismos ids que el seed del back.
 * NOTA: `apto-profesional` no existe en el back (y el id 4 del back,
 * "Balcón con vista abierta", se muestra como `balcon`).
 * TODO(db): sumar el tag "Apto profesional".
 */
const CHARACTERISTIC_BY_TAG_ID: Record<number, CharacteristicKey> = {
  1: 'mascotas',
  2: 'cochera',
  3: 'amoblado',
  4: 'balcon',
}

/** Traduce `inmueble.tags` a una característica; `null` si el id no tiene equivalente. */
export function characteristicFromTagId(tagId: number): CharacteristicKey | null {
  return CHARACTERISTIC_BY_TAG_ID[tagId] ?? null
}

/** `CharacteristicKey` → `tag_inmueble.id`; `null` si el back no tiene ese tag (`apto-profesional`). */
export function tagIdFromCharacteristic(key: CharacteristicKey): number | null {
  const entry = Object.entries(CHARACTERISTIC_BY_TAG_ID).find(([, value]) => value === key)
  return entry ? Number(entry[0]) : null
}

/**
 * `MisAlquileresItem.tipo_inmueble` (la descripción del tipo, ej.
 * "Departamento") → `PropertyType`. Una descripción desconocida se muestra
 * como departamento.
 */
function propertyTypeFromDescripcion(descripcion: string): PropertyType {
  const texto = descripcion.trim().toLowerCase()
  if (texto.startsWith('casa')) return 'casa'
  if (texto.startsWith('ph')) return 'ph'
  if (texto.startsWith('mono')) return 'monoambiente'
  return 'departamento'
}

// ─── Inmueble + Publicación → PropiedadResumen ──────────────────────────

/**
 * NOTA: el back guarda la capital como "Córdoba" (`inmueble.ciudad`) y el
 * front usa "Córdoba Capital" (el nombre del diseño y del filtro
 * preseleccionado). Sin esto, la búsqueda contra el back real saldría vacía.
 * TODO(db): acordar un catálogo de ciudades (id + nombre) en vez de texto libre.
 */
function normalizarCiudad(ciudad: string): string {
  return ciudad.trim().toLowerCase() === 'córdoba' ? 'Córdoba Capital' : ciudad
}

/** Los datos de la publicación que usa el resumen (vienen en `Publicacion` o en `InmuebleDetalleResponse.publicacion`). */
export type PublicacionResumen = Pick<Publicacion, 'titulo' | 'precio'> & { created_at?: string | Date }

/**
 * `Inmueble` + `Publicacion` → `PropiedadResumen` (tarjeta de `/buscar`, US-34).
 *
 * Campo por campo, lo que el back todavía no devuelve (TODO(backend) en
 * `docs/HANDOFF-BACKEND.md`, "Brechas contra la API actual"):
 * - `title`, `priceMonthly`: vienen de la publicación. `GET /inmuebles/disponibles`
 *   no la incluye; el service la busca aparte. Sin publicación: título =
 *   dirección y precio 0.
 * - `address`: aproximada ("calle al 400"), ver la NOTA de privacidad en direccion.ts.
 * - `province`: no existe en el back; se asume Córdoba (el piloto).
 *   TODO(db): columna `provincia` (en curso en `feature/registrar-usuario`).
 * - `neighborhoodSlug`/`neighborhoodName`: no hay barrio; se usa la ciudad.
 * - `expenses`: no existe; `null` (no se muestra "Sin expensas", que sería falso).
 * - `adjustmentIndex`: no existe; `null`.
 * - `availableFrom`: no existe; `null` (= disponible ya).
 * - `imageSrc` / `photoSrcs`: no hay fotos; {@link PLACEHOLDER_PHOTO_SRC}.
 * - `characteristics`: el back guarda UN tag (`tags: number`), no una lista.
 * - `status`: `/disponibles` solo devuelve publicadas; `'publicada'`.
 */
export function inmuebleToPropiedadResumen(inmueble: Inmueble, publicacion: PublicacionResumen | null): PropiedadResumen {
  const address = formatApproxAddress(inmueble.direccion, inmueble.numero)
  const characteristic = inmueble.tags ? characteristicFromTagId(inmueble.tags) : null
  const publishedAt = publicacion?.created_at ?? inmueble.created_at

  return {
    id: String(inmueble.id),
    title: publicacion?.titulo ?? address,
    address,
    province: 'Córdoba',
    city: normalizarCiudad(inmueble.ciudad),
    neighborhoodSlug: '',
    neighborhoodName: inmueble.ciudad,
    type: propertyTypeFromTipoId(inmueble.tipo),
    priceMonthly: publicacion?.precio ?? 0,
    expenses: null,
    bedrooms: inmueble.dormitorios,
    rooms: inmueble.ambientes,
    areaM2: inmueble.m2,
    adjustmentIndex: null,
    characteristics: characteristic ? [characteristic] : [],
    description: inmueble.descripcion ?? '',
    availableFrom: null,
    imageSrc: PLACEHOLDER_PHOTO_SRC,
    photoSrcs: [PLACEHOLDER_PHOTO_SRC],
    publishedAt: publishedAt ? new Date(publishedAt).toISOString() : '',
    status: 'publicada',
  }
}

// ─── MisAlquileresItem → PropiedadLocador (US-02) ───────────────────────

/**
 * `MisAlquileresItem` (respuesta de `GET /api/v1/mis-alquileres`) →
 * `PropiedadLocador` (fila de `/panel/propiedades`, US-02).
 *
 * Campo por campo, lo que el back todavía no devuelve:
 * - Solo trae las propiedades CON publicación; US-02 pide todas.
 * - `status`: se deduce de `estado_alquiler` y `publicacion.activa`
 *   (alquilado → `alquilada`; activa → `publicada`; si no, `pausada`).
 *   No hay "alquilada/publicada" ni fecha de disponibilidad.
 * - `tenantName`, `paymentStatus`, `paymentDueDate`, `daysOverdue`,
 *   `openClaims`, `nextAdjustment`: no existen. Se muestran vacíos ("—").
 * - `neighborhoodSlug`/`neighborhoodName`: no hay barrio; se usa la ciudad.
 * - `expenses`, `adjustmentIndex`: no existen; 0 y `null`.
 * - `imageSrc`: no hay fotos; {@link PLACEHOLDER_PHOTO_SRC}.
 */
export function misAlquileresItemToPropiedadLocador(item: MisAlquileresItem): PropiedadLocador {
  const alquilada = item.estado_alquiler === 'alquilado'
  const fecha = item.publicacion.fecha_publicacion
  return {
    id: String(item.id_inmueble),
    title: item.publicacion.titulo,
    address: item.piso ? `${item.direccion} ${item.numero}, ${item.piso}` : `${item.direccion} ${item.numero}`,
    neighborhoodSlug: '',
    neighborhoodName: normalizarCiudad(item.ciudad),
    type: propertyTypeFromDescripcion(item.tipo_inmueble),
    rooms: item.ambientes,
    status: alquilada ? 'alquilada' : item.publicacion.activa ? 'publicada' : 'pausada',
    priceMonthly: alquilada ? item.contrato.monto : item.publicacion.precio,
    expenses: 0,
    imageSrc: PLACEHOLDER_PHOTO_SRC,
    publishedAt: fecha ? new Date(fecha).toISOString() : '',
    tenantName: null,
    paymentStatus: null,
    paymentDueDate: null,
    daysOverdue: null,
    openClaims: 0,
    adjustmentIndex: null,
    nextAdjustment: null,
    availableFrom: null,
  }
}

// ─── PropiedadNueva → cuerpos del alta (US-01) ──────────────────────────

/**
 * Estado con que queda la propiedad del alta. Una alquilada CON fecha de
 * disponibilidad pasa a `alquilada_publicada`: se publica para el próximo
 * inquilino y aparece en `/buscar` con "Disponible desde" (US-02, US-34 y la
 * nota de `PropertyStatus`). Sin fecha queda `alquilada` y no se ve.
 */
export function estadoDePropiedadNueva(nueva: Pick<PropiedadNueva, 'status' | 'availableFrom'>): PropertyStatus {
  return nueva.status === 'alquilada' && nueva.availableFrom ? 'alquilada_publicada' : nueva.status
}

/** `true` si la propiedad del alta aparece en `/buscar` (publicada, o alquilada con fecha). */
export function seVeEnBusqueda(nueva: Pick<PropiedadNueva, 'status' | 'availableFrom'>): boolean {
  const estado = estadoDePropiedadNueva(nueva)
  return estado === 'publicada' || estado === 'alquilada_publicada'
}

/** Nombre del tipo para armar el título de la publicación ("Departamento de 2 ambientes"). */
const TYPE_TITLE: Record<PropiedadNueva['type'], string> = {
  departamento: 'Departamento',
  casa: 'Casa',
  ph: 'PH',
  monoambiente: 'Monoambiente',
}

/**
 * Título de la publicación armado con el tipo y los ambientes (Alta · 01:
 * "Con esto armamos el título de la publicación"): "Departamento de 2
 * ambientes", "Monoambiente", "Casa de 3 ambientes".
 */
export function tituloDePropiedadNueva(nueva: Pick<PropiedadNueva, 'type' | 'rooms'>): string {
  if (nueva.type === 'monoambiente') return TYPE_TITLE.monoambiente
  return `${TYPE_TITLE[nueva.type]} de ${nueva.rooms} ${nueva.rooms === 1 ? 'ambiente' : 'ambientes'}`
}

/**
 * `PropiedadNueva` → cuerpo de `POST /api/v1/inmuebles`.
 *
 * Lo que US-01 pide y el back todavía no recibe (se pierde al guardar):
 * provincia, barrio, superficie cubierta (`m2` = superficie total),
 * antigüedad, estado, disponibilidad, fotos, expensas, índice, periodicidad,
 * medios de pago, interés, días de gracia, depósito y duración. El precio va
 * en la publicación. De las características se manda solo la primera que el
 * back conoce (`tags` es un solo id).
 * TODO(backend): sumar esos campos (en curso en `feature/registrar-usuario`).
 */
export function propiedadNuevaToCrearInmueble(nueva: PropiedadNueva, idLocador: number): CrearInmuebleRequest {
  const tag = nueva.characteristics.map(tagIdFromCharacteristic).find((id): id is number => id !== null) ?? null
  return {
    tipo: tipoIdFromPropertyType(nueva.type),
    direccion: nueva.street.trim(),
    numero: nueva.streetNumber,
    piso: formatFloorUnit(nueva.floor, nueva.unit),
    // El back guarda la capital como "Córdoba" (ver normalizarCiudad).
    ciudad: nueva.city === 'Córdoba Capital' ? 'Córdoba' : nueva.city,
    ambientes: nueva.rooms,
    dormitorios: nueva.bedrooms,
    banos: nueva.bathrooms,
    m2: nueva.totalAreaM2,
    descripcion: nueva.description.trim() || null,
    tags: tag,
    id_locador: idLocador,
    servicios: null,
  }
}

/**
 * `PropiedadNueva` → cuerpo de `POST /api/v1/publicaciones`: el título y
 * el precio. `activa` = aparece en la búsqueda (publicada, o alquilada con
 * fecha de disponibilidad; pausada o alquilada sin fecha → inactiva).
 * TODO(backend): la publicación no guarda la fecha de disponibilidad: el
 * back no puede distinguir una "alquilada/publicada" (ver HANDOFF).
 */
export function propiedadNuevaToCrearPublicacion(nueva: PropiedadNueva, idInmueble: number): CrearPublicacionRequest {
  return {
    id_inmueble: idInmueble,
    titulo: tituloDePropiedadNueva(nueva),
    precio: nueva.priceMonthly,
    activa: seVeEnBusqueda(nueva),
  }
}
