const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    unique: true
  },
  name: String,
  password: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

const User = mongoose.model('User', userSchema)

userSchema.set('toJSON', {
  transform: (document, userObject) => {
    userObject.id = userObject._id
    delete userObject._id
    delete userObject.__v
    
    delete userObject.password
  }
})

module.exports = User