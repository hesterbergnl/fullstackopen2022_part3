require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
    
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({error: 'malformed id'})
  })
})

app.get('/info', (request, response) => {
  // console.log(persons.length)
  response.send(`<p> Phonebook has info for ${persons.length} people </p> <p> ${new Date()} </p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const randInt = (max) => {
  return Math.floor(Math.random() * max)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and/or number missing'
    })
  }

  // const person = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())

  // if(person) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const newPerson = new Person( {
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(savedNote => {
    response.json(savedNote)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
