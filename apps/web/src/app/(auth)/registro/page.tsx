/**
 * /registro — Crear cuenta (US-19 Registrar usuario). Arquetipo A2 (AuthLayout).
 *
 * Placeholder temporal: el formulario real se implementa en la tanda
 * "Autenticación" del Sprint 1, con su vista de Claude Design.
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

export default function RegistroPage() {
  return (
    <AuthLayout title="Crear cuenta" subtitle="Registrate para alquilar o publicar.">
      <EmptyState title="En construcción" description='Esta pantalla llega en la tanda "Autenticación" del Sprint 1 (US-19 Registrar usuario).' />
    </AuthLayout>
  )
}
