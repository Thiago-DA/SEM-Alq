import { IndexBadge } from '@rentar/ui'

/** Los dos índices de ajuste que usa RentAR — IPC e ICL. */
export function Default() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <IndexBadge index="IPC" />
      <IndexBadge index="ICL" />
    </div>
  )
}
