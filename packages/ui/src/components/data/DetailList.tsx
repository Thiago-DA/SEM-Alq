/**
 * DetailList.tsx — lista de pares etiqueta/valor (resúmenes y fichas).
 *
 * Quién lo usa: la revisión del alta (US-01) y el catálogo `/design-system`.
 */
import type { ReactNode } from 'react'
import { Descriptions } from 'antd'

interface DetailItem {
  label: string
  value: ReactNode
}

/** Props de {@link DetailList}. */
interface DetailListProps {
  items: DetailItem[]
  title?: string
  /** Columnas del grid label/valor. @default 1 */
  column?: number
  'data-testid'?: string
}

/**
 * Lista de pares label/valor para vistas de detalle (ficha de propiedad,
 * resumen de contrato). Wrapper fino de `Descriptions` de antd para no
 * repetir `bordered={false}` y el mapeo de `items` en cada pantalla.
 */
export function DetailList({ items, title, column = 1, ...rest }: DetailListProps) {
  return (
    <Descriptions title={title} column={column} bordered={false} {...rest}>
      {items.map((item) => (
        <Descriptions.Item key={item.label} label={item.label}>
          {item.value}
        </Descriptions.Item>
      ))}
    </Descriptions>
  )
}
