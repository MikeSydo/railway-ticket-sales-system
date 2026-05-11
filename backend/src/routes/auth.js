const express = require("express");

const {
  createSession,
  createUser,
  findUserByPhone,
  findUserByToken
} = require("../services/userService");

const router = express.Router();

function normalizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").trim();
}

function isValidPhone(phone) {
  return /^\+?\d{10,15}$/.test(phone);
}

router.post("/phone", async (req, res, next) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const name = String(req.body.name || "").trim();

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: "Phone number must contain 10 to 15 digits."
      });
    }

    let user = await findUserByPhone(phone);

    if (!user) {
      if (!name) {
        return res.status(404).json({
          message: "User not found. Provide a name to create a new account."
        });
      }

      user = await createUser({ name, phone });
    }

    const session = await createSession(user.id);

    return res.status(200).json({
      token: session.token,
      user
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization || "";
    const token = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.slice(7).trim()
      : "";

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is required."
      });
    }

    const user = await findUserByToken(token);

    if (!user) {
      return res.status(401).json({
        message: "Session is invalid or expired."
      });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
