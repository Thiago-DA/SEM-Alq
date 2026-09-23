import type { ReactNode } from 'react'
import styles from './ProcessLoopMotif.module.css'

interface LoopNode {
  cx: number
  cy: number
  icon: ReactNode
}

const nodes: LoopNode[] = [
  {
    // Buscar
    cx: 100,
    cy: 38,
    icon: (
      <>
        <circle cx="10" cy="10" r="6" stroke="#004D98" strokeWidth="2" fill="none" />
        <path d="M14.5 14.5L20 20" stroke="#004D98" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    // Contactar
    cx: 162,
    cy: 100,
    icon: (
      <path d="M4 5h16v11H9l-5 4V5z" stroke="#004D98" strokeWidth="2" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    // Firmar
    cx: 100,
    cy: 162,
    icon: (
      <path
        d="M4 19l4-1 10-10-3-3L5 15l-1 4z M15 5l3 3"
        stroke="#004D98"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    // Pagar
    cx: 38,
    cy: 100,
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#004D98" strokeWidth="2" fill="none" />
        <path d="M8 12l2.5 2.5L16 9" stroke="#004D98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
]

const nodeClasses = [styles.loopNode0, styles.loopNode1, styles.loopNode2, styles.loopNode3]

/** Props de {@link ProcessLoopMotif}. */
interface ProcessLoopMotifProps {
  /** Clases extra para posicionar el contenedor desde el componente padre (ej. Hero). */
  className?: string
}

/**
 * Pieza insignia del sistema de diseño: diagrama circular animado de las 4
 * etapas del proceso (buscar → contactar → firmar → pagar), con un punto
 * dorado que recorre el círculo y pulsa cada nodo al llegar. Cada nodo se
 * envuelve en un `<g>` de posicionamiento estático + un `<g>` interno
 * animado (ver DESIGN.md, "Do's and Don'ts") porque mezclar el atributo
 * `transform` de posicionamiento con una animación CSS de `transform` en el
 * mismo nodo SVG hace que el navegador descarte el atributo.
 */
export default function ProcessLoopMotif({ className }: ProcessLoopMotifProps) {
  return (
    <div className={`${styles.container} ${className ?? ''}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className={styles.svg}>
        <circle
          cx="100"
          cy="100"
          r="62"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="2"
          strokeDasharray="3 7"
          strokeLinecap="round"
        />

        {nodes.map((node, index) => (
          <g key={index} transform={`translate(${node.cx} ${node.cy})`}>
            <g className={`${styles.loopNode} ${nodeClasses[index]}`}>
              <circle r="19" fill="#ffffff" />
              <g transform="translate(-9 -9) scale(0.75)">{node.icon}</g>
            </g>
          </g>
        ))}

        <circle className={styles.loopDot} r="5" fill="#D7B15D" />
      </svg>
    </div>
  )
}
