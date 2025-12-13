// Unified Weather Service - Switch between different APIs easily
import { Platform } from 'react-native';

// Import all weather API implementations
import * as AccuWeatherAPI from './weather'; // Your current AccuWeather implementation
import * as WeatherAPI from './weatherAPIs/weatherapi';
import * as OpenWeatherAPI from './weatherAPIs/openweathermap';
import * as TomorrowAPI from './weatherAPIs/tomorrow';

// Configuration - Change this to switch APIs
export type WeatherProvider = 'accuweather' | 'weatherapi' | 'openweathermap' | 'tomorrow';

// Set your preferred weather provider here
const CURRENT_PROVIDER: WeatherProvider = process.env.EXPO_PUBLIC_WEATHER_PROVIDER as WeatherProvider || 'accuweather';

console.log(`🌤️ Using weather provider: ${CURRENT_PROVIDER}`);

// Unified interfaces that all providers will return
export interface UnifiedLocation {
  key: string;
  name: string;
  country: string;
  region?: string;
  lat: number;
  lon: number;
}

export interface UnifiedCurrentWeather {
  temperature: { celsius: number; fahrenheit: number };
  feelsLike: { celsius: number; fahrenheit: number };
  humidity: number;
  windSpeed: { kmh: number; mph: number };
  windDirection: { degrees: number; text: string };
  visibility: { km: number; miles: number };
  pressure: { mb: number; inHg: number };
  uvIndex: number;
  uvText: string;
  condition: string;
  icon: string;
  dewPoint?: { celsius: number; fahrenheit: number };
}

export interface UnifiedForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  precipitationChance?: number;
}

export interface UnifiedHourlyForecast {
  dateTime: string;
  temperature: number;
  condition: string;
  icon: string;
  precipitationChance: number;
  humidity: number;
  windSpeed: number;
}

// Main weather service functions
export async function searchLocations(query: string): Promise<UnifiedLocation[]> {
  try {
    switch (CURRENT_PROVIDER) {
      case 'accuweather':
        const accuResults = await AccuWeatherAPI.searchLocation(query);
        return accuResults.map(convertAccuWeatherLocation);
      
      case 'weatherapi':
        const weatherApiResults = await WeatherAPI.searchLocationWeatherAPI(query);
        return weatherApiResults.map(convertWeatherAPILocation);
      
      case 'openweathermap':
        const owmResults = await OpenWeatherAPI.searchLocationOpenWeather(query);
        return owmResults.map(convertOpenWeatherLocation);
      
      case 'tomorrow':
        // Tomorrow.io doesn't have location search, use OpenWeather as fallback
        const fallbackResults = await OpenWeatherAPI.searchLocationOpenWeather(query);
        return fallbackResults.map(convertOpenWeatherLocation);
      
      default:
        throw new Error(`Unsupported weather provider: ${CURRENT_PROVIDER}`);
    }
  } catch (error) {
    console.error(`Error searching locations with ${CURRENT_PROVIDER}:`, error);
    throw error;
  }
}

export async function getCurrentWeather(location: UnifiedLocation): Promise<UnifiedCurrentWeather> {
  try {
    switch (CURRENT_PROVIDER) {
      case 'accuweather':
        const accuWeather = await AccuWeatherAPI.getCurrentConditions(location.key);
        return convertAccuWeatherCurrent(accuWeather);
      
      case 'weatherapi':
        const weatherApiData = await WeatherAPI.getCurrentWeatherAPI(`${location.lat},${location.lon}`);
        return convertWeatherAPICurrent(weatherApiData.current);
      
      case 'openweathermap':
        const owmData = await OpenWeatherAPI.getOneCallOpenWeather(location.lat, location.lon);
        return convertOpenWeatherCurrent(owmData.current);
      
      case 'tomorrow':
        const tomorrowData = await TomorrowAPI.getCurrentWeatherTomorrow(location.lat, location.lon);
        return convertTomorrowCurrent(tomorrowData.data.values);
      
      default:
        throw new Error(`Unsupported weather provider: ${CURRENT_PROVIDER}`);
    }
  } catch (error) {
    console.error(`Error getting current weather with ${CURRENT_PROVIDER}:`, error);
    throw error;
  }
}

