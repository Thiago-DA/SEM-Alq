/**
 * FormAlert.tsx — aviso de error arriba de un formulario de autenticación.
 *
 * Qué es: el bloque rojo con "!" de "Autenticación" · 02 ("El email o la
 * contraseña no coinciden"), que dice qué pasó y qué hacer (RNF-09).
 * `role="alert"` hace que el lector de pantalla lo anuncie apenas aparece.
 *
 * Quién lo usa: `LoginForm` (credenciales incorrectas, US-39) y
 * `RegistroForm` (mail ya registrado, US-19).
 */
import type { ReactNode } from 'react'
import styles from './FormAlert.module.css'

interface FormAlertProps {
  title: string
  /** Qué puede hacer la persona (puede incluir links). */
  description?: ReactNode
  'data-testid'?: string
}

/** Aviso de error de formulario: título en rojo y una línea de ayuda. */
export function FormAlert({ title, description, ...rest }: FormAlertProps) {
  return (
    <div className={styles.alert} role="alert" {...rest}>
      <span className={styles.icon} aria-hidden="true">
        !
      </span>
      <div className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
    </div>
  )
}
