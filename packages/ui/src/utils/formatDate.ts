import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

// Registro de plugin único a nivel de módulo — dayjs.extend es idempotente
// si el módulo se evalúa más de una vez (bundlers/HMR), así que es seguro acá.
dayjs.extend(relativeTime)

/**
 * Formatea una fecha en formato corto es-AR (`DD/MM/YYYY` por default).
 * Usa `.locale('es')` por instancia (no depende de que `packages/ui/src/locale.ts`
 * se haya importado antes en algún otro punto de la app).
 */
export function formatDate(date: string | Date, format = 'DD/MM/YYYY'): string {
  return dayjs(date).locale('es').format(format)
}

/** Formatea un período mensual con el mes capitalizado (ej. "Septiembre 2026"). */
export function formatPeriod(date: string | Date): string {
  const formatted = dayjs(date).locale('es').format('MMMM YYYY')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

/** Formatea una fecha en relativo respecto de ahora (ej. "hace 2 horas"). */
export function formatRelative(date: string | Date): string {
  return dayjs(date).locale('es').fromNow()
}
