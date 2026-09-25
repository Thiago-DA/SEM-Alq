'use client'

/**
 * RegistroForm.tsx — `/registro` completo (US-19 Registrar usuario).
 *
 * Qué es: el registro en dos pasos del mapa de pantallas:
 * 1. "¿Alquilás o publicás?" → el rol (`locatario` o `locador`).
 * 2. "Tus datos" → nombre, apellido, fecha de nacimiento, DNI, teléfono,
 *    email, contraseña (con indicador de fuerza), repetir contraseña y
 *    términos.
 * Después inicia sesión solo (ver `iniciarSesionAutomatica`) y muestra "Cuenta
 * creada" con el siguiente paso según el rol.
 * Diseño: Claude Design, "Autenticación" · 03a (paso 1), 03 (paso 2) y 05 (estados).
 *
 * El paso 1 siempre se muestra. Si la URL trae un rol (`?rol=locador`) o se
 * venía a publicar una propiedad, esa tarjeta llega preseleccionada, pero la
 * persona igual la confirma con "Continuar". "Atrás" en "Tus datos" vuelve al
 * paso 1 sin perder lo cargado: el formulario del paso 2 queda montado
 * (oculto) mientras se ve el paso 1.
 *
 * De dónde saca los datos: `services/auth.service.ts#registrarUsuario` y,
 * para el login automático, `useAuth().login`.
 * Quién lo usa: `app/(auth)/registro/page.tsx`.
 */
import { useState } from 'react'
import Link from 'next/link'
import { Button, Checkbox, DatePicker, Form, Input } from 'antd'
import type { Dayjs } from 'dayjs'
import type { UsuarioSesion } from '@rentar/shared-types'
import { AuthLayout, PasswordStrengthMeter, SimulatedFeatureNotice } from '@rentar/ui'
import {
  fuerzaPassword,
  reglasApellido,
  reglasDni,
  reglasEmail,
  reglasFechaNacimiento,
  reglasNombre,
  reglasPasswordNueva,
  reglasPasswordRepetida,
  reglasTelefono,
  reglasTerminos,
  requisitosPassword,
  soloDigitos,
} from '@/lib/validation/usuario.rules'
import { useAuth } from '@/lib/auth/AuthProvider'
import { hoy } from '@/lib/utils/fechas'
import { registrarUsuario, type RegistroInput } from '@/services/auth.service'
import { ServiceError } from '@/services/shared/errors'
import { FormAlert } from './FormAlert'
import { isServerError, serverErrorCopy, type ServerErrorCopy } from './serverError'
import { StatusBlock } from './StatusBlock'
import { RolStep } from './RolStep'
import { TerminosModal, type DocumentoLegal } from './TerminosModal'
import styles from './AuthForm.module.css'

/** Rol que se elige en el paso 1. */
export type RolRegistro = RegistroInput['rol']

type Step = 'rol' | 'datos' | 'listo'

interface DatosFormValues {
  nombre: string
  apellido: string
  fechaNacimiento: Dayjs
  dni: string
  telefono: string
  email: string
  password: string
  passwordRepetida: string
  aceptaTerminos: boolean
}

interface RegistroFormProps {
  /** Tarjeta preseleccionada en el paso 1 (de `?rol=` o deducida de `next`); `null` = ninguna. */
  initialRol: RolRegistro | null
  /** Ruta interna a la que se quería ir antes de registrarse, si había. */
  next: string | null
}

