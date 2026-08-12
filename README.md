# 🌤️ Weather Dashboard

A fucking minimalist weather dashboard built with **HTML, CSS, and Vanilla JavaScript**.

It uses the **Open Meteo API** to fetch real weather data and displays it through a clean black and white interface.

Users can search locations, view current conditions, check hourly and 7 day forecasts, use their current location, switch temperature units, and save their last location.

Basically:

**Search location → API does its shit → weather appears.**

No PHP.

No MySQL.

No backend.

No fucking **pizdets**.

## 🟢 Project Status

**ACTIVE / STILL ALIVE**

Click me: https://lilbuffy.github.io/Weather-Weather-Lang/

Still online.

Still functional.

Still showing weather.

Not actively maintained though.

This was mainly a learning and school project, but the website is still alive for anyone who wants to fuck around with it.

**Пока живой, братан.**

No updates.

No fancy new features.

Just weather.

**Weather-weather nga lang, jusq.**

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

Basically, enough information to know whether going outside is a good idea or absolute **govno**.

## 🔎 Location Search

Users can search for a city or location.

The system uses geocoding to convert the location name into coordinates before requesting weather data.

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

No black magic.

Just APIs doing their fucking job.

## 📍 Current Location

Users can optionally use their device location through the browser's **Geolocation API**.

Location permission is only requested when the user chooses to use it.

No sneaky bullshit.

## ⏱️ Hourly Forecast

Shows upcoming hourly information:

* Time
* Temperature
* Weather condition
* Precipitation probability

The forecast can be horizontally scrolled on smaller screens.

## 📅 7 Day Forecast

Shows:

* Day
* Weather condition
* Maximum temperature
* Minimum temperature
* Precipitation probability

Enough information to decide whether leaving the house is smart or **пиздец**.

## 🌡️ Celsius / Fahrenheit

Users can switch between:

* °C Celsius
* °F Fahrenheit

Temperature values update across the dashboard.

## 🔄 Weather Refresh

A refresh button retrieves the latest weather without reloading the entire page.

Because apparently pressing **F5** was not enough.

## 💾 Last Location

Uses **localStorage** to remember:

* Selected location
* Temperature unit

No account.

No database.

No PHP.

Just the browser remembering your shit.

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

**BLYAT.**

## 📱 Responsive Design

Designed for:

* Desktop
* Laptop
* Tablet
* Android
* iPhone

The layout adapts to different screen sizes.

## 🎨 Design

Strict **black and white minimalist aesthetic**.

```text
Black
#000000

White
#FFFFFF
```

Subtle gray tones may be used for secondary information.

The design focuses on:

* Clean typography
* Strong contrast
* Generous spacing
* Minimalist cards
* Smooth transitions
* Subtle animations
* Clear information hierarchy

No rainbow weather gradients.

No unnecessary bullshit.

Just:

**Black.**

**White.**

**Weather.**

**Fucking simplicity.**

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

Since the project is frontend only, JavaScript communicates directly with the public API.

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

The whole architecture:

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
JavaScript
  ↓
HTML + CSS
  ↓
Weather
```

Simple as fuck.

And that's the point.

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

Clean.

Small.

Straightforward.

No **govno** folder structure with 47 files named `final_final_REAL.js`.

**Конец.**
