const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('please provide a pasword as argument!')
    process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]  
const personNumber = process.argv[4]

const url = `mongodb+srv://ahyan:${password}@cluster0.ydlpbst.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: personName,
    number: personNumber
})


if (process.argv.length === 3) {
    Person
        .find({})
        .then(result => {
            console.log('phonebook:')
            result.forEach( person => {
                console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    person
        .save()
        .then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}

