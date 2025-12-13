import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {
  getNotificationSettings,
  saveNotificationSettings,
  registerForPushNotificationsAsync,
  NotificationSettings,
} from '../../services/notificationService';

export default function NotificationSettingsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    extremeHeat: true,
    freezeWarning: true,
    highWind: true,
    heavyRain: true,
    frost: true,
    humidity: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await getNotificationSettings();
    setSettings(saved);
    setLoading(false);
  };

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveNotificationSettings(updated);
    
    if (key === 'enabled' && value) {
      await registerForPushNotificationsAsync();
    }
  };

  const alertTypes = [
    { key: 'extremeHeat' as const, label: 'Extreme Heat', icon: '🌡️', description: 'Temperature above 95°F' },
    { key: 'freezeWarning' as const, label: 'Freeze Warning', icon: '❄️', description: 'Temperature below 32°F' },
    { key: 'frost' as const, label: 'Frost Advisory', icon: '🧊', description: 'Temperature 32-40°F' },
    { key: 'highWind' as const, label: 'High Wind', icon: '💨', description: 'Wind speed above 30 mph' },
    { key: 'heavyRain' as const, label: 'Heavy Rain', icon: '🌧️', description: 'Precipitation alerts' },
    { key: 'humidity' as const, label: 'High Humidity', icon: '💧', description: 'Humidity above 85%' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <AntDesign name="left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
            Notification Settings
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            Manage weather alerts
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Master Toggle */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Text style={{ fontSize: 28 }}>🔔</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                  Push Notifications
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                Enable weather alerts and notifications
              </Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={(value) => updateSetting('enabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={settings.enabled ? 'white' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Alert Types */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 }}>
          Alert Types
        </Text>
        <View style={{ gap: 12 }}>
          {alertTypes.map((alert) => (
            <View
              key={alert.key}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                opacity: settings.enabled ? 1 : 0.5,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Text style={{ fontSize: 20 }}>{alert.icon}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      {alert.label}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {alert.description}
                  </Text>
                </View>
                <Switch
                  value={settings[alert.key]}
                  onValueChange={(value) => updateSetting(alert.key, value)}
                  disabled={!settings.enabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings[alert.key] ? 'white' : '#f4f3f4'}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Info Card */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginTop: 24, flexDirection: 'row', gap: 12 }}>
          <AntDesign name="infocirlce" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              About Notifications
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18 }}>
              Notifications are sent when weather conditions match your selected alert types. You'll receive alerts for all your saved cities.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
