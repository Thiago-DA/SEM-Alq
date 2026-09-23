import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Expone si un elemento está actualmente en el viewport, vía
 * `IntersectionObserver`. Se usa para animar la entrada/salida de secciones
 * en scroll (ver `HowItWorks`) — a diferencia de una animación de una sola
 * vez, alterna en ambos sentidos: una sección ya vista se vuelve a animar si
 * el usuario sale y vuelve a entrar en ella.
 *
 * @param threshold Proporción del elemento visible necesaria para considerarlo "en vista" (0 a 1).
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  threshold = 0.3,
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}
