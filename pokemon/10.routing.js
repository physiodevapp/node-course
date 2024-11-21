const http = require('node:http')

const dittoJSON = require('./data/pokeDitto.json')

const processRequest = (req, res) => {
  const { url, method } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(dittoJSON))
          break

        default:
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.statusCode = 404
          res.end('<h4>404: Resource not found</h4>')
          break
      }
      break

    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''

          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          req.on('end', () => {
            const data = JSON.parse(body)

            res.writeHead(201, { 'Content-Type': 'application/json; charset=uft-8' })
            data.timestamp = Date.now()
            res.end(JSON.stringify(data))
          })

          break
        }

        default:
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.statusCode = 404
          res.end('<h4>404: Resource not found</h4>')
          break
      }
      break

    default:
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.statusCode = 405
      res.end('<h4>405: Method Not Allowed</h4>')
      break
  }
}

const server = http.createServer(processRequest)

server.listen(3000, () => {
  const { port } = server.address()
  console.log(`Server listening at: http://localhost:${port}`)
})
