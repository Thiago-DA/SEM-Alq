import { FilterBar } from '@rentar/ui'

/** Barra de filtros de `/panel/propiedades` — buscador + los 4 estados reales de propiedad. */
export function Default() {
  return (
    <FilterBar
      searchValue=""
      onSearchChange={() => {}}
      searchPlaceholder="Buscar por dirección o barrio..."
      statusOptions={[
        { value: 'todas', label: 'Todas' },
        { value: 'publicada', label: 'Publicada' },
        { value: 'pausada', label: 'Pausada' },
        { value: 'alquilada', label: 'Alquilada' },
        { value: 'alquilada_publicada', label: 'Alquilada · publicada' },
      ]}
      statusValue="publicada"
      onStatusChange={() => {}}
      actions={
        <span
          style={{
            display: 'inline-block',
            padding: '0.375rem 1rem',
            borderRadius: 'var(--rentar-radius-pill)' as unknown as number,
            background: 'var(--rentar-color-blue)',
            color: '#fff',
            fontSize: '0.8125rem',
            fontWeight: 600,
          }}
        >
          + Nueva propiedad
        </span>
      }
    />
  )
}
