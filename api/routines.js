const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, getRoutineByName, getRoutineById, updateRoutine, destroyRoutine, addActivityToRoutine, getRoutineActivitiesByRoutine } = require('../db');
const { requireUser } = require('./utils')

// GET /api/routines
router.get('/', async (req, res, next) => {
    const routines = await getAllPublicRoutines()
    res.send(routines);
})

// POST /api/routines
router.post('/', requireUser, async (req, res, next) => {
    const creatorId = req.user.id
    const { isPublic, name, goal } = req.body //check that these exist?
    try {
        const existingRoutine = await getRoutineByName(name)
        if (existingRoutine) {
            next({
                error: 'whoopsy',
                name: 'RoutineExists',
                message: 'This routine already exists'
            })
        } else {
            const createdRoutine = await createRoutine({ creatorId, isPublic, name, goal })
            res.send(createdRoutine)
        }

    } catch ({ error, name, message }) {
        next({ error, name, message })
    }
})

// PATCH /api/routines/:routineId
router.patch('/:routineId', requireUser, async (req, res, next) => {
    try {
        const routineId = req.params.routineId
        const existingRoutine = await getRoutineById(routineId)
        if (existingRoutine) {
            if (existingRoutine.creatorId === req.user.id) {
                const fields = req.body
                console.log(fields);
                const updatedRoutine = await updateRoutine({ id: routineId, ...fields })
                res.send(updatedRoutine)
            } else {
                res.status(403)
                next({
                    error: 'some number',
                    name: 'UnauthorizedUser',
                    message: `User ${req.user.username} is not allowed to update ${existingRoutine.name}`
                })
            }
        } else {
            next({
                error: 'some number',
                name: 'RoutineNotFound',
                message: `Routine ${routineId} not found`
            })
        }

    } catch ({ error, name, message }) {
        next({ error, name, message })
    }
})

// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next) => {
    try {
        const routineId = req.params.routineId
        const existingRoutine = await getRoutineById(routineId)
        if (existingRoutine) {
            if (existingRoutine.creatorId === req.user.id) {
                const deletedRoutine = await destroyRoutine(routineId)
                res.send(deletedRoutine)
            } else {
                res.status(403)
                next({
                    error: 'some number',
                    name: 'UnauthorizedUser',
                    message: `User ${req.user.username} is not allowed to delete ${existingRoutine.name}`
                })
            }
        } else {
            next({
                error: 'some number',
                name: 'RoutineNotFound',
                message: `Routine ${routineId} not found`
            })
        }

    } catch ({ error, name, message }) {
        next({ error, name, message })
    }
})

// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', requireUser, async (req, res, next) => {
    try {
        const routineId = req.params.routineId
        const existingRoutine = await getRoutineById(routineId)
        if (existingRoutine) {
            if (existingRoutine.creatorId === req.user.id) {
                const {activityId, count, duration} = req.body
                const listOfActivities = (await getRoutineActivitiesByRoutine({id: routineId})).map(elem => elem.activityId)               
                if (!listOfActivities.includes(activityId)) {
                    const addedActivity = await addActivityToRoutine({routineId, activityId, count, duration})
                    res.send(addedActivity)
                } else {
                    next({
                        error: 'some number',
                        name: 'DuplicateActivity',
                        message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`
                    })
                }
            } else {
                res.status(403)
                next({
                    error: 'some number',
                    name: 'UnauthorizedUser',
                    message: `User ${req.user.username} is not allowed to attach new activities to ${existingRoutine.name}`
                })
            }
        } else {
            next({
                error: 'some number',
                name: 'RoutineNotFound',
                message: `Routine ${routineId} not found`
            })
        }

    } catch ({ error, name, message }) {
        next({ error, name, message })
    }
})

module.exports = router;
