/**
 * usuario.rules.ts — reglas de validación de los datos de una cuenta.
 *
 * Qué es: la fuente única de las validaciones del registro (US-19) y del
 * login (US-39): expresiones regulares, reglas de antd `Form` listas para
 * usar y los mensajes, tal cual los fija el diseño ("Autenticación" · 02 y
 * 03, criterio RNF-09: el error dice qué pasó y qué hacer).
 * Si backend cambia una regla, se cambia acá y lo toman todos los formularios.
 *
 * Quién lo usa: `components/auth/LoginForm.tsx` y `components/auth/RegistroForm.tsx`.
 */
import type { FormRule as Rule } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import type { PasswordRequirement, PasswordStrength } from '@rentar/ui'

// ─── Expresiones regulares ──────────────────────────────────────────────

/**
 * Contraseña (US-19: "alfanumérica de al menos 8 caracteres con al menos una
 * mayúscula y al menos una minúscula"). "Alfanumérica" se interpreta como lo
 * dibuja el diseño: letras Y números, así que además pide al menos un número.
 * Solo letras sin tilde y números, porque el back rechaza cualquier otro
 * caracter (su regex es `[A-Za-z0-9]{8,}`).
 *
 * TODO(backend): sumar el número al regex del back
 * (`feature/registrar-usuario`, `usuario.service.ts`): hoy acepta
 * contraseñas sin números. Que el front sea más estricto no rompe nada.
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9]{8,}$/

/**
 * Nombre y apellido (US-19: "deben aceptar caracteres especiales, como tildes
 * y apóstrofes"). Letras de cualquier idioma (`\p{L}` incluye á, ñ, ü...),
 * espacios, apóstrofes (' y ’) y guiones; tiene que empezar con una letra.
 */
