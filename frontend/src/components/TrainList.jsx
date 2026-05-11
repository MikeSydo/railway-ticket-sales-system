import TrainCard from './TrainCard'

function TrainList({ trains, isLoading }) {
  if (isLoading) {
    return <div className="loading-state">Завантажуємо рейси...</div>
  }

  if (trains.length === 0) {
    return (
      <div className="empty-state">
        <h3>Нічого не знайдено</h3>
        <p>Спробуйте інший номер потяга або назву міста.</p>
      </div>
    )
  }

  return (
    <div className="train-grid">
      {trains.map((train) => (
        <TrainCard key={train.id} train={train} />
      ))}
    </div>
  )
}

export default TrainList
