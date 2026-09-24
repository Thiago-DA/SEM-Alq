# SEM-Alq
Proyecto de seminario integrador UTN FRC - Sistema de búsqueda y gestión de alquileres

## Cómo levantarlo

Requiere Node.js 20.9 o más (ver `.nvmrc`).

```bash
npm install
npm run dev:api      # API (Express + Swagger) en http://localhost:3000 · docs en /api/v1/docs
npm run dev:web      # Frontend (Next.js) en http://localhost:3001
```

El frontend corre con datos de prueba por defecto; no necesita la API levantada. Para conectarlo a
la API, ver [`docs/HANDOFF-BACKEND.md`](docs/HANDOFF-BACKEND.md).

## Documentación

- Guía del monorepo y convenciones: [`CLAUDE.md`](CLAUDE.md).
- Documentación académica (Estudio Inicial, Sprint 0, User Stories): [`Documentación/`](Documentación/).
- Producto, diseño y mapa de pantallas: [`docs/`](docs/).
