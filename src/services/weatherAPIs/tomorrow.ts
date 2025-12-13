// Tomorrow.io Implementation - Hyperlocal precision
import { Platform } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_TOMORROW_API_KEY;
const BASE_URL = 'https://api.tomorrow.io/v4';

// CORS proxy for web
const CORS_PROXY = Platform.OS === 'web' ? 'https://api.allorigins.win/raw?url=' : '';

function getApiUrl(endpoint: string): string {
  const url = `${BASE_URL}${endpoint}`;
  return Platform.OS === 'web' ? `${CORS_PROXY}${encodeURIComponent(url)}` : url;
}

export interface TomorrowLocation {
  lat: number;
  lon: number;
  name?: string;
  country?: string;
  region?: string;
}

export interface TomorrowCurrentConditions {
  time: string;
  values: {
    cloudBase: number;
    cloudCeiling: number;
    cloudCover: number;
    dewPoint: number;
    freezingRainIntensity: number;
    humidity: number;
    precipitationProbability: number;
    pressureSurfaceLevel: number;
    rainIntensity: number;
    sleetIntensity: number;
    snowIntensity: number;
    temperature: number;
    temperatureApparent: number;
    uvHealthConcern: number;
    uvIndex: number;
    visibility: number;
    weatherCode: number;
    windDirection: number;
    windGust: number;
    windSpeed: number;
  };
}

export interface TomorrowForecastDay {
  time: string;
  values: {
    cloudBaseAvg: number;
    cloudBaseMax: number;
    cloudBaseMin: number;
    cloudCeilingAvg: number;
    cloudCeilingMax: number;
    cloudCeilingMin: number;
    cloudCoverAvg: number;
    cloudCoverMax: number;
    cloudCoverMin: number;
    dewPointAvg: number;
    dewPointMax: number;
    dewPointMin: number;
    evapotranspirationAvg: number;
    evapotranspirationMax: number;
    evapotranspirationMin: number;
    evapotranspirationSum: number;
    freezingRainIntensityAvg: number;
    freezingRainIntensityMax: number;
    freezingRainIntensityMin: number;
    humidityAvg: number;
    humidityMax: number;
    humidityMin: number;
    iceAccumulationAvg: number;
    iceAccumulationMax: number;
    iceAccumulationMin: number;
    iceAccumulationSum: number;
    moonriseTime: string;
    moonsetTime: string;
    precipitationProbabilityAvg: number;
    precipitationProbabilityMax: number;
    precipitationProbabilityMin: number;
    pressureSurfaceLevelAvg: number;
    pressureSurfaceLevelMax: number;
    pressureSurfaceLevelMin: number;
    rainAccumulationAvg: number;
    rainAccumulationMax: number;
    rainAccumulationMin: number;
    rainAccumulationSum: number;
    rainIntensityAvg: number;
    rainIntensityMax: number;
    rainIntensityMin: number;
    sleetAccumulationAvg: number;
    sleetAccumulationMax: number;
    sleetAccumulationMin: number;
    sleetAccumulationSum: number;
    sleetIntensityAvg: number;
    sleetIntensityMax: number;
    sleetIntensityMin: number;
    snowAccumulationAvg: number;
    snowAccumulationMax: number;
    snowAccumulationMin: number;
    snowAccumulationSum: number;
    snowIntensityAvg: number;
    snowIntensityMax: number;
    snowIntensityMin: number;
    sunriseTime: string;
    sunsetTime: string;
    temperatureAvg: number;
    temperatureMax: number;
    temperatureMin: number;
    temperatureApparentAvg: number;
    temperatureApparentMax: number;
    temperatureApparentMin: number;
    uvHealthConcernAvg: number;
    uvHealthConcernMax: number;
    uvHealthConcernMin: number;
    uvIndexAvg: number;
    uvIndexMax: number;
    uvIndexMin: number;
    visibilityAvg: number;
    visibilityMax: number;
    visibilityMin: number;
    weatherCodeMax: number;
    weatherCodeMin: number;
    windDirectionAvg: number;
    windGustAvg: number;
    windGustMax: number;
    windGustMin: number;
    windSpeedAvg: number;
    windSpeedMax: number;
    windSpeedMin: number;
  };
}

