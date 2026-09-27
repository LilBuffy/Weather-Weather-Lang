# Weather Dashboard

A fucking Weather Dashboard built with **HTML, CSS, and Vanilla JavaScript**, ginawa para kumuha ng totoong weather data gamit ang **Open Meteo API** at gawing readable yung buong kaguluhan. Search ka ng city, kukunin yung coordinates, tatawag sa API, tapos BOOM, may weather ka na. City → Coordinates → API → Weather. Simple shit. БЛЯТЬ.

**Project Status:** ACTIVE / STILL ALIVE

**CLICK ME:** https://lilbuffy.github.io/Weather-Weather-Lang/

**WARNING:** Your antivirus or browser security might randomly think the website is suspicious. Relax, weather data lang ang kinukuha nito. Walang hacking, walang dark magic, walang fucking bullshit. Pero syempre, huwag pa rin blindly trust random websites. Check the repository kung gusto mong siguraduhin kung ano talaga yung pinapatakbo mo.

## What This Shit Can Do

The dashboard shows current weather information including **temperature, weather condition, feels like temperature, humidity, wind speed and direction, atmospheric pressure, precipitation, cloud cover, sunrise and sunset, and local date and time**. May hourly forecast din na may time, temperature, weather condition, at precipitation probability, plus a **7 day forecast** para makita mo yung daily conditions, maximum and minimum temperature, at chance of precipitation.

You can search for a location by city name, with the system converting the location into coordinates before requesting the actual weather data. May option din gamitin ang browser's **Geolocation API** para kunin ang current location mo, pero browser permission ang magdedesisyon kung papayagan mo. Walang sneaky bullshit na biglang susulpot at magsasabing alam niya kung nasaan ka.

Temperature units can also be switched between **Celsius and Fahrenheit**, while Open Meteo handles the location data, coordinates, current weather, forecasts, temperature, humidity, wind, precipitation, sunrise and sunset, and timezone information.

## API

The project uses **Open Meteo** for the actual weather data and location services. The frontend sends requests through the browser, receives the API response, then turns that raw data into the weather dashboard instead of dumping some unreadable JSON shit sa screen.

Basically:

**Search Location → Get Coordinates → Call API → Receive Data → Display Weather**

APIs doing their fucking job. Ako taga display lang.

## Tech Stack

**HTML5, CSS3, Vanilla JavaScript, Open Meteo API, Geolocation API, localStorage, and Fetch API.**

No backend. No database. No giant framework. No 900MB of bullshit para lang sabihin sa'yo na 31°C sa labas.

## About

This was originally created as a **school project** and is still online and functional, although it is **not actively maintained**. It was mainly built to practice working with APIs, browser APIs, asynchronous JavaScript, location searching, weather data, and responsive frontend development.

Basically, ginawa ko lang dapat na weather app, pero kailangan ko pang kausapin ang API, geolocation, localStorage, forecasts, timezones, at kung anu anong fucking weather data bago ko makuha yung simpleng sagot na **“mainit.”**
