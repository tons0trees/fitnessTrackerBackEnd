const client = require('./client');

async function getRoutineById(id){
}

async function getRoutinesWithoutActivities(){
  let {rows: allRoutines} = await client.query(`
  SELECT *
  FROM routines;
  `)

  return allRoutines
}

async function getAllRoutines() {
}

async function getAllRoutinesByUser({username}) {
}

async function getPublicRoutinesByUser({username}) {
}

async function getAllPublicRoutines() {
}

async function getPublicRoutinesByActivity({id}) {
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  const {rows: [createdRoutine]} = await client.query(`
  INSERT INTO routines("creatorId", "isPublic", name, goal)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `, [creatorId, isPublic, name, goal])
  return createdRoutine
}

async function updateRoutine({id, ...fields}) {
}

async function destroyRoutine(id) {
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}