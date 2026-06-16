const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (doc, newObject) => {
    newObject.id = newObject._id.toString()
    delete newObject._id
    delete newObject.__v
  }
})
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog