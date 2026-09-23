import { AuthLayout } from '@rentar/ui'

const fieldStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box' as const,
  marginTop: 4,
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--rentar-radius-sm)' as unknown as number,
  border: '1px solid var(--rentar-color-border-hairline)',
  fontSize: '0.875rem',
}

const labelStyle = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 12 }

/**
 * Form de login — inputs y botón en HTML plano (no `antd` importado directo:
 * ese bundle quedaría separado del `ConfigProvider` real del paquete y
 * saldría sin el tema de marca), estilado con los tokens `--rentar-*`.
 */
export function Default() {
  return (
    <AuthLayout title="Iniciar sesión" subtitle="Entrá con tu cuenta de RentAR" compact>
      <form>
        <label style={labelStyle}>
          Email
          <input style={fieldStyle} type="email" defaultValue="nicolas.arrieta@example.com" readOnly />
        </label>
        <label style={labelStyle}>
          Contraseña
          <input style={fieldStyle} type="password" defaultValue="••••••••" readOnly />
        </label>
        <button
          type="button"
          style={{
            width: '100%',
            padding: '0.625rem',
            borderRadius: 'var(--rentar-radius-pill)' as unknown as number,
            border: 'none',
            background: 'var(--rentar-color-blue)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Entrar
        </button>
      </form>
    </AuthLayout>
  )
}
