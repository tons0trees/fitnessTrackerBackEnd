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
  const {rows: allRoutineIds} = await client.query(`
  SELECT id
  FROM routines;
  `)

  const allRoutines = await Promise.all(allRoutineIds.map(elem => getRoutineById(elem.id)))
  const routinesWithActivities = await attachActivitiesToRoutines(allRoutines)

  const names = await Promise.all(allRoutines.map(elem => getUserById(elem.creatorId)))
  routinesWithActivities.forEach((elem, index) => {elem.creatorName = names[index].username})

  //routinesWithActivities.forEach(async (elem) => {elem.creatorName = await getUserById.username})

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