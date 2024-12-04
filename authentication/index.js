import express from 'express'
import { PORT } from './env-config.js';

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hola mundo')
})

app.get('/protected', (req, res) => {
  res.send('This content is protected')
})

app.listen(PORT, () => {
  console.log(`Server listening at: http://localhost:${PORT}`);
})