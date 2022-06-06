import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return (
        axios
            .get(baseUrl)
            .then(response => response.data)
    )
}

const addPerson = newPerson => {
    // const request = axios.post(baseUrl, newPerson)
    return (
        axios.
            post(baseUrl, newPerson)
            .then(response => response.data)
    )
}

const deletePerson = id => {
    axios.delete(`${baseUrl}/${id}`)
}

const updateNumber = changedPerson => {
    return (
        axios
        .put(`${baseUrl}/${changedPerson.id}`, changedPerson)
        .then(response => response.data)
    )

}


export default {
    getAll,
    addPerson,
    deletePerson,
    updateNumber
}