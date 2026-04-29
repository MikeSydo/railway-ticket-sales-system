const express = require("express");
const bookingsRouter = require("./routes/bookings");
const trainsRouter = require("./routes/trains");

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    status: "Railway ticket sales backend is running"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok"
  });
});

app.use("/api/bookings", bookingsRouter);
app.use("/api/trains", trainsRouter);

module.exports = app;
