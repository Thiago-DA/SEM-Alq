/**
 * /panel/propiedades/nueva — Publicar propiedad (US-01 Registrar mis propiedades).
 *
 * Qué es: el alta en 5 pasos. La pantalla vive en
 * `components/alta/AltaPropiedad.tsx`; acá solo se monta. El rol lo controla
 * `propiedades/layout.tsx` (solo locador) y la sesión, `proxy.ts` (US-01:
 * "se debe haber iniciado sesión").
 * Entra desde: "Publicar propiedad" del panel, del listado y del Header.
 */
import { AltaPropiedad } from '@/components/alta/AltaPropiedad'

/** Monta el alta de propiedad (US-01). */
export default function NuevaPropiedadPage() {
  return <AltaPropiedad />
}
