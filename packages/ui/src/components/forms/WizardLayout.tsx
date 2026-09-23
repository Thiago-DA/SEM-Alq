'use client'

import type { ReactNode } from 'react'
import { Button, Steps } from 'antd'
import styles from './WizardLayout.module.css'

interface WizardStep {
  key: string
  title: string
  content: ReactNode
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
  'data-testid'?: string
}

/**
 * Formulario en pasos: `Steps` de navegación arriba, el contenido del paso
 * actual, y botones Anterior/Siguiente (o Confirmar en el último paso). No
 * valida nada por su cuenta — cada paso valida y decide si `onStepChange`
 * puede avanzar.
 */
export function WizardLayout({
  steps,
  currentStep,
  onStepChange,
  onFinish,
  finishLabel = 'Confirmar',
  ...rest
}: WizardLayoutProps) {
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className={styles.wrap} {...rest}>
      <Steps
        current={currentStep}
        items={steps.map((step) => ({ key: step.key, title: step.title }))}
      />

      <div className={styles.content}>{steps[currentStep]?.content}</div>

      <div className={styles.actions}>
        <Button
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep === 0}
          data-testid="wizard-prev-button"
        >
          Anterior
        </Button>
        {isLastStep ? (
          onFinish && (
            <Button type="primary" onClick={onFinish} data-testid="wizard-finish-button">
              {finishLabel}
            </Button>
          )
        ) : (
          <Button
            type="primary"
            onClick={() => onStepChange(currentStep + 1)}
            data-testid="wizard-next-button"
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  )
}
