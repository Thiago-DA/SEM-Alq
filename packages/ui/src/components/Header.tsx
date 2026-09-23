'use client'

import { useState } from 'react'
import { Button, Drawer } from 'antd'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { seed } from '../tokens/primitives'
import { useNextBridge } from '../providers/NextBridge'
import { LOGO } from '../assets/logo'
import styles from './Header.module.css'

/**
 * Encabezado fijo de RentAR: logo, navegación de anclas, CTAs de sesión
 * (placeholders sin destino todavía, ver docs/PRODUCT.md) y menú hamburguesa
 * en mobile (`Drawer` de antd). Lo usan tanto la landing como `PublicLayout`.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { ImageComponent, LinkComponent } = useNextBridge()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#inicio" className={styles.logoLink}>
          <ImageComponent src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="RentAR" style={{ height: '2.75rem', width: 'auto' }} priority />
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            RentAR — inicio
          </span>
        </a>

        <nav aria-label="Navegación principal" className={styles.nav}>
          <a href="#buscar">Buscar propiedades</a>
          <a href="#como-funciona">Cómo funciona</a>
          <LinkComponent href="/design-system">Sistema de diseño</LinkComponent>
        </nav>

        <div className={styles.desktopActions}>
          <Button type="text" style={{ color: seed.blue, fontWeight: 600 }} data-testid="header-login-button">
            Iniciar sesión
          </Button>
          <Button type="primary" data-testid="header-publish-button">
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
          <a href="#buscar" onClick={() => setMenuOpen(false)}>
            Buscar propiedades
          </a>
          <a href="#como-funciona" onClick={() => setMenuOpen(false)}>
            Cómo funciona
          </a>
          <LinkComponent href="/design-system" onClick={() => setMenuOpen(false)}>
            Sistema de diseño
          </LinkComponent>
          <div className={styles.drawerActions}>
            <Button type="text" style={{ color: seed.blue, fontWeight: 600, textAlign: 'left' }} block>
              Iniciar sesión
            </Button>
            <Button type="primary" block>
              Publicar propiedad
            </Button>
          </div>
        </nav>
      </Drawer>
    </header>
  )
}
