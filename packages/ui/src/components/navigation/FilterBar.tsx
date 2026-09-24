'use client'

/**
 * FilterBar.tsx — barra de búsqueda y chips de estado para listados.
 *
 * Quién lo usa: el catálogo `/design-system`.
 */
import type { ReactNode } from 'react'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import styles from './FilterBar.module.css'

/** Un chip de estado de la barra de filtros. */
export interface FilterBarStatusOption {
  value: string
  label: string
}

/** Props de {@link FilterBar}. */
interface FilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  statusOptions: FilterBarStatusOption[]
  /** `'todos'` (o el `value` que corresponda) no está implícito — quien arme `statusOptions` decide si incluye una opción "todos". */
  statusValue: string
  onStatusChange: (value: string) => void
  /** Botón(es) a la derecha, ej. "+ Nueva propiedad". */
  actions?: ReactNode
  'data-testid'?: string
}

/**
 * Barra de filtros del arquetipo A4 (buscador + chips de estado + acción):
 * el patrón que hoy se repite dibujado a mano en `/panel/propiedades`,
 * `/panel/solicitudes`, `/panel/contratos`, `/panel/cobros`,
 * `/panel/reclamos` y `/admin/usuarios`.
 */
export function FilterBar({ searchValue, onSearchChange, searchPlaceholder = 'Buscar...', statusOptions, statusValue, onStatusChange, actions, ...rest }: FilterBarProps) {
  return (
    <div className={styles.wrap} {...rest}>
      <Input
        prefix={<SearchOutlined className={styles.searchIcon} />}
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
        allowClear
        data-testid="filter-bar-search"
      />

      <div className={styles.chips} role="group" aria-label="Filtrar por estado">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={statusValue === option.value}
            className={`${styles.chip} ${statusValue === option.value ? styles.chipActive : ''}`}
            onClick={() => onStatusChange(option.value)}
            data-testid="filter-bar-status-chip"
          >
            {option.label}
          </button>
        ))}
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
