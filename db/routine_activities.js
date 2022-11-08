const client = require('./client')

async function getRoutineActivityById(id){
  const {rows: [routineActivity]} = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id=${id};
  `)
  return routineActivity
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const {rows: [routineActivity]} = await client.query(`
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
  `,[routineId, activityId, count, duration])
  
  return routineActivity
}

async function getRoutineActivitiesByRoutine({id}) {
  const {rows: routineActivities} = await client.query(`
  SELECT *
  FROM routine_activities
  WHERE "routineId"=${id};
`)
return routineActivities
}

async function updateRoutineActivity ({id, ...fields}) {
  const setStr = Object.keys(fields).map((elem, index) => `"${elem}"=$${index + 1}`).join(', ')

  const {rows: [updatedRoutineActivity]} = await client.query(`
  UPDATE routine_activities
  SET ${setStr}
  WHERE id=${id}
  RETURNING *;
  `, Object.values(fields))

  return updatedRoutineActivity;
}

async function destroyRoutineActivity(id) {
  const {rows: [deletedRoutineActivity]} = await client.query(`
  DELETE FROM routine_activities
  WHERE id=${id}
  RETURNING *
  ;`)
  return deletedRoutineActivity
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const {rows: [checkedRoutineActivity]} = await client.query(`
    SELECT "creatorId"
    FROM routines
    WHERE id IN (SELECT "routineId" FROM routine_activities WHERE id=${routineActivityId})
  ;`)

  return checkedRoutineActivity.creatorId === userId
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
