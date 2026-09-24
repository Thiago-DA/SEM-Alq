'use client'

/**
 * AppProviders.tsx — envoltorio cliente de los providers globales.
 *
 * Qué es: agrupa `NextBridgeProvider` (con los adaptadores reales de
 * `next/image`/`next/link`, ver `lib/next-bridge.tsx`), `AuthProvider`
 * (sesión, ver `lib/auth/AuthProvider.tsx`) y las herramientas de
 * desarrollo (`components/dev/DevTools.tsx`, solo fuera de producción).
 *
 * Existe como componente aparte — y no directo en `app/layout.tsx` — porque
 * `app/layout.tsx` es un Server Component: pasarle `ImageComponent`/
 * `LinkComponent` (referencias a función) directo a `NextBridgeProvider`
 * desde un Server Component rompe el build ("Functions cannot be passed
 * directly to Client Components"). Acá ambos lados del prop son cliente.
 *
 * Quién lo usa: `app/layout.tsx`, una sola vez.
 */
import type { ReactNode } from 'react'
import { NextBridgeProvider } from '@rentar/ui/src/providers/NextBridge'
import { DevTools } from '@/components/dev/DevTools'
import { AuthProvider } from './auth/AuthProvider'
import { AppImage, AppLink } from './next-bridge'

/** Providers globales de la app. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextBridgeProvider ImageComponent={AppImage} LinkComponent={AppLink}>
      <AuthProvider>
        {children}
        <DevTools />
      </AuthProvider>
    </NextBridgeProvider>
  )
}
