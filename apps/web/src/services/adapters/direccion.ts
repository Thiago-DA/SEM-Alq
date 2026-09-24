/**
 * direccion.ts — la dirección aproximada que se muestra en la zona pública.
 *
 * Qué es: "Rondeau 480, PB" → "Rondeau al 400".
 *
 * NOTA: es una decisión de privacidad del diseño ("Búsqueda de propiedades"):
 * en la zona pública (landing, `/buscar`) nunca se muestra la altura exacta
 * ni el piso, solo la calle y la cuadra. Cumple el "mostrar la dirección de
 * cada propiedad" de US-34 sin exponer dónde vive alguien. La dirección
 * exacta la ven el locador (US-02) y, más adelante, las partes del contrato.
 *
 * Quién lo usa: `propiedad-mock.adapter.ts` y `propiedad.adapter.ts`.
 */

/**
 * Calle + cuadra, redondeando la altura hacia abajo al centenar ("al 400").
 * Las alturas de 1 a 99 no tienen un "al 0" natural: se muestran como
 * "primera cuadra".
 */
export function formatApproxAddress(street: string, streetNumber: number): string {
  const cuadra = Math.floor(streetNumber / 100) * 100
  return cuadra > 0 ? `${street} al ${cuadra}` : `${street} (primera cuadra)`
}
