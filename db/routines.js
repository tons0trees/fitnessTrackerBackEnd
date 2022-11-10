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

async function getRoutineByName(name){
  const {rows: [namedRoutine]} = await client.query(`
  SELECT *
  FROM routines
  WHERE name='${name}';
  `)
  return namedRoutine
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
  const {rows} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON "creatorId"=users.id
  WHERE "creatorId" IN (SELECT id FROM users WHERE username='${username}')
  ;`)
  const routinesWActivities = await attachActivitiesToRoutines(rows)
  return routinesWActivities;
}

async function getPublicRoutinesByUser({username}) {
  const {rows} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON "creatorId"=users.id
  WHERE "creatorId" IN (SELECT id FROM users WHERE username='${username}') AND "isPublic"=TRUE
  ;`)
  const routinesWActivities = await attachActivitiesToRoutines(rows)
  return routinesWActivities;
}

async function getAllPublicRoutines() {
  const {rows} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON "creatorId"=users.id
  WHERE "isPublic"=TRUE
  ;`)
  const routinesWActivities = await attachActivitiesToRoutines(rows)
  return routinesWActivities;
}

async function getPublicRoutinesByActivity({id}) {
  const {rows} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON "creatorId"=users.id
  WHERE "isPublic"=TRUE AND routines.id IN (SELECT "routineId" FROM routine_activities WHERE "activityId"=${id})
  ;`)
  const routinesWActivities = await attachActivitiesToRoutines(rows)
  return routinesWActivities;
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
  const setStr = Object.keys(fields).map((elem, index) => `"${elem}"=$${index+1}`).join(', ')
  const {rows: [updatedRoutine]} = await client.query(`
    UPDATE routines
    SET ${setStr}
    WHERE id=${id}
    RETURNING *
  ;`, Object.values(fields))
  return updatedRoutine
}

async function destroyRoutine(id) {
  const {rows: deletedRoutineActivities} = await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId"=${id}
    RETURNING *
  ;`)

  const {rows: [deletedRoutine]} = await client.query(`
    DELETE FROM routines
    WHERE id=${id}
    RETURNING *
  ;`)
  return deletedRoutine
}

module.exports = {
  getRoutineById,
  getRoutineByName,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine
}