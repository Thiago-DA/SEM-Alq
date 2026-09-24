/**
 * theme.ts — tema de antd de RentAR (claro y oscuro), armado con los tokens.
 *
 * Quién lo usa: `apps/web/src/app/layout.tsx`, `ThemeProvider` y el catálogo.
 */
import { theme as antdThemeApi, type ThemeConfig } from 'antd'
// Importa directo de los archivos de primitives/semantic (no del barrel
// ./tokens) a propósito: ese barrel también re-exporta statusMeta, que
// importa @ant-design/icons (usa Context de React). theme.ts lo consume el
// layout raíz, un Server Component, donde Context no está disponible —
// pasar por el barrel rompería el build con "createContext is not a
// function" aunque este archivo no use statusMeta para nada.
import { colorScales, radii, seed, shadows, typography } from './tokens/primitives'
import { light, dark } from './tokens/semantic'

/**
 * Paleta de marca "plana" (compatibilidad con código existente que importa
 * `brand` en vez de los tokens nuevos). Valores literales de `seed`, no
 * derivados de `colorScales` — son los mismos 8 hex exactos que ya
 * documentaba DESIGN.md antes de este refactor, y no tienen por qué
 * coincidir con ningún paso generado algorítmicamente. Nuevo código debería
 * preferir `import { seed, colorScales, light, dark } from '@rentar/ui'`.
 */
export const brand = {
  blue: seed.blue,
  blueDark: seed.blueDark,
  gold: seed.gold,
  goldInk: seed.goldInk,
  sky: seed.sky,
  skyLight: seed.skyLight,
  ink: seed.ink,
  paper: seed.paper,
} as const

/**
 * Tema claro (`ConfigProvider`), con `cssVar: true`: además de aplicarse a
 * los componentes de antd, expone cada token como `var(--ant-*)` en el DOM,
 * así los `.module.css` propios pueden consumirlos en vez de hardcodear
 * colores/radios (ver docs/DESIGN.md).
 */
