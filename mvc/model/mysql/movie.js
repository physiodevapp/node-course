import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'movies'
}
const connectionString = process.env.SQL_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(`
        SELECT id, name 
        FROM genre 
        WHERE LOWER(name) = ?
        `, [lowerCaseGenre])

      const [{ id }] = genres

      const [movies] = await connection.query(`
        SELECT movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate, BIN_TO_UUID(movie.id) AS id
        FROM movie_genre
        INNER JOIN movie ON movie.id = movie_genre.movie_id
        WHERE genre_id = ?
        `, id)

      return movies
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
      FROM movie;`
    )

    return movies
  }

  static async getById ({ id }) {

  }

  static async create ({ input }) {

  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
