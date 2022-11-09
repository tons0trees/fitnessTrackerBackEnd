const express = require('express');
const { createUser, getUserByUsername } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken')

router.use((req, res, next) => {
    console.log("A request has been made to users...")

    next();
})
// POST /api/users/login

// POST /api/users/register
router.post('/register', async (req, res, next) => {

    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username)

        if (user) {
            next({
                name: 'UserExists',
                message: 'This user is taken'
            });
        }
        const createdUser = await createUser({ username, password });
        console.log('**** looky here ****', createdUser) // Still see this log when trying to register a duplicate user

        const token = jwt.sign(createdUser, process.env.JWT_SECRET, { expiresIn: '1w' })

        res.send({
            createdUser,
            token
        });
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
