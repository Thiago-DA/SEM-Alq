import type { ReactNode } from 'react'
import { Header } from '../Header'
import { Footer } from '../Footer'

/** Props de {@link PublicLayout}. */
interface PublicLayoutProps {
  children: ReactNode
}

/**
 * Layout de las páginas públicas (landing, y cualquier página pública
 * futura): `Header` + `<main>` + `Footer`, siempre los mismos en todo el
 * sitio público. `Landing` lo usa para armar la página de inicio.
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
