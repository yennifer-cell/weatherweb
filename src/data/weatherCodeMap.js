export const weatherCodeMap = {
  0: { label: 'Clear sky', tip: 'A bright day—great for a walk or outdoor plans.' },
  1: { label: 'Mostly clear', tip: 'Light sunshine with a few clouds overhead.' },
  2: { label: 'Partly cloudy', tip: 'Clouds may drift in, but conditions stay mild.' },
  3: { label: 'Cloudy', tip: 'A softer, dimmer sky—keep your jacket nearby.' },
  45: { label: 'Foggy', tip: 'Low visibility today, so plan extra travel time.' },
  48: { label: 'Rime fog', tip: 'Cold air and fog may make the morning slippery.' },
  51: { label: 'Light drizzle', tip: 'A light shower is possible—keep an umbrella handy.' },
  53: { label: 'Drizzle', tip: 'Expect a damp stretch with occasional small showers.' },
  55: { label: 'Heavy drizzle', tip: 'Rain is steady enough to warrant a rain layer.' },
  56: { label: 'Freezing drizzle', tip: 'Cold rain may create icy surfaces.' },
  57: { label: 'Heavy freezing drizzle', tip: 'Travel carefully in slick conditions.' },
  61: { label: 'Light rain', tip: 'An umbrella is useful for short outdoor errands.' },
  63: { label: 'Rain', tip: 'Rain is likely through the day—stay prepared.' },
  65: { label: 'Heavy rain', tip: 'A wet afternoon is on the way; wear waterproof gear.' },
  66: { label: 'Freezing rain', tip: 'Rain may freeze on contact—be cautious outdoors.' },
  67: { label: 'Heavy freezing rain', tip: 'Hazardous conditions may affect travel or commuting.' },
  71: { label: 'Light snow', tip: 'A chilly, wintry feel is moving in.' },
  73: { label: 'Snow', tip: 'Snowfall is expected—bundle up and plan ahead.' },
  75: { label: 'Heavy snow', tip: 'Roads and sidewalks may become slick quickly.' },
  77: { label: 'Snow grains', tip: 'Light snow is drifting through the air.' },
  80: { label: 'Rain showers', tip: 'Quick bursts of rain are possible this afternoon.' },
  81: { label: 'Heavy rain showers', tip: 'Strong bursts of rain may come in waves.' },
  82: { label: 'Violent rain showers', tip: 'Stormy downpours may hit with little warning.' },
  85: { label: 'Snow showers', tip: 'Flurries may pop up around the area.' },
  86: { label: 'Heavy snow showers', tip: 'Snow could pile up quickly in bursts.' },
  95: { label: 'Thunderstorm', tip: 'Watch the sky—thunderstorms are possible.' },
  96: { label: 'Thunderstorm with hail', tip: 'Severe conditions are possible; seek shelter if needed.' },
  99: { label: 'Severe thunderstorm', tip: 'Severe weather could bring strong wind and hail.' },
};

export function getWeatherCodeInfo(code) {
  return weatherCodeMap[code] ?? {
    label: 'Conditions unavailable',
    tip: 'Weather conditions are being updated.',
  };
}
