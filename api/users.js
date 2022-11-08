const express = require('express');
const { createUser } = require('../db');
const router = express.Router();

// POST /api/users/login

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    console.log("**** look here ****")
    const { username, password } = req.body;
    const createdUser = await createUser({ username, password });

    res.send({
        createdUser
    });
})
router.use(req, res, next) => {
    console.log("A request has been made to users...")

    next()
}
// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
