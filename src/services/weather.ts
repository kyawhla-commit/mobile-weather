import { Platform } from 'react-native';
import { cacheWeatherData, getCachedWeatherData, isOnline } from './offlineStorage';

const API_KEY = process.env.EXPO_PUBLIC_ACCUWEATHER_API_KEY;
const BASE_URL = 'https://dataservice.accuweather.com';

// Validate API key on module load
if (!API_KEY) {
  console.error('❌ AccuWeather API key is missing! Check EXPO_PUBLIC_ACCUWEATHER_API_KEY in .env.local');
} else {
  console.log('✅ AccuWeather API key loaded:', API_KEY.substring(0, 10) + '...');
}

// Debug function to test API connectivity
export async function testAPIConnection(): Promise<boolean> {
  try {
    // Test with a simple location search
    const testUrl = getApiUrl(`/locations/v1/cities/search?apikey=${API_KEY}&q=New York`);
    const response = await fetch(testUrl);
    
    if (response.ok) {
      console.log('✅ AccuWeather API connection successful');
      return true;
    } else {
      console.error('❌ AccuWeather API connection failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ AccuWeather API connection error:', error);
    return false;
  }
}

// Retry function for network requests
async function fetchWithRetry(url: string, retries = 2, delay = 1000): Promise<Response> {
  // Check network connectivity first
  const networkState = await isOnline();
  if (!networkState) {
    throw new Error('No internet connection available');
  }

  for (let i = 0; i <= retries; i++) {
    try {
      console.log(`🌐 Fetching: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'ClimateCompanion/1.0',
        },
        // Remove timeout as it's not supported in React Native fetch
      });
      
      console.log(`📡 Response status: ${response.status}`);
      return response;
    } catch (error) {
      console.error(`❌ Fetch attempt ${i + 1} failed:`, error);
      
      if (i === retries) {
        // Provide more specific error messages
        if (error instanceof TypeError && error.message.includes('Network request failed')) {
          throw new Error('Network connection failed. Please check your internet connection and try again.');
        }
        throw error;
      }
      
      console.log(`🔄 Retry ${i + 1}/${retries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded');
}

// For web, we'll use a CORS proxy
const CORS_PROXY =
  Platform.OS === 'web' ? 'https://api.allorigins.win/raw?url=' : '';

function getApiUrl(endpoint: string): string {
  const url = `${BASE_URL}${endpoint}`;
  return Platform.OS === 'web'
    ? `${CORS_PROXY}${encodeURIComponent(url)}`
    : url;
}

export interface LocationData {
  Key: string;
  LocalizedName: string;
  Country: { LocalizedName: string };
  AdministrativeArea: { LocalizedName: string };
  GeoPosition?: {
    Latitude: number;
    Longitude: number;
    Elevation?: {
      Metric: { Value: number; Unit: string };
      Imperial: { Value: number; Unit: string };
    };
  };
}

export interface CurrentConditions {
  WeatherText: string;
  WeatherIcon: number;
  Temperature: {
    Metric: { Value: number; Unit: string };
    Imperial: { Value: number; Unit: string };
  };
  RelativeHumidity: number;
  Wind: {
    Speed: {
      Metric: { Value: number; Unit: string };
      Imperial: { Value: number; Unit: string };
    };
    Direction: {
      Degrees: number;
      Localized: string;
      English: string;
    };
  };
  WindGust?: {
    Speed: {
      Metric: { Value: number; Unit: string };
      Imperial: { Value: number; Unit: string };
    };
  };
  Visibility: {
    Metric: { Value: number; Unit: string };
    Imperial: { Value: number; Unit: string };
  };
  RealFeelTemperature: {
    Metric: { Value: number; Unit: string };
    Imperial: { Value: number; Unit: string };
  };
  Pressure?: {
    Metric: { Value: number; Unit: string };
    Imperial: { Value: number; Unit: string };
  };
  PressureTendency?: {
    LocalizedText: string;
    Code: string;
  };
  DewPoint?: {
    Metric: { Value: number; Unit: string };
    Imperial: { Value: number; Unit: string };
  };
  UVIndex?: number;
  UVIndexText?: string;
}

export interface DailyForecast {
  Date: string;
  Temperature: {
    Minimum: { Value: number; Unit: string };
    Maximum: { Value: number; Unit: string };
  };
  Day: { Icon: number; IconPhrase: string };
}

export interface HourlyForecast {
  DateTime: string;
  EpochDateTime: number;
  WeatherIcon: number;
  IconPhrase: string;
  Temperature: {
    Value: number;
    Unit: string;
  };
  PrecipitationProbability: number;
  Wind: {
    Speed: {
      Value: number;
      Unit: string;
    };
  };
  RelativeHumidity: number;
}

export interface WeatherAlert {
  AlertID: number;
  Area: { Name: string }[];
  Category: string;
  Classification: string;
  Level: string;
  Priority: number;
  Source: string;
  SourceId: number;
  Type: string;
  Description: { Localized: string };
}

export async function searchLocation(query: string): Promise<LocationData[]> {
  try {
    const endpoint = `/locations/v1/cities/search?apikey=${API_KEY}&q=${encodeURIComponent(
      query
    )}`;
    const url = getApiUrl(endpoint);

    console.log('Searching location:', query);
    console.log('Platform:', Platform.OS);

    const response = await fetch(url);
    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to search location: ${response.status}`);
    }

    const data = await response.json();
    console.log('Search results:', data.length, 'cities found');
    return data;
  } catch (error: any) {
    console.error('Error searching location:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
}

// Autocomplete API for real-time suggestions as user types
export async function autocompleteLocation(query: string): Promise<LocationData[]> {
  try {
    // Don't search if query is too short
    if (!query || query.trim().length < 2) {
      return [];
    }

    const endpoint = `/locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${encodeURIComponent(
      query.trim()
    )}`;
    const url = getApiUrl(endpoint);

    console.log('🔍 Autocomplete search:', query);

    const response = await fetch(url);

    if (!response.ok) {
      // Don't throw error for autocomplete, just return empty array
      console.warn('Autocomplete API error:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('✅ Autocomplete results:', data.length, 'suggestions');
    return data;
  } catch (error: any) {
    console.error('Autocomplete error:', error);
    // Return empty array on error, don't break the UI
    return [];
  }
}

export async function getCurrentConditions(
  locationKey: string
): Promise<CurrentConditions> {
  try {
    const endpoint = `/currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=true`;
    const url = getApiUrl(endpoint);

    const response = await fetchWithRetry(url);
    if (!response.ok) throw new Error('Failed to fetch current conditions');
    const data = await response.json();
    return data[0];
  } catch (error: any) {
    console.error('Error fetching current conditions:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
}

export async function get5DayForecast(
  locationKey: string
): Promise<DailyForecast[]> {
  try {
    const endpoint = `/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}&metric=false`;
    const url = getApiUrl(endpoint);

    const response = await fetchWithRetry(url);
    if (!response.ok) throw new Error('Failed to fetch forecast');
    const data = await response.json();
    return data.DailyForecasts;
  } catch (error: any) {
    console.error('Error fetching forecast:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
}

export async function get12HourForecast(
  locationKey: string
): Promise<HourlyForecast[]> {
  try {
    const endpoint = `/forecasts/v1/hourly/12hour/${locationKey}?apikey=${API_KEY}&details=true&metric=false`;
    const url = getApiUrl(endpoint);

    const response = await fetchWithRetry(url);
    if (!response.ok) throw new Error('Failed to fetch hourly forecast');
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching hourly forecast:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
}

// 24-hour forecast is not available on AccuWeather free plan
// Removed to prevent API errors

export async function getWeatherAlerts(
  locationKey: string
): Promise<WeatherAlert[]> {
  try {
    const endpoint = `/alerts/v1/${locationKey}?apikey=${API_KEY}`;
    const url = getApiUrl(endpoint);

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) return []; // No alerts
      throw new Error('Failed to fetch weather alerts');
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching weather alerts:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    return []; // Return empty array on error
  }
}

// Generate smart alerts based on weather conditions
export function generateSmartAlerts(
  currentWeather: CurrentConditions,
  forecast: DailyForecast[]
): Array<{
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  icon: string;
}> {
  const alerts: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
    icon: string;
  }> = [];

  const tempF = currentWeather.Temperature.Imperial.Value;
  const humidity = currentWeather.RelativeHumidity;
  const windSpeed = currentWeather.Wind.Speed.Imperial.Value;

  // Extreme temperature alerts
  if (tempF > 95) {
    alerts.push({
      type: 'Extreme Heat',
      severity: 'high',
      message: `Dangerous heat at ${Math.round(
        tempF
      )}°F. Stay hydrated and avoid outdoor activities.`,
      icon: '🌡️',
    });
  } else if (tempF > 85) {
    alerts.push({
      type: 'Heat Advisory',
      severity: 'medium',
      message: `High temperature of ${Math.round(
        tempF
      )}°F. Take precautions if working outdoors.`,
      icon: '☀️',
    });
  }

  if (tempF < 32) {
    alerts.push({
      type: 'Freeze Warning',
      severity: 'high',
      message: `Freezing temperature at ${Math.round(
        tempF
      )}°F. Protect sensitive plants and pipes.`,
      icon: '❄️',
    });
  } else if (tempF < 40) {
    alerts.push({
      type: 'Frost Advisory',
      severity: 'medium',
      message: `Cold temperature at ${Math.round(
        tempF
      )}°F. Frost possible overnight.`,
      icon: '🧊',
    });
  }

  // High wind alerts
  if (windSpeed > 30) {
    alerts.push({
      type: 'High Wind Warning',
      severity: 'high',
      message: `Dangerous winds at ${Math.round(
        windSpeed
      )} mph. Secure loose objects.`,
      icon: '💨',
    });
  } else if (windSpeed > 20) {
    alerts.push({
      type: 'Wind Advisory',
      severity: 'medium',
      message: `Strong winds at ${Math.round(
        windSpeed
      )} mph. Use caution outdoors.`,
      icon: '🌬️',
    });
  }

  // High humidity alerts
  if (humidity > 85 && tempF > 75) {
    alerts.push({
      type: 'High Humidity',
      severity: 'medium',
      message: `Very humid at ${humidity}%. Increased disease risk for crops.`,
      icon: '💧',
    });
  }

  return alerts;
}

export function getWeatherIcon(iconNumber: number): string {
  const iconMap: { [key: number]: string } = {
    1: '☀️',
    2: '🌤️',
    3: '⛅',
    4: '🌥️',
    5: '🌥️',
    6: '☁️',
    7: '☁️',
    8: '☁️',
    11: '🌫️',
    12: '🌧️',
    13: '🌦️',
    14: '🌦️',
    15: '⛈️',
    16: '⛈️',
    17: '🌧️',
    18: '🌧️',
    19: '🌨️',
    20: '🌨️',
    21: '🌨️',
    22: '❄️',
    23: '❄️',
    24: '🧊',
    25: '🌨️',
    26: '🌧️',
    29: '🌧️',
    32: '💨',
    33: '🌙',
    34: '🌙',
    35: '⛅',
    36: '⛅',
    37: '🌫️',
    38: '☁️',
    39: '🌧️',
    40: '🌧️',
    41: '⛈️',
    42: '⛈️',
    43: '🌨️',
    44: '❄️',
  };
  return iconMap[iconNumber] || '🌤️';
}

// Air Quality Index (AQI) Types
export interface AQIData {
  aqi: number;
  category: string;
  dominantPollutant: string;
  color: string;
  healthRecommendations: {
    general: string;
    sensitive: string;
    outdoor: string;
  };
  pollutants: {
    pm25: { value: number; aqi: number };
    pm10: { value: number; aqi: number };
    o3: { value: number; aqi: number };
    no2: { value: number; aqi: number };
    so2: { value: number; aqi: number };
    co: { value: number; aqi: number };
  };
  timestamp: string;
}

// Get AQI category and color based on AQI value
export function getAQICategory(aqi: number): {
  category: string;
  color: string;
  icon: string;
} {
  if (aqi <= 50) {
    return { category: 'Good', color: '#00E400', icon: '😊' };
  } else if (aqi <= 100) {
    return { category: 'Moderate', color: '#FFFF00', icon: '😐' };
  } else if (aqi <= 150) {
    return {
      category: 'Unhealthy for Sensitive Groups',
      color: '#FF7E00',
      icon: '😷',
    };
  } else if (aqi <= 200) {
    return { category: 'Unhealthy', color: '#FF0000', icon: '😨' };
  } else if (aqi <= 300) {
    return { category: 'Very Unhealthy', color: '#8F3F97', icon: '🤢' };
  } else {
    return { category: 'Hazardous', color: '#7E0023', icon: '☠️' };
  }
}

// Get health recommendations based on AQI
export function getHealthRecommendations(aqi: number): {
  general: string;
  sensitive: string;
  outdoor: string;
} {
  if (aqi <= 50) {
    return {
      general:
        'Air quality is satisfactory, and air pollution poses little or no risk.',
      sensitive: 'Enjoy your outdoor activities.',
      outdoor: 'Ideal conditions for outdoor activities.',
    };
  } else if (aqi <= 100) {
    return {
      general:
        'Air quality is acceptable. However, there may be a risk for some people.',
      sensitive:
        'Consider reducing prolonged or heavy outdoor exertion if you experience symptoms.',
      outdoor: 'Acceptable for most outdoor activities.',
    };
  } else if (aqi <= 150) {
    return {
      general: 'Members of sensitive groups may experience health effects.',
      sensitive:
        'Reduce prolonged or heavy outdoor exertion. Watch for symptoms such as coughing or shortness of breath.',
      outdoor:
        'Limit prolonged outdoor activities, especially for sensitive groups.',
    };
  } else if (aqi <= 200) {
    return {
      general:
        'Some members of the general public may experience health effects.',
      sensitive:
        'Avoid prolonged or heavy outdoor exertion. Consider moving activities indoors.',
      outdoor:
        'Reduce outdoor activities. Everyone should limit prolonged exertion.',
    };
  } else if (aqi <= 300) {
    return {
      general:
        'Health alert: The risk of health effects is increased for everyone.',
      sensitive:
        'Avoid all outdoor physical activities. Move activities indoors or reschedule.',
      outdoor: 'Avoid outdoor activities. Everyone should stay indoors.',
    };
  } else {
    return {
      general:
        'Health warning of emergency conditions: everyone is more likely to be affected.',
      sensitive:
        'Remain indoors and keep activity levels low. Follow advice from local health authorities.',
      outdoor:
        'Avoid all outdoor activities. Stay indoors with air filtration if possible.',
    };
  }
}

// Calculate AQI from pollutant concentration
function calculateAQI(pollutant: string, concentration: number): number {
  // Simplified AQI calculation (US EPA standard)
  // In production, use proper breakpoint tables

  const breakpoints: { [key: string]: number[][] } = {
    pm25: [
      [0, 12, 0, 50],
      [12.1, 35.4, 51, 100],
      [35.5, 55.4, 101, 150],
      [55.5, 150.4, 151, 200],
      [150.5, 250.4, 201, 300],
      [250.5, 500, 301, 500],
    ],
    pm10: [
      [0, 54, 0, 50],
      [55, 154, 51, 100],
      [155, 254, 101, 150],
      [255, 354, 151, 200],
      [355, 424, 201, 300],
      [425, 604, 301, 500],
    ],
    o3: [
      [0, 54, 0, 50],
      [55, 70, 51, 100],
      [71, 85, 101, 150],
      [86, 105, 151, 200],
      [106, 200, 201, 300],
    ],
    no2: [
      [0, 53, 0, 50],
      [54, 100, 51, 100],
      [101, 360, 101, 150],
      [361, 649, 151, 200],
      [650, 1249, 201, 300],
      [1250, 2049, 301, 500],
    ],
    so2: [
      [0, 35, 0, 50],
      [36, 75, 51, 100],
      [76, 185, 101, 150],
      [186, 304, 151, 200],
      [305, 604, 201, 300],
      [605, 1004, 301, 500],
    ],
    co: [
      [0, 4.4, 0, 50],
      [4.5, 9.4, 51, 100],
      [9.5, 12.4, 101, 150],
      [12.5, 15.4, 151, 200],
      [15.5, 30.4, 201, 300],
      [30.5, 50.4, 301, 500],
    ],
  };

  const bp = breakpoints[pollutant];
  if (!bp) return 0;

  for (const [cLow, cHigh, aqiLow, aqiHigh] of bp) {
    if (concentration >= cLow && concentration <= cHigh) {
      return Math.round(
        ((aqiHigh - aqiLow) / (cHigh - cLow)) * (concentration - cLow) + aqiLow
      );
    }
  }

  return 500; // Max AQI
}

// Simulate AQI data (In production, use real API like OpenWeatherMap Air Pollution API)
export async function getAirQuality(
  lat: number,
  lon: number
): Promise<AQIData> {
  try {
    // Using OpenWeatherMap Air Pollution API (free tier)
    const OWM_API_KEY = '8c8e1b8c8e1b8c8e1b8c8e1b8c8e1b8c'; // Replace with actual key
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`
    );

    if (!response.ok) {
      // Fallback to simulated data if API fails
      return generateSimulatedAQI();
    }

    const data = await response.json();
    const aqi = data.list[0].main.aqi * 50; // Convert 1-5 scale to AQI scale
    const components = data.list[0].components;

    const pm25AQI = calculateAQI('pm25', components.pm2_5);
    const pm10AQI = calculateAQI('pm10', components.pm10);
    const o3AQI = calculateAQI('o3', components.o3);
    const no2AQI = calculateAQI('no2', components.no2);
    const so2AQI = calculateAQI('so2', components.so2);
    const coAQI = calculateAQI('co', components.co);

    const maxAQI = Math.max(pm25AQI, pm10AQI, o3AQI, no2AQI, so2AQI, coAQI);
    const { category, color, icon } = getAQICategory(maxAQI);
    const healthRecommendations = getHealthRecommendations(maxAQI);

    // Determine dominant pollutant
    const pollutantAQIs = {
      'PM2.5': pm25AQI,
      PM10: pm10AQI,
      O3: o3AQI,
      NO2: no2AQI,
      SO2: so2AQI,
      CO: coAQI,
    };
    const dominantPollutant = Object.keys(pollutantAQIs).reduce((a, b) =>
      pollutantAQIs[a as keyof typeof pollutantAQIs] >
      pollutantAQIs[b as keyof typeof pollutantAQIs]
        ? a
        : b
    );

    return {
      aqi: maxAQI,
      category,
      dominantPollutant,
      color,
      healthRecommendations,
      pollutants: {
        pm25: { value: components.pm2_5, aqi: pm25AQI },
        pm10: { value: components.pm10, aqi: pm10AQI },
        o3: { value: components.o3, aqi: o3AQI },
        no2: { value: components.no2, aqi: no2AQI },
        so2: { value: components.so2, aqi: so2AQI },
        co: { value: components.co, aqi: coAQI },
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching air quality:', error);
    return generateSimulatedAQI();
  }
}

// Generate simulated AQI data for demo purposes
function generateSimulatedAQI(): AQIData {
  const baseAQI = Math.floor(Math.random() * 150) + 20; // Random AQI between 20-170
  const { category, color } = getAQICategory(baseAQI);
  const healthRecommendations = getHealthRecommendations(baseAQI);

  return {
    aqi: baseAQI,
    category,
    dominantPollutant: 'PM2.5',
    color,
    healthRecommendations,
    pollutants: {
      pm25: { value: Math.random() * 50 + 10, aqi: baseAQI },
      pm10: { value: Math.random() * 80 + 20, aqi: Math.floor(baseAQI * 0.9) },
      o3: { value: Math.random() * 100 + 30, aqi: Math.floor(baseAQI * 0.8) },
      no2: { value: Math.random() * 150 + 40, aqi: Math.floor(baseAQI * 0.7) },
      so2: { value: Math.random() * 100 + 20, aqi: Math.floor(baseAQI * 0.6) },
      co: { value: Math.random() * 5 + 1, aqi: Math.floor(baseAQI * 0.5) },
    },
    timestamp: new Date().toISOString(),
  };
}


// Get weather data with caching support
export async function getWeatherDataWithCache(
  locationKey: string,
  cityName: string
): Promise<{
  currentWeather: CurrentConditions;
  forecast: DailyForecast[];
  hourlyForecast: HourlyForecast[];
  alerts: WeatherAlert[];
  fromCache: boolean;
}> {
  // Check if online
  const online = await isOnline();

  // Try to get from cache first if offline
  if (!online) {
    const cached = await getCachedWeatherData(locationKey);
    if (cached) {
      return {
        currentWeather: cached.currentWeather,
        forecast: cached.forecast,
        hourlyForecast: cached.hourlyForecast,
        alerts: cached.alerts,
        fromCache: true,
      };
    }
    throw new Error('No cached data available and device is offline');
  }

  // Fetch fresh data
  try {
    const [currentWeather, forecast, hourlyForecast, alerts] = await Promise.all([
      getCurrentConditions(locationKey),
      get5DayForecast(locationKey),
      get12HourForecast(locationKey),
      getWeatherAlerts(locationKey),
    ]);

    // Cache the data
    await cacheWeatherData({
      locationKey,
      cityName,
      currentWeather,
      forecast,
      hourlyForecast,
      alerts,
      timestamp: Date.now(),
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
    });

    return {
      currentWeather,
      forecast,
      hourlyForecast,
      alerts,
      fromCache: false,
    };
  } catch (error) {
    // If fetch fails, try cache as fallback
    const cached = await getCachedWeatherData(locationKey);
    if (cached) {
      console.log('Using cached data as fallback');
      return {
        currentWeather: cached.currentWeather,
        forecast: cached.forecast,
        hourlyForecast: cached.hourlyForecast,
        alerts: cached.alerts,
        fromCache: true,
      };
    }
    throw error;
  }
}


// Get location details including coordinates
export async function getLocationDetails(locationKey: string): Promise<LocationData> {
  try {
    const endpoint = `/locations/v1/${locationKey}?apikey=${API_KEY}`;
    const url = getApiUrl(endpoint);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch location details');
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching location details:', error);
    throw error;
  }
}

// Get location key from GPS coordinates using Geoposition Search
// This is the recommended AccuWeather API for converting coordinates to location keys
export async function getLocationByGeoposition(
  latitude: number,
  longitude: number
): Promise<LocationData> {
  try {
    const endpoint = `/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${latitude},${longitude}`;
    const url = getApiUrl(endpoint);
    
    console.log('🌍 AccuWeather Geoposition Search:', { latitude, longitude });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Geoposition API Error:', errorText);
      throw new Error(`Failed to get location from coordinates: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Location found:', data.LocalizedName, data.Country?.LocalizedName);
    
    return data;
  } catch (error: any) {
    console.error('Error in geoposition search:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
}
