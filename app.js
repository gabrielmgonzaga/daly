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

const API_KEY = secret.key
const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`

// Open weather api route
app.get('/weather/:city', (req, res) => {

  const url = `${ROOT_URL}&q=${req.params.city},us`

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.json(body)
    }
  })
})

// Route to get saved cities
app.get('/saved/cities', (req, res) => {
  knex
    .select()
    .table('cities')
    .then(cities => {
      const promises = cities.map(city => {
        return new Promise((resolve, reject) => {
          const url = `${ROOT_URL}&q=${city.name},us`
          request(url, { json: true }, (error, response, body) => {
            if (error) reject(error)
            resolve(body)
          })
        })
      })
      Promise.all(promises)
        .then(data => res.json(data))
    })
})

// Save route
app.post('/save', (req, res) => {
  knex
    .table('cities')
    .insert(req.body)
    .into('cities')
    .returning(['id', 'name'])
    .then(city => res.json(city[0]))
})

// Server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`listening on ${PORT}`))
