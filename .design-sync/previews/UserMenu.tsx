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

/** Cuenta con dos roles: el menú abierto con "Viendo como" (✓ en el activo, contador en el otro). */
export function ViendoComo() {
  return (
    <div style={{ height: 460, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '8px 24px' }}>
      <UserMenu
        name="Sofía Ledesma"
        role="locatario"
        subtitle="Locatario"
        open
        roleOptions={[
          { role: 'locatario', label: 'Locatario', description: 'Obispo Trejo 1250 · 1 contrato' },
          { role: 'locador', label: 'Locador', description: '1 propiedad · 1 cobro vencido', badgeCount: 1 },
        ]}
        items={[
          { key: 'perfil', label: 'Mi perfil y legajo' },
          { key: 'notificaciones', label: 'Mis notificaciones' },
        ]}
        onLogout={() => {}}
      />
    </div>
  )
}
