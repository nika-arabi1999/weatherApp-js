const city = document.querySelector(".city-name");
const temperatureBox = document.querySelector(".info-temp");
const statusBox = document.querySelector(".status");
const iconBox = document.querySelector(".the-icon");
const windBox = document.querySelector(".wind-box");
const humidityBox = document.querySelector(".humidity-box");
const feelsLikeBox = document.querySelector(".feels-like-box");
const maxMinBox = document.querySelector(".max-min-box");
const searchInput = document.querySelector(".search-input");
const sunriseBox = document.querySelector(".sunrise");
const sunsetBox = document.querySelector(".sunset");
const forcastList = document.querySelector(".forcast-list");

document.addEventListener("DOMContentLoaded", () => {
  let PLACE = localStorage.getItem("city") || "City Name";
  city.innerHTML = `<i class="fa-solid fa-location-dot"></i>${PLACE}`;
  if (PLACE === "City Name") {
    return;
  }
  getData(PLACE);
  // getData(city);
});
searchInput.addEventListener("change", (e) => {
  e.preventDefault();
  let PLACE = e.target.value;
  getData(PLACE);
  city.innerHTML = `<i class="fa-solid fa-location-dot"></i>${PLACE}`;
  localStorage.setItem("city", PLACE);
});

function getData(PLACE) {
  const API_KEY = "4091df4160d65560503dae4aa27e3b2c";
  axios
    .get(
      `http://api.openweathermap.org/data/2.5/forecast?q=${PLACE}&appid=${API_KEY}`
    )
    .then((response) => {
      const info = getInfo(response);
      // const data = response.data;
      // const temperature = data.list[0].main.temp;
      // const temperatureMax = data.list[0].main.temp_max;
      // const temperatureMin = data.list[0].main.temp_min;
      // const feelsLike = data.list[0].main.feels_like;
      // const windSpeed = data.list[0].wind.speed;
      // const humidity = data.list[0].main.humidity;
      // const description = data.list[0].weather[0].main;
      // const sunrise = new Date(data.city.sunrise * 1000);
      // const sunset = new Date(data.city.sunset * 1000);

      console.log(info.datap);
      forcast(info.datap);
      // set main temperature and status:
      setMainTemp(info.temperature);
      setMainDesc(info.description);
      // set sunrise and sunset:
      setSunrise(info.sunrise);
      setSunset(info.sunset);

      // set the icon:
      setMainIcon(info.description);
      // set the 4 boxes data:
      setWind(info.windSpeed);
      setHumidity(info.humidity);
      setfeelsLike(info.feelsLike);
      setMaxMin(info.temperatureMax, info.temperatureMin);
    })
    .catch((err) => console.log(err));
}

// functions:
const getInfo = (response) => {
  const data = response.data;
  return {
    temperature: data.list[0].main.temp,
    temperatureMax: data.list[0].main.temp_max,
    temperatureMin: data.list[0].main.temp_min,
    feelsLike: data.list[0].main.feels_like,
    windSpeed: data.list[0].wind.speed,
    humidity: data.list[0].main.humidity,
    description: data.list[0].weather[0].main,
    sunrise: new Date(data.city.sunrise * 1000),
    sunset: new Date(data.city.sunset * 1000),
    datap: data.list,
  };
};

function setSunrise(sunrise) {
  const hours = `${sunrise.getHours()}`.padStart(2, "0");
  const minutes = `${sunrise.getMinutes()}`.padStart(2, "0");
  const time = `${hours}:${minutes}`;
  sunriseBox.innerHTML = `<div class="sun sunrise"><i class="wi wi-sunrise"></i>${time}</div>`;
}

function setSunset(sunset) {
  const hours = `${sunset.getHours()}`.padStart(2, "0");
  const minutes = `${sunset.getMinutes()}`.padStart(2, "0");
  const time = `${hours}:${minutes}`;
  sunsetBox.innerHTML = `<div class="sun sunset"><i class="wi wi-sunset"></i>${time}</div>`;
}

function kelvinToCelsius(temp) {
  return Math.round(temp - 273.15);
}

function setWind(windSpeed) {
  windBox.innerHTML = `<i class="fa-solid fa-wind"></i>Wind: ${windSpeed} km/h`;
}
function setHumidity(humidity) {
  humidityBox.innerHTML = `<i class="fa-solid fa-droplet"></i>Humidity: ${humidity}%`;
}
function setfeelsLike(feelsLike) {
  feelsLikeBox.innerHTML = `<i class="fa-solid fa-temperature-three-quarters"></i>Feels like ${kelvinToCelsius(
    feelsLike
  )}°`;
}
function setMaxMin(temperatureMax, temperatureMin) {
  maxMinBox.innerHTML = `<i class="fa-solid fa-bolt"></i>max/min: ${kelvinToCelsius(
    temperatureMax
  )}°/${kelvinToCelsius(temperatureMin)}°`;
}

function setMainIcon(status) {
  let mainIcon = "";
  switch (status) {
    case "Thunderstorm":
      mainIcon = `<i class="wi wi-thunderstorm"></i>`;
      break;
    case "Drizzle":
      mainIcon = `<i class="wi wi-sleet"></i>`;
      break;
    case "Rain":
      mainIcon = `<i class="wi wi-rain"></i>`;
      break;
    case "Snow":
      mainIcon = `<i class="wi wi-snow"></i>`;
      break;
    case "Clear":
      mainIcon = `<i class="wi wi-cloud"></i>`;
      break;
    case "Clouds":
      mainIcon = `<i class="wi wi-cloudy"></i>`;
      break;
  }

  iconBox.innerHTML = mainIcon;
  return mainIcon;
}

function setMainData(temperature, description) {
  temperatureBox.innerText = `${kelvinToCelsius(temperature)}°`;
  statusBox.innerText = `${description}`;
}
function setMainTemp(temperature) {
  temperatureBox.innerText = `${kelvinToCelsius(temperature)}°`;
}
function setMainDesc(description) {
  statusBox.innerText = `${description}`;
}

function forcast(data) {
  data.forEach((item) => {
    const temperature = item.main.temp;
    const humidity = item.main.humidity;
    const status = item.weather[0].main;
    const timeH = new Date(item.dt * 1000).getHours();
    const timeM = `${new Date(item.dt * 1000).getMinutes()}`.padStart(2, "0");

    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDate = new Date(item.dt * 1000);
    const dayName = weekday[currentDate.getDay()];
    const time = `${timeH}:${timeM} - ${dayName}`;
    // console.log(dayName);
    const forcastDiv = document.createElement("div");
    forcastDiv.classList.add("list-content");
    forcastDiv.innerHTML = `
    <div class="list-temp">
      <i class="fa-solid fa-temperature-full"></i>${kelvinToCelsius(
        temperature
      )}°
    </div>
    <div class="list-icon">
      <div class="forcast-time">${time}</div>
      <span class="forcast-icon-box">${setMainIcon(status)}</span>
    </div>

    <div class="list-humidity"><i class="fa-solid fa-droplet"></i>${humidity}%</div>
  `;
    console.log("hi");
    forcastList.appendChild(forcastDiv);
  });
}