/** Registro de usuario en dos pasos, con los estados de carga, error y éxito. */
export function RegistroForm({ initialRol, next }: RegistroFormProps) {
  const [form] = Form.useForm<DatosFormValues>()
  const { login } = useAuth()

  // ─── Estado local ───────────────────────────────────────────────────
  // El rol vive en el estado del formulario (no en la URL): lo elige el paso 1
  // y el paso 2 lo manda al service.
  const [rol, setRol] = useState<RolRegistro | null>(initialRol)
  const [step, setStep] = useState<Step>('rol')
  const [submitting, setSubmitting] = useState(false)
  const [emailTaken, setEmailTaken] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<ServerErrorCopy | null>(null)
  const [nombreCreado, setNombreCreado] = useState('')
  const [emailCreado, setEmailCreado] = useState('')
  // Usuario con la sesión ya iniciada por el login automático; `null` si falló.
  const [sesionIniciada, setSesionIniciada] = useState<UsuarioSesion | null>(null)
  const [documentoAbierto, setDocumentoAbierto] = useState<DocumentoLegal | null>(null)

  const password = Form.useWatch('password', form) ?? ''
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : '/login'

  // ─── Handlers ───────────────────────────────────────────────────────

  async function handleSubmit(values: DatosFormValues): Promise<void> {
    setSubmitting(true)
    setEmailTaken(false)
    setFormError(null)
    setServerError(null)
    // No debería pasar (sin rol no se llega al paso 2), pero por las dudas se vuelve al paso 1.
    if (!rol) {
      setStep('rol')
      setSubmitting(false)
      return
    }
    try {
      const usuario = await registrarUsuario({
        rol,
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        password: values.password,
        telefono: soloDigitos(values.telefono),
        dni: soloDigitos(values.dni),
        fechaNacimiento: values.fechaNacimiento.format('YYYY-MM-DD'),
        aceptaTerminos: values.aceptaTerminos,
      })
      setNombreCreado(usuario.nombre)
      setEmailCreado(usuario.email)
      setSesionIniciada(await iniciarSesionAutomatica(values.email, values.password))
      setStep('listo')
    } catch (error) {
      if (error instanceof ServiceError && error.code === 'conflict') {
        // Mail duplicado (lo decide el service): aviso arriba y el campo marcado.
        setEmailTaken(true)
        form.setFields([{ name: 'email', errors: [error.message] }])
      } else if (!isServerError(error) && error instanceof ServiceError) {
        // El back rechazó algún dato (400): se muestra su mensaje arriba del
        // formulario, que queda con lo escrito para corregirlo.
        setFormError(error.message)
      } else {
        setServerError(serverErrorCopy(error))
      }
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Login automático después de crear la cuenta: el back la crea ya
   * confirmada (`email_confirm: true`), así que se puede entrar enseguida con
   * las mismas credenciales. Las credenciales se usan solo para este pedido:
   * no se guardan en ningún lado.
   *
   * NOTA: si falla (sin red, Auth caído), NO es un error del registro —la
   * cuenta ya existe—: devuelve `null` y la pantalla de éxito manda por
   * /login con el email cargado, como antes de conectar el back.
   */
  async function iniciarSesionAutomatica(email: string, passwordIngresada: string): Promise<UsuarioSesion | null> {
    try {
      return await login({ email, password: passwordIngresada })
    } catch {
      return null
    }
  }

  /** "Reintentar": vuelve a enviar lo que ya estaba escrito (el form conserva los valores). */
  function handleRetry(): void {
    setServerError(null)
    void handleSubmit(form.getFieldsValue(true))
  }

  /** "Atrás" en "Tus datos": vuelve al paso 1; lo cargado queda en el formulario. */
  function handleBack(): void {
    setStep('rol')
  }

  // ─── Render: cuenta creada ──────────────────────────────────────────

  function renderListo() {
    // El rol que se muestra es el que QUEDÓ en la cuenta: con sesión iniciada,
    // el de `/usuarios/me`; si el login automático falló, el elegido en el paso 1.
    // NOTA: hoy el back registra a todos como locatario (el rol del body entra
    // con el PR #2, `feature/registro-con-rol`). Así, quien eligió "locador" ve
    // "cuenta de locatario" en vez de un botón que lo lleve a una pantalla
    // que no puede usar.
    const esLocador = sesionIniciada ? sesionIniciada.roles.includes('locador') : rol === 'locador'
    // El siguiente paso depende del rol (diseño: "Locador: el CTA pasa a
    // Publicar mi primera propiedad").
    // NOTA: el registro inicia sesión solo (ver `iniciarSesionAutomatica`),
    // así que los botones llevan directo a su destino. Si el login automático
    // falló, los destinos del panel pasan por /login con el email ya cargado
    // (solo falta la contraseña) y vuelven al destino con ?next=.
    const destino = (ruta: string) =>
      sesionIniciada ? ruta : `/login?next=${encodeURIComponent(ruta)}&email=${encodeURIComponent(emailCreado)}`
    const cta = esLocador
      ? { label: 'Publicar mi primera propiedad', href: destino('/panel/propiedades/nueva') }
      : { label: 'Buscar propiedades en Córdoba', href: '/buscar' }
    return (
      <StatusBlock
        variant="success"
        title={`¡Listo, ${nombreCreado}!`}
        description={`Tu cuenta de ${esLocador ? 'locador' : 'locatario'} ya está activa. Te mandamos un email para confirmar la dirección.`}
        actions={
          <>
            <Button type="primary" size="large" href={cta.href} className={styles.submit} data-testid="registro-success-cta">
              {cta.label}
            </Button>
            <Link href={destino('/panel')} className={styles.link} data-testid="registro-success-panel-link">
              Ir a mi panel
            </Link>
            {/* El texto de arriba es el del diseño; este aviso aclara que el email
                no sale: ni el mock ni el back mandan emails (el back crea la
                cuenta ya confirmada). docs/PRODUCT.md: nunca simular sin decirlo. */}
            <SimulatedFeatureNotice feature="el email de confirmación" data-testid="registro-email-simulado" />
          </>
        }
        data-testid="registro-success"
      />
    )
  }

  // ─── Render: paso 2 (datos) ─────────────────────────────────────────

  function renderStepDatos() {
    return (
      <>
        {serverError && (
          <StatusBlock
            variant="error"
            title={serverError.title}
            description={serverError.description}
            actions={
              <Button type="primary" onClick={handleRetry} data-testid="auth-retry-button">
                Reintentar
              </Button>
            }
            data-testid="auth-server-error"
          />
        )}
        <div hidden={serverError !== null}>
          <Form<DatosFormValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            // RNF-09 / diseño: se valida al salir de cada campo y de nuevo al
            // enviar; al enviar, el foco salta al primer campo con error.
            validateTrigger="onBlur"
            scrollToFirstError={{ focus: true, block: 'center' }}
            disabled={submitting}
            onFinish={handleSubmit}
            initialValues={{ aceptaTerminos: false }}
            className={styles.form}
            data-testid="registro-form"
          >
            {emailTaken && (
              <FormAlert
                title="Ya existe una cuenta con ese email"
                description={
                  <>
                    <Link href={loginHref}>Iniciar sesión</Link> o <Link href="/recuperar">recuperar contraseña</Link>.
                  </>
                }
                data-testid="registro-email-taken-alert"
              />
            )}
            {formError && <FormAlert title="Revisá los datos" description={formError} data-testid="registro-error-alert" />}

            <Form.Item label="Nombre" name="nombre" rules={reglasNombre}>
              <Input autoComplete="given-name" data-testid="registro-nombre-input" />
            </Form.Item>

            <Form.Item label="Apellido" name="apellido" rules={reglasApellido}>
              <Input autoComplete="family-name" data-testid="registro-apellido-input" />
            </Form.Item>

            <Form.Item
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              rules={reglasFechaNacimiento}
              extra="Tenés que ser mayor de 18 años para firmar un contrato."
              validateTrigger={['onBlur', 'onChange']}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="dd/mm/aaaa"
                disabledDate={(date) => date.isAfter(hoy(), 'day')}
                data-testid="registro-fecha-nacimiento-input"
              />
            </Form.Item>

            <Form.Item label="DNI" name="dni" rules={reglasDni} extra="Sin puntos ni guiones, como figura en tu documento.">
              <Input inputMode="numeric" data-testid="registro-dni-input" />
            </Form.Item>

            <Form.Item label="Teléfono" name="telefono" rules={reglasTelefono} extra="Con característica, sin el 0 y sin el 15.">
              <Input type="tel" inputMode="tel" autoComplete="tel-national" data-testid="registro-telefono-input" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={reglasEmail}>
              <Input type="email" autoComplete="email" inputMode="email" data-testid="registro-email-input" />
            </Form.Item>

            <Form.Item label="Contraseña" name="password" rules={reglasPasswordNueva} validateTrigger={['onBlur']}>
              <Input.Password autoComplete="new-password" aria-describedby="registro-password-fuerza" data-testid="registro-password-input" />
            </Form.Item>
            <div className={styles.meter}>
              <PasswordStrengthMeter
                id="registro-password-fuerza"
                strength={fuerzaPassword(password)}
                requirements={requisitosPassword(password)}
                data-testid="registro-password-strength"
              />
            </div>

            <Form.Item label="Repetir contraseña" name="passwordRepetida" dependencies={['password']} rules={reglasPasswordRepetida('password')}>
              <Input.Password autoComplete="new-password" visibilityToggle={false} data-testid="registro-password-repetida-input" />
            </Form.Item>

            <Form.Item name="aceptaTerminos" valuePropName="checked" rules={reglasTerminos} validateTrigger={['onChange']}>
              <Checkbox className={`${styles.checkbox} ${styles.checkboxTop}`} data-testid="registro-terminos-checkbox">
                Acepto los{' '}
                <button type="button" className={styles.linkButton} onClick={() => setDocumentoAbierto('terminos')} data-testid="registro-terminos-link">
                  Términos y condiciones
                </button>{' '}
                y la{' '}
                <button type="button" className={styles.linkButton} onClick={() => setDocumentoAbierto('privacidad')} data-testid="registro-privacidad-link">
                  Política de privacidad
                </button>{' '}
                de RentAR.
              </Checkbox>
            </Form.Item>

            <div className={styles.buttonRow}>
              <Button onClick={handleBack} className={styles.secondaryButton} disabled={submitting} data-testid="registro-back-button">
                Atrás
              </Button>
              {/* disabled={false}: mismo motivo que en LoginForm (el botón se ve azul con el spinner). */}
              <Button
                type="primary"
                htmlType="submit"
                disabled={false}
                loading={submitting}
                className={styles.submit}
                data-testid="registro-submit-button"
              >
                {submitting ? 'Creando tu cuenta…' : 'Crear mi cuenta'}
              </Button>
            </div>

            <TerminosModal documento={documentoAbierto} onClose={() => setDocumentoAbierto(null)} />
          </Form>
        </div>
      </>
    )
  }

  // ─── Render ─────────────────────────────────────────────────────────

  const title = step === 'listo' ? 'Cuenta creada' : step === 'rol' ? '¿Qué querés hacer en RentAR?' : 'Tus datos'
  const subtitle = step === 'rol' ? 'Elegí cómo vas a empezar' : undefined

  return (
    <AuthLayout title={title} subtitle={subtitle} data-testid="registro-page">
      {step === 'rol' && <RolStep value={rol} onChange={setRol} onContinue={() => setStep('datos')} loginHref={loginHref} />}
      {/* Montado también en el paso 1 (oculto), así "Atrás" no borra lo cargado. */}
      {step !== 'listo' && <div hidden={step !== 'datos'}>{renderStepDatos()}</div>}
      {step === 'listo' && renderListo()}
    </AuthLayout>
  )
}
