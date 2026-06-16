const blogRouter = require('express').Router()
const Blog = require('../models/bloglist')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  .populate('user', { username: 1, name: 1})
  response.status(200).json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const decoded = jwt.verify(request.token, process.env.SECRET)
  if (!decoded.id) {  
    return response.status(400).send({ error: 'invalid token' })
  }

  const user = await User.findById(request.user.id)

  const blog = new Blog({...request.body, user: user.id})
  
  if (!blog.likes) {
    blog.likes = 0
  }
  if ((blog.title === '' || blog.url === '')
    || (!blog.title || !blog.url)) {
    return response.status(400).send({ error: 'title or url must not be empty' })
  }
  const savedBlog = await blog.save()
  // after saving the blog, now store the blog id to the user who created it
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})


blogRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id

  const decoded = jwt.verify(request.token, process.env.SECRET)
  const user = request.user
  if (!decoded.id) {
    return response.status(400).send({ error: 'invalid token' })
  }
  console.log(decoded)
  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }
  const updatedBlog = {
    title: title,
    author: author,
    url: url,
    likes: likes
  }

  await blog.save()

  return response.status(200).json(updatedBlog)
})

module.exports = blogRouter