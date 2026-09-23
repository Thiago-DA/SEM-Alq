import { StatCard, MoneyAmount } from '@rentar/ui'

const rowStyle = { display: 'flex', flexWrap: 'wrap' as const, gap: 16 }

/** Tres KPIs del panel del locador lado a lado: monto (con variación), cantidad y sin variación. */
export function Default() {
  return (
    <div style={rowStyle}>
      <StatCard title="Cobrado este mes" value={<MoneyAmount amount={470000} size="lg" emphasis />} delta={{ label: '+12% vs. mes anterior', trend: 'up' }} />
      <StatCard title="Propiedades publicadas" value="5" delta={{ label: '-1 vs. mes anterior', trend: 'down' }} />
      <StatCard title="Reclamos abiertos" value="2" delta={{ label: 'Sin cambios', trend: 'neutral' }} />
    </div>
  )
}
