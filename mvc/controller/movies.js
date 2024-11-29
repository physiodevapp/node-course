// import { MovieModel } from '../model/local-file-system/movie.js'
// import { MovieModel } from '../model/mongodb/movie.js'
import { MovieModel } from '../model/mysql/movie.js'
import { validateMovie, validateUpdateMovie } from '../schemas/movieSchema.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query

    const movies = await MovieModel.getAll({ genre })

    res.status(200).json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params

    const movie = await MovieModel.getById({ id })

    if (!movie) {
      return res.status(404).send('Movie not found')
    }

    res.status(200).send(movie)
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error) })
    }

    const newMovie = await MovieModel.create({ input: result.data })

    res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const result = validateUpdateMovie(req.body)

    if (result.error) {
      return res.status(404).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updateResult = await MovieModel.update({ id, input: result.data })

    if (!updateResult.success) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    res.status(200).json(updateResult.data)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MovieModel.delete({ id })

    if (result) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.status(200).json({ message: 'Movie deleted' })
  }
}
