import { useState } from 'react'
import { MoneyInput } from '@rentar/ui'

export const Default = () => {
  const [value, setValue] = useState(450000)
  return <MoneyInput value={value} onChange={setValue} placeholder="Monto mensual" />
}
