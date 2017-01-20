/******************************* Globals *******************************/

// $'s that precede variables represent DOM elements =)
const $form = document.querySelector('form')
const $searchInput = $form.querySelector('input')
const $cityListDiv = document.getElementById('city-list')
const $savedListDiv = document.getElementById('saved-list')
const $savedCitiesButton = document.getElementById('saved-cities-button')
const $backButton = document.getElementById('back-button')

/***********************  Helper Functions ***************************/

// Helper function that converts kelvin to fahrenheit
const kelvinToFahrenheit = (kelvin) => {
  const fahrenheit = 1.8 * (kelvin - 273) + 32
  return fahrenheit.toFixed()
}

// Helper function that deletes individual components.
const empty = (element) => element.remove()

// Helper function that formats dates from `2017-01-20 06:00:00` to `2017/01/20`
const dateFormat = (array) => {
  return array.split(' ')[0].replace(/-/g, '/')
}

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
  const F = kelvinToFahrenheit(json.list[0].main.temp)
  $temp.textContent = F + '\xB0F'

  const $weatherSnapshot = document.createElement('div')
  $weatherSnapshot.textContent = '- ' + json.list[0].weather[0].description

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
  $main.appendChild($weatherSnapshot)
  $main.appendChild($xButton)
  $main.appendChild($saveButton)

  return element.appendChild($main)
}

/************************* Event Listeners ***************************/

$form.addEventListener('submit', openWeatherQuery)

$savedCitiesButton.addEventListener('click', showSavedCities)

$backButton.addEventListener('click', hideSavedCities)
