import express, { json } from 'express'
import cors from 'cors'
import { moviesRouter } from './routes/movies.js'

const app = express()
app.use(json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234'
    ]

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 1234

app.use('/movies', moviesRouter)

app.use((req, res, error) => {
  res.status(404).send('Not found')
})

app.listen(PORT, () => {
  console.log(`Server listening at port: http://localhost:${PORT}`)
})
