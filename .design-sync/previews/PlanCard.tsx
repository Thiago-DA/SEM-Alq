import { PlanCard } from '@rentar/ui'

const rowStyle = { display: 'flex', flexWrap: 'wrap' as const, alignItems: 'flex-start', gap: 20 }
const cardStyle = { width: 220 }

/** Los 3 planes de suscripción — Propietario destacado como recomendado. */
export function Default() {
  return (
    <div style={rowStyle}>
      <div style={cardStyle}>
        <PlanCard
          name="Gratis"
          priceMonthly={0}
          description="Para probar la plataforma"
          features={['1 propiedad publicada', 'Solicitudes ilimitadas', 'Soporte por email']}
          ctaLabel="Empezar gratis"
        />
      </div>
      <div style={cardStyle}>
        <PlanCard
          name="Propietario"
          priceMonthly={9990}
          description="Para locadores con varias propiedades"
          features={['Propiedades ilimitadas', 'Contratos y firma electrónica', 'Reportes de cobros', 'Soporte prioritario']}
          highlighted
          ctaLabel="Elegir Propietario"
        />
      </div>
      <div style={cardStyle}>
        <PlanCard
          name="Inmobiliaria"
          priceMonthly={24990}
          description="Para equipos con varios usuarios"
          features={['Todo lo de Propietario', 'Multiusuario', 'Panel de administración']}
          currentPlan
        />
      </div>
    </div>
  )
}
