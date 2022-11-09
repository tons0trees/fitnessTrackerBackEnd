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

app.get('*', (req, res) => {
    res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
  });
  
app.use((error, req, res, next) => {
    if (res.statusCode < 400) res.status(500)
    res.send({
        error: error.error,
        name: error.name,
        message: error.message
    })
})

module.exports = app;
