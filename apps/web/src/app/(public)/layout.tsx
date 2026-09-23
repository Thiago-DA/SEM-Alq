import type { ReactNode } from 'react'
// Import directo (no del barrel @rentar/ui): ese barrel también re-exporta
// statusMeta (usa @ant-design/icons, que llama createContext a nivel de
// módulo) — createContext no existe en el runtime "react-server" que usa
// este layout (Server Component). Mismo motivo que en app/layout.tsx.
import { PublicLayout } from '@rentar/ui/src/components/layouts/PublicLayout'

/**
 * layout.tsx — arquetipo A1 (zona pública), compartido por `/`, `/buscar`,
 * `/propiedad/[id]` y `/planes`. Layout anidado (no root): el root layout
 * (`app/layout.tsx`) ya pone `<html>`/`<body>`/`AntdRegistry`/
 * `ConfigProvider` una sola vez — duplicarlos acá causaría el
 * "full page reload" que Next 16 documenta entre root layouts distintos.
 *
 * Quién lo usa: todas las pantallas de la zona pública, sin sesión
 * obligatoria (ver `docs/MapaDePantallas.pdf`, sección "1 Zona pública").
 */
export default function PublicRouteGroupLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>
}
