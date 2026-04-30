import { Link } from 'react-router-dom'

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

function formatDuration(value) {
  return value.replace('h', ' год ').replace('m', ' хв').trim()
}

function TrainCard({ train }) {
  return (
    <article className="train-card">
      <div className="train-card-top">
        <span className="train-badge">Потяг {train.number}</span>
        {train.type ? <span className="train-type">{train.type}</span> : null}
      </div>

      <h3>
        {train.from} → {train.to}
      </h3>

      <dl className="train-meta">
        <div>
          <dt>Відправлення</dt>
          <dd>{formatDateTime(train.departureTime)}</dd>
        </div>
        <div>
          <dt>Прибуття</dt>
          <dd>{formatDateTime(train.arrivalTime)}</dd>
        </div>
        <div>
          <dt>Тривалість</dt>
          <dd>{formatDuration(train.duration)}</dd>
        </div>
      </dl>

      <Link className="train-action" to={`/booking/${train.id}`}>
        Обрати рейс
      </Link>
    </article>
  )
}

export default TrainCard
