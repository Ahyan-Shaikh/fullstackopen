const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
console.log('Connecting MongoDB')
mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error', error.message)
  })

const validateNumber = (number) => {
  if (number.indexOf('-') === -1) {
    return false
  }
  const [firstHalf, secondHalf] = number.split('-')
  if ((firstHalf.length > 1 && firstHalf.length <= 3) && secondHalf.length > 3) {
    return true
  }
  return false
}
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: validateNumber,
      message: 'number format is incorrect, correct one is [code]-[number]'
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
