import { requireJSON } from '../utils.js'

const movies = requireJSON('./movies.json')

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const genreMovies = movies.filter((movie) => movie.genre.some((movieGenre) => movieGenre.toLowerCase() === genre.toLowerCase()))

      return genreMovies
    }

    return movies
  }

  static async getById ({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id)

    if (movieIndex === -1) return null

    return movies[movieIndex]
  }

  static async create ({ movie }) {
    const newMovie = {
      id: crypto.randomUUID(),
      ...movie
    }

    movies.push(newMovie)

    return movie
  }

  static async update ({ id, movie }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id)

    if (movieIndex === -1) {
      return {
        success: false,
        data: null
      }
    }

    const updateMovie = {
      ...movies[movieIndex],
      ...movie
    }

    movies[movieIndex] = updateMovie

    return {
      success: true,
      data: updateMovie
    }
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id)

    if (movieIndex) {
      movies.splice(id, 1)
    }

    return movieIndex === -1
  }
}
