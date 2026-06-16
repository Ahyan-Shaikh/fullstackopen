const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({username})
  const passwordMatch = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!(user && passwordMatch)) {
    return response.status(400).send({ error: 'Invalid username or password' })
  }

  const tokenForUser = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(tokenForUser, process.env.SECRET)

  response.status(200)
  .send({ token, username: user.username, name: user.name})
})

module.exports = loginRouter