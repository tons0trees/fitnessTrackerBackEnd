const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const { createUser, getUser, getUserByUsername, getPublicRoutinesByUser, getAllRoutinesByUser } = require('../db');
const { requireUser } = require('./utils')

router.use((req, res, next) => {
    console.log("A request has been made to users...")
    next();
})

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await getUser({ username, password })

    if (user) {
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1w' })

        res.send({
            message: "you're logged in!",
            user,
            token
        })
    } else {
        next({
            error: "pick a number",
            name: 'InvalidUsernameOrPassword',
            message: 'The username or password provided was not valid'
        })
    }
})

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    if (password.length < 8) {
        next({
            error: 'some number',
            message: "Password Too Short!",
            name: "PasswordTooShort",
        })
    }

    try {
        const user = await getUserByUsername(username)

        if (user) {
            next({
                error: "any old number",
                name: 'UserTakenError',
                message: `User ${username} is already taken.`
            });
        } else {
            const createdUser = await createUser({ username, password });

            const token = jwt.sign(createdUser, process.env.JWT_SECRET, { expiresIn: '1w' })

            res.send({
                message: 'Thanks for joining FitnessTracker',
                token,
                user: createdUser
            });
        }
    } catch ({ name, message }) {
        next({
            name,
            message
        });
    }

})
// GET /api/users/me
router.get('/me', requireUser, async (req, res, next) => {
    res.send(req.user)
    //TODO do i need a try catch for error handling in this simple of a function?
})

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
    try {
        const username = req.params.username
        if (req.user && username === req.user.username) {
            const routines = await getAllRoutinesByUser({ username })
            res.send(routines)
        } else {
            const routines = await getPublicRoutinesByUser({ username })
            res.send(routines)
        }

    } catch ({ name, message }) {
        next({ name, message })
    }
})

module.exports = router;
