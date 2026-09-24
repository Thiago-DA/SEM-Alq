import { MoneyAmount } from '@rentar/ui'

/** Monto simple, tamaño medio (el default). */
export function Default() {
  return <MoneyAmount amount={470000} />
}

/** Los tres tamaños lado a lado — el eje de variante que más cambia la apariencia. */
export function Tamanos() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
      <MoneyAmount amount={470000} size="sm" />
      <MoneyAmount amount={470000} size="md" />
      <MoneyAmount amount={470000} size="lg" />
    </div>
  )
}

/** `emphasis` (dorado) reservado al monto principal de una vista, contra el mismo monto sin destacar. */
export function Destacado() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
      <MoneyAmount amount={528500} size="lg" emphasis />
      <MoneyAmount amount={528500} size="lg" />
    </div>
  )
}
