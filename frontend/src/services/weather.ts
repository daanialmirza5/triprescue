export interface WeatherSnapshot {
  temperature: number;
  precipitationProbability: number;
  windSpeed: number;
  weatherCode: number;
  label: string;
  fetchedAt: string;
}

const cache = new Map<string, { value: WeatherSnapshot; expires: number }>();

function weatherLabel(code: number) {
  if (code === 0) return 'Clear sky';
  if ([1, 2].includes(code)) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Light rain';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain showers';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Changing conditions';
}

export async function getWeather(lat: number, lng: number, date?: string): Promise<WeatherSnapshot> {
  const day = date || new Date().toISOString().slice(0, 10);
  const key = `${lat.toFixed(2)},${lng.toFixed(2)},${day}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.value;
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lng));
  url.searchParams.set('hourly', 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m');
  url.searchParams.set('forecast_days', '3');
  url.searchParams.set('timezone', 'auto');
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Weather service unavailable');
  const data = await response.json() as { hourly: { temperature_2m: number[]; precipitation_probability: number[]; weather_code: number[]; wind_speed_10m: number[] } };
  const index = 0;
  const value: WeatherSnapshot = {
    temperature: Math.round(data.hourly.temperature_2m[index] ?? 0),
    precipitationProbability: Math.round(data.hourly.precipitation_probability[index] ?? 0),
    windSpeed: Math.round(data.hourly.wind_speed_10m[index] ?? 0),
    weatherCode: data.hourly.weather_code[index] ?? 0,
    label: weatherLabel(data.hourly.weather_code[index] ?? 0),
    fetchedAt: new Date().toISOString(),
  };
  cache.set(key, { value, expires: Date.now() + 10 * 60 * 1000 });
  return value;
}
