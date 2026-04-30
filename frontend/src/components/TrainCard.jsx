function TrainCard({ train }) {
  return (
    <article className="train-card">
      <div className="train-card-top">
        <span className="train-badge">Потяг {train.number}</span>
        <span className="train-type">{train.type}</span>
      </div>

      <h3>
        {train.from} → {train.to}
      </h3>

      <dl className="train-meta">
        <div>
          <dt>Відправлення</dt>
          <dd>{train.departureTime}</dd>
        </div>
        <div>
          <dt>Прибуття</dt>
          <dd>{train.arrivalTime}</dd>
        </div>
        <div>
          <dt>Тривалість</dt>
          <dd>{train.duration}</dd>
        </div>
      </dl>

      <button className="train-action" type="button">
        Обрати рейс
      </button>
    </article>
  )
}

export default TrainCard
