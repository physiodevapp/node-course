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
    const [movies] = await connection.query(`
      SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
      FROM movie
      WHERE BIN_TO_UUID(id) = ?;
      `, id)

    return movies
  }

  static async create ({ input }) {

  }

  static async delete ({ id }) {
    const [{ affectedRows }] = await connection.query(`
      DELETE FROM movie 
      WHERE BIN_TO_UUID(id) = ?;
      `, id)

    return affectedRows === 0
  }

  static async update ({ id, input }) {
    const [oldCompleteInput] = await this.getById({ id })
    const newCompleteInput = {
      ...oldCompleteInput,
      ...input
    }
    const { title, year, director, duration, poster, rate } = newCompleteInput

    await connection.query(`
      UPDATE movie
      SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?
      WHERE BIN_TO_UUID(id) = ?;
      `, [title, year, director, duration, poster, rate, id])

    const [movies] = await this.getById({ id })

    console.log(movies)

    return {
      success: true,
      data: movies
    }
  }
}
