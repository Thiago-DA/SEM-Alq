---
name: RentAR
description: Design system de RentAR — tokens, componentes y reglas de uso, implementados en @rentar/ui
package: "@rentar/ui"
colors:
  brand-blue: "#004D98"
  brand-blue-dark: "#003B74"
  brand-gold: "#D7B15D"
  brand-gold-ink: "#8C6B1D"
  brand-sky: "#A0D1EF"
  brand-sky-light: "#E3F2FB"
  ink: "#12202E"
  paper: "#F7F9FB"
semantic:
  success: "#166534"
  warning: "#92400E"
  error: "#9F1239"
  info: "#004D98"
  neutral: "rgba(18, 32, 46, 0.5)"
  money: "#D7B15D"
typography:
  display:
    fontFamily: "League Spartan, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "League Spartan, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "League Spartan, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "League Spartan, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "League Spartan, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
radii:
  pill: "9999px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2.5rem"
  xl: "4rem"
---

# Design System: RentAR

Implementado en código en `packages/ui` (paquete `@rentar/ui`), consumido por `apps/web`.
Catálogo vivo, interactivo, con toggle de tema claro/oscuro: `/design-system`. Este documento es
la referencia en prosa de las mismas decisiones — si algo acá y el código en vivo no coinciden, el
código manda y este documento está desactualizado.

## Overview

**Creative North Star: "El trato directo"**

Todo el lenguaje visual de RentAR existe para que una cosa se sienta cierta a simple vista: estás
tratando con un dueño real, no con el mostrador de una inmobiliaria. Cada superficie se mantiene
cercana, cálida y legible en vez de corporativa o brillosa — un azul institucional profundo da la
confianza de un trámite bien hecho, un dorado cálido marca el momento en que se mueve la plata, y
un celeste suave mantiene la página liviana en vez de burocrática. Nada en el sistema busca
parecerse a un portal inmobiliario grande; parece un escritorio honesto, bien llevado.

El sistema es callado por default y gasta su único gesto ruidoso en el proceso mismo: el diagrama
circular animado del hero (buscar → contactar → firmar → pagar) es la única pieza animada central,
todo lo demás se mueve solo lo justo para reconocer el scroll o el hover del usuario. Las tarjetas
son planas y densas en información en vez de decoradas; el único adorno recurrente es la forma
pill, usada consistentemente para cualquier cosa accionable.

Rechazo confirmado: ningún label tipo "kicker" en mayúsculas arriba de un heading en todo el
sistema — los headings cargan su propio peso. Ningún patrón de tarjeta ícono+heading+texto como
default de estructura de página (la sección "Cómo funciona" deliberadamente usa un timeline
numerado conectado en su lugar).

**Key Characteristics:**
- Azul institucional profundo como único hue "fuerte" para lo interactivo; dorado reservado
  específicamente para dinero/valor.
- Redondeo grande y consistente (botones pill, contenedores `radii.lg`/`radii.xl`) — nunca
  esquinas rectas.
- Tarjetas blancas suavemente elevadas sobre una página apenas fuera de blanco.
- Un momento de movimiento autoral por vista (loop del hero; timeline con scroll-reveal), nunca
  decoración dispersa.
- League Spartan en todo el sistema — ninguna tipografía secundaria, nunca.
- **Todo tokenizado.** Ningún componente nuevo hardcodea un color, radio, sombra o tamaño de
  espaciado — todo sale de `@rentar/ui` (`packages/ui/src/tokens/`). Ver "Cómo se implementan los
  tokens" más abajo.

## Cómo se implementan los tokens

Dos capas, cada una con un trabajo distinto:

