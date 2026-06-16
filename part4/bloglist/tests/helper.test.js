const Blog = require('../models/bloglist')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'How I built my blog',
    author: 'Josh Cameau',
    url: 'https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/',
    likes: 160771,
  },
  {
    title: 'The end of Redis adventure',
    author: 'antirez',
    url: 'https://antirez.com/news/133',
    likes: 999,
  }
]

const initialUsers = [
  {
    username: 'gollum',
    name: 'Smeagal',
    password: 'myprecious'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}
module.exports = {
  initialUsers,
  initialBlogs,
  blogsInDb,
  usersInDb
}