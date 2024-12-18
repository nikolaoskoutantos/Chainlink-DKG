const createRequest = require('./index').createRequest

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 8080

app.use(bodyParser.json())

app.get('/health', (req, res) => {
  res.status(200).send('Server is up and running!');
});

app.post('/', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
