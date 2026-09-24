'use client'

/**
 * SearchFilters.tsx — barra horizontal de filtros de búsqueda (versión de `@rentar/ui` del buscador
 * de la landing).
 *
 * Quién lo usa: el catálogo `/design-system`.
 */
import { useState } from 'react'
import { Button, Col, Drawer, InputNumber, Row, Select, Slider, Tag } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import type { CharacteristicKey, FilterState, Neighborhood } from '@rentar/shared-types'
import styles from './SearchFilters.module.css'

interface CharacteristicOption {
  key: CharacteristicKey
  label: string
}

/** Props de {@link SearchFilters}. */
interface SearchFiltersProps {
  neighborhoods: Neighborhood[]
  characteristics: CharacteristicOption[]
  value: FilterState
  onChange: (value: FilterState) => void
  /** Si se pasa, se anuncia con `role="status"` debajo de los filtros. */
  resultCount?: number
  'data-testid'?: string
}

/**
 * Panel de filtros de `/buscar`: zona, tipología, dormitorios, rango de
 * precio y características. Versión de `@rentar/ui` de lo que hoy es
 * `SearchBar` de la landing (que importa los barrios/características
 * directo de `lib/data`) — acá se reciben por props para no atar el
 * componente a los mocks de `apps/web`.
 *
 * En desktop se ve entera; en mobile los controles avanzados (tipología,
 * dormitorios, precio) quedan detrás de un botón "Filtros" que abre un
 * `Drawer` (ver `docs/MapaDePantallas.pdf`, ficha de `SearchFilters`).
 */
export function SearchFilters({ neighborhoods, characteristics, value, onChange, resultCount, ...rest }: SearchFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const camposAvanzados = (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
        <label className={styles.label} htmlFor="search-filters-tipologia">
          Tipología
        </label>
        <Select
          id="search-filters-tipologia"
          className={styles.control}
          value={value.type}
          onChange={(type: FilterState['type']) => onChange({ ...value, type })}
          data-testid="search-filters-type-select"
          options={[
            { value: 'todos', label: 'Todas' },
            { value: 'departamento', label: 'Departamento' },
            { value: 'casa', label: 'Casa' },
            { value: 'ph', label: 'PH' },
          ]}
        />
      </Col>

      <Col xs={24} sm={12}>
        <label className={styles.label} htmlFor="search-filters-dormitorios">
          Dormitorios
        </label>
        <Select
          id="search-filters-dormitorios"
          className={styles.control}
          value={String(value.bedrooms)}
          onChange={(bedrooms: string) => onChange({ ...value, bedrooms: bedrooms === 'todos' ? 'todos' : Number(bedrooms) })}
          data-testid="search-filters-bedrooms-select"
          options={[
            { value: 'todos', label: 'Todos' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3 o más' },
          ]}
        />
      </Col>

      <Col xs={24}>
        <label className={styles.label} htmlFor="search-filters-precio">
          Precio mensual
        </label>
        <Slider
          id="search-filters-precio"
          range
          min={0}
          max={1500000}
          step={5000}
          value={[value.minPrice, value.maxPrice]}
          onChange={([minPrice, maxPrice]) => onChange({ ...value, minPrice, maxPrice })}
          data-testid="search-filters-price-slider"
        />
        <div className={styles.priceInputs}>
          <InputNumber
            min={0}
            max={value.maxPrice}
            step={5000}
            value={value.minPrice}
            onChange={(minPrice) => onChange({ ...value, minPrice: minPrice ?? 0 })}
            aria-label="Precio mínimo"
          />
          <InputNumber
            min={value.minPrice}
            max={1500000}
            step={5000}
            value={value.maxPrice}
            onChange={(maxPrice) => onChange({ ...value, maxPrice: maxPrice ?? 1500000 })}
            aria-label="Precio máximo"
          />
        </div>
      </Col>
    </Row>
  )

  return (
    <div className={styles.wrap} {...rest}>
      <Row gutter={[16, 16]} align="bottom">
        <Col xs={24} sm={12} lg={8}>
          <label className={styles.label} htmlFor="search-filters-barrio">
            Zona
          </label>
          <Select
            id="search-filters-barrio"
            className={styles.control}
            value={value.neighborhoodSlug}
            onChange={(neighborhoodSlug: string) => onChange({ ...value, neighborhoodSlug })}
            data-testid="search-filters-neighborhood-select"
            options={[{ value: 'todos', label: 'Todos los barrios' }, ...neighborhoods.map((n) => ({ value: n.slug, label: n.name }))]}
          />
        </Col>

        <Col xs={24} sm={12} lg={16} className={styles.desktopOnly}>
          {camposAvanzados}
        </Col>

        <Col xs={24} className={styles.mobileOnly}>
          <Button icon={<FilterOutlined />} onClick={() => setDrawerOpen(true)} data-testid="search-filters-open-drawer">
            Filtros
          </Button>
        </Col>
      </Row>

      <div className={styles.characteristics}>
        <p className={styles.legend} id="search-filters-characteristics-legend">
          Características
        </p>
        <Tag.CheckableTagGroup
          multiple
          aria-labelledby="search-filters-characteristics-legend"
          data-testid="search-filters-characteristics-chips"
          options={characteristics.map((c) => ({ value: c.key, label: c.label }))}
          value={value.characteristics}
          onChange={(characteristicsValue) => onChange({ ...value, characteristics: characteristicsValue as CharacteristicKey[] })}
        />
      </div>

      {resultCount !== undefined && (
        <p className={styles.resultCount} role="status" data-testid="search-filters-result-count">
          {resultCount} {resultCount === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
        </p>
      )}

      {/* Sin clase mobileOnly acá: el Drawer solo se abre desde el botón "Filtros", que ya es mobile-only — en desktop nunca llega a montarse. */}
      <Drawer title="Filtros" placement="bottom" size="large" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {camposAvanzados}
        <Button type="primary" block onClick={() => setDrawerOpen(false)} className={styles.drawerApply}>
          Ver resultados
        </Button>
      </Drawer>
    </div>
  )
}
