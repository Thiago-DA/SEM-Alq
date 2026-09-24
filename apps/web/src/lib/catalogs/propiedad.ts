/**
 * catalogs/propiedad.ts — textos fijos de una propiedad: tipos, índices,
 * periodicidad de ajuste, medios de pago y estados del alta.
 *
 * Qué es: catálogos (opciones de un select y sus textos visibles), no datos
 * de prueba. Un solo lugar para que "Departamento", "ICL anual" o
 * "MercadoPago · tarjeta de crédito" se escriban igual en todas las
 * pantallas.
 *
 * Quién lo usa: `/panel`, `/panel/propiedades` (US-02), el alta (US-01) y
 * los chips de `/buscar`.
 */
import type { AdjustmentIndex, EstadoPublicacionAlta, MedioPagoPreferido, PropertyType } from '@rentar/shared-types'

// ─── Tipos ──────────────────────────────────────────────────────────────

/** Texto de cada tipo (US-01: casa, departamento, monoambiente; más PH). */
export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  departamento: 'Departamento',
  casa: 'Casa',
  ph: 'PH',
  monoambiente: 'Monoambiente',
}

/** Opciones del select de tipo, en el orden del diseño. */
export const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = (
  ['departamento', 'casa', 'ph', 'monoambiente'] as const
).map((value) => ({ value, label: PROPERTY_TYPE_LABEL[value] }))

/** Tipo corto con ambientes, como lo muestra el listado: "Depto 3 amb", "Casa 3 amb", "Monoambiente". */
export function tipoCorto(type: PropertyType, rooms: number): string {
  if (type === 'monoambiente') return 'Monoambiente'
  const nombre = type === 'departamento' ? 'Depto' : PROPERTY_TYPE_LABEL[type]
  return `${nombre} ${rooms} amb`
}

// ─── Índices y periodicidad ─────────────────────────────────────────────

/** Nombre completo y quién publica cada índice (Alta · 04: "Todo término técnico se explica"). */
export const INDICE_INFO: Record<AdjustmentIndex, { nombre: string; publica: string; ayuda: string }> = {
  ICL: {
    nombre: 'Índice de Contratos de Locación',
    publica: 'el Banco Central',
    ayuda: 'Lo publica el Banco Central y mezcla sueldos e inflación. Suele subir un poco menos que los precios. Es el más usado en alquileres de vivienda.',
  },
  IPC: {
    nombre: 'Índice de Precios al Consumidor',
    publica: 'el INDEC',
    ayuda: 'Es la inflación que publica el INDEC. Acompaña más de cerca la suba de precios del mes.',
  },
}

/** "anual", "semestral", "cada 4 meses", "mensual". */
export function periodicidad(everyMonths: number): string {
  if (everyMonths === 12) return 'anual'
  if (everyMonths === 6) return 'semestral'
  if (everyMonths === 3) return 'trimestral'
  if (everyMonths === 1) return 'mensual'
  return `cada ${everyMonths} meses`
}

/** Opciones de "Cada cuánto se actualiza" (US-01: de 1 a 12 meses). */
export const AJUSTE_MESES_OPTIONS: { value: number; label: string }[] = Array.from({ length: 12 }, (_, index) => {
  const meses = index + 1
  return { value: meses, label: meses === 1 ? 'Cada 1 mes' : `Cada ${meses} meses` }
})

// ─── Medios de pago ─────────────────────────────────────────────────────

/** Recargo máximo que se le puede trasladar al locatario por medio de pago (Alta · 04). */
export const RECARGO_MAXIMO_PCT = 3

/** Los cuatro medios de pago del alta, con su explicación (Alta · 04). */
export const MEDIOS_PAGO: { method: MedioPagoPreferido; label: string; ayuda: string; simulado?: boolean }[] = [
  { method: 'transferencia', label: 'Transferencia bancaria', ayuda: 'El locatario transfiere y sube el comprobante. Vos confirmás.' },
  {
    method: 'mercadopago_debito',
    label: 'MercadoPago · dinero en cuenta o débito',
    ayuda: 'Se acredita al instante y el comprobante se genera solo.',
    // La pasarela todavía es simulada (US-13 es de otro sprint).
    simulado: true,
  },
  {
    method: 'mercadopago_credito',
    label: 'MercadoPago · tarjeta de crédito',
    ayuda: 'La pasarela te cobra comisión: podés trasladarla al locatario.',
    simulado: true,
  },
  { method: 'efectivo', label: 'Efectivo', ayuda: 'Se paga en mano y queda pendiente hasta que vos lo confirmes.' },
]

/** Texto corto de cada medio, para el resumen: "Transferencia", "MercadoPago crédito". */
export const MEDIO_PAGO_CORTO: Record<MedioPagoPreferido, string> = {
  transferencia: 'Transferencia',
  mercadopago_debito: 'MercadoPago débito',
  mercadopago_credito: 'MercadoPago crédito',
  efectivo: 'Efectivo',
}

// ─── Estado del alta ────────────────────────────────────────────────────

/** Estados que se eligen en el alta (US-01: "publicado, pausado o alquilado"), con su efecto. */
export const ESTADO_ALTA_OPTIONS: { value: EstadoPublicacionAlta; label: string }[] = [
  { value: 'publicada', label: 'Publicada' },
  { value: 'pausada', label: 'Pausada' },
  { value: 'alquilada', label: 'Alquilada' },
]
