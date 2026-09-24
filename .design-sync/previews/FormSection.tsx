import { FormSection, MoneyAmount } from '@rentar/ui'

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
 * Bloque "Condiciones económicas" del wizard de contrato — campos en HTML plano con tokens
 * `--rentar-*` (mismo criterio que `AuthLayout.tsx`: antd importado directo saldría sin el tema).
 */
export function Default() {
  return (
    <FormSection
      title="Condiciones económicas"
      description="Monto inicial, expensas e índice de ajuste del contrato CT-2026-0148."
    >
      <label style={labelStyle}>
        Monto mensual (ARS)
        <input style={fieldStyle} defaultValue="470.000" readOnly />
      </label>
      <label style={labelStyle}>
        Expensas (ARS)
        <input style={fieldStyle} defaultValue="85.000" readOnly />
      </label>
      <label style={labelStyle}>
        Índice de ajuste
        <input style={fieldStyle} defaultValue="ICL — cada 12 meses" readOnly />
      </label>
      <p style={{ margin: 0, fontSize: '0.8125rem' }}>
        Total del primer mes: <MoneyAmount amount={555000} size="sm" emphasis />
      </p>
    </FormSection>
  )
}
