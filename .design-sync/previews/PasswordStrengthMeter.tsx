import { PasswordStrengthMeter } from '@rentar/ui'

/** Los requisitos del registro (US-19), con cuáles se cumplen para cada nivel. */
function requisitos(cumplidos: string[]) {
  return [
    { key: 'largo', label: 'Al menos 8 caracteres', met: cumplidos.includes('largo') },
    { key: 'mayuscula', label: 'Una mayúscula', met: cumplidos.includes('mayuscula') },
    { key: 'minuscula', label: 'Una minúscula', met: cumplidos.includes('minuscula') },
    { key: 'numero', label: 'Un número', met: cumplidos.includes('numero') },
  ]
}

const caja = { width: 340 }

/** Recién empieza a escribir: solo minúsculas. */
export function Debil() {
  return (
    <div style={caja}>
      <PasswordStrengthMeter strength="debil" requirements={requisitos(['minuscula'])} />
    </div>
  )
}

/** Cumple el largo y las minúsculas; le faltan mayúscula y número. */
export function Media() {
  return (
    <div style={caja}>
      <PasswordStrengthMeter strength="media" requirements={requisitos(['largo', 'minuscula'])} />
    </div>
  )
}

/** Cumple todo ("Rentar2026"). */
export function Fuerte() {
  return (
    <div style={caja}>
      <PasswordStrengthMeter strength="fuerte" requirements={requisitos(['largo', 'mayuscula', 'minuscula', 'numero'])} />
    </div>
  )
}
