// OpenWeatherMap Implementation - Good balance + reliability
import { Platform } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// CORS proxy for web
const CORS_PROXY = Platform.OS === 'web' ? 'https://api.allorigins.win/raw?url=' : '';

function getApiUrl(endpoint: string): string {
  const url = endpoint;
  return Platform.OS === 'web' ? `${CORS_PROXY}${encodeURIComponent(url)}` : url;
}

export interface OpenWeatherLocation {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface OpenWeatherCurrentConditions {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface OpenWeatherForecastDay {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}

export interface OpenWeatherHourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number;
  rain?: { '1h': number };
  snow?: { '1h': number };
}

// Search locations using Geocoding API
export async function searchLocationOpenWeather(query: string): Promise<OpenWeatherLocation[]> {
  try {
    const endpoint = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to search location: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('OpenWeather search error:', error);
    throw error;
  }
}

// Get location by coordinates
export async function getLocationByCoordinatesOpenWeather(lat: number, lon: number): Promise<OpenWeatherLocation[]> {
  try {
    const endpoint = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to get location: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('OpenWeather reverse geocoding error:', error);
    throw error;
  }
}

// Get current weather
export async function getCurrentWeatherOpenWeather(lat: number, lon: number): Promise<OpenWeatherCurrentConditions> {
  try {
    const endpoint = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to get current weather: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('OpenWeather current weather error:', error);
    throw error;
  }
}

// Get One Call API (current + forecast + hourly)
export async function getOneCallOpenWeather(lat: number, lon: number): Promise<{
  current: OpenWeatherCurrentConditions;
  hourly: OpenWeatherHourlyForecast[];
  daily: OpenWeatherForecastDay[];
  alerts?: Array<{
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
  }>;
}> {
  try {
    const endpoint = `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial&exclude=minutely`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to get weather data: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('OpenWeather One Call error:', error);
    throw error;
  }
}

// Get Air Quality
export async function getAirQualityOpenWeather(lat: number, lon: number): Promise<{
  coord: { lon: number; lat: number };
  list: Array<{
    dt: number;
    main: { aqi: number };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}> {
  try {
    const endpoint = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to get air quality: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('OpenWeather air quality error:', error);
    throw error;
  }
}

// Convert OpenWeatherMap data to your app's format
export function convertOpenWeatherToAppFormat(location: OpenWeatherLocation, oneCallData: any) {
  const current = oneCallData.current;
  
  return {
    locationKey: `${location.lat},${location.lon}`,
    location: {
      Key: `${location.lat},${location.lon}`,
      LocalizedName: location.name,
      Country: { LocalizedName: location.country },
      AdministrativeArea: { LocalizedName: location.state || '' },
      GeoPosition: {
        Latitude: location.lat,
        Longitude: location.lon
      }
    },
    currentWeather: {
      WeatherText: current.weather[0].description,
      WeatherIcon: getOpenWeatherIcon(current.weather[0].id),
      Temperature: {
        Metric: { Value: fahrenheitToCelsius(current.temp), Unit: 'C' },
        Imperial: { Value: current.temp, Unit: 'F' }
      },
      RelativeHumidity: current.humidity,
      Wind: {
        Speed: {
          Metric: { Value: mphToKmh(current.wind_speed), Unit: 'km/h' },
          Imperial: { Value: current.wind_speed, Unit: 'mph' }
        },
        Direction: {
          Degrees: current.wind_deg,
          Localized: getWindDirection(current.wind_deg),
          English: getWindDirection(current.wind_deg)
        }
      },
      WindGust: current.wind_gust ? {
        Speed: {
          Metric: { Value: mphToKmh(current.wind_gust), Unit: 'km/h' },
          Imperial: { Value: current.wind_gust, Unit: 'mph' }
        }
      } : undefined,
      Visibility: {
        Metric: { Value: metersToKm(current.visibility), Unit: 'km' },
        Imperial: { Value: metersToMiles(current.visibility), Unit: 'mi' }
      },
      RealFeelTemperature: {
        Metric: { Value: fahrenheitToCelsius(current.feels_like), Unit: 'C' },
        Imperial: { Value: current.feels_like, Unit: 'F' }
      },
      Pressure: {
        Metric: { Value: current.pressure, Unit: 'mb' },
        Imperial: { Value: mbToInHg(current.pressure), Unit: 'inHg' }
      },
      DewPoint: {
        Metric: { Value: fahrenheitToCelsius(current.dew_point), Unit: 'C' },
        Imperial: { Value: current.dew_point, Unit: 'F' }
      },
      UVIndex: current.uvi,
      UVIndexText: getUVIndexText(current.uvi)
    },
    forecast: oneCallData.daily.slice(0, 5).map((day: OpenWeatherForecastDay) => ({
      Date: new Date(day.dt * 1000).toISOString().split('T')[0],
      Temperature: {
        Minimum: { Value: day.temp.min, Unit: 'F' },
        Maximum: { Value: day.temp.max, Unit: 'F' }
      },
      Day: { 
        Icon: getOpenWeatherIcon(day.weather[0].id), 
        IconPhrase: day.weather[0].description 
      }
    })),
    hourlyForecast: oneCallData.hourly.slice(0, 24).map((hour: OpenWeatherHourlyForecast) => ({
      DateTime: new Date(hour.dt * 1000).toISOString(),
      EpochDateTime: hour.dt,
      WeatherIcon: getOpenWeatherIcon(hour.weather[0].id),
      IconPhrase: hour.weather[0].description,
      Temperature: {
        Value: hour.temp,
        Unit: 'F'
      },
      PrecipitationProbability: Math.round(hour.pop * 100),
      Wind: {
        Speed: {
          Value: hour.wind_speed,
          Unit: 'mph'
        }
      },
      RelativeHumidity: hour.humidity
    })),
    alerts: oneCallData.alerts || []
  };
}

// Helper functions
function fahrenheitToCelsius(f: number): number {
  return Math.round((f - 32) * 5/9);
}

function mphToKmh(mph: number): number {
  return Math.round(mph * 1.60934);
}

function metersToKm(meters: number): number {
  return Math.round(meters / 1000);
}

function metersToMiles(meters: number): number {
  return Math.round(meters * 0.000621371);
}

function mbToInHg(mb: number): number {
  return Math.round(mb * 0.02953 * 100) / 100;
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
}

function getOpenWeatherIcon(weatherId: number): number {
  // Map OpenWeather condition IDs to AccuWeather-style icon numbers
  const iconMap: { [key: number]: number } = {
    // Clear sky
    800: 1,
    // Few clouds
    801: 2,
    // Scattered clouds
    802: 3,
    // Broken clouds
    803: 4,
    // Overcast clouds
    804: 8,
    // Mist, smoke, haze, dust, fog, sand, ash
    701: 11, 711: 11, 721: 11, 731: 11, 741: 11, 751: 11, 761: 11, 762: 11, 771: 11, 781: 11,
    // Light rain
    500: 12, 501: 12, 502: 12, 503: 12, 504: 12,
    // Drizzle
    300: 12, 301: 12, 302: 12, 310: 12, 311: 12, 312: 12, 313: 12, 314: 12, 321: 12,
    // Rain
    520: 12, 521: 12, 522: 12, 531: 12,
    // Thunderstorm
    200: 15, 201: 15, 202: 15, 210: 15, 211: 15, 212: 15, 221: 15, 230: 15, 231: 15, 232: 15,
    // Snow
    600: 19, 601: 20, 602: 22, 611: 19, 612: 19, 613: 19, 615: 19, 616: 19, 620: 19, 621: 20, 622: 22
  };
  
  return iconMap[weatherId] || 1;
}

function getUVIndexText(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}