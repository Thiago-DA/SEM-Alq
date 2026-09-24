import { ThemeProvider, StatusTag, MoneyAmount, IndexBadge, StatCard } from '@rentar/ui'

const boxStyle = { display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: 16, padding: 16 }

/** Muestra de componentes reales resolviendo contra el tema: KPI, estado, monto e índice. */
function Muestra() {
  return (
    <>
      <StatCard title="Cobrado este mes" value={<MoneyAmount amount={470000} size="lg" emphasis />} delta={{ label: '+12% vs. mes anterior', trend: 'up' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StatusTag domain="contrato" status="vigente" />
        <StatusTag domain="cobro" status="pendiente" />
        <IndexBadge index="ICL" />
      </div>
    </>
  )
}

/**
 * Contenido representativo adentro del provider — no antd `Button`/`Tag`
 * importados directo (ese import se bundlea aparte del bundle real del
 * paquete, con su propio `ConfigProvider` de antd, así que saldría con el
 * azul default de antd en vez del de marca). Se usan en cambio dos
 * componentes reales de `@rentar/ui`, que sí resuelven contra este mismo
 * `ThemeProvider` cuando `dark` cambia.
 */
export function Default() {
  return (
    <ThemeProvider>
      <div style={boxStyle}>
        <Muestra />
      </div>
    </ThemeProvider>
  )
}

/** Mismo contenido en `dark` — ver la sección de tema oscuro de `StatusTag`. */
export function Oscuro() {
  return (
    <ThemeProvider dark>
      <div style={{ ...boxStyle, background: 'var(--rentar-color-bg-page)' }} data-rentar-theme="dark">
        <Muestra />
      </div>
    </ThemeProvider>
  )
}
