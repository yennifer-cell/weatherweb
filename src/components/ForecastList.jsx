import { getWeatherCodeInfo } from '../data/weatherCodeMap.js';

function formatTemperature(value, unit) {
  const converted = unit === 'f' ? (value * 9) / 5 + 32 : value;
  return `${Math.round(converted)}°${unit.toUpperCase()}`;
}

function formatDayLabel(dayString) {
  return new Date(`${dayString}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  });
}

function formatHourLabel(dateTime) {
  const [hour, minute] = dateTime.slice(11, 16).split(':').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2020, 0, 1, hour, minute)));
}

export default function ForecastList({ dailyForecast, hourlyForecast, unit, timezone }) {
  return (
    <section className="forecast-panel" id="forecast" aria-labelledby="hourly-heading">
      <div className="panel-header">
        <div>
          <h3 id="hourly-heading">Hourly outlook</h3>
          <p className="forecast-timezone">Times shown in {timezone}</p>
        </div>
      </div>
      <div className="hourly-row">
        {hourlyForecast.map((item) => {
          const codeInfo = getWeatherCodeInfo(item.code);

          return (
            <article key={item.time} className="hour-card">
              <span>{formatHourLabel(item.time)}</span>
              <strong>{formatTemperature(item.temp, unit)}</strong>
              <span>{codeInfo.label}</span>
            </article>
          );
        })}
      </div>

      <div className="panel-header next-days">
        <h3 id="daily-heading">5-day forecast</h3>
      </div>
      <div className="daily-grid">
        {dailyForecast.map((day) => {
          const codeInfo = getWeatherCodeInfo(day.code);

          return (
            <article key={day.date} className="daily-card">
              <h4>{formatDayLabel(day.date)}</h4>
              <p>{codeInfo.label}</p>
              <div className="day-range">
                <span>{formatTemperature(day.max, unit)}</span>
                <span>{formatTemperature(day.min, unit)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
