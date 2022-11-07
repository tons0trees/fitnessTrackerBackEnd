const client = require("./client")

// database functions
async function getAllActivities() {
  const {rows: allActivities} = await client.query(`
  SELECT *
  FROM activities
  `)

  return allActivities
}

async function getActivityById(id) {
  const {rows: [activity]} = await client.query(`
  SELECT *
  FROM activities
  WHERE id='${id}';
  `)
  return activity;
}

async function getActivityByName(name) {
  const {rows: [activity]} = await client.query(`
  SELECT *
  FROM activities
  WHERE name='${name}';
  `)
  return activity;
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
}

// return the new activity
async function createActivity({ name, description }) {
const {rows: [createdActivity]} = await client.query(`
  INSERT INTO activities(name, description)
  VALUES($1, $2)
  ON CONFLICT (name) DO NOTHING
  RETURNING *;
`, [name, description])
return createdActivity;
}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (elem, index) => `"${elem}"=$${index + 1}`
  ).join(', ');
  const {rows: [updatedActivity]} = await client.query(`
  UPDATE activities
  SET ${setString}
  WHERE id=${id}
  RETURNING *;
  `, Object.values(fields))
  return updatedActivity;
}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
