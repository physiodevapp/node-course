import express, { json } from 'express'
import { createMoviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())

  app.disable('x-powered-by')

  const PORT = process.env.PORT ?? 1234

  app.use('/movies', createMoviesRouter({ movieModel }))

  app.use((req, res, error) => {
    res.status(404).send('Not found')
  })

  app.listen(PORT, () => {
    console.log(`Server listening at port: http://localhost:${PORT}`)
  })
}
