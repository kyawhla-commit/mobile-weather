import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { getAirQuality, getAQICategory, AQIData } from '../../services/weather';

export default function AirQuality() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const cityName = params.cityName as string;
  const lat = parseFloat(params.lat as string);
  const lon = parseFloat(params.lon as string);

  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAirQuality();
  }, []);

  const loadAirQuality = async () => {
    try {
      setLoading(true);
      const data = await getAirQuality(lat, lon);
      setAqiData(data);
    } catch (error) {
      console.error('Error loading air quality:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAirQuality();
    setRefreshing(false);
  };

  const getPollutantInfo = (pollutant: string) => {
    const info: { [key: string]: { name: string; description: string; icon: string } } = {
      pm25: {
        name: 'PM2.5',
        description: 'Fine particles that can penetrate deep into lungs',
        icon: '🔬',
      },
      pm10: {
        name: 'PM10',
        description: 'Coarse particles from dust and pollen',
        icon: '💨',
      },
      o3: {
        name: 'Ozone (O₃)',
        description: 'Ground-level ozone, harmful to respiratory system',
        icon: '☁️',
      },
      no2: {
        name: 'NO₂',
        description: 'Nitrogen dioxide from vehicle emissions',
        icon: '🚗',
      },
      so2: {
        name: 'SO₂',
        description: 'Sulfur dioxide from industrial processes',
        icon: '🏭',
      },
      co: {
        name: 'CO',
        description: 'Carbon monoxide from incomplete combustion',
        icon: '⚠️',
      },
    };
    return info[pollutant];
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Loading air quality data...</Text>
      </SafeAreaView>
    );
  }

  if (!aqiData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ padding: 20 }}>
          <Text style={{ color: colors.error, fontSize: 16 }}>Failed to load air quality data</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { category, color, icon } = getAQICategory(aqiData.aqi);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <AntDesign name="left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
            Air Quality Index
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            {cityName}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={{ padding: 20 }}>
          {/* AQI Main Card */}
          <View
            style={{
              backgroundColor: color,
              borderRadius: 24,
              padding: 32,
              marginBottom: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 60, marginBottom: 12 }}>{icon}</Text>
            <Text style={{ fontSize: 72, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
              {aqiData.aqi}
            </Text>
            <Text style={{ fontSize: 24, fontWeight: '600', color: 'white', marginBottom: 8 }}>
              {category}
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                Dominant: {aqiData.dominantPollutant}
              </Text>
            </View>
          </View>

          {/* Health Recommendations */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              🏥 Health Recommendations
            </Text>
            <View style={{ gap: 12 }}>
              <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 }}>
                  General Public
                </Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
                  {aqiData.healthRecommendations.general}
                </Text>
              </View>
              
              <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 }}>
                  Sensitive Groups
                </Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
                  {aqiData.healthRecommendations.sensitive}
                </Text>
              </View>
              
              <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 }}>
                  Outdoor Activities
                </Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
                  {aqiData.healthRecommendations.outdoor}
                </Text>
              </View>
            </View>
          </View>

          {/* Pollutant Breakdown */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              🔬 Pollutant Breakdown
            </Text>
            <View style={{ gap: 12 }}>
              {Object.entries(aqiData.pollutants).map(([key, data]) => {
                const info = getPollutantInfo(key);
                const pollutantCategory = getAQICategory(data.aqi);
                
                return (
                  <View
                    key={key}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 16,
                      padding: 16,
                      borderLeftWidth: 4,
                      borderLeftColor: pollutantCategory.color,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                        <Text style={{ fontSize: 24 }}>{info.icon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>
                            {info.name}
                          </Text>
                          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                            {info.description}
                          </Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                          {data.aqi}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                          {data.value.toFixed(1)} µg/m³
                        </Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: colors.background, borderRadius: 8, height: 8, overflow: 'hidden' }}>
                      <View
                        style={{
                          backgroundColor: pollutantCategory.color,
                          height: '100%',
                          width: `${Math.min((data.aqi / 200) * 100, 100)}%`,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* AQI Scale Reference */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              📊 AQI Scale
            </Text>
            <View style={{ gap: 8 }}>
              {[
                { range: '0-50', category: 'Good', color: '#00E400', icon: '😊' },
                { range: '51-100', category: 'Moderate', color: '#FFFF00', icon: '😐' },
                { range: '101-150', category: 'Unhealthy for Sensitive', color: '#FF7E00', icon: '😷' },
                { range: '151-200', category: 'Unhealthy', color: '#FF0000', icon: '😨' },
                { range: '201-300', category: 'Very Unhealthy', color: '#8F3F97', icon: '🤢' },
                { range: '301+', category: 'Hazardous', color: '#7E0023', icon: '☠️' },
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: item.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                      {item.category}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      AQI {item.range}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Info Card */}
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, flexDirection: 'row', gap: 12 }}>
            <AntDesign name="infocirlce" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
                About AQI
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18 }}>
                The Air Quality Index is calculated based on major pollutants. Higher values indicate greater health concerns. Data updates hourly.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
