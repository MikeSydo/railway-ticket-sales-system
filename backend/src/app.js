const express = require("express");

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

module.exports = app;
