/* =========================================================
   WEATHER DASHBOARD — APP LOGIC
   -----------------------------------------------------------
   APIs used (both free, no API key required):

   1. Open-Meteo Geocoding API
      GET https://geocoding-api.open-meteo.com/v1/search
      → turns a city name the user types into { latitude, longitude, name, country }

   2. Open-Meteo Forecast API
      GET https://api.open-meteo.com/v1/forecast
      → turns { latitude, longitude } into current conditions,
        an hourly forecast, and a 7-day daily forecast.

   3. BigDataCloud reverse-geocoding (client-side, free, no key)
      GET https://api.bigdatacloud.net/data/reverse-geocode-client
      → used ONLY when the user clicks "Use my location", to turn the
        coordinates the browser Geolocation API gives us back into a
        human-readable place name. Open-Meteo itself has no reverse
        geocoding endpoint, so this is the one non-Open-Meteo call.

   Data flow:
     User searches city
            ↓
     Open-Meteo Geocoding API  →  { latitude, longitude, name, country }
            ↓
     Open-Meteo Forecast API   →  current / hourly / daily JSON
            ↓
     JavaScript formats the raw JSON (weather codes → text, units,
     timezone-aware clock, etc.)
            ↓
     DOM is updated → dashboard
   ========================================================= */

