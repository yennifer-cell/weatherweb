export default function SearchBar({
  value,
  onChange,
  onSubmit,
  loading,
  recentLocations,
  onSelectLocation,
  onUseCurrentLocation,
}) {
  return (
    <div className="search-tools">
      <form className="search-form" onSubmit={onSubmit} aria-busy={loading}>
        <label htmlFor="city-search" className="sr-only">
          Search for a city
        </label>
        <input
          id="city-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search for a city"
          autoComplete="off"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Check weather'}
        </button>
      </form>

      <button
        className="location-button"
        type="button"
        onClick={onUseCurrentLocation}
        disabled={loading}
      >
        Use my location
      </button>

      {recentLocations.length > 0 && (
        <div className="recent-locations" aria-label="Recent locations">
          <span>Recent</span>
          {recentLocations.map((location) => (
            <button
              key={`${location.latitude},${location.longitude}`}
              type="button"
              onClick={() => onSelectLocation(location)}
              disabled={loading}
              title={[location.admin1, location.country].filter(Boolean).join(', ')}
            >
              {location.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
