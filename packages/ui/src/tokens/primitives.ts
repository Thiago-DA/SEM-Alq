import { generate } from '@ant-design/colors'

/**
 * Colores de marca "semilla" (un solo tono por hue). Fuente de verdad de
 * `docs/DESIGN.md` — no cambiar sin actualizar el doc.
 */
export const seed = {
  blue: '#004D98',
  blueDark: '#003B74',
  gold: '#D7B15D',
  goldInk: '#8C6B1D',
  sky: '#A0D1EF',
  /** "Celeste Cordobés Claro" — tinte documentado en DESIGN.md, no un paso generado de `sky`. */
  skyLight: '#E3F2FB',
  ink: '#12202E',
  paper: '#F7F9FB',
} as const

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const

/** Escala de 10 pasos (50 más claro → 900 más oscuro) para un color semilla. */
export type ColorScale = Record<(typeof STEPS)[number], string>

/** Arma una `ColorScale` a partir de los 10 hex que devuelve `generate()` de antd. */
function toScale(hexes: string[]): ColorScale {
  const scale = {} as ColorScale
  STEPS.forEach((step, index) => {
    scale[step] = hexes[index] ?? seed.blue
  })
  return scale
}

/**
 * Escalas de color generadas con el algoritmo oficial de antd
 * (`@ant-design/colors`), no elegidas a mano, para que cada paso mantenga
 * la relación de luminancia/saturación que antd espera de un token de color.
 */
export const colorScales = {
  blue: toScale(generate(seed.blue)),
  gold: toScale(generate(seed.gold)),
  sky: toScale(generate(seed.sky)),
} as const

/**
 * Mismas escalas, recalculadas para fondo oscuro (usadas por el tema dark
 * del catálogo). Ojo: acá el índice va de oscuro (paso "50") a claro (paso
 * "900") — al revés que en `colorScales`, donde "50" es el más claro y
 * "900" el más oscuro. Es el propio algoritmo de antd para paletas dark
 * (optimiza para fondos oscuros con acentos claros), no un error de acá.
 */
export const darkColorScales = {
  blue: toScale(generate(seed.blue, { theme: 'dark' })),
  gold: toScale(generate(seed.gold, { theme: 'dark' })),
  sky: toScale(generate(seed.sky, { theme: 'dark' })),
} as const

/** Tipografía: una sola familia (League Spartan) en 5 escalones, igual a docs/DESIGN.md. */
export const typography = {
  fontFamily: "'League Spartan', system-ui, sans-serif",
  display: {
    fontSize: 'clamp(2.25rem, 4vw, 3rem)',
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: '-0.025em',
  },
  headline: {
    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.015em',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
} as const

/** Radios de borde. `pill` para todo botón/badge/chip; el resto para contenedores. */
export const radii = {
  pill: 9999,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const

/** Escala de espaciado (paddings, gaps, márgenes de sección). */
export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
} as const

/**
 * Sombras con nombre, tomadas literal de los valores ya usados en la landing
 * (no inventadas) para no introducir ningún cambio visual al tokenizarlas.
 */
export const shadows = {
  resting: '0 1px 2px 0 rgba(18, 32, 46, 0.05), 0 1px 3px 0 rgba(18, 32, 46, 0.06)',
  lifted: '0 10px 15px -3px rgba(18, 32, 46, 0.1), 0 4px 6px -4px rgba(18, 32, 46, 0.1)',
  button: '0 10px 25px -5px rgba(0, 77, 152, 0.35)',
  deep: '0 25px 50px -12px rgba(0, 77, 152, 0.2)',
  /** Sombra del panel de SearchBar — existía hardcodeada y sin nombre antes de este refactor. */
  form: '0 20px 25px -5px rgba(0, 77, 152, 0.1)',
} as const

/** Escala de z-index con nombre, para no repetir números mágicos. */
export const zIndex = {
  sticky: 50,
  stickySecondary: 40,
  decorative: 10,
} as const