(() => {
  "use strict";

  /* ===================== CONFIG ===================== */

  const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
  const REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  const STORAGE_KEYS = {
    lastLocation: "weatherDashboard.lastLocation",
    unit: "weatherDashboard.temperatureUnit",
  };

  const FORECAST_PARAMS = {
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
      "visibility",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_probability_max",
      "uv_index_max",
    ].join(","),
  };

  /* ===================== WEATHER CODE → TEXT + ICON =====================
     Open-Meteo uses the WMO "weather interpretation" code table.
     This maps each numeric code to a human readable label and an
     icon family so we never show a raw number to the user.
  ======================================================================= */

  const WEATHER_CODES = {
    0: { text: "Clear sky", icon: "clear" },
    1: { text: "Mainly clear", icon: "clear" },
    2: { text: "Partly cloudy", icon: "partly-cloudy" },
    3: { text: "Overcast", icon: "cloudy" },
    45: { text: "Fog", icon: "fog" },
    48: { text: "Rime fog", icon: "fog" },
    51: { text: "Light drizzle", icon: "drizzle" },
    53: { text: "Moderate drizzle", icon: "drizzle" },
    55: { text: "Dense drizzle", icon: "drizzle" },
    56: { text: "Light freezing drizzle", icon: "drizzle" },
    57: { text: "Dense freezing drizzle", icon: "drizzle" },
    61: { text: "Slight rain", icon: "rain" },
    63: { text: "Moderate rain", icon: "rain" },
    65: { text: "Heavy rain", icon: "rain" },
    66: { text: "Light freezing rain", icon: "rain" },
    67: { text: "Heavy freezing rain", icon: "rain" },
    71: { text: "Slight snow fall", icon: "snow" },
    73: { text: "Moderate snow fall", icon: "snow" },
    75: { text: "Heavy snow fall", icon: "snow" },
    77: { text: "Snow grains", icon: "snow" },
    80: { text: "Slight rain showers", icon: "rain" },
    81: { text: "Moderate rain showers", icon: "rain" },
    82: { text: "Violent rain showers", icon: "rain" },
    85: { text: "Slight snow showers", icon: "snow" },
    86: { text: "Heavy snow showers", icon: "snow" },
    95: { text: "Thunderstorm", icon: "storm" },
    96: { text: "Thunderstorm, slight hail", icon: "storm" },
    99: { text: "Thunderstorm, heavy hail", icon: "storm" },
  };

  function describeWeatherCode(code) {
    return WEATHER_CODES[code] || { text: "Unknown", icon: "cloudy" };
  }

  /* ===================== MONOCHROME SVG ICONS =====================
     Simple single-stroke line icons, no fills, no color — everything
     inherits `currentColor` so it always stays black/white/gray.
  =================================================================== */

  const ICONS = {
    "clear-day": `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="6.5" stroke="currentColor" stroke-width="1.4"/><g stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="16" y1="2" x2="16" y2="6"/><line x1="16" y1="26" x2="16" y2="30"/><line x1="2" y1="16" x2="6" y2="16"/><line x1="26" y1="16" x2="30" y2="16"/><line x1="5.8" y1="5.8" x2="8.6" y2="8.6"/><line x1="23.4" y1="23.4" x2="26.2" y2="26.2"/><line x1="5.8" y1="26.2" x2="8.6" y2="23.4"/><line x1="23.4" y1="8.6" x2="26.2" y2="5.8"/></g></svg>`,
    "clear-night": `<svg viewBox="0 0 32 32" fill="none"><path d="M23 4C16.4 4 11 9.4 11 16s5.4 12 12 12c3.3 0 6.3-1.3 8.5-3.5-1 .3-2.1.5-3.2.5-6.6 0-12-5.4-12-12 0-4.4 2.4-8.3 6-10.3C21.6 4.1 21 4 20.3 4H23z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="9" cy="9" r="0.8" fill="currentColor"/><circle cx="6" cy="16" r="0.6" fill="currentColor"/></svg>`,
    "partly-cloudy": `<svg viewBox="0 0 32 32" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.3"/><g stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="4.2"/><line x1="4.5" y1="9.5" x2="6.2" y2="10.8"/><line x1="19.5" y1="9.5" x2="17.8" y2="10.8"/></g><path d="M9 27h13a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.2-3A5.5 5.5 0 0 0 9 27z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    cloudy: `<svg viewBox="0 0 32 32" fill="none"><path d="M8 24h16a5.5 5.5 0 0 0 0-11 7 7 0 0 0-13.4-2.7A5.8 5.8 0 0 0 8 24z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    fog: `<svg viewBox="0 0 32 32" fill="none"><path d="M9 13h14a5 5 0 0 0-9.4-2.4A4.5 4.5 0 0 0 9 13z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><g stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><line x1="4" y1="18" x2="28" y2="18"/><line x1="7" y1="22.5" x2="25" y2="22.5"/><line x1="4" y1="27" x2="28" y2="27"/></g></svg>`,
    drizzle: `<svg viewBox="0 0 32 32" fill="none"><path d="M8 17h16a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.2-2.6A5.3 5.3 0 0 0 8 17z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><g stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="11" y1="22" x2="10" y2="25.5"/><line x1="16" y1="22" x2="15" y2="25.5"/><line x1="21" y1="22" x2="20" y2="25.5"/></g></svg>`,
    rain: `<svg viewBox="0 0 32 32" fill="none"><path d="M8 16h16a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.2-2.5A5.3 5.3 0 0 0 8 16z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><g stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="10.5" y1="21" x2="9" y2="26.5"/><line x1="16" y1="21" x2="14.5" y2="26.5"/><line x1="21.5" y1="21" x2="20" y2="26.5"/></g></svg>`,
    snow: `<svg viewBox="0 0 32 32" fill="none"><path d="M8 15h16a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.2-2.4A5.3 5.3 0 0 0 8 15z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><g stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><line x1="11" y1="20" x2="11" y2="27"/><line x1="7.8" y1="21.8" x2="14.2" y2="25.2"/><line x1="14.2" y1="21.8" x2="7.8" y2="25.2"/><line x1="21" y1="20" x2="21" y2="27"/><line x1="17.8" y1="21.8" x2="24.2" y2="25.2"/><line x1="24.2" y1="21.8" x2="17.8" y2="25.2"/></g></svg>`,
    storm: `<svg viewBox="0 0 32 32" fill="none"><path d="M8 14h15a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.2-2.1A5.3 5.3 0 0 0 8 14z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M17 18l-4.5 7h4L14 30l6.5-8.5h-4l3-3.5h-2.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" fill="none"/></svg>`,
  };

  function iconMarkup(family, isDay) {
    if (family === "clear") return ICONS[isDay ? "clear-day" : "clear-night"];
    return ICONS[family] || ICONS.cloudy;
  }

  /* ===================== STATE ===================== */

  const state = {
    unit: "C", // "C" | "F"
    location: null, // { latitude, longitude, name, country, admin1 }
    weather: null, // raw forecast JSON from Open-Meteo (always fetched in °C)
    geoRequested: false, // guards against repeated geolocation prompts
  };

  /* ===================== DOM REFERENCES ===================== */

  const dom = {
    searchForm: document.getElementById("search-form"),
    searchInput: document.getElementById("search-input"),
    searchResults: document.getElementById("search-results"),
    searchStatus: document.getElementById("search-status"),
    locateBtn: document.getElementById("locate-btn"),
    refreshBtn: document.getElementById("refresh-btn"),
    unitC: document.getElementById("unit-c"),
    unitF: document.getElementById("unit-f"),

    statusPanel: document.getElementById("status-panel"),
    statusText: document.getElementById("status-text"),
    statusRetry: document.getElementById("status-retry"),
    loader: document.getElementById("loader"),

    dashboard: document.getElementById("dashboard"),
    locationName: document.getElementById("location-name"),
    locationSub: document.getElementById("location-sub"),
    currentTime: document.getElementById("current-time"),
    currentDate: document.getElementById("current-date"),
    currentTemp: document.getElementById("current-temp"),
    currentIcon: document.getElementById("current-icon"),
    currentCondition: document.getElementById("current-condition"),
    feelsLike: document.getElementById("feels-like"),

    sunArcMarker: document.getElementById("sun-arc-marker"),
    sunArcPath: document.getElementById("sun-arc-path"),
    sunriseTime: document.getElementById("sunrise-time"),
    sunsetTime: document.getElementById("sunset-time"),

    chipHumidity: document.getElementById("chip-humidity"),
    chipWind: document.getElementById("chip-wind"),
    chipPressure: document.getElementById("chip-pressure"),
    chipPrecip: document.getElementById("chip-precip"),

    hourlyScroll: document.getElementById("hourly-scroll"),
    dailyList: document.getElementById("daily-list"),
    detailsList: document.getElementById("details-list"),
    lastUpdated: document.getElementById("last-updated"),
  };

  let clockInterval = null;
  let searchDebounce = null;
  let lastFocusedBeforeResults = null;

  /* ===================== UTILITIES ===================== */

  /** Convert a Celsius value to the currently selected display unit. */
  function displayTemp(celsius) {
    if (celsius === null || celsius === undefined) return "--";
    const value = state.unit === "F" ? celsius * 9 / 5 + 32 : celsius;
    return Math.round(value);
  }

  /** Turn wind degrees into a 16-point compass label. */
  function degreesToCompass(deg) {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
  }

  /** Format an ISO time string using the LOCATION's timezone (not the browser's). */
  function formatTimeInZone(isoString, timeZone) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    }).format(date);
  }

  function formatHourLabel(isoString, timeZone) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      timeZone,
    }).format(new Date(isoString));
  }

  function formatDateInZone(dateLike, timeZone) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone,
    }).format(new Date(dateLike));
  }

  function formatDayShort(dateLike, timeZone) {
    return new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone }).format(new Date(dateLike));
  }

  function formatDayNum(dateLike, timeZone) {
    return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", timeZone }).format(new Date(dateLike));
  }

  /** Get the "now" instant expressed in the forecast's own timezone, as minutes-of-day etc. */
  function nowInZone(timeZone) {
    const parts = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false, timeZone,
    }).formatToParts(new Date());
    const map = {};
    parts.forEach(p => (map[p.type] = p.value));
    return { hour: Number(map.hour), minute: Number(map.minute) };
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /* ===================== LOCAL STORAGE ===================== */

  function saveLastLocation(loc) {
    try {
      localStorage.setItem(STORAGE_KEYS.lastLocation, JSON.stringify(loc));
    } catch (e) {
      /* localStorage may be unavailable (private mode) — fail silently */
    }
  }

  function loadLastLocation() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.lastLocation);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveUnit(unit) {
    try { localStorage.setItem(STORAGE_KEYS.unit, unit); } catch (e) { /* noop */ }
  }

  function loadUnit() {
    try { return localStorage.getItem(STORAGE_KEYS.unit); } catch (e) { return null; }
  }

  /* ===================== API FUNCTIONS ===================== */

  /**
   * Open-Meteo Geocoding API — turns a typed city name into candidate
   * locations with latitude/longitude.
   */
  async function geocodeCity(query) {
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("geocode-failed");
    const data = await res.json();
    return data.results || [];
  }

  /**
   * Open-Meteo Forecast API — the main weather call. Given coordinates,
   * returns current conditions + hourly + 7-day daily data, all in the
   * location's own timezone (timezone=auto).
   */
  async function fetchWeather(latitude, longitude) {
    const url = new URL(FORECAST_URL);
    url.searchParams.set("latitude", latitude);
    url.searchParams.set("longitude", longitude);
    url.searchParams.set("current", FORECAST_PARAMS.current);
    url.searchParams.set("hourly", FORECAST_PARAMS.hourly);
    url.searchParams.set("daily", FORECAST_PARAMS.daily);
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", "7");

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("forecast-failed");
    return res.json();
  }

  /**
   * BigDataCloud reverse geocoding — the only non-Open-Meteo endpoint.
   * Used solely for "Use my location" to turn raw coordinates into a
   * readable city / country label.
   */
  async function reverseGeocode(latitude, longitude) {
    const url = `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("reverse-geocode-failed");
    const data = await res.json();
    return {
      name: data.city || data.locality || data.principalSubdivision || "Current location",
      country: data.countryName || "",
    };
  }

  /* ===================== STATUS / LOADING UI ===================== */

  function showLoading(message = "Fetching weather data…") {
    dom.dashboard.hidden = true;
    dom.statusPanel.hidden = false;
    dom.loader.hidden = false;
    dom.statusText.textContent = message;
    dom.statusRetry.hidden = true;
  }

  function showError(message, retryFn) {
    dom.dashboard.hidden = true;
    dom.statusPanel.hidden = false;
    dom.loader.hidden = true;
    dom.statusText.textContent = message;
    if (retryFn) {
      dom.statusRetry.hidden = false;
      dom.statusRetry.onclick = retryFn;
    } else {
      dom.statusRetry.hidden = true;
    }
  }

  function showDashboard() {
    dom.statusPanel.hidden = true;
    dom.dashboard.hidden = false;
  }

  /* ===================== RENDERING ===================== */

  function renderAll() {
    const { weather, location } = state;
    if (!weather || !location) return;

    const timeZone = weather.timezone;
    const current = weather.current;
    const conditionInfo = describeWeatherCode(current.weather_code);

    // ---- Location ----
    dom.locationName.textContent = location.name;
    dom.locationSub.textContent = [location.admin1, location.country].filter(Boolean).join(", ");

    // ---- Clock (uses the LOCATION's timezone, not the browser's) ----
    updateClock();
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(updateClock, 30 * 1000);

    // ---- Hero temperature + condition ----
    dom.currentTemp.textContent = displayTemp(current.temperature_2m);
    dom.currentCondition.textContent = conditionInfo.text;
    dom.currentIcon.innerHTML = iconMarkup(conditionInfo.icon, current.is_day === 1);
    dom.feelsLike.textContent = `Feels like ${displayTemp(current.apparent_temperature)}°`;

    // ---- Sun arc ----
    renderSunArc(weather, timeZone);

    // ---- Quick stat chips ----
    dom.chipHumidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
    dom.chipWind.textContent = `${Math.round(current.wind_speed_10m)} km/h ${degreesToCompass(current.wind_direction_10m)}`;
    dom.chipPressure.textContent = `${Math.round(current.pressure_msl)} hPa`;
    dom.chipPrecip.textContent = `${current.precipitation ?? 0} mm`;

    // ---- Hourly ----
    renderHourly(weather, timeZone);

    // ---- Daily ----
    renderDaily(weather, timeZone);

    // ---- Details panel ----
    renderDetails(weather, timeZone);

    // ---- Footer ----
    dom.lastUpdated.textContent = `Updated ${formatTimeInZone(new Date().toISOString(), timeZone)}`;

    showDashboard();
  }

  function updateClock() {
    if (!state.weather) return;
    const timeZone = state.weather.timezone;
    const now = new Date();
    dom.currentTime.textContent = formatTimeInZone(now.toISOString(), timeZone);
    dom.currentDate.textContent = formatDateInZone(now, timeZone);
  }

  /** Signature element: draws current-time progress along the sunrise → sunset arc. */
  function renderSunArc(weather, timeZone) {
    const sunrise = weather.daily.sunrise[0];
    const sunset = weather.daily.sunset[0];

    dom.sunriseTime.textContent = formatTimeInZone(sunrise, timeZone);
    dom.sunsetTime.textContent = formatTimeInZone(sunset, timeZone);

    const toMinutes = (iso) => {
      const d = new Date(iso);
      // Minutes since local midnight, computed via the zone's own hour/minute parts.
      const parts = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: false, timeZone,
      }).formatToParts(d);
      const map = {};
      parts.forEach(p => (map[p.type] = p.value));
      return Number(map.hour) * 60 + Number(map.minute);
    };

    const sunriseMin = toMinutes(sunrise);
    const sunsetMin = toMinutes(sunset);
    const nowParts = nowInZone(timeZone);
    const nowMin = nowParts.hour * 60 + nowParts.minute;

    let progress = (nowMin - sunriseMin) / (sunsetMin - sunriseMin);
    progress = Math.max(0, Math.min(1, progress));

    // Path is a semicircle from (14,118) to (206,118), radius 96, center (110,118)
    const cx = 110, cy = 118, r = 96;
    const angle = Math.PI - progress * Math.PI; // PI (left) → 0 (right)
    const x = cx + r * Math.cos(angle);
    const y = cy - r * Math.sin(angle);
    dom.sunArcMarker.setAttribute("cx", x.toFixed(1));
    dom.sunArcMarker.setAttribute("cy", y.toFixed(1));

    // Before sunrise or after sunset, dim the marker rather than hide it.
    const isDaytime = nowMin >= sunriseMin && nowMin <= sunsetMin;
    dom.sunArcMarker.style.opacity = isDaytime ? "1" : "0.35";
  }

  function renderHourly(weather, timeZone) {
    const { time, temperature_2m, precipitation_probability, weather_code } = weather.hourly;

    // Find the index closest to "now" so we start the strip from the current hour.
    const nowMs = Date.now();
    let startIdx = 0;
    let smallestDiff = Infinity;
    time.forEach((t, i) => {
      const diff = Math.abs(new Date(t).getTime() - nowMs);
      if (diff < smallestDiff) { smallestDiff = diff; startIdx = i; }
    });

    const slice = [];
    for (let i = startIdx; i < Math.min(startIdx + 24, time.length); i++) slice.push(i);

    dom.hourlyScroll.innerHTML = "";
    slice.forEach((idx, order) => {
      const label = idx === startIdx ? "Now" : formatHourLabel(time[idx], timeZone);
      const info = describeWeatherCode(weather_code[idx]);
      const isDay = new Date(time[idx]).getUTCHours(); // rough day/night fallback
      const card = document.createElement("div");
      card.className = "hour-card reveal";
      card.style.animationDelay = `${Math.min(order * 20, 300)}ms`;
      card.innerHTML = `
        <span class="hour-card__time">${label}</span>
        <span class="weather-icon weather-icon--sm">${iconMarkup(info.icon, true)}</span>
        <span class="hour-card__temp">${displayTemp(temperature_2m[idx])}°</span>
        <span class="hour-card__precip">${precipitation_probability?.[idx] ?? 0}%</span>
      `;
      dom.hourlyScroll.appendChild(card);
    });
  }

  function renderDaily(weather, timeZone) {
    const { time, weather_code, temperature_2m_max, temperature_2m_min, precipitation_probability_max } = weather.daily;
    dom.dailyList.innerHTML = "";

    time.forEach((date, i) => {
      const info = describeWeatherCode(weather_code[i]);
      const li = document.createElement("li");
      li.className = "reveal";
      li.style.animationDelay = `${i * 25}ms`;
      li.innerHTML = `
        <div class="daily-day">${i === 0 ? "Today" : formatDayShort(date, timeZone)}<span>${formatDayNum(date, timeZone)}</span></div>
        <div class="weather-icon weather-icon--md">${iconMarkup(info.icon, true)}</div>
        <div>
          <div class="daily-cond">${info.text}</div>
          <div class="daily-precip">Precip ${precipitation_probability_max?.[i] ?? 0}%</div>
        </div>
        <div class="daily-temps"><span class="max">${displayTemp(temperature_2m_max[i])}°</span> / <span class="min">${displayTemp(temperature_2m_min[i])}°</span></div>
      `;
      dom.dailyList.appendChild(li);
    });
  }

  function renderDetails(weather, timeZone) {
    const current = weather.current;
    const daily = weather.daily;

    // Visibility comes from the hourly array; use the entry matching "now".
    let visibility = null;
    const hIdx = weather.hourly.time.findIndex(t => new Date(t) >= new Date());
    if (weather.hourly.visibility && hIdx !== -1) {
      visibility = weather.hourly.visibility[hIdx];
    }

    const rows = [
      { label: "Cloud cover", value: `${Math.round(current.cloud_cover)}%` },
      { label: "UV index", value: daily.uv_index_max?.[0] != null ? daily.uv_index_max[0].toFixed(1) : "—" },
      { label: "Visibility", value: visibility != null ? `${(visibility / 1000).toFixed(1)} km` : "—" },
      { label: "Sunrise", value: formatTimeInZone(daily.sunrise[0], timeZone) },
      { label: "Sunset", value: formatTimeInZone(daily.sunset[0], timeZone) },
      { label: "Wind direction", value: degreesToCompass(current.wind_direction_10m) },
    ];

    dom.detailsList.innerHTML = rows
      .map(r => `<li><span class="detail-label">${r.label}</span><span class="detail-value">${r.value}</span></li>`)
      .join("");
  }

  /* ===================== UNIT SWITCH (no re-fetch; convert locally) ===================== */

  function setUnit(unit) {
    if (state.unit === unit) return;
    state.unit = unit;
    saveUnit(unit);
    dom.unitC.classList.toggle("is-active", unit === "C");
    dom.unitC.setAttribute("aria-pressed", String(unit === "C"));
    dom.unitF.classList.toggle("is-active", unit === "F");
    dom.unitF.setAttribute("aria-pressed", String(unit === "F"));
    if (state.weather) renderAll(); // re-render from the already-fetched °C data — no network call
  }

  /* ===================== LOAD LOCATION FLOW ===================== */

  async function loadLocation(location, { persist = true } = {}) {
    state.location = location;
    showLoading(`Fetching weather for ${location.name}…`);
    try {
      const weather = await fetchWeather(location.latitude, location.longitude);
      state.weather = weather;
      if (persist) saveLastLocation(location);
      renderAll();
    } catch (err) {
      showError("Weather data is currently unavailable. Please try again.", () => loadLocation(location, { persist }));
    }
  }

  async function handleCitySearch(query) {
    if (!query || !query.trim()) return;
    closeSearchResults();
    showLoading("Searching for location…");
    try {
      const results = await geocodeCity(query.trim());
      if (!results.length) {
        showError("Couldn't find that location. Try a different search.", null);
        return;
      }
      const top = results[0];
      await loadLocation({
        latitude: top.latitude,
        longitude: top.longitude,
        name: top.name,
        admin1: top.admin1,
        country: top.country,
      });
    } catch (err) {
      showError("Network error. Please check your connection and try again.", () => handleCitySearch(query));
    }
  }

  async function handleUseMyLocation() {
    if (!("geolocation" in navigator)) {
      showError("Your browser doesn't support location detection. Please search for a city instead.", null);
      return;
    }
    dom.locateBtn.disabled = true;
    showLoading("Detecting your location…");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const place = await reverseGeocode(latitude, longitude);
          await loadLocation({
            latitude, longitude,
            name: place.name,
            admin1: "",
            country: place.country,
          });
        } catch (err) {
          // Reverse geocoding failed, but we still have coordinates — show weather anyway.
          await loadLocation({
            latitude, longitude,
            name: "Current location",
            admin1: "",
            country: "",
          });
        } finally {
          dom.locateBtn.disabled = false;
        }
      },
      (error) => {
        dom.locateBtn.disabled = false;
        const message = error.code === error.PERMISSION_DENIED
          ? "Location permission denied. You can still search for a city above."
          : "Couldn't detect your location. Please search for a city instead.";
        showError(message, null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }

  /* ===================== SEARCH DROPDOWN (type-ahead) ===================== */

  function closeSearchResults() {
    dom.searchResults.hidden = true;
    dom.searchResults.innerHTML = "";
  }

  async function updateSearchDropdown(query) {
    if (!query || query.trim().length < 2) {
      closeSearchResults();
      return;
    }
    try {
      const results = await geocodeCity(query.trim());
      if (!results.length) {
        closeSearchResults();
        return;
      }
      dom.searchResults.innerHTML = results.map((r, i) => `
        <li>
          <button type="button" data-idx="${i}">
            <span>${r.name}${r.admin1 ? ", " + r.admin1 : ""}</span>
            <span class="result-sub">${r.country || ""}</span>
          </button>
        </li>
      `).join("");
      dom.searchResults.hidden = false;

      dom.searchResults.querySelectorAll("button").forEach((btn, i) => {
        btn.addEventListener("click", () => {
          const r = results[i];
          dom.searchInput.value = r.name;
          closeSearchResults();
          loadLocation({
            latitude: r.latitude,
            longitude: r.longitude,
            name: r.name,
            admin1: r.admin1,
            country: r.country,
          });
        });
      });
    } catch (err) {
      closeSearchResults();
    }
  }

  /* ===================== EVENT LISTENERS ===================== */

  dom.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleCitySearch(dom.searchInput.value);
  });

  dom.searchInput.addEventListener("input", debounce((e) => {
    updateSearchDropdown(e.target.value);
  }, 350));

  dom.searchInput.addEventListener("focus", () => {
    if (dom.searchInput.value.trim().length >= 2) updateSearchDropdown(dom.searchInput.value);
  });

  document.addEventListener("click", (e) => {
    if (!dom.searchResults.contains(e.target) && e.target !== dom.searchInput) {
      closeSearchResults();
    }
  });

  dom.searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearchResults();
  });

  dom.locateBtn.addEventListener("click", handleUseMyLocation);

  dom.refreshBtn.addEventListener("click", async () => {
    if (!state.location) return;
    dom.refreshBtn.classList.add("is-spinning");
    try {
      const weather = await fetchWeather(state.location.latitude, state.location.longitude);
      state.weather = weather;
      renderAll();
    } catch (err) {
      showError("Couldn't refresh weather data. Please try again.", () => dom.refreshBtn.click());
    } finally {
      dom.refreshBtn.classList.remove("is-spinning");
    }
  });

  dom.unitC.addEventListener("click", () => setUnit("C"));
  dom.unitF.addEventListener("click", () => setUnit("F"));

  /* ===================== INIT ===================== */

  function init() {
    const savedUnit = loadUnit();
    if (savedUnit === "F") setUnit("F");

    const lastLocation = loadLastLocation();
    if (lastLocation) {
      loadLocation(lastLocation, { persist: false });
    } else {
      // Sensible default on first visit: Manila, Philippines.
      loadLocation({
        latitude: 14.5995,
        longitude: 120.9842,
        name: "Manila",
        admin1: "",
        country: "Philippines",
      });
    }
  }

  init();
})();
