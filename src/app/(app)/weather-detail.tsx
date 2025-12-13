import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { getWeatherIcon } from '../../services/weather';
import { getAllWeatherInsights } from '../../services/weatherInsights';

const screenWidth = Dimensions.get('window').width;

export default function WeatherDetail() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse the forecast data from params
  const forecast = params.forecast ? JSON.parse(params.forecast as string) : [];
  const cityName = params.cityName as string;
  const currentTemp = params.currentTemp as string;
  const weatherText = params.weatherText as string;
  const weatherIcon = parseInt(params.weatherIcon as string);
  const currentWeather = params.currentWeather ? JSON.parse(params.currentWeather as string) : null;

  // Get top insights
  const insights = currentWeather ? getAllWeatherInsights(currentWeather, forecast) : null;
  const topInsights = insights ? insights.all.slice(0, 3) : [];

  // Prepare chart data
  const temperatures = forecast.map((day: any) =>
    Math.round(day.Temperature.Maximum.Value)
  );
  const minTemperatures = forecast.map((day: any) =>
    Math.round(day.Temperature.Minimum.Value)
  );
  const labels = forecast.map((day: any, index: number) => {
    const date = new Date(day.Date);
    return index === 0
      ? 'Today'
      : date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) =>
      isDark
        ? `rgba(59, 130, 246, ${opacity})`
        : `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) =>
      `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
            Weather Details
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            {cityName}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ padding: 20 }}>
          {/* Current Weather Summary */}
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: 24,
              padding: 24,
              marginBottom: 24,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 70, marginBottom: 12 }}>
              {getWeatherIcon(weatherIcon)}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 48,
                fontWeight: 'bold',
                marginBottom: 8,
              }}>
              {currentTemp}°
            </Text>
            <Text style={{ color: 'white', fontSize: 20 }}>{weatherText}</Text>
          </View>

          {/* Temperature Chart */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 12,
              }}>
              Temperature Trend
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 16,
              }}>
              <LineChart
                data={{
                  labels: labels,
                  datasets: [
                    {
                      data: temperatures,
                      color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                      strokeWidth: 3,
                    },
                    {
                      data: minTemperatures,
                      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                      strokeWidth: 3,
                    },
                  ],
                  legend: ['High', 'Low'],
                }}
                width={screenWidth - 72}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{
                  borderRadius: 16,
                }}
                withInnerLines={false}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
              />
            </View>
          </View>

          {/* Detailed Daily Forecast */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 12,
              }}>
              Daily Breakdown
            </Text>
            <View style={{ gap: 12 }}>
              {forecast.map((day: any, index: number) => {
                const date = new Date(day.Date);
                const dayName =
                  index === 0
                    ? 'Today'
                    : date.toLocaleDateString('en-US', { weekday: 'long' });
                const monthDay = date.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 16,
                      padding: 20,
                    }}>
                    {/* Day Header */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                      }}>
                      <View>
                        <Text
                          style={{
                            color: colors.text,
                            fontSize: 18,
                            fontWeight: '600',
                            marginBottom: 2,
                          }}>
                          {dayName}
                        </Text>
                        <Text
                          style={{ color: colors.textSecondary, fontSize: 14 }}>
                          {monthDay}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 48 }}>
                        {getWeatherIcon(day.Day.Icon)}
                      </Text>
                    </View>

                    {/* Temperature Range */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 16,
                      }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: colors.textSecondary,
                            fontSize: 12,
                            marginBottom: 4,
                          }}>
                          High
                        </Text>
                        <Text
                          style={{
                            color: colors.text,
                            fontSize: 24,
                            fontWeight: '700',
                          }}>
                          {Math.round(day.Temperature.Maximum.Value)}°
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: colors.textSecondary,
                            fontSize: 12,
                            marginBottom: 4,
                          }}>
                          Low
                        </Text>
                        <Text
                          style={{
                            color: colors.text,
                            fontSize: 24,
                            fontWeight: '700',
                          }}>
                          {Math.round(day.Temperature.Minimum.Value)}°
                        </Text>
                      </View>
                    </View>

                    {/* Day/Night Conditions */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: colors.background,
                          borderRadius: 12,
                          padding: 12,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            marginBottom: 6,
                          }}>
                          <Text style={{ fontSize: 20 }}>☀️</Text>
                          <Text
                            style={{
                              color: colors.text,
                              fontSize: 14,
                              fontWeight: '600',
                            }}>
                            Day
                          </Text>
                        </View>
                        <Text
                          style={{ color: colors.textSecondary, fontSize: 12 }}>
                          {day.Day.IconPhrase}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: colors.background,
                          borderRadius: 12,
                          padding: 12,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            marginBottom: 6,
                          }}>
                          <Text style={{ fontSize: 20 }}>🌙</Text>
                          <Text
                            style={{
                              color: colors.text,
                              fontSize: 14,
                              fontWeight: '600',
                            }}>
                            Night
                          </Text>
                        </View>
                        <Text
                          style={{ color: colors.textSecondary, fontSize: 12 }}>
                          {day.Night.IconPhrase}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Quick Insights Preview */}
          {topInsights.length > 0 && (
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
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text,
                  }}>
                  💡 Quick Tips
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: '/(app)/weather-insights',
                      params: {
                        currentWeather: JSON.stringify(currentWeather),
                        forecast: JSON.stringify(forecast),
                        cityName: cityName,
                      },
                    });
                  }}>
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                    View All →
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ gap: 12 }}>
                {topInsights.map((insight) => (
                  <View
                    key={insight.id}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 16,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: colors.primaryLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 24 }}>{insight.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}>
                        {insight.title}
                      </Text>
                      <Text
                        style={{ color: colors.textSecondary, fontSize: 13 }}
                        numberOfLines={2}>
                        {insight.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Weather Insights */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 12,
              }}>
              Weather Insights
            </Text>
            <View style={{ gap: 12 }}>
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.primaryLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 24 }}>📊</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: '600',
                      marginBottom: 2,
                    }}>
                    Temperature Range
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                    {Math.min(...minTemperatures)}° -{' '}
                    {Math.max(...temperatures)}° over 5 days
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.primaryLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 24 }}>📈</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: '600',
                      marginBottom: 2,
                    }}>
                    Average Temperature
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                    {Math.round(
                      temperatures.reduce((a, b) => a + b, 0) /
                        temperatures.length
                    )}
                    ° expected
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Farming Features */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 12,
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
                      temperature: currentTemp,
                      cityName: cityName,
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
                      temperature: currentTemp,
                      humidity: currentWeather?.RelativeHumidity || 60,
                      weatherText: weatherText,
                      cityName: cityName,
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

              {/* Organic Fertilizer Card */}
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/(app)/organic-fertilizer',
                    params: {
                      temperature: currentTemp,
                      humidity: currentWeather?.RelativeHumidity || 60,
                      weatherText: weatherText,
                      cityName: cityName,
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
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
