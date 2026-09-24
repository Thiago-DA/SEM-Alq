# RentAR — guía del monorepo (SEM-Alq)

> **Las respuestas al usuario van siempre en español.**

> **Antes de tocar código de `apps/web`:** leé `apps/web/CLAUDE.md` (→ `apps/web/AGENTS.md`). La
> versión de Next.js de este monorepo (16.x) tiene cambios incompatibles con lo que un LLM entrenado
> con versiones anteriores conoce (por ejemplo, `middleware.ts` pasó a llamarse `proxy.ts`).
> `apps/web/AGENTS.md` lo reescribe `next dev` solo: no lo edites a mano.

## Qué es RentAR

Plataforma web para gestionar alquileres residenciales de larga duración directamente entre
locador, locatario y garante, sin inmobiliaria. El piloto es Córdoba Capital. Proyecto académico
de la cátedra Seminario Integrador (Ingeniería en Sistemas de Información, UTN FRC, 2026).

- Producto, usuarios y alcance: [`docs/PRODUCT.md`](docs/PRODUCT.md).
- Sistema de diseño: [`docs/DESIGN.md`](docs/DESIGN.md).
- Rutas, arquetipos, menús y elenco de datos de prueba: [`docs/MapaDePantallas.pdf`](docs/MapaDePantallas.pdf).
- Estudio inicial, Sprint 0 y User Stories: [`Documentación/md/`](Documentación/md/).
- Asistente del equipo (visión, stack, ramas): [`.agents/proyecto-rentar/SKILL.md`](.agents/proyecto-rentar/SKILL.md).

## Estructura del monorepo

```
/
├── apps/
│   ├── web/                # Next.js 16 + Ant Design 6 (frontend) — puerto 3001
│   └── api/                # Node.js + Express + Swagger (backend) — puerto 3000
├── packages/
│   ├── shared-types/       # Modelos del back + tipos de vista del front (ver su README)
│   └── ui/                 # @rentar/ui: tema de antd y componentes (design system)
├── supabase/               # migrations/ y seed.sql
├── tests/api/              # Tests de la API (tsx)
├── docs/                   # PRODUCT.md, DESIGN.md, MapaDePantallas.pdf, HANDOFF-BACKEND.md, api-endpoints.md
├── Documentación/          # Documentación académica: Estudio Inicial, Sprint 0, US, planes (md y pdf)
├── .design-sync/           # Configuración y notas de /design-sync (ver NOTES.md)
└── .agents/, .claude/      # Skills: proyecto-rentar (del equipo) y playwright-cli
```

Cada módulo tiene su `README.md`: `apps/web`, `apps/web/src/services`, `apps/web/src/lib/mocks`,
`packages/shared-types`, `packages/ui`.

## Stack, versiones y puertos

- Node.js >= 20.9 (ver `.nvmrc`), npm workspaces.
- `apps/web`: Next.js 16.3.5 (App Router) + React 19 + TypeScript + Ant Design 6.6.3. antd va con
  versión **exacta** en `apps/web` y `packages/ui`: dos copias distintas rompen el tema.
- `apps/api`: Express + Swagger. Rutas en `apps/api/src/routes/v1/`, docs en
  `http://localhost:3000/api/v1/docs`.
- **Puertos:** la API usa el **3000** y la web el **3001** (`next dev -p 3001`).
- TypeScript `strict` en todo el frontend. **Nada de `any`**: si algo no se puede tipar bien, usar
  `unknown` con un comentario que explique por qué.

## Comandos

Desde la raíz:

```bash
npm install          # instala todo el workspace
npm run dev:web      # apps/web en http://localhost:3001
npm run dev:api      # apps/api en http://localhost:3000
npm run build        # build de todos los workspaces
npm run lint         # eslint de apps/web
npm run typecheck    # tsc --noEmit en shared-types, ui y web
npx tsx tests/api/mis-alquileres.test.ts   # tests de la API (ver la NOTA de abajo)
```

NOTA: `npm test` falla en `develop` porque el script de `apps/api` busca el test en
`apps/api/tests/`. Está anotado para backend en `docs/HANDOFF-BACKEND.md` §8.

## Convenciones de código

El código es un entregable para todo el equipo: tiene que poder leerlo alguien que no maneja
Next.js ni Ant Design.

- **Idioma:** comentarios en español; nombres de variables, funciones y componentes en inglés.
- **Encabezado en cada archivo:** qué es, qué US cubre, de dónde saca los datos y quién lo usa.
- **Secciones** en los archivos largos: `// ─── Estado local ───`, `// ─── Handlers ───`,
  `// ─── Render ───`, etc.
- **JSDoc en español** en cada componente, hook, service y utilidad. Comentar el *por qué* de cada
  regla de negocio o validación (citando el criterio de la US).
- **Marcas para buscar con grep**, siempre con explicación: `TODO(backend):` (falta algo en la API),
  `TODO(db):` (falta algo en la base) y `NOTA:` (una decisión que no es obvia).
