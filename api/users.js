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
    
    const { username, password } = req.body;
    const user = getUserByUsername()
    const createdUser = await createUser({ username, password });
    console.log('**** looky here ****', createdUser)

    const token = jwt.sign(createdUser, process.env.JWT_SECRET, {expiresIn: '1w'})

    res.send({
        createdUser,
        token
    });
})
// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
