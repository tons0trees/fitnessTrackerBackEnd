require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.json());

const cors = require('cors')
app.use(cors())



const apiRouter = require('./api')
app.use('/api', apiRouter)

module.exports = app;
