const express = require('express')
const secret = require('./config')
const request = require('request')
const app = express()

const API_KEY = secret.key
const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`

app.use(express.static('public'))

// Open weather api route
app.get('/weather/:city', (req, res) => {

  const url = `${ROOT_URL}&q=${req.params.city},us`

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.json(body)
    }
  })
})

// Server
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on ${port}`))
