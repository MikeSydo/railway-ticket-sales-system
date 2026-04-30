import { useState } from 'react'
import TrainList from '../components/TrainList'
import { trains } from '../data/trains'

function Home() {
  const [search, setSearch] = useState('')

  const normalizedSearch = search.trim().toLowerCase()
  const filteredTrains = trains.filter((train) => {
    if (!normalizedSearch) {
      return true
    }

    const route = `${train.from} ${train.to}`.toLowerCase()
    return (
      train.number.toLowerCase().includes(normalizedSearch) ||
      route.includes(normalizedSearch)
    )
  })

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Railway ticket sales system</p>
        <h1>Пошук рейсів для бронювання квитків</h1>

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
            <h2>{filteredTrains.length} знайдено</h2>
          </div>
        </div>

        <TrainList trains={filteredTrains} />
      </section>
    </main>
  )
}

export default Home