export interface TomorrowHourlyForecast {
  time: string;
  values: {
    cloudBase: number;
    cloudCeiling: number;
    cloudCover: number;
    dewPoint: number;
    freezingRainIntensity: number;
    humidity: number;
    precipitationProbability: number;
    pressureSurfaceLevel: number;
    rainIntensity: number;
    sleetIntensity: number;
    snowIntensity: number;
    temperature: number;
    temperatureApparent: number;
    uvHealthConcern: number;
    uvIndex: number;
    visibility: number;
    weatherCode: number;
    windDirection: number;
    windGust: number;
    windSpeed: number;
  };
}

// Get current weather
export async function getCurrentWeatherTomorrow(lat: number, lon: number): Promise<{
  data: {
    time: string;
    values: TomorrowCurrentConditions['values'];
  };
  location: TomorrowLocation;
}> {
  try {
    const endpoint = `/weather/realtime?location=${lat},${lon}&apikey=${API_KEY}&units=imperial`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to get current weather: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Tomorrow.io current weather error:', error);
    throw error;
  }
}

// Get forecast
export async function getForecastTomorrow(lat: number, lon: number, timesteps: string = 'daily'): Promise<{
  timelines: Array<{
    timestep: string;
    endTime: string;
    startTime: string;
    intervals: Array<TomorrowForecastDay | TomorrowHourlyForecast>;
  }>;
  location: TomorrowLocation;
}> {
  try {
    const endpoint = `/weather/forecast?location=${lat},${lon}&timesteps=${timesteps}&apikey=${API_KEY}&units=imperial`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to get forecast: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Tomorrow.io forecast error:', error);
    throw error;
  }
}

// Get multiple timesteps (current + daily + hourly)
export async function getWeatherDataTomorrow(lat: number, lon: number): Promise<{
  timelines: Array<{
    timestep: string;
    endTime: string;
    startTime: string;
    intervals: Array<any>;
  }>;
  location: TomorrowLocation;
}> {
  try {
    const endpoint = `/weather/forecast?location=${lat},${lon}&timesteps=current,1h,1d&apikey=${API_KEY}&units=imperial`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to get weather data: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Tomorrow.io weather data error:', error);
    throw error;
  }
}

// Convert Tomorrow.io data to your app's format
export function convertTomorrowToAppFormat(data: any) {
  const currentTimeline = data.timelines.find((t: any) => t.timestep === 'current');
  const hourlyTimeline = data.timelines.find((t: any) => t.timestep === '1h');
  const dailyTimeline = data.timelines.find((t: any) => t.timestep === '1d');
  
  const current = currentTimeline?.intervals[0]?.values || {};
  
  return {
    locationKey: `${data.location.lat},${data.location.lon}`,
    location: {
      Key: `${data.location.lat},${data.location.lon}`,
      LocalizedName: data.location.name || 'Unknown',
      Country: { LocalizedName: data.location.country || 'Unknown' },
      AdministrativeArea: { LocalizedName: data.location.region || '' },
      GeoPosition: {
        Latitude: data.location.lat,
        Longitude: data.location.lon
      }
    },
    currentWeather: {
      WeatherText: getWeatherDescription(current.weatherCode),
      WeatherIcon: getTomorrowIcon(current.weatherCode),
      Temperature: {
        Metric: { Value: fahrenheitToCelsius(current.temperature), Unit: 'C' },
        Imperial: { Value: current.temperature, Unit: 'F' }
      },
      RelativeHumidity: current.humidity,
      Wind: {
        Speed: {
          Metric: { Value: mphToKmh(current.windSpeed), Unit: 'km/h' },
          Imperial: { Value: current.windSpeed, Unit: 'mph' }
        },
        Direction: {
          Degrees: current.windDirection,
          Localized: getWindDirection(current.windDirection),
          English: getWindDirection(current.windDirection)
        }
      },
      WindGust: {
        Speed: {
          Metric: { Value: mphToKmh(current.windGust), Unit: 'km/h' },
          Imperial: { Value: current.windGust, Unit: 'mph' }
        }
      },
      Visibility: {
        Metric: { Value: milesToKm(current.visibility), Unit: 'km' },
        Imperial: { Value: current.visibility, Unit: 'mi' }
      },
      RealFeelTemperature: {
        Metric: { Value: fahrenheitToCelsius(current.temperatureApparent), Unit: 'C' },
        Imperial: { Value: current.temperatureApparent, Unit: 'F' }
      },
      Pressure: {
        Metric: { Value: inHgToMb(current.pressureSurfaceLevel), Unit: 'mb' },
        Imperial: { Value: current.pressureSurfaceLevel, Unit: 'inHg' }
      },
      DewPoint: {
        Metric: { Value: fahrenheitToCelsius(current.dewPoint), Unit: 'C' },
        Imperial: { Value: current.dewPoint, Unit: 'F' }
      },
      UVIndex: current.uvIndex,
      UVIndexText: getUVIndexText(current.uvIndex)
    },
    forecast: dailyTimeline?.intervals.slice(0, 5).map((day: any) => ({
      Date: day.time.split('T')[0],
      Temperature: {
        Minimum: { Value: day.values.temperatureMin, Unit: 'F' },
        Maximum: { Value: day.values.temperatureMax, Unit: 'F' }
      },
      Day: { 
        Icon: getTomorrowIcon(day.values.weatherCodeMax), 
        IconPhrase: getWeatherDescription(day.values.weatherCodeMax)
      }
    })) || [],
    hourlyForecast: hourlyTimeline?.intervals.slice(0, 24).map((hour: any) => ({
      DateTime: hour.time,
      EpochDateTime: Math.floor(new Date(hour.time).getTime() / 1000),
      WeatherIcon: getTomorrowIcon(hour.values.weatherCode),
      IconPhrase: getWeatherDescription(hour.values.weatherCode),
      Temperature: {
        Value: hour.values.temperature,
        Unit: 'F'
      },
      PrecipitationProbability: hour.values.precipitationProbability,
      Wind: {
        Speed: {
          Value: hour.values.windSpeed,
          Unit: 'mph'
        }
      },
      RelativeHumidity: hour.values.humidity
    })) || []
  };
}

