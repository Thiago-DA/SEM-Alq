# Notas de `/design-sync` — @rentar/ui

## Fuente de verdad: este repo (desde 2026-09-23)

El frontend de RentAR se mudó al repo del equipo (`SEM-Alq`, rama `feature/vistas` → `develop`).
**Desde ahora, `/design-sync` se corre solo desde este repo.** El repo anterior
(`LandingSeminario/versionCompleta`) queda como histórico: no se sincroniza más desde ahí, así
no hay dos fuentes empujando versiones distintas de `@rentar/ui` al mismo proyecto de Claude Design.

Cambios de `@rentar/ui` hechos en la migración, a tener en cuenta en el próximo sync:
- `Header`/`Footer`: los botones y links apuntan a rutas reales (`/login`, `/buscar`,
  `/panel/propiedades/nueva`); el link a `/design-system` solo aparece en desarrollo. Sin cambios
  visuales.
- `RoleSwitcher`: ahora es una pestaña plegable al borde izquierdo, con `role`/`onChange` opcionales
  y el botón "Reiniciar datos de prueba" (`onResetMockData`).
- `PropertyCard`: etiqueta para el tipo nuevo `monoambiente`.
- `.ds-sync/` se copió sin `node_modules` y sigue en el `.gitignore` (se regenera en cada sync).

Cambios de la tanda 2 (autenticación), **pendientes de subir** con `/design-sync` al final del
Sprint 1 (con aprobación del PO), para que Claude Design quede alineado:
- **Nuevo: `PasswordStrengthMeter`** (`components/forms/`): barra de 4 segmentos, etiqueta
  "Fuerza: …" y checklist. Lo pedía "Autenticación" · 03 como componente nuevo. Solo muestra: el nivel
  y los requisitos los calcula `apps/web`. Sin "Un símbolo": el back no acepta símbolos.
- `UserMenu` ("Mi perfil y legajo" · 02): cabecera del menú desplegado (avatar con iniciales, nombre
  y `subtitle`), contador opcional por ítem (`badgeCount`), separador antes de "Cerrar sesión" y,
  debajo de 768px, hoja desde abajo en vez de dropdown. Props nuevas opcionales: la API anterior
  sigue funcionando.
- `AppShell`: `user.subtitle` opcional, que pasa al `UserMenu`.
- `AuthLayout` ("Autenticación" · 02): debajo de 640px la tarjeta ocupa todo el ancho, sin sombra
  ni borde. Solo CSS; la API no cambia.

Cambios de la tanda 3 (búsqueda, US-34), también **pendientes de subir** al final del Sprint 1:
- **Nuevo: `SearchSidebarFilters`** (`components/forms/`): la barra lateral de filtros de
  "Búsqueda de propiedades" · 01 (ubicación con provincia, ciudad y barrios múltiples, precio,
  tipología, dormitorios y ambientes de selección múltiple, superficie, características e índice) y,
  con `variant="drawer"`, el contenido del Drawer móvil (· 03: tipología en pastillas y precio con
  slider). Trabaja sobre un borrador y aplica con `onApply`. `data-testid` con prefijo
  `search-sidebar-` o `search-drawer-` según la variante. Sin "Dúplex" (no existe en el sistema).
  `SearchFilters` (la barra horizontal) no cambió.
- `PropertyCard`: prop `layout="busqueda"` (componente interno `PropertyCardBusqueda`) con la
  tarjeta de /buscar: precio en dorado "por mes", expensas, dirección aproximada, "barrio · título",
  descripción en 2 líneas y disponibilidad (estas dos las pide US-34, no el diseño), chips y carrusel
  si hay más de una foto. Link "estirado" para que las flechas del carrusel sean botones válidos.
  `adjustmentIndex` acepta `null` (sin badge). La API anterior no cambió.

## Contexto de esta corrida (2026-09-22)

