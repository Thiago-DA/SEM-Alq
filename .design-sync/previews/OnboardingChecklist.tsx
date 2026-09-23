import { OnboardingChecklist } from '@rentar/ui'

/** Primeros pasos de un locador nuevo — 1 hecho, 1 activo, 1 bloqueado. */
export function Default() {
  return (
    <OnboardingChecklist
      items={[
        { key: 'perfil', label: 'Completá tu perfil', status: 'listo', href: '#' },
        { key: 'propiedad', label: 'Publicá tu primera propiedad', status: 'activo', href: '#' },
        { key: 'contrato', label: 'Armá tu primer contrato', status: 'bloqueado', motivoBloqueo: 'Publicá una propiedad primero' },
      ]}
    />
  )
}
