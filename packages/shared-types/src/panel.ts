/**
 * panel.ts — lo que muestra `/panel`, el inicio del locador.
 *
 * Qué es: TIPOS DE VISTA DEL FRONT. El panel junta datos de varios módulos
 * (cobros, reclamos, contratos, solicitudes) que en el back viven en tablas
 * distintas y que, en su mayoría, son de sprints futuros. Cada bloque del
 * panel se pide por separado, así si falla uno, falla solo ese bloque
 * (Claude Design, "Panel de inicio" · 03).
 *
 * Quién lo usa: `apps/web/src/services/panel.service.ts` y la página
 * `/panel` (sin US en Sprint 0: es el inicio del locador, mapa A3).
 */
import type { AdjustmentIndex } from './propiedad'
import type { ClaimStatus, ContractStatus, PaymentStatus, UserRole } from './status'

/** Un cobro del período actual de un alquiler ("Próximos cobros"). */
export interface CobroPanel {
  id: string
  propertyId: string
  /** Dirección exacta de la propiedad, ej. "Laprida 340". */
  propertyAddress: string
  tenantName: string
  amount: number
  /** Fecha ISO de vencimiento. */
  dueDate: string
  status: Extract<PaymentStatus, 'pendiente' | 'pagado' | 'vencido'>
  /** Fecha ISO en que se acreditó; solo si está pagado. */
  paidAt: string | null
}

/** Bloque "cobros" del panel: los montos del mes y los próximos cobros. */
export interface ResumenCobros {
  /** Mes del resumen, "YYYY-MM". */
  month: string
  /** Suma de lo cobrado en el mes. */
  collected: number
  /** Suma de todo lo que se tiene que cobrar en el mes. */
  total: number
  /** Suma de los cobros vencidos sin pagar. */
  overdueAmount: number
  overdueCount: number
  /** Ordenados como pide el diseño: vencidos, pendientes por fecha, pagados al final. */
  items: CobroPanel[]
}

/** Un reclamo de un locatario ("Reclamos recientes"). */
export interface ReclamoPanel {
  id: string
  title: string
  status: ClaimStatus
  propertyAddress: string
  tenantName: string
  /** Fecha ISO de creación. */
  createdAt: string
  /** Fecha ISO de la última respuesta del locador; `null` = sin responder. */
  answeredAt: string | null
}

/** Bloque "reclamos" del panel. */
export interface ResumenReclamos {
  /** Reclamos sin resolver (abiertos o en proceso). */
  open: number
  /** De los abiertos, cuántos no tienen respuesta del locador. */
  unanswered: number
  /** Los más recientes, del más nuevo al más viejo. */
  recent: ReclamoPanel[]
}

/**
 * Un contrato con un ajuste o un vencimiento en los próximos 60 días. Si un
 * contrato tiene los dos, se muestra una sola tarjeta con el más cercano.
 */
export interface EventoContratoPanel {
  contractId: string
  propertyAddress: string
  tenantName: string
  kind: 'ajuste' | 'vencimiento'
  /** Fecha ISO del evento. */
  date: string
  contractStatus: ContractStatus
  /** Solo para `ajuste`. */
  index: AdjustmentIndex | null
  /** Solo para `ajuste`: cada cuántos meses se ajusta. */
  everyMonths: number | null
  /** Monto actual del alquiler. */
  currentAmount: number
}

/** Bloque "solicitudes" del panel: solicitudes de alquiler sin responder. */
export interface SolicitudPanel {
  id: string
  applicantName: string
  propertyAddress: string
  /** Fecha ISO en que llegó. */
  createdAt: string
}

/**
 * Lo que muestra cada fila de "Viendo como" del UserMenu (Cambio de rol ·
 * 04), para las cuentas con dos roles.
 */
export interface ResumenContextoRol {
  role: Extract<UserRole, 'locador' | 'locatario'>
  /** Segunda línea de la fila, ej. "1 propiedad · 1 cobro vencido". */
  description: string
  /** Contador rojo cuando ese rol NO es el activo (ej. cobros vencidos del locador). */
  pendingCount: number
}
