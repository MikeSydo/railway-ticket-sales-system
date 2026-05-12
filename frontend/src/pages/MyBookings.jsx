import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cancelBooking, getMyBookings } from '../services/bookingService'

function formatDateTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function MyBookings() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancellingId, setCancellingId] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadBookings() {
      try {
        setIsLoading(true)
        setError('')

        const items = await getMyBookings(token, controller.signal)
        setBookings(items)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadBookings()

    return () => controller.abort()
  }, [token])

  async function handleCancelBooking(bookingId) {
    try {
      setCancellingId(bookingId)
      setError('')
      setSuccess('')

      await cancelBooking(bookingId, token)
      setBookings((current) => current.filter((booking) => booking.id !== bookingId))
      setSuccess('Бронювання успішно скасовано.')
    } catch (cancelError) {
      setError(cancelError.message)
    } finally {
      setCancellingId('')
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <h1>Мої бронювання</h1>
      </section>

      <section className="results-panel">
        <div className="results-header">
          <div>
            <p className="section-kicker">Керування бронюваннями</p>
            <h2>{isLoading ? 'Завантаження...' : `${bookings.length} бронювань`}</h2>
          </div>

          <Link className="train-action" to="/">
            ← На головну
          </Link>
        </div>

        {error ? <div className="error-state">{error}</div> : null}
        {success ? <div className="success-state">{success}</div> : null}
        {isLoading ? <div className="loading-state">Завантажуємо бронювання...</div> : null}

        {!isLoading && !error && bookings.length === 0 ? (
          <div className="empty-state">
            <h3>У вас ще немає бронювань</h3>
            <p>Поверніться до списку рейсів і створіть перше бронювання.</p>
          </div>
        ) : null}

        {!isLoading && bookings.length > 0 ? (
          <div className="my-bookings-grid">
            {bookings.map((booking) => (
              <article className="my-booking-card" key={booking.id}>
                <div className="my-booking-top">
                  <span className="train-badge">Бронювання</span>
                  <span className="train-type">Вагон {booking.wagonId.replace('wagon-', '')}</span>
                </div>

                <dl className="train-meta">
                  <div>
                    <dt>Рейс</dt>
                    <dd>{booking.trainId}</dd>
                  </div>
                  <div>
                    <dt>Місця</dt>
                    <dd>{booking.seatIds.join(', ')}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{booking.email}</dd>
                  </div>
                  <div>
                    <dt>Створено</dt>
                    <dd>{formatDateTime(booking.createdAt)}</dd>
                  </div>
                </dl>

                <button
                  className="train-action danger-action"
                  type="button"
                  disabled={cancellingId === booking.id}
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  {cancellingId === booking.id ? 'Скасовуємо...' : 'Скасувати бронювання'}
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default MyBookings
