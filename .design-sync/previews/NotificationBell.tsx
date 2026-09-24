import { NotificationBell } from '@rentar/ui'

const notificacionesConNoLeidas = [
  { id: '1', title: 'Nuevo reclamo de Sofía Ledesma', date: new Date('2026-09-08T18:03:00-03:00'), read: false },
  { id: '2', title: 'Cobro de septiembre registrado', date: new Date('2026-09-05T09:00:00-03:00'), read: true },
  { id: '3', title: 'Solicitud aceptada: Julieta Peralta', date: new Date('2026-09-05T10:00:00-03:00'), read: true },
]

/** Con notificaciones sin leer — el badge muestra la cantidad. */
export function ConNoLeidas() {
  return <NotificationBell notifications={notificacionesConNoLeidas} />
}

/** Sin notificaciones pendientes — sin badge visible. */
export function SinPendientes() {
  return <NotificationBell notifications={notificacionesConNoLeidas.map((n) => ({ ...n, read: true }))} />
}
