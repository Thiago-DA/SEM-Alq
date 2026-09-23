'use client'

/**
 * DevTools.tsx — herramientas flotantes de desarrollo, en toda la app.
 *
 * Qué es: monta el `RoleSwitcher` de `@rentar/ui` con el botón "Reiniciar
 * datos de prueba", que borra lo creado en modo mock (cuentas, propiedades)
 * y vuelve al elenco original.
 *
 * Solo de desarrollo: no renderiza nada en producción, y `RoleSwitcher`
 * también se apaga solo con `NODE_ENV === 'production'`. Next.js reemplaza
 * `process.env.NODE_ENV` al compilar, así que en el build de producción este
 * código queda muerto.
 *
 * Quién lo usa: `lib/AppProviders.tsx`, una sola vez.
 */
import { RoleSwitcher } from '@rentar/ui'
import { resetMockData } from '@/services/shared/mockStore'

/** Botón flotante de desarrollo con "Reiniciar datos de prueba". */
export function DevTools() {
  if (process.env.NODE_ENV === 'production') return null

  // ─── Handlers ───────────────────────────────────────────────────────
  function handleReset(): void {
    resetMockData()
    // Recargar para que cada pantalla vuelva a leer el elenco desde cero.
    window.location.reload()
  }

  // ─── Render ─────────────────────────────────────────────────────────
  // NOTA: sin `role`/`onChange`, el RoleSwitcher no muestra su selector de
  // rol. Acá no tiene sentido: el rol real lo decide la sesión (US-39), y el
  // cambio de contexto vive en el UserMenu del panel.
  return <RoleSwitcher onResetMockData={handleReset} data-testid="dev-tools" />
}
