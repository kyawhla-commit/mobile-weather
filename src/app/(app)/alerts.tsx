import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useCities } from '../../context/CitiesContext';
import { useNotificationCount } from '../../context/NotificationContext';
import {
  getWeatherAlerts,
  getCurrentConditions,
  generateSmartAlerts,
  WeatherAlert,
} from '../../services/weather';

export default function Alerts() {
  const { colors } = useTheme();
  const router = useRouter();
  const { cities } = useCities();
  const { clearUnreadCount } = useNotificationCount();
  const [alerts, setAlerts] = useState<Array<{ city: string; alerts: any[] }>>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAlerts();
    // Clear unread count when viewing alerts page
    clearUnreadCount();
  }, [cities]);

  const loadAlerts = async () => {
    if (cities.length === 0) return;

    setLoading(true);
    try {
      const allAlerts = await Promise.all(
        cities.map(async (city) => {
          try {
            const [officialAlerts, currentWeather] = await Promise.all([
              getWeatherAlerts(city.Key),
              getCurrentConditions(city.Key),
            ]);

            const smartAlerts = generateSmartAlerts(currentWeather, []);

            return {
              city: city.LocalizedName,
              alerts: [...officialAlerts, ...smartAlerts],
            };
          } catch (error) {
            return { city: city.LocalizedName, alerts: [] };
          }
        })
      );

      setAlerts(allAlerts.filter((a) => a.alerts.length > 0));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
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
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'extreme':
        return colors.errorLight;
      case 'medium':
      case 'moderate':
        return '#FEF3C7';
      case 'low':
        return '#D1FAE5';
      default:
        return colors.card;
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
            Weather Alerts
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            {alerts.reduce((sum, a) => sum + a.alerts.length, 0)} active alerts
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => router.push('/(app)/alert-history')}>
            <AntDesign name="clockcircle" size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(app)/notification-settings')}>
            <AntDesign name="setting" size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRefresh} disabled={loading}>
            <AntDesign name="reload1" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }>
        {alerts.length === 0 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 60,
            }}>
            <Text style={{ fontSize: 80, marginBottom: 16 }}>✅</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 8,
              }}>
              No Active Alerts
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                textAlign: 'center',
              }}>
              All your locations have safe weather conditions
            </Text>
          </View>
        ) : (
          <View style={{ gap: 20 }}>
            {alerts.map((cityAlerts, cityIndex) => (
              <View key={cityIndex}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: 12,
                  }}>
                  📍 {cityAlerts.city}
                </Text>
                <View style={{ gap: 12 }}>
                  {cityAlerts.alerts.map((alert: any, alertIndex: number) => (
                    <View
                      key={alertIndex}
                      style={{
                        backgroundColor: getSeverityBg(
                          alert.severity || alert.Level
                        ),
                        borderRadius: 16,
                        padding: 16,
                        borderLeftWidth: 4,
                        borderLeftColor: getSeverityColor(
                          alert.severity || alert.Level
                        ),
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            flex: 1,
                          }}>
                          <Text style={{ fontSize: 24 }}>
                            {alert.icon || '⚠️'}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              color: colors.text,
                              flex: 1,
                            }}>
                            {alert.type || alert.Category}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: getSeverityColor(
                              alert.severity || alert.Level
                            ),
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 12,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 10,
                              fontWeight: 'bold',
                            }}>
                            {(
                              alert.severity ||
                              alert.Level ||
                              'ALERT'
                            ).toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.text,
                          lineHeight: 20,
                        }}>
                        {alert.message ||
                          alert.Description?.Localized ||
                          'Weather alert in effect'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        {alerts.length > 0 && (
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              onPress={() => router.push('/(app)/notification-settings')}
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}>
              <AntDesign name="setting" size={20} color={colors.primary} />
              <Text
                style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(app)/alert-history')}
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}>
              <AntDesign name="clockcircle" size={20} color={colors.primary} />
              <Text
                style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                History
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginTop: 24,
            flexDirection: 'row',
            gap: 12,
          }}>
          <AntDesign name="infocirlce" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 4,
              }}>
              About Weather Alerts
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                lineHeight: 18,
              }}>
              Alerts are generated from official weather services and smart
              analysis of current conditions. Stay safe and take appropriate
              precautions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
