'use client'

/**
 * OnboardingLocador.tsx — `/panel` de un locador sin propiedades.
 *
 * Diseño: "Panel de inicio" · 02 ("Sin propiedades no hay métricas: el
 * panel se convierte en onboarding"). Tres pasos: el primero se puede hacer;
 * los otros dos se ven pero no se pueden tocar, y dicen por qué. Las
 * StatCards no se muestran: un tablero lleno de ceros parece un error.
 *
 * NOTA: textos ajustados a este sprint. El diseño dice "Podés guardarla como
 * borrador" y RentAR no tiene estado Borrador: se reemplazó por "dejarla
 * pausada". El saludo evita el género ("Te damos la bienvenida").
 * Quién lo usa: `PanelLocador`.
 */
import { Button } from 'antd'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@rentar/ui'
import styles from './Panel.module.css'

interface PasoOnboarding {
  numero: number
  etiqueta: string
  titulo: string
  texto: string
  /** Solo el primero tiene acción; los demás dicen qué les falta. */
  bloqueo?: string
}

const PASOS: PasoOnboarding[] = [
  {
    numero: 1,
    etiqueta: 'Empezá acá',
    titulo: 'Publicá tu propiedad',
    texto: 'Cargá dirección, fotos y precio. Podés dejarla pausada y publicarla cuando quieras.',
  },
  {
    numero: 2,
    etiqueta: 'Después',
    titulo: 'Creá el contrato',
    texto: 'Elegí plazo, monto e índice de ajuste (IPC o ICL). RentAR calcula los vencimientos solo.',
    bloqueo: 'Necesita una propiedad',
  },
  {
    numero: 3,
    etiqueta: 'Para cerrar',
    titulo: 'Invitá al locatario',
    texto: 'Le mandás el link, firma digital y desde ahí ve sus vencimientos y te manda reclamos.',
    bloqueo: 'Necesita un contrato',
  },
]

/** Onboarding del locador nuevo: saludo, tres pasos y el estado vacío. */
export function OnboardingLocador({ nombre }: { nombre: string }) {
  const router = useRouter()
  return (
    <div className={styles.page} data-testid="panel-onboarding">
      <div className={styles.greeting}>
        <h2 className={styles.greetingTitle}>Te damos la bienvenida, {nombre}</h2>
        <p className={styles.greetingText}>Tres pasos y tu primer alquiler queda administrado desde acá. Te lleva unos 15 minutos.</p>
      </div>

      <ol className={styles.onboardingGrid}>
        {PASOS.map((paso) => {
          const activo = !paso.bloqueo
          return (
            <li key={paso.numero} className={`${styles.onboardingStep} ${activo ? styles.onboardingStepActive : ''}`}>
              <span className={styles.onboardingStepHead}>
                <span className={`${styles.onboardingNumber} ${activo ? styles.onboardingNumberActive : ''}`}>{paso.numero}</span>
                <span className={`${styles.onboardingLabel} ${activo ? styles.onboardingLabelActive : ''}`}>{paso.etiqueta}</span>
              </span>
              <span className={styles.onboardingTitle}>{paso.titulo}</span>
              <span className={styles.onboardingText}>{paso.texto}</span>
              {activo ? (
                <Button type="primary" block onClick={() => router.push('/panel/propiedades/nueva')} data-testid="panel-onboarding-publicar">
                  Publicar propiedad
                </Button>
              ) : (
                <span className={styles.onboardingBlocked} aria-disabled="true">
                  {paso.bloqueo}
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <div className={styles.onboardingEmpty}>
        <EmptyState
          title="Todavía no tenés propiedades"
          description="Cuando publiques la primera, acá vas a ver tus cobros del mes, los contratos por vencer y los reclamos de tus locatarios."
        />
      </div>
    </div>
  )
}
