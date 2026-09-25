/**
 * propiedades.service.ts — frontera con el backend para las propiedades.
 *
 * Qué es: todo lo que las pantallas piden sobre propiedades pasa por acá.
 * Cada función tiene dos ramas: la mock (activa hoy, datos del elenco de
 * `lib/mocks/`) y la llamada real a `apps/api`; el interruptor es
 * `NEXT_PUBLIC_USE_MOCKS` (ver `shared/config.ts`).
 * Cubre: US-34 Consultar propiedades a alquilar, US-02 Consultar mis
 * propiedades y US-01 Registrar mis propiedades.
 *
 * NOTA: `/buscar` y el panel llaman a este service desde el navegador (no
 * desde el servidor), así en modo mock también ven las propiedades creadas
 * en el alta, que viven en `localStorage` (ver `shared/mockStore.ts`).
 * Quién lo usa: la landing (`app/(public)/page.tsx`), `/buscar`, `/panel`,
 * `/panel/propiedades` y `/panel/propiedades/nueva`.
 */
import type {
  BusquedaFiltros,
  CreateFotoPayload,
  FotoNueva,
  Inmueble,
  MisAlquileresItem,
  OrdenBusqueda,
  Paginado,
  PropertyStatus,
  PropiedadLocador,
  PropiedadNueva,
  PropiedadResumen,
  UbicacionOpciones,
} from '@rentar/shared-types'
import { buscarEnLista, PAGE_SIZE, ubicacionesDe } from '@/lib/search/busqueda'
import { escribirBusqueda } from '@/lib/search/busquedaParams'
import { cobros as cobrosElenco, propiedades as propiedadesElenco, reclamos as reclamosElenco, type PropiedadMock } from '@/lib/mocks'
import { hoy } from '@/lib/utils/fechas'
import { isSearchable, propiedadMockToLocador, propiedadMockToResumen, propiedadNuevaToMock } from './adapters/propiedad-mock.adapter'
import {
  estadoDePropiedadNueva,
  inmuebleToPropiedadResumen,
  misAlquileresItemToPropiedadLocador,
  propiedadNuevaToCreateInmueble,
} from './adapters/propiedad.adapter'
import { apiRequest } from './shared/apiClient'
import type { InmuebleDetalleResponse } from './shared/backend-dtos'
import { USE_MOCKS } from './shared/config'
import { delay } from './shared/delay'
import { ServiceError } from './shared/errors'
import { readMockCollection, saveMockRecord } from './shared/mockStore'
import { requireSessionUserId } from './shared/session'

// ─── Helpers de la rama mock ────────────────────────────────────────────

/**
 * Todas las propiedades mock: el elenco más las creadas en el alta
 * (guardadas en el navegador).
 * NOTA: del lado del servidor devuelve solo el elenco (ver `shared/mockStore.ts`).
 */
function readPropiedadesMock(): PropiedadMock[] {
  return readMockCollection('propiedades', propiedadesElenco)
}

/**
 * Propiedades mock de un locador, ya como filas de US-02: cada una con su
 * cobro del período y sus reclamos abiertos (de `lib/mocks/panel.mock.ts`).
 * La comparte `panel.service.ts` para los conteos del panel.
 */
export function misPropiedadesMock(ownerId: string): PropiedadLocador[] {
  return readPropiedadesMock()
    .filter((propiedad) => propiedad.ownerId === ownerId)
    .map((propiedad) =>
      propiedadMockToLocador(propiedad, {
        cobro: cobrosElenco.find((cobro) => cobro.propertyId === propiedad.id) ?? null,
        openClaims: reclamosElenco.filter(
          (reclamo) => reclamo.propertyId === propiedad.id && (reclamo.status === 'abierto' || reclamo.status === 'en_proceso'),
        ).length,
      }),
    )
}

// ─── Búsqueda pública (US-34) ───────────────────────────────────────────

/**
 * US-34 Consultar propiedades a alquilar — todas las buscables, sin filtros
 * ni paginación (la landing filtra en el cliente y muestra una vista previa).
 * @backend GET /api/v1/inmuebles/disponibles   (existe · sin fotos, tags ni contrato)
 *          GET /api/v1/inmuebles/:id            (existe · se usa solo para los tags de cada una)
 * @returns PropiedadResumen[]
 * TODO(backend): que `/inmuebles/disponibles` incluya tags, foto principal y
 * expensas (del contrato). Mientras tanto se hace un pedido de detalle por
 * inmueble para los tags (N+1), que alcanza para pocos datos de prueba.
 */
