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

## Los alquileres (`rental` en `propiedades.mock.ts` + `panel.mock.ts`)

Datos del export del listado del locador, confirmados por producto. El estado del pago y los
reclamos no se escriben en la propiedad: se calculan a partir de los cobros y reclamos de
`panel.mock.ts`, así el listado (US-02) y el panel nunca se contradicen.

| Propiedad | Locatario | Contrato | Septiembre | Reclamos abiertos | Próximo ajuste |
|---|---|---|---|---|---|
| Obispo Trejo 1250, 7° B | Sofía Ledesma | CT-2026-0148 | $435.800, pagado el 03/09 (al día) | 0 | ICL anual, 01/04/2027 |
| Laprida 340 | Tomás Bianchi | CT-2026-0102 | $520.000, vencido el 04/09 (retrasada) | 2 | ICL anual, 01/03/2027 |
| Belgrano 1120 | Julián Ferreyra | CT-2026-0115 | $460.000, vencido el 16/09 (retrasada) | 0 | IPC cada 4 meses, 01/11/2026 |
| Av. Colón 2450, 3° A | Martín Cabrera | CT-2026-0121 | $440.000, vence el 28/09 (con pago pendiente) | 1 | ICL anual, 01/10/2026 |
| Mariano Moreno 285 (de Sofía) | Camila Ríos | CT-2026-0133 | $510.000, vencido el 05/09 (retrasada) | 0 | IPC cada 4 meses, 01/12/2026 |

Solicitudes: Julieta Peralta por Rondeau 480 (SOL-2026-0031, pendiente).

Los "vence en N días" y "N días de atraso" se calculan contra la fecha real
(`lib/utils/fechas.ts`): el 23/09/2026, Laprida lleva 19 días y Belgrano 7. Cómo se calcula cada
cifra del panel está documentado en el encabezado de `panel.mock.ts`.

Lo que el export mostraba y **no** se usa porque contradice el elenco: Cerro de las Rosas, Villa
Belgrano, Bv. San Juan, Duarte Quirós, el tipo "Local", Familia Suárez, Tomás Bustos y Rocío
Medina. Tampoco se usa el banner de suscripción del export ("Locador Plus vence el 30/09"): la
suscripción no es de este sprint y el elenco no la define.
