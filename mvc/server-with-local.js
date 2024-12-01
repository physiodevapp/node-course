import { createApp } from './app.js'
import { MovieModel } from './model/local-file-system/movie.js'

createApp({ movieModel: MovieModel })
