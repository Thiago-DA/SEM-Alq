import { PublicLayout } from '@rentar/ui'

/** Header + contenido + Footer — el armazón de toda página pública. */
export function Default() {
  return (
    <PublicLayout>
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 12px', fontSize: '1.75rem' }}>Alquilá directo, sin inmobiliaria</h1>
        <p style={{ margin: 0, color: 'var(--rentar-color-text-secondary)' }}>Contratos, cobros y reclamos entre locador, locatario y garante, en un solo lugar. Piloto en Córdoba.</p>
      </div>
    </PublicLayout>
  )
}
