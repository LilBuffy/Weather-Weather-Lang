# 🌤️ Weather Dashboard

A fucking weather dashboard built with **HTML, CSS, and Vanilla JavaScript**.

It uses the **Open Meteo API** to fetch real weather data and displays it through a clean black and white interface.

Users can search locations, view current conditions, check hourly and 7 day forecasts, use their current location, switch temperature units, and save their last location.

Basically: **Search location → API does its shit → weather appears.**

## 🟢 Project Status

**ACTIVE / STILL ALIVE**

Click me: https://lilbuffy.github.io/Weather-Weather-Lang/

Still online. Still functional. Still showing weather. Not actively maintained though. This was mainly a learning and school project, but the website is still alive for anyone who wants to fuck around with it.

**Пока живой, братан.** No updates. No fancy new features. Just weather. **Weather-weather nga lang ngani, jusq.**

## 🌤️ Current Weather

Displays:

* Current temperature
* Weather condition
* Feels like temperature
* Humidity
* Wind speed
* Wind direction
* Atmospheric pressure
* Precipitation
* Cloud cover
* Sunrise and sunset
* Local date and time

## 🔎 Location Search

Users can search for a city or location. The system uses geocoding to convert the location name into coordinates before requesting weather data.

```text
City Name
   ↓
Geocoding API
   ↓
Latitude + Longitude
   ↓
Weather API
   ↓
Weather Data
```

Simple shit. No black magic. Just APIs doing their fucking job.

## 📍 Current Location

Users can optionally use their device location through the browser's **Geolocation API**. Location permission is only requested when the user chooses to use it. No sneaky bullshit.

## ⏱️ Hourly Forecast

Shows upcoming hourly information:

* Time
* Temperature
* Weather condition
* Precipitation probability

## 📅 7 Day Forecast

Shows:

* Day
* Weather condition
* Maximum temperature
* Minimum temperature
* Precipitation probability

## 🌡️ Celsius / Fahrenheit

Users can switch between:

* °C Celsius
* °F Fahrenheit

## 🔄 Weather Refresh

A refresh button retrieves the latest weather without reloading the entire page because apparently pressing **F5** was not enough.

## 💾 Last Location

Uses **localStorage** to remember:

* Selected location
* Temperature unit

## ⚡ Loading States

While weather data is loading, the dashboard displays a loading animation instead of sitting there looking fucking dead.

## ❌ Error Handling

Handles problems such as:

* Invalid locations
* Location not found
* Network errors
* API errors
* Location permission denial
* Geolocation unavailable

Instead of throwing ugly technical errors at the user:

> "Couldn't find that location."

Much better than:

```text
TypeError: undefined is not a function
```

## 📱 Responsive Design

Designed for:

* Desktop
* Laptop
* Tablet
* Android
* iPhone

## 🌐 API

Uses the **Open Meteo API** for real weather data.

The API provides:

* Location information
* Coordinates
* Current weather
* Hourly forecast
* Daily forecast
* Weather codes
* Temperature
* Humidity
* Wind
* Precipitation
* Sunrise and sunset
* Timezone information

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### API

* Open Meteo

### Browser APIs

* Geolocation API
* localStorage API
* Fetch API

**Конец.**
