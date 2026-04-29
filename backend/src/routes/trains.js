const express = require("express");

const trains = require("../data/trains");
const { getBookingsByTrainAndWagon } = require("../services/bookingService");
const { buildSeatMap, collectBookedSeatIds } = require("../utils/seatMap");

const router = express.Router();

function findTrain(trainId) {
  return trains.find((train) => train.id === trainId);
}

function findWagon(train, wagonId) {
  return train.wagons.find((wagon) => wagon.id === wagonId);
}

router.get("/", (req, res) => {
  const search = String(req.query.search || "").trim().toLowerCase();

  const items = trains
    .filter((train) => {
      if (!search) {
        return true;
      }

      const route = `${train.from} ${train.to}`.toLowerCase();
      return train.number.toLowerCase().includes(search) || route.includes(search);
    })
    .map((train) => ({
      id: train.id,
      number: train.number,
      from: train.from,
      to: train.to,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration
    }));

  res.json({
    items,
    total: items.length
  });
});

router.get("/:trainId", (req, res) => {
  const train = findTrain(req.params.trainId);

  if (!train) {
    return res.status(404).json({
      message: "Train not found."
    });
  }

  const wagons = train.wagons.map((wagon) => ({
    ...wagon,
    seatLayout: {
      rows: wagon.rows,
      seatsPerRow: wagon.seatsPerRow
    }
  }));

  return res.json({
    ...train,
    wagons
  });
});

router.get("/:trainId/wagons/:wagonId/seats", async (req, res, next) => {
  try {
    const train = findTrain(req.params.trainId);

    if (!train) {
      return res.status(404).json({
        message: "Train not found."
      });
    }

    const wagon = findWagon(train, req.params.wagonId);

    if (!wagon) {
      return res.status(404).json({
        message: "Wagon not found."
      });
    }

    const bookings = await getBookingsByTrainAndWagon(train.id, wagon.id);
    const bookedSeatIds = collectBookedSeatIds(bookings);

    return res.json({
      trainId: train.id,
      wagonId: wagon.id,
      wagonType: wagon.type,
      seats: buildSeatMap(wagon, bookedSeatIds)
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
