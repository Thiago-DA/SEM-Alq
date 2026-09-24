import { PageHeader } from '@rentar/ui'

/** Encabezado de una pantalla del panel — breadcrumb, título, subtítulo y acción. */
export function Default() {
  return (
    <PageHeader
      title="Obispo Trejo 1250 7°B"
      subtitle="Nueva Córdoba — publicada el 12/03/2026"
      breadcrumb={[{ label: 'Propiedades', href: '#' }, { label: 'Obispo Trejo 1250 7°B' }]}
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
          Editar
        </span>
      }
    />
  )
}
