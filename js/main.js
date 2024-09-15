const API_KEY = "967c67c047f4249b6c55f6803ab1324d"
const API_KEY_BG = "3xb91jD8twEapM2aQaG3UxihCqStNzROJ9WmKnbad20"
const CITY_INFO = document.querySelector('#cityInfo')
const LOADING_ELEM = document.querySelector('#loading')
const SEARCH_FORM = document.forms[0];
const ERROR_FIELD = document.querySelector('#errorMessage')
const BACKGROUND = document.querySelector('main')

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

let emptyBackground = true
let loadingState = false;

SEARCH_FORM.addEventListener('submit', async function() {
  event.preventDefault();
  if(loadingState) {
    return
  }
  toggleLoading()

  const requestInfo = await fetchWeather(this.elements.city.value)
  const requestBackground = await fetchBackground(this.elements.city.value)

  if (+requestInfo.cod === 200){
    emptyBackground = false
    renderBackground(requestBackground)
    renderData(requestInfo)
  } else {
    emptyBackground = true
    renderBackground()
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
  const res = await fetch(`https://api.unsplash.com/search/photos?client_id=${API_KEY_BG}&query=${img}&per_page=1`);
  const data = await res.json();
  return data;
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

function renderBackground(data) {
  if (data && data.results && data.results.length > 0 & emptyBackground === false) {
    const imageUrl = data.results[0].urls.raw;  
    BACKGROUND.classList.add(`bg-[url(${imageUrl})]`);
  }else {
    BACKGROUND.classList.add(`bg-[url(https://static.vecteezy.com/system/resources/thumbnails/023/232/609/original/temporary-closed-bw-404-animation-hanging-signboard-empty-state-4k-concept-footage-with-alpha-channel-transparency-monochromatic-error-flash-message-for-web-page-not-found-ui-design-video.jpg)]`);
  }
}

function handleError(err) {
  ERROR_FIELD.innerText = err.message
  ERROR_FIELD.classList.remove('hidden')
}
