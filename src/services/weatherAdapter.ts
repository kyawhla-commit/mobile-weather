// Weather Adapter - Provides backward compatibility while using the new unified service
import {
  searchLocations,
  getCurrentWeather,
  getForecast,
  getHourlyForecast,
  getCurrentProvider,
  UnifiedLocation,
  UnifiedCurrentWeather,
  UnifiedForecastDay,
  UnifiedHourlyForecast
} from './weatherService';

// Import original types for compatibility
import {
  LocationData,
  CurrentConditions,
  DailyForecast,
  HourlyForecast,
  getWeatherIcon as originalGetWeatherIcon
} from './weather';

// Convert unified location to original format
function convertToLocationData(location: UnifiedLocation): LocationData {
  return {
    Key: location.key,
    LocalizedName: location.name,
    Country: { LocalizedName: location.country },
    AdministrativeArea: { LocalizedName: location.region || '' },
    GeoPosition: {
      Latitude: location.lat,
      Longitude: location.lon
    }
  };
}

// Convert unified current weather to original format
function convertToCurrentConditions(weather: UnifiedCurrentWeather): CurrentConditions {
  return {
    WeatherText: weather.condition,
    WeatherIcon: 1, // Will be handled by icon function
    Temperature: {
      Metric: { Value: weather.temperature.celsius, Unit: 'C' },
      Imperial: { Value: weather.temperature.fahrenheit, Unit: 'F' }
    },
    RelativeHumidity: weather.humidity,
    Wind: {
      Speed: {
        Metric: { Value: weather.windSpeed.kmh, Unit: 'km/h' },
        Imperial: { Value: weather.windSpeed.mph, Unit: 'mph' }
      },
      Direction: {
        Degrees: weather.windDirection.degrees,
        Localized: weather.windDirection.text,
        English: weather.windDirection.text
      }
    },
    Visibility: {
      Metric: { Value: weather.visibility.km, Unit: 'km' },
      Imperial: { Value: weather.visibility.miles, Unit: 'mi' }
    },
    RealFeelTemperature: {
      Metric: { Value: weather.feelsLike.celsius, Unit: 'C' },
      Imperial: { Value: weather.feelsLike.fahrenheit, Unit: 'F' }
    },
    Pressure: {
      Metric: { Value: weather.pressure.mb, Unit: 'mb' },
      Imperial: { Value: weather.pressure.inHg, Unit: 'inHg' }
    },
    DewPoint: weather.dewPoint ? {
      Metric: { Value: weather.dewPoint.celsius, Unit: 'C' },
      Imperial: { Value: weather.dewPoint.fahrenheit, Unit: 'F' }
    } : undefined,
    UVIndex: weather.uvIndex,
    UVIndexText: weather.uvText
  };
}

// Convert unified forecast to original format
function convertToDailyForecast(forecast: UnifiedForecastDay): DailyForecast {
  return {
    Date: forecast.date,
    Temperature: {
      Minimum: { Value: forecast.tempMin, Unit: 'F' },
      Maximum: { Value: forecast.tempMax, Unit: 'F' }
    },
    Day: {
      Icon: 1, // Will be handled by icon function
      IconPhrase: forecast.condition
    }
  };
}

// Convert unified hourly to original format
function convertToHourlyForecast(hourly: UnifiedHourlyForecast): HourlyForecast {
  return {
    DateTime: hourly.dateTime,
    EpochDateTime: Math.floor(new Date(hourly.dateTime).getTime() / 1000),
    WeatherIcon: 1, // Will be handled by icon function
    IconPhrase: hourly.condition,
    Temperature: {
      Value: hourly.temperature,
      Unit: 'F'
    },
    PrecipitationProbability: hourly.precipitationChance,
    Wind: {
      Speed: {
        Value: hourly.windSpeed,
        Unit: 'mph'
      }
    },
    RelativeHumidity: hourly.humidity
  };
}

// Backward compatible functions
export async function searchLocation(query: string): Promise<LocationData[]> {
  try {
    console.log(`🌤️ Using ${getCurrentProvider()} API for location search`);
    const locations = await searchLocations(query);
    return locations.map(convertToLocationData);
  } catch (error) {
    console.error('Search location error:', error);
    throw error;
  }
}

export async function autocompleteLocation(query: string): Promise<LocationData[]> {
  // For now, use the same search function
  // Individual APIs can implement autocomplete differently
  return searchLocation(query);
}

