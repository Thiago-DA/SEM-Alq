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
   `alquilada_publicada` (alquilada, pero con fecha de "Disponible desde" cargada). Las alquiladas
   del elenco no tienen fecha: ninguna aparece en `/buscar`. En el alta, una alquilada con fecha
   queda `alquilada_publicada`.
2. Un inquilino pertenece a una sola propiedad; un monto, a un solo contrato.
3. Los montos futuros siempre llevan la palabra "estimado".
4. "Hoy" es el **23/09/2026** en todas las vistas (fijo en modo mock, ver `lib/utils/fechas.ts`).
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

Los "vence en N días" y "N días de atraso" se calculan contra "hoy" (`lib/utils/fechas.ts`), que
en modo mock está FIJO en el **23/09/2026**: Laprida lleva 19 días de atraso y Belgrano 7, siempre.
Con el backend real, "hoy" es la fecha del sistema. Cómo se calcula cada cifra del panel está
documentado en el encabezado de `panel.mock.ts`.

Lo que el export mostraba y **no** se usa porque contradice el elenco: Cerro de las Rosas, Villa
Belgrano, Bv. San Juan, Duarte Quirós, el tipo "Local", Familia Suárez, Tomás Bustos y Rocío
Medina. Tampoco se usa el banner de suscripción del export ("Locador Plus vence el 30/09"): la
suscripción no es de este sprint y el elenco no la define.

## Datos completados en el sprint 1

**No son datos del diseño ni del mapa.** Se completaron para que el panel y el listado de la tanda
"Locador" tuvieran algo coherente que mostrar, con el OK del PO. Si el mapa o el diseño definen
otros valores, ganan ellos.

| Dato | Valor elegido | Dónde |
|---|---|---|
| Ids de contrato | CT-2026-0102 (Laprida 340), CT-2026-0115 (Belgrano 1120), CT-2026-0121 (Av. Colón 2450), CT-2026-0133 (Mariano Moreno 285). CT-2026-0148 (Obispo Trejo) sí es del mapa. | `rental.contractId` en `propiedades.mock.ts` |
| Fechas de contrato | Laprida 01/03/2025–29/02/2028, Belgrano 01/07/2025–30/06/2028, Av. Colón 01/10/2025–30/09/2028, Mariano Moreno 01/12/2025–30/11/2028 (36 meses, a partir de su `publishedAt`) | `rental.startDate` / `endDate` |
| Vencimiento del cobro de septiembre | Laprida 04/09, Belgrano 16/09, Av. Colón 28/09, Obispo Trejo 10/09, Mariano Moreno 05/09. Elegidos para que, al 23/09, den los 19 y 7 días de atraso y el "vence este mes" pedidos. | `cobros` en `panel.mock.ts` |
| Fecha de pago de Obispo Trejo | 03/09 (al día) | `cobros` en `panel.mock.ts` |
| Próximos ajustes | Belgrano 01/11/2026 (IPC cada 4 meses), Av. Colón 01/10/2026 (ICL anual), Mariano Moreno 01/12/2026 (IPC cada 4 meses). Laprida (01/03/2027) y Obispo Trejo (01/04/2027) sí vinieron de producto y del mapa. | `rental.nextAdjustmentDate` |
| Reclamos | "Pérdida de agua en el baño" (abierto, sin responder) y "El termotanque no calienta" (en proceso) → Laprida 340; "Ruido de la bomba de agua" (en proceso) → Av. Colón 2450. Títulos del export del panel; ids RCL-2026-0036/0039/0041 y fechas elegidos acá. | `reclamos` en `panel.mock.ts` |
| Solicitud de Julieta | SOL-2026-0031, del 20/09/2026 | `solicitudes` en `panel.mock.ts` |
