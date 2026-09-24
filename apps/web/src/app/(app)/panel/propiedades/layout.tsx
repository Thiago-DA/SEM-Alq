/**
 * (app)/panel/propiedades/layout.tsx — solo para el rol locador.
 *
 * Qué es: envuelve todas las rutas de `/panel/propiedades/*` (listado, alta
 * y detalle) en `RequireRole`: si el rol activo no es locador (una cuenta
 * locataria, o Sofía después de cambiar de contexto), vuelve a `/panel`.
 * Cubre: US-01 y US-02 ("se debe haber iniciado sesión" como locador).
 */
import type { ReactNode } from 'react'
import { RequireRole } from '@/components/auth/RequireRole'

/** Deja pasar solo al rol locador; si no, vuelve a `/panel`. */
export default function PropiedadesLayout({ children }: { children: ReactNode }) {
  return <RequireRole role="locador">{children}</RequireRole>
}