export async function getCurrentConditions(locationKey: string): Promise<CurrentConditions> {
  try {
    console.log(`🌤️ Using ${getCurrentProvider()} API for current weather`);
    
    // Parse location key to get coordinates or use as-is
    let location: UnifiedLocation;
    
    if (locationKey.includes(',')) {
      // Coordinate-based key
      const [lat, lon] = locationKey.split(',').map(Number);
      location = {
        key: locationKey,
        name: 'Current Location',
        country: 'Unknown',
        lat,
        lon
      };
    } else {
      // For AccuWeather keys or location names, try to search
      // First try as location name
      try {
        const locations = await searchLocations(locationKey);
        if (locations.length > 0) {
          location = locations[0];
        } else {
          // If no results, fall back to AccuWeather API for this specific key
          console.log(`⚠️ No results from ${getCurrentProvider()}, falling back to AccuWeather for key: ${locationKey}`);
          const { getCurrentConditions: accuGetCurrent } = await import('./weather');
          return await accuGetCurrent(locationKey);
        }
      } catch (searchError) {
        console.log(`⚠️ Search failed in ${getCurrentProvider()}, falling back to AccuWeather for key: ${locationKey}`);
        const { getCurrentConditions: accuGetCurrent } = await import('./weather');
        return await accuGetCurrent(locationKey);
      }
    }
    
    const weather = await getCurrentWeather(location);
    return convertToCurrentConditions(weather);
  } catch (error) {
    console.error('Get current conditions error:', error);
    // Final fallback to AccuWeather
    try {
      console.log(`🔄 Final fallback to AccuWeather for key: ${locationKey}`);
      const { getCurrentConditions: accuGetCurrent } = await import('./weather');
      return await accuGetCurrent(locationKey);
    } catch (fallbackError) {
      throw error; // Throw original error
    }
  }
}

export async function get5DayForecast(locationKey: string): Promise<DailyForecast[]> {
  try {
    console.log(`🌤️ Using ${getCurrentProvider()} API for forecast`);
    
    // Parse location key to get coordinates or use as-is
    let location: UnifiedLocation;
    
    if (locationKey.includes(',')) {
      // Coordinate-based key
      const [lat, lon] = locationKey.split(',').map(Number);
      location = {
        key: locationKey,
        name: 'Current Location',
        country: 'Unknown',
        lat,
        lon
      };
    } else {
      // For AccuWeather keys or location names, try to search
      try {
        const locations = await searchLocations(locationKey);
        if (locations.length > 0) {
          location = locations[0];
        } else {
          // Fall back to AccuWeather
          console.log(`⚠️ No results from ${getCurrentProvider()}, falling back to AccuWeather for key: ${locationKey}`);
          const { get5DayForecast: accuGetForecast } = await import('./weather');
          return await accuGetForecast(locationKey);
        }
      } catch (searchError) {
        console.log(`⚠️ Search failed in ${getCurrentProvider()}, falling back to AccuWeather for key: ${locationKey}`);
        const { get5DayForecast: accuGetForecast } = await import('./weather');
        return await accuGetForecast(locationKey);
      }
    }
    
    const forecast = await getForecast(location);
    return forecast.map(convertToDailyForecast);
  } catch (error) {
    console.error('Get forecast error:', error);
    // Final fallback to AccuWeather
    try {
      console.log(`🔄 Final fallback to AccuWeather for key: ${locationKey}`);
      const { get5DayForecast: accuGetForecast } = await import('./weather');
      return await accuGetForecast(locationKey);
    } catch (fallbackError) {
      throw error;
    }
  }
}

export async function get12HourForecast(locationKey: string): Promise<HourlyForecast[]> {
  try {
    console.log(`🌤️ Using ${getCurrentProvider()} API for hourly forecast`);
    
    // Parse location key to get coordinates or use as-is
    let location: UnifiedLocation;
    
    if (locationKey.includes(',')) {
      // Coordinate-based key
      const [lat, lon] = locationKey.split(',').map(Number);
      location = {
        key: locationKey,
        name: 'Current Location',
        country: 'Unknown',
        lat,
        lon
      };
    } else {
      // For AccuWeather keys or location names, try to search
      try {
        const locations = await searchLocations(locationKey);
        if (locations.length > 0) {
          location = locations[0];
        } else {
          // Fall back to AccuWeather
          console.log(`⚠️ No results from ${getCurrentProvider()}, falling back to AccuWeather for key: ${locationKey}`);
          const { get12HourForecast: accuGetHourly } = await import('./weather');
          return await accuGetHourly(locationKey);
        }
      } catch (searchError) {
        console.log(`⚠️ Search failed in ${getCurrentProvider()}, falling back to AccuWeather for key: ${locationKey}`);
        const { get12HourForecast: accuGetHourly } = await import('./weather');
        return await accuGetHourly(locationKey);
      }
    }
    
    const hourly = await getHourlyForecast(location);
    return hourly.slice(0, 12).map(convertToHourlyForecast);
  } catch (error) {
    console.error('Get hourly forecast error:', error);
    // Final fallback to AccuWeather
    try {
      console.log(`🔄 Final fallback to AccuWeather for key: ${locationKey}`);
      const { get12HourForecast: accuGetHourly } = await import('./weather');
      return await accuGetHourly(locationKey);
    } catch (fallbackError) {
      throw error;
    }
  }
}

// 24-hour forecast removed - not available on AccuWeather free plan

// Re-export other functions that don't need changes
export { getWeatherIcon } from './weather';
export type { LocationData, CurrentConditions, DailyForecast, HourlyForecast } from './weather';

// Export provider info
export function getCurrentWeatherProvider() {
  return getCurrentProvider();
}