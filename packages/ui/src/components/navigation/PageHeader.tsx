import type { ReactNode } from 'react'
import { Breadcrumb } from 'antd'
import styles from './PageHeader.module.css'

interface BreadcrumbItem {
  label: string
  href?: string
}

/** Props de {@link PageHeader}. */
interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbItem[]
  actions?: ReactNode
  'data-testid'?: string
}

/** Encabezado estándar de una pantalla del panel: breadcrumb, título, subtítulo y acciones. */
export function PageHeader({ title, subtitle, breadcrumb, actions, ...rest }: PageHeaderProps) {
  return (
    <div className={styles.wrap} {...rest}>
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb
          className={styles.breadcrumb}
          items={breadcrumb.map((item) => ({ title: item.href ? <a href={item.href}>{item.label}</a> : item.label }))}
        />
      )}
      <div className={styles.top}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  )
}