export async function getForecast(location: UnifiedLocation): Promise<UnifiedForecastDay[]> {
  try {
    switch (CURRENT_PROVIDER) {
      case 'accuweather':
        const accuForecast = await AccuWeatherAPI.get5DayForecast(location.key);
        return accuForecast.map(convertAccuWeatherForecast);
      
      case 'weatherapi':
        const weatherApiForecast = await WeatherAPI.getForecastWeatherAPI(`${location.lat},${location.lon}`, 5);
        return weatherApiForecast.forecast.forecastday.map(convertWeatherAPIForecast);
      
      case 'openweathermap':
        const owmForecast = await OpenWeatherAPI.getOneCallOpenWeather(location.lat, location.lon);
        return owmForecast.daily.slice(0, 5).map(convertOpenWeatherForecast);
      
      case 'tomorrow':
        const tomorrowForecast = await TomorrowAPI.getForecastTomorrow(location.lat, location.lon, 'daily');
        return tomorrowForecast.timelines[0].intervals.slice(0, 5).map(convertTomorrowForecast);
      
      default:
        throw new Error(`Unsupported weather provider: ${CURRENT_PROVIDER}`);
    }
  } catch (error) {
    console.error(`Error getting forecast with ${CURRENT_PROVIDER}:`, error);
    throw error;
  }
}

export async function getHourlyForecast(location: UnifiedLocation): Promise<UnifiedHourlyForecast[]> {
  try {
    switch (CURRENT_PROVIDER) {
      case 'accuweather':
        // Use 12-hour forecast (24-hour not available on free plan)
        const { get12HourForecast } = await import('./weather');
        const accuHourly = await get12HourForecast(location.key);
        return accuHourly.map(convertAccuWeatherHourly);
      
      case 'weatherapi':
        const weatherApiHourly = await WeatherAPI.getForecastWeatherAPI(`${location.lat},${location.lon}`, 2);
        const allHours = weatherApiHourly.forecast.forecastday.flatMap(day => day.hour);
        return allHours.slice(0, 24).map(convertWeatherAPIHourly);
      
      case 'openweathermap':
        const owmHourly = await OpenWeatherAPI.getOneCallOpenWeather(location.lat, location.lon);
        return owmHourly.hourly.slice(0, 24).map(convertOpenWeatherHourly);
      
      case 'tomorrow':
        const tomorrowHourly = await TomorrowAPI.getForecastTomorrow(location.lat, location.lon, '1h');
        return tomorrowHourly.timelines[0].intervals.slice(0, 24).map(convertTomorrowHourly);
      
      default:
        throw new Error(`Unsupported weather provider: ${CURRENT_PROVIDER}`);
    }
  } catch (error) {
    console.error(`Error getting hourly forecast with ${CURRENT_PROVIDER}:`, error);
    throw error;
  }
}

// Conversion functions for each provider
function convertAccuWeatherLocation(location: any): UnifiedLocation {
  return {
    key: location.Key,
    name: location.LocalizedName,
    country: location.Country.LocalizedName,
    region: location.AdministrativeArea?.LocalizedName,
    lat: location.GeoPosition?.Latitude || 0,
    lon: location.GeoPosition?.Longitude || 0
  };
}

function convertWeatherAPILocation(location: WeatherAPI.WeatherAPILocation): UnifiedLocation {
  return {
    key: `${location.lat},${location.lon}`,
    name: location.name,
    country: location.country,
    region: location.region,
    lat: location.lat,
    lon: location.lon
  };
}

function convertOpenWeatherLocation(location: OpenWeatherAPI.OpenWeatherLocation): UnifiedLocation {
  return {
    key: `${location.lat},${location.lon}`,
    name: location.name,
    country: location.country,
    region: location.state,
    lat: location.lat,
    lon: location.lon
  };
}

function convertAccuWeatherCurrent(weather: any): UnifiedCurrentWeather {
  return {
    temperature: {
      celsius: weather.Temperature.Metric.Value,
      fahrenheit: weather.Temperature.Imperial.Value
    },
    feelsLike: {
      celsius: weather.RealFeelTemperature.Metric.Value,
      fahrenheit: weather.RealFeelTemperature.Imperial.Value
    },
    humidity: weather.RelativeHumidity,
    windSpeed: {
      kmh: weather.Wind.Speed.Metric.Value,
      mph: weather.Wind.Speed.Imperial.Value
    },
    windDirection: {
      degrees: weather.Wind.Direction.Degrees,
      text: weather.Wind.Direction.English
    },
    visibility: {
      km: weather.Visibility.Metric.Value,
      miles: weather.Visibility.Imperial.Value
    },
    pressure: {
      mb: weather.Pressure?.Metric.Value || 0,
      inHg: weather.Pressure?.Imperial.Value || 0
    },
    uvIndex: weather.UVIndex || 0,
    uvText: weather.UVIndexText || 'Unknown',
    condition: weather.WeatherText,
    icon: AccuWeatherAPI.getWeatherIcon(weather.WeatherIcon),
    dewPoint: weather.DewPoint ? {
      celsius: weather.DewPoint.Metric.Value,
      fahrenheit: weather.DewPoint.Imperial.Value
    } : undefined
  };
}

