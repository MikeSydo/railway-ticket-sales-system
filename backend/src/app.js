const express = require("express");
const authRouter = require("./routes/auth");
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

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/trains", trainsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.path} not found.`
  });
});

app.use((error, _req, res, _next) => {
  res.status(500).json({
    message: error.message || "Internal server error."
  });
});

module.exports = app;
