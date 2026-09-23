import type { StatusDomain, StatusDomainMap } from '@rentar/shared-types'
import { statusMeta } from '../tokens/status-meta'
import type { StatusMeta } from '../tokens/status-meta'

/**
 * Devuelve `{ label, colorKey, icon }` para un estado de un dominio dado,
 * tipado en función de `domain` (si `domain` es `'cobro'`, `status` solo
 * acepta `PaymentStatus`). Es la fuente que consume `StatusTag`.
 *
 * @example
 * getStatusMeta('contrato', 'pendiente_firma')
 * // -> { label: 'Pendiente de firma', colorKey: 'warning', icon: ClockCircleFilled }
 */
export function getStatusMeta<D extends StatusDomain>(
  domain: D,
  status: StatusDomainMap[D],
): StatusMeta {
  // TS no puede angostar un acceso indexado genérico (statusMeta[domain])
  // más allá de la unión de todos los dominios; el cast es seguro porque
  // StatusMetaMap ya garantiza, por construcción, que cada domain tiene
  // exactamente las claves de StatusDomainMap[D].
  const domainMeta = statusMeta[domain] as Record<StatusDomainMap[D], StatusMeta>
  return domainMeta[status]
}
