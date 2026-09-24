'use client'

/**
 * OnboardingChecklist.tsx — checklist vertical de primeros pasos (listo, activo, bloqueado).
 *
 * Quién lo usa: el catálogo `/design-system`. NOTA: el onboarding de `/panel` sigue el template
 * "Panel de inicio" · 02 (tres tarjetas) y se compone en `apps/web`.
 */
import { CheckCircleFilled, LockOutlined } from '@ant-design/icons'
import { useNextBridge } from '../../providers/NextBridge'
import styles from './OnboardingChecklist.module.css'

/** Un paso del checklist; con `href` y sin bloqueo, se puede tocar. */
export interface OnboardingChecklistItem {
  key: string
  label: string
  status: 'listo' | 'activo' | 'bloqueado'
  /** Por qué está bloqueado, si `status === 'bloqueado'` (ej. "Publicá una propiedad primero"). */
  motivoBloqueo?: string
  href?: string
}

/** Props de {@link OnboardingChecklist}. */
interface OnboardingChecklistProps {
  title?: string
  items: OnboardingChecklistItem[]
  'data-testid'?: string
}

/**
 * Checklist de onboarding del panel vacío (locador y locatario nuevos, ver
 * `docs/MapaDePantallas.pdf`): una sola tarjeta vertical con los pasos y un
 * contador "x/y completado" — a propósito NO es una fila de tarjetas
 * idénticas ícono+heading+párrafo (patrón que `docs/DESIGN.md` rechaza
 * explícitamente).
 */
export function OnboardingChecklist({ title = 'Primeros pasos', items, ...rest }: OnboardingChecklistProps) {
  const { LinkComponent } = useNextBridge()
  const completados = items.filter((item) => item.status === 'listo').length

  return (
    <div className={styles.wrap} {...rest}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.counter}>
          {completados}/{items.length} completado{completados === 1 ? '' : 's'}
        </span>
      </div>

      <ol className={styles.list}>
        {items.map((item) => {
          const contenido = (
            <>
              <span className={styles.icon} aria-hidden="true">
                {item.status === 'listo' && <CheckCircleFilled className={styles.iconListo} />}
                {item.status === 'bloqueado' && <LockOutlined className={styles.iconBloqueado} />}
                {item.status === 'activo' && <span className={styles.iconActivo} />}
              </span>
              <span className={styles.label}>{item.label}</span>
              {item.status === 'bloqueado' && item.motivoBloqueo && <span className={styles.motivo}>{item.motivoBloqueo}</span>}
            </>
          )

          return (
            <li key={item.key} className={`${styles.item} ${styles[`item_${item.status}`]}`} data-testid="onboarding-checklist-item">
              {item.href && item.status !== 'bloqueado' ? (
                <LinkComponent href={item.href} className={styles.itemLink}>
                  {contenido}
                </LinkComponent>
              ) : (
                <span className={styles.itemStatic}>{contenido}</span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
