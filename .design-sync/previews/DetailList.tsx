import { DetailList, MoneyAmount, IndexBadge } from '@rentar/ui'

/** Resumen de un contrato real del elenco — dos columnas. */
export function Default() {
  return (
    <DetailList
      title="Contrato CT-2026-0148"
      column={2}
      items={[
        { label: 'Locador', value: 'Nicolás Arrieta' },
        { label: 'Locataria', value: 'Sofía Ledesma' },
        { label: 'Propiedad', value: 'Obispo Trejo 1250 7°B — Nueva Córdoba' },
        { label: 'Monto mensual', value: <MoneyAmount amount={470000} /> },
        { label: 'Expensas', value: <MoneyAmount amount={85000} /> },
        { label: 'Índice de ajuste', value: <IndexBadge index="ICL" /> },
        { label: 'Inicio', value: '01/04/2026' },
        { label: 'Fin', value: '31/03/2029' },
      ]}
    />
  )
}
