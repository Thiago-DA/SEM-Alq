'use client'

/**
 * Footer.tsx — pie de la zona pública (links, contacto y marca).
 *
 * Quién lo usa: `PublicLayout`.
 */
import { useNextBridge } from '../providers/NextBridge'
import { LOGO } from '../assets/logo'
import styles from './Footer.module.css'

/**
 * Pie de página de RentAR: logo, tagline, links y nota legal. Lo usan la
 * landing y todas las páginas públicas vía `PublicLayout`. Mismos destinos
 * que `Header`: "Buscar propiedades" → `/buscar`, "Cómo funciona" → la
 * sección de la landing.
 */
export function Footer() {
  const { ImageComponent, LinkComponent } = useNextBridge()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <ImageComponent src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="RentAR" style={{ height: '2.25rem', width: 'auto' }} />
            <p className={styles.tagline}>
              Alquileres residenciales de larga duración entre particulares. Piloto en la
              ciudad de Córdoba, Argentina.
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página" className={styles.nav}>
            <LinkComponent href="/buscar">Buscar propiedades</LinkComponent>
            <a href="/#como-funciona">Cómo funciona</a>
          </nav>
        </div>

        <p className={styles.legal}>
          Proyecto académico — Seminario Integrador, Ingeniería en Sistemas de Información,
          UTN Facultad Regional Córdoba, 2026. Propiedades y datos de esta demo son
          ilustrativos.
        </p>
      </div>
    </footer>
  )
}
