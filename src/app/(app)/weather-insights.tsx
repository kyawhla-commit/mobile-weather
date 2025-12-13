import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { getAllWeatherInsights, WeatherInsight } from '../../services/weatherInsights';

type TabType = 'all' | 'clothing' | 'activities' | 'travel' | 'health';

export default function WeatherInsights() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Parse weather data from params
  const currentWeather = params.currentWeather
    ? JSON.parse(params.currentWeather as string)
    : null;
  const forecast = params.forecast ? JSON.parse(params.forecast as string) : [];
  const cityName = params.cityName as string;

  if (!currentWeather) {
    return null;
  }

  // Get all insights
  const insights = getAllWeatherInsights(currentWeather, forecast);

  // Get insights for active tab
  const getActiveInsights = (): WeatherInsight[] => {
    switch (activeTab) {
      case 'all':
        return insights.all;
      case 'clothing':
        return insights.clothing;
      case 'activities':
        return insights.activities;
      case 'travel':
        return insights.travel;
      case 'health':
        return insights.health;
      default:
        return insights.all;
    }
  };

  const activeInsights = getActiveInsights();

  // Tab configuration
  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: '💡' },
    { key: 'clothing', label: 'Wear', icon: '👕' },
    { key: 'activities', label: 'Activities', icon: '🏃' },
    { key: 'travel', label: 'Travel', icon: '🗺️' },
    { key: 'health', label: 'Health', icon: '💚' },
  ];

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return colors.textSecondary;
    }
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
            Weather Insights & Tips
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            {cityName}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 8,
        }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                activeTab === tab.key ? colors.primary : colors.card,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}>
            <Text style={{ fontSize: 16 }}>{tab.icon}</Text>
            <Text
              style={{
                color: activeTab === tab.key ? 'white' : colors.text,
                fontWeight: activeTab === tab.key ? '600' : '400',
                fontSize: 14,
              }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Insights List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {activeInsights.length === 0 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 60,
            }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🌤️</Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                textAlign: 'center',
              }}>
              No specific insights for this category
            </Text>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {activeInsights.map((insight, index) => (
              <View
                key={insight.id}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 20,
                  borderLeftWidth: 4,
                  borderLeftColor: getPriorityColor(insight.priority),
                }}>
                {/* Header */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                  }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.primaryLight,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                    <Text style={{ fontSize: 24 }}>{insight.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 18,
                        fontWeight: '600',
                        marginBottom: 4,
                      }}>
                      {insight.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 8,
                          backgroundColor: colors.background,
                        }}>
                        <Text
                          style={{
                            color: getPriorityColor(insight.priority),
                            fontSize: 11,
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}>
                          {insight.priority}
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 8,
                          backgroundColor: colors.background,
                        }}>
                        <Text
                          style={{
                            color: colors.textSecondary,
                            fontSize: 11,
                            textTransform: 'capitalize',
                          }}>
                          {insight.category}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Description */}
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 15,
                    lineHeight: 22,
                  }}>
                  {insight.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Summary Stats */}
        {activeTab === 'all' && activeInsights.length > 0 && (
          <View
            style={{
              marginTop: 24,
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 20,
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 16,
              }}>
              Insights Summary
            </Text>
            <View style={{ gap: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  👕 Clothing Tips
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {insights.clothing.length}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  🏃 Activity Suggestions
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {insights.activities.length}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  🗺️ Travel Advice
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {insights.travel.length}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  💚 Health Tips
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {insights.health.length}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Agricultural Planning Section */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
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
                    temperature: Math.round(currentWeather.Temperature.Imperial.Value),
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
                    Optimal planting schedules for your climate
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
                    temperature: Math.round(currentWeather.Temperature.Imperial.Value),
                    humidity: currentWeather.RelativeHumidity,
                    weatherText: currentWeather.WeatherText,
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
                    Get crop recommendations and tips
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
                    temperature: Math.round(currentWeather.Temperature.Imperial.Value),
                    humidity: currentWeather.RelativeHumidity,
                    weatherText: currentWeather.WeatherText,
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
      </ScrollView>
    </SafeAreaView>
  );
}