export const NOMBRE_REGEX = /^\p{L}[\p{L}'’\- ]*$/u

/**
 * Email (US-19: "formato nombre@dominio"). Mismo criterio que el back: algo,
 * una arroba y algo, sin espacios.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+$/

/** DNI: entre 7 y 8 números, sin puntos ni guiones (diseño, "Validaciones del paso 2"). */
export const DNI_REGEX = /^\d{7,8}$/

/**
 * Teléfono (diseño: "con característica, sin el 0 y sin el 15"). En Argentina
 * eso da siempre 10 números (ej. 351 512 3456), que no empiezan con 0. Se
 * ignoran espacios, guiones y paréntesis al validar.
 */
export const TELEFONO_REGEX = /^[1-9]\d{9}$/

/** Edad mínima para registrarse (diseño: "Tenés que ser mayor de 18 años para firmar un contrato"). */
export const EDAD_MINIMA = 18

// ─── Mensajes (textos del diseño) ───────────────────────────────────────

export const MENSAJES = {
  emailVacio: 'Escribí tu email para continuar.',
  emailInvalido: 'Ese email no parece válido. Revisá que tenga @ y el dominio.',
  passwordVacia: 'Escribí tu contraseña.',
  passwordInvalida: 'La contraseña necesita al menos 8 caracteres, una mayúscula, una minúscula y un número. Solo letras y números.',
  passwordRepetidaVacia: 'Repetí la contraseña.',
  passwordsDistintas: 'Las dos contraseñas tienen que ser iguales.',
  nombreVacio: 'Escribí tu nombre.',
  apellidoVacio: 'Escribí tu apellido.',
  nombreInvalido: 'Usá solo letras, espacios, tildes y apóstrofes.',
  fechaVacia: 'Elegí tu fecha de nacimiento.',
  // Distinto del texto de ayuda del campo (que ya dice la regla), para no repetirlo.
  menorDeEdad: `Con esa fecha todavía no cumpliste ${EDAD_MINIMA} años.`,
  dniInvalido: 'El DNI tiene entre 7 y 8 números. Revisá lo que escribiste.',
  telefonoInvalido: 'Escribí el teléfono con característica, sin el 0 y sin el 15. Ejemplo: 351 512 3456.',
  terminos: 'Para crear la cuenta tenés que aceptar los términos.',
} as const

// ─── Helpers ────────────────────────────────────────────────────────────

/** Deja solo los dígitos (para DNI y teléfono escritos con puntos, espacios o guiones). */
export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

/**
 * `true` si alguien nacido en `fechaNacimiento` ya cumplió {@link EDAD_MINIMA}
 * años al día `hoy`.
 */
export function esMayorDeEdad(fechaNacimiento: Dayjs, hoy: Dayjs = dayjs()): boolean {
  return !fechaNacimiento.isAfter(hoy.subtract(EDAD_MINIMA, 'year'), 'day')
}

// ─── Fuerza de la contraseña (para PasswordStrengthMeter) ───────────────

/**
 * Checklist de la contraseña, en el orden del diseño. "Un símbolo" no está:
 * el back rechaza los símbolos.
 */
export function requisitosPassword(password: string): PasswordRequirement[] {
  return [
    { key: 'largo', label: 'Al menos 8 caracteres', met: password.length >= 8 },
    { key: 'mayuscula-minuscula', label: 'Una mayúscula y una minúscula', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { key: 'numero', label: 'Un número', met: /\d/.test(password) },
  ]
}

/**
 * Nivel de fuerza, según el diseño ("Indicador de fuerza"):
 * - débil: menos de 8 caracteres;
 * - media: 8 o más, pero le falta la mayúscula, la minúscula o el número;
 * - buena: cumple todo (es la que habilita el envío);
 *   si tiene un símbolo o una letra con tilde queda en "media", porque el back
 *   no la acepta y todavía no se puede enviar;
 * - fuerte: cumple todo y tiene 12 o más caracteres.
 * NOTA: el diseño pide además un símbolo para "fuerte"; como el back no
 * acepta símbolos, "fuerte" se alcanza solo con el largo.
 */
export function fuerzaPassword(password: string): PasswordStrength {
  if (!password) return 'vacia'
  if (password.length < 8) return 'debil'
  if (!requisitosPassword(password).every((requisito) => requisito.met)) return 'media'
  if (!/^[A-Za-z0-9]+$/.test(password)) return 'media'
  return password.length >= 12 ? 'fuerte' : 'buena'
}

// ─── Reglas de antd Form ────────────────────────────────────────────────

export const reglasEmail: Rule[] = [
  { required: true, whitespace: true, message: MENSAJES.emailVacio },
  { pattern: EMAIL_REGEX, message: MENSAJES.emailInvalido },
]

/** Login: solo que no esté vacía. La regla de formato es del registro, no del login. */
export const reglasPasswordLogin: Rule[] = [{ required: true, message: MENSAJES.passwordVacia }]

export const reglasPasswordNueva: Rule[] = [
  { required: true, message: MENSAJES.passwordVacia },
  { pattern: PASSWORD_REGEX, message: MENSAJES.passwordInvalida },
]

/** "Repetir contraseña" tiene que coincidir con el campo `campoPassword` (US-19: "confirmar la contraseña"). */
export function reglasPasswordRepetida(campoPassword: string): Rule[] {
  return [
    { required: true, message: MENSAJES.passwordRepetidaVacia },
    ({ getFieldValue }) => ({
      validator(_, value: string | undefined) {
        if (!value || getFieldValue(campoPassword) === value) return Promise.resolve()
        return Promise.reject(new Error(MENSAJES.passwordsDistintas))
      },
    }),
  ]
}

export const reglasNombre: Rule[] = [
  { required: true, whitespace: true, message: MENSAJES.nombreVacio },
  { pattern: NOMBRE_REGEX, message: MENSAJES.nombreInvalido },
]

export const reglasApellido: Rule[] = [
  { required: true, whitespace: true, message: MENSAJES.apellidoVacio },
  { pattern: NOMBRE_REGEX, message: MENSAJES.nombreInvalido },
]

export const reglasFechaNacimiento: Rule[] = [
  { required: true, message: MENSAJES.fechaVacia },
  {
    validator(_, value: Dayjs | null | undefined) {
      if (!value || esMayorDeEdad(value)) return Promise.resolve()
      return Promise.reject(new Error(MENSAJES.menorDeEdad))
    },
  },
]

export const reglasDni: Rule[] = [
  {
    // "Se debe ingresar un número de documento" (US-19) + 7 u 8 números (diseño).
    validator(_, value: string | undefined) {
      if (value && DNI_REGEX.test(soloDigitos(value))) return Promise.resolve()
      return Promise.reject(new Error(MENSAJES.dniInvalido))
    },
  },
]

export const reglasTelefono: Rule[] = [
  {
    // "Se debe ingresar un número de teléfono" (US-19) + formato del diseño.
    validator(_, value: string | undefined) {
      if (value && TELEFONO_REGEX.test(soloDigitos(value))) return Promise.resolve()
      return Promise.reject(new Error(MENSAJES.telefonoInvalido))
    },
  },
]

/** US-19: "Se debe aceptar los términos y condiciones". */
export const reglasTerminos: Rule[] = [
  {
    validator(_, value: boolean | undefined) {
      return value ? Promise.resolve() : Promise.reject(new Error(MENSAJES.terminos))
    },
  },
]
