const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  const {rows: [createdUser]} = await client.query(`
  INSERT INTO users(username, password)
  VALUES($1, $2)
  ON CONFLICT (username) DO NOTHING
  RETURNING id, username;
  `, [username, password])

  return createdUser;
  
}

async function getUser({ username, password }) {
  const {rows: [user]} = await client.query(`
  SELECT id, username
  FROM users
  WHERE username='${username}' AND password='${password}';
  `)
  
  return user
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
  SELECT id, username
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
