import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { getWeatherIcon } from '../services/weather';

export interface WeatherWidgetData {
  id: string;
  type: 'current' | 'forecast' | 'hourly' | 'alerts' | 'aqi' | 'wind' | 'humidity' | 'pressure' | 'uv' | 'visibility';
  title: string;
  data: any;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  position: { x: number; y: number };
  theme?: 'auto' | 'light' | 'dark' | 'colorful';
  refreshInterval?: number;
}

interface WeatherWidgetProps {
  widget: WeatherWidgetData;
  onPress?: () => void;
  onLongPress?: () => void;
  isEditing?: boolean;
  isDragging?: boolean;
}

export default function WeatherWidget({ 
  widget, 
  onPress, 
  onLongPress, 
  isEditing = false,
  isDragging = false 
}: WeatherWidgetProps) {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [lastUpdated] = useState(new Date());

  useEffect(() => {
    if (isDragging) {
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isDragging]);

  useEffect(() => {
    if (isEditing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(1);
    }
  }, [isEditing]);

  const renderContent = () => {
    switch (widget.type) {
      case 'current':
        return renderCurrentWeather();
      case 'forecast':
        return renderForecast();
      case 'hourly':
        return renderHourly();
      case 'alerts':
        return renderAlerts();
      case 'aqi':
        return renderAQI();
      case 'wind':
        return renderWind();
      case 'humidity':
        return renderHumidity();
      case 'pressure':
        return renderPressure();
      case 'uv':
        return renderUV();
      case 'visibility':
        return renderVisibility();
      default:
        return renderPlaceholder();
    }
  };

  const renderCurrentWeather = () => {
    const { temperature, condition, icon, feelsLike, humidity, windSpeed, windDirection } = widget.data;
    const isLarge = widget.size === 'large' || widget.size === 'xlarge';
    
    return (
      <View className="flex-1 p-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-medium text-white/70 uppercase tracking-wide">
            Current
          </Text>
          <View className="w-2 h-2 bg-green-400 rounded-full" />
        </View>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-1">
              {Math.round(temperature || 0)}°
            </Text>
            {isLarge && feelsLike && (
              <Text className="text-xs text-white/60">
                Feels like {Math.round(feelsLike)}°
              </Text>
            )}
            <Text className="text-xs text-white/80 mt-1" numberOfLines={2}>
              {condition || 'Loading...'}
            </Text>
          </View>
          
          <View className="items-center">
            <Text className="text-4xl mb-1">{getWeatherIcon(icon || 1)}</Text>
            {isLarge && (
              <View className="flex-row space-x-3 mt-2">
                {humidity && (
                  <View className="items-center">
                    <MaterialCommunityIcons name="water-percent" size={12} color="rgba(255,255,255,0.7)" />
                    <Text className="text-xs text-white/70">{humidity}%</Text>
                  </View>
                )}
                {windSpeed && (
                  <View className="items-center">
                    <Feather name="wind" size={12} color="rgba(255,255,255,0.7)" />
                    <Text className="text-xs text-white/70">
                      {Math.round(windSpeed)} {windDirection ? windDirection.substring(0, 2) : ''}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderForecast = () => {
    const { forecast } = widget.data;
    const forecastData = forecast || [];
    const isLarge = widget.size === 'large' || widget.size === 'xlarge';
    const itemCount = isLarge ? 5 : 3;
    
    return (
      <View className="flex-1 p-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xs font-medium text-white/70 uppercase tracking-wide">
            {itemCount}-Day Forecast
          </Text>
          <MaterialCommunityIcons name="calendar-outline" size={14} color="rgba(255,255,255,0.7)" />
        </View>
        
        {forecastData.slice(0, itemCount).map((day: any, index: number) => {
          const date = new Date(day.Date);
          const isToday = index === 0;
          
          return (
            <View key={index} className="flex-row items-center justify-between mb-2">
              <Text className="text-xs text-white/80 flex-1 font-medium">
                {isToday ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })}
              </Text>
              
              <View className="flex-row items-center space-x-2">
                <Text className="text-lg">{getWeatherIcon(day.Day.Icon)}</Text>
                
                <View className="items-end min-w-[40px]">
                  <Text className="text-xs text-white font-bold">
                    {Math.round(day.Temperature.Maximum.Value)}°
                  </Text>
                  <Text className="text-xs text-white/60">
                    {Math.round(day.Temperature.Minimum.Value)}°
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderHourly = () => {
    const { hourly } = widget.data;
    const hourlyData = hourly || [];
    
    return (
      <View className="flex-1 p-2">
        <Text className="text-sm font-semibold text-white mb-2">{widget.title}</Text>
        {hourlyData.slice(0, 4).map((hour: any, index: number) => (
          <View key={index} className="flex-row items-center justify-between mb-1">
            <Text className="text-xs text-white/80">
              {new Date(hour.DateTime).toLocaleTimeString('en', { 
                hour: 'numeric',
                hour12: true 
              })}
            </Text>
            <Text className="text-sm">{getWeatherIcon(hour.WeatherIcon)}</Text>
            <Text className="text-xs text-white font-medium">
              {Math.round(hour.Temperature.Value)}°
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderAlerts = () => {
    const { alerts } = widget.data;
    const alertCount = alerts?.length || 0;
    
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-3xl mb-2">⚠️</Text>
        <Text className="text-lg font-bold text-white mb-1">
          {alertCount}
        </Text>
        <Text className="text-xs text-white/80 text-center">
          {alertCount === 1 ? 'Alert' : 'Alerts'}
        </Text>
        {alertCount > 0 && (
          <Text className="text-xs text-red-300 text-center mt-1">
            {alerts[0].type}
          </Text>
        )}
      </View>
    );
  };

  const renderAQI = () => {
    const { aqi, category } = widget.data;
    const aqiValue = aqi || 0;
    const aqiCategory = category || 'Loading...';
    
    const getAQIColor = (value: number) => {
      if (value <= 50) return '#10B981'; // Good - Green
      if (value <= 100) return '#F59E0B'; // Moderate - Yellow
      if (value <= 150) return '#EF4444'; // Unhealthy for sensitive - Red
      if (value <= 200) return '#8B5CF6'; // Unhealthy - Purple
      return '#7C2D12'; // Very Unhealthy - Maroon
    };

    const aqiColor = getAQIColor(aqiValue);
    
    return (
      <View className="flex-1 p-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-medium text-white/70 uppercase tracking-wide">
            Air Quality
          </Text>
          <MaterialCommunityIcons name="air-filter" size={14} color="rgba(255,255,255,0.7)" />
        </View>
        
        <View className="items-center justify-center flex-1">
          <View 
            className="w-16 h-16 rounded-full items-center justify-center mb-2"
            style={{ backgroundColor: aqiColor + '30', borderWidth: 2, borderColor: aqiColor }}
          >
            <Text className="text-xl font-bold text-white">
              {aqiValue}
            </Text>
          </View>
          
          <Text className="text-xs text-white/80 text-center font-medium">
            {aqiCategory}
          </Text>
        </View>
      </View>
    );
  };

  const renderWind = () => {
    const { speed, direction, gust, degrees } = widget.data || {};
    const windSpeed = typeof speed === 'number' ? speed : 0;
    const windDirection = direction || 'N';
    const windGust = typeof gust === 'number' ? gust : 0;
    const windDegrees = typeof degrees === 'number' ? degrees : 0;
    
    // Get wind strength description
    const getWindStrength = (speed: number) => {
      if (speed < 1) return 'Calm';
      if (speed < 4) return 'Light Air';
      if (speed < 8) return 'Light Breeze';
      if (speed < 13) return 'Gentle Breeze';
      if (speed < 19) return 'Moderate Breeze';
      if (speed < 25) return 'Fresh Breeze';
      if (speed < 32) return 'Strong Breeze';
      if (speed < 39) return 'Near Gale';
      if (speed < 47) return 'Gale';
      if (speed < 55) return 'Strong Gale';
      if (speed < 64) return 'Storm';
      return 'Hurricane';
    };
    
    // Show loading state if no data
    if (!widget.data || (windSpeed === 0 && windDirection === 'N')) {
      return (
        <View className="flex-1 p-3 items-center justify-center">
          <MaterialCommunityIcons name="weather-windy" size={32} color="rgba(255,255,255,0.5)" />
          <Text className="text-xs text-white/50 mt-2 text-center">
            Loading wind data...
          </Text>
        </View>
      );
    }
    
    return (
      <View className="flex-1 p-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-medium text-white/70 uppercase tracking-wide">
            Wind
          </Text>
          <Feather name="wind" size={14} color="rgba(255,255,255,0.7)" />
        </View>
        
        <View className="items-center justify-center flex-1">
          <Text className="text-2xl font-bold text-white mb-1">
            {Math.round(windSpeed)}
          </Text>
          <Text className="text-xs text-white/80 mb-2">mph</Text>
          
          <View className="flex-row items-center space-x-2 mb-1">
            <View className="relative">
              <MaterialCommunityIcons 
                name="compass-outline" 
                size={16} 
                color="rgba(255,255,255,0.7)"
              />
              {windSpeed > 0 && (
                <MaterialCommunityIcons 
                  name="navigation" 
                  size={12} 
                  color="rgba(255,255,255,0.9)"
                  style={{ 
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    transform: [{ rotate: `${windDegrees}deg` }] 
                  }}
                />
              )}
            </View>
            <Text className="text-xs text-white/70 font-medium">{windDirection}</Text>
          </View>
          
          {windSpeed > 0 && (
            <Text className="text-xs text-white/60 text-center">
              {getWindStrength(windSpeed)}
            </Text>
          )}
          
          {windGust > 0 && windGust > windSpeed && (
            <Text className="text-xs text-white/60 mt-1">
              Gusts {Math.round(windGust)} mph
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderHumidity = () => {
    const { humidity, dewPoint } = widget.data;
    const humidityValue = humidity || 0;
    
    const getHumidityColor = (value: number) => {
      if (value < 30) return '#EF4444'; // Too dry - Red
      if (value < 60) return '#10B981'; // Comfortable - Green
      return '#F59E0B'; // Too humid - Orange
    };

    return (
      <View className="flex-1 p-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-medium text-white/70 uppercase tracking-wide">
            Humidity
          </Text>
          <MaterialCommunityIcons name="water-percent" size={14} color="rgba(255,255,255,0.7)" />
        </View>
        
        <View className="items-center justify-center flex-1">
          <View className="relative w-16 h-16 items-center justify-center mb-2">
            <View 
              className="absolute inset-0 rounded-full"
              style={{ 
                backgroundColor: getHumidityColor(humidityValue) + '20',
                borderWidth: 3,
                borderColor: getHumidityColor(humidityValue)
              }}
            />
            <Text className="text-lg font-bold text-white">
              {humidityValue}%
            </Text>
          </View>
          
          {dewPoint && (
            <Text className="text-xs text-white/60">
              Dew point {Math.round(dewPoint)}°
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderPressure = () => {
    const { pressure, trend } = widget.data;
    const pressureValue = pressure || 0;
    const pressureTrend = trend || 'steady';
    
    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case 'rising': return 'trending-up';
        case 'falling': return 'trending-down';
        default: return 'minus';
      }
    };

    const getTrendColor = (trend: string) => {
      switch (trend) {
        case 'rising': return '#10B981';
        case 'falling': return '#EF4444';
        default: return '#6B7280';
      }
    };

    return (
      <View className="flex-1 p-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-medium text-white/70 uppercase tracking-wide">
            Pressure
          </Text>
          <MaterialCommunityIcons name="gauge" size={14} color="rgba(255,255,255,0.7)" />
        </View>
        
        <View className="items-center justify-center flex-1">
          <Text className="text-lg font-bold text-white mb-1">
            {pressureValue.toFixed(2)}
          </Text>
          <Text className="text-xs text-white/80 mb-2">inHg</Text>
          
          <View className="flex-row items-center space-x-1">
            <Feather 
              name={getTrendIcon(pressureTrend) as any} 
              size={12} 
              color={getTrendColor(pressureTrend)} 
            />
            <Text className="text-xs text-white/70 capitalize">{pressureTrend}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderUV = () => {
    const { uvIndex, uvDescription } = widget.data;
    const uv = uvIndex || 0;
    
    const getUVColor = (value: number) => {
      if (value <= 2) return '#10B981'; // Low - Green
      if (value <= 5) return '#F59E0B'; // Moderate - Yellow
      if (value <= 7) return '#EF4444'; // High - Red
      if (value <= 10) return '#8B5CF6'; // Very High - Purple
      return '#7C2D12'; // Extreme - Maroon
    };

    const getUVDescription = (value: number) => {
      if (value <= 2) return 'Low';
      if (value <= 5) return 'Moderate';
      if (value <= 7) return 'High';
      if (value <= 10) return 'Very High';
      return 'Extreme';
    };

    return (
      <View className="flex-1 p-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-medium text-white/70 uppercase tracking-wide">
            UV Index
          </Text>
          <Feather name="sun" size={14} color="rgba(255,255,255,0.7)" />
        </View>
        
        <View className="items-center justify-center flex-1">
          <View 
            className="w-16 h-16 rounded-full items-center justify-center mb-2"
            style={{ 
              backgroundColor: getUVColor(uv) + '30',
              borderWidth: 2,
              borderColor: getUVColor(uv)
            }}
          >
            <Text className="text-xl font-bold text-white">
              {uv}
            </Text>
          </View>
          
          <Text className="text-xs text-white/80 text-center font-medium">
            {uvDescription || getUVDescription(uv)}
          </Text>
        </View>
      </View>
    );
  };

  const renderVisibility = () => {
    const { visibility, visibilityDescription } = widget.data;
    const visibilityValue = visibility || 0;
    
    const getVisibilityDescription = (value: number) => {
      if (value >= 10) return 'Excellent';
      if (value >= 6) return 'Good';
      if (value >= 3) return 'Moderate';
      if (value >= 1) return 'Poor';
      return 'Very Poor';
    };

    return (
      <View className="flex-1 p-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-medium text-white/70 uppercase tracking-wide">
            Visibility
          </Text>
          <Feather name="eye" size={14} color="rgba(255,255,255,0.7)" />
        </View>
        
        <View className="items-center justify-center flex-1">
          <Text className="text-2xl font-bold text-white mb-1">
            {visibilityValue.toFixed(1)}
          </Text>
          <Text className="text-xs text-white/80 mb-2">miles</Text>
          
          <Text className="text-xs text-white/70 text-center font-medium">
            {visibilityDescription || getVisibilityDescription(visibilityValue)}
          </Text>
        </View>
      </View>
    );
  };

  const renderPlaceholder = () => {
    return (
      <View className="flex-1 p-3 items-center justify-center">
        <MaterialCommunityIcons name="weather-cloudy" size={32} color="rgba(255,255,255,0.5)" />
        <Text className="text-xs text-white/50 mt-2 text-center">
          Widget Loading...
        </Text>
      </View>
    );
  };

  const getWidgetSize = () => {
    const { width: screenWidth } = Dimensions.get('window');
    const availableWidth = screenWidth - 40;
    const margin = 16;
    
    switch (widget.size) {
      case 'small':
        return { 
          width: (availableWidth - margin) / 2, 
          height: 120 
        };
      case 'medium':
        return { 
          width: (availableWidth - margin) / 2, 
          height: 140 
        };
      case 'large':
        return { 
          width: availableWidth, 
          height: 160 
        };
      case 'xlarge':
        return { 
          width: availableWidth, 
          height: 200 
        };
      default:
        return { 
          width: (availableWidth - margin) / 2, 
          height: 120 
        };
    }
  };

  const getGradientColors = () => {
    const theme = widget.theme || 'auto';
    
    if (theme === 'light') {
      return ['#F8FAFC', '#E2E8F0'];
    }
    
    if (theme === 'dark') {
      return ['#1E293B', '#0F172A'];
    }
    
    // Colorful theme or auto theme
    switch (widget.type) {
      case 'current':
        return ['#4F46E5', '#7C3AED']; // Purple
      case 'forecast':
        return ['#059669', '#0D9488']; // Teal
      case 'hourly':
        return ['#DC2626', '#EA580C']; // Red-Orange
      case 'alerts':
        return ['#DC2626', '#B91C1C']; // Red
      case 'aqi':
        return ['#6366F1', '#8B5CF6']; // Indigo-Purple
      case 'wind':
        return ['#0EA5E9', '#0284C7']; // Sky Blue
      case 'humidity':
        return ['#06B6D4', '#0891B2']; // Cyan
      case 'pressure':
        return ['#8B5CF6', '#7C3AED']; // Purple
      case 'uv':
        return ['#F59E0B', '#D97706']; // Amber
      case 'visibility':
        return ['#6B7280', '#4B5563']; // Gray
      default:
        return ['#6B7280', '#4B5563']; // Default Gray
    }
  };



  const widgetSize = getWidgetSize();
  
  return (
    <Animated.View
      style={{
        width: widgetSize.width,
        height: widgetSize.height,
        transform: [{ scale: scaleAnim }],
        opacity: fadeAnim,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.9}
        style={{
          flex: 1,
          borderRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: isDragging ? 8 : 4,
          },
          shadowOpacity: isDragging ? 0.3 : 0.15,
          shadowRadius: isDragging ? 12 : 8,
          elevation: isDragging ? 12 : 6,
        }}
      >
        <LinearGradient
          colors={getGradientColors() as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* Glass morphism overlay */}
          <View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
            }}
          />
          
          {/* Content */}
          {renderContent()}
          
          {/* Edit mode indicator */}
          {isEditing && (
            <View 
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons name="pencil" size={12} color="white" />
            </View>
          )}
          
          {/* Last updated indicator */}
          {widget.size === 'large' || widget.size === 'xlarge' ? (
            <View 
              style={{
                position: 'absolute',
                bottom: 4,
                right: 6,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 8,
                paddingHorizontal: 4,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 8, color: 'rgba(255, 255, 255, 0.6)' }}>
                {lastUpdated.toLocaleTimeString('en', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          ) : null}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}