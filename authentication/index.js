import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './database/user-repository.js'

const app = express()
app.use(express.json())

app.post('/login', (req, res) => {
  res.send('logged in successfully')
})

app.post('/signup', (req, res) => {
  const { username, password } = req.body
  try {
    const id = UserRepository.create({ username, password })

    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post('/logout', (req, res) => {
  res.redirect('/')
})

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html')
})

app.get('/protected', (req, res) => {
  res.send('This content is protected')
})

app.listen(PORT, () => {
  console.log(`Server listening at: http://localhost:${PORT}`)
})