export async function listarPropiedadesPublicadas(): Promise<PropiedadResumen[]> {
  if (USE_MOCKS) {
    await delay()
    return readPropiedadesMock().filter(isSearchable).map(propiedadMockToResumen)
  }
  return traerDisponiblesDelBack()
}

/**
 * Rama real: todas las disponibles del back, con sus tags.
 * Ver el TODO(backend) de {@link listarPropiedadesPublicadas} (N+1).
 *
 * NOTA: si falla el detalle de un inmueble, la tarjeta sale igual, sin
 * características: es mejor mostrar la propiedad que esconderla por un dato
 * secundario.
 */
async function traerDisponiblesDelBack(query?: Record<string, string | string[]>): Promise<PropiedadResumen[]> {
  const inmuebles = await apiRequest<Inmueble[]>('/inmuebles/disponibles', { query })
  const detalles = await Promise.all(
    inmuebles.map((inmueble) =>
      apiRequest<InmuebleDetalleResponse>(`/inmuebles/${inmueble.id}`).catch((): InmuebleDetalleResponse | null => null),
    ),
  )
  return inmuebles.map((inmueble, index) => {
    const detalle = detalles[index]
    return inmuebleToPropiedadResumen(inmueble, detalle ? { tags: detalle.tags ?? [] } : null)
  })
}

/** Pasa los query params de la búsqueda a un objeto para `apiRequest` (los repetidos, como lista). */
function queryDeBusqueda(filtros: BusquedaFiltros, orden: OrdenBusqueda, pagina: number): Record<string, string | string[]> {
  const params = escribirBusqueda({ filtros, orden, pagina })
  const query: Record<string, string | string[]> = { tamanioPagina: String(PAGE_SIZE) }
  for (const key of new Set(params.keys())) {
    const valores = params.getAll(key)
    query[key] = valores.length > 1 ? valores : valores[0]
  }
  return query
}

/**
 * US-34 Consultar propiedades a alquilar — la búsqueda de `/buscar`: filtros,
 * orden y una página de 10 resultados.
 * @backend GET /api/v1/inmuebles/disponibles   (existe · faltan filtros, orden y paginación)
 * @query   { provincia?, ciudad?, barrio[]?, precioMin?, precioMax?, tipo[]?, dorm[]?, amb[]?,
 *            m2Min?, m2Max?, tag[]?, indice?, orden?, pagina?, tamanioPagina? }
 *          (mismos nombres que la URL de /buscar, ver lib/search/busquedaParams.ts)
 * @returns Paginado<PropiedadResumen>
 * TODO(backend): aceptar esos query params y responder `{ items, page, pageSize, total }`.
 * NOTA: mientras tanto el back ignora los params y devuelve la lista entera:
 * se filtra, ordena y pagina acá, con las mismas reglas que el modo mock
 * (lib/search/busqueda.ts). Los params se mandan igual, para que el día que
 * el back los tome no haya que tocar el front.
 */
export async function buscarPropiedades(filtros: BusquedaFiltros, orden: OrdenBusqueda, pagina: number): Promise<Paginado<PropiedadResumen>> {
  if (USE_MOCKS) {
    await delay()
    const publicadas = readPropiedadesMock().filter(isSearchable).map(propiedadMockToResumen)
    return buscarEnLista(publicadas, filtros, orden, pagina)
  }
  // NOTA: respaldo mientras el back no pagine (ver el TODO(backend) de arriba).
  const disponibles = await traerDisponiblesDelBack(queryDeBusqueda(filtros, orden, pagina))
  return buscarEnLista(disponibles, filtros, orden, pagina)
}

/**
 * US-34 — cuántas propiedades da una combinación de filtros, sin traerlas
 * (el "Ver N propiedades" del Drawer de filtros en móvil, que se calcula
 * mientras se eligen los filtros, antes de aplicarlos).
 * @backend GET /api/v1/inmuebles/disponibles?…&tamanioPagina=1   (propuesto: se lee `total`)
 * @returns number
 */
