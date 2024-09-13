const API_KEY = "967c67c047f4249b6c55f6803ab1324d"
const CITY_INFO = document.querySelector('#cityInfo')
const LOADING_ELEM = document.querySelector('#loading')
const SEARCH_FORM = document.forms[0];
const ERROR_FIELD = document.querySelector('#errorMessage')

const CITY_INFO_FIELDS_MAP = {
  name: document.querySelector('#cityName'),
  description: document.querySelector('#description'),
  icon: document.querySelector('#icon'),
  humidity: document.querySelector('#humidity'),
  clouds: document.querySelector('#clouds'),
  temp: document.querySelector('#temp'),
  tempMin: document.querySelector('#tempMin'),
  tempMax: document.querySelector('#tempMax'),
  feelsLike: document.querySelector('#feelsLike'),
  wind: document.querySelector('#wind'),
}

let loadingState = false;

SEARCH_FORM.addEventListener('submit', async function() {
  event.preventDefault();
  if(loadingState) {
    return
  }
  toggleLoading()

  const requestInfo = await fetchWeather(this.elements.city.value)

  if (+requestInfo.cod === 200){
    renderData(requestInfo)
  } else {
    handleError(requestInfo)
  }

  toggleLoading()
  this.reset()
})

function toggleLoading() {
  loadingState = !loadingState;
  loadingState
    ? (LOADING_ELEM.classList.remove('hidden'), CITY_INFO.classList.add('hidden'), ERROR_FIELD.classList.add('hidden') )
    : LOADING_ELEM.classList.add('hidden')
}

async function fetchBackground(img) {
    const res = await fetch(``)
    const data = await res.json()
    return data
}

async function fetchWeather(city) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    const data = await res.json()
    return data
}

function renderData(info) {
  CITY_INFO_FIELDS_MAP.name.innerText = info.name
  CITY_INFO_FIELDS_MAP.clouds.innerText = info.clouds.all + '%'
  CITY_INFO_FIELDS_MAP.wind.innerText = info.wind.speed + " m/s"
  CITY_INFO_FIELDS_MAP.description.innerText = info.weather[0].description
  CITY_INFO_FIELDS_MAP.temp.innerText = Math.round(info.main.temp) + " °C"
  CITY_INFO_FIELDS_MAP.feelsLike.innerText = Math.round(info.main.feels_like) + " °C"
  CITY_INFO_FIELDS_MAP.tempMin.innerText = Math.round(info.main.temp_min)
  CITY_INFO_FIELDS_MAP.tempMax.innerText = Math.round(info.main.temp_max) + " °C"
  CITY_INFO_FIELDS_MAP.humidity.innerText = info.main.humidity + "%"

  CITY_INFO_FIELDS_MAP.icon.setAttribute('src', `https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`)
  CITY_INFO_FIELDS_MAP.icon.setAttribute('alt', info.weather[0].description)

  CITY_INFO.classList.remove('hidden')
}

function handleError(err) {
  ERROR_FIELD.innerText = err.message
  ERROR_FIELD.classList.remove('hidden')
}
