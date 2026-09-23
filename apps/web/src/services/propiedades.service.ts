/**
 * propiedades.service.ts — frontera con el backend para las propiedades.
 *
 * Qué es: todo lo que las pantallas piden sobre propiedades pasa por acá.
 * Cada función tiene dos ramas: la mock (activa hoy, datos del elenco de
 * `lib/mocks/`) y la llamada real a `apps/api`; el interruptor es
 * `NEXT_PUBLIC_USE_MOCKS` (ver `shared/config.ts`).
 * Cubre: US-34 Consultar propiedades a alquilar. (US-01 y US-02 se suman en
 * la tanda "Locador".)
 * Quién lo usa: la landing (`app/(public)/page.tsx`) y `/buscar`.
 */
import type { Inmueble, PropiedadResumen } from '@rentar/shared-types'
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

  const inmuebles = await apiRequest<Inmueble[]>('/inmuebles/disponibles')
  const detalles = await Promise.all(
    inmuebles.map((inmueble) => apiRequest<InmuebleDetalleResponse>(`/inmuebles/${inmueble.id}`)),
  )
  return inmuebles.map((inmueble, index) => inmuebleToPropiedadResumen(inmueble, detalles[index]?.publicacion ?? null))
}