export async function contarPropiedades(filtros: BusquedaFiltros): Promise<number> {
  const resultado = await buscarPropiedades(filtros, 'predeterminado', 1)
  return resultado.total
}

/**
 * US-34 — provincias, ciudades y barrios con propiedades publicadas (las
 * opciones de los filtros de ubicación).
 * @backend GET /api/v1/catalogos/ubicaciones   (no existe — propuesto)
 * @returns UbicacionOpciones
 * TODO(backend): crear la ruta (o sumar las ubicaciones a un catálogo general).
 * Mientras tanto se arman a partir de las propiedades disponibles.
 */
export async function listarUbicaciones(): Promise<UbicacionOpciones> {
  return ubicacionesDe(await listarPropiedadesPublicadas())
}

// ─── Mis propiedades (US-02) ────────────────────────────────────────────

/**
 * US-02 Consultar mis propiedades — TODAS las propiedades del locador en
 * sesión (alquiladas o no, publicadas o no), con locatario, estado del pago,
 * reclamos abiertos y próximo ajuste.
 * @backend GET /api/v1/mis-alquileres   (existe · token + rol locador; el locador sale del token)
 * @returns PropiedadLocador[]
 * TODO(backend): le faltan locatario, estado de pago, reclamos, próximo
 * ajuste y fecha de alta (ver `propiedad.adapter.ts#misAlquileresItemToPropiedadLocador`).
 * @throws {ServiceError} `unauthorized` sin sesión; `forbidden` si la cuenta no es locadora.
 *
 * NOTA: los filtros de US-02 (barrio, tipo, estado, reclamos) y la búsqueda
 * se aplican en el cliente (`lib/mis-propiedades/`): un locador tiene pocas
 * propiedades y la pantalla necesita la lista completa igual, para los
 * contadores de cada pestaña y para ofrecer solo los barrios de sus
 * propiedades. Si algún día hace falta, el back puede aceptar
 * `?barrio=&tipo=&estado=&reclamos=&q=` con esos mismos nombres.
 */
export async function listarMisPropiedades(): Promise<PropiedadLocador[]> {
  if (USE_MOCKS) {
    await delay()
    return misPropiedadesMock(requireSessionUserId())
  }
  const items = await apiRequest<MisAlquileresItem[]>('/mis-alquileres')
  return items.map(misAlquileresItemToPropiedadLocador)
}

// ─── Alta (US-01) ───────────────────────────────────────────────────────

/**
 * Lo que devuelve el alta: el id nuevo (para "Ver la publicación") y el
 * estado con que quedó (una alquilada con fecha queda `alquilada_publicada`).
 */
export interface PropiedadRegistrada {
  id: string
  status: PropertyStatus
}

/** Mensaje si el navegador no pudo guardar la propiedad en modo mock (por ejemplo, fotos muy pesadas). */
const MOCK_STORAGE_FULL_MESSAGE =
  'No pudimos guardar la propiedad en este navegador: se llenó el espacio de los datos de prueba. Probá con fotos más livianas o tocá "Reiniciar datos de prueba".'

/**
 * Mensaje mientras no exista el bucket de fotos en Supabase Storage.
 * NOTA: el back exige al menos 3 fotos con URL, así que sin bucket el alta
 * real no se puede guardar. Se avisa ANTES de mandar nada.
 */
export const FOTOS_NO_DISPONIBLES_MESSAGE =
  'Todavía no podemos guardar las fotos de las propiedades, así que por ahora el alta no se puede completar. Tus datos quedan en el borrador.'

/**
 * US-01 — sube una foto del alta a Supabase Storage y devuelve lo que el
 * back necesita para guardarla (URL pública, peso y formato).
 * @backend Supabase Storage, bucket `fotos-propiedades`, ruta `<auth.uid>/<archivo>`,
 *          con la sesión del usuario (no pasa por `apps/api`).
 * @returns CreateFotoPayload (sin `es_principal`: lo marca quien llama)
 * TODO(db): el bucket `fotos-propiedades` todavía no existe (la migración la
 * maneja Ivan por separado). Hasta entonces esta función avisa que no se
 * puede, sin intentar subir nada.
 * @throws {ServiceError} `server` con {@link FOTOS_NO_DISPONIBLES_MESSAGE}.
 */
