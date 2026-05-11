function SeatMap({ seats, selectedSeatIds, onToggleSeat }) {
  return (
    <div className="seat-map">
      {seats.map((seat) => {
        const isSelected = selectedSeatIds.includes(seat.id)
        const isBooked = seat.status === 'booked'

        let seatClassName = 'seat'
        if (isBooked) {
          seatClassName += ' seat-booked'
        } else if (isSelected) {
          seatClassName += ' seat-selected'
        } else {
          seatClassName += ' seat-available'
        }

        return (
          <button
            key={seat.id}
            type="button"
            className={seatClassName}
            disabled={isBooked}
            onClick={() => onToggleSeat(seat.id)}
          >
            <span className="seat-number">{seat.id}</span>
            <span className="seat-position">
              Ряд {seat.row}, місце {seat.position}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default SeatMap
