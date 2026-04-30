function WagonSelector({ wagons, selectedWagonId, onSelect }) {
  return (
    <div className="wagon-grid">
      {wagons.map((wagon) => {
        const isActive = wagon.id === selectedWagonId

        return (
          <button
            key={wagon.id}
            type="button"
            className={`wagon-card${isActive ? ' wagon-card-active' : ''}`}
            onClick={() => onSelect(wagon.id)}
          >
            <span className="wagon-card-badge">Вагон {wagon.id.replace('wagon-', '')}</span>
            <strong>{wagon.type}</strong>
            <span>{wagon.seatCount} місць</span>
          </button>
        )
      })}
    </div>
  )
}

export default WagonSelector
