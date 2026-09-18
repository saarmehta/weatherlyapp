# WEATHERLY

> **Deprecated:** this project is no longer maintained. Active development continues at [weatherlyapp1](https://github.com/saarmehta/weatherlyapp1).

A minimalist, client-side weather application that displays current conditions for any city and country combination.

## Features

- **City + Country search** — free-text entry for any location worldwide
- **Current conditions** — temperature (°C), weather description, humidity, and wind speed
- **Weather icons** — official OpenWeatherMap condition icons
- **Modern UI** — clean neutral palette with a blue accent, generous whitespace, and rounded corners
- **Fully responsive** — optimized for mobile, tablet, and desktop
- **Graceful error handling** — friendly inline messages for empty inputs, invalid cities, and network failures

## Tech Stack

- **HTML** — semantic structure
- **CSS** — custom styles, no frameworks (Inter font via Google Fonts)
- **Vanilla JavaScript** — `fetch` API, no build step or dependencies

## Getting Started

1. Get a free API key from [OpenWeatherMap](https://home.openweathermap.org/api_keys).
2. Copy `config.example.js` to `config.js` and put your key in it (`config.js` is gitignored, so the key stays out of source control). Never commit a real API key to this repository.
3. Open `index.html` in your browser:

   ```bash
   npx serve  # or any static file server
   ```

4. Enter a city and country, then click **Get Weather**.

## Project Structure

```
weather-app/
├── index.html
├── styles.css
├── script.js
├── config.example.js
├── weather.py
├── .gitignore
└── README.md
```

## Notes

- This is a front-end-only application. For production use, route API requests through a backend or serverless proxy to keep your API key secure.
- Temperature is displayed in **Celsius** (metric units).
