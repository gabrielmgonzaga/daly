const express = require('express')
const secret = require('./config')
const request = require('request')


const app = express()

app.use(express.static('public'))

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

// Server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`listening on ${PORT}`))
