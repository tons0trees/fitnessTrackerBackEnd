const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, getRoutineByName } = require('../db');
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
    console.log("***** object we pass to the DB function *****", {creatorId, isPublic, name, goal})
    try {
        const existingRoutine = await getRoutineByName(name)
        if (existingRoutine) {
            next({
                error: 'whoopsy',
                name: 'RoutineExists',
                message: 'This routine already exists'
            })
        } else {
            console.log("***** look here *****", {creatorId, isPublic, name, goal})
            const createdRoutine = await createRoutine({ creatorId, isPublic, name, goal })
            res.send(createdRoutine)
        }

    } catch ({error, name, message}) {
        next({error, name, message})
    }




})
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
