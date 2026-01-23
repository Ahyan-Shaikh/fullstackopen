import { use, useEffect, useState} from "react"
import phoneBookServices from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('Mark Fowler')
  const [newNumber, setNewNumber] = useState('1-023456789')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    phoneBookServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })

  },[])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleAddPerson= (event) => {
    event.preventDefault()    
    
    let personExists = persons.find(person => person.name === newName)
    
    if (personExists === undefined) {

      const newPersonObject = {
        name: newName,
        number: newNumber
      }

      phoneBookServices
        .create(newPersonObject)
        .then(returnedPersons => {
          setPersons(persons.concat(returnedPersons))
          setSuccessMessage(
            `Added ${returnedPersons.name}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
      
    } else {

      const confirmChange = window.confirm(`${newName} is already added to phonebook, replce the old number with a new one?`)
      if (confirmChange) {

          const updatedPerson = {...personExists, number: newNumber}
          phoneBookServices
            .update(personExists.id, updatedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id == personExists.id ? returnedPerson: person))

              setSuccessMessage(
                `${returnedPerson.name}'s number updated`
              )
              setTimeout(()=> {
                setSuccessMessage(null)
              }, 5000)
            })
            .catch(error => {
                setErrorMessage(
                  `Information of ${updatedPerson.name} has already been removed from server`
                )   
                setTimeout(() => {
                  setErrorMessage(null)
                }, 5000)           
            }) 
      }
    }
    
    setNewName('')
    setNewNumber('')
  }

  const searchName = (name, pattern) => {
    const nLen= name.length // length of the name
    const pLen = pattern.length // length of the pattern
    let i, j

    for (i = 0, j = 0; i < nLen; i++) {
        while (j < pLen) {
          if (name[i+j] === pattern[j]) {
            j++
          } else {
            j = 0
            break
          }
        }
    }
    return j == pLen ? 1: 0
  }

  const deleteEntryOf = (id) => {

    const personToBeDeleted = persons.find(person => person.id === id)
    const confirmDelete = window.confirm(`Delete ${personToBeDeleted.name} ?`)
    
    if (confirmDelete) {
      phoneBookServices
        .deletePerson(id)
        .then(deletedPerson => {

          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        })
    }
  }
  const personsList = filter.length > 0
                        ? persons.filter(person => {
                            return searchName(person.name.toLowerCase(), filter.toLowerCase())
                        })
                        : persons

  if (persons === null) {
    return null
  }
  
  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={successMessage} type='success'/>
      <Notification message={errorMessage} type='error'/>
      <Filter handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm
        name={[newName, handleNameChange]}
        number={[newNumber, handleNumberChange]}
        handleAddPerson={handleAddPerson}
      />
      <h2>Numbers</h2>
      <Persons handleDeleteEntry={deleteEntryOf} persons={personsList}/>
    </div>
  )
}
const PersonForm = (props) => {
  const [newName, handleNameChange] = props.name
  const [newNumber, handleNumberChange] = props.number
  return (
    <form onSubmit={props.handleAddPerson}>
        
        <div>
          name: <input
                  value={newName}
                  onChange={handleNameChange}
                  />
        </div>
        <div>
          number: <input
                    type="tel"
                    value={newNumber}
                    onChange={handleNumberChange}
                  />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}
const Persons = ({persons, handleDeleteEntry}) => {

  return (
    <>
    {persons.map(person => <Person handleDeleteEntry={handleDeleteEntry} key={person.id} person={person}/>)}
    </>
  )
    
  
}
const Person = ({person, handleDeleteEntry}) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={()=> {
        handleDeleteEntry(person.id)
      }}>delete</button>
    </div>
  )
}
const Filter = (props) => {
  return <div> filter shown with <input onChange={props.handleFilterChange}/></div>
}


export default App