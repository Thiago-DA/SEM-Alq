/**
 * /registro — Registrar usuario (US-19). Arquetipo A2 (AuthLayout).
 *
 * Diseño: Claude Design, "Autenticación" · 03a, 03 y 05.
 * Entra desde: "Creá una gratis" / "Registrate" del login.
 *
 * Lee de la URL:
 * - `rol`: `locador` o `locatario`. Solo PRESELECCIONA la tarjeta del paso 1;
 *   el paso 1 se muestra igual y la persona confirma con "Continuar".
 * - `next`: adónde se quería ir antes (validado con `safeNextPath`). Si iba
 *   a publicar una propiedad y no vino `rol`, se preselecciona locador.
 */
import { RegistroForm, type RolRegistro } from '@/components/auth/RegistroForm'
import { safeNextPath } from '@/lib/auth/redirect'

interface RegistroPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/** Tarjeta preseleccionada: la de `?rol=` si es válida; si no, locador si venía a publicar; si no, ninguna. */
function initialRolFrom(rol: string | string[] | undefined, next: string | null): RolRegistro | null {
  if (rol === 'locador' || rol === 'locatario') return rol
  return next?.startsWith('/panel/propiedades') ? 'locador' : null
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const params = await searchParams
  const next = safeNextPath(params.next)
  return <RegistroForm initialRol={initialRolFrom(params.rol, next)} next={next} />
}
