import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getWeatherTheme } from '../../services/weatherThemes';
import WeatherBackground from '../../components/WeatherBackground';
import AnimatedWeatherCard from '../../components/AnimatedWeatherCard';

// Demo weather conditions
const weatherConditions = [
  { text: 'Sunny', temp: 75, icon: '☀️', description: 'Pleasant sunny day' },
  { text: 'Sunny', temp: 95, icon: '🌡️', description: 'Hot sunny day' },
  { text: 'Clear', temp: 65, icon: '🌙', description: 'Clear night', isNight: true },
  { text: 'Rain', temp: 60, icon: '🌧️', description: 'Rainy weather' },
  { text: 'Thunderstorm', temp: 65, icon: '⛈️', description: 'Stormy weather' },
  { text: 'Snow', temp: 28, icon: '❄️', description: 'Snowy weather' },
  { text: 'Cloudy', temp: 68, icon: '☁️', description: 'Cloudy weather' },
  { text: 'Fog', temp: 55, icon: '🌫️', description: 'Foggy weather' },
  { text: 'Partly Cloudy', temp: 72, icon: '⛅', description: 'Partly cloudy' },
  { text: 'Windy', temp: 70, icon: '💨', description: 'Windy weather' },
];

export default function ThemePreview() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedCondition = weatherConditions[selectedIndex];
  const theme = getWeatherTheme(
    selectedCondition.text,
    selectedCondition.temp,
    isDark,
    selectedCondition.isNight || false
  );

  return (
    <WeatherBackground theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 16 }}>
            <AntDesign name="left" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              Weather Theme Preview
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              See all dynamic weather themes
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          {/* Current Theme Display */}
          <AnimatedWeatherCard
            theme={theme}
            temperature={selectedCondition.temp.toString()}
            weatherText={selectedCondition.text}
            weatherIcon={selectedCondition.icon}
            feelsLike={(selectedCondition.temp - 2).toString()}
          />

          {/* Theme Info */}
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: 12,
              }}>
              Theme Details
            </Text>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#6b7280' }}>Name:</Text>
                <Text style={{ fontWeight: '600', color: '#1f2937' }}>
                  {theme.name}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#6b7280' }}>Animation:</Text>
                <Text style={{ fontWeight: '600', color: '#1f2937' }}>
                  {theme.animation || 'None'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#6b7280' }}>Particles:</Text>
                <Text style={{ fontWeight: '600', color: '#1f2937' }}>
                  {theme.particles
                    ? `${theme.particles.type} (${theme.particles.count})`
                    : 'None'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#6b7280' }}>Accent Color:</Text>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: theme.accentColor,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                  }}
                />
              </View>
            </View>
          </View>

          {/* Weather Condition Selector */}
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: 'white',
                marginBottom: 12,
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}>
              Select Weather Condition
            </Text>
            <View style={{ gap: 12 }}>
              {weatherConditions.map((condition, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedIndex(index)}
                  style={{
                    backgroundColor:
                      selectedIndex === index
                        ? 'rgba(255,255,255,0.95)'
                        : 'rgba(255,255,255,0.7)',
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: selectedIndex === index ? 2 : 0,
                    borderColor: theme.accentColor,
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 32 }}>{condition.icon}</Text>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: '#1f2937',
                        }}>
                        {condition.text}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#6b7280' }}>
                        {condition.description}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#1f2937',
                    }}>
                    {condition.temp}°
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 16,
              padding: 20,
              marginTop: 24,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: 8,
              }}>
              💡 How It Works
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 20 }}>
              The UI automatically adapts to weather conditions with dynamic
              colors, gradients, and animations. Each weather type has unique
              visual effects including animated particles (rain, snow, stars) and
              themed color schemes for an immersive experience.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </WeatherBackground>
  );
}
