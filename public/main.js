/******************************* Globals *******************************/

// $'s that precede variables represent DOM elements =)
const $form = document.querySelector('form')
const $searchInput = $form.querySelector('input')
const $cityListDiv = document.getElementById('city-list')
const $savedListDiv = document.getElementById('saved-list')
const $savedCitiesButton = document.getElementById('saved-cities-button')
const $backButton = document.getElementById('back-button')
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

// Helper function that converts C to F
function celsiusToFahrenheit(celsius) {
  const c = celsius * 1.8 + 32
  return c.toFixed() + '\xB0F'
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

  hideSavedCities()

  const cityValue = $searchInput.value
  $searchInput.value = ''

  const url = `/weather/${cityValue}`

  fetch(url)
    .then(body => body.json())
    .then(json => JSON.parse(json))
    .then(data => renderCity(data, $cityListDiv))
    .catch(error => error)
}

// Back button which hides the saved cities list
const hideSavedCities = () => {

  $cityListDiv.style.visibility = 'visible'
  $cityListDiv.style.position = 'relative'

  $savedListDiv.style.visibility = 'hidden'
  $savedListDiv.style.position = 'absolute'

  $backButton.style.visibility = 'hidden'
  $savedCitiesButton.style.visibility = 'visible'
}

// Saved cities button which displays the saved cities list.
const showSavedCities = () => {

  $cityListDiv.style.visibility = 'hidden'
  $cityListDiv.style.position = 'absolute'

  $savedListDiv.style.visibility = 'visible'
  $savedListDiv.style.position = 'relative'

  $savedCitiesButton.style.visibility = 'hidden'

  $backButton.style.visibility = 'visible'

  fetch('/saved/cities/')
    .then(body => body.json())
    .then(cities => renderSavedCity(cities, $savedListDiv))
    .catch(error => error)
}

/***********************  Components ********************************/

// Component that creates saved cities.
const renderSavedCity = (array, element) => {

  return array.map(city => {

    const $main = document.createElement('div')
    $main.classList.add('component')

    const $city = document.createElement('h3')
    $city.textContent = city.city.name

    const $temp = document.createElement('h2')
    const F = kelvinToFahrenheit(city.list[0].main.temp)
    $temp.textContent = F + '\xB0F'

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
    $weatherSnapshot.textContent = '- ' + city.list[0].weather[0].description

    const $deleteButton = document.createElement('button')
    $deleteButton.textContent = 'Delete'
    $deleteButton.classList.add('btn', 'btn-danger', 'btn-md')

    // Event listener to delete cities from the database.
    $deleteButton.addEventListener('click', () => {

      fetch('/city/' + city.cityId, { method: 'DELETE' })
        .then()
        .catch(error => error)

      empty($main)
    })

    $main.appendChild($city)
    $main.appendChild($temp)
    $main.appendChild($tempCelsius)
    $main.appendChild($weatherSnapshot)
    $main.appendChild($deleteButton)

    element.appendChild($main)
  })
}

// Component that creates searched cities.
const renderCity = (json, element) => {

  // When city is rendered. The landing page input transitions up.
  const $cover = document.getElementById('cover')
  const $landing = document.querySelector('.landing')
  $landing.style.paddingTop = '40px'
  $cover.style.height = '300px'

  // Saved cities button appears
  $savedCitiesButton.style.visibility = 'visible'

  const $main = document.createElement('div')
  $main.classList.add('component')

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
  $xButton.addEventListener('click', () => empty($main))

  const $saveButton = document.createElement('button')
  $saveButton.textContent = 'Save'
  $saveButton.classList.add('btn', 'btn-primary', 'btn-md', 'btn-save')

  // Event listener to save a city
  $saveButton.addEventListener('click', () => {

    const city = {
      name: json.city.name
    }

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(city)
    }

    fetch('/save', options)
      .then(body => body.json())
      .catch(error => error)
  })

  // Weather Data Object for d3 //
  const data = json.list.map(i => {
    return {
      temp: Number(kelvinToFahrenheit(i.main.temp)),
      date: dateFormat(i.dt_txt)
    }
  })
  console.log(data)

  $main.appendChild($city)
  $main.appendChild($temp)
  $main.appendChild($tempCelsius)
  $main.appendChild($weatherSnapshot)
  $main.appendChild($xButton)
  $main.appendChild($saveButton)

  return element.appendChild($main)
}

/************************* Event Listeners ***************************/

$form.addEventListener('submit', openWeatherQuery)

$savedCitiesButton.addEventListener('click', showSavedCities)

$backButton.addEventListener('click', hideSavedCities)
