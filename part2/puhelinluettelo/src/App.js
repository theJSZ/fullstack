import { useState, useEffect } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'
// import './style.css'

const DeleteButton = ({id, persons, setPersons, personName, setNotification}) => {
  const deleteName = (id) => {
    if (window.confirm(`Delete ${personName}?`)) {
      {setPersons(persons.filter(p => p.id != id))}
      (phonebookService.deletePerson(id))
      setNotification(`Deleted ${personName}`)
      setTimeout(() => setNotification(null), 3000)
    }
  }


  return (
    <button onClick={() => deleteName(id)}>delete</button>
  )
}

const Notification = ({message, color}) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: `${color}`,
    border: `2px solid ${color}`,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div className='notification' style={notificationStyle}>
      {message}
    </div>
  )
}

const Person = ({person, persons, setPersons, setNotification}) => (
  <li>
    {person.name} {person.number} <DeleteButton id={person.id} persons={persons} setPersons={setPersons} personName={person.name} setNotification={setNotification}/>
  </li>
)

const Persons = ({namesToShow, persons, setPersons, setNotification}) => {
  return (
    <ul>
        {namesToShow.map(
          person =>
            <Person
              key={person.name}
              person={person}
              persons={persons}
              setPersons={setPersons}
              setNotification={setNotification}
            />)
        }
    </ul>
  )
}

const NameFilter = ({nameFilter, handleFilterChange}) => (
  <div>
    filter shown with
    <input
      value={nameFilter}
      onChange={handleFilterChange} />
  </div>
)

const AddPerson = ({addName, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return (
    <form onSubmit={addName}>

      <div>
        <h2>add a new</h2>
        name:
        <input
          value={newName}
          onChange={handleNameChange} />
      </div>

      <div>
        number:
        <input
          value={newNumber}
          onChange={handleNumberChange} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>

    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationColor, setNotificationColor] = useState('green')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])

  const addName = (event) => {
    event.preventDefault()

    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)) {
        const idToFind = persons.find(p => p.name === newName)
        updateNumber(
          idToFind,
          newNumber
        )
      }
    }

    else {
      const newPersonObject = {
        name: newName,
        number: newNumber
      }
      phonebookService
        .addPerson(newPersonObject)
        .then(returnedPerson => setPersons(persons.concat(returnedPerson)))
        .then(setNotificationColor('green'))
        .then(setNotification(`Added ${newPersonObject.name}`))
        .then(setTimeout(() => {setNotification(null)}, 3000))

    }
  }

  const updateNumber = ({id}) => {
    const url = `http://localhost:3001/persons/${id}`
    const person = persons.find(p => p.id === id)
    const changedPerson = { ...person, number: newNumber}

    phonebookService.updateNumber(changedPerson)
      .then(returnedPerson =>
        setPersons(
          persons.map(p => p.id !== id ? p : returnedPerson)
        )
      )
      .then(setNotificationColor('green'))
      .then(setNotification(`Updated ${changedPerson.name}`))
      .then(setTimeout(() => {setNotification(null)}, 3000))
      .catch(error => {
        setNotificationColor('red')
        setNotification(`Information of ${changedPerson.name} has already been removed from the server`)
        setPersons(persons.filter(p => p.id !== changedPerson.id))
      })
  }

  const namesToShow = nameFilter.length > 0
    ? persons.filter(person => person.name.toLowerCase().search(nameFilter.toLowerCase()) != -1)
    : persons

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} color={notificationColor}/>

      <NameFilter nameFilter={nameFilter} handleFilterChange={handleFilterChange}/>

      <AddPerson
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>

      <Persons namesToShow={namesToShow} persons={persons} setPersons={setPersons} setNotification={setNotification}/>

    </div>
  )

}

export default App