const express = require('express')
const bodyParser = require('body-parser')
const { server } = require('./config')

const models = require('./models')
const router = require('./router')
const app = express()

const PORT = server.port;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

router(app, models)

app.listen(PORT, () => {
  console.log('APP listening on port:', PORT)
})