1. **`packages/ui/src/tokens/*.ts`** — la fuente de verdad en TypeScript. `primitives.ts` tiene los
   colores semilla y las escalas de 10 pasos generadas con el algoritmo oficial de antd
   (`@ant-design/colors`, no elegidas a mano), tipografía, radios, espaciado, sombras con nombre y
   z-index. `semantic.ts` tiene los colores con significado (`light`/`dark`). `status-meta.ts` tiene
   el mapa completo de estado→label/color/ícono. Se consumen como constantes de TS en cualquier
   `.tsx` (`import { seed, radii } from '@rentar/ui'`) — es la forma correcta de tokenizar colores
   usados en lógica de componente (el `color` de un `<Tag>`, por ejemplo).
2. **`packages/ui/src/tokens/css-vars.css`** — variables `--rentar-*` en `:root`, consumidas por
   los `.module.css` de cualquier componente (tanto los de la landing como los nuevos). **No** son
   las mismas que `var(--ant-*)`: el modo `cssVar` de antd (activado en `theme.ts`) declara esas
   variables por instancia de componente de antd, no en `:root`, así que solo están disponibles
   dentro del árbol DOM de un `<Button>`/`<Card>`/etc. — no sirven para CSS propio de un `<header>`
   o una `<section>`. `--rentar-*` sí vive en `:root` y por eso es la forma confiable de tokenizar
   CSS de layout en cualquier parte del árbol.

Opacidades puntuales que no encajan en un token semántico (`rgba(18,32,46,0.055)`, por ejemplo) se
expresan como `rgba(var(--rentar-color-ink-rgb), 0.055)` — el color queda tokenizado, el número de
opacidad es un valor de diseño legítimo, no un color hardcodeado.

## Colores

La paleta es chica y está codificada por función: el azul lleva toda acción clicable/primaria, el
dorado aparece solo donde se comunica dinero o valor, el celeste es atmósfera (fondos, dividers,
hover), nunca texto.

### Primitivos (marca)
- **Azul Escribanía** (`seed.blue` / `--rentar-color-blue`, `#004D98`): el único color usado para
  botones primarios, links, estados activos de filtros, foco, trazos de ícono dentro de nodos
  blancos y los nodos numerados del timeline de "Cómo funciona". Si es clicable e importante, es
  este azul.
- **Azul Escribanía Oscuro** (`seed.blueDark`, `#003B74`): hover/activo del azul de arriba. Nunca
  en reposo.
- **Dorado Trámite** (`seed.gold` / `#D7B15D`, tinta de texto `seed.goldInk` / `#8C6B1D`):
  reservado para dinero — la línea de precio de cada tarjeta, `MoneyAmount`, el highlight de
  selección de texto. El `#D7B15D` crudo también es el trazo del círculo guía del hero y el punto
  que viaja por el loop. `#8C6B1D` es el único dorado apto para texto (≥4.5:1 sobre blanco/paper);
  `#D7B15D` nunca lleva texto chico — ver la Regla de Contraste.
- **Celeste Cordobés** (`seed.sky` / `#A0D1EF`, tinte `seed.skyLight` / `#E3F2FB`): atmósfera
  solamente — fondos de sección (hero, "Cómo funciona"), degradé del buscador, hover de botones
  secundarios y chips, fondo alterno de tarjetas. Nunca para texto ni íconos.
- **Ink** (`seed.ink` / `#12202E`): todo el texto de cuerpo, siempre a 70% de opacidad o más (ver
  Regla de Contraste). También el casi-negro usado a baja opacidad para hairlines.
- **Paper** (`seed.paper` / `#F7F9FB`): fondo de página. Las tarjetas se apoyan encima en blanco
  sólido para leerse un escalón "arriba".

### Escalas generadas
`colorScales.{blue,gold,sky}` — 10 pasos por color (`50` el más claro, `900` el más oscuro),
generados con `@ant-design/colors` a partir de los mismos hex de marca. Se usan para variantes de
hover/fondo de componentes nuevos que necesiten un tinte intermedio — **nunca** para el texto
principal o las superficies ya definidas arriba, que siguen usando los hex de marca literales sin
pasar por el algoritmo (para no introducir una diferencia imperceptible pero real frente a lo ya
validado).

