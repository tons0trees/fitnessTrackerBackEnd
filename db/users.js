const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  const {rows: [createdUser]} = await client.query(`
  INSERT INTO users(username, password)
  VALUES($1, $2)
  RETURNING *;
  `, [username, password])

  return createdUser;
  
}

async function getUser({ username, password }) {
  const {rows: [returnedUser]} = await client.query(`
  SELECT *
  FROM users
  WHERE username='${username}' AND password='${password}';
  `)
  console.log("test2", returnedUser)
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
