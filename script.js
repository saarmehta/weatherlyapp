"use strict";

const API_KEY = window.OPENWEATHER_API_KEY || "";
const API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";
const ICON_BASE_URL = "https://openweathermap.org/img/wn";

const form = document.getElementById("weather-form");
const submitBtn = document.getElementById("submit-btn");
const btnText = submitBtn.querySelector(".btn-text");
const btnLoading = submitBtn.querySelector(".btn-loading");

const cityInput = document.getElementById("city-input");
const countryInput = document.getElementById("country-input");

const formError = document.getElementById("form-error");
const weatherResult = document.getElementById("weather-result");
const messageSection = document.getElementById("message-section");
const messageText = document.getElementById("message-text");

const locationNameEl = document.getElementById("location-name");
const locationCountryEl = document.getElementById("location-country");
const weatherIconEl = document.getElementById("weather-icon");
const temperatureEl = document.getElementById("temperature");
const conditionEl = document.getElementById("weather-condition");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");

const FETCH_TIMEOUT_MS = 10000;

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function clearError() {
  formError.textContent = "";
  formError.hidden = true;
}

function hideAllSections() {
  weatherResult.hidden = true;
  messageSection.hidden = false;
}

function showMessage(message) {
  messageText.textContent = message;
  hideAllSections();
}

function showLoading() {
  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;
}

function hideLoading() {
  submitBtn.disabled = false;
  btnText.hidden = false;
  btnLoading.hidden = true;
}

function showWeather(data) {
  const name = data.name;
  const country = data.sys?.country ?? "";
  const weather = data.weather?.[0];
  const main = data.main;
  const wind = data.wind;

  locationNameEl.textContent = country
    ? `${name}, ${country}`
    : name;
  locationCountryEl.textContent = weather?.description ?? "";

  const iconCode = weather?.icon;
  if (iconCode) {
    weatherIconEl.src = `${ICON_BASE_URL}/${iconCode}@2x.png`;
    weatherIconEl.alt = weather.description ?? "Weather icon";
  } else {
    weatherIconEl.src = "";
    weatherIconEl.alt = "";
  }

  temperatureEl.textContent = Math.round(main?.temp) ?? "";
  conditionEl.textContent = weather?.description ?? "";

  humidityEl.textContent = main?.humidity != null ? `${main.humidity}%` : "";
  windSpeedEl.textContent =
    wind?.speed != null ? `${wind.speed} m/s` : "";

  messageSection.hidden = true;
  weatherResult.hidden = false;
}

async function fetchWeather(city, country) {
  if (!API_KEY) {
    throw new Error(
      "API key not configured. Copy config.example.js to config.js and add your OpenWeatherMap key."
    );
  }
  const query = country
    ? `${city},${country}`
    : city;

  const params = new URLSearchParams({
    q: query,
    units: "metric",
    appid: API_KEY,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    FETCH_TIMEOUT_MS
  );

  try {
    const response = await fetch(
      `${API_ENDPOINT}?${params.toString()}`,
      { signal: controller.signal }
    );

    const data = await response.json();

    if (!response.ok) {
      const apiMessage = data?.message
        ? `: ${data.message}`
        : "";
      throw new Error(
        `API error (${response.status})${apiMessage}`
      );
    }

    if (!data.weather || !Array.isArray(data.weather) || !data.main) {
      throw new Error("Unexpected API response structure");
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  const city = cityInput.value.trim();
  const country = countryInput.value.trim();

  if (!city || !country) {
    showError("Please enter both city and country.");
    cityInput.focus();
    return;
  }

  showLoading();

  try {
    const data = await fetchWeather(city, country);
    showWeather(data);
  } catch (error) {
    if (error.name === "AbortError") {
      showError("Request timed out. Please check your connection and try again.");
    } else if (error.message.includes("Failed to fetch")) {
      showError("Network error. Please check your connection and try again.");
    } else {
      const friendlyMessage = error.message.includes("city") ||
        error.message.includes("404") ||
        error.message.includes("not found")
        ? "City not found. Please check the city and country spelling."
        : error.message;
      showError(friendlyMessage);
    }
    showMessage("");
  } finally {
    hideLoading();
  }
});
