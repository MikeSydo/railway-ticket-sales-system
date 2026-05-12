import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isAuthenticated } = useAuth()
  const [formValues, setFormValues] = useState({
    name: '',
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

    try {
      setIsSubmitting(true)
      setError('')
      await signIn({
        name: formValues.name.trim(),
        phone: formValues.phone.trim(),
      })
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
            <h2>Увійти або створити акаунт</h2>
          </div>

          <Link className="train-action" to="/">
            ← На головну
          </Link>
        </div>

        {error ? <div className="error-state">{error}</div> : null}

        <form className="booking-form" onSubmit={handleSubmit}>
          <label className="booking-field">
            <span>Ім’я</span>
            <input
              name="name"
              type="text"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Потрібно лише для нового користувача"
            />
          </label>

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
            {isSubmitting ? 'Виконуємо вхід...' : 'Увійти'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Auth
