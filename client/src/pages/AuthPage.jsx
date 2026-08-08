import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { extractErrorMessage } from '../api/axiosClient'
import { validateLoginForm, validateRegisterForm } from '../utils/validators'
import Spinner from '../components/ui/Spinner'
import { toast } from '../components/ui/Toast'

function Field({ label, type, value, onChange, error }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="input-field" />
      {error && <span className="mt-1 block text-xs text-terracotta-600">{error}</span>}
    </label>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // ProtectedRoute stashes the originally intended path here so login/register
  // can bounce the user right back to /checkout or /orders on success.
  const redirectTo = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setErrors({})
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = mode === 'login' ? validateLoginForm(form) : validateRegisterForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    setFormError('')
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
        toast('Welcome back!', 'success')
      } else {
        await register({ name: form.name, email: form.email, password: form.password })
        toast('Account created — welcome to Outpost Goods!', 'success')
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setFormError(extractErrorMessage(err, mode === 'login' ? 'Could not sign in.' : 'Could not create your account.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <div className="card-surface p-8">
        <p className="section-eyebrow text-center">Outpost Goods</p>
        <h1 className="mt-2 text-center font-display text-2xl font-medium">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1 text-center text-sm text-ink-faint">
          {mode === 'login' ? 'Sign in to check out and view your orders.' : 'Join to save your orders and check out faster.'}
        </p>

        <div className="mt-6 flex rounded-full bg-paper p-1 ring-1 ring-inset ring-ink/10">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-ink text-paper' : 'text-ink-soft'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              mode === 'register' ? 'bg-ink text-paper' : 'text-ink-soft'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {mode === 'register' && (
            <Field label="Name" type="text" value={form.name} onChange={(v) => updateField('name', v)} error={errors.name} />
          )}
          <Field label="Email" type="email" value={form.email} onChange={(v) => updateField('email', v)} error={errors.email} />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => updateField('password', v)}
            error={errors.password}
          />
          {mode === 'register' && (
            <Field
              label="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={(v) => updateField('confirmPassword', v)}
              error={errors.confirmPassword}
            />
          )}

          {formError && <p className="text-sm text-terracotta-600">{formError}</p>}

          <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full py-3">
            {isSubmitting ? <Spinner size="sm" /> : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint">
        <Link to="/" className="hover:text-ink">
          ← Back to shop
        </Link>
      </p>
    </div>
  )
}
