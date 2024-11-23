const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validateUpdateMovie } = require('./schemas/movieSchema')
const cors = require('cors')

const app = express()
app.use(express.json())
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

app.get('/movies', (req, res) => {
  const { genre } = req.query

  if (genre) {
    const genreMovies = movies.filter((movie) => movie.genre.some((movieGenre) => movieGenre.toLowerCase() === genre.toLowerCase()))

    return res.status(200).json(genreMovies)
  }

  res.status(200).json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex < 0) {
    return res.status(404).send('Movie not found')
  }

  res.status(200).send(movies[movieIndex])
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex < 0) {
    return res.status(404).send('Movie not found')
  }

  const result = validateUpdateMovie(req.body)

  if (result.error) {
    return res.status(404).json({ error: JSON.parse(result.error.message) })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  res.status(200).json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex < 0) {
    return res.status(404).send('Movie not found')
  }

  movies.splice(movieIndex, 1)

  res.status(200).json({ message: 'Movie deleted' })
})

app.use((req, res, error) => {
  res.status(404).send('Not found')
})

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`)
})
