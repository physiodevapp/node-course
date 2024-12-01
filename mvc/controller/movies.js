// import { MovieModel } from '../model/local-file-system/movie.js'
// import { MovieModel } from '../model/mongodb/movie.js'
// import { MovieModel } from '../model/mysql/movie.js'
import { validateMovie, validateUpdateMovie } from '../schemas/movieSchema.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query

    const movies = await this.movieModel.getAll({ genre })

    res.status(200).json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params

    const movie = await this.movieModel.getById({ id })

    if (!movie) {
      return res.status(404).send('Movie not found')
    }

    res.status(200).send(movie)
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error) })
    }

    const newMovie = await this.movieModel.create({ input: result.data })

    res.status(201).json(newMovie)
  }

  update = async (req, res) => {
    const result = validateUpdateMovie(req.body)

    if (result.error) {
      return res.status(404).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updateResult = await this.movieModel.update({ id, input: result.data })

    if (!updateResult.success) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    res.status(200).json(updateResult.data)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.movieModel.delete({ id })

    if (result) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.status(200).json({ message: 'Movie deleted' })
  }
}
