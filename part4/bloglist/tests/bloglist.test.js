const assert = require('node:assert')
const { describe, test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const Blog = require('../models/bloglist')
const supertest = require('supertest')
const helpertest = require('./helper.test')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helpertest.initialBlogs)
})

test('blogs in json format', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-type', /application\/json/)
  
  
  assert.strictEqual(blogs.body.length, helpertest.initialBlogs.length)
})

test('check whether the id is not _id', async () => {
  const blogs = await helpertest.blogsInDb()
  const keys = Object.keys(blogs[0])

  assert(keys.includes('id'))
})

test.only('adds a blog on the server', async () => {

  const newBlog = {
    title: 'a new test',
    author: 'newauthor',
    url: 'https://newurl.com',
    likes: 111
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5lZCIsImlkIjoiNmEyZWI1NjZiZmQyZjdhZWY4NzZjODE1IiwiaWF0IjoxNzgxNDQ3MDQ4fQ.OIZRIG5GSUGOQq0spZrxp1pyIawT1Sfu3DEminbjyhI')
    .expect(201)
    .expect('Content-type', /application\/json/)

    const blogsAtEnd = await helpertest.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helpertest.initialBlogs.length + 1)
})

test('like is  missing', async () => {
  const newTestBlog = {
    title: 'Dont fall into the anti-ai hype',
    author: 'antirez',
    url: 'https://antirez.com/news/158'
  }

  const savedBlog = await api
    .post('/api/blogs')
    .send(newTestBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert(!savedBlog.likes)
})

test('title or url should not be empty', async () => {
  const newTestBlog = {
    likes: 0,
    author: 'Ashyk'
  }
  await api
    .post('/api/blogs')
    .send(newTestBlog)
    .expect(400)

  const notestAtEnd = await helpertest.blogsInDb()
  
  assert.strictEqual(notestAtEnd.length, helpertest.initialBlogs.length)
})

describe('deletion of the blog', () => {
  test('delete a single test', async () => {
    const blogsAtStart = await helpertest.blogsInDb()
    const firstBlog = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5lZCIsImlkIjoiNmEyZWI1NjZiZmQyZjdhZWY4NzZjODE1IiwiaWF0IjoxNzgxNDQ3MDQ4fQ.OIZRIG5GSUGOQq0spZrxp1pyIawT1Sfu3DEminbjyhI')
      .expect(204)
    const blogsAtEnd = await helpertest.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helpertest.initialBlogs.length - 1)
  })
})

test('updating the likes of the blog', async () => {
  const blogsAtStart = await helpertest.blogsInDb()
  const secBlog = blogsAtStart[1]
  console.log(secBlog)
  const updateLikesOfSecBlog = {
    title: 'The end of Redis adventure',
    author: 'antirez',
    url: 'https://antirez.com/news/133',
    likes: 12345,
  }

  const updatedBlog = await api
    .put(`/api/blogs/${secBlog.id}`)
    .send(updateLikesOfSecBlog)
    .expect(200)
  assert.deepStrictEqual(updatedBlog.body, updateLikesOfSecBlog)
})
after(async () => {
  await mongoose.connection.close()
})