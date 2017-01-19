/**
* $'s that precede variables represent DOM elements =)
*/
const $form = document.querySelector('form')
const $searchInput = $form.querySelector('input')
const $cityListDiv = document.getElementById('city-list')
const $savedListDiv = document.getElementById('saved-cities')
const $savedCitiesButton = document.getElementById('saved-cities')

/**
* Helper function that converts kelvin to fahrenheit
*/
const kelvinToFahrenheit = (kelvin) => {
  const fahrenheit = 1.8 * (kelvin - 273) + 32
  return fahrenheit.toFixed()
}

/**
* Helper function that deletes individual components.
*/
const empty = (element) => element.remove()

/**
* Component that creates queried cities.
*/
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
      .then()
      .catch(error => error)
  })

  $main.appendChild($city)
  $main.appendChild($temp)
  $main.appendChild($weatherSnapshot)
  $main.appendChild($xButton)
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

  const url = `/weather/${cityValue}`

  fetch(url)
    .then(body => body.json())
    .then(json => JSON.parse(json))
    .then(data => renderCity(data, $cityListDiv))
    .catch(error => error)
}

$form.addEventListener('submit', openWeatherQuery)

// Saved cities button
$savedCitiesButton.addEventListener('click', () => {

  $cityListDiv.style.visibility = 'hidden'

  fetch('/saved/cities')
    .then(body => body.json())
    .then(json => json.map(cities => {
      console.log(cities)
    }))
    .catch(error => error)
})