`darkColorScales` existe para el mismo propósito en modo oscuro — con una salvedad: en la escala
que devuelve `generate(color, { theme: 'dark' })`, el índice va de oscuro (paso `50`) a claro (paso
`900`), al revés que en la escala clara. Es el propio algoritmo de antd optimizando para fondos
oscuros con acentos claros, no un error — pero hay que tenerlo presente al usarla.

### Semánticos (`light` / `dark`)
Cinco roles con significado, consumidos por `StatusTag` (vía `getStatusMeta`) y por cualquier
componente que necesite comunicar estado — nunca elegidos "a ojo" por pantalla.

| Rol | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `success` | `#166534` | `#4ADE80` | publicada, vigente, firmado, pagado, resuelto, activa |
| `warning` | `#92400E` | `#FBBF24` | pausada, pendiente_firma, pendiente, en_proceso |
| `error` | `#9F1239` | `#FB7185` | rescindido, rechazado, vencido, abierto, vencida |
| `info` | `#004D98` (reusa el azul de marca) | `#1B65A6` | alquilada, alquilada_publicada, finalizado |
| `neutral` | `ink/50` | `paper/50` | anulado, cerrado, cancelada |
| `money` | `#D7B15D` / `#8C6B1D` | igual — no cambia en dark | `MoneyAmount` con `emphasis`, nunca un estado |

### Named Rules
**La regla del dinero-es-dorado.** El dorado aparece exactamente donde hay moneda (la línea de
precio, `MoneyAmount`) y en ningún otro lugar como color de contenido — nunca en un `StatusTag`,
por más que un estado sea "positivo" (ver el color `info` para "alquilada"/"finalizado", que
podrían tentar a usar dorado y no lo hacen).

**La regla de contraste.** Ningún texto sobre superficie clara baja de `ink/70` (≈6.1:1 sobre
blanco/paper) o de `goldInk` para texto dorado (≈4.96:1). `ink/60`, `ink/50` y el dorado crudo son
correctos para rellenos decorativos grandes, pero nunca para texto chico.

## Tipografía

**Fuente de Display/Cuerpo:** League Spartan, con `system-ui, sans-serif` como respaldo — una sola
familia para todo el sistema, en distintos pesos y tamaños únicamente.

**Carácter:** un sans geométrico y confiado haciendo todo el trabajo: bold y de tracking ajustado
en tamaño display para headlines, peso regular para texto de cuerpo. Sin serif, sin mono, sin una
segunda tipeface de display — la "voz única" es deliberada.

### Jerarquía
- **Display** (700, `clamp(2.25rem, 4vw, 3rem)`, line-height 1.05, tracking -0.025em): el H1 del
  hero únicamente.
- **Headline** (700, `clamp(1.5rem, 3vw, 2.25rem)`, tracking ajustado): H2 de sección.
- **Title** (600, `1.125rem`): títulos de tarjeta, H3 de pasos del timeline.
- **Body** (400, `1rem`/1.5): texto de párrafo; se mantiene corto (2–3 líneas) en vez de largo —
  esto es una landing/panel, no un artículo.
- **Label** (600, `0.875rem`): links de nav, labels de formulario, texto de botón, filas de
  metadata de tarjeta (dormitorios · m² · índice).

### Named Rules
**La regla de no-eyebrow.** Ningún label chico en mayúsculas/tracking se sienta directamente
arriba de un heading como kicker. Si un heading necesita una categoría o marcador de contexto, va
*debajo* del heading (ver la línea de barrio/tipología de `PropertyCard`) o se pliega dentro de las
palabras del heading mismo.

## Layout

Página de una sola columna, contenedor centrado `max-w-6xl`, gutters laterales de `spacing.sm`
(mobile) a `spacing.md` (`sm:`). El ritmo de sección es generoso y consistente: `spacing.lg` para
secciones estándar, un poco más para la banda de "Cómo funciona".

