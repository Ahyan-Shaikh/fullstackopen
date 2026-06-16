const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const { usersInDb, initialUsers } = require('./helper.test')
const app = require('../app')
const api = supertest(app)

describe('adding a user', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const user = new User({
      username: 'gollum',
      password: await bcrypt.hash('myprecious', 10)
    })

    await user.save()
  })

  test.only('adds a user to the server', async () => {

    const newUser = {
      username: 'Ned',
      name: 'Eddard',
      password: 'lordstark'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await usersInDb()
    const usernames = usersAtEnd.map(u => u.username)
    assert.strictEqual(usersAtEnd.length, initialUsers.length + 1)

    assert(usernames.includes(newUser.username))
  })

  test('users with duplicate username must not be added', async () => {

    const newUser = {
      username: 'gollum',
      name: 'geofrey',
      password: 'goodfornothing'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, initialUsers.length)
  })

  test('users with invalid username or password must not be saved', async () => {
    const newUser = {
      username: '',
      name: 'brian',
      password: 'painintheneck'
    }

    await api.
      post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, initialUsers.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})