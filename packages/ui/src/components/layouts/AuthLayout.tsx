'use client'

/**
 * AuthLayout.tsx — layout de login y registro (arquetipo A2): tarjeta centrada con el logo.
 *
 * Diseño: "Autenticación" · 01-04.
 * Quién lo usa: `/login`, `/registro`, `/recuperar` y el catálogo.
 */
import type { ReactNode } from 'react'
import { useNextBridge } from '../../providers/NextBridge'
import { LOGO } from '../../assets/logo'
import styles from './AuthLayout.module.css'

/** Props de {@link AuthLayout}. */
interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  /**
   * Si es `true`, usa `min-height: 100%` en vez de `100vh` — para
   * previsualizarlo dentro de un contenedor acotado (ej. el catálogo de
   * /design-system) sin que el alto de viewport rompa el recorte. `false`
   * (el default) es lo correcto para una página de login real.
   */
  compact?: boolean
  'data-testid'?: string
}

/** Layout de login/registro: tarjeta centrada con el logo, título y el formulario. */
export function AuthLayout({ title, subtitle, children, compact = false, ...rest }: AuthLayoutProps) {
  const { ImageComponent } = useNextBridge()

  return (
    <div className={`${styles.wrap} ${compact ? styles.wrapCompact : ''}`} {...rest}>
      <div className={styles.card}>
        <ImageComponent src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="RentAR" className={styles.logo} priority />
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
