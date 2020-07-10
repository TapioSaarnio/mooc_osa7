  
import React, { useState, useEffect } from 'react'
import axios from 'axios'


const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  
  const get = async () => {
    
    
    axios.get(baseUrl).then(res => {

      const recoursesData  = res.data
      setResources(recoursesData)
    })


  }
  

  /*
  useEffect(() => {

    axios.get(res => {
      setResources(res.data)
    })


  }, [])
  */

  
  
  const create = (resource) => {
    
    axios.post(baseUrl, resource).then( res => {
      console.log(resources.concat(resource))
      setResources(resources.concat(resource))
      window.location.reload()

    }

    )
  }

  const service = {
    create, get
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  
  useEffect(() => {

    personService.get()
    noteService.get()
    
    
  }, [])
  

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
    
  }
  console.log(notes)
  console.log(persons)

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App