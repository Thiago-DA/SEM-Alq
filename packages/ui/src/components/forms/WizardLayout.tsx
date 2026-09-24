'use client'

/**
 * WizardLayout.tsx — formulario en pasos con Steps, contenido y botones Anterior/Siguiente; versión
 * compacta en móvil.
 *
 * Diseño: "Alta de propiedad" · 01, 06, 07 y 09.
 * Quién lo usa: el alta (US-01) y el catálogo.
 */
import type { ReactNode } from 'react'
import { Button, Steps } from 'antd'
import styles from './WizardLayout.module.css'

interface WizardStep {
  key: string
  title: string
  content: ReactNode
  /**
   * `'error'` marca el paso en rojo en el `Steps` (ej. el paso que no pasó
   * la validación). Opcional: sin valor, el `Steps` decide solo.
   */
  status?: 'error'
}

/** Props de {@link WizardLayout}. */
interface WizardLayoutProps {
  steps: WizardStep[]
  /** Índice (0-based) del paso actual. */
  currentStep: number
  onStepChange: (step: number) => void
  /** Se llama al confirmar el último paso. Si no se pasa, el botón final no se muestra. */
  onFinish?: () => void
  finishLabel?: string
  /** Texto del botón para avanzar (default "Siguiente"). */
  nextLabel?: string
  /**
   * `true` permite volver a un paso anterior tocando su número en el
   * `Steps` (Claude Design, "Alta de propiedad" · 01: "solo permite volver a
   * pasos ya completados"). Hacia adelante nunca: se avanza con el botón,
   * que es donde valida cada paso. Default `false` (como antes).
   */
  navigableSteps?: boolean
  /**
   * `true` mientras se confirma el último paso: los botones quedan en
   * `loading` y no se puede cambiar de paso (Alta · 07).
   */
  loading?: boolean
  'data-testid'?: string
}

/**
 * Formulario en pasos: `Steps` de navegación arriba, el contenido del paso
 * actual, y botones Anterior/Siguiente (o Confirmar en el último paso). No
 * valida nada por su cuenta — cada paso valida y decide si `onStepChange`
 * puede avanzar.
 *
 * Debajo de 768px (Alta · 09) el `Steps` se reemplaza por el nombre del paso,
 * "Paso N de M", una barra de M tramos y "Siguiente: X"; los botones quedan
 * fijos abajo, a todo el ancho, y en el último paso solo queda el primario.
 * Las dos cabeceras se renderizan y el CSS decide cuál mostrar (igual que
 * `DataTable`), para no medir `window` y evitar el parpadeo de hidratación.
 */
export function WizardLayout({
  steps,
  currentStep,
  onStepChange,
  onFinish,
  finishLabel = 'Confirmar',
  nextLabel = 'Siguiente',
  navigableSteps = false,
  loading = false,
  ...rest
}: WizardLayoutProps) {
  const isLastStep = currentStep === steps.length - 1
  const current = steps[currentStep]
  const next = steps[currentStep + 1]

  /** Un paso del `Steps` se puede tocar si es anterior al actual (y no se está confirmando). */
  const canGoTo = (index: number) => navigableSteps && !loading && index < currentStep

  return (
    <div className={styles.wrap} {...rest}>
      <Steps
        className={styles.steps}
        current={currentStep}
        onChange={navigableSteps ? (index) => canGoTo(index) && onStepChange(index) : undefined}
        items={steps.map((step, index) => ({
          key: step.key,
          title: step.title,
          status: step.status === 'error' ? 'error' : undefined,
          disabled: navigableSteps ? !canGoTo(index) : undefined,
        }))}
      />

      {/* Cabecera compacta (móvil). */}
      <div className={styles.compact} data-testid="wizard-compact-header">
        <div className={styles.compactTitleRow}>
          <span className={styles.compactTitle}>{current?.title}</span>
          <span className={styles.compactCount}>
            Paso {currentStep + 1} de {steps.length}
          </span>
        </div>
        <div className={styles.progress} aria-hidden="true">
          {steps.map((step, index) => (
            <span
              key={step.key}
              className={`${styles.progressSegment} ${index <= currentStep ? styles.progressDone : ''} ${step.status === 'error' ? styles.progressError : ''}`}
            />
          ))}
        </div>
        {next && <span className={styles.compactNext}>Siguiente: {next.title}</span>}
      </div>

      <div className={styles.content}>{current?.content}</div>

      <div className={`${styles.actions} ${isLastStep ? styles.actionsLast : ''}`}>
        <Button
          className={styles.prevButton}
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep === 0 || loading}
          data-testid="wizard-prev-button"
        >
          Anterior
        </Button>
        {isLastStep ? (
          onFinish && (
            <Button type="primary" onClick={onFinish} loading={loading} data-testid="wizard-finish-button">
              {finishLabel}
            </Button>
          )
        ) : (
          <Button type="primary" onClick={() => onStepChange(currentStep + 1)} disabled={loading} data-testid="wizard-next-button">
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
