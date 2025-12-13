import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useCities } from '../../context/CitiesContext';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { searchLocation, autocompleteLocation, LocationData } from '../../services/weatherAdapter';
import { getMyLocationWeather } from '../../services/location';

export default function AddCity() {
  const { colors } = useTheme();
  const { addCity } = useCities();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      setShowSuggestions(false);
      const results = await searchLocation(searchQuery);
      setLocations(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setLocations([]);
    
    if (text.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleAddCity = async (city: LocationData) => {
    await addCity(city);
    router.back();
  };

  const handleMyLocation = async () => {
    try {
      setLoadingLocation(true);
      console.log('📍 Getting your location...');
      
      const { location } = await getMyLocationWeather();
      
      console.log('✅ Location found, adding city...');
      await addCity(location);
      router.back();
    } catch (error: any) {
      console.error('❌ My Location error:', error);
      
      let errorMessage = 'Failed to get your location.';
      
      if (error.code === 'PERMISSION_DENIED') {
        errorMessage = 'Location permission denied. Please enable location access in your device settings.';
      } else if (error.code === 'SERVICE_DISABLED') {
        errorMessage = 'Location services are disabled. Please enable them in your device settings.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoadingLocation(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <AntDesign name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, flex: 1 }}>
            Add City
          </Text>
        </View>

        {/* Search Bar */}
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.input, borderRadius: 12, paddingHorizontal: 16 }}>
              <AntDesign name="search1" size={20} color={colors.textSecondary} />
              <TextInput
                value={searchQuery}
                onChangeText={handleSearchChange}
                placeholder="Search for a city..."
                placeholderTextColor={colors.textSecondary}
                style={{ flex: 1, padding: 16, fontSize: 16, color: colors.text }}
                onSubmitEditing={handleSearch}
                autoFocus
                autoCorrect={false}
                autoCapitalize="words"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setLocations([]);
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}>
                  <AntDesign name="close" size={18} color={colors.textSecondary} />
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
                paddingHorizontal: 16,
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
              disabled={searching}
              style={{ backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' }}
            >
              {searching ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <AntDesign name="search1" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
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
                  {loadingSuggestions ? 'Searching...' : 'Suggestions'}
                </Text>
                {suggestions.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}>
                    <Text style={{ color: colors.primary, fontSize: 14 }}>
                      Clear
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
                    Finding locations...
                  </Text>
                </View>
              ) : suggestions.length > 0 ? (
                <View style={{ gap: 12 }}>
                  {suggestions.map((location) => (
                    <TouchableOpacity
                      key={location.Key}
                      onPress={() => handleAddCity(location)}
                      style={{
                        backgroundColor: colors.card,
                        borderRadius: 16,
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
                          backgroundColor: colors.success + '20',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <AntDesign
                          name="plus"
                          size={18}
                          color={colors.success}
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
                    No suggestions found for "{searchQuery}"
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                    Try a different spelling or press search
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          {/* Search Results */}
          {locations.length > 0 ? (
            <View style={{ gap: 12, marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Search Results
              </Text>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location.Key}
                  onPress={() => handleAddCity(location)}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginBottom: 4 }}>
                      {location.LocalizedName}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                      {location.AdministrativeArea.LocalizedName}, {location.Country.LocalizedName}
                    </Text>
                  </View>
                  <AntDesign name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          ) : !showSuggestions && searchQuery.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
              <Text style={{ fontSize: 60, marginBottom: 16 }}>🌍</Text>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' }}>
                Add a City
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 24, paddingHorizontal: 40 }}>
                Search for a city or use your current location
              </Text>
              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 28, 
                    backgroundColor: colors.primary + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <AntDesign name="search1" size={24} color={colors.primary} />
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Type to search</Text>
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>or</Text>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 28, 
                    backgroundColor: '#10B981' + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#10B981" />
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Use GPS</Text>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
