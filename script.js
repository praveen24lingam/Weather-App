const API_KEY = "b9084698cb245a29a15a98229cd9e8fb";

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const weatherCard = document.getElementById("weatherCard");
const cityElem = document.getElementById("city");
const temperatureElem = document.getElementById("temperature");
const descriptionElem = document.getElementById("description");
const detailsElem = document.getElementById("details");
const iconElem = document.getElementById("weatherIcon");
const loader = document.getElementById("loader");
const errorElem = document.getElementById("error");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  fetchWeather(apiUrl);
  localStorage.setItem("lastCity", city);
});

locationBtn.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        fetchWeather(apiUrl);
      },
      () => {
        showError("Location access denied or unavailable.");
      }
    );
  } else {
    showError("Geolocation is not supported by your browser.");
  }
});

function fetchWeather(apiUrl) {
  showLoader();
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found or API error.");
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(err => {
      showError(err.message);
    })
    .finally(() => hideLoader());
}

function displayWeather(data) {
  weatherCard.classList.remove("hidden");
  cityElem.textContent = `${data.name}, ${data.sys.country}`;
  temperatureElem.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionElem.textContent = data.weather[0].description;
  detailsElem.textContent = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s`;
  iconElem.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  errorElem.textContent = "";
}

function showLoader() {
  loader.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showError(message) {
  errorElem.textContent = message;
  weatherCard.classList.add("hidden");
}

// Auto-load last searched city
window.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${lastCity}&appid=${API_KEY}&units=metric`;
    fetchWeather(apiUrl);
  }
});
