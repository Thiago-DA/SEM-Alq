import { colorScales, seed } from './primitives'

/** Las 5 claves de color con significado (no ligadas a un dominio puntual). */
export type SemanticColorKey = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'money'

/** Tokens de color que cambian entre claro y oscuro. */
export interface SemanticColors {
  bgPage: string
  bgSurface: string
  bgSurfaceAlt: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  borderHairline: string
  success: string
  warning: string
  error: string
  info: string
  neutral: string
  /** Dorado — reservado a dinero (montos, pagos, suscripción). Ver "The Money-Is-Gold Rule". */
  money: string
  moneyInk: string
}

/** Modo claro: los mismos valores que ya usaba la landing (sin cambio visual). */
export const light: SemanticColors = {
  bgPage: seed.paper,
  bgSurface: '#ffffff',
  bgSurfaceAlt: seed.skyLight,
  textPrimary: seed.ink,
  textSecondary: 'rgba(18, 32, 46, 0.7)',
  textTertiary: 'rgba(18, 32, 46, 0.6)',
  borderHairline: 'rgba(18, 32, 46, 0.10)',
  success: '#166534',
  warning: '#92400E',
  error: '#9F1239',
  info: seed.blue,
  neutral: 'rgba(18, 32, 46, 0.5)',
  money: seed.gold,
  moneyInk: '#8C6B1D',
}

/**
 * Modo oscuro — solo se usa en `/design-system` y en `AppShell`/futuros
 * paneles, nunca en la landing pública (ver CLAUDE.md, regla de dark mode).
 */
export const dark: SemanticColors = {
  bgPage: '#0B1420',
  bgSurface: '#12202E',
  // Nota: en la escala "dark" de generate(), el índice va de oscuro (bajo)
  // a claro (alto) — al revés que en la escala "light" (donde 900 es el más
  // oscuro). Para evitar confundirlos, bgSurfaceAlt en dark es un literal a
  // mano, no un paso de darkColorScales.
  bgSurfaceAlt: '#16283A',
  textPrimary: '#F7F9FB',
  textSecondary: 'rgba(247, 249, 251, 0.72)',
  textTertiary: 'rgba(247, 249, 251, 0.58)',
  borderHairline: 'rgba(247, 249, 251, 0.12)',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#FB7185',
  info: colorScales.blue[400],
  neutral: 'rgba(247, 249, 251, 0.5)',
  // El dorado no cambia entre claro y oscuro (ver css-vars.css) — se
  // mantienen los mismos valores que en `light` a propósito.
  money: seed.gold,
  moneyInk: seed.goldInk,
}
