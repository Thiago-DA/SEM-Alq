'use client'

/**
 * RoleSwitcher.tsx — herramientas flotantes de desarrollo (pestaña al borde izquierdo). No
 * renderiza nada en producción.
 *
 * Quién lo usa: `apps/web/src/components/dev/DevTools.tsx`.
 */
import { Button, Segmented } from 'antd'
import { ReloadOutlined, ToolOutlined } from '@ant-design/icons'
import type { UserRole } from '@rentar/shared-types'
import styles from './RoleSwitcher.module.css'

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'Locador', value: 'locador' },
  { label: 'Locatario', value: 'locatario' },
  { label: 'Garante', value: 'garante' },
  { label: 'Admin', value: 'admin' },
]

/** Props de {@link RoleSwitcher}. */
interface RoleSwitcherProps {
  /** Rol que se está previsualizando. Si no se pasa (junto con `onChange`), el selector de rol no se dibuja. */
  role?: UserRole
  onChange?: (role: UserRole) => void
  /**
   * Si se pasa, dibuja el botón "Reiniciar datos de prueba": vuelve los
   * datos mock al elenco original (lo implementa `apps/web`, que es quien
   * sabe dónde viven esos datos).
   */
  onResetMockData?: () => void
  'data-testid'?: string
}

/**
 * Herramienta flotante de desarrollo: selector para previsualizar un rol sin
 * autenticación real y botón para reiniciar los datos de prueba. Se pliega
 * en una pestaña chica pegada al borde izquierdo, a media altura, para no
 * tapar barras inferiores (el pie del wizard, por ejemplo) ni el `Drawer`
 * de antd (que queda por encima: `--rentar-z-sticky` < z-index del Drawer).
 *
 * Solo de desarrollo: no renderiza nada si `NODE_ENV === 'production'`, así
 * nunca llega a un build de producción.
 */
export function RoleSwitcher({ role, onChange, onResetMockData, ...rest }: RoleSwitcherProps) {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <details className={styles.wrap} {...rest}>
      <summary className={styles.summary} aria-label="Herramientas de desarrollo" data-testid="dev-tools-toggle">
        <ToolOutlined />
      </summary>
      <div className={styles.panel}>
        {role && onChange && (
          <Segmented value={role} onChange={(value) => onChange(value as UserRole)} options={ROLE_OPTIONS} />
        )}
        {onResetMockData && (
          <Button size="small" icon={<ReloadOutlined />} onClick={onResetMockData} data-testid="dev-tools-reset-mock-data">
            Reiniciar datos de prueba
          </Button>
        )}
      </div>
    </details>
  )
}
