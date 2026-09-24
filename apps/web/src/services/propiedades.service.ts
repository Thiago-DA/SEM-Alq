/**
 * propiedades.service.ts — frontera con el backend para las propiedades.
 *
 * Qué es: todo lo que las pantallas piden sobre propiedades pasa por acá.
 * Cada función tiene dos ramas: la mock (activa hoy, datos del elenco de
 * `lib/mocks/`) y la llamada real a `apps/api`; el interruptor es
 * `NEXT_PUBLIC_USE_MOCKS` (ver `shared/config.ts`).
 * Cubre: US-34 Consultar propiedades a alquilar. (US-01 y US-02 se suman en
 * la tanda "Locador".)
 *
 * NOTA: `/buscar` llama a este service desde el navegador (no desde el
 * servidor), así en modo mock también ve las propiedades creadas en el alta,
 * que viven en `localStorage` (ver `shared/mockStore.ts`).
 * Quién lo usa: la landing (`app/(public)/page.tsx`) y `/buscar`.
 */
import type { BusquedaFiltros, Inmueble, OrdenBusqueda, Paginado, PropiedadResumen, UbicacionOpciones } from '@rentar/shared-types'
import { buscarEnLista, PAGE_SIZE, ubicacionesDe } from '@/lib/search/busqueda'
import { escribirBusqueda } from '@/lib/search/busquedaParams'
import { propiedades as propiedadesElenco, type PropiedadMock } from '@/lib/mocks'
import { isSearchable, propiedadMockToResumen } from './adapters/propiedad-mock.adapter'
import { inmuebleToPropiedadResumen } from './adapters/propiedad.adapter'
import { apiRequest } from './shared/apiClient'
import type { InmuebleDetalleResponse } from './shared/backend-dtos'
import { USE_MOCKS } from './shared/config'
import { delay } from './shared/delay'
import { readMockCollection } from './shared/mockStore'

// ─── Helpers de la rama mock ────────────────────────────────────────────

/**
 * Todas las propiedades mock: el elenco más las creadas en el alta
 * (guardadas en el navegador).
 * NOTA: del lado del servidor devuelve solo el elenco (ver `shared/mockStore.ts`).
 */
function readPropiedadesMock(): PropiedadMock[] {
  return readMockCollection('propiedades', propiedadesElenco)
}

// ─── Funciones públicas ─────────────────────────────────────────────────

/**
 * US-34 Consultar propiedades a alquilar — todas las buscables, sin filtros
 * ni paginación (la landing filtra en el cliente y muestra una vista previa).
 * @backend GET /api/v1/inmuebles/disponibles   (existe · no devuelve la publicación: precio y título)
 *          GET /api/v1/inmuebles/:id            (existe · se usa para traer la publicación de cada una)
 * @returns PropiedadResumen[]
 * TODO(backend): que `/inmuebles/disponibles` incluya la publicación de cada
 * inmueble (precio, título, fecha). Mientras tanto se hace un pedido de
 * detalle por inmueble (N+1), que alcanza para pocos datos de prueba.
 */
export async function listarPropiedadesPublicadas(): Promise<PropiedadResumen[]> {
  if (USE_MOCKS) {
    await delay()
    return readPropiedadesMock().filter(isSearchable).map(propiedadMockToResumen)
  }
  return traerDisponiblesDelBack()
}

/**
 * Rama real: todas las disponibles del back, con su publicación.
 * Ver el TODO(backend) de {@link listarPropiedadesPublicadas} (N+1).
 */
async function traerDisponiblesDelBack(query?: Record<string, string | string[]>): Promise<PropiedadResumen[]> {
  const inmuebles = await apiRequest<Inmueble[]>('/inmuebles/disponibles', { query })
  const detalles = await Promise.all(
    inmuebles.map((inmueble) => apiRequest<InmuebleDetalleResponse>(`/inmuebles/${inmueble.id}`)),
  )
  return inmuebles.map((inmueble, index) => inmuebleToPropiedadResumen(inmueble, detalles[index]?.publicacion ?? null))
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
 * Mientras tanto el back ignora los params y devuelve una lista: en ese caso
 * se filtra, ordena y pagina acá, con las mismas reglas (lib/search/busqueda.ts).
 */
export async function buscarPropiedades(filtros: BusquedaFiltros, orden: OrdenBusqueda, pagina: number): Promise<Paginado<PropiedadResumen>> {
  if (USE_MOCKS) {
    await delay()
    const publicadas = readPropiedadesMock().filter(isSearchable).map(propiedadMockToResumen)
    return buscarEnLista(publicadas, filtros, orden, pagina)
  }
  // NOTA: respaldo mientras el back no pagine (ver el TODO de arriba).
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
