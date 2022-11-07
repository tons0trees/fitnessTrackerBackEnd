const client = require("./client")

// database functions
async function getAllActivities() {

}

async function getActivityById(id) {
  
}

async function getActivityByName(name) {

}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
}

// return the new activity
async function createActivity({ name, description }) {
const {rows: [createdActivity]} = await client.query(`
  INSERT INTO activities(name, description)
  VALUES($1, $2)
  RETURNING *;
`, [name, description])
return createdActivity;
}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {

}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