function convertWeatherAPICurrent(weather: WeatherAPI.WeatherAPICurrentConditions): UnifiedCurrentWeather {
  return {
    temperature: {
      celsius: weather.temp_c,
      fahrenheit: weather.temp_f
    },
    feelsLike: {
      celsius: weather.feelslike_c,
      fahrenheit: weather.feelslike_f
    },
    humidity: weather.humidity,
    windSpeed: {
      kmh: weather.wind_kph,
      mph: weather.wind_mph
    },
    windDirection: {
      degrees: weather.wind_degree,
      text: weather.wind_dir
    },
    visibility: {
      km: weather.vis_km,
      miles: weather.vis_miles
    },
    pressure: {
      mb: weather.pressure_mb,
      inHg: weather.pressure_in
    },
    uvIndex: weather.uv,
    uvText: getUVText(weather.uv),
    condition: weather.condition.text,
    icon: weather.condition.icon
  };
}

function convertOpenWeatherCurrent(weather: OpenWeatherAPI.OpenWeatherCurrentConditions): UnifiedCurrentWeather {
  return {
    temperature: {
      celsius: Math.round((weather.temp - 32) * 5/9),
      fahrenheit: weather.temp
    },
    feelsLike: {
      celsius: Math.round((weather.feels_like - 32) * 5/9),
      fahrenheit: weather.feels_like
    },
    humidity: weather.humidity,
    windSpeed: {
      kmh: Math.round(weather.wind_speed * 1.60934),
      mph: weather.wind_speed
    },
    windDirection: {
      degrees: weather.wind_deg,
      text: getWindDirectionText(weather.wind_deg)
    },
    visibility: {
      km: Math.round(weather.visibility / 1000),
      miles: Math.round(weather.visibility * 0.000621371)
    },
    pressure: {
      mb: weather.pressure,
      inHg: Math.round(weather.pressure * 0.02953 * 100) / 100
    },
    uvIndex: weather.uvi,
    uvText: getUVText(weather.uvi),
    condition: weather.weather[0].description,
    icon: weather.weather[0].icon
  };
}

function convertTomorrowCurrent(weather: any): UnifiedCurrentWeather {
  return {
    temperature: {
      celsius: Math.round((weather.temperature - 32) * 5/9),
      fahrenheit: weather.temperature
    },
    feelsLike: {
      celsius: Math.round((weather.temperatureApparent - 32) * 5/9),
      fahrenheit: weather.temperatureApparent
    },
    humidity: weather.humidity,
    windSpeed: {
      kmh: Math.round(weather.windSpeed * 1.60934),
      mph: weather.windSpeed
    },
    windDirection: {
      degrees: weather.windDirection,
      text: getWindDirectionText(weather.windDirection)
    },
    visibility: {
      km: Math.round(weather.visibility * 1.60934),
      miles: weather.visibility
    },
    pressure: {
      mb: Math.round(weather.pressureSurfaceLevel * 33.8639),
      inHg: weather.pressureSurfaceLevel
    },
    uvIndex: weather.uvIndex,
    uvText: getUVText(weather.uvIndex),
    condition: getTomorrowConditionText(weather.weatherCode),
    icon: getTomorrowIcon(weather.weatherCode)
  };
}

// Additional conversion functions for forecast data...
function convertAccuWeatherForecast(day: any): UnifiedForecastDay {
  return {
    date: day.Date,
    tempMin: day.Temperature.Minimum.Value,
    tempMax: day.Temperature.Maximum.Value,
    condition: day.Day.IconPhrase,
    icon: AccuWeatherAPI.getWeatherIcon(day.Day.Icon)
  };
}

function convertWeatherAPIForecast(day: any): UnifiedForecastDay {
  return {
    date: day.date,
    tempMin: day.day.mintemp_f,
    tempMax: day.day.maxtemp_f,
    condition: day.day.condition.text,
    icon: day.day.condition.icon
  };
}

