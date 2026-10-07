/**
 * /panel/mis-solicitudes — Mis solicitudes (US-36 Consultar solicitudes de
 * alquiler y US-38 Cancelar, numeración de Jira).
 *
 * Placeholder: la pantalla llega en la tanda 2 del Sprint 2. Existe para que
 * "Ver mis solicitudes" (éxito del modal, US-35) y "Ver en Mis solicitudes"
 * (detalle de la propiedad, US-41) no queden rotos.
 * Entra desde: el detalle de una propiedad ya solicitada y el éxito del
 * modal "Solicitar alquiler".
 */
import type { Metadata } from 'next'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'

/** Título de la pestaña del navegador (el layout raíz le suma "— RentAR"). */
export const metadata: Metadata = { title: 'Mis solicitudes' }

/** Placeholder de Mis solicitudes (tanda 2 del Sprint 2). */
export default function MisSolicitudesPage() {
  return <PlaceholderScreen title="Mis solicitudes" userStory="US-36 y US-38 Consultar y cancelar solicitudes" availableIn="la tanda 2 del Sprint 2" />
}
