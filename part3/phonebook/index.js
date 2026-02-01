const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())


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

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
     {
        "id": "3",
        "name": "Dan Ambrov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-22-6423122"
    },
];

const generateId = () => {
    const id = Math.floor(Math.random() * 1000000);
    return id;
}

app.get('/info', (request, response) => {
    
    const totalEnteries = persons.length;
    const currentTime = Date();
    response.send(`
        <p>Phonebook has info for ${totalEnteries} people<p>
        <p>${currentTime}</p>    
    `);
})

app.get('/api/persons', (request, response) => {
    response.status(200).json(persons);
})


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;

    const person = persons.find(person => person.id === id);
    if (!person) {
        response.status(404).end();
        return;
    }
    response.json(person);
})
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;

    persons = persons.filter(person => person.id !== id)
    response.status(204).end();
})

app.post('/api/persons/', (request, response) => {
    const { name, number } = request.body;
    if (!name || !number) {
        response.status(400).send({
            error: "name or number cannot be empty!"
        });
        return;
    }

    const personExists = persons.find(person => person.name === name);
    if (personExists) {
        response.status(400).send({
            error: "name must be unique"
        });
        return;
    }

    const person = {
        id: String(generateId()),
        name: name,
        number: number
    }

    persons = persons.concat(person);
    response.status(200).json(person);
})

const unkownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unkown endpoint' })
}
app.use(unkownEndpoint)
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})