/**
 * FormSection.tsx — sección de formulario con título y descripción.
 *
 * Quién lo usa: los pasos del alta (US-01) y el catálogo.
 */
import type { ReactNode } from 'react'
import styles from './FormSection.module.css'

/** Props de {@link FormSection}. */
interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  'data-testid'?: string
}

/** Agrupa un bloque de campos de formulario bajo un título y descripción opcional. */
export function FormSection({ title, description, children, ...rest }: FormSectionProps) {
  return (
    <section className={styles.section} {...rest}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {children}
    </section>
  )
}
