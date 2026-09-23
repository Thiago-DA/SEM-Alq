# @rentar/ui

Tokens, tema de Ant Design y componentes propios reutilizables de RentAR. Catálogo vivo e
interactivo en `/design-system` (corriendo `apps/web`); referencia en prosa en
[`docs/DESIGN.md`](../../docs/DESIGN.md).

## Cómo importar

Todo se exporta desde el barrel raíz:

```tsx
import { StatusTag, MoneyAmount, AppShell } from '@rentar/ui'
```

**Excepción:** si estás escribiendo un **Server Component** (por ejemplo `apps/web/src/app/layout.tsx`)
y solo necesitás `antdTheme`/`antdThemeDark`/`antdLocale`, importalos de los archivos puntuales en
vez del barrel:

```tsx
import { antdTheme } from '@rentar/ui/src/theme'
import { antdLocale } from '@rentar/ui/src/locale'
```

¿Por qué? El barrel raíz también re-exporta `statusMeta`/`getStatusMeta`, que usan
`@ant-design/icons` — esa librería usa Context de React, que no existe en Server Components.
Pasar por el barrel ahí rompe el build con `createContext is not a function`. Cualquier componente
cliente (`'use client'`) puede seguir usando el barrel sin problema.

## Componentes

Ver el inventario completo con cuándo usar cada uno en
[`docs/DESIGN.md`](../../docs/DESIGN.md#inventario-de-componentes-rentarui). Resumen rápido:

| Grupo | Componentes |
| --- | --- |
| Landing | `Header`, `Footer` |
| Layouts | `PublicLayout`, `AuthLayout`, `AppShell` |
| Navegación | `PageHeader` |
| Datos | `StatusTag`, `MoneyAmount`, `IndexBadge`, `StatCard`, `DataTable`, `DetailList`, `EmptyState`, `ActivityTimeline` |
| Formularios | `FormSection`, `WizardLayout`, `MoneyInput`, `FileDropzone` |
| Feedback | `ConfirmActionModal`, `SimulatedFeatureNotice`, `NotificationBell`, `UserMenu` |
| Dev | `RoleSwitcher` (no renderiza nada en producción) |

## Tokens

```tsx
import { seed, colorScales, light, dark, radii, spacing, shadows, typography } from '@rentar/ui'
```

- **Colores de marca:** `seed.{blue,blueDark,gold,goldInk,sky,skyLight,ink,paper}` — hex literales,
  fuente de verdad de `docs/DESIGN.md`.
- **Escalas generadas:** `colorScales.{blue,gold,sky}[50..900]`, con `@ant-design/colors`. Para
  tintes intermedios de componentes nuevos, no para texto/superficies ya definidas.
- **Semánticos:** `light`/`dark` (`bg*`, `text*`, `border*`, `success`, `warning`, `error`, `info`,
  `neutral`, `money`).
- **Estados de dominio:** `statusMeta` / `getStatusMeta(domain, status)` — label + color + ícono
  por cada estado de `@rentar/shared-types`.

Para CSS propio (`.module.css`), usar las variables `--rentar-*` de
`packages/ui/src/tokens/css-vars.css` (importadas una vez en `apps/web/src/app/layout.tsx`), **no**
las `var(--ant-*)` que genera `cssVar` en `theme.ts` — esas están escopeadas por instancia de
componente de antd, no disponibles para CSS propio fuera de ese árbol. Ver la explicación completa
en el comentario de cabecera de `css-vars.css`.

## Cómo agregar un componente nuevo

1. Elegí la carpeta (`components/layouts`, `components/data`, `components/forms`,
   `components/feedback`, `components/navigation`, o `components/dev` si es solo para desarrollo).
   Si es un componente de la landing específicamente, va directo en `components/`.
2. Creá `MiComponente.tsx` + `MiComponente.module.css` (si necesita estilos que los tokens de antd
   no cubren).
3. Props siempre con una `interface` explícita, JSDoc arriba del componente (qué hace, dónde se
   usa) y de cada prop no obvia. Sin `any` — si algo no se puede tipar bien, `unknown` con un
   comentario que explique por qué.
4. Nada de colores/radios/sombras/espaciado hardcodeado: usá los tokens de TS (`seed`, `radii`,
   etc.) en lógica de componente, o `var(--rentar-*)` en el `.module.css`.
5. `data-testid` en cualquier acción interactiva clave (para los tests de Selenium de
   `tests/e2e/`).
6. Exportalo desde el `index.ts` de esa carpeta.
7. Sumalo al catálogo (`apps/web/src/components/DesignSystem.tsx`) con al menos un ejemplo en vivo
   — variantes/estados relevantes (vacío, cargando, deshabilitado) si aplica.
8. Si el componente es nuevo (no ya documentado), agregalo al inventario de
   [`docs/DESIGN.md`](../../docs/DESIGN.md).

## Comandos

```bash
npm run typecheck --workspace=packages/ui
```
