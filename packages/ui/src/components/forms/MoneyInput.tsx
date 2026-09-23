'use client'

import { InputNumber } from 'antd'

/** Da formato de miles al valor mostrado (ej. `550000` -> "$ 550.000"). */
function formatDisplay(value: number | undefined): string {
  if (value === undefined) return ''
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Revierte {@link formatDisplay} a un número editable. */
function parseDisplay(displayValue: string | undefined): number {
  if (!displayValue) return 0
  return Number(displayValue.replace(/\$\s?|(\.)/g, ''))
}

/** Props de {@link MoneyInput}. */
interface MoneyInputProps {
  value?: number
  onChange?: (value: number) => void
  placeholder?: string
  min?: number
  max?: number
  'data-testid'?: string
}

/**
 * `InputNumber` con formato de pesos argentinos ya aplicado — mismo
 * formatter/parser que usa el buscador de la landing (`SearchBar`), acá
 * reutilizable para cualquier campo de monto del panel (precio de
 * publicación, monto de un cobro, etc.).
 */
export function MoneyInput({ value, onChange, placeholder, min = 0, max, ...rest }: MoneyInputProps) {
  return (
    <InputNumber
      style={{ width: '100%' }}
      controls={false}
      min={min}
      max={max}
      step={5000}
      value={value}
      onChange={(next) => onChange?.(next ?? 0)}
      formatter={formatDisplay}
      parser={parseDisplay}
      placeholder={placeholder}
      {...rest}
    />
  )
}