function convertOpenWeatherForecast(day: any): UnifiedForecastDay {
  return {
    date: new Date(day.dt * 1000).toISOString().split('T')[0],
    tempMin: day.temp.min,
    tempMax: day.temp.max,
    condition: day.weather[0].description,
    icon: day.weather[0].icon
  };
}

function convertTomorrowForecast(day: any): UnifiedForecastDay {
  return {
    date: day.time.split('T')[0],
    tempMin: day.values.temperatureMin,
    tempMax: day.values.temperatureMax,
    condition: getTomorrowConditionText(day.values.weatherCodeMax),
    icon: getTomorrowIcon(day.values.weatherCodeMax)
  };
}

// Hourly conversion functions...
function convertAccuWeatherHourly(hour: any): UnifiedHourlyForecast {
  return {
    dateTime: hour.DateTime,
    temperature: hour.Temperature.Value,
    condition: hour.IconPhrase,
    icon: AccuWeatherAPI.getWeatherIcon(hour.WeatherIcon),
    precipitationChance: hour.PrecipitationProbability,
    humidity: hour.RelativeHumidity,
    windSpeed: hour.Wind.Speed.Value
  };
}

function convertWeatherAPIHourly(hour: any): UnifiedHourlyForecast {
  return {
    dateTime: hour.time,
    temperature: hour.temp_f,
    condition: hour.condition.text,
    icon: hour.condition.icon,
    precipitationChance: hour.chance_of_rain,
    humidity: hour.humidity,
    windSpeed: hour.wind_mph
  };
}

function convertOpenWeatherHourly(hour: any): UnifiedHourlyForecast {
  return {
    dateTime: new Date(hour.dt * 1000).toISOString(),
    temperature: hour.temp,
    condition: hour.weather[0].description,
    icon: hour.weather[0].icon,
    precipitationChance: Math.round(hour.pop * 100),
    humidity: hour.humidity,
    windSpeed: hour.wind_speed
  };
}

function convertTomorrowHourly(hour: any): UnifiedHourlyForecast {
  return {
    dateTime: hour.time,
    temperature: hour.values.temperature,
    condition: getTomorrowConditionText(hour.values.weatherCode),
    icon: getTomorrowIcon(hour.values.weatherCode),
    precipitationChance: hour.values.precipitationProbability,
    humidity: hour.values.humidity,
    windSpeed: hour.values.windSpeed
  };
}

// Helper functions
function getUVText(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

function getWindDirectionText(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
}

function getTomorrowConditionText(code: number): string {
  const conditions: { [key: number]: string } = {
    0: 'Unknown',
    1000: 'Clear',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    1001: 'Cloudy',
    2000: 'Fog',
    4000: 'Drizzle',
    4001: 'Rain',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    5001: 'Flurries',
    5100: 'Light Snow',
    5101: 'Heavy Snow',
    8000: 'Thunderstorm'
  };
  return conditions[code] || 'Unknown';
}

function getTomorrowIcon(code: number): string {
  const icons: { [key: number]: string } = {
    0: '❓',
    1000: '☀️',
    1100: '🌤️',
    1101: '⛅',
    1102: '🌥️',
    1001: '☁️',
    2000: '🌫️',
    4000: '🌦️',
    4001: '🌧️',
    4200: '🌦️',
    4201: '⛈️',
    5000: '🌨️',
    5001: '❄️',
    5100: '🌨️',
    5101: '❄️',
    8000: '⛈️'
  };
  return icons[code] || '🌤️';
}

// Export current provider info
export function getCurrentProvider(): WeatherProvider {
  return CURRENT_PROVIDER;
}

export function getProviderInfo() {
  const providers = {
    accuweather: {
      name: 'AccuWeather',
      description: 'Enterprise accuracy & brand reputation',
      cost: 'Premium',
      features: ['Detailed forecasts', 'Weather alerts', 'Minute-by-minute precipitation']
    },
    weatherapi: {
      name: 'WeatherAPI.com',
      description: 'Low cost + easy integration',
      cost: 'Free tier available',
      features: ['Simple API', 'Good documentation', 'Air quality data']
    },
    openweathermap: {
      name: 'OpenWeatherMap',
      description: 'Good balance + reliability',
      cost: 'Free tier available',
      features: ['One Call API', 'Historical data', 'Weather maps']
    },
    tomorrow: {
      name: 'Tomorrow.io',
      description: 'Hyperlocal precision',
      cost: 'Premium',
      features: ['Hyperlocal forecasts', 'Weather intelligence', 'Advanced analytics']
    }
  };
  
  return providers[CURRENT_PROVIDER];
}