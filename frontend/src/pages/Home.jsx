import { useDeferredValue, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TrainList from '../components/TrainList'
import { useAuth } from '../context/AuthContext'
import { getTrains } from '../services/trainService'

function Home() {
  const { isAuthenticated, signOut, user } = useAuth()
  const [search, setSearch] = useState('')
  const [trains, setTrains] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTrains() {
      try {
        setIsLoading(true)
        setError('')

        const items = await getTrains(deferredSearch, controller.signal)
        setTrains(items)
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

    loadTrains()

    return () => controller.abort()
  }, [deferredSearch])

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Railway ticket sales system</p>
        <h1>Пошук рейсів для бронювання квитків</h1>

        <div className="hero-auth-row">
          {isAuthenticated ? (
            <>
              <span className="user-badge">
                {user.name} · {user.phone}
              </span>
              <button className="train-action secondary-action" type="button" onClick={signOut}>
                Вийти
              </button>
            </>
          ) : (
            <Link className="train-action" to="/auth">
              Увійти
            </Link>
          )}
        </div>

        <label className="search-panel" htmlFor="train-search">
          <span>Пошук за номером потяга або маршрутом</span>
          <input
            id="train-search"
            type="search"
            placeholder="Наприклад: 091К або Київ"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </section>

      <section className="results-panel">
        <div className="results-header">
          <div>
            <p className="section-kicker">Доступні рейси</p>
            <h2>{isLoading ? 'Завантаження...' : `${trains.length} знайдено`}</h2>
          </div>
        </div>

        {error ? <div className="error-state">{error}</div> : null}
        {!error ? <TrainList isLoading={isLoading} trains={trains} /> : null}
      </section>
    </main>
  )
}

export default Home
