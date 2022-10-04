import logo from './logo.svg'
import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [tobesend, setTobesend] = useState(null)

  useEffect(() => {
    const url = 'http://127.0.0.1:9000/todos'
    // const url = '/todos'
    fetch(url)
      .then((res) => res.json())
      .then((todos) => setTodos(todos))
    return () => {}
  }, [])

  const submitButton = (event) => {
    const addTodo = {
      id: todos[todos.length - 1].id + 1,
      description: input,
    }
    setTobesend(addTodo)
  }

  const handleDeleteItem = (event) => {
    const { id } = event.target
    console.log(id)
    deleteItem(id)
  }
  const deleteItem = (id) => {
    const url = `http://127.0.0.1:9000/delete/${id}`
    fetch(url, { method: 'DELETE' })
      .then((response) => response.json())
      .then((res) => console.log(res))
  }

  useEffect(() => {
    if (!tobesend) return
    console.log('add')

    const url = 'http://127.0.0.1:9000/add'
    // const url = '/add'
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(tobesend),
    }).then((response) => console.log(response))
  }, [tobesend])

  return (
    <div className='App'>
      <header className='App-header'>
        <div>
          {todos.map(({ id, description }) => (
            <p key={id} id={id} onClick={handleDeleteItem}>
              {id}:{description}
            </p>
          ))}
          <input type='text' name='search' placeholder='search todo' onChange={(event) => setInput(() => event.target.value)} />
          <input type='button' name='new' value='press send' onClick={submitButton} />
        </div>
      </header>
    </div>
  )
}

export default App
