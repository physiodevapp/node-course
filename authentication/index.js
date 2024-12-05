import express from 'express'
import { PORT, JWT_SECRET_KEY } from './config.js'
import { UserRepository } from './database/user-repository.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })

    const token = jwt.sign(user, JWT_SECRET_KEY, { expiresIn: '1h' })

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      .json(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post('/signup', async (req, res) => {
  const { username, password } = req.body
  try {
    const id = await UserRepository.create({ username, password })

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
  const token = req.cookies.access_token

  if (!token) return res.status(401).redirect('/')

  try {
    const user = jwt.verify(token, JWT_SECRET_KEY)

    res.status(200).send(user)
  } catch (error) {
    res.send('This content is protected')
  }
})

app.listen(PORT, () => {
  console.log(`Server listening at: http://localhost:${PORT}`)
})
