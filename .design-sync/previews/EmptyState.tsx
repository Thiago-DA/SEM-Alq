import { EmptyState } from '@rentar/ui'

/** Sin reclamos abiertos — con acción sugerida. */
export function Default() {
  return (
    <EmptyState
      title="Sin reclamos abiertos"
      description="Cuando un locatario abra un reclamo sobre uno de tus contratos, vas a verlo acá."
      action={
        <span style={{ color: 'var(--rentar-color-blue)', fontWeight: 600, cursor: 'pointer' }}>Ver contratos vigentes</span>
      }
    />
  )
}