export const antdTheme: ThemeConfig = {
  cssVar: { key: 'rentar' },
  token: {
    colorPrimary: brand.blue,
    colorPrimaryHover: brand.blueDark,
    colorPrimaryActive: brand.blueDark,
    colorInfo: light.info,
    colorSuccess: light.success,
    colorWarning: light.warning,
    colorError: light.error,
    colorLink: brand.blue,
    colorLinkHover: brand.blueDark,
    colorText: light.textPrimary,
    colorTextSecondary: light.textSecondary,
    // Antes del refactor a tokens, colorTextTertiary ya estaba hardcodeado
    // igual a colorTextSecondary (los dos en 0.7) — se mantiene así acá para
    // no cambiar nada visual en la landing. light.textTertiary (0.6, un
    // paso más claro) es el valor correcto para componentes nuevos y se usa
    // directo donde haga falta, fuera de este token puntual de antd.
    colorTextTertiary: light.textSecondary,
    colorBgLayout: light.bgPage,
    colorBgContainer: light.bgSurface,
    colorBorder: light.borderHairline,
    colorBorderSecondary: 'rgba(18, 32, 46, 0.05)',
    fontFamily: typography.fontFamily,
    borderRadius: radii.md,
    fontSize: 16,
  },
  components: {
    Button: {
      borderRadius: radii.pill,
      borderRadiusLG: radii.pill,
      borderRadiusSM: radii.pill,
      controlHeight: 44,
      controlHeightLG: 48,
      paddingInline: 24,
      paddingInlineLG: 24,
      fontWeight: 600,
      primaryShadow: shadows.button,
      defaultShadow: 'none',
    },
    Card: {
      borderRadiusLG: radii.lg,
      boxShadowTertiary: shadows.resting,
      paddingLG: 16,
    },
    Input: {
      borderRadius: radii.sm,
      colorBgContainer: light.bgPage,
      activeBorderColor: brand.blue,
      hoverBorderColor: brand.blue,
    },
    Select: {
      borderRadius: radii.sm,
      colorBgContainer: light.bgPage,
      optionSelectedBg: brand.skyLight,
    },
    Slider: {
      // #e2e8f0 (gris slate) es intencional: no forma parte de la paleta de
      // marca, pero es el valor que ya usaba SearchBar — cambiarlo acá
      // alteraría visualmente el slider de precio de la landing.
      railBg: '#e2e8f0',
      railHoverBg: '#e2e8f0',
      trackBg: brand.blue,
      trackHoverBg: brand.blueDark,
      handleColor: brand.blue,
      handleActiveColor: brand.blue,
      dotActiveBorderColor: brand.blue,
    },
    Drawer: {
      colorBgElevated: light.bgSurface,
    },
    Layout: {
      headerBg: 'rgba(247, 249, 251, 0.9)',
      bodyBg: light.bgPage,
      footerBg: light.bgSurface,
      siderBg: light.bgSurface,
    },
    Table: {
      headerBg: brand.skyLight,
      headerColor: light.textPrimary,
      rowHoverBg: brand.skyLight,
      borderRadius: radii.lg,
    },
    Tabs: {
      inkBarColor: brand.blue,
      itemSelectedColor: brand.blue,
      itemHoverColor: brand.blueDark,
    },
    Menu: {
      itemBorderRadius: radii.sm,
      itemSelectedBg: brand.skyLight,
      itemSelectedColor: brand.blue,
      itemHoverBg: brand.skyLight,
    },
    Form: {
      labelColor: light.textPrimary,
      labelFontSize: 14,
    },
    Modal: {
      borderRadiusLG: radii.lg,
    },
    Tag: {
      defaultBg: brand.skyLight,
      defaultColor: light.textPrimary,
    },
    Descriptions: {
      labelColor: light.textSecondary,
      contentColor: light.textPrimary,
      titleColor: light.textPrimary,
    },
    Segmented: {
      itemSelectedBg: light.bgSurface,
      itemSelectedColor: brand.blue,
      trackBg: brand.skyLight,
    },
    Steps: {
      colorPrimary: brand.blue,
    },
    Badge: {
      colorError: light.error,
    },
    Avatar: {
      colorTextPlaceholder: colorScales.blue[300],
    },
  },
}

/**
 * Tema oscuro — **solo** para `/design-system` y componentes de panel
 * nuevos (`AppShell`, etc.). La landing pública nunca usa este tema (ver
 * CLAUDE.md): así se cumple "implementar dark mode ahora" sin arriesgar un
 * cambio visual en la landing, que tiene que quedar pixel-igual.
 */
export const antdThemeDark: ThemeConfig = {
  ...antdTheme,
  algorithm: antdThemeApi.darkAlgorithm,
  token: {
    ...antdTheme.token,
    colorPrimary: colorScales.blue[400],
    colorInfo: dark.info,
    colorSuccess: dark.success,
    colorWarning: dark.warning,
    colorError: dark.error,
    colorText: dark.textPrimary,
    colorTextSecondary: dark.textSecondary,
    colorTextTertiary: dark.textTertiary,
    colorBgLayout: dark.bgPage,
    colorBgContainer: dark.bgSurface,
    colorBorder: dark.borderHairline,
    colorBorderSecondary: 'rgba(247, 249, 251, 0.06)',
  },
  components: {
    ...antdTheme.components,
    Layout: {
      headerBg: 'rgba(11, 20, 32, 0.9)',
      bodyBg: dark.bgPage,
      footerBg: dark.bgSurface,
      siderBg: dark.bgSurface,
    },
    Table: {
      headerBg: dark.bgSurfaceAlt,
      headerColor: dark.textPrimary,
      rowHoverBg: dark.bgSurfaceAlt,
      borderRadius: radii.lg,
    },
    Tag: {
      defaultBg: dark.bgSurfaceAlt,
      defaultColor: dark.textPrimary,
    },
    Segmented: {
      itemSelectedBg: dark.bgSurface,
      itemSelectedColor: colorScales.blue[300],
      trackBg: dark.bgSurfaceAlt,
    },
  },
}
