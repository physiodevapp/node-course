import { createApp } from './app.js'
import { MovieModel } from './model/mysql/movie.js'

createApp({ movieModel: MovieModel })
