const express = require('express')
const app = express()
const path = require('path')
const port = 9000
const cors = require('cors')
const fs = require('fs')

app.use(express.json())

const whitelist = ['http://localhost:3000', 'https://127.0.0.1:3000']

const options = {
  origin: whitelist,
}
app.use(cors(options))

app.get('/todos', (req, res) => {
  res.sendFile(path.join(__dirname, '/DATA/todos.json'))
})

app.post('/add', (req, res) => {
  const todo = req.body

  fs.readFile(path.join(__dirname, '/DATA/todos.json'), (err, data) => {
    if (err) res.status(400).send({ message: 'there is an error' })

    const todos = JSON.parse(data)
    todos.push(todo)

    fs.writeFile(path.join(__dirname, '/DATA/todos.json'), JSON.stringify(todos), (err) => {
      if (err) res.status(400).send({ message: 'there is an error at write file' })

      res.status(200).send({ message: 'ok' })
    })
  })
})

app.delete('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id)

  fs.readFile(path.join(__dirname, '/DATA/todos.json'), (err, data) => {
    if (err) res.status(400).send({ message: 'there is an error' })

    const todos = JSON.parse(data)
    const todosList = todos.filter((todo) => todo.id !== id)

    fs.writeFile(path.join(__dirname, '/DATA/todos.json'), JSON.stringify(todosList), (err) => {
      if (err) return res.status(500).send({ success: false, message: err })

      res.status(200).send({ sucess: true, message: `${id} deleted` })
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on http://127.0.0.1:${port}`)
})
