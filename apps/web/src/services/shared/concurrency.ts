/**
 * shared/concurrency.ts — correr pedidos en paralelo, pero de a pocos.
 *
 * Qué es: un `Promise.all` con tope. Se usa cuando el back obliga a pedir
 * algo por cada elemento de una lista (el "N+1" de `/buscar`, ver
 * `propiedades.service.ts`): así no se disparan decenas de pedidos juntos
 * contra la API cuando haya más propiedades.
 *
 * Quién lo usa: la rama real de `propiedades.service.ts`.
 */

/**
 * Aplica `fn` a cada elemento, con a lo sumo `limite` pedidos en curso a la
 * vez. Devuelve los resultados en el mismo orden que `items` (como
 * `Promise.all`). Si `fn` rechaza, el rechazo se propaga (quien llama decide
 * si atraparlo dentro de `fn`).
 *
 * @example
 * const detalles = await mapConLimite(ids, 5, (id) => apiRequest(`/inmuebles/${id}`))
 */
export async function mapConLimite<T, R>(items: readonly T[], limite: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const resultados = new Array<R>(items.length)
  let siguiente = 0

  // Cada "trabajador" toma el próximo índice libre hasta que no quede ninguno.
  async function trabajador(): Promise<void> {
    while (siguiente < items.length) {
      const index = siguiente++
      resultados[index] = await fn(items[index], index)
    }
  }

  const cantidad = Math.max(1, Math.min(limite, items.length))
  await Promise.all(Array.from({ length: cantidad }, trabajador))
  return resultados
}
