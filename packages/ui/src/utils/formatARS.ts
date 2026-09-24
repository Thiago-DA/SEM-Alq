/**
 * formatARS.ts — formato de montos en pesos argentinos ("$ 550.000").
 *
 * Quién lo usa: `MoneyAmount`, `PropertyCardBusqueda` y varias pantallas de `apps/web`.
 */
const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/**
 * Formatea un monto en pesos argentinos (ej. `formatARS(550000)` -> "$550.000").
 * Uso general para montos, cobros, KPIs — para el precio de alquiler
 * mensual de la landing, `apps/web` sigue usando su propio
 * `formatMonthlyPrice` (agrega el sufijo "/mes").
 */
export function formatARS(amount: number): string {
  return currencyFormatter.format(amount)
}
