const path = require("path");
const crypto = require("crypto");
const { readJsonFile, writeJsonFile } = require("../utils/jsonFileStore");

const usersFilePath = path.join(__dirname, "..", "data", "users.json");
const sessionsFilePath = path.join(__dirname, "..", "data", "sessions.json");

async function readJson(filePath) {
  return readJsonFile(filePath, []);
}

async function writeJson(filePath, data) {
  await writeJsonFile(filePath, data);
}

async function readUsers() {
  return readJson(usersFilePath);
}

async function readSessions() {
  return readJson(sessionsFilePath);
}

async function findUserByPhone(phone) {
  const users = await readUsers();
  return users.find((user) => user.phone === phone) || null;
}

async function findUserById(userId) {
  const users = await readUsers();
  return users.find((user) => user.id === userId) || null;
}

async function createUser({ name, phone }) {
  const users = await readUsers();
  const user = {
    id: crypto.randomUUID(),
    name,
    phone,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  await writeJson(usersFilePath, users);

  return user;
}

async function createSession(userId) {
  const sessions = await readSessions();
  const session = {
    token: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString()
  };

  sessions.push(session);
  await writeJson(sessionsFilePath, sessions);

  return session;
}

async function findUserByToken(token) {
  const sessions = await readSessions();
  const session = sessions.find((item) => item.token === token);

  if (!session) {
    return null;
  }

  return findUserById(session.userId);
}

module.exports = {
  createSession,
  createUser,
  findUserByPhone,
  findUserByToken
};
