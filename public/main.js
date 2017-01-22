/******************************* Globals *******************************/

// $'s that precede variables represent DOM elements =)
const $form = document.querySelector('form')
const $searchInput = $form.querySelector('input')
const $cityListDiv = document.getElementById('city-list')
const $celsiusButton = document.getElementById('celsius')
const $fahrenheitButton = document.getElementById('fahrenheit')

/***********************  Helper Functions ***************************/

// Helper function that converts kelvin to fahrenheit
function kelvinToFahrenheit(kelvin) {
  const fahrenheit = 1.8 * (kelvin - 273) + 32
  return fahrenheit.toFixed()
}

// Helper function that converts F to C
function fahrenheitToCelsius(fahrenheit) {
  const f = (fahrenheit - 32) * 5/9
  return f.toFixed() + '\xB0C'
}

// Helper function that capitalizes the first letter of a string.
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Helper function that formats dates from `2017-01-20 06:00:00` to `2017/01/20`
function dateFormat(array) {
  return array.split(' ')[0].replace(/-/g, '/')
}

// Helper function that deletes individual components.
const empty = (element) => element.remove()

// Function call to the open weather api.
const openWeatherQuery = (event) => {

  event.preventDefault()

  const cityValue = $searchInput.value
  $searchInput.value = ''

  const url = `/weather/${cityValue}`

  fetch(url)
    .then(body => body.json())
    .then(json => JSON.parse(json))
    .then(data => renderCity(data, $cityListDiv))
    .catch(error => error)
}

/***********************  Components ********************************/

// Component that creates searched cities.
const renderCity = (json, element) => {

  // When city is rendered. The landing page input transitions up.
  const $cover = document.getElementById('cover')
  const $landing = document.querySelector('.landing')
  $landing.style.paddingTop = '25px'
  $cover.style.height = '235px'

  const $mainComponent = document.createElement('div')
  $mainComponent.classList.add('component')

  const $cityData = document.createElement('div')
  $cityData.setAttribute('id', 'city-data')

  const $city = document.createElement('h3')
  $city.textContent = json.city.name

  const $temp = document.createElement('h2')
  $temp.setAttribute('id', 'fahrenheit')
  const F = kelvinToFahrenheit(json.list[0].main.temp)
  $temp.textContent = `${F}\xB0F`

  // Event listener to transform Fahrenheit to Celsius
  $fahrenheitButton.addEventListener('click', () => {
    $temp.style.visibility = 'visible'
    $temp.style.position = 'relative'

    $tempCelsius.style.visibility = 'hidden'
    $tempCelsius.style.position = 'absolute'

    $celsiusButton.classList.remove('active')
    $fahrenheitButton.classList.add('active')
  })

  const $tempCelsius = document.createElement('h2')
  const C = fahrenheitToCelsius(F)
  $tempCelsius.textContent = C
  $tempCelsius.style.visibility = 'hidden'
  $tempCelsius.style.position = 'absolute'

    // Event listener to transform Fahrenheit to Celsius
  $celsiusButton.addEventListener('click', () => {
    $temp.style.visibility = 'hidden'
    $temp.style.position = 'absolute'

    $tempCelsius.style.visibility = 'visible'
    $tempCelsius.style.position = 'relative'

    $fahrenheitButton.classList.remove('active')
    $celsiusButton.classList.add('active')
  })

  const $weatherSnapshot = document.createElement('div')
  $weatherSnapshot.setAttribute('id', 'snapshot')
  const snapshot = capitalizeFirstLetter(json.list[0].weather[0].description)
  $weatherSnapshot.textContent = `- ${snapshot}`

  const $xButton = document.createElement('button')
  $xButton.textContent = 'Remove'
  $xButton.classList.add('btn', 'btn-danger', 'btn-md')
  $xButton.addEventListener('click', () => empty($mainComponent))

  // Weather Data Object for d3 //
  const data = json.list.map(i => {
    return {
      temp: Number(kelvinToFahrenheit(i.main.temp)),
      date: dateFormat(i.dt_txt)
    }
  })

  $cityData.appendChild($city)
  $cityData.appendChild($temp)
  $cityData.appendChild($tempCelsius)
  $cityData.appendChild($weatherSnapshot)
  $cityData.appendChild($xButton)
  $mainComponent.appendChild($cityData)

  return element.appendChild($mainComponent)
}

/************************* Event Listeners ***************************/

$form.addEventListener('submit', openWeatherQuery)
