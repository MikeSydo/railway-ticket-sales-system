const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const bookingsFilePath = path.join(__dirname, "..", "data", "bookings.json");

async function readBookings() {
  const raw = await fs.readFile(bookingsFilePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, ""));
}

async function getBookingsByTrainAndWagon(trainId, wagonId) {
  const bookings = await readBookings();
  return bookings.filter((booking) => booking.trainId === trainId && booking.wagonId === wagonId);
}

async function writeBookings(bookings) {
  await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), "utf8");
}

async function createBooking(payload) {
  const bookings = await readBookings();
  const booking = {
    id: crypto.randomUUID(),
    userId: payload.userId,
    trainId: payload.trainId,
    wagonId: payload.wagonId,
    seatIds: payload.seatIds,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  await writeBookings(bookings);

  return booking;
}

async function getBookingsByUserId(userId) {
  const bookings = await readBookings();
  return bookings.filter((booking) => booking.userId === userId);
}

async function deleteBookingById(bookingId) {
  const bookings = await readBookings();
  const booking = bookings.find((item) => item.id === bookingId) || null;

  if (!booking) {
    return null;
  }

  const nextBookings = bookings.filter((item) => item.id !== bookingId);
  await writeBookings(nextBookings);

  return booking;
}

module.exports = {
  createBooking,
  deleteBookingById,
  getBookingsByUserId,
  readBookings,
  getBookingsByTrainAndWagon
};
