/**
 * /login — Iniciar sesión (US-39 Iniciar y cerrar sesión). Arquetipo A2 (AuthLayout).
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

export default function LoginPage() {
  return (
    <AuthLayout title="Iniciar sesión" subtitle="Entrá con tu email y contraseña.">
      <EmptyState title="En construcción" description='Esta pantalla llega en la tanda "Autenticación" del Sprint 1 (US-39 Iniciar y cerrar sesión).' />
    </AuthLayout>
  )
}
