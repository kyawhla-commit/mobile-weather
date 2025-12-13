// WeatherAPI.com Implementation - Low cost + easy integration
import { Platform } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_WEATHERAPI_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

// CORS proxy for web
const CORS_PROXY = Platform.OS === 'web' ? 'https://api.allorigins.win/raw?url=' : '';

function getApiUrl(endpoint: string): string {
  const url = `${BASE_URL}${endpoint}`;
  return Platform.OS === 'web' ? `${CORS_PROXY}${encodeURIComponent(url)}` : url;
}

export interface WeatherAPILocation {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export interface WeatherAPICurrentConditions {
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface WeatherAPIForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
  };
  hour: Array<{
    time: string;
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    uv: number;
  }>;
}

// Search locations
export async function searchLocationWeatherAPI(query: string): Promise<WeatherAPILocation[]> {
  try {
    const endpoint = `/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to search location: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('WeatherAPI search error:', error);
    throw error;
  }
}

// Get current weather
export async function getCurrentWeatherAPI(location: string): Promise<{
  location: WeatherAPILocation;
  current: WeatherAPICurrentConditions;
}> {
  try {
    const endpoint = `/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to get current weather: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('WeatherAPI current weather error:', error);
    throw error;
  }
}

// Get forecast
export async function getForecastWeatherAPI(location: string, days: number = 5): Promise<{
  location: WeatherAPILocation;
  current: WeatherAPICurrentConditions;
  forecast: {
    forecastday: WeatherAPIForecastDay[];
  };
}> {
  try {
    const endpoint = `/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=${days}&aqi=yes&alerts=yes`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to get forecast: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('WeatherAPI forecast error:', error);
    throw error;
  }
}

// Convert WeatherAPI data to your app's format
export function convertWeatherAPIToAppFormat(data: any) {
  return {
    locationKey: `${data.location.lat},${data.location.lon}`,
    currentWeather: {
      WeatherText: data.current.condition.text,
      WeatherIcon: data.current.condition.code,
      Temperature: {
        Metric: { Value: data.current.temp_c, Unit: 'C' },
        Imperial: { Value: data.current.temp_f, Unit: 'F' }
      },
      RelativeHumidity: data.current.humidity,
      Wind: {
        Speed: {
          Metric: { Value: data.current.wind_kph, Unit: 'km/h' },
          Imperial: { Value: data.current.wind_mph, Unit: 'mph' }
        },
        Direction: {
          Degrees: data.current.wind_degree,
          Localized: data.current.wind_dir,
          English: data.current.wind_dir
        }
      },
      Visibility: {
        Metric: { Value: data.current.vis_km, Unit: 'km' },
        Imperial: { Value: data.current.vis_miles, Unit: 'mi' }
      },
      RealFeelTemperature: {
        Metric: { Value: data.current.feelslike_c, Unit: 'C' },
        Imperial: { Value: data.current.feelslike_f, Unit: 'F' }
      },
      Pressure: {
        Metric: { Value: data.current.pressure_mb, Unit: 'mb' },
        Imperial: { Value: data.current.pressure_in, Unit: 'in' }
      },
      UVIndex: data.current.uv,
      UVIndexText: getUVIndexText(data.current.uv)
    },
    forecast: data.forecast.forecastday.map((day: any) => ({
      Date: day.date,
      Temperature: {
        Minimum: { Value: day.day.mintemp_f, Unit: 'F' },
        Maximum: { Value: day.day.maxtemp_f, Unit: 'F' }
      },
      Day: { 
        Icon: day.day.condition.code, 
        IconPhrase: day.day.condition.text 
      }
    }))
  };
}

function getUVIndexText(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}