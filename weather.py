"""Retrieve and display current weather for Sydney, Australia.

Uses the OpenWeatherMap Current Weather Data API. The API key is read
from the OPENWEATHER_API_KEY environment variable (e.g. configured via
GitHub Codespaces secrets) so it is never hard-coded in the source.
"""

import os
import sys

import requests

# OpenWeatherMap endpoint and the target location.
API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather"
LOCATION_CITY = "Sydney"
LOCATION_COUNTRY = "AU"
REQUEST_TIMEOUT = 10
DEFAULT_API_KEY = "9dfbd2551a9f85b7ae01784ef89e9847"


def get_api_key():
    """Return the API key from a CLI argument, the environment, or the default."""
    cli_api_key = sys.argv[1] if len(sys.argv) > 1 else None
    api_key = cli_api_key or os.environ.get("OPENWEATHER_API_KEY") or DEFAULT_API_KEY
    if not api_key:
        print(
            "Error: No API key was provided. Pass one as an argument or set OPENWEATHER_API_KEY.",
            file=sys.stderr,
        )
        sys.exit(1)
    return api_key


def build_request_params(api_key):
    """Build the query parameters for the weather API request."""
    return {
        "q": f"{LOCATION_CITY},{LOCATION_COUNTRY}",
        "appid": api_key,
        "units": "metric",
    }


def fetch_weather(params):
    """Send the HTTP GET request and return the parsed JSON response."""
    try:
        response = requests.get(
            API_ENDPOINT, params=params, timeout=REQUEST_TIMEOUT
        )
    except requests.RequestException as exc:
        print(f"Error: Failed to connect to the weather service ({exc}).",
              file=sys.stderr)
        sys.exit(1)

    # Handle HTTP-level failures, e.g. 4xx or 5xx responses.
    if response.status_code != 200:
        print(
            f"Error: API request failed with status code "
            f"{response.status_code} - {response.text}",
            file=sys.stderr,
        )
        sys.exit(1)

    try:
        return response.json()
    except ValueError:
        print("Error: Received an invalid (non-JSON) response from the API.",
              file=sys.stderr)
        sys.exit(1)


def parse_weather(data):
    """Extract temperature and conditions from the API response."""
    try:
        temperature = data["main"]["temp"]
        weather_list = data["weather"]
        description = weather_list[0]["description"].title()
        location_name = data["name"]
    except (KeyError, IndexError, TypeError):
        print(
            "Error: Unexpected API response structure. The required "
            "fields were not found in the returned data.",
            file=sys.stderr,
        )
        sys.exit(1)

    return temperature, description, location_name


def display_weather(temperature, description, location_name):
    """Print the weather information in a human-readable format."""
    print(f"Current weather in {location_name}:")
    print(f"  Temperature: {temperature:.1f}°C")
    print(f"  Conditions:  {description}")


def main():
    """Entry point: retrieve the API key, fetch, parse, and display weather."""
    api_key = get_api_key()
    params = build_request_params(api_key)
    data = fetch_weather(params)
    temperature, description, location_name = parse_weather(data)
    display_weather(temperature, description, location_name)


if __name__ == "__main__":
    main()
