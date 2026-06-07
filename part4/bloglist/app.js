const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/bloglists')

const app = express()

logger.info('Connecting to', config.mongoUrl)
mongoose
  .connect(config.mongoUrl, { family: 4 })
  .then(() => {
    logger.info('Connected to MongoDb')
  })
  .catch(error => {
    logger.error('error connection to MongoDb: ', error.message)
  })


app.use(express.json())
app.use(middleware.morganLogger())
app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoints)
app.use(middleware.errorHandler)
module.exports = app