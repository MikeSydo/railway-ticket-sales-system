import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { signIn, signUp, isAuthenticated } = useAuth()
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login'
  const [formValues, setFormValues] = useState({
    username: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectPath = location.state?.from || '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  function handleChange(event) {
    const { name, value } = event.target
    if (error) {
      setError('')
    }

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formValues.phone.trim()) {
      setError('Введіть номер телефону.')
      return
    }

    if (mode === 'register' && !formValues.username.trim()) {
      setError('Введіть username.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      if (mode === 'register') {
        await signUp({
          username: formValues.username.trim(),
          phone: formValues.phone.trim(),
        })
      } else {
        await signIn({
          phone: formValues.phone.trim(),
        })
      }

      navigate(redirectPath, { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <h1>Вхід за номером телефону</h1>
      </section>

      <section className="results-panel auth-panel">
        <div className="results-header">
          <div>
            <p className="section-kicker">Авторизація</p>
            <h2>{mode === 'register' ? 'Створити акаунт' : 'Увійти'}</h2>
          </div>

          <Link className="train-action" to="/">
            ← На головну
          </Link>
        </div>

        {error ? <div className="error-state">{error}</div> : null}

        <div className="auth-mode-switch">
          <button
            className={`auth-mode-button${mode === 'login' ? ' auth-mode-button-active' : ''}`}
            type="button"
            onClick={() => setSearchParams({ mode: 'login' })}
          >
            Увійти
          </button>
          <button
            className={`auth-mode-button${mode === 'register' ? ' auth-mode-button-active' : ''}`}
            type="button"
            onClick={() => setSearchParams({ mode: 'register' })}
          >
            Зареєструватися
          </button>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label className="booking-field">
              <span>Username</span>
              <input
                name="username"
                type="text"
                required
                minLength="2"
                value={formValues.username}
                onChange={handleChange}
                placeholder="Введіть username"
              />
            </label>
          ) : null}

          <label className="booking-field">
            <span>Телефон</span>
            <input
              name="phone"
              type="tel"
              required
              pattern="^\+?[0-9\s\-()]{10,20}$"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="+380..."
            />
          </label>

          <button className="train-action" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'register'
                ? 'Створюємо акаунт...'
                : 'Виконуємо вхід...'
              : mode === 'register'
                ? 'Зареєструватися'
                : 'Увійти'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Auth
