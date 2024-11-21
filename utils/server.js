const net = require('node:net');

const findAvailablePort = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.close(() => {
        resolve(port);
      });
    });

    server.on("error", (error) => {
      if (error === 'EADDRINUSE') {
        findAvailablePort(0).then((port) => resolve(port));
      } else {
        reject(error)
      }
    })
  });
};

module.exports = { findAvailablePort }  