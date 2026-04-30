import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SeatMap from '../components/SeatMap'
import WagonSelector from '../components/WagonSelector'
import { getTrainDetails, getWagonSeats } from '../services/bookingService'

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

function Booking() {
  const { trainId } = useParams()
  const [train, setTrain] = useState(null)
  const [selectedWagonId, setSelectedWagonId] = useState('')
  const [seats, setSeats] = useState([])
  const [selectedSeatIds, setSelectedSeatIds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSeatsLoading, setIsSeatsLoading] = useState(false)
  const [error, setError] = useState('')
  const [seatsError, setSeatsError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadTrain() {
      try {
        setIsLoading(true)
        setError('')

        const details = await getTrainDetails(trainId, controller.signal)
        setTrain(details)
        setSelectedWagonId(details.wagons[0]?.id || '')
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

    loadTrain()

    return () => controller.abort()
  }, [trainId])

  useEffect(() => {
    if (!selectedWagonId) {
      return
    }

    const controller = new AbortController()

    async function loadSeats() {
      try {
        setIsSeatsLoading(true)
        setSeatsError('')
        setSelectedSeatIds([])

        const data = await getWagonSeats(trainId, selectedWagonId, controller.signal)
        setSeats(data.seats)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setSeatsError(loadError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSeatsLoading(false)
        }
      }
    }

    loadSeats()

    return () => controller.abort()
  }, [trainId, selectedWagonId])

  function handleToggleSeat(seatId) {
    setSelectedSeatIds((current) =>
      current.includes(seatId)
        ? current.filter((value) => value !== seatId)
        : [...current, seatId]
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <h1>Бронювання квитків</h1>
      </section>

      <section className="results-panel">
        <div className="results-header">
          <div>
            <p className="section-kicker">Обраний рейс</p>
            <h2>
              {isLoading
                ? 'Завантаження...'
                : train
                  ? `${train.from} → ${train.to}`
                  : 'Рейс недоступний'}
            </h2>
          </div>

          <Link className="train-action back-link" to="/">
            ← До списку рейсів
          </Link>
        </div>

        {error ? <div className="error-state">{error}</div> : null}

        {train && !error ? (
          <>
            <div className="booking-summary">
              <div>
                <span>Потяг</span>
                <strong>{train.number}</strong>
              </div>
              <div>
                <span>Відправлення</span>
                <strong>{formatDateTime(train.departureTime)}</strong>
              </div>
              <div>
                <span>Прибуття</span>
                <strong>{formatDateTime(train.arrivalTime)}</strong>
              </div>
              <div>
                <span>Тривалість</span>
                <strong>{train.duration}</strong>
              </div>
            </div>

            <div className="booking-block">
              <div className="booking-block-header">
                <h3>Оберіть вагон</h3>
              </div>

              <WagonSelector
                wagons={train.wagons}
                selectedWagonId={selectedWagonId}
                onSelect={setSelectedWagonId}
              />
            </div>

            <div className="booking-block">
              <div className="booking-block-header">
                <h3>Оберіть місця</h3>
              </div>

              <div className="seat-legend">
                <span className="legend-item">
                  <span className="legend-swatch legend-available"></span>
                  Вільні
                </span>
                <span className="legend-item">
                  <span className="legend-swatch legend-selected"></span>
                  Обрані
                </span>
                <span className="legend-item">
                  <span className="legend-swatch legend-booked"></span>
                  Заброньовані
                </span>
              </div>

              {seatsError ? <div className="error-state">{seatsError}</div> : null}
              {isSeatsLoading ? <div className="loading-state">Завантажуємо схему місць...</div> : null}
              {!isSeatsLoading && !seatsError ? (
                <SeatMap
                  seats={seats}
                  selectedSeatIds={selectedSeatIds}
                  onToggleSeat={handleToggleSeat}
                />
              ) : null}
            </div>
          </>
        ) : null}

        {isLoading && !error ? <div className="loading-state">Завантажуємо дані рейсу...</div> : null}
      </section>
    </main>
  )
}

export default Booking