Estrategia responsive mobile-first con tres breakpoints efectivos: mobile (default, una columna),
`sm:` (640px, grids de 2 columnas, nav desktop del header todavía oculto), `lg:`/`xl:`
(1024px/1280px, nav desktop completo, grid de propiedades de 3–4 columnas, hero se vuelve de dos
columnas). El nav/CTAs del header colapsan a un hamburguesa por debajo de `md:`.

El buscador del hero se sube intencionalmente sobre el borde inferior del hero con un margen
negativo, así se lee como una sola pieza con el hero en vez de un bloque separado empezando la
sección siguiente — el único lugar del layout que superpone secciones así.

## Elevación y profundidad

Suavemente elevado. La profundidad se usa con moderación y solo para separar una tarjeta de la
página, nunca para llamar la atención sobre sí misma: las tarjetas blancas llevan una sombra chica
y suave en reposo (`shadows.resting`) con una un poco más fuerte más un levantamiento de 1px en
hover (`shadows.lifted`), siempre emparejada con un hairline `ink/5` en vez de un borde duro. Los
botones llevan una sombra de color propio (`shadows.button`, teñida de azul) en vez de una sombra
gris genérica.

### Vocabulario de sombras (`shadows.*`, `--rentar-shadow-*`)
- **`resting`**: `PropertyCard` y el panel de `SearchBar`/tarjetas del catálogo en reposo.
- **`lifted`**: `PropertyCard` en hover — el único cambio de elevación interactivo del sistema.
- **`button`**: CTAs primarios (botones del hero, "Buscar más propiedades").
- **`deep`**: el contenedor `ProcessLoopMotif` del hero — el único lugar donde la elevación se usa
  por peso visual en vez de separación.
- **`form`**: el panel de `SearchBar` — existía hardcodeada y sin nombre antes de tokenizarse.

### Named Rules
**La regla de sombra-ganada.** Una sombra solo aparece sobre algo que el usuario puede accionar
(una tarjeta, un botón) o la pieza insignia del hero. Los bloques de contenido estático (headings,
párrafos, el footer) quedan planos.

## Formas

El redondeo es grande y consistente, nunca filoso: `radii.pill` para todo botón, badge y chip;
`radii.lg` (16px) para tarjetas y el panel del buscador; `radii.xl` (24px) para el contenedor del
motivo del hero, la superficie más grande del sistema. Los bordes son hairlines únicamente
(`ink/10` en inputs, `ink/5` en tarjetas) — nunca un borde grueso o de color, y nunca un acento de
borde-izquierdo/derecho de color.

## Modo oscuro

Implementado (`antdThemeDark` en `theme.ts` + overrides `[data-rentar-theme="dark"]` en
`css-vars.css`), pero **acotado a `/design-system` y a los paneles autenticados futuros
(`AppShell`)**. La landing pública nunca activa este tema — su `ConfigProvider` usa siempre
`antdTheme` (claro), a propósito, para que la landing quede pixel-igual sin importar qué se toque
en el sistema de tokens.

El toggle de `/design-system` envuelve toda la página en un `<ConfigProvider theme={isDark ?
antdThemeDark : antdTheme}>` anidado y setea `data-rentar-theme="dark"` en el elemento raíz de la
página — ambos cambian juntos, así los componentes de antd (vía `cssVar`) y el CSS propio (vía
`--rentar-*`) quedan sincronizados.

## Estados de dominio

Cada estado de cada dominio de negocio (ver `@rentar/shared-types`) tiene un label en español, un
color semántico y un ícono, decididos una sola vez en `packages/ui/src/tokens/status-meta.ts` y
resueltos por `getStatusMeta(domain, status)` / `<StatusTag domain status />`. Ningún componente de
pantalla debería volver a decidir esto.

