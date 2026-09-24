'use client'

/**
 * ThemeProvider.tsx — tema de antd de RentAR (claro u oscuro) para previsualizar componentes fuera
 * de la app.
 *
 * En `apps/web` el tema lo pone `app/layout.tsx`; este provider lo usan las previews de
 * `/design-sync`.
 * Quién lo usa: las previews de Claude Design (`/design-sync`).
 */
import type { ReactNode } from 'react'
import { ConfigProvider } from 'antd'
import { antdTheme, antdThemeDark } from '../theme'
import { antdLocale } from '../locale'

/** Props de {@link ThemeProvider}. */
interface ThemeProviderProps {
  children: ReactNode
  /**
   * `true` aplica `antdThemeDark`. Reservado a `/design-system` y paneles
   * autenticados — la landing pública nunca pasa `dark` (ver CLAUDE.md).
   */
  dark?: boolean
}

/**
 * Envoltorio de `ConfigProvider` con el tema y el locale de RentAR ya
 * aplicados. `apps/web/src/app/layout.tsx` arma esto mismo a mano una sola
 * vez porque es un Server Component (no puede importar el barrel completo,
 * ver el comentario en `theme.ts`); este componente existe para cualquier
 * otro lugar que necesite el mismo `ConfigProvider` ya resuelto — en
 * particular, las previews aisladas que arma `/design-sync` (Claude
 * Design), que no pasan por `layout.tsx` y de otro modo renderizarían con
 * el tema default de antd (azul genérico) en vez del de marca.
 */
export function ThemeProvider({ children, dark = false }: ThemeProviderProps) {
  return (
    <ConfigProvider theme={dark ? antdThemeDark : antdTheme} locale={antdLocale}>
      {children}
    </ConfigProvider>
  )
}
