/**
 * shared/delay.ts — latencia simulada de la rama mock.
 *
 * Qué es: cada función mock espera un poco antes de responder, para que las
 * pantallas muestren su estado de carga igual que con el backend real.
 * Quién lo usa: la rama mock de cada `services/*.service.ts`.
 */

/** Espera `ms` milisegundos (400 por defecto). */
export function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
