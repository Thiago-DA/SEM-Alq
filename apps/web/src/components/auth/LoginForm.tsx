'use client'

/**
 * LoginForm.tsx — formulario de `/login` (US-39 Iniciar y cerrar sesión).
 *
 * Qué es: email, contraseña (oculta, con botón para verla), "Recordarme",
 * "¿Olvidaste tu contraseña?" y el link al registro. Diseño: Claude Design,
 * "Autenticación" · 01 (escritorio), 02 (móvil y errores) y 05 (estados).
 *
 * De dónde saca los datos: `useAuth().login`, que llama a
 * `services/auth.service.ts#login`.
 *
 * Criterios de US-39 que cubre:
 * - Mail y contraseña obligatorios (reglas de `lib/validation/usuario.rules.ts`).
 * - Contraseña oculta al escribir (`Input.Password`).
 * - Error de credenciales genérico: nunca dice si el mail existe.
 * - Vuelve a la página anterior (`next`, ya validado como ruta interna).
 *
 * Quién lo usa: `app/(auth)/login/page.tsx`.
 */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Checkbox, Form, Input } from 'antd'
import type { UsuarioSesion } from '@rentar/shared-types'
import { useAuth } from '@/lib/auth/AuthProvider'
import { reglasEmail, reglasPasswordLogin } from '@/lib/validation/usuario.rules'
import { ServiceError } from '@/services/shared/errors'
import { FormAlert } from './FormAlert'
import { serverErrorCopy, type ServerErrorCopy } from './serverError'
import { StatusBlock } from './StatusBlock'
import styles from './AuthForm.module.css'

interface LoginFormValues {
  email: string
  password: string
  remember: boolean
}

interface LoginFormProps {
  /** Ruta interna a la que volver después del login (ya pasada por `safeNextPath`), o `null`. */
  next: string | null
  /** Email precargado (viene del registro, para que solo falte la contraseña). */
  initialEmail?: string
}

/**
 * Adónde ir después del login si no hay `next`: el locador a su panel; una
 * cuenta solo locataria, a buscar (su panel no es del Sprint 1).
 */
function defaultDestination(usuario: UsuarioSesion): string {
  return usuario.roles.includes('locador') ? '/panel' : '/buscar'
}

/** Formulario de inicio de sesión. */
export function LoginForm({ next, initialEmail }: LoginFormProps) {
  const router = useRouter()
  const { login, user, isLoading } = useAuth()
  const [form] = Form.useForm<LoginFormValues>()

  // ─── Estado local ───────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false)
  const [credentialsError, setCredentialsError] = useState(false)
  const [serverError, setServerError] = useState<ServerErrorCopy | null>(null)

  // Si ya hay sesión (por ejemplo, volvió con el botón "atrás"), no tiene
  // sentido mostrar el login: se sigue de largo.
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(next ?? defaultDestination(user))
    }
  }, [isLoading, user, next, router])

  // ─── Handlers ───────────────────────────────────────────────────────

  async function handleSubmit(values: LoginFormValues): Promise<void> {
    setSubmitting(true)
    setCredentialsError(false)
    setServerError(null)
    try {
      const usuario = await login({ email: values.email, password: values.password }, { remember: values.remember })
      router.replace(next ?? defaultDestination(usuario))
    } catch (error) {
      if (error instanceof ServiceError && error.code === 'unauthorized') {
        // US-39: mensaje genérico arriba y el campo de contraseña marcado,
        // sin decir cuál de los dos datos falló.
        setCredentialsError(true)
        form.setFields([{ name: 'password', value: '', errors: ['Escribila de nuevo'] }])
      } else {
        setServerError(serverErrorCopy(error))
      }
    } finally {
      setSubmitting(false)
    }
  }

  /** "Reintentar" del error del servidor: vuelve a enviar lo que ya estaba escrito. */
  function handleRetry(): void {
    setServerError(null)
    void handleSubmit(form.getFieldsValue(true))
  }

  const registerHref = next ? `/registro?next=${encodeURIComponent(next)}` : '/registro'

  // ─── Render ─────────────────────────────────────────────────────────

  if (serverError) {
    return (
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
    )
  }

  return (
    <Form<LoginFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      validateTrigger="onBlur"
      scrollToFirstError={{ focus: true, block: 'center' }}
      disabled={submitting}
      onFinish={handleSubmit}
      initialValues={{ remember: false, email: initialEmail }}
      className={styles.form}
      data-testid="login-form"
    >
      {credentialsError && (
        <FormAlert
          title="El email o la contraseña no coinciden"
          description={
            <>
              Revisá los datos o <Link href="/recuperar">recuperá tu contraseña</Link>.
            </>
          }
          data-testid="login-error-alert"
        />
      )}

      <Form.Item label="Email" name="email" rules={reglasEmail}>
        <Input type="email" autoComplete="email" inputMode="email" data-testid="login-email-input" />
      </Form.Item>

      {/* US-39: "reemplazar visualmente los caracteres de la contraseña" → Input.Password. */}
      <Form.Item label="Contraseña" name="password" rules={reglasPasswordLogin}>
        <Input.Password autoComplete="current-password" data-testid="login-password-input" />
      </Form.Item>

      <div className={styles.rowBetween}>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox className={styles.checkbox} data-testid="login-remember-checkbox">
            <span className={styles.desktopOnly}>Recordarme en este dispositivo</span>
            <span className={styles.mobileOnly}>Recordarme</span>
          </Checkbox>
        </Form.Item>
        <Link href="/recuperar" className={`${styles.link} ${styles.desktopOnly}`} data-testid="login-forgot-link">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* El Form entero se deshabilita al enviar, pero el botón no (disabled={false}):
          tiene que verse azul con el spinner (Autenticación · 05); `loading` ya evita el doble envío. */}
      <Button
        type="primary"
        htmlType="submit"
        disabled={false}
        block
        loading={submitting}
        className={styles.submit}
        data-testid="login-submit-button"
      >
        {submitting ? 'Ingresando…' : 'Ingresar'}
      </Button>

      {/* En móvil el link queda debajo del botón (Autenticación · 02). */}
      <Link href="/recuperar" className={`${styles.link} ${styles.centered} ${styles.mobileOnly}`} data-testid="login-forgot-link-mobile">
        ¿Olvidaste tu contraseña?
      </Link>

      <p className={styles.footerText}>
        <span className={styles.desktopOnly}>¿Todavía no tenés cuenta? </span>
        <span className={styles.mobileOnly}>¿No tenés cuenta? </span>
        <Link href={registerHref} className={styles.link} data-testid="login-register-link">
          <span className={styles.desktopOnly}>Creá una gratis</span>
          <span className={styles.mobileOnly}>Registrate</span>
        </Link>
      </p>
    </Form>
  )
}
