const http = require("node:http");
const { findAvailablePort } = require('./utils/server');

const server = http.createServer((req, res) => {
  res.end("Hello world!");
});

findAvailablePort(3000).then((port) => {
  server.listen(port, () => {
    console.log(`server is listening at port:  http://localhost:${port}`);
  })
})
