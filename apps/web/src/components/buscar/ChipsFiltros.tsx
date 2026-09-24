'use client'

/**
 * ChipsFiltros.tsx — la fila "Filtros activos" de `/buscar` (US-34).
 *
 * Qué es: la ubicación elegida (chip azul fijo, sin ✕), un chip por cada
 * filtro aplicado (con ✕ para sacarlo) y "Limpiar todo" (US-34: "quitar los
 * filtros aplicados y que vuelvan a mostrarse todas"). Diseño: "Búsqueda de
 * propiedades" · 01 (escritorio) y 03 (móvil: se ven dos chips y "+N").
 *
 * Quién lo usa: `BuscarPropiedades`.
 */
import { useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import type { ChipFiltro } from '@/lib/search/filtrosActivos'
import styles from './Buscar.module.css'

interface ChipsFiltrosProps {
  /** "Córdoba · Córdoba Capital", o `null` si no hay ubicación elegida. */
  ubicacion: string | null
  chips: ChipFiltro[]
  onQuitar: (chip: ChipFiltro) => void
  onLimpiarTodo: () => void
}

/** En móvil se ven estos chips y un "+N" que despliega el resto. */
const CHIPS_VISIBLES_MOVIL = 2

/** Fila de filtros activos con sus chips removibles. */
export function ChipsFiltros({ ubicacion, chips, onQuitar, onLimpiarTodo }: ChipsFiltrosProps) {
  const [verTodosMovil, setVerTodosMovil] = useState(false)
  const ocultosMovil = verTodosMovil ? 0 : Math.max(0, chips.length - CHIPS_VISIBLES_MOVIL)

  if (!ubicacion && chips.length === 0) return null

  return (
    <div className={styles.chipsRow} data-testid="buscar-filtros-activos">
      <span className={styles.chipsTitle}>Filtros activos</span>
      {ubicacion && <span className={styles.chipLocation}>{ubicacion}</span>}
      {chips.map((chip, index) => (
        <button
          key={chip.key}
          type="button"
          // En móvil, a partir del tercero se ocultan hasta tocar "+N".
          className={`${styles.chip} ${index >= CHIPS_VISIBLES_MOVIL && !verTodosMovil ? styles.hideOnMobile : ''}`}
          onClick={() => onQuitar(chip)}
          aria-label={`Quitar filtro ${chip.label}`}
          data-testid={`buscar-chip-${chip.key}`}
        >
          {chip.label}
          <CloseOutlined className={styles.chipClose} aria-hidden="true" />
        </button>
      ))}
      {ocultosMovil > 0 && (
        <button type="button" className={`${styles.chipMore} ${styles.mobileOnly}`} onClick={() => setVerTodosMovil(true)} data-testid="buscar-chips-mas">
          +{ocultosMovil}
        </button>
      )}
      {chips.length > 0 && (
        <button type="button" className={styles.clearAll} onClick={onLimpiarTodo} data-testid="buscar-limpiar-todo">
          Limpiar todo
        </button>
      )}
    </div>
  )
}
