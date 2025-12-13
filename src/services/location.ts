import * as Location from 'expo-location';
import { searchLocation, LocationData } from './weather';

// Constants
const LOCATION_TIMEOUT = 10000; // 10 seconds
const MAX_SEARCH_RETRIES = 3;
const LOCATION_ACCURACY = Location.Accuracy.Balanced;

// Types
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Location.PermissionStatus;
}

export interface GeocodingResult {
  city: string;
  region: string;
  country: string;
  formattedAddress: string;
}

export interface LocationServiceError extends Error {
  code?: string;
  retryable: boolean;
  coordinates?: { latitude: number; longitude: number };
}

// Error codes
export const LocationErrorCodes = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  LOCATION_UNAVAILABLE: 'LOCATION_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVICE_DISABLED: 'SERVICE_DISABLED',
  NOT_FOUND: 'NOT_FOUND',
} as const;

/**
 * Professional location service with comprehensive error handling and optimizations
 */
class LocationService {
  private static instance: LocationService;
  private lastKnownLocation: UserLocation | null = null;
  private permissionCheckCache: {
    status: boolean;
    timestamp: number;
  } | null = null;

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permissions with comprehensive error handling
   */
  async requestLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain, expires } =
        await Location.requestForegroundPermissionsAsync();

      // Clear cache when permission status changes
      this.permissionCheckCache = null;

      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status,
      };
    } catch (error) {
      const locationError: LocationServiceError = {
        name: 'LocationPermissionError',
        message: 'Failed to request location permission',
        code: LocationErrorCodes.PERMISSION_DENIED,
        retryable: false,
      };
      console.error('Location permission request failed:', error);
      throw locationError;
    }
  }

  /**
   * Check location permission with caching
   */
  async checkLocationPermission(): Promise<boolean> {
    // Return cached result if valid (5 minute cache)
    if (
      this.permissionCheckCache &&
      Date.now() - this.permissionCheckCache.timestamp < 300000
    ) {
      return this.permissionCheckCache.status;
    }

    try {
      const { status, canAskAgain } =
        await Location.getForegroundPermissionsAsync();

      const granted = status === Location.PermissionStatus.GRANTED;

      // Update cache
      this.permissionCheckCache = {
        status: granted,
        timestamp: Date.now(),
      };

      return granted;
    } catch (error) {
      console.error('Location permission check failed:', error);
      this.permissionCheckCache = { status: false, timestamp: Date.now() };
      return false;
    }
  }

  /**
   * Get current location with timeout and fallback strategies
   */
  async getCurrentLocation(options?: {
    useLastKnown?: boolean;
    highAccuracy?: boolean;
    timeout?: number;
  }): Promise<UserLocation> {
    const {
      useLastKnown = true,
      highAccuracy = false,
      timeout = LOCATION_TIMEOUT,
    } = options || {};

    // Return last known location if available and recent (5 minutes)
    if (
      useLastKnown &&
      this.lastKnownLocation &&
      Date.now() - this.lastKnownLocation.timestamp < 300000
    ) {
      return this.lastKnownLocation;
    }

    try {
      // Check if location services are enabled
      const servicesEnabled = await this.isLocationEnabled();
      if (!servicesEnabled) {
        const error: LocationServiceError = {
          name: 'LocationServicesDisabled',
          message: 'Location services are disabled on this device',
          code: LocationErrorCodes.SERVICE_DISABLED,
          retryable: false,
        };
        throw error;
      }

      // Check and request permissions if needed
      const hasPermission = await this.ensureLocationPermission();
      if (!hasPermission) {
        const error: LocationServiceError = {
          name: 'LocationPermissionDenied',
          message: 'Location permission is required to access device location',
          code: LocationErrorCodes.PERMISSION_DENIED,
          retryable: false,
        };
        throw error;
      }

      // Get current position with timeout
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: highAccuracy
            ? Location.Accuracy.Highest
            : LOCATION_ACCURACY,
          mayShowUserSettingsDialog: true,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject({
                name: 'LocationTimeout',
                message: 'Location request timed out',
                code: LocationErrorCodes.TIMEOUT,
                retryable: true,
              }),
            timeout
          )
        ),
      ]);

      const userLocation: UserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: Date.now(),
      };

      // Cache the location
      this.lastKnownLocation = userLocation;

      return userLocation;
    } catch (error: any) {
      console.error('Failed to get current location:', error);

      // If we have a last known location and the error is retryable, return it
      if (
        useLastKnown &&
        this.lastKnownLocation &&
        error.retryable !== false
      ) {
        console.warn('Using last known location due to error:', error.message);
        return this.lastKnownLocation;
      }

      throw this.normalizeLocationError(error);
    }
  }

  /**
   * Enhanced reverse geocoding with multiple fallback strategies
   */
  async getCityFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<GeocodingResult> {
    try {
      // Validate coordinates
      if (!latitude || !longitude || 
          latitude < -90 || latitude > 90 || 
          longitude < -180 || longitude > 180) {
        console.warn('⚠️ Invalid coordinates provided:', { latitude, longitude });
        return this.createFallbackGeocodingResult(latitude || 0, longitude || 0);
      }

      // Check if we should skip native geocoding due to persistent issues
      const skipNativeGeocoding = process.env.EXPO_PUBLIC_SKIP_NATIVE_GEOCODING === 'true';
      
      if (skipNativeGeocoding) {
        console.log('🔄 Skipping native geocoding, using AccuWeather API directly');
        try {
          const locationData = await this.findLocationByCoordinates(latitude, longitude, 1);
          if (locationData) {
            return {
              city: locationData.LocalizedName || 'Unknown Location',
              region: locationData.AdministrativeArea?.LocalizedName || '',
              country: locationData.Country?.LocalizedName || 'Unknown',
              formattedAddress: `${locationData.LocalizedName}, ${locationData.AdministrativeArea?.LocalizedName || ''}, ${locationData.Country?.LocalizedName || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, ''),
            };
          }
        } catch (error) {
          console.warn('⚠️ AccuWeather API fallback failed:', error);
        }
        return this.createFallbackGeocodingResult(latitude, longitude);
      }

      console.log('🗺️ Reverse geocoding:', { latitude, longitude });
      
      // Check location permissions first
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('⚠️ Location permissions not granted, using fallback');
        return this.createFallbackGeocodingResult(latitude, longitude);
      }
      
      let addresses;
      
      // Try reverse geocoding with simple retry
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          addresses = await Promise.race([
            Location.reverseGeocodeAsync({
              latitude,
              longitude,
            }),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Reverse geocoding timeout')), 5000)
            )
          ]);
          break; // Success, exit retry loop
        } catch (geocodeError: any) {
          if (attempt === 2) {
            // Final attempt failed, try alternative approach
            console.warn('⚠️ Native reverse geocoding failed after retries, using alternative approach');
            
            // Try to use AccuWeather's location API as fallback
            try {
              const locationData = await this.findLocationByCoordinates(latitude, longitude, 1);
              if (locationData) {
                return {
                  city: locationData.LocalizedName || 'Unknown Location',
                  region: locationData.AdministrativeArea?.LocalizedName || '',
                  country: locationData.Country?.LocalizedName || 'Unknown',
                  formattedAddress: `${locationData.LocalizedName}, ${locationData.AdministrativeArea?.LocalizedName || ''}, ${locationData.Country?.LocalizedName || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, ''),
                };
              }
            } catch (accuWeatherError) {
              console.warn('⚠️ AccuWeather fallback also failed');
            }
            
            // If all else fails, return fallback
            return this.createFallbackGeocodingResult(latitude, longitude);
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log('📍 Reverse geocode results:', addresses?.length || 0, 'addresses found');

      if (!addresses?.length) {
        console.warn('⚠️ No addresses found, using fallback');
        return this.createFallbackGeocodingResult(latitude, longitude);
      }

      // Prefer addresses with more complete information
      const validAddresses = addresses.filter(addr => addr && typeof addr === 'object');
      
      if (!validAddresses.length) {
        console.warn('⚠️ No valid addresses found, using fallback');
        return this.createFallbackGeocodingResult(latitude, longitude);
      }
      
      const address = validAddresses.sort((a, b) => {
        try {
          const aScore = this.calculateAddressCompleteness(a);
          const bScore = this.calculateAddressCompleteness(b);
          return bScore - aScore;
        } catch (error) {
          console.warn('Error calculating address completeness:', error);
          return 0;
        }
      })[0];

      // Validate address object
      if (!address) {
        console.warn('⚠️ No valid address found, using fallback');
        return this.createFallbackGeocodingResult(latitude, longitude);
      }

      console.log('📍 Selected address:', {
        city: address.city,
        region: address.region,
        country: address.country,
        isoCountryCode: address.isoCountryCode
      });

      // Handle null/undefined values safely with more robust fallbacks
      const city = address.city || 
                   address.district || 
                   address.subregion || 
                   address.name || 
                   address.street ||
                   'Unknown Location';
      
      const region = address.region || 
                     address.subregion || 
                     address.administrativeArea ||
                     '';
      
      const country = address.country || 
                      address.isoCountryCode || 
                      'Unknown';

      return {
        city,
        region,
        country,
        formattedAddress: this.formatAddress(address),
      };
    } catch (error: any) {
      console.warn('⚠️ Reverse geocoding service unavailable, using fallback location');
      
      // Only log detailed errors in development
      if (__DEV__) {
        console.error('Reverse geocoding error details:', {
          message: error?.message,
          code: error?.code,
          type: error?.constructor?.name
        });
      }
      
      // If reverse geocoding fails completely, return fallback
      return this.createFallbackGeocodingResult(latitude || 0, longitude || 0);
    }
  }

  /**
   * ENHANCED: Find location using AccuWeather Geoposition Search API (Primary Method)
   * Falls back to text search if geoposition fails
   */
  async findLocationByCoordinates(
    latitude: number,
    longitude: number,
    retries = MAX_SEARCH_RETRIES
  ): Promise<LocationData | null> {
    // Import the geoposition search function
    const { getLocationByGeoposition } = await import('./weather');
    
    // STRATEGY 1: Use AccuWeather Geoposition Search API (RECOMMENDED)
    // This is the official way to convert GPS coordinates to location keys
    console.log('🎯 Strategy 1: AccuWeather Geoposition Search API');
    try {
      const location = await getLocationByGeoposition(latitude, longitude);
      if (location) {
        console.log(`✅ Geoposition API Success: ${location.LocalizedName}, ${location.Country?.LocalizedName}`);
        return location;
      }
    } catch (geoError) {
      console.warn('⚠️ Geoposition API failed, trying fallback methods:', geoError);
    }

    // STRATEGY 2: Fallback to text-based search with multiple strategies
    console.log('🔄 Strategy 2: Text-based search fallback');
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { city, region, country } = await this.getCityFromCoordinates(
          latitude,
          longitude
        );

        console.log(`📍 Location search attempt ${attempt}:`, {
          city,
          region,
          country,
          coordinates: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        });

        // Generate enhanced search queries with multiple strategies
        const searchQueries = this.generateEnhancedSearchQueries(city, region, country);
        console.log(`🔍 Trying ${searchQueries.length} search strategies:`, searchQueries);

        // Try each search query
        for (const searchQuery of searchQueries) {
          try {
            console.log(`🎯 Searching: "${searchQuery}"`);
            const locations = await searchLocation(searchQuery);

            if (locations.length > 0) {
              console.log(`✅ Found ${locations.length} locations for "${searchQuery}"`);
              
              // Find the closest match
              const closestLocation = this.findClosestLocation(
                locations, 
                latitude, 
                longitude
              );
              
              console.log(`🎯 Selected: ${closestLocation.LocalizedName}`);
              return closestLocation;
            }
          } catch (searchError) {
            console.warn(`❌ Search failed for "${searchQuery}":`, searchError);
            continue;
          }
        }

        // If no locations found with city search, try administrative area
        if (attempt === 1) {
          console.log('🔄 Trying administrative area search...');
          const adminLocation = await this.searchByAdministrativeArea(region, country);
          if (adminLocation) {
            console.log(`✅ Found administrative location: ${adminLocation.LocalizedName}`);
            return adminLocation;
          }
        }

        // Wait before retry with exponential backoff
        if (attempt < retries) {
          const delayTime = 1000 * attempt;
          console.log(`⏳ Waiting ${delayTime}ms before retry...`);
          await this.delay(delayTime);
        }
      } catch (error) {
        console.error(`💥 Location search attempt ${attempt} failed:`, error);
        if (attempt === retries) {
          break;
        }
      }
    }

    // STRATEGY 3: Final fallback - nearby locations search
    console.log('🔄 Strategy 3: Nearby locations search');
    const nearbyLocation = await this.findNearbyLocations(latitude, longitude, 100);
    if (nearbyLocation) {
      return nearbyLocation;
    }

    console.error('❌ No locations found with any search strategy');
    return null;
  }

  /**
   * NEW: Find nearby locations within radius
   */
  async findNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<LocationData | null> {
    try {
      console.log(`🔍 Searching for locations within ${radiusKm}km of ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      
      const { country } = await this.getCityFromCoordinates(latitude, longitude);
      
      if (!country) {
        console.log('❌ No country found for nearby search');
        return null;
      }
      
      // Search for the country to get all available locations
      const countryLocations = await searchLocation(country);
      
      if (countryLocations.length === 0) {
        console.log(`❌ No locations found for country: ${country}`);
        return null;
      }

      console.log(`📍 Found ${countryLocations.length} locations in ${country}`);
      
      // Filter locations within reasonable distance and find closest
      const nearbyLocations = countryLocations.filter(location => {
        if (!location.GeoPosition) return false;
        
        const distance = this.calculateDistance(
          latitude,
          longitude,
          location.GeoPosition.Latitude,
          location.GeoPosition.Longitude
        );
        
        return distance <= radiusKm;
      });

      if (nearbyLocations.length > 0) {
        console.log(`✅ Found ${nearbyLocations.length} locations within ${radiusKm}km`);
        const closest = this.findClosestLocation(nearbyLocations, latitude, longitude);
        console.log(`🎯 Closest nearby location: ${closest.LocalizedName}`);
        return closest;
      }

      // If none found within radius, return the closest location in the country
      console.log(`🔄 No locations within ${radiusKm}km, using closest in country`);
      const closestInCountry = this.findClosestLocation(countryLocations, latitude, longitude);
      console.log(`🎯 Closest in country: ${closestInCountry.LocalizedName}`);
      return closestInCountry;
      
    } catch (error) {
      console.error('💥 Nearby locations search failed:', error);
      return null;
    }
  }

  /**
   * ENHANCED: Main function for "My Location" weather feature with better fallbacks
   */
  async getMyLocationWeather(): Promise<{
    location: LocationData;
    coordinates: UserLocation;
    cityName: string;
    geocodingResult: GeocodingResult;
  }> {
    try {
      console.log('📍 Getting current location...');
      const coordinates = await this.getCurrentLocation({
        useLastKnown: true,
        highAccuracy: false,
      });

      console.log('✅ Coordinates obtained:', coordinates);

      // Try the enhanced location search (this will use Geoposition API first)
      let location = await this.findLocationByCoordinates(
        coordinates.latitude,
        coordinates.longitude
      );

      // Get readable location info (try reverse geocoding, but don't fail if it errors)
      let geocodingResult: GeocodingResult;
      try {
        geocodingResult = await this.getCityFromCoordinates(
          coordinates.latitude,
          coordinates.longitude
        );
        console.log('🏙️ Location detected:', geocodingResult);
      } catch (geocodeError) {
        console.warn('⚠️ Reverse geocoding failed, using location data instead');
        // Use the AccuWeather location data as fallback
        if (location) {
          geocodingResult = {
            city: location.LocalizedName,
            region: location.AdministrativeArea?.LocalizedName || '',
            country: location.Country?.LocalizedName || '',
            formattedAddress: `${location.LocalizedName}, ${location.AdministrativeArea?.LocalizedName || location.Country?.LocalizedName}`,
          };
        } else {
          geocodingResult = this.createFallbackGeocodingResult(
            coordinates.latitude,
            coordinates.longitude
          );
        }
      }

      // If still no location, try country capital as final fallback
      if (!location && geocodingResult.country !== 'Unknown') {
        console.log('🔄 Trying country capital fallback...');
        location = await this.searchCountryCapital(geocodingResult.country);
      }

      if (!location) {
        const error: LocationServiceError = {
          name: 'LocationNotFound',
          message: `Could not find weather data for your location (${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}). Try searching for a nearby city manually.`,
          code: LocationErrorCodes.NOT_FOUND,
          retryable: true,
          coordinates: { latitude: coordinates.latitude, longitude: coordinates.longitude }
        };
        throw error;
      }

      console.log('🎯 Final weather location found:', {
        name: location.LocalizedName,
        country: location.Country?.LocalizedName,
        coordinates: location.GeoPosition
      });

      // Update geocoding result with actual location data if we have it
      const finalCityName = `${location.LocalizedName}, ${location.AdministrativeArea?.LocalizedName || location.Country?.LocalizedName}`;

      return {
        location,
        coordinates,
        cityName: finalCityName,
        geocodingResult: {
          city: location.LocalizedName,
          region: location.AdministrativeArea?.LocalizedName || '',
          country: location.Country?.LocalizedName || '',
          formattedAddress: finalCityName,
        },
      };
    } catch (error: any) {
      console.error('💥 Failed to get location weather:', error);
      throw this.normalizeWeatherLocationError(error);
    }
  }

  /**
   * Check if location services are enabled
   */
  async isLocationEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error('Location services check failed:', error);
      return false;
    }
  }

  /**
   * Clear cached location data
   */
  clearCache(): void {
    this.lastKnownLocation = null;
    this.permissionCheckCache = null;
  }

  /**
   * Get last known location (if available)
   */
  getLastKnownLocation(): UserLocation | null {
    return this.lastKnownLocation;
  }

  // Private helper methods

  private async ensureLocationPermission(): Promise<boolean> {
    const hasPermission = await this.checkLocationPermission();
    if (hasPermission) {
      return true;
    }

    const permissionStatus = await this.requestLocationPermission();
    return permissionStatus.granted;
  }

  /**
   * ENHANCED: Generate multiple search strategies with better prioritization
   */
  private generateEnhancedSearchQueries(
    city: string,
    region: string,
    country: string
  ): string[] {
    const queries = [
      // Most specific combinations first
      city && region && country ? `${city}, ${region}, ${country}` : null,
      city && region ? `${city}, ${region}` : null,
      city && country ? `${city}, ${country}` : null,
      city,
      // Region/state level searches
      region && country ? `${region}, ${country}` : null,
      region,
      // Country level with major city fallback
      country ? this.getMajorCityForCountry(country) : null,
      country,
    ].filter((query): query is string => 
      query !== null && 
      query !== '' && 
      query !== 'Unknown Location' && 
      query !== 'Unknown'
    );

    // Remove duplicates while preserving order
    return [...new Set(queries)];
  }

  /**
   * NEW: Get major cities for countries as fallback
   */
  private getMajorCityForCountry(country: string): string | null {
    const majorCities: { [key: string]: string } = {
      'Myanmar': 'Yangon',
      'Burma': 'Yangon',
      'Thailand': 'Bangkok',
      'Vietnam': 'Hanoi',
      'Laos': 'Vientiane',
      'Cambodia': 'Phnom Penh',
      'India': 'New Delhi',
      'China': 'Beijing',
      'Malaysia': 'Kuala Lumpur',
      'Indonesia': 'Jakarta',
      'Philippines': 'Manila',
      'Bangladesh': 'Dhaka',
      'Pakistan': 'Karachi',
      'Sri Lanka': 'Colombo',
      'Nepal': 'Kathmandu',
      'Bhutan': 'Thimphu',
    };
    
    return majorCities[country] || null;
  }

  /**
   * NEW: Search by administrative area
   */
  private async searchByAdministrativeArea(
    region: string, 
    country: string
  ): Promise<LocationData | null> {
    if (!region || region === 'Unknown Location') return null;
    
    try {
      console.log(`🏛️ Searching administrative area: ${region}, ${country}`);
      const locations = await searchLocation(`${region}, ${country}`);
      return locations.length > 0 ? locations[0] : null;
    } catch (error) {
      console.warn('Administrative area search failed:', error);
      return null;
    }
  }

  /**
   * NEW: Search for country capital as final fallback
   */
  private async searchCountryCapital(country: string): Promise<LocationData | null> {
    if (!country || country === 'Unknown') return null;
    
    try {
      const capital = this.getMajorCityForCountry(country);
      if (capital) {
        console.log(`🏛️ Trying capital city: ${capital}, ${country}`);
        const capitalLocations = await searchLocation(`${capital}, ${country}`);
        if (capitalLocations.length > 0) {
          console.log(`✅ Using capital city: ${capitalLocations[0].LocalizedName}`);
          return capitalLocations[0];
        }
      }
      
      // Fallback to country search
      console.log(`🌍 Searching country: ${country}`);
      const countryLocations = await searchLocation(country);
      return countryLocations.length > 0 ? countryLocations[0] : null;
      
    } catch (error) {
      console.warn('Country capital search failed:', error);
      return null;
    }
  }

  private findClosestLocation(
    locations: LocationData[],
    targetLat: number,
    targetLon: number
  ): LocationData {
    if (locations.length === 1) {
      return locations[0];
    }

    return locations.reduce((closest, current) => {
      if (!current.GeoPosition) return closest;

      const currentDistance = this.calculateDistance(
        targetLat,
        targetLon,
        current.GeoPosition.Latitude,
        current.GeoPosition.Longitude
      );

      if (!closest.GeoPosition) return current;

      const closestDistance = this.calculateDistance(
        targetLat,
        targetLon,
        closest.GeoPosition.Latitude,
        closest.GeoPosition.Longitude
      );

      return currentDistance < closestDistance ? current : closest;
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateAddressCompleteness(address: any): number {
    if (!address) return 0;
    
    let score = 0;
    if (address.city) score += 3;
    if (address.region) score += 2;
    if (address.country || address.isoCountryCode) score += 2;
    if (address.district) score += 1;
    if (address.name) score += 1;
    if (address.subregion) score += 1;
    return score;
  }

  private formatAddress(address: any): string {
    if (!address) return 'Unknown Location';
    
    const parts = [
      address.city,
      address.region,
      address.country || address.isoCountryCode
    ].filter(part => part && part !== null && part !== undefined && part !== '');
    
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  }

  private createFallbackGeocodingResult(
    latitude: number,
    longitude: number
  ): GeocodingResult {
    // Try to provide a more meaningful location based on coordinates
    const coordinates = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    
    // Basic region detection based on coordinates
    let region = '';
    let country = '';
    
    // Very basic continent/region detection
    if (latitude >= 24 && latitude <= 49 && longitude >= -125 && longitude <= -66) {
      country = 'United States';
      region = 'North America';
    } else if (latitude >= 41 && latitude <= 71 && longitude >= -10 && longitude <= 40) {
      country = 'Europe';
      region = 'Europe';
    } else if (latitude >= -35 && latitude <= 37 && longitude >= -18 && longitude <= 51) {
      country = 'Africa';
      region = 'Africa';
    } else if (latitude >= -47 && latitude <= 81 && longitude >= 26 && longitude <= 180) {
      country = 'Asia';
      region = 'Asia';
    } else if (latitude >= -55 && latitude <= -10 && longitude >= -82 && longitude <= -34) {
      country = 'South America';
      region = 'South America';
    } else if (latitude >= -47 && latitude <= -10 && longitude >= 113 && longitude <= 154) {
      country = 'Australia';
      region = 'Oceania';
    }
    
    const cityName = country ? `Location in ${country}` : `Location ${coordinates}`;
    
    return {
      city: cityName,
      region,
      country,
      formattedAddress: country ? `${cityName}, ${country}` : `Location ${coordinates}`,
    };
  }

  private normalizeLocationError(error: any): LocationServiceError {
    if (error.code && error.message) {
      return error as LocationServiceError;
    }

    const normalizedError: LocationServiceError = {
      name: error.name || 'LocationError',
      message: error.message || 'Unknown location error occurred',
      code: LocationErrorCodes.LOCATION_UNAVAILABLE,
      retryable: true,
    };

    // Map common error patterns
    if (error.message?.includes('permission')) {
      normalizedError.code = LocationErrorCodes.PERMISSION_DENIED;
      normalizedError.retryable = false;
    } else if (error.message?.includes('network') || error.message?.includes('connect')) {
      normalizedError.code = LocationErrorCodes.NETWORK_ERROR;
      normalizedError.retryable = true;
    } else if (error.message?.includes('timeout')) {
      normalizedError.code = LocationErrorCodes.TIMEOUT;
      normalizedError.retryable = true;
    }

    return normalizedError;
  }

  private normalizeWeatherLocationError(error: any): LocationServiceError {
    const normalized = this.normalizeLocationError(error);

    // Enhance messages for better user experience
    switch (normalized.code) {
      case LocationErrorCodes.PERMISSION_DENIED:
        normalized.message =
          'Location permission denied. Please enable location access in your device settings.';
        break;
      case LocationErrorCodes.SERVICE_DISABLED:
        normalized.message =
          'Location services are disabled. Please enable them in your device settings.';
        break;
      case LocationErrorCodes.NETWORK_ERROR:
        normalized.message =
          'Network error. Please check your internet connection and try again.';
        break;
      case LocationErrorCodes.TIMEOUT:
        normalized.message =
          'Location request timed out. Please check your connection and try again.';
        break;
      case LocationErrorCodes.NOT_FOUND:
        // Keep the original detailed message for NOT_FOUND errors
        break;
    }

    return normalized;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const locationService = LocationService.getInstance();

// Legacy function exports for backward compatibility
export async function requestLocationPermission(): Promise<LocationPermissionStatus> {
  return locationService.requestLocationPermission();
}

export async function checkLocationPermission(): Promise<boolean> {
  return locationService.checkLocationPermission();
}

export async function getCurrentLocation(): Promise<UserLocation> {
  return locationService.getCurrentLocation();
}

export async function getCityFromCoordinates(
  latitude: number,
  longitude: number
): Promise<GeocodingResult> {
  return locationService.getCityFromCoordinates(latitude, longitude);
}

export async function findLocationByCoordinates(
  latitude: number,
  longitude: number
): Promise<LocationData | null> {
  return locationService.findLocationByCoordinates(latitude, longitude);
}

export async function getMyLocationWeather(): Promise<{
  location: LocationData;
  coordinates: UserLocation;
  cityName: string;
  geocodingResult: GeocodingResult;
}> {
  return locationService.getMyLocationWeather();
}

export async function isLocationEnabled(): Promise<boolean> {
  return locationService.isLocationEnabled();
}

export function clearLocationCache(): void {
  locationService.clearCache();
}

export function getLastKnownLocation(): UserLocation | null {
  return locationService.getLastKnownLocation();
}

/**
 * NEW: Debug function to identify location issues
 */
export async function debugLocationIssue(): Promise<{
  success: boolean;
  step: string;
  data?: any;
  error?: string;
}> {
  try {
    console.log('=== 🐛 LOCATION DEBUG START ===');
    
    // 1. Check location services
    const servicesEnabled = await locationService.isLocationEnabled();
    console.log('1. Location services enabled:', servicesEnabled);
    if (!servicesEnabled) {
      return { success: false, step: 'location_services', error: 'Location services disabled' };
    }
    
    // 2. Check permissions
    const hasPermission = await locationService.checkLocationPermission();
    console.log('2. Location permission granted:', hasPermission);
    
    if (!hasPermission) {
      const permission = await locationService.requestLocationPermission();
      console.log('3. Permission request result:', permission);
      if (!permission.granted) {
        return { success: false, step: 'permission', error: 'Location permission denied' };
      }
    }
    
    // 3. Try to get location
    console.log('4. Attempting to get location...');
    const location = await locationService.getCurrentLocation();
    console.log('5. Location obtained:', location);
    
    // 4. Try reverse geocoding
    console.log('6. Attempting reverse geocoding...');
    const cityInfo = await locationService.getCityFromCoordinates(
      location.latitude, 
      location.longitude
    );
    console.log('7. City info:', cityInfo);
    
    // 5. Try location search
    console.log('8. Attempting location search...');
    const weatherLocation = await locationService.findLocationByCoordinates(
      location.latitude,
      location.longitude
    );
    console.log('9. Weather location found:', weatherLocation);
    
    console.log('=== ✅ LOCATION DEBUG END ===');
    
    return { 
      success: true, 
      step: 'complete', 
      data: { location, cityInfo, weatherLocation } 
    };
    
  } catch (error: any) {
    console.error('=== ❌ LOCATION DEBUG FAILED ===');
    console.error('Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    return { 
      success: false, 
      step: 'error', 
      error: error.message 
    };
  }
}