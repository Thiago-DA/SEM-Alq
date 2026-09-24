import { ActivityTimeline } from '@rentar/ui'

/** Historial de un contrato: firma, cobros y un reclamo resuelto. */
export function Default() {
  return (
    <ActivityTimeline
      events={[
        { id: '1', title: 'Contrato firmado por las 3 partes', date: '2026-04-01T10:00:00-03:00', colorKey: 'success' },
        { id: '2', title: 'Cobro de abril registrado', description: '$470.000 — transferencia', date: '2026-04-05T09:00:00-03:00', colorKey: 'success' },
        { id: '3', title: 'Reclamo abierto: pérdida en la canilla de la cocina', date: '2026-06-12T16:30:00-03:00', colorKey: 'warning' },
        { id: '4', title: 'Reclamo resuelto', date: '2026-06-15T11:00:00-03:00', colorKey: 'success' },
        { id: '5', title: 'Cobro de septiembre registrado', description: '$470.000 — transferencia', date: '2026-09-05T09:00:00-03:00', colorKey: 'success' },
      ]}
    />
  )
}
