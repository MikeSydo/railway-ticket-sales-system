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

async function buildSessionResponse(user, res) {
  const session = await createSession(user.id);

  return res.status(200).json({
    token: session.token,
    user
  });
}

router.post("/login", async (req, res, next) => {
  try {
    const phone = normalizePhone(req.body.phone);

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: "Phone number must contain 10 to 15 digits."
      });
    }

    const user = await findUserByPhone(phone);

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    return buildSessionResponse(user, res);
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const username = String(req.body.username || "").trim();

    if (!username) {
      return res.status(400).json({
        message: "Username is required."
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: "Phone number must contain 10 to 15 digits."
      });
    }

    const existingUser = await findUserByPhone(phone);

    if (existingUser) {
      return res.status(409).json({
        message: "User with this phone already exists."
      });
    }

    const user = await createUser({
      name: username,
      phone
    });

    return buildSessionResponse(user, res);
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
