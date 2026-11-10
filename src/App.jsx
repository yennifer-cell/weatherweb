import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import ForecastList from './components/ForecastList.jsx';
import SearchBar from './components/SearchBar.jsx';
import WeatherSummary from './components/WeatherSummary.jsx';
import { getWeatherCodeInfo } from './data/weatherCodeMap.js';

const DEFAULT_CITY = 'Nairobi';
const RECENT_LOCATIONS_KEY = 'skyscope-recent-locations';
const MAX_RECENT_LOCATIONS = 5;

function loadRecentLocations() {
  try {
    const savedLocations = window.localStorage.getItem(RECENT_LOCATIONS_KEY);
    const locations = savedLocations ? JSON.parse(savedLocations) : [];

    return Array.isArray(locations)
      ? locations.filter((location) => (
        location
        && typeof location.name === 'string'
        && Number.isFinite(location.latitude)
        && Number.isFinite(location.longitude)
      )).slice(0, MAX_RECENT_LOCATIONS)
      : [];
  } catch (loadError) {
    console.error('Unable to load recent weather locations.', loadError);
    return [];
  }
}

function App() {
  const [query, setQuery] = useState(DEFAULT_CITY);
  const [unit, setUnit] = useState('c');
  const [weatherData, setWeatherData] = useState(null);
  const [selectedCity, setSelectedCity] = useState({ name: DEFAULT_CITY, country: 'Kenya' });
  const [recentLocations, setRecentLocations] = useState(loadRecentLocations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestController = useRef(null);

  const fetchWeatherForLocation = useCallback(async (location) => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setLoading(true);
    setError('');

    try {
      let city = location;

      if (typeof location === 'string') {
        const trimmedLocation = location.trim();
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedLocation)}&count=1&language=en&format=json`,
          { signal: controller.signal },
        );

        if (!geoResponse.ok) {
          throw new Error('City search is unavailable right now. Please try again.');
        }

        const geoData = await geoResponse.json();
        city = geoData.results?.[0];

        if (!city) {
          throw new Error(`No weather data found for "${trimmedLocation}". Try another city.`);
        }
      }

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=5`,
        { signal: controller.signal },
      );

      if (!weatherResponse.ok) {
        throw new Error('The forecast could not be loaded.');
      }

      const forecast = await weatherResponse.json();
      const current = forecast.current;
      const currentInfo = getWeatherCodeInfo(current.weather_code);
      const currentHourIndex = forecast.hourly.time.findIndex(
        (time) => time >= current.time,
      );
      const firstUpcomingHour = Math.max(currentHourIndex, 0);

      setSelectedCity({
        name: city.name ?? 'Your location',
        country: city.country ?? '',
        region: city.admin1 ?? '',
      });
      setQuery(city.name ?? '');
      if (city.name) {
        setRecentLocations((locations) => [
          city,
          ...locations.filter((item) => item.id !== city.id),
        ].slice(0, MAX_RECENT_LOCATIONS));
      }
      setWeatherData({
        currentTime: current.time,
        timezone: forecast.timezone,
        currentTemp: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        precipitation: current.precipitation,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        weatherLabel: currentInfo.label,
        weatherTip: currentInfo.tip,
        sunrise: forecast.daily.sunrise[0],
        sunset: forecast.daily.sunset[0],
        hourly: forecast.hourly.time.slice(firstUpcomingHour, firstUpcomingHour + 8).map((time, index) => ({
          time,
          temp: forecast.hourly.temperature_2m[firstUpcomingHour + index],
          code: forecast.hourly.weather_code[firstUpcomingHour + index],
        })),
        daily: forecast.daily.time.slice(0, 5).map((day, index) => ({
          date: day,
          max: forecast.daily.temperature_2m_max[index],
          min: forecast.daily.temperature_2m_min[index],
          code: forecast.daily.weather_code[index],
        })),
      });
    } catch (err) {
      if (controller.signal.aborted || requestController.current !== controller) {
        return;
      }

      setError(err instanceof Error ? err.message : 'Could not load the latest weather data.');
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(recentLocations));
    } catch (saveError) {
      console.error('Unable to save recent weather locations.', saveError);
    }
  }, [recentLocations]);

  useEffect(() => {
    void fetchWeatherForLocation(DEFAULT_CITY);

    return () => {
      requestController.current?.abort();
      requestController.current = null;
    };
  }, [fetchWeatherForLocation]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading) return;

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a city name to search for the weather.');
      return;
    }

    void fetchWeatherForLocation(trimmedQuery);
  };

  const handleUseCurrentLocation = () => {
    if (loading) return;
    if (!navigator.geolocation) {
      setError('Location access is not available in this browser.');
      return;
    }

    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        void fetchWeatherForLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      (locationError) => {
        const messages = {
          1: 'Allow location access in your browser to see nearby weather.',
          2: 'Your location could not be determined. Try searching for a city instead.',
          3: 'Location lookup took too long. Please try again.',
        };
        setError(messages[locationError.code] ?? 'Could not get your location. Please try again.');
        setLoading(false);
      },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
    );
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">☀️</span>
          <span>SkyScope</span>
        </div>
        <nav className="nav-links">
          <a href="#weather">Live</a>
          <a href="#forecast">Forecast</a>
        </nav>
      </header>

      <main className="weather-app" id="weather">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Hi there, welcome to SkyScope</p>
            <h1>Check the weather in your city.</h1>
            <p>
              Search for a place to see current conditions and the forecast for the next five days.
            </p>
          </div>

          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
            loading={loading}
            recentLocations={recentLocations}
            onSelectLocation={fetchWeatherForLocation}
            onUseCurrentLocation={handleUseCurrentLocation}
          />
        </section>

        {loading && (
          <div className="status-card loading" role="status" aria-live="polite">
            Loading the latest forecast…
          </div>
        )}

        {error && <div className="status-card error" role="alert">{error}</div>}

        {weatherData && (
          <>
            <WeatherSummary
              city={selectedCity}
              weatherData={weatherData}
              unit={unit}
              onToggleUnit={setUnit}
            />

            <ForecastList
              dailyForecast={weatherData.daily}
              hourlyForecast={weatherData.hourly}
              unit={unit}
              timezone={weatherData.timezone}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
