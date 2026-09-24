/**
 * proxy.ts — protege `/panel/*`: sin sesión, manda a `/login` (US-39).
 *
 * Qué es: en Next.js 16, `middleware.ts` pasó a llamarse `proxy.ts` (y la
 * función exportada, `proxy`) — misma funcionalidad, nombre nuevo. Va dentro
 * de `src/` porque el proyecto usa `src/`.
 *
 * Solo verifica que exista la cookie de sesión, no el rol: qué ve cada rol
 * adentro del panel lo decide el layout del panel.
 *
 * `?next=` guarda adónde quería ir el usuario, para volver ahí después del
 * login (US-39: "redirigir a la página en la que se encontraba").
 *
 * NOTA: el proxy corre en el servidor, sin acceso a `localStorage` — por
 * eso la sesión simulada vive en una cookie (ver `lib/auth/session-cookie.ts`).
 */
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/lib/auth/session-cookie'

/** Rutas que pasan por el proxy: solo el panel. */
export const config = {
  matcher: ['/panel/:path*'],
}

/** Deja pasar si hay cookie de sesión; si no, redirige a `/login?next=<ruta pedida>`. */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.next()
  }
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.redirect(loginUrl)
}
