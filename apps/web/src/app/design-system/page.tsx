import type { Metadata } from 'next'
import DesignSystem from '@/components/DesignSystem'

export const metadata: Metadata = {
  title: 'Sistema de Diseño — RentAR',
  description: 'Referencia visual e interactiva del sistema de diseño de RentAR: colores, tipografía, espaciado, componentes y reglas de uso.',
}

export default function Page() {
  return <DesignSystem />
}