Re-sync sobre `feature/fundaciones-app` (rama activa, ramificada de `develop`) contra el proyecto
"RentAR Design System" (`projectId: 0f707fbd-bf3d-4fbc-a8f3-74c68d6e4cb7`), que ya tenía una
sincronización previa de 24 componentes — hecha, aparentemente, desde `feature/design-sync-setup`
(rama hermana, nunca mergeada a `develop`). No había `.design-sync/config.json` en este working
tree; se reconstruyó desde cero en esta corrida.

**Alcance de previews**: el usuario eligió el camino rápido — floor cards para los 32 componentes
(igual que estaban los 24 originales, no es una regresión) + preview autoral solo para los 2 que
renderizaban en blanco (`MoneyAmount`, `NotificationBell`). El resto queda como oferta permanente
para autorar incrementalmente en cualquier sync futuro.

## Decisiones de config (por qué quedaron así)

- `pkg: "@rentar/ui"` — faltaba en el primer intento y el error del build (`required: --config
  --node-modules --out`) no lo señala directamente; si vuelve a pasar, es casi siempre `cfg.pkg`
  vacío, no un flag de CLI faltante.
- `globalName: "RentarUI"` — fijado a mano. Sin esto, la auto-derivación desde `@rentar/ui` da
  `RentarUi` (I minúscula), distinto del `window.RentarUI` que ya usan las 20 pantallas armadas en
  `templates/*.dc.html` de este proyecto. **Si algún día se quita este override, revisar que las
  plantillas existentes no queden rotas.**
- `cssEntry: "src/design-sync-fonts.css"` — ver la sección de abajo, es el único slot de CSS extra
  que admite el conversor (un solo archivo, sin resolver `@import` locales).
- `provider: { component: "ThemeProvider" }` — sin esto, todo antd (Button, Select, Tag...) usa el
  azul default de antd en vez del azul de marca. Restaurado en esta corrida (ver próxima sección).

## `ThemeProvider` restaurado

`packages/ui/src/components/ThemeProvider.tsx` no existía en `feature/fundaciones-app` — vivía
solo en `feature/design-sync-setup` (commit `271dcca`), rama que nunca se mergeó a `develop`. Se
recreó en esta corrida con el mismo contenido (wrapper de `ConfigProvider` + `antdTheme`/
`antdThemeDark` + `antdLocale`), exportado desde `components/index.ts`, y cableado como
`cfg.provider` para que las previews de Claude Design apliquen el tema de marca. **Si en algún
futuro merge `develop` diverge de esto (por ejemplo, alguien borra `ThemeProvider` a propósito
porque `apps/web` arma su propio `ConfigProvider` a mano y nunca lo usa), hay que decidir de nuevo
si mantenerlo solo para este propósito.**

## `design-sync-fonts.css` — riesgo de desincronización (leer antes del próximo sync)

`cfg.cssEntry` solo admite **un** archivo, y el conversor lo copia tal cual (no resuelve
`@import` locales — confirmado empíricamente: un `@import` relativo a otro archivo del paquete
queda roto una vez servido desde `ds-bundle/`, tira `[CSS_IMPORT_MISSING]`). Por eso
`packages/ui/src/design-sync-fonts.css` es la **concatenación** de:
1. Un header fijo (`design-sync-fonts.css.header`, sí commiteado): el `@import` remoto de Google
   Fonts para League Spartan + la regla `body { font-family: ... }` (necesaria porque acá no hay
   `next/font` ni `globals.css` de `apps/web`).
2. Una **copia pegada a mano** del contenido completo de `packages/ui/src/tokens/css-vars.css`.

**Si `tokens/css-vars.css` cambia, hay que regenerar el archivo combinado antes del próximo
`/design-sync`:**

```bash
cat packages/ui/src/design-sync-fonts.css.header packages/ui/src/tokens/css-vars.css \
  > packages/ui/src/design-sync-fonts.css
```

Si este paso se olvida, el build igual funciona (no hay ningún check automático que lo detecte) —
pero los tokens `--rentar-*` que vea Claude Design van a quedar desactualizados en silencio.

## Fuente de la tipografía

