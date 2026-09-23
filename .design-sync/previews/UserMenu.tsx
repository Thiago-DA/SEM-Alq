import { UserMenu } from '@rentar/ui'

/** Trigger del menú de usuario — nombre y rol reales, el panel abre al click. */
export function Default() {
  return (
    <UserMenu
      name="Nicolás Arrieta"
      role="locador"
      items={[
        { key: 'perfil', label: 'Mi perfil' },
        { key: 'notificaciones', label: 'Notificaciones' },
      ]}
      onLogout={() => {}}
    />
  )
}
