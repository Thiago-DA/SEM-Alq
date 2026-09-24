/**
 * alta/borrador.ts — el borrador LOCAL del formulario del alta (US-01).
 *
 * Qué es: lo que el locador fue cargando en `/panel/propiedades/nueva` se
 * guarda en el navegador (`localStorage`, clave `rentar:mock:alta-borrador`)
 * para que no lo pierda si cierra la pestaña. NO es un estado de la
 * propiedad: RentAR no tiene "Borrador" (regla de Claude Design: "sin estado
 * Borrador en propiedades"). La propiedad recién existe cuando se publica,
 * se pausa o se guarda como alquilada.
 *
 * Reglas (producto):
 * - Al volver al alta con un borrador guardado se pregunta "Continuar /
 *   Empezar de nuevo"; nunca se restaura en silencio.
 * - Se borra cuando el alta termina bien.
 * - Es de una sola cuenta: el de otra persona no se ofrece.
 *
 * NOTA: la clave usa el prefijo `rentar:mock:` para que "Reiniciar datos de
 * prueba" también lo borre. Con el backend real sigue siendo local (no hay
 * endpoint de borradores, y no hace falta).
 * Quién lo usa: `components/alta/AltaPropiedad.tsx`.
 */

/** Clave de `localStorage` del borrador. */
export const ALTA_BORRADOR_KEY = 'rentar:mock:alta-borrador'

/** Lo que se guarda: de quién es, en qué paso iba y los valores del formulario. */
export interface BorradorAlta<V> {
  ownerId: string
  /** Paso más avanzado al que llegó (0-based). */
  step: number
  values: V
  /** Fecha ISO de la última vez que se guardó. */
  savedAt: string
}

/** Lee el borrador de una cuenta; `null` si no hay, es de otra cuenta o no se puede leer. */
export function leerBorrador<V>(ownerId: string): BorradorAlta<V> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(ALTA_BORRADOR_KEY)
    if (!raw) return null
    const borrador = JSON.parse(raw) as BorradorAlta<V>
    return borrador.ownerId === ownerId ? borrador : null
  } catch {
    return null
  }
}

/**
 * Guarda el borrador. Si no entra (las fotos ocupan mucho), lo intenta sin
 * fotos: es mejor perder las fotos del borrador que todo lo demás.
 * @returns `true` si se guardó completo; `false` si se guardó sin fotos o no se pudo guardar.
 */
export function guardarBorrador<V extends { photos?: unknown[] }>(borrador: BorradorAlta<V>): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(ALTA_BORRADOR_KEY, JSON.stringify(borrador))
    return true
  } catch {
    try {
      const sinFotos = { ...borrador, values: { ...borrador.values, photos: [] } }
      window.localStorage.setItem(ALTA_BORRADOR_KEY, JSON.stringify(sinFotos))
    } catch {
      // Sin espacio ni para eso: se sigue sin borrador.
    }
    return false
  }
}

/** Borra el borrador (al terminar el alta o al tocar "Empezar de nuevo"). */
export function borrarBorrador(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(ALTA_BORRADOR_KEY)
  } catch {
    // Sin acceso a localStorage no hay nada que borrar.
  }
}
