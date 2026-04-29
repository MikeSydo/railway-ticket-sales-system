const fs = require("fs/promises");
const path = require("path");

const bookingsFilePath = path.join(__dirname, "..", "data", "bookings.json");

async function readBookings() {
  const raw = await fs.readFile(bookingsFilePath, "utf8");
  return JSON.parse(raw);
}

async function getBookingsByTrainAndWagon(trainId, wagonId) {
  const bookings = await readBookings();
  return bookings.filter((booking) => booking.trainId === trainId && booking.wagonId === wagonId);
}

module.exports = {
  readBookings,
  getBookingsByTrainAndWagon
};