| Dominio | Estados | Color asignado |
| --- | --- | --- |
| `propiedad` | publicada, pausada, alquilada, alquilada_publicada | success, warning, info, info |
| `contrato` | pendiente_firma, vigente, finalizado, rescindido | warning, success, info, error |
| `firma` | pendiente, firmado, rechazado | warning, success, error |
| `cobro` | pendiente, pagado, vencido, anulado, parcial | warning, success, error, neutral, warning |
| `reclamo` | abierto, en_proceso, resuelto, cerrado | error, warning, success, neutral |
| `suscripcion` | activa, vencida, cancelada | success, error, neutral |
| `solicitud` | pendiente, aceptada, rechazada, cancelada | warning, success, error, neutral |
| `usuario` | activo, suspendido, sin_verificar | success, error, warning |
| `factura` | pagada, rechazada | success, error |

`UserRole` (`locador`/`locatario`/`garante`/`admin`) queda fuera de este mapa a propósito: un rol
es identidad, no un estado de ciclo de vida — se muestra con un tag neutro simple en `UserMenu`,
no con `StatusTag`.

## Inventario de componentes (`@rentar/ui`)

Todos con props tipadas (interface explícita, sin `any`), JSDoc en español, `data-testid`
configurable en las acciones clave, y sin valores visuales hardcodeados.

**Landing (reutilizables, movidos de `apps/web`)**
- `Header`, `Footer` — usados por la landing y por `PublicLayout`.

**Layouts** — cuándo usar cada uno:
- `PublicLayout`: cualquier página pública nueva (Header + contenido + Footer).
- `AuthLayout`: login, registro, recuperar contraseña — tarjeta centrada con marca. Prop `compact`
  para previsualizarlo en un contenedor acotado (lo usa el catálogo).
- `AppShell`: cualquier pantalla autenticada del panel (locador, locatario, garante, admin) —
  sidebar + header con notificaciones/usuario + contenido. La navegación se recibe por props
  (`navConfig` por rol vive en `apps/web`, no en el paquete). Prop `compact` con el mismo propósito
  que en `AuthLayout`. Slot `contextSwitcher` en el header (para `RoleContextSwitcher`, solo
  cuentas con más de un rol) y `variant="admin"` para el header oscuro de `/admin/*` — reusa la
  paleta dark de `tokens/css-vars.css` (`data-rentar-theme="dark"` sobre el header), no tokens
  nuevos. `userMenuItems` pasa a través a `UserMenu`.

**Navegación**
- `PageHeader`: encabezado estándar de una pantalla del panel (breadcrumb + título + acciones).
- `FilterBar`: buscador + chips de estado (`aria-pressed`) + acción, del arquetipo A4 — reemplaza
  el patrón que se repetía dibujado a mano en varios listados del panel.

**Datos**
- `StatusTag`: estado de dominio (ver arriba).
- `MoneyAmount`: monto en pesos argentinos; `emphasis` lo pinta de dorado — usar en el monto
  principal de una vista, no en cada número de una tabla.
- `IndexBadge`: índice de ajuste (IPC/ICL) con tooltip explicativo.
- `StatCard`: KPI con título, valor, variación con flecha y color, e ícono.
- `DataTable`: en mobile (`<640px`) se convierte en lista de tarjetas (una por fila, pares
  label/valor) en vez de forzar scroll horizontal. Cubre estado de carga (`Skeleton`) y vacío
  (`Empty`).
- `DetailList`: pares label/valor para vistas de detalle (wrapper de `Descriptions`).
- `EmptyState`: sin propiedades/contratos/resultados — icono, texto, acción sugerida.
- `ActivityTimeline`: historial de eventos de un contrato, cobro o reclamo, con fecha relativa.
- `PropertyCard`: tarjeta de propiedad (foto, badge, título, barrio/tipología, dormitorios/m²/
  índice, precio en dorado) — `/buscar`, listado de propiedades del locador, revisión del alta.
  Props primitivas (no recibe `Property` directo) + `useNextBridge()` para imagen/link.
- `PhotoGallery`: imagen principal + miniaturas + lightbox (`Image.PreviewGroup` de antd) —
  `/propiedad/[id]` y paso 3 del alta.
