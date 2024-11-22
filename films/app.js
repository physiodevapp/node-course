const express = require('express')

const app = express()

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
})