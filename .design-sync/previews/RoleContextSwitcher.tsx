import { RoleContextSwitcher } from '@rentar/ui'

/** Sofía Ledesma — la única cuenta del elenco con dos roles (locadora y locataria). */
export function Default() {
  return (
    <RoleContextSwitcher
      roles={[
        { role: 'locador', label: 'Locadora' },
        { role: 'locatario', label: 'Locataria' },
      ]}
      activeRole="locador"
      onChange={() => {}}
    />
  )
}
