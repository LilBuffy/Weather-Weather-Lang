# 🌤️ Weather Dashboard

A fucking modern minimalist weather dashboard built entirely with **HTML, CSS, and Vanilla JavaScript**.

The website retrieves real time weather information from the **Open Meteo API** and displays it through a clean black and white interface.

Users can search for locations, view current weather conditions, check hourly and 7 day forecasts, and explore additional weather information without an account, backend, or database.

Basically:

**Search location → API does its shit → weather appears.**

No PHP. No MySQL. No backend. No fucking **pizdets**.

🟢 Project Status

ACTIVE / STILL ALIVE

The project is still online and functional, but it is no longer actively maintained.

It served its purpose as a learning and school project, and the website is still available for anyone who wants to fuck around with it.

The weather is still working.

The dashboard is still alive.

For now.

Пока живой, братан.

No updates. No fancy new features.

Weather-weather nga lang ngani jusq nababaliw na ko.

## 🌤️ Current Weather

Displays weather information for the selected location, including:

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

Users can search for a city or location.

The system uses geocoding to convert the location name into coordinates before retrieving the weather data.

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

Simple shit.

## 📍 Current Location

Users can optionally use their device location through the browser's **Geolocation API**.

Location permission is only requested when the user chooses to use their current location.

No sneaky bullshit.

## ⏱️ Hourly Forecast

Displays upcoming hourly weather information such as:

* Time
* Temperature
* Weather condition
* Precipitation probability

The hourly forecast can be horizontally scrolled on smaller screens.

## 📅 7 Day Forecast

Provides daily weather information including:

* Day
* Weather condition
* Maximum temperature
* Minimum temperature
* Precipitation probability

Enough information to know whether going outside is a good idea or absolute **govno**.

## 🌡️ Celsius / Fahrenheit

Users can switch between:

* °C Celsius
* °F Fahrenheit

Temperature values throughout the dashboard update accordingly.

## 🔄 Weather Refresh

A refresh button allows users to retrieve the latest weather information without reloading the entire webpage.

Because apparently pressing **F5** was not enough.

## 💾 Last Location

The website uses **localStorage** to remember the previously selected location.

Basic preferences such as:

* Selected location
* Temperature unit

can be stored locally.

No account or database required.

## ⚡ Loading States

While weather data is being retrieved, the dashboard displays a loading animation instead of sitting there looking fucking dead.

## ❌ Error Handling

The website handles common problems such as:

* Invalid locations
* Location not found
* Network errors
* API errors
* Location permission denial
* Geolocation unavailable

Instead of exposing ugly technical errors, users receive simple messages such as:

> "Couldn't find that location."

Much better than:

> `TypeError: undefined is not a function`

**Blyat.**

## 📱 Responsive Design

The dashboard is designed for:

* Desktop
* Laptop
* Tablet
* Android
* iPhone

The layout automatically adapts to different screen sizes.

## 🎨 Design

The website follows a strict **black and white minimalist aesthetic**.

Main colors:

```text
Black
#000000

White
#FFFFFF
```

Subtle gray tones may be used for secondary information and UI elements.

The design focuses on:

* Clean typography
* Strong contrast
* Generous spacing
* Minimalist cards
* Smooth transitions
* Subtle animations
* Clear information hierarchy

No colorful weather gradients.

Just **black, white, weather, and fucking simplicity.**

Basically, a weather dashboard that doesn't look like it was made at 3 AM five minutes before the school deadline.

## 🌐 API

The website uses the **Open Meteo API** to retrieve real weather information.

It provides data such as:

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

Because the project is frontend only, JavaScript communicates directly with the public API.

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

### Not Used

* PHP
* MySQL
* Node.js
* React
* Vue
* Backend
* Database

The architecture is basically:

```text
User
  ↓
HTML
  ↓
JavaScript
  ↓
Open Meteo API
  ↓
JSON Weather Data
  ↓
JavaScript processes data
  ↓
HTML + CSS displays it
```

Simple as fuck.

Which is actually good for learning.

## 📁 Project Structure

```text
weather-dashboard/
│
├── index.html
│
├── css/
│   └── style.css
│
└── js/
    └── app.js
```

Clean. Small. Straightforward.

No **govno** folder structure with 47 unnecessary files.