// Helper functions
function fahrenheitToCelsius(f: number): number {
  return Math.round((f - 32) * 5/9);
}

function mphToKmh(mph: number): number {
  return Math.round(mph * 1.60934);
}

function milesToKm(miles: number): number {
  return Math.round(miles * 1.60934);
}

function inHgToMb(inHg: number): number {
  return Math.round(inHg * 33.8639);
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
}

function getTomorrowIcon(weatherCode: number): number {
  // Map Tomorrow.io weather codes to AccuWeather-style icon numbers
  const iconMap: { [key: number]: number } = {
    0: 1,    // Unknown
    1000: 1, // Clear, Sunny
    1100: 2, // Mostly Clear
    1101: 3, // Partly Cloudy
    1102: 4, // Mostly Cloudy
    1001: 8, // Cloudy
    2000: 11, // Fog
    2100: 11, // Light Fog
    4000: 12, // Drizzle
    4001: 12, // Rain
    4200: 12, // Light Rain
    4201: 18, // Heavy Rain
    5000: 19, // Snow
    5001: 20, // Flurries
    5100: 19, // Light Snow
    5101: 22, // Heavy Snow
    6000: 19, // Freezing Drizzle
    6001: 19, // Freezing Rain
    6200: 19, // Light Freezing Rain
    6201: 24, // Heavy Freezing Rain
    7000: 24, // Ice Pellets
    7101: 24, // Heavy Ice Pellets
    7102: 24, // Light Ice Pellets
    8000: 15, // Thunderstorm
  };
  
  return iconMap[weatherCode] || 1;
}

function getWeatherDescription(weatherCode: number): string {
  const descriptions: { [key: number]: string } = {
    0: 'Unknown',
    1000: 'Clear, Sunny',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    1001: 'Cloudy',
    2000: 'Fog',
    2100: 'Light Fog',
    4000: 'Drizzle',
    4001: 'Rain',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    5001: 'Flurries',
    5100: 'Light Snow',
    5101: 'Heavy Snow',
    6000: 'Freezing Drizzle',
    6001: 'Freezing Rain',
    6200: 'Light Freezing Rain',
    6201: 'Heavy Freezing Rain',
    7000: 'Ice Pellets',
    7101: 'Heavy Ice Pellets',
    7102: 'Light Ice Pellets',
    8000: 'Thunderstorm',
  };
  
  return descriptions[weatherCode] || 'Unknown';
}

function getUVIndexText(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}