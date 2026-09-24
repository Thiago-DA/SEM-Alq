'use client'

/**
 * RolStep.tsx — paso 1 del registro: "¿Qué querés hacer en RentAR?" (US-19).
 *
 * Qué es: dos tarjetas de selección única ("Quiero alquilar" / "Quiero
 * publicar mis propiedades"), el indicador "Paso 1 de 2" y "Continuar", que
 * se habilita recién al elegir una opción. Diseño: Claude Design,
 * "Autenticación" · 03a.
 *
 * Accesibilidad: las tarjetas son un `radiogroup` con `role="radio"`; con las
 * flechas se cambia de opción, igual que en un grupo de radios nativo.
 *
 * Quién lo usa: `RegistroForm` (el título y el subtítulo los pone el
 * `AuthLayout` de ese componente).
 */
import type { KeyboardEvent } from 'react'
import Link from 'next/link'
import { Button } from 'antd'
import type { RolRegistro } from './RegistroForm'
import styles from './AuthForm.module.css'

interface RolOption {
  value: RolRegistro
  title: string
  description: string
}

/** Las dos opciones, con los textos del diseño. */
const ROL_OPTIONS: RolOption[] = [
  { value: 'locatario', title: 'Quiero alquilar', description: 'Buscá propiedades, postulate y seguí tu contrato y tus pagos.' },
  { value: 'locador', title: 'Quiero publicar mis propiedades', description: 'Publicá tus inmuebles, elegí inquilinos y cobrá el alquiler.' },
]

interface RolStepProps {
  /** Rol elegido; `null` = todavía ninguno ("Continuar" deshabilitado). */
  value: RolRegistro | null
  onChange: (rol: RolRegistro) => void
  onContinue: () => void
  /** Link de "¿Ya tenés cuenta? Iniciá sesión" (conserva el `next`). */
  loginHref: string
}

/** Paso 1 del registro: elegir el rol inicial. */
export function RolStep({ value, onChange, onContinue, loginHref }: RolStepProps) {
  /** Flechas: pasan a la otra opción (son solo dos) y le dan el foco. */
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = (index + 1) % ROL_OPTIONS.length
    onChange(ROL_OPTIONS[nextIndex].value)
    const group = event.currentTarget.parentElement
    const nextButton = group?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]
    nextButton?.focus()
  }

  return (
    <div className={styles.stepRol}>
      <div className={styles.progress} aria-hidden="true">
        <span className={styles.progressBars}>
          <span className={`${styles.progressBar} ${styles.progressBarDone}`} />
          <span className={styles.progressBar} />
        </span>
      </div>
      <span className={styles.progressLabel}>Paso 1 de 2</span>

      <div role="radiogroup" aria-label="¿Qué querés hacer en RentAR?" className={styles.roleGroup}>
        {ROL_OPTIONS.map((option, index) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              // Solo la opción elegida (o la primera, si no hay) entra en el orden del Tab.
              tabIndex={selected || (value === null && index === 0) ? 0 : -1}
              className={`${styles.roleCard} ${selected ? styles.roleCardSelected : ''}`}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              data-testid={`registro-rol-${option.value}`}
            >
              <span className={styles.roleRadio} aria-hidden="true" />
              <span className={styles.roleText}>
                <span className={styles.roleTitle}>{option.title}</span>
                <span className={styles.roleDescription}>{option.description}</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className={styles.note}>
        Más adelante podés sumar el otro rol desde <strong>Mi perfil</strong>, sin crear otra cuenta.
      </p>

      <Button type="primary" block className={styles.submit} disabled={value === null} onClick={onContinue} data-testid="registro-continuar-button">
        Continuar
      </Button>

      <p className={styles.footerText}>
        ¿Ya tenés cuenta?{' '}
        <Link href={loginHref} className={styles.link} data-testid="registro-login-link">
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
