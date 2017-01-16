/**
* $'s that precede variables represent DOM elements =)
*/
const $form = document.querySelector('form')
const $searchInput = $form.querySelector('input')
const $cityListDiv = document.getElementById('city-list')

const API_KEY = '6fe56e88046e208eb2ba45d63105ddcf'
const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`

/**
* Helper function that converts kelvin to fahrenheit
*/
const kelvinToFahrenheit = function(kelvin) {
  const fahrenheit = 1.8 * (kelvin - 273) + 32
  return fahrenheit.toFixed()
}

/**
* Helper function that deletes individual components.
*/
function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

/**
* Component that creates queried cities.
*/
const renderCity = (json, element) => {

  const $main = document.createElement('div')

  const $city = document.createElement('h3')
  $city.textContent = json.city.name

  const $xButton = document.createElement('button')
  $xButton.textContent = 'X'
  $xButton.setAttribute('id', 'xbutton')
  $xButton.addEventListener('click', () => empty($main))

  const $temp = document.createElement('div')
  $temp.textContent = kelvinToFahrenheit(json.list[0].main.temp)

  const $weatherSnapshot = document.createElement('div')
  $weatherSnapshot.textContent = json.list[0].weather[0].description

  const $saveButton = document.createElement('button')
  $saveButton.textContent = 'Save'
  $saveButton.setAttribute('id', 'saveButton')
  $saveButton.addEventListener('click', () => console.log('hello'))

  $main.appendChild($city)
  $main.appendChild($xButton)
  $main.appendChild($temp)
  $main.appendChild($weatherSnapshot)
  $main.appendChild($saveButton)

  return element.appendChild($main)
}

/**
* Function call to the open weather api.
*/
const openWeatherQuery = (event) => {

  event.preventDefault()

  const cityValue = $searchInput.value
  $searchInput.value = ''

  const url = `${ROOT_URL}&q=${cityValue},us`

  fetch(url)
    .then(response => response.json())
    .then(json => renderCity(json, $cityListDiv))
    .catch(error => error)
}

$form.addEventListener('submit', openWeatherQuery)
