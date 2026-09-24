import { RoleSwitcher } from '@rentar/ui'

/**
 * Los 4 roles reales de la plataforma. El componente se posiciona `fixed`
 * (esquina inferior derecha) por diseño — es un widget flotante de
 * desarrollo. La card de `/design-sync` envuelve cada story en un ancestro
 * con `transform`, que pasa a ser el "containing block" de todo `position:
 * fixed` de adentro (CSS estándar) — sin un alto explícito en ese ancestro
 * queda en 0 y el widget no tiene dónde anclarse. Mismo motivo/mismo arreglo
 * que en `ConfirmActionModal.tsx`.
 */
export function Default() {
  return (
    <div style={{ position: 'relative', height: 120 }}>
      <RoleSwitcher role="locador" onChange={() => {}} />
    </div>
  )
}
