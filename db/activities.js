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
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
  const routineIds = routines.map(routine => routine.id);
  if (!routineIds?.length) return [];
  
  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${ binds });
    `, routineIds);

    // loop over the routines
    for(const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    throw error;
  }
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
  attachActivitiesToRoutines,
}
