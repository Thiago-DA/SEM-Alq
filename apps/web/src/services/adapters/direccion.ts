/**
 * direccion.ts — formatos de dirección.
 *
 * Qué es: la dirección aproximada de la zona pública ("Rondeau 480, PB" →
 * "Rondeau al 400") y el piso/depto del alta ("7" + "B" → "7° B").
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

/**
 * Piso y departamento del alta (US-01) en el formato del elenco:
 * ("7", "B") → "7° B"; ("7", null) → "7°"; (null, "B") → "Depto B";
 * "PB" se deja tal cual. `null` si no se cargó ninguno de los dos.
 */
export function formatFloorUnit(floor: string | null, unit: string | null): string | null {
  const piso = floor?.trim() || null
  const depto = unit?.trim() || null
  if (!piso && !depto) return null
  if (!piso) return `Depto ${depto}`
  const pisoTexto = /^\d+$/.test(piso) ? `${piso}°` : piso
  return depto ? `${pisoTexto} ${depto}` : pisoTexto
}