League Spartan se carga vía `@import` remoto a Google Fonts (no está self-hosteada en el bundle,
a diferencia de `apps/web` que la sirve vía `next/font/google`). `[FONT_REMOTE]` en el validate es
esperado y no bloquea — la familia carga en runtime desde el navegador de quien vea el diseño.

## Known render warns (triaged, no perseguir en el próximo sync)

`[RENDER_THIN]` en `StatCard`, `FormSection`, `AuthLayout` — floor cards legítimos (nunca se
autoró una preview para estos tres), muestran solo el nombre del componente. No es una regresión.

## Re-sync risks

- **`design-sync-fonts.css` puede quedar desactualizado** si `tokens/css-vars.css` cambia y nadie
  corre el `cat` de arriba — ver la sección dedicada.
- **20 pantallas ya armadas en `templates/`** (los `.dc.html` del proyecto) dependen de
  `window.RentarUI` con esa capitalización exacta y de que los 32 componentes existan con estos
  nombres — no renombrar componentes ni cambiar `globalName` sin revisar esas plantillas primero.
- **11 componentes siguen en floor card** (`ActivityTimeline`, `AppShell`, `ConfirmActionModal`,
  `DataTable`, `EmptyState`, `NextBridgeProvider`, `PageHeader`, `PhotoGallery`,
  `RoleContextSwitcher`, `RoleSwitcher`, `ThemeProvider`) + los 3 "thin" de abajo — están para
  autorar cuando alguien tenga tiempo, no arrastran ningún problema urgente. `StatusTag` salió de
  esta lista (autorado en el sync de 2026-09-22, ver la sección de componentes genéricos). `AppShell`
  es floor card por una causa aparte al logo (crashea antes de llegar a renderizarlo, ver `firstErr`
  en `.render-check.json` si hace falta debuggearlo) — no confundir con el bug del logo de abajo.
- **`ThemeProvider` es de esta rama, no de `develop`** — si `feature/fundaciones-app` se mergea y
  alguien decide después que `ThemeProvider` no debería vivir en `apps/web`/`packages/ui` en
  producción (porque `apps/web/layout.tsx` arma su propio `ConfigProvider` a mano), avisar antes
  de borrarlo: sigue haciendo falta acá, para `cfg.provider`.
- **`docsDir` nunca se configuró** — los 32 `.prompt.md` se sintetizan solo desde `.d.ts` + JSDoc,
  ninguno matchea un doc real (`docs: 0/32 components matched`). Si en algún momento se arma
  documentación por componente, apuntar `cfg.docsDir`.
- **`cfg.buildCmd` (`npm run build:types --workspace=@rentar/ui`) es ahora obligatorio antes de
  cada sync** — ver la sección "Componentes genéricos" de abajo. Si se corre el converter sin
  regenerar `packages/ui/dist-types/` primero (o si ese directorio se borra y nadie lo regenera),
  el converter cae de vuelta al modo synth-desde-`src/`, que **silenciosamente vuelve a romper**
  `StatusTag`/`DataTable` (genérico sin clase `<...>`, `D`/`T` sueltos en el `.d.ts` — ver abajo).
  No hay ningún check automático que lo detecte; `resync.mjs` no corre `buildCmd` por vos, hay que
  correrlo a mano antes.
- **`cfg.dtsPropsFor.StatusTag`/`.DataTable` son uniones a mano, van a quedar desactualizadas
  solas** — si se agrega un dominio/estado nuevo a `packages/shared-types/src/status.ts`, o un
  campo nuevo a `DataTableColumn`, hay que actualizar el body de `dtsPropsFor` a mano (no hay forma
  de que el extractor lo derive automáticamente — ver la sección de abajo). Buscar
  `"StatusTag":` / `"DataTable":` en `.design-sync/config.json`.

## Componentes genéricos (`StatusTag<D>`, `DataTable<T>`) — por qué necesitan `dtsPropsFor`

Investigado a fondo en el sync de 2026-09-22 (pedido: "el card de StatusTag cae al fallback").
Root cause real, dos capas:

