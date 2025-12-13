import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../context/ThemeContext';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useNotificationCount } from '../../../context/NotificationContext';
import { useSettings } from '../../../context/SettingsContext';
import { useCities } from '../../../context/CitiesContext';
import {
  searchLocation,
  autocompleteLocation,
  getCurrentConditions,
  get5DayForecast,
  get12HourForecast,
  getWeatherIcon,
  getCurrentWeatherProvider,
  LocationData,
  CurrentConditions,
  DailyForecast,
  HourlyForecast,
} from '../../../services/weatherAdapter';
import { getMyLocationWeather } from '../../../services/location';
import { useLanguage } from '../../../context/LanguageContext';

export default function Weather() {
  const { colors } = useTheme();
  const router = useRouter();
  const { unreadCount } = useNotificationCount();
  const { addCity } = useCities();
  const { settings, convertTemperature, getTemperatureSymbol, convertSpeed, getSpeedSymbol, convertDistance, getDistanceSymbol } = useSettings();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [currentWeather, setCurrentWeather] =
    useState<CurrentConditions | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDefaultLocation();
    loadRecentSearches();
  }, []);

  // Autocomplete with debouncing
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setLoadingSuggestions(true);
        try {
          const results = await autocompleteLocation(searchQuery);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Autocomplete error:', error);
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (location: LocationData) => {
    try {
      const updated = [
        location,
        ...recentSearches.filter((l) => l.Key !== location.Key),
      ].slice(0, 5);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem('recentSearches');
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const loadDefaultLocation = async () => {
    try {
      setLoading(true);
      
      // Check if user has enabled auto-location from settings
      const hasShownLocationPrompt = await AsyncStorage.getItem('hasShownLocationPrompt');
      
      // Try to load user's current location automatically
      if (settings.autoLocationEnabled || !hasShownLocationPrompt) {
        console.log('🎯 Attempting to load user location automatically...');
        
        try {
          const { location } = await getMyLocationWeather();
          console.log('✅ Auto-location successful:', location.LocalizedName);
          
          // Mark that we've shown the prompt
          if (!hasShownLocationPrompt) {
            await AsyncStorage.setItem('hasShownLocationPrompt', 'true');
          }
          
          await selectLocation(location, false);
          return; // Success, exit early
        } catch (locationError: any) {
          console.log('⚠️ Auto-location failed:', locationError.code || locationError.message);
          
          // Mark that we've tried
          if (!hasShownLocationPrompt) {
            await AsyncStorage.setItem('hasShownLocationPrompt', 'true');
          }
          
          // Don't show error alert on first load, just fall back to default
        }
      }
      
      // Fallback to default location (San Francisco)
      console.log('📍 Loading default location (San Francisco)...');
      const results = await searchLocation('San Francisco');
      if (results.length > 0) {
        await selectLocation(results[0], false);
      }
    } catch (error) {
      console.error('Error loading default location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    Keyboard.dismiss();
    setShowSearchResults(true);
    setError('');

    try {
      setSearching(true);
      const results = await searchLocation(searchQuery);
      setLocations(results);

      if (results.length === 0) {
        setError('No cities found. Try a different search term.');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      setError(
        error?.message ||
          'Failed to search. Please check your internet connection and try again.'
      );
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = async (
    location: LocationData,
    saveToRecent = true
  ) => {
    try {
      setLoading(true);
      setSelectedLocation(location);
      setLocations([]);
      setSearchQuery('');
      setShowSearchResults(false);
      Keyboard.dismiss();

      if (saveToRecent) {
        await saveRecentSearch(location);
      }

      const [weather, forecastData, hourlyData] = await Promise.all([
        getCurrentConditions(location.Key),
        get5DayForecast(location.Key),
        get12HourForecast(location.Key),
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
      setHourlyForecast(hourlyData);
    } catch (error) {
      console.error('Error loading weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (!showSearchResults && recentSearches.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowSearchResults(false);
    setLocations([]);
    setError('');
    
    // Show suggestions as user types
    if (text.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleMyLocation = async () => {
    try {
      setLoadingLocation(true);
      setError('');
      
      console.log('📍 Getting your location...');
      const { location, coordinates, cityName, geocodingResult } = await getMyLocationWeather();
      
      console.log('✅ Location found:', cityName);
      
      // Show options dialog
      Alert.alert(
        '📍 Location Found',
        `Your location: ${cityName}\n\nWhat would you like to do?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'View Weather',
            onPress: () => selectLocation(location, true),
          },
          {
            text: 'Add to Cities',
            onPress: async () => {
              try {
                await addCity(location);
                Alert.alert(
                  '✅ Success',
                  `${cityName} has been added to your locations!`,
                  [
                    {
                      text: 'OK',
                      onPress: () => selectLocation(location, false),
                    },
                  ]
                );
              } catch (addError: any) {
                Alert.alert('Error', 'Failed to add location to your cities.');
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ My Location error:', error);
      
      let errorMessage = 'Failed to get your location.';
      
      if (error.code === 'PERMISSION_DENIED') {
        errorMessage = 'Location permission denied. Please enable location access in your device settings.';
      } else if (error.code === 'SERVICE_DISABLED') {
        errorMessage = 'Location services are disabled. Please enable them in your device settings.';
      } else if (error.code === 'TIMEOUT') {
        errorMessage = 'Location request timed out. Please check your connection and try again.';
      } else if (error.code === 'NOT_FOUND') {
        errorMessage = error.message || 'Could not find weather data for your location. Try searching manually.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      Alert.alert('Location Error', errorMessage);
    } finally {
      setLoadingLocation(false);
    }
  };

  if (loading && !currentWeather) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 16 }}>
          {t('common.loading')}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled">
        <View style={{ padding: 24 }}>
          {/* Header */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: colors.text,
                }}>
                {t('home.title')}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(app)/alerts')}
                style={{
                  backgroundColor: colors.error,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: colors.error,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <AntDesign name="warning" size={20} color="white" />
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      backgroundColor: '#FF3B30',
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 6,
                      borderWidth: 2,
                      borderColor: colors.background,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
              <View
                style={{
                  backgroundColor: colors.errorLight,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <AntDesign name="warning" size={20} color={colors.error} />
                <Text style={{ color: colors.error, flex: 1, fontSize: 14 }}>
                  {error}
                </Text>
              </View>
            )}

            {/* Search Bar */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.input,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                }}>
                <AntDesign
                  name="search"
                  size={18}
                  color={colors.textSecondary}
                />
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  onFocus={handleSearchFocus}
                  placeholder={t('search.searchCity')}
                  placeholderTextColor={colors.textSecondary}
                  style={{
                    flex: 1,
                    padding: 16,
                    fontSize: 16,
                    color: colors.text,
                  }}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="words"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery('');
                      setLocations([]);
                      setSuggestions([]);
                      setShowSearchResults(false);
                      setShowSuggestions(false);
                    }}>
                    <AntDesign
                      name="close"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
              
              {/* My Location Button */}
              <TouchableOpacity
                onPress={handleMyLocation}
                disabled={loadingLocation}
                style={{
                  backgroundColor: loadingLocation ? colors.card : '#10B981',
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                  minWidth: 56,
                  alignItems: 'center',
                }}>
                {loadingLocation ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={22}
                    color="white"
                  />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSearch}
                disabled={searching || !searchQuery.trim()}
                style={{
                  backgroundColor: searchQuery.trim()
                    ? colors.primary
                    : colors.card,
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                }}>
                {searching ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <AntDesign
                    name="search"
                    size={20}
                    color={searchQuery.trim() ? 'white' : colors.textSecondary}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Auto-Suggestions */}
          {showSuggestions && searchQuery.trim().length >= 2 && (
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                  }}>
                  {loadingSuggestions ? t('search.searching') : t('search.suggestions')}
                </Text>
                {suggestions.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}>
                    <Text style={{ color: colors.primary, fontSize: 14 }}>
                      {t('search.clear')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {loadingSuggestions ? (
                <View style={{ 
                  backgroundColor: colors.card, 
                  borderRadius: 12, 
                  padding: 24,
                  alignItems: 'center' 
                }}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={{ color: colors.textSecondary, marginTop: 8, fontSize: 14 }}>
                    {t('search.findingLocations')}
                  </Text>
                </View>
              ) : suggestions.length > 0 ? (
                <View style={{ gap: 8 }}>
                  {suggestions.map((location) => (
                    <TouchableOpacity
                      key={location.Key}
                      onPress={() => {
                        selectLocation(location);
                        setShowSuggestions(false);
                      }}
                      style={{
                        backgroundColor: colors.card,
                        borderRadius: 12,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: colors.primary + '20',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <AntDesign
                          name="search"
                          size={18}
                          color={colors.primary}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: colors.text,
                            fontWeight: '600',
                            fontSize: 16,
                            marginBottom: 2,
                          }}>
                          {location.LocalizedName}
                        </Text>
                        <Text
                          style={{ color: colors.textSecondary, fontSize: 13 }}>
                          {location.AdministrativeArea.LocalizedName},{' '}
                          {location.Country.LocalizedName}
                        </Text>
                      </View>
                      <AntDesign
                        name="right"
                        size={16}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : searchQuery.trim().length >= 2 && !loadingSuggestions ? (
                <View style={{ 
                  backgroundColor: colors.card, 
                  borderRadius: 12, 
                  padding: 20,
                  alignItems: 'center' 
                }}>
                  <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>
                    {t('search.noSuggestions', { query: searchQuery })}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                    {t('search.tryDifferentSpelling')}
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          {/* Search Results */}
          {showSearchResults && locations.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                  }}>
                  {t('search.searchResults')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setLocations([]);
                    setShowSearchResults(false);
                  }}>
                  <Text style={{ color: colors.primary, fontSize: 14 }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ gap: 8 }}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location.Key}
                    onPress={() => selectLocation(location)}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 12,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <AntDesign
                      name="environment"
                      size={20}
                      color={colors.primary}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontWeight: '500',
                          fontSize: 16,
                        }}>
                        {location.LocalizedName}
                      </Text>
                      <Text
                        style={{ color: colors.textSecondary, fontSize: 14 }}>
                        {location.AdministrativeArea.LocalizedName},{' '}
                        {location.Country.LocalizedName}
                      </Text>
                    </View>
                    <AntDesign
                      name="right"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Recent Searches */}
          {showSearchResults &&
            locations.length === 0 &&
            recentSearches.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: colors.text,
                    }}>
                    {t('search.recentSearches')}
                  </Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={{ color: colors.primary, fontSize: 14 }}>
                      {t('search.clearAll')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ gap: 8 }}>
                  {recentSearches.map((location) => (
                    <TouchableOpacity
                      key={location.Key}
                      onPress={() => selectLocation(location)}
                      style={{
                        backgroundColor: colors.card,
                        borderRadius: 12,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}>
                      <AntDesign
                        name={"clockcircle" as any}
                        size={20}
                        color={colors.textSecondary}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: colors.text,
                            fontWeight: '500',
                            fontSize: 16,
                          }}>
                          {location.LocalizedName}
                        </Text>
                        <Text
                          style={{ color: colors.textSecondary, fontSize: 14 }}>
                          {location.AdministrativeArea.LocalizedName},{' '}
                          {location.Country.LocalizedName}
                        </Text>
                      </View>
                      <AntDesign
                        name="right"
                        size={16}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

          {/* Current Weather */}
          {currentWeather && selectedLocation && !showSearchResults && (
            <>
              <View
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 24,
                  padding: 24,
                  marginBottom: 24,
                }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 70, marginBottom: 16 }}>
                    {getWeatherIcon(currentWeather.WeatherIcon)}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 56,
                      fontWeight: 'bold',
                      marginBottom: 8,
                    }}>
                    {Math.round(convertTemperature(currentWeather.Temperature.Imperial.Value))}{getTemperatureSymbol()}
                  </Text>
                  <Text
                    style={{ color: 'white', fontSize: 22, marginBottom: 8 }}>
                    {currentWeather.WeatherText}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                    <AntDesign
                      name="environment"
                      size={14}
                      color="rgba(255,255,255,0.7)"
                    />
                    <Text
                      style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
                      {selectedLocation.LocalizedName},{' '}
                      {selectedLocation.AdministrativeArea.LocalizedName}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Quick Action Buttons */}
              <View style={{ gap: 12, marginBottom: 24 }}>
                <TouchableOpacity
                  onPress={() => {
                    const cityName = selectedLocation.LocalizedName;
                    const cityRegion = selectedLocation.AdministrativeArea.LocalizedName;
                    const coordinates = {
                      lat: selectedLocation.GeoPosition?.Latitude || 37.7749,
                      lon: selectedLocation.GeoPosition?.Longitude || -122.4194,
                    };
                    
                    router.push({
                      pathname: '/(app)/air-quality',
                      params: {
                        cityName: `${cityName}, ${cityRegion}`,
                        lat: coordinates?.lat || 37.7749,
                        lon: coordinates?.lon || -122.4194,
                      },
                    });
                  }}
                  style={{
                    backgroundColor: '#6366F1',
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 24 }}>🌫️</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}>
                        Air Quality Index
                      </Text>
                      <Text
                        style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        Check pollution levels & health tips
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const cityName = selectedLocation.LocalizedName;
                    const cityRegion = selectedLocation.AdministrativeArea.LocalizedName;
                    const coordinates = {
                      lat: selectedLocation.GeoPosition?.Latitude || 37.7749,
                      lon: selectedLocation.GeoPosition?.Longitude || -122.4194,
                    };
                    
                    router.push({
                      pathname: '/(app)/astronomy',
                      params: {
                        cityName: `${cityName}, ${cityRegion}`,
                        lat: coordinates?.lat || 37.7749,
                        lon: coordinates?.lon || -122.4194,
                      },
                    });
                  }}
                  style={{
                    backgroundColor: '#FF6B35',
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 24 }}>🌅</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}>
                        Sun & Moon
                      </Text>
                      <Text
                        style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        Sunrise, sunset & moon phases
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const cityName = selectedLocation.LocalizedName;
                    const cityRegion = selectedLocation.AdministrativeArea.LocalizedName;
                    
                    router.push({
                      pathname: '/(app)/farming-advice',
                      params: {
                        temperature: Math.round(
                          currentWeather.Temperature.Imperial.Value
                        ),
                        humidity: currentWeather.RelativeHumidity,
                        weatherText: currentWeather.WeatherText,
                        cityName: `${cityName}, ${cityRegion}`,
                      },
                    });
                  }}
                  style={{
                    backgroundColor: colors.success,
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 24 }}>🌾</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}>
                        Farming Advice
                      </Text>
                      <Text
                        style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        Get agricultural recommendations
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>

                {/* Planting Schedule Card */}
                <TouchableOpacity
                  onPress={() => {
                    const cityName = selectedLocation.LocalizedName;
                    const cityRegion = selectedLocation.AdministrativeArea.LocalizedName;
                    
                    router.push({
                      pathname: '/(app)/planting-schedule',
                      params: {
                        temperature: Math.round(
                          currentWeather.Temperature.Imperial.Value
                        ),
                        cityName: `${cityName}, ${cityRegion}`,
                      },
                    });
                  }}
                  style={{
                    backgroundColor: '#8B5CF6',
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 24 }}>📅</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}>
                        What Time to Grow
                      </Text>
                      <Text
                        style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        Optimal planting schedules
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>

                {/* Organic Fertilizer Card */}
                <TouchableOpacity
                  onPress={() => {
                    const cityName = selectedLocation.LocalizedName;
                    const cityRegion = selectedLocation.AdministrativeArea.LocalizedName;
                    
                    router.push({
                      pathname: '/(app)/organic-fertilizer',
                      params: {
                        temperature: Math.round(
                          currentWeather.Temperature.Imperial.Value
                        ),
                        humidity: currentWeather.RelativeHumidity,
                        weatherText: currentWeather.WeatherText,
                        cityName: `${cityName}, ${cityRegion}`,
                      },
                    });
                  }}
                  style={{
                    backgroundColor: '#059669',
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 24 }}>🍃</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}>
                        Organic Fertilizers
                      </Text>
                      <Text
                        style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        Natural plant nutrition recipes
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>

                {/* Sustainable Farming Card */}
                <TouchableOpacity
                  onPress={() => {
                    const cityName = selectedLocation.LocalizedName;
                    const cityRegion = selectedLocation.AdministrativeArea.LocalizedName;
                    
                    router.push({
                      pathname: '/(app)/sustainable-farming',
                      params: {
                        temperature: Math.round(
                          currentWeather.Temperature.Imperial.Value
                        ),
                        humidity: currentWeather.RelativeHumidity,
                        weatherText: currentWeather.WeatherText,
                        cityName: `${cityName}, ${cityRegion}`,
                        elevation: 100, // Default elevation, can be enhanced with location data
                      },
                    });
                  }}
                  style={{
                    backgroundColor: '#7C3AED',
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 24 }}>🌍</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}>
                        Sustainable Farming
                      </Text>
                      <Text
                        style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        Location-based sustainable practices
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Hourly Forecast */}
              {hourlyForecast.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                    12-Hour Forecast
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                    {hourlyForecast.map((hour, index) => {
                      const time = new Date(hour.DateTime);
                      const timeString = time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                      const isNow = index === 0;
                      
                      return (
                        <View
                          key={index}
                          style={{
                            backgroundColor: isNow ? colors.primary : colors.card,
                            borderRadius: 16,
                            padding: 16,
                            minWidth: 100,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: isNow ? colors.primary : colors.border,
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '600', color: isNow ? 'white' : colors.text, marginBottom: 8 }}>
                            {isNow ? 'Now' : timeString}
                          </Text>
                          <Text style={{ fontSize: 36, marginBottom: 8 }}>
                            {getWeatherIcon(hour.WeatherIcon)}
                          </Text>
                          <Text style={{ fontSize: 20, fontWeight: 'bold', color: isNow ? 'white' : colors.text, marginBottom: 8 }}>
                            {Math.round(convertTemperature(hour.Temperature.Value))}{getTemperatureSymbol()}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                            <Text style={{ fontSize: 16 }}>💧</Text>
                            <Text style={{ fontSize: 12, color: isNow ? 'rgba(255,255,255,0.9)' : colors.textSecondary }}>
                              {hour.PrecipitationProbability}%
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={{ fontSize: 16 }}>💨</Text>
                            <Text style={{ fontSize: 12, color: isNow ? 'rgba(255,255,255,0.9)' : colors.textSecondary }}>
                              {Math.round(convertSpeed(hour.Wind.Speed.Value))} {getSpeedSymbol()}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Weather Details Grid */}
              <View style={{ marginBottom: 32 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 12,
                  }}>
                  Details
                </Text>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {[
                    {
                      icon: '💨',
                      label: 'Wind',
                      value: `${Math.round(
                        convertSpeed(currentWeather.Wind.Speed.Imperial.Value)
                      )} ${getSpeedSymbol()}`,
                    },
                    {
                      icon: '💧',
                      label: 'Humidity',
                      value: `${currentWeather.RelativeHumidity}%`,
                    },
                    {
                      icon: '👁️',
                      label: 'Visibility',
                      value: `${convertDistance(currentWeather.Visibility.Imperial.Value).toFixed(1)} ${getDistanceSymbol()}`,
                    },
                    {
                      icon: '🌡️',
                      label: 'Feels Like',
                      value: `${Math.round(
                        convertTemperature(currentWeather.RealFeelTemperature.Imperial.Value)
                      )}${getTemperatureSymbol()}`,
                    },
                  ].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.card,
                        borderRadius: 16,
                        padding: 16,
                        flex: 1,
                        minWidth: '45%',
                        alignItems: 'center',
                      }}>
                      <Text style={{ fontSize: 32, marginBottom: 8 }}>
                        {item.icon}
                      </Text>
                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontSize: 12,
                          marginBottom: 4,
                        }}>
                        {item.label}
                      </Text>
                      <Text
                        style={{
                          color: colors.text,
                          fontWeight: '600',
                          fontSize: 16,
                        }}>
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 5-Day Forecast */}
              {forecast.length > 0 && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: colors.text,
                      }}>
                      5-Day Forecast
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const cityName = selectedLocation.LocalizedName;
                        const cityRegion = selectedLocation.AdministrativeArea.LocalizedName;
                        
                        router.push({
                          pathname: '/(app)/weather-detail',
                          params: {
                            forecast: JSON.stringify(forecast),
                            cityName: `${cityName}, ${cityRegion}`,
                            currentTemp: Math.round(
                              currentWeather.Temperature.Imperial.Value
                            ),
                            weatherText: currentWeather.WeatherText,
                            weatherIcon: currentWeather.WeatherIcon,
                          },
                        });
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 14,
                          fontWeight: '600',
                        }}>
                        View Details
                      </Text>
                      <AntDesign
                        name="right"
                        size={14}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ gap: 10 }}>
                    {forecast.map((day, index) => {
                      const date = new Date(day.Date);
                      const dayName =
                        index === 0
                          ? 'Today'
                          : date.toLocaleDateString('en-US', {
                              weekday: 'short',
                            });
                      const monthDay = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });

                      return (
                        <View
                          key={index}
                          style={{
                            backgroundColor: colors.card,
                            borderRadius: 16,
                            padding: 18,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                color: colors.text,
                                fontWeight: '600',
                                fontSize: 16,
                                marginBottom: 2,
                              }}>
                              {dayName}
                            </Text>
                            <Text
                              style={{
                                color: colors.textSecondary,
                                fontSize: 13,
                              }}>
                              {monthDay}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 16,
                            }}>
                            <Text style={{ fontSize: 32 }}>
                              {getWeatherIcon(day.Day.Icon)}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                gap: 12,
                                minWidth: 80,
                                justifyContent: 'flex-end',
                              }}>
                              <Text
                                style={{
                                  color: colors.text,
                                  fontWeight: '700',
                                  fontSize: 18,
                                }}>
                                {Math.round(convertTemperature(day.Temperature.Maximum.Value))}{getTemperatureSymbol()}
                              </Text>
                              <Text
                                style={{
                                  color: colors.textSecondary,
                                  fontSize: 18,
                                }}>
                                {Math.round(convertTemperature(day.Temperature.Minimum.Value))}{getTemperatureSymbol()}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
