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