- **User Stories:** siempre con la numeración del Sprint 0. Si algo no tiene US en el Sprint 0:
  "sin US en Sprint 0 (mapa US-xx)". Tabla de equivalencias en `docs/HANDOFF-BACKEND.md` §6.
- **Componentes:** `Componente.tsx` + `Componente.module.css`. Props con una interfaz explícita.
- **Usar primero `@rentar/ui`.** Si algo parecido existe, extenderlo o componerlo. Los cambios en
  `@rentar/ui` se consultan antes con el PO y se anotan en `.design-sync/NOTES.md`.
- **Nada de valores visuales en crudo** (colores, radios, sombras) en `.module.css` ni en
  `style={{}}`: usar las variables `var(--rentar-*)` de `packages/ui/src/tokens/css-vars.css`. Para
  una opacidad, `rgba(var(--rentar-color-ink-rgb), 0.08)` o `color-mix(...)` sobre un token.
- **Alias de import:** `@/*` dentro de `apps/web` (→ `apps/web/src/*`); `@rentar/ui` y
  `@rentar/shared-types` para los paquetes.
- **Diseño y criterios de aceptación:** el diseño de Claude Design manda en lo visual; los criterios
  de aceptación de las US (`Documentación/md/US/`) mandan en los datos y las validaciones.

## Conexión con el backend

`apps/web/src/services/` es **la única frontera con el backend**. Ninguna página ni componente
importa mocks ni llama a `fetch` directo.

- **Flag de mocks:** `NEXT_PUBLIC_USE_MOCKS` (por defecto `true`, ver `apps/web/.env.example`).
  Cada función de un service tiene dos ramas: la mock (datos del elenco) y la real (la API). Pasar a
  la API es poner `NEXT_PUBLIC_USE_MOCKS=false` en `apps/web/.env.local` y reiniciar `dev:web`.
- **Cliente HTTP único:** `services/shared/apiClient.ts`. Arma la URL con `NEXT_PUBLIC_API_URL`
  (por defecto `http://localhost:3000/api/v1`), manda el header `x-user-id`, desarma el sobre
  `{ success, message?, data?, error? }` y convierte cada status HTTP en un `ServiceError` con código.
- **Adaptadores:** `services/adapters/`. Traducen cada DTO del back al tipo de vista que usa la
  pantalla, campo por campo, con lo que falta marcado como `TODO(backend)`.
- **Cada función de service** lleva la US que cubre y un bloque `@backend` con método, ruta y
  estado: `(existe)`, `(en curso en <rama>)` o `(no existe — propuesto)`.
- Paso a paso para conectar un endpoint, brechas contra la API actual y status HTTP que espera el
  front: [`docs/HANDOFF-BACKEND.md`](docs/HANDOFF-BACKEND.md). Lista de endpoints:
  [`docs/api-endpoints.md`](docs/api-endpoints.md).

## Datos de prueba (modo mock)

- **El elenco único** vive en `apps/web/src/lib/mocks/`. Los datos salen de ahí: ninguna pantalla
  inventa su propio departamento, inquilino o monto. Reglas completas en su `README.md`.
- Lo que se crea en modo mock (cuentas, propiedades, el borrador del alta) se guarda en el
  `localStorage` del navegador con claves `rentar:mock:*`. El botón flotante de desarrollo
  "Reiniciar datos de prueba" lo borra.
- **"Hoy" es el 23/09/2026** en modo mock (`apps/web/src/lib/utils/fechas.ts`), para que los datos
  sean coherentes y los tests de Selenium, estables.
- Contraseña de las cuentas del elenco: `Rentar2026`.

## `data-testid` para Selenium

Las acciones clave de cada pantalla llevan `data-testid` con la forma
`<pantalla>-<elemento>[-<acción>]` (ej. `login-submit-button`, `mis-propiedades-tab-alquilada`,
`alta-precio`). Tabla por pantalla en `docs/HANDOFF-BACKEND.md` §7. Toda acción nueva suma su
`data-testid` siguiendo el mismo patrón.

## Design system y `/design-sync`

- `@rentar/ui` es el design system sincronizado con el proyecto "RentAR Design System" de Claude
  Design. Catálogo vivo en `http://localhost:3001/design-system` (solo en desarrollo).
- **Este repo (SEM-Alq) es la fuente de verdad de `/design-sync`** desde el 23/09/2026. El repo
  anterior (`LandingSeminario/versionCompleta`) quedó como histórico: no se sincroniza más desde ahí.
- Cambios de `@rentar/ui` pendientes de subir y decisiones tomadas: `.design-sync/NOTES.md`.

## Ramas y commits

- `main`: producción. `develop`: integración. `feature/<nombre>`: trabajo en curso, desde `develop`.
- Los PR van siempre contra `develop`.
- Commits chicos, en español (`feat(web): …`, `fix(web): …`, `feat(ui): …`, `docs: …`).
- No se hace push ni merge sin la aprobación del PO.
