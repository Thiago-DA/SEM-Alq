# `lib/mocks` — el elenco único

Fuente de verdad: `docs/MapaDePantallas.pdf`, sección "El elenco y las propiedades". **Ninguna
pantalla ni service inventa su propio departamento, inquilino o monto: todo sale de acá.**

Solo lo importan los services (`src/services/*.service.ts`), en su rama mock. Como excepción
documentada, también el catálogo `/design-system` (no es una pantalla del producto).

## Las personas (`usuarios.mock.ts`)

| Id | Persona | Roles | Notas |
|---|---|---|---|
| `usr-nicolas` | Nicolás Arrieta | locador | Dueño de 7 propiedades: 4 alquiladas, 2 publicadas, 1 pausada. |
| `usr-sofia` | Sofía Ledesma | locador y locatario | Locataria de Obispo Trejo 1250 7° B y locadora de Mariano Moreno 285. Única cuenta con dos roles. |
| `usr-julieta` | Julieta Peralta | locatario | La que busca: encuentra Rondeau 480 y la solicita. |

Contraseña de las tres en modo mock: `Rentar2026` (`MOCK_PASSWORD`). La cuenta admin del mapa no
está: el panel de administración no es de este sprint.

## Las propiedades (`propiedades.mock.ts`)

1. **Las del mapa** (8): las 7 de Nicolás y la de Sofía. Las dos publicadas tienen un título
   descriptivo (no la dirección), porque la tarjeta de `/buscar` ya muestra la dirección arriba y
   "barrio · título" abajo:
   - Rondeau 480, PB (Güemes): "1 dormitorio en planta baja con cochera". $385.000 + $62.000,
     disponible desde el 01/10/2026 (cuando empieza CT-2026-0207).
   - Fructuoso Rivera 785 (Cofico): "PH de 2 dormitorios con patio".
   - Las alquiladas y la pausada nunca aparecen en `/buscar`.
2. **Publicadas por otros locadores** (16, `ownerId: 'otros-locadores'`): las propiedades que antes
   eran de la landing. Conservan título, barrio, precio, dormitorios, m², índice, características y
   foto; se completaron dirección, expensas, descripción y disponibilidad. Todas publicadas, así
   `/buscar` tiene más de 10 resultados (US-34 pide paginar). Tres dicen "Monoambiente" en el título
   pero son `type: 'departamento'` de 1 dormitorio (así las muestra la landing); el filtro por tipo
   mira el campo `type`, nunca el título.

Todas están en Córdoba Capital (provincia "Córdoba", ciudad "Córdoba Capital").

## Reglas que no hay que volver a romper

1. Una propiedad `alquilada` o `pausada` nunca aparece en `/buscar`. Sí aparece una
   `alquilada_publicada` (alquilada, pero con fecha de "Disponible desde" cargada).
2. Un inquilino pertenece a una sola propiedad; un monto, a un solo contrato.
3. Los montos futuros siempre llevan la palabra "estimado".
4. "Hoy" es **septiembre de 2026** en todas las vistas.
5. Barrios válidos: los de `lib/catalogs/neighborhoods.ts`.
6. Prefijos de ID: propiedades `prop-…`, contratos `CT-2026-XXXX`, recibos `RC-2026-XXXX`,
   reclamos `RCL-2026-XXXX`, solicitudes `SOL-2026-XXXX`.

## Lo que se crea en el navegador

Las cuentas creadas en `/registro` y las propiedades creadas en el alta se guardan en
`localStorage` (claves `rentar:mock:usuarios` y `rentar:mock:propiedades`), encima del elenco. El
botón "Reiniciar datos de prueba" de las herramientas de desarrollo las borra. Ver
`src/services/shared/mockStore.ts`.

## Huecos documentados (a propósito, no olvidos)

- Laprida 340, Belgrano 1120, Av. Colón 2450 y Mariano Moreno 285 están alquiladas (para que los
  totales del panel cierren), pero el mapa no nombra a sus inquilinos: los datos del alquiler se
  completan con el export del listado del locador (tanda "Locador").
