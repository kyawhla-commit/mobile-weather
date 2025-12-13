import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface CachedWeatherData {
  locationKey: string;
  cityName: string;
  currentWeather: any;
  forecast: any[];
  hourlyForecast: any[];
  alerts: any[];
  timestamp: number;
  expiresAt: number;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const CACHE_PREFIX = 'weather_cache_';
const LAST_SYNC_KEY = 'last_sync_timestamp';
const OFFLINE_QUEUE_KEY = 'offline_queue';

// Check if device is online
export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
}

// Get network state
export async function getNetworkState() {
  return await NetInfo.fetch();
}

// Cache weather data
export async function cacheWeatherData(data: CachedWeatherData): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX}${data.locationKey}`;
    const cacheData = {
      ...data,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION,
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`Cached weather data for ${data.cityName}`);
  } catch (error) {
    console.error('Error caching weather data:', error);
  }
}

// Get cached weather data
export async function getCachedWeatherData(locationKey: string): Promise<CachedWeatherData | null> {
  try {
    const cacheKey = `${CACHE_PREFIX}${locationKey}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }

    const data: CachedWeatherData = JSON.parse(cached);
    
    // Check if cache is still valid
    if (Date.now() > data.expiresAt) {
      console.log(`Cache expired for ${data.cityName}`);
      return null;
    }

    console.log(`Using cached data for ${data.cityName}`);
    return data;
  } catch (error) {
    console.error('Error getting cached weather data:', error);
    return null;
  }
}

// Get all cached cities
export async function getAllCachedCities(): Promise<CachedWeatherData[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    const cachedData = await Promise.all(
      cacheKeys.map(async (key) => {
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      })
    );

    return cachedData.filter(data => data !== null && Date.now() <= data.expiresAt);
  } catch (error) {
    console.error('Error getting all cached cities:', error);
    return [];
  }
}

// Clear expired cache
export async function clearExpiredCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    for (const key of cacheKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const parsed: CachedWeatherData = JSON.parse(data);
        if (Date.now() > parsed.expiresAt) {
          await AsyncStorage.removeItem(key);
          console.log(`Removed expired cache: ${key}`);
        }
      }
    }
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
}

// Clear all cache
export async function clearAllCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    console.log('Cleared all weather cache');
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
}

// Get cache age in minutes
export function getCacheAge(data: CachedWeatherData): number {
  return Math.floor((Date.now() - data.timestamp) / 60000);
}

// Check if cache is fresh (less than 10 minutes old)
export function isCacheFresh(data: CachedWeatherData): boolean {
  return getCacheAge(data) < 10;
}

// Update last sync timestamp
export async function updateLastSync(): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error updating last sync:', error);
  }
}

// Get last sync timestamp
export async function getLastSync(): Promise<number | null> {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error getting last sync:', error);
    return null;
  }
}

// Get time since last sync in minutes
export async function getTimeSinceLastSync(): Promise<number | null> {
  const lastSync = await getLastSync();
  if (!lastSync) return null;
  return Math.floor((Date.now() - lastSync) / 60000);
}

// Offline queue for actions to perform when back online
interface QueuedAction {
  id: string;
  type: 'add_city' | 'remove_city' | 'update_settings';
  data: any;
  timestamp: number;
}

export async function addToOfflineQueue(action: Omit<QueuedAction, 'id' | 'timestamp'>): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    const newAction: QueuedAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    queue.push(newAction);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to offline queue:', error);
  }
}

export async function getOfflineQueue(): Promise<QueuedAction[]> {
  try {
    const queue = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error getting offline queue:', error);
    return [];
  }
}

export async function clearOfflineQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch (error) {
    console.error('Error clearing offline queue:', error);
  }
}

// Process offline queue when back online
export async function processOfflineQueue(): Promise<void> {
  const online = await isOnline();
  if (!online) return;

  const queue = await getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`Processing ${queue.length} queued actions`);

  // Process each action
  for (const action of queue) {
    try {
      // Handle different action types
      switch (action.type) {
        case 'add_city':
          // Re-fetch weather data for added city
          console.log('Processing queued add_city action');
          break;
        case 'remove_city':
          // Clean up cache for removed city
          await AsyncStorage.removeItem(`${CACHE_PREFIX}${action.data.locationKey}`);
          break;
        case 'update_settings':
          // Sync settings if needed
          console.log('Processing queued update_settings action');
          break;
      }
    } catch (error) {
      console.error(`Error processing action ${action.id}:`, error);
    }
  }

  // Clear queue after processing
  await clearOfflineQueue();
  await updateLastSync();
}

// Get cache statistics
export async function getCacheStats(): Promise<{
  totalCached: number;
  freshCache: number;
  expiredCache: number;
  totalSize: string;
}> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    let freshCount = 0;
    let expiredCount = 0;
    let totalSize = 0;

    for (const key of cacheKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        totalSize += data.length;
        const parsed: CachedWeatherData = JSON.parse(data);
        if (Date.now() > parsed.expiresAt) {
          expiredCount++;
        } else if (isCacheFresh(parsed)) {
          freshCount++;
        }
      }
    }

    return {
      totalCached: cacheKeys.length,
      freshCache: freshCount,
      expiredCache: expiredCount,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalCached: 0,
      freshCache: 0,
      expiredCache: 0,
      totalSize: '0 KB',
    };
  }
}
