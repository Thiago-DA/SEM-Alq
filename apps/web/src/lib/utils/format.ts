/**
 * lib/utils/format.ts — formato del precio mensual ("$ 580.000 /mes").
 *
 * Quién lo usa: la `PropertyCard` y el `SearchBar` de la landing, y el catálogo.
 * Para montos sin "/mes", usar `formatARS` de `@rentar/ui`.
 */
const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/**
 * Formatea un monto mensual en pesos argentinos (ej. `580000` -> "$580.000 /mes").
 * Se usa en PropertyCard, SearchBar y DesignSystem.
 */
export function formatMonthlyPrice(amount: number): string {
  return `${currencyFormatter.format(amount)} /mes`
}
