const client = require('./client');
const { getRoutineActivitiesByRoutine } = require('./routine_activities.js')
const { getActivityById } = require('./activities')

async function getRoutineById(id){
  const {rows: [returnedRoutine]} = await client.query(`
  SELECT *
  FROM routines
  WHERE id=${id};
  `)

  const activityNums = await getRoutineActivitiesByRoutine(returnedRoutine)
  returnedRoutine.activities = await Promise.all(activityNums.map(elem => getActivityById(elem.activityId)))

  return returnedRoutine
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