export async function subirFotoPropiedad(foto: FotoNueva): Promise<Omit<CreateFotoPayload, 'es_principal'>> {
  void foto // se va a usar cuando exista el bucket (ver el TODO(db) de arriba)
  throw new ServiceError('server', FOTOS_NO_DISPONIBLES_MESSAGE)
}

/**
 * Sube todas las fotos del alta, en el orden en que se cargaron, y marca la
 * principal (US-01: "la primera, cambiable").
 */
async function subirFotosPropiedad(nueva: PropiedadNueva): Promise<CreateFotoPayload[]> {
  const subidas = await Promise.all(nueva.photos.map(subirFotoPropiedad))
  return subidas.map((foto, index) => ({ ...foto, es_principal: index === nueva.mainPhotoIndex }))
}

/**
 * US-01 Registrar mis propiedades — da de alta la propiedad del locador en
 * sesión con sus condiciones de contrato y sus fotos (publicada, pausada o
 * alquilada; alquilada con fecha de disponibilidad → alquilada/publicada).
 * @backend POST /api/v1/inmuebles   (existe · token + rol locador; el locador sale del token)
 * @body    CreateInmuebleCompletoPayload (lo arma `propiedadNuevaToCreateInmueble`)
 * @returns PropiedadRegistrada
 * @throws {ServiceError} `unauthorized` sin sesión (US-01: "se debe haber
 *   iniciado sesión"); `forbidden` si no es locador; `validation` si el back
 *   rechaza un dato; `server` si las fotos no se pueden subir.
 *
 * NOTA: primero se suben las fotos y después se manda el alta con sus URLs.
 * Si falla la subida, no se crea nada en la base.
 */
export async function registrarPropiedad(nueva: PropiedadNueva): Promise<PropiedadRegistrada> {
  if (USE_MOCKS) {
    await delay(900)
    const ownerId = requireSessionUserId()
    const propiedad = propiedadNuevaToMock(nueva, {
      id: `prop-${Date.now()}`,
      ownerId,
      publishedAt: hoy().format('YYYY-MM-DD'),
    })
    if (!saveMockRecord('propiedades', propiedad)) {
      throw new ServiceError('server', MOCK_STORAGE_FULL_MESSAGE)
    }
    return { id: propiedad.id, status: propiedad.status }
  }

  const fotos = await subirFotosPropiedad(nueva)
  const inmueble = await apiRequest<Inmueble>('/inmuebles', { method: 'POST', body: propiedadNuevaToCreateInmueble(nueva, fotos) })
  return { id: String(inmueble.id), status: estadoDePropiedadNueva(nueva) }
}

// ─── Publicar o pausar (otro sprint) ────────────────────────────────────

/**
 * Publicar o pausar propiedad (sin US en Sprint 0, mapa US-40) — cambia el
 * estado de la publicación.
 * @backend PATCH /api/v1/inmuebles/:id/publicacion   (no existe — propuesto) body { activa: boolean }
 * @returns void
 *
 * NOTA: todavía no la usa ninguna pantalla. US-02 no pide acciones en el
 * listado: pausar, publicar y eliminar viven en el detalle de la propiedad,
 * que es del sprint de US-03 y US-04. Queda lista (y probada en mock)
 * para ese sprint.
 */
export async function cambiarEstadoPublicacion(propiedadId: string, estado: 'publicada' | 'pausada'): Promise<void> {
  if (USE_MOCKS) {
    await delay()
    const ownerId = requireSessionUserId()
    const propiedad = readPropiedadesMock().find((item) => item.id === propiedadId && item.ownerId === ownerId)
    if (!propiedad) throw new ServiceError('not_found', 'No encontramos esa propiedad entre las tuyas.')
    if (propiedad.status === 'alquilada' || propiedad.status === 'alquilada_publicada') {
      throw new ServiceError('validation', 'Una propiedad alquilada no se puede publicar ni pausar desde acá.')
    }
    if (!saveMockRecord('propiedades', { ...propiedad, status: estado })) {
      throw new ServiceError('server', MOCK_STORAGE_FULL_MESSAGE)
    }
    return
  }
  await apiRequest<void>(`/inmuebles/${encodeURIComponent(propiedadId)}/publicacion`, { method: 'PATCH', body: { activa: estado === 'publicada' } })
}
