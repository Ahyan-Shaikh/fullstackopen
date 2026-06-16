const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { author: 1, title: 1, url: 1})
  response.status(200).json(users)
})
userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const usernameFound = await User.findOne({ username: username })
  if (usernameFound) {
    return response.status(400).send({
      error: 'username must be unique'
    })
  }
  if (!username || !name || !password) {
    return response.status(400).send({ 
      error: 'username or name or password must not be empty'
    })
  }
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username: username,
    name: name,
    password: hashedPassword,
  })

  const savedUser = await newUser.save()
  response.status(201).json(savedUser)
})

module.exports = userRouter