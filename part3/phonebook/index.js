require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Person = require('./models/Person')

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.static('dist'))

app.use(morgan((tokens,request, response) => {
    morgan.token('body', function(req, res) { return JSON.stringify(req.body) })
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        tokens.body(request, response)
    ].join(' ')
}))

app.get('/info', (request, response) => {
    const date = new Date();
    Person
        .countDocuments({})
        .then(result => {
            response.send(`
                <p>Phonebook has info for ${result} people<p>
                <p>${date.toString()}</p>    
            `)    
        })
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons=> {
            response.json(persons)
        })
})


app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(returnedPerson => {
            if (!returnedPerson) {
                return response.status(404).send({error: 'Person not found'})
            }
            response.json(returnedPerson)
        })
        .catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
    
    Person
        .findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            response.status(200).json(deletedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
    const body = request.body;

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(returnedPerson => {
            response.json(returnedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person
        .findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }
            person.name = name
            person.number = number
            
            return person
                .save()
                .then(updatedPerson => {
                    response.json(updatedPerson)
                })
        })
        .catch(error => next(error))

})

const unkownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unkown endpoint' })
}
app.use(unkownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if(error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }
    next(error)
}
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})