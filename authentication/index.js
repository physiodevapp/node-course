import express from 'express'
import { PORT } from './env-config.js';

const app = express()

app.get('/', (req, res) => {
  res.send('hola mundo')
})

app.listen(PORT, () => {
  console.log(`Server listening at: http://localhost:${PORT}`);
})