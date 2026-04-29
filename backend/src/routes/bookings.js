const express = require("express");

const trains = require("../data/trains");
const { createBooking, getBookingsByTrainAndWagon } = require("../services/bookingService");
const { collectBookedSeatIds } = require("../utils/seatMap");

const router = express.Router();

function validateBookingPayload(body) {
  const requiredFields = ["trainId", "wagonId", "name", "phone", "email", "seatIds"];
  const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}.`;
  }

  if (!Array.isArray(body.seatIds) || body.seatIds.length === 0) {
    return "seatIds must be a non-empty array.";
  }

  if (!body.seatIds.every((seatId) => Number.isInteger(seatId) && seatId > 0)) {
    return "seatIds must contain positive integer values.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(body.email)) {
    return "email must be valid.";
  }

  return null;
}

router.post("/", async (req, res, next) => {
  try {
    const validationError = validateBookingPayload(req.body);
    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const train = trains.find((item) => item.id === req.body.trainId);
    if (!train) {
      return res.status(404).json({
        message: "Train not found."
      });
    }

    const wagon = train.wagons.find((item) => item.id === req.body.wagonId);
    if (!wagon) {
      return res.status(404).json({
        message: "Wagon not found."
      });
    }

    const invalidSeatIds = req.body.seatIds.filter((seatId) => seatId > wagon.seatCount);
    if (invalidSeatIds.length > 0) {
      return res.status(400).json({
        message: `Selected seats are outside wagon capacity: ${invalidSeatIds.join(", ")}.`
      });
    }

    const existingBookings = await getBookingsByTrainAndWagon(train.id, wagon.id);
    const bookedSeatIds = new Set(collectBookedSeatIds(existingBookings));
    const conflictingSeatIds = req.body.seatIds.filter((seatId) => bookedSeatIds.has(seatId));

    if (conflictingSeatIds.length > 0) {
      return res.status(409).json({
        message: `Some seats are already booked: ${conflictingSeatIds.join(", ")}.`,
        conflictingSeatIds
      });
    }

    const booking = await createBooking({
      trainId: train.id,
      wagonId: wagon.id,
      seatIds: req.body.seatIds,
      name: String(req.body.name).trim(),
      phone: String(req.body.phone).trim(),
      email: String(req.body.email).trim()
    });

    return res.status(201).json({
      message: "Booking created successfully.",
      booking
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
