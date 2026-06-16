const { describe, test, after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')
const api = supertest(app)
describe('tests the login functionality', () => {

  test('sucessful logins generates a token', async () => {
    
    const loginUser = {
      username: 'Ned',
      password: 'lordstark'
    }

    const result = await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
    console.log(result.body.token)
    assert(jwt.verify(result.body.token, process.env.SECRET))

  })
})

after(async () => {
  await mongoose.connection.close()
})
