import { useState } from 'react'
import { WizardLayout } from '@rentar/ui'

const steps = [
  { key: 'datos', title: 'Datos del contrato', content: <p>Paso 1: fechas, propiedad y monto inicial.</p> },
  { key: 'firmantes', title: 'Firmantes', content: <p>Paso 2: datos del locatario y del garante.</p> },
  { key: 'revision', title: 'Revisión', content: <p>Paso 3: confirmar y enviar a firma electrónica.</p> },
]

export const FirstStep = () => {
  const [step, setStep] = useState(0)
  return <WizardLayout steps={steps} currentStep={step} onStepChange={setStep} onFinish={() => setStep(0)} />
}

export const LastStep = () => {
  const [step, setStep] = useState(2)
  return <WizardLayout steps={steps} currentStep={step} onStepChange={setStep} onFinish={() => setStep(0)} />
}

// Los 5 pasos del alta de propiedad (Claude Design, "Alta de propiedad").
const pasosAlta = [
  { key: 'ubicacion', title: 'Tipo y ubicación', content: <p>Tipo, calle, número y barrio.</p> },
  { key: 'caracteristicas', title: 'Características', content: <p>Ambientes, superficie y estado.</p> },
  { key: 'fotos', title: 'Fotos', content: <p>Necesitás al menos 3 fotos. Te faltan 2.</p> },
  { key: 'condiciones', title: 'Condiciones', content: <p>Precio, expensas y medios de pago.</p> },
  { key: 'revision', title: 'Revisión', content: <p>Resumen y vista previa.</p> },
]

/** Paso con error (status "error") y pasos anteriores navegables. */
export const PasoConError = () => {
  const [step, setStep] = useState(2)
  const steps = pasosAlta.map((paso, index) => (index === 2 ? { ...paso, status: 'error' as const } : paso))
  return <WizardLayout steps={steps} currentStep={step} onStepChange={setStep} navigableSteps />
}

/** Último paso mientras se publica: botones en carga y pasos bloqueados. */
export const Publicando = () => (
  <WizardLayout steps={pasosAlta} currentStep={4} onStepChange={() => {}} onFinish={() => {}} finishLabel="Publicar la propiedad" navigableSteps loading />
)
