const express = require('express')
const secret = require('./config')
const request = require('request')
const bodyParser = require('body-parser')
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'superuser',
    database: 'weather'
  }
})

const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

// Open weather api route
app.get('/weather/:city', (req, res) => {

  const API_KEY = secret.key
  const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`
  const url = `${ROOT_URL}&q=${req.params.city},us`

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.json(body)
    }
  })
})

// Save route
app.post('/save', (req, res) => {
  console.log(req.body)
  knex('cities')
    .insert(req.body.name)
    .into('name')
    .returning(['id', 'name'])
})

// Server
const port = process.env.PORT || 8080
app.listen(port)
