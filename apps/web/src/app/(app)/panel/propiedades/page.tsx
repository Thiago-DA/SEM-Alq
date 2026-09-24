/**
 * /panel/propiedades — Mis propiedades (US-02 Consultar mis propiedades).
 *
 * Qué es: el listado de todas las propiedades del locador en sesión, con
 * filtros por estado, barrio, tipo y reclamos. La pantalla vive en
 * `components/mis-propiedades/MisPropiedades.tsx`; acá solo se monta.
 * El rol lo controla `propiedades/layout.tsx` (solo locador).
 * Entra desde: el ítem "Propiedades" del menú del locador y "Ir a mis
 * propiedades" del alta.
 */
import { MisPropiedades } from '@/components/mis-propiedades/MisPropiedades'

export default function MisPropiedadesPage() {
  return <MisPropiedades />
}
