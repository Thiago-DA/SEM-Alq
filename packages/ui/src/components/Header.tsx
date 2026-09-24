'use client'

/**
 * Header.tsx — barra superior de la zona pública: logo, navegación, "Iniciar sesión" y "Publicar
 * propiedad", con menú Drawer en móvil.
 *
 * Quién lo usa: `PublicLayout`.
 */
import { useState } from 'react'
import { Button, Drawer } from 'antd'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { seed } from '../tokens/primitives'
import { useNextBridge } from '../providers/NextBridge'
import { LOGO } from '../assets/logo'
import styles from './Header.module.css'

/**
 * El link a `/design-system` (catálogo vivo) solo se muestra en desarrollo,
 * igual que `RoleSwitcher`: no es una pantalla del producto.
 */
const SHOW_DESIGN_SYSTEM_LINK = process.env.NODE_ENV !== 'production'

/**
 * Encabezado fijo de RentAR: logo, navegación, CTAs de sesión y menú
 * hamburguesa en mobile (`Drawer` de antd). Lo usan la landing y todas las
 * páginas públicas vía `PublicLayout`.
 *
 * Destinos (Sprint 1, ver `docs/MapaDePantallas.pdf`):
 * - Logo → `/`.
 * - "Buscar propiedades" → `/buscar` (US-34).
 * - "Cómo funciona" → la sección de la landing (`/#como-funciona`).
 * - "Iniciar sesión" → `/login` (US-39).
 * - "Publicar propiedad" → `/panel/propiedades/nueva` (US-01). Sin sesión,
 *   `proxy.ts` de apps/web lo manda a `/login?next=...` y vuelve después.
 *
 * NOTA: los botones usan `href` de antd (renderiza un `<a>` con el mismo
 * estilo de botón) en vez de envolverlos en un link: un `<button>` dentro
 * de un `<a>` es HTML inválido.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { ImageComponent, LinkComponent } = useNextBridge()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <LinkComponent href="/" className={styles.logoLink}>
          <ImageComponent src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="RentAR" style={{ height: '2.75rem', width: 'auto' }} priority />
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            RentAR — inicio
          </span>
        </LinkComponent>

        <nav aria-label="Navegación principal" className={styles.nav}>
          <LinkComponent href="/buscar">Buscar propiedades</LinkComponent>
          <a href="/#como-funciona">Cómo funciona</a>
          {SHOW_DESIGN_SYSTEM_LINK && <LinkComponent href="/design-system">Sistema de diseño</LinkComponent>}
        </nav>

        <div className={styles.desktopActions}>
          <Button type="text" href="/login" style={{ color: seed.blue, fontWeight: 600 }} data-testid="header-login-button">
            Iniciar sesión
          </Button>
          <Button type="primary" href="/panel/propiedades/nueva" data-testid="header-publish-button">
            Publicar propiedad
          </Button>
        </div>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen(true)}
          data-testid="header-menu-toggle"
        >
          <MenuOutlined style={{ fontSize: 20 }} />
        </button>
      </div>

      <Drawer
        id="mobile-menu"
        title={<ImageComponent src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="RentAR" style={{ height: '2.25rem', width: 'auto' }} />}
        placement="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        closeIcon={<CloseOutlined />}
        size={280}
      >
        <nav aria-label="Navegación móvil" className={styles.drawerNav}>
          <LinkComponent href="/buscar" onClick={() => setMenuOpen(false)}>
            Buscar propiedades
          </LinkComponent>
          <a href="/#como-funciona" onClick={() => setMenuOpen(false)}>
            Cómo funciona
          </a>
          {SHOW_DESIGN_SYSTEM_LINK && (
            <LinkComponent href="/design-system" onClick={() => setMenuOpen(false)}>
              Sistema de diseño
            </LinkComponent>
          )}
          <div className={styles.drawerActions}>
            <Button type="text" href="/login" style={{ color: seed.blue, fontWeight: 600, textAlign: 'left' }} block data-testid="header-drawer-login-button">
              Iniciar sesión
            </Button>
            <Button type="primary" href="/panel/propiedades/nueva" block data-testid="header-drawer-publish-button">
              Publicar propiedad
            </Button>
          </div>
        </nav>
      </Drawer>
    </header>
  )
}
