/**
 * fechas.ts — "hoy" y cuentas de días para los textos relativos del panel.
 *
 * Qué es: un solo lugar para "vence en 5 días", "19 días de atraso" o "hace 2
 * días". Nada de eso se escribe fijo en los mocks: se calcula contra la
 * fecha real del navegador, que para el elenco es septiembre de 2026 (ver
 * `lib/mocks/README.md`, "Hoy es septiembre de 2026").
 *
 * Quién lo usa: la rama mock de `services/panel.service.ts` y
 * `services/propiedades.service.ts`, y las pantallas del panel para los
 * textos relativos.
 */
import dayjs, { type Dayjs } from 'dayjs'
import 'dayjs/locale/es'

/**
 * Hoy, a las 00:00 (así las cuentas de días no dependen de la hora).
 * NOTA: es la fecha real. Si el elenco se mira fuera de septiembre de 2026,
 * los vencimientos del mock cambian de estado solos (un pendiente pasa a
 * vencido); es a propósito: las fechas del elenco son fijas, "hoy" no.
 */
export function hoy(): Dayjs {
  return dayjs().startOf('day')
}

/** Días que faltan desde hoy hasta `fecha` (negativo si ya pasó). */
export function diasHasta(fecha: string): number {
  return dayjs(fecha).startOf('day').diff(hoy(), 'day')
}

/** Días que pasaron desde `fecha` hasta hoy (negativo si todavía no llegó). */
export function diasDesde(fecha: string): number {
  return -diasHasta(fecha)
}

/** `true` si `fecha` cae en el mes de hoy. */
export function esDelMesActual(fecha: string): boolean {
  return dayjs(fecha).isSame(hoy(), 'month')
}

/** Mes de hoy como "YYYY-MM" (el período de los cobros del panel). */
export function mesActual(): string {
  return hoy().format('YYYY-MM')
}

/** "en 5 días", "mañana", "hoy". Para fechas futuras o de hoy. */
export function textoEnDias(dias: number): string {
  if (dias <= 0) return 'hoy'
  if (dias === 1) return 'mañana'
  return `en ${dias} días`
}

/** "hace 2 días", "ayer", "hoy". Para fechas pasadas o de hoy. */
export function textoHaceDias(dias: number): string {
  if (dias <= 0) return 'hoy'
  if (dias === 1) return 'ayer'
  return `hace ${dias} días`
}

/** "1 día" / "19 días". */
export function textoDias(dias: number): string {
  return dias === 1 ? '1 día' : `${dias} días`
}

/** Fecha larga para el saludo: "Miércoles 23 de septiembre de 2026". */
export function fechaLarga(fecha: Dayjs = hoy()): string {
  const texto = fecha.locale('es').format('dddd D [de] MMMM [de] YYYY')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** Nombre del mes de una fecha ISO o "YYYY-MM", en minúscula: "septiembre". */
export function nombreMes(fecha: string): string {
  return dayjs(fecha).locale('es').format('MMMM')
}