- `OnboardingChecklist`: pasos con estado listo/activo/bloqueado y contador — panel vacío de
  locador/locatario nuevos. A propósito no es una fila de tarjetas ícono+heading+párrafo (patrón
  rechazado más abajo).
- `PlanCard`: tarjeta de plan de suscripción con precio en dorado, `highlighted` para el
  recomendado y `currentPlan` para el plan activo — `/planes`, `/panel/suscripcion`.

**Formularios**
- `FormSection`: agrupa campos bajo un título y descripción.
- `WizardLayout`: formulario en pasos (`Steps` + navegación Anterior/Siguiente/Confirmar). No
  valida nada por su cuenta.
- `MoneyInput`: `InputNumber` con formato de pesos argentinos ya aplicado.
- `FileDropzone`: `Upload.Dragger` para fotos/documentos. Nunca sube nada de verdad
  (`beforeUpload` siempre `false`) — no hay backend en esta etapa (ver la regla de "prototype
  honesty" en `docs/PRODUCT.md`).
- `SearchFilters`: panel de filtros de `/buscar` (zona, tipología, dormitorios, precio,
  características) — versión de `@rentar/ui` de `SearchBar` de la landing, recibe barrios/
  características por props en vez de importar mocks. Controles avanzados detrás de un `Drawer`
  en mobile.

**Feedback**
- `ConfirmActionModal`: confirmación de una acción destructiva o irreversible.
- `SimulatedFeatureNotice`: aviso de que una función (pago, firma, notificación) todavía es
  simulada — usar junto a cualquier flujo que todavía no tenga backend real detrás.
- `NotificationBell`: campanita con badge de no-leídas y panel desplegable.
- `UserMenu`: avatar, nombre, rol, ítems configurables (`items`: Mi perfil, Notificaciones, cambio
  de contexto, Administración) y cerrar sesión (siempre último, fijo).
- `RoleContextSwitcher`: selector "Viendo como..." del header del `AppShell`, para cuentas con más
  de un rol (hoy, solo Sofía Ledesma). Producto real, cablea con la sesión — distinto del
  `RoleSwitcher` de desarrollo de abajo.

**Solo desarrollo**
- `RoleSwitcher`: selector de rol flotante (`position: fixed`) para ver la app sin autenticación
  real. No renderiza nada si `NODE_ENV === 'production'`.

## Componentes de la landing

### Botones
- **Forma:** `radii.pill`, siempre — ningún botón cuadrado o levemente redondeado en ningún lugar.
- **Primario:** `blue` de fondo / texto blanco / `shadows.button`.
- **Hover/foco:** el hover del primario oscurece a `blueDark`; todos los estados de foco usan el
  outline global de 2px en `blue` con 2px de offset (nunca un sustituto de color/glow).
- **Secundario/ghost:** fondo blanco, texto `blue`, ring `blue/20`, hover rellena con
  `skyLight`. Usado para acciones de menor énfasis ("Ver cómo funciona", "Iniciar sesión" del
  header).
- **Estado placeholder:** "Iniciar sesión"/"Publicar propiedad" del header y "Buscar más
  propiedades" del grid se renderizan como botones primarios/secundarios reales sin destino
  todavía (ver `docs/PRODUCT.md`) — nunca deben verse deshabilitados o rotos, solo genuinamente
  estilizados y sin acción por ahora.

### Chips (características de SearchBar)
- **Estilo:** pill, borde por default (`ink/10` sobre `paper`); el estado seleccionado invierte a
  `blue` sólido.
- **Estado:** toggle (multi-select), `aria-pressed` refleja el estado — un solo lenguaje visual de
  chip en todo el sistema.

### Tarjetas / contenedores
- **Esquina:** `radii.lg` (`PropertyCard`, panel de `SearchBar`).
- **Fondo:** blanco sólido sobre la página `paper`.
- **Sombra:** ver Elevación — reposo `shadows.resting`, elevado solo en hover de `PropertyCard`.
- **Borde:** ring `ink/5` hairline, sin color de borde visible.

### Inputs / campos
- **Estilo:** fondo `paper` (no blanco) para sensación de inset, borde `ink/10`, `radii.sm`.
- **Foco:** el borde cambia a `blue`, sin glow/sombra agregada.
- **Slider de rango:** input nativo estilizado con `accent-blue`; el valor actual siempre se
  repite en el texto del label (nunca escondido solo detrás de la posición del thumb).

### Navegación
- **Estilo:** links de texto a escala label, hover a `blue`, sin subrayado en reposo ni en hover.
- **Mobile:** el header colapsa a un hamburguesa por debajo de `md:`; el panel abierto lista los
  mismos links como lista apilada más los dos botones CTA a ancho completo.

### Componente insignia: el timeline/loop de proceso
Dos piezas hechas a medida llevan la única idea de movimiento autoral del sistema, y
deliberadamente reflejan la misma estructura de 4 etapas: buscar → contactar → firmar → pagar.
- **Timeline de HowItWorks:** círculos numerados `blue` (no íconos) conectados por una regla
  hairline `blue/15`, horizontal en `sm:` y vertical en mobile; cada paso aparece/desliza al
  entrar en scroll vía `IntersectionObserver` y revierte al salir de vista.
- **ProcessLoopMotif (hero):** la misma idea de 4 etapas como un diagrama en loop — un círculo guía
  punteado, 4 nodos blancos de ícono en los puntos cardinales, y un punto dorado que recorre el
  círculo cada 8s, pulsando cada nodo al llegar. Es el único lugar donde aparecen íconos
  (buscar/chat/firma/recibo, SVG de trazo único hechos a mano) en el sistema.

## Do's and Don'ts

### Hacer:
- Mantener el dorado (`money`/`moneyInk`) atado solo a contenido de dinero/valor (línea de precio,
  `MoneyAmount`, highlight de selección); en cualquier otro lugar es atmósfera, no color de
  contenido.
- Usar `radii.pill` para todo botón/badge/chip y `radii.lg`/`radii.xl` para contenedores — ningún
  otro radio.
- Manejar una animación de "entra/sale de vista" con un `IntersectionObserver` persistente que
  alterne en ambos sentidos, así una sección ya vista se re-anima si el usuario sale y vuelve a
  entrar (ver `useInView`, usado por `HowItWorks`).
- Emparejar una animación CSS `transform` solo con elementos que no tengan un atributo SVG
  `transform` en el mismo nodo — anidar un `<g>` de posicionamiento estático alrededor de un `<g>`
  interno animado en su lugar (ver `ProcessLoopMotif`; mezclar los dos hace que el navegador
  descarte el atributo silenciosamente).
- Consumir los componentes de `@rentar/ui` antes de escribir uno nuevo — si algo parecido ya
  existe, extenderlo en vez de duplicarlo.
- Tokenizar cualquier color/radio/sombra/espaciado nuevo en `packages/ui/src/tokens`, nunca
  hardcodeado en un `.module.css` o un `style={{}}` inline.

### No hacer:
- Poner un label "kicker" en mayúsculas/tracking directamente arriba de un H1/H2/H3 — nunca, por
  más tentador que sea agregar contexto arriba de un heading (la regla de no-eyebrow).
- Construir una sección nueva como una fila de tarjetas idénticas ícono+heading+párrafo — ese
  default de estructura de página está explícitamente rechazado en este sistema.
- Usar `ink/60`, `ink/50` o el dorado crudo para texto de cualquier tamaño — caen debajo del piso
  de contraste 4.5:1 (la regla de contraste).
- Sumar una segunda tipografía, un acento de borde de color, texto en degradé o una sombra dura
  tipo neobrutalista — ninguno de estos pertenece a este mundo.
- Hardcodear un hex/rgba en un `.module.css` cuando ya existe un token equivalente en
  `@rentar/ui` — si hace falta un valor nuevo, se agrega al token, no al componente.
