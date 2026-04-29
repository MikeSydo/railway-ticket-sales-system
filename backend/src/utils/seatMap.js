function collectBookedSeatIds(bookings) {
  return bookings.flatMap((booking) => booking.seatIds);
}

function buildSeatMap(wagon, bookedSeatIds = []) {
  const bookedSeats = new Set(bookedSeatIds);
  const seats = [];

  for (let seatNumber = 1; seatNumber <= wagon.seatCount; seatNumber += 1) {
    const row = Math.ceil(seatNumber / wagon.seatsPerRow);
    const position = ((seatNumber - 1) % wagon.seatsPerRow) + 1;

    seats.push({
      id: seatNumber,
      row,
      position,
      status: bookedSeats.has(seatNumber) ? "booked" : "available"
    });
  }

  return seats;
}

module.exports = {
  buildSeatMap,
  collectBookedSeatIds
};
