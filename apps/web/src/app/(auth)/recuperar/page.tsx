/**
 * /recuperar — Recuperar contraseña (US-40 Recuperar contraseña). Arquetipo A2 (AuthLayout).
 *
 * Placeholder: la pantalla es del Sprint 2. Existe para que el link
 * "¿Olvidaste tu contraseña?" del login no quede roto.
 *
 * NOTA: no hay `(auth)/layout.tsx` compartido — `AuthLayout` recibe un
 * `title` distinto por página, así que cada página se envuelve en
 * `AuthLayout` directo.
 */
// Imports directos (no del barrel @rentar/ui): ese barrel también
// re-exporta statusMeta, que rompe el build en cualquier Server Component
// que lo importe (ver el comentario en app/layout.tsx).
import { AuthLayout } from '@rentar/ui/src/components/layouts/AuthLayout'
import { EmptyState } from '@rentar/ui/src/components/data/EmptyState'

/** Placeholder de Recuperar contraseña (US-40, otro sprint). */
export default function RecuperarPage() {
  return (
    <AuthLayout title="Recuperar contraseña" subtitle="Te enviamos un link a tu email.">
      <EmptyState title="En construcción" description="Esta pantalla llega en un próximo sprint (US-40 Recuperar contraseña)." />
    </AuthLayout>
  )
}
