const dittoJSON = require('./data/pokeDitto.json')
const express = require('express')

const app = express()

app.disable('x-powered-by')

// app.use((req, res, next) => {
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()

//   let body = ''

//   req.on('data', (chunk) => {
//     body += chunk.toString()
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)
//     req.body = data
//     next()
//   })
// })
app.use(express.json())

app.get('/pokemon/ditto', (req, resp) => {
  resp.send(JSON.stringify(dittoJSON))
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h4>404</h4>')
})

app.listen(3000, () => {
  console.log('App listening at port: http://localhost:3000')
})