1. **Sin un `.d.ts` real compilado, el converter usa el modo synth-desde-`src/`** (porque
   `package.json` de `@rentar/ui` tiene `"types": "src/index.ts"` — código fuente, no un build).
   En synth mode, `propsBodyFor` (`.ds-sync/lib/dts.mjs`) nunca encuentra la interfaz `<Name>Props`
   como declaración nombrada (el `Project` de ts-morph solo carga el barrel `src/index.ts`, no cada
   `.tsx`) y cae a un fallback que **fuerza `generics: ''` sin importar si el componente es
   genérico** — de ahí `export interface StatusTagProps { domain: D; ... }` con `D` suelto (ni
   siquiera es el bug de "generic sin default" que sugería el pedido original — pasa igual con o
   sin default).
   **Fix**: se agregó `packages/ui/package.json#publishConfig.types` apuntando a
   `dist-types/index.d.ts` (un build de solo-declaraciones, `npm run build:types`, sin tocar
   `main`/`types` que sigue usando `apps/web`) + `cfg.buildCmd` en la config. `findTypesRoot`
   prefiere `publishConfig.types` sobre `types` — con esto el converter encuentra la interfaz real
   y SÍ preserva la cláusula `<D extends StatusDomain = StatusDomain>`.
2. **Aún con un `.d.ts` real, un genérico cuyos miembros referencian un tipo nombrado de OTRO
   paquete no queda resuelto** — `StatusDomainMap` (de `@rentar/shared-types`) nunca se importa en
   el `.d.ts` aplanado que emite el converter (solo agrega `import * as React from 'react'`, nada
   más), así que `status: StatusDomainMap[D]` queda como referencia colgante igual, aunque el
   `<D...>` de la interfaz ahora sí esté. Esto parece ser una limitación real del converter con
   genéricos + tipos externos, no algo resoluble solo con `publishConfig`.
   **Fix**: `cfg.dtsPropsFor.StatusTag`/`.DataTable` — body a mano con la unión ya resuelta a texto
   literal (mismo criterio que "types are fully resolved into body" que ya usa el converter para
   props que SÍ son unions). Pierde la correlación real domain↔status (en el componente real,
   `domain="propiedad"` limita `status` a `PropertyStatus`; en el `.d.ts` aplanado, `status` acepta
   cualquier string de cualquier dominio) — degradación aceptada y documentada, igual que el resto
   de "generics ... resolve to their structural shape" en los Known Limitations del skill.

**Si aparece el mismo síntoma en otro componente genérico nuevo**: primero confirmar que
`packages/ui/dist-types/` existe y está actualizado (`npm run build:types --workspace=@rentar/ui`)
y que el `.d.ts` ahí SÍ tiene la cláusula `<...>` — si la tiene pero el converter igual la pierde,
es la causa (2) y hace falta `dtsPropsFor`; si no la tiene ahí tampoco, revisar que
`publishConfig.types` siga apuntando bien.

## Logo roto en el bundle (`logo.src` undefined) — arreglado 2026-09-22

`packages/ui/src/assets/logo-rentar.svg` se importaba directo (`import logo from
'./logo-rentar.svg'`) y se leía como `logo.src`/`logo.width`/`logo.height` — funciona en Next
(devuelve `StaticImageData`), pero el build de esbuild de `/design-sync` usa el loader `dataurl` y
devuelve un string plano, así que `logo.src` quedaba `undefined` en 6 lugares (`AppShell` ×2,
`AuthLayout`, `Header` ×2, `Footer`) y el `<img>` salía sin fuente en las cards. Se agregó
`packages/ui/src/assets/logo.ts` (`LOGO.{src,width,height}`, normaliza los dos formatos — el
fallback de tamaño, 202×113, sale del `viewBox` del SVG) y los 6 usos leen de ahí. Verificado con
capturas del render check: el logo se ve bien en `Header`/`Footer`/`AuthLayout` (no son floor card,
así que es el render real). Es el único asset importado así en el paquete — si se agrega uno
nuevo con el mismo patrón (`import x from './algo.svg'` + `.src`), aplicar el mismo helper.
