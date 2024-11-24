import { Router } from 'express'
import { requireJSON } from '../utils.js'
import { validateMovie, validateUpdateMovie } from '../schemas/movieSchema.js'
import crypto from 'node:crypto'

const movies = requireJSON('./movies.json')

export const moviesRouter = Router()

moviesRouter.get('/', (req, res) => {
  const { genre } = req.query

  if (genre) {
    const genreMovies = movies.filter((movie) => movie.genre.some((movieGenre) => movieGenre.toLowerCase() === genre.toLowerCase()))

    return res.status(200).json(genreMovies)
  }

  res.status(200).json(movies)
})

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params

  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex < 0) {
    return res.status(404).send('Movie not found')
  }

  res.status(200).send(movies[movieIndex])
})

moviesRouter.post('/', (req, res) => {
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

moviesRouter.patch('/:id', (req, res) => {
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

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex < 0) {
    return res.status(404).send('Movie not found')
  }

  movies.splice(movieIndex, 1)

  res.status(200).json({ message: 'Movie deleted' })
})
