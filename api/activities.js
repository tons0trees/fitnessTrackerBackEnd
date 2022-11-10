const express = require('express');
const router = express.Router();
const { getAllActivities, createActivity, getActivityByName, getActivityById, updateActivity } = require('../db');
const {requireUser} = require('./utils')

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get('/', async (req, res, next) => {
    const activities = await getAllActivities()
    res.send(activities);
})


// POST /api/activities
router.post('/', requireUser, async (req, res, next) => {
    try {
        const {name, description} = req.body
        const existingActivity = await getActivityByName(name)

        if (existingActivity) {
            next({
                error: 'some number',
                name: 'DuplicateActivity',
                message: `An activity with name ${name} already exists`
            })
        } else {
            const createdActivity = await createActivity({name, description})
            res.send(createdActivity)
        }
        
    } catch ({error, name, message}) {
        next({error, name, message})
    }
})

// PATCH /api/activities/:activityId
router.patch('/:activityId', requireUser, async (req, res, next) => {
    try {
        const id = req.params.activityId
        
        let existingActivity = await getActivityById(id)
        if (!existingActivity) {
            next({
                error: 'some number',
                name: 'ActivityNotFound',
                message: `Activity ${id} not found`
            })
        } else {
            const {name, description} = req.body

            existingActivity = await getActivityByName(name)

            if (existingActivity) {
                next({
                    error: 'some number',
                    name: 'DuplicateActivity',
                    message: `An activity with name ${name} already exists`
                })
            } else {
                const updatedActivity = await updateActivity({id, name, description})
        
                res.send(updatedActivity)
            }
        }      
    } catch ({error, name, message}) {
        next({error, name, message})
    }
})

module.exports = router;
