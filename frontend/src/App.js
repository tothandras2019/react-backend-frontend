import logo from './logo.svg'
import './App.css'
import { useState, useEffect } from 'react'
import { Loader } from './components/loader/loader-component'
import { Message } from './components/message/message-component'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [tobesend, setTobesend] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [isDeletedMsg, setIsDeletedMsg] = useState(null)

  //effects
  const getTodos = async () => {
    const url = 'http://127.0.0.1:9000/todos'
    // const url = '/todo s'
    await fetch(url)
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos)
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    getTodos(todos)
    return () => {}
  }, [])

  useEffect(() => {
    if (!tobesend) return
    const url = 'http://127.0.0.1:9000/add'
    // const url = '/add'

    setDisabled(true)
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },

      body: JSON.stringify(tobesend),
    }).then((response) => {
      if (!response.ok) return
      setTobesend(null)
      getTodos()
      setDisabled(false)
    })
  }, [tobesend])

  //handlers
  const submitButton = (event) => {
    const addTodo = {
      id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
      description: input,
    }
    setTobesend(addTodo)
  }

  const handleDeleteItem = (event) => {
    const { id } = event.target
    console.log(id)
    deleteItem(id)
  }
  const deleteItem = async (id) => {
    const url = `http://127.0.0.1:9000/delete/${id}`
    await fetch(url, { method: 'DELETE' })
      .then((response) => response.json())
      .then((res) => {
        setIsDeletedMsg(res.message)
        setTimeout(() => {
          setIsDeletedMsg(null)
        }, 1500)
      })
    getTodos()
  }

  return (
    <div className='App'>
      {isLoading ? (
        <Loader />
      ) : (
        <header className='App-header'>
          <div>
            {isDeletedMsg && <Message message={isDeletedMsg} />}
            {todos.map(({ id, description }) => (
              <p key={id} id={id} onClick={handleDeleteItem}>
                {id}:{description}
              </p>
            ))}
            <input type='text' name='search' placeholder='search todo' onChange={(event) => setInput(() => event.target.value)} />
            <input disabled={disabled} type='button' name='new' value='press send' onClick={submitButton} />
          </div>
        </header>
      )}
    </div>
  )
}

export default App
