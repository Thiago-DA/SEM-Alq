/**
 * /registro — Registrar usuario (US-19). Arquetipo A2 (AuthLayout).
 *
 * Diseño: Claude Design, "Autenticación" · 03 y 05. El paso 1 (elegir rol)
 * todavía no tiene diseño: ver la NOTA de `components/auth/RegistroForm.tsx`.
 * Entra desde: "Creá una gratis" / "Registrate" del login.
 *
 * Lee de la URL:
 * - `rol`: `locador` o `locatario` (rol con el que arranca el formulario).
 * - `next`: adónde se quería ir antes (validado con `safeNextPath`). Si iba
 *   a publicar una propiedad y no vino `rol`, arranca como locador.
 */
import { RegistroForm, type RolRegistro } from '@/components/auth/RegistroForm'
import { safeNextPath } from '@/lib/auth/redirect'

interface RegistroPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/** Rol inicial: el de `?rol=` si es válido; si no, locador si venía a publicar; si no, locatario. */
function initialRolFrom(rol: string | string[] | undefined, next: string | null): RolRegistro {
  if (rol === 'locador' || rol === 'locatario') return rol
  return next?.startsWith('/panel/propiedades') ? 'locador' : 'locatario'
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const params = await searchParams
  const next = safeNextPath(params.next)
  return <RegistroForm initialRol={initialRolFrom(params.rol, next)} next={next} />
}
