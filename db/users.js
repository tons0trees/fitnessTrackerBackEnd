const client = require("./client");
const bcrypt = require('bcrypt')
const SALT_COUNT = 10;
// database functions

// user functions
async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  const {rows: [createdUser]} = await client.query(`
  INSERT INTO users(username, password)
  VALUES($1, $2)
  ON CONFLICT (username) DO NOTHING
  RETURNING id, username;
  `, [username, hashedPassword])

  return createdUser;
}

async function getUser({ username, password }) {
  const retrievedUser = await getUserByUsername(username)

  const passwordsMatch = await bcrypt.compare(password, retrievedUser.password)

  if (passwordsMatch) {
    delete retrievedUser.password
    return retrievedUser
  } else {
    return null
  }
}

async function getUserById(userId) {
  const {rows: [user]} = await client.query(`
  SELECT id, username
  FROM users
  WHERE id='${userId}';
  `)

  return user
}

async function getUserByUsername(userName) {
  const {rows: [user]} = await client.query(`
  SELECT *
  FROM users
  WHERE username='${userName}';
  `)

  return user
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
