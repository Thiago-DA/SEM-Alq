'use client'

import { CheckOutlined } from '@ant-design/icons'
import styles from './PasswordStrengthMeter.module.css'

/** Nivel de fuerza de una contraseña. `vacia` = todavía no se escribió nada. */
export type PasswordStrength = 'vacia' | 'debil' | 'media' | 'buena' | 'fuerte'

/** Un requisito de la contraseña, ya evaluado por quien usa el componente. */
export interface PasswordRequirement {
  key: string
  label: string
  met: boolean
}

/** Props de {@link PasswordStrengthMeter}. */
interface PasswordStrengthMeterProps {
  /** Nivel ya calculado (la regla vive en la app, no en el componente). */
  strength: PasswordStrength
  /** Checklist de requisitos, en el orden en que se muestran. */
  requirements: PasswordRequirement[]
  /** `id` del bloque, para enlazarlo desde el campo con `aria-describedby`. */
  id?: string
  'data-testid'?: string
}

/** Cuántos de los 4 segmentos se pintan y con qué etiqueta, según el nivel. */
const STRENGTH_META: Record<PasswordStrength, { segments: number; label: string }> = {
  vacia: { segments: 0, label: '' },
  debil: { segments: 1, label: 'débil' },
  media: { segments: 2, label: 'media' },
  buena: { segments: 3, label: 'buena' },
  fuerte: { segments: 4, label: 'fuerte' },
}

const SEGMENTS = [1, 2, 3, 4]

/**
 * Indicador de fuerza de contraseña: barra de 4 segmentos, la etiqueta
 * "Fuerza: …" y el checklist de requisitos. Solo muestra: qué cuenta como
 * débil, media, buena o fuerte lo decide quien lo usa (en `apps/web`, las
 * reglas de US-19 en `lib/validation/usuario.rules.ts`), así el componente no
 * se desincroniza de la validación real.
 *
 * Colores: débil en rojo, media en dorado (solo como paso intermedio de la
 * barra, no como estado de dominio), buena y fuerte en azul.
 *
 * Lo usa: el registro (US-19). Diseño: Claude Design, "Autenticación" · 03.
 */
export function PasswordStrengthMeter({ strength, requirements, id, ...rest }: PasswordStrengthMeterProps) {
  const meta = STRENGTH_META[strength]

  return (
    <div className={styles.wrap} id={id} {...rest}>
      <div className={styles.barRow}>
        <span className={styles.bar} aria-hidden="true">
          {SEGMENTS.map((segment) => (
            <span
              key={segment}
              className={`${styles.segment} ${segment <= meta.segments ? styles[`segment_${strength}`] : ''}`}
            />
          ))}
        </span>
        {/* aria-live: el cambio de nivel se anuncia al escribir, sin mover el foco. */}
        <span className={`${styles.label} ${styles[`label_${strength}`]}`} aria-live="polite" data-testid="password-strength-label">
          {meta.label && `Fuerza: ${meta.label}`}
        </span>
      </div>

      <ul className={styles.requirements}>
        {requirements.map((requirement) => (
          <li
            key={requirement.key}
            className={`${styles.requirement} ${requirement.met ? styles.requirementMet : ''}`}
            data-testid={`password-requirement-${requirement.key}`}
            data-met={requirement.met}
          >
            <span className={styles.check} aria-hidden="true">
              {requirement.met && <CheckOutlined />}
            </span>
            {requirement.label}
            <span className={styles.srOnly}>{requirement.met ? ' (cumplido)' : ' (pendiente)'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
