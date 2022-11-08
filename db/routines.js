const client = require('./client');
const { getRoutineActivitiesByRoutine } = require('./routine_activities.js')
const { attachActivitiesToRoutines, getActivityById } = require('./activities')
const { getUserById } =  require('./users')

async function getRoutineById(id){
  const {rows: [returnedRoutine]} = await client.query(`
  SELECT *
  FROM routines
  WHERE id=${id};
  `)

  return returnedRoutine
}

async function getRoutinesWithoutActivities(){
  const {rows: allRoutines} = await client.query(`
  SELECT *
  FROM routines;
  `)

  return allRoutines
}

async function getAllRoutines() {
  const {rows} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON "creatorId"=users.id
  ;`)

  const routinesWithActivities = await attachActivitiesToRoutines(rows)

  return routinesWithActivities
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
  ON CONFLICT (name) DO NOTHING
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