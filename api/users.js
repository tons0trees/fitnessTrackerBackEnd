const express = require('express');
const { createUser, getUser, getUserByUsername } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken')

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
            user,
            token
        })
    } else {
        next({
            name: 'InvalidUsernameOrPassword',
            message: 'The username or password provided was not valid'
        })
    }
})

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username)

        if (user) {
            next({
                name: 'UserExists',
                message: 'This user is taken'
            });
        } else {
            const createdUser = await createUser({ username, password });
    
            const token = jwt.sign(createdUser, process.env.JWT_SECRET, { expiresIn: '1w' })
    
            res.send({
                createdUser,
                token
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

// GET /api/users/:username/routines

module.exports = router;
