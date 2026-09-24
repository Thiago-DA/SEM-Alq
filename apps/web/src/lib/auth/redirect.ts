/**
 * redirect.ts — adónde volver después del login (US-39).
 *
 * Qué es: US-39 pide "redirigir al usuario a la página en la que se
 * encontraba antes de ingresar al portal de inicio de sesión". Esa página
 * viaja en `?next=` (la pone `proxy.ts`, o el link que lleva al login).
 *
 * Quién lo usa: `/login` y `/registro`.
 */

/**
 * Devuelve `next` solo si es una ruta interna segura; si no, `null`.
 *
 * NOTA: por seguridad solo se aceptan rutas que empiezan con una sola `/`.
 * Así un link armado como `/login?next=https://sitio-falso.com` (o
 * `//sitio-falso.com`, que el navegador toma como otro dominio) no puede
 * mandar al usuario afuera de RentAR después de loguearse ("open redirect").
 * Tampoco se vuelve a `/login` ni a `/registro`, para no entrar en un bucle.
 */
export function safeNextPath(next: string | string[] | undefined | null): string | null {
  if (typeof next !== 'string') return null
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return null
  if (next === '/login' || next.startsWith('/login?') || next === '/registro' || next.startsWith('/registro?')) return null
  return next
}
