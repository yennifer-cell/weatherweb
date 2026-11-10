import { getWeatherCodeInfo } from '../data/weatherCodeMap.js';

function formatTemperature(value, unit) {
  const converted = unit === 'f' ? (value * 9) / 5 + 32 : value;
  return `${Math.round(converted)}°${unit.toUpperCase()}`;
}

export default function WeatherSummary({ city, weatherData, unit, onToggleUnit }) {
  if (!weatherData) return null;

  const currentCode = getWeatherCodeInfo(weatherData.weatherCode);
  const formatLocalTime = (value) => {
    if (!value) return 'Unavailable';

    const time = value.slice(11, 16);
    const [hour, minute] = time.split(':').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2020, 0, 1, hour, minute)));
  };

  return (
    <section className="weather-summary" aria-labelledby="current-weather-heading">
      <div className="summary-header">
        <div>
          <p className="eyebrow">Now in {city.name}</p>
          <h2 id="current-weather-heading">
            {[city.name, city.country].filter(Boolean).join(', ')}
          </h2>
          {city.region && <p className="location-region">{city.region}</p>}
        </div>

        <div className="unit-toggle" role="group" aria-label="Temperature units">
          <button
            type="button"
            className={unit === 'c' ? 'active' : ''}
            onClick={() => onToggleUnit('c')}
            aria-label="Display temperature in Celsius"
            aria-pressed={unit === 'c'}
          >
            °C
          </button>
          <button
            type="button"
            className={unit === 'f' ? 'active' : ''}
            onClick={() => onToggleUnit('f')}
            aria-label="Display temperature in Fahrenheit"
            aria-pressed={unit === 'f'}
          >
            °F
          </button>
        </div>
      </div>

      <p className="updated-at">
        Local time: {formatLocalTime(weatherData.currentTime)} ({weatherData.timezone})
      </p>

      <div className="current-weather">
        <div className="temperature-block">
          <div>
            <div className="temperature-large">
              {formatTemperature(weatherData.currentTemp, unit)}
            </div>
            <div className="condition-label">{currentCode.label}</div>
          </div>
        </div>

        <div className="insight-pill">{currentCode.tip}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Feels like</span>
          <strong>{formatTemperature(weatherData.feelsLike, unit)}</strong>
        </div>
        <div className="stat-card">
          <span>Humidity</span>
          <strong>{weatherData.humidity}%</strong>
        </div>
        <div className="stat-card">
          <span>Wind</span>
          <strong>{Math.round(weatherData.windSpeed)} km/h</strong>
        </div>
        <div className="stat-card">
          <span>Rain</span>
          <strong>{weatherData.precipitation} mm</strong>
        </div>
        <div className="stat-card">
          <span>Sunrise</span>
          <strong>{formatLocalTime(weatherData.sunrise)}</strong>
        </div>
        <div className="stat-card">
          <span>Sunset</span>
          <strong>{formatLocalTime(weatherData.sunset)}</strong>
        </div>
      </div>
    </section>
  );
}
