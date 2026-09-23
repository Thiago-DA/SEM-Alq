import { DataTable, StatusTag, MoneyAmount } from '@rentar/ui'

interface Fila {
  id: string
  propiedad: string
  inquilino: string
  estado: 'publicada' | 'pausada' | 'alquilada' | 'alquilada_publicada'
  monto: number
}

const filas: Fila[] = [
  { id: 'CT-2026-0148', propiedad: 'Obispo Trejo 1250 7°B — Nueva Córdoba', inquilino: 'Sofía Ledesma', estado: 'alquilada', monto: 470000 },
  { id: 'CT-2026-0207', propiedad: 'Rondeau 480 PB — Güemes', inquilino: 'Julieta Peralta', estado: 'alquilada', monto: 385000 },
  { id: 'prop-4', propiedad: 'Belgrano 1120 — Centro', inquilino: '—', estado: 'alquilada_publicada', monto: 410000 },
  { id: 'prop-6', propiedad: 'Fructuoso Rivera 785 — Cofico', inquilino: '—', estado: 'publicada', monto: 340000 },
  { id: 'prop-7', propiedad: 'Chacabuco 690 — Alta Córdoba', inquilino: '—', estado: 'pausada', monto: 295000 },
]

const columns = [
  { key: 'propiedad', title: 'Propiedad', render: (f: Fila) => f.propiedad },
  { key: 'inquilino', title: 'Inquilino', render: (f: Fila) => f.inquilino },
  { key: 'estado', title: 'Estado', render: (f: Fila) => <StatusTag domain="propiedad" status={f.estado} /> },
  { key: 'monto', title: 'Monto', render: (f: Fila) => <MoneyAmount amount={f.monto} size="sm" /> },
]

/** Listado de propiedades del locador — 5 filas reales del elenco, con StatusTag y MoneyAmount en las columnas. */
export function Default() {
  return <DataTable columns={columns} data={filas} rowKey={(f) => f.id} />
}

/** Estado vacío — sin propiedades cargadas todavía. */
export function SinResultados() {
  return <DataTable columns={columns} data={[]} rowKey={(f: Fila) => f.id} emptyDescription="Todavía no hay propiedades cargadas." />
}
