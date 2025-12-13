import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {
  getCurrentConditions,
  get5DayForecast,
  get12HourForecast,
  getWeatherIcon,
  getWeatherAlerts,
  generateSmartAlerts,
  getLocationDetails,
} from '../../services/weather';
import { getWeatherTheme, isNightTime } from '../../services/weatherThemes';
import WeatherBackground from '../../components/WeatherBackground';
import AnimatedWeatherCard from '../../components/AnimatedWeatherCard';

export default function CityDetail() {
  const { colors, isDark } = useTheme();
  const {
    convertTemperature,
    getTemperatureSymbol,
    convertSpeed,
    getSpeedSymbol,
  } = useSettings();
  const router = useRouter();
  const params = useLocalSearchParams();

  const cityKey = params.cityKey as string;
  const cityName = params.cityName as string;
  const cityRegion = params.cityRegion as string;
  const cityCountry = params.cityCountry as string;

  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [elevation, setElevation] = useState<{
    metric: number;
    imperial: number;
  } | null>(null);
  // 24-hour forecast removed - not available on AccuWeather free plan

  // Get dynamic weather theme
  const weatherTheme = currentWeather
    ? getWeatherTheme(
        currentWeather.WeatherText,
        currentWeather.Temperature.Imperial.Value,
        isDark,
        isNightTime()
      )
    : null;

  useEffect(() => {
    loadCityData();
  }, []);

  // Reload hourly forecast when toggling between 12 and 24 hours
  // Removed 24-hour forecast useEffect

  // loadHourlyForecast removed - now handled in loadCityData

  const loadCityData = async () => {
    try {
      setLoading(true);
      const [
        weather,
        forecastData,
        hourlyData,
        officialAlerts,
        locationDetails,
      ] = await Promise.all([
        getCurrentConditions(cityKey),
        get5DayForecast(cityKey),
        get12HourForecast(cityKey), // Always start with 12-hour
        getWeatherAlerts(cityKey),
        getLocationDetails(cityKey),
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
      setHourlyForecast(hourlyData);

      // Store coordinates if available
      if (locationDetails.GeoPosition) {
        setCoordinates({
          lat: locationDetails.GeoPosition.Latitude,
          lon: locationDetails.GeoPosition.Longitude,
        });
        
        // Store elevation if available
        if (locationDetails.GeoPosition.Elevation) {
          setElevation({
            metric: locationDetails.GeoPosition.Elevation.Metric.Value,
            imperial: locationDetails.GeoPosition.Elevation.Imperial.Value,
          });
        }
      }

      const smartAlerts = generateSmartAlerts(weather, []);
      setAlerts([...officialAlerts, ...smartAlerts]);
    } catch (error) {
      console.error('Error loading city data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCityData();
    setRefreshing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'extreme':
        return colors.error;
      case 'medium':
      case 'moderate':
        return '#F59E0B';
      default:
        return colors.success;
    }
  };

  if (loading) {
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
          Loading city details...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <WeatherBackground theme={weatherTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 16 }}>
            <AntDesign name="left" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
              {cityName}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              {cityRegion}, {cityCountry}
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }>
          <View style={{ padding: 20 }}>
            {/* Current Weather Card - Animated with Dynamic Theme */}
            {currentWeather && weatherTheme && (
              <AnimatedWeatherCard
                theme={weatherTheme}
                temperature={Math.round(
                  convertTemperature(currentWeather.Temperature.Imperial.Value)
                ).toString()}
                weatherText={currentWeather.WeatherText}
                weatherIcon={getWeatherIcon(currentWeather.WeatherIcon)}
                feelsLike={Math.round(
                  convertTemperature(
                    currentWeather.RealFeelTemperature.Imperial.Value
                  )
                ).toString()}
              />
            )}

            {/* Alerts Section */}
            {alerts.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 12,
                  }}>
                  ⚠️ Active Alerts ({alerts.length})
                </Text>
                <View style={{ gap: 12 }}>
                  {alerts.slice(0, 3).map((alert: any, index: number) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.card,
                        borderRadius: 12,
                        padding: 16,
                        borderLeftWidth: 4,
                        borderLeftColor: getSeverityColor(
                          alert.severity || alert.Level
                        ),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 4,
                        }}>
                        <Text style={{ fontSize: 20 }}>
                          {alert.icon || '⚠️'}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: colors.text,
                            flex: 1,
                          }}>
                          {alert.type || alert.Category}
                        </Text>
                      </View>
                      <Text
                        style={{ fontSize: 12, color: colors.textSecondary }}>
                        {alert.message ||
                          alert.Description?.Localized ||
                          'Weather alert in effect'}
                      </Text>
                    </View>
                  ))}
                </View>
                {alerts.length > 3 && (
                  <TouchableOpacity
                    onPress={() => router.push('/(app)/alerts')}
                    style={{ marginTop: 12, alignItems: 'center' }}>
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 14,
                        fontWeight: '600',
                      }}>
                      View all {alerts.length} alerts →
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Quick Action Buttons */}
            {currentWeather && (
              <View style={{ gap: 12, marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={() => {
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
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: 12,
                        }}>
                        Check pollution levels & health tips
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
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
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: 12,
                        }}>
                        Sunrise, sunset & moon phases
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
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
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: 12,
                        }}>
                        Get agricultural recommendations
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: '/(app)/weather-insights',
                      params: {
                        currentWeather: JSON.stringify(currentWeather),
                        forecast: JSON.stringify(forecast),
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
                      <Text style={{ fontSize: 24 }}>💡</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}>
                        Weather Insights & Tips
                      </Text>
                      <Text
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: 12,
                        }}>
                        What to wear, activities & health tips
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}

            {/* Hourly Forecast */}
            {hourlyForecast.length > 0 && (
              <View style={{ marginBottom: 20 }}>
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
                    12-Hour Forecast
                  </Text>
                  {/* 24-hour toggle removed - not available on free plan */}
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 12 }}>
                  {hourlyForecast.map((hour, index) => {
                    const time = new Date(hour.DateTime);
                    const timeString = time.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      hour12: true,
                    });
                    const isNow = index === 0;

                    return (
                      <View
                        key={index}
                        style={{
                          backgroundColor: isNow
                            ? weatherTheme?.accentColor || colors.primary
                            : weatherTheme?.cardColor || colors.card,
                          borderRadius: 16,
                          padding: 16,
                          minWidth: 100,
                          alignItems: 'center',
                          borderWidth: isNow ? 2 : 0,
                          borderColor:
                            weatherTheme?.accentColor || colors.primary,
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '600',
                            color: isNow ? 'white' : colors.text,
                            marginBottom: 8,
                          }}>
                          {isNow ? 'Now' : timeString}
                        </Text>
                        <Text style={{ fontSize: 36, marginBottom: 8 }}>
                          {getWeatherIcon(hour.WeatherIcon)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: isNow ? 'white' : colors.text,
                            marginBottom: 8,
                          }}>
                          {Math.round(
                            convertTemperature(hour.Temperature.Value)
                          )}
                          {getTemperatureSymbol()}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                          <Text style={{ fontSize: 16 }}>💧</Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: isNow
                                ? 'rgba(255,255,255,0.9)'
                                : colors.textSecondary,
                            }}>
                            {hour.PrecipitationProbability}%
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Weather Details Grid */}
            {currentWeather && (
              <View style={{ marginBottom: 20 }}>
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
                      value: `${currentWeather.Visibility.Imperial.Value} mi`,
                    },
                    {
                      icon: '🌡️',
                      label: 'Feels Like',
                      value: `${Math.round(
                        convertTemperature(
                          currentWeather.RealFeelTemperature.Imperial.Value
                        )
                      )}${getTemperatureSymbol()}`,
                    },
                    {
                      icon: '☁️',
                      label: 'Cloud Cover',
                      value: `${currentWeather.CloudCover}%`,
                    },
                    {
                      icon: '🧭',
                      label: 'Wind Direction',
                      value: currentWeather.Wind.Direction.Localized,
                    },
                    ...(elevation
                      ? [
                          {
                            icon: '⛰️',
                            label: 'Elevation',
                            value: `${Math.round(elevation.metric)} m / ${Math.round(elevation.imperial)} ft`,
                          },
                        ]
                      : []),
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
            )}

            {/* Elevation-Based Crop Recommendations */}
            {elevation && (
              <View style={{ marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: '/(app)/elevation-crops',
                      params: {
                        elevation: elevation.metric,
                        cityName: `${cityName}, ${cityRegion}`,
                      },
                    });
                  }}
                  style={{
                    backgroundColor: '#10B981',
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 24 }}>🌱</Text>
                    </View>
                    <View>
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
                        What to Grow Here
                      </Text>
                      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        Crops suitable for {Math.round(elevation.metric)}m elevation
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}

            {/* 5-Day Forecast */}
            {forecast.length > 0 && (
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 12,
                  }}>
                  5-Day Forecast
                </Text>
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
                              {Math.round(
                                convertTemperature(
                                  day.Temperature.Maximum.Value
                                )
                              )}
                              {getTemperatureSymbol()}
                            </Text>
                            <Text
                              style={{
                                color: colors.textSecondary,
                                fontSize: 18,
                              }}>
                              {Math.round(
                                convertTemperature(
                                  day.Temperature.Minimum.Value
                                )
                              )}
                              {getTemperatureSymbol()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Agricultural Planning Section */}
            {currentWeather && (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: 16,
                  }}>
                  Agricultural Planning
                </Text>
                <View style={{ gap: 12 }}>
                  {/* Planting Schedule Card */}
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: '/(app)/planting-schedule',
                        params: {
                          temperature: Math.round(
                            convertTemperature(currentWeather.Temperature.Imperial.Value)
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

                  {/* Farming Advice Card */}
                  <TouchableOpacity
                    onPress={() => {
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

                  {/* What to Grow Here Card */}
                  {coordinates && (
                    <TouchableOpacity
                      onPress={() => {
                        router.push({
                          pathname: '/(app)/elevation-crops',
                          params: {
                            elevation: elevation?.metric || 0,
                            cityName: `${cityName}, ${cityRegion}`,
                          },
                        });
                      }}
                      style={{
                        backgroundColor: colors.primary,
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
                          <Text style={{ fontSize: 24 }}>⛰️</Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 16,
                              fontWeight: '600',
                              marginBottom: 2,
                            }}>
                            What to Grow Here
                          </Text>
                          <Text
                            style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                            Crops for your elevation ({Math.round(elevation?.metric || 0)}m)
                          </Text>
                        </View>
                      </View>
                      <AntDesign name="right" size={20} color="white" />
                    </TouchableOpacity>
                  )}

                  {/* Organic Fertilizer Card */}
                  <TouchableOpacity
                    onPress={() => {
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
                      router.push({
                        pathname: '/(app)/sustainable-farming',
                        params: {
                          temperature: Math.round(
                            currentWeather.Temperature.Imperial.Value
                          ),
                          humidity: currentWeather.RelativeHumidity,
                          weatherText: currentWeather.WeatherText,
                          cityName: `${cityName}, ${cityRegion}`,
                          elevation: elevation?.metric || 100,
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
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </WeatherBackground>
  );
}
