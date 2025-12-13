import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useSettings, TemperatureUnit, SpeedUnit, LayoutStyle } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function Settings() {
  const { colors, isDark, setTheme } = useTheme();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { t, currentLanguageInfo } = useLanguage();
  const router = useRouter();
  
  const toggleDarkMode = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const handleResetSettings = () => {
    Alert.alert(
      t('settings.resetToDefault'),
      t('settings.resetConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.ok'),
          style: 'destructive',
          onPress: async () => {
            await resetSettings();
            Alert.alert(t('common.success'), t('settings.resetSuccess'));
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {title}
      </Text>
      <View style={{ backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );

  const SettingRow = ({ 
    icon, 
    label, 
    value, 
    onPress, 
    showArrow = true,
    noBorder = false 
  }: { 
    icon: string; 
    label: string; 
    value?: string; 
    onPress?: () => void;
    showArrow?: boolean;
    noBorder?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: noBorder ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 20, marginRight: 12 }}>{icon}</Text>
      <Text style={{ flex: 1, fontSize: 16, color: colors.text }}>{label}</Text>
      {value && (
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginRight: 8 }}>
          {value}
        </Text>
      )}
      {showArrow && onPress && (
        <AntDesign name="right" size={16} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const ToggleRow = ({ 
    icon, 
    label, 
    value, 
    onToggle,
    noBorder = false 
  }: { 
    icon: string; 
    label: string; 
    value: boolean; 
    onToggle: (value: boolean) => void;
    noBorder?: boolean;
  }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: noBorder ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 20, marginRight: 12 }}>{icon}</Text>
      <Text style={{ flex: 1, fontSize: 16, color: colors.text }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="white"
      />
    </View>
  );

  const SelectionModal = (
    title: string,
    options: { label: string; value: string }[],
    currentValue: string,
    onSelect: (value: string) => void
  ) => {
    Alert.alert(
      title,
      undefined,
      options.map(option => ({
        text: `${option.label}${currentValue === option.value ? ' ✓' : ''}`,
        onPress: () => onSelect(option.value),
      }))
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <AntDesign name="left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, flex: 1 }}>
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Units */}
        <SettingSection title={t('settings.units')}>
          <SettingRow
            icon="🌡️"
            label={t('settings.temperature')}
            value={settings.temperatureUnit === 'fahrenheit' ? '°F' : '°C'}
            onPress={() => {
              SelectionModal(
                t('settings.temperature'),
                [
                  { label: t('settings.fahrenheit'), value: 'fahrenheit' },
                  { label: t('settings.celsius'), value: 'celsius' },
                ],
                settings.temperatureUnit,
                (value) => updateSettings({ temperatureUnit: value as TemperatureUnit })
              );
            }}
          />
          <SettingRow
            icon="💨"
            label={t('settings.windSpeed')}
            value={settings.speedUnit === 'mph' ? 'mph' : 'km/h'}
            onPress={() => {
              SelectionModal(
                t('settings.windSpeed'),
                [
                  { label: t('settings.mph'), value: 'mph' },
                  { label: t('settings.kmh'), value: 'kmh' },
                ],
                settings.speedUnit,
                (value) => updateSettings({ speedUnit: value as SpeedUnit })
              );
            }}
          />
          <SettingRow
            icon="📏"
            label={t('settings.distance')}
            value={settings.distanceUnit === 'miles' ? 'mi' : 'km'}
            onPress={() => {
              SelectionModal(
                t('settings.distance'),
                [
                  { label: t('settings.miles'), value: 'miles' },
                  { label: t('settings.kilometers'), value: 'km' },
                ],
                settings.distanceUnit,
                (value) => updateSettings({ distanceUnit: value as 'miles' | 'km' })
              );
            }}
            noBorder
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection title={t('settings.appearance')}>
          <ToggleRow
            icon="🌓"
            label={t('settings.darkMode')}
            value={isDark}
            onToggle={toggleDarkMode}
          />
          <SettingRow
            icon="📐"
            label={t('settings.layoutStyle')}
            value={t(`settings.${settings.layoutStyle}`)}
            onPress={() => {
              SelectionModal(
                t('settings.layoutStyle'),
                [
                  { label: t('settings.compact'), value: 'compact' },
                  { label: t('settings.comfortable'), value: 'comfortable' },
                  { label: t('settings.spacious'), value: 'spacious' },
                ],
                settings.layoutStyle,
                (value) => updateSettings({ layoutStyle: value as LayoutStyle })
              );
            }}
            noBorder
          />
        </SettingSection>

        {/* Language */}
        <SettingSection title={t('settings.language')}>
          <SettingRow
            icon={currentLanguageInfo.flag}
            label={t('settings.language')}
            value={currentLanguageInfo.nativeName}
            onPress={() => router.push('/(app)/language-settings')}
            noBorder
          />
        </SettingSection>

        {/* Location */}
        <SettingSection title={t('settings.location')}>
          <ToggleRow
            icon="📍"
            label={t('settings.autoDetectLocation')}
            value={settings.autoLocationEnabled}
            onToggle={(value) => updateSettings({ autoLocationEnabled: value })}
            noBorder
          />
        </SettingSection>

        {/* Display Options */}
        <SettingSection title={t('settings.displayOptions')}>
          <ToggleRow
            icon="⚠️"
            label={t('settings.weatherAlerts')}
            value={settings.showWeatherAlerts}
            onToggle={(value) => updateSettings({ showWeatherAlerts: value })}
          />
          <ToggleRow
            icon="🕐"
            label={t('settings.show24HourTime')}
            value={settings.show24HourTime}
            onToggle={(value) => updateSettings({ show24HourTime: value })}
          />
          <ToggleRow
            icon="🌡️"
            label={t('settings.showFeelsLike')}
            value={settings.showFeelsLike}
            onToggle={(value) => updateSettings({ showFeelsLike: value })}
          />
          <ToggleRow
            icon="💧"
            label={t('settings.showHumidity')}
            value={settings.showHumidity}
            onToggle={(value) => updateSettings({ showHumidity: value })}
          />
          <ToggleRow
            icon="💨"
            label={t('settings.showWindSpeed')}
            value={settings.showWindSpeed}
            onToggle={(value) => updateSettings({ showWindSpeed: value })}
          />
          <ToggleRow
            icon="🌧️"
            label={t('settings.showPrecipitation')}
            value={settings.showPrecipitation}
            onToggle={(value) => updateSettings({ showPrecipitation: value })}
            noBorder
          />
        </SettingSection>

        {/* Actions */}
        <SettingSection title={t('settings.actions')}>
          <SettingRow
            icon="📴"
            label={t('settings.offlineCache')}
            onPress={() => router.push('/(app)/offline-settings')}
          />
          <SettingRow
            icon="🔔"
            label={t('settings.notificationSettings')}
            onPress={() => router.push('/(app)/notification-settings')}
          />
          <SettingRow
            icon="🔄"
            label={t('settings.resetToDefault')}
            onPress={handleResetSettings}
            showArrow={false}
            noBorder
          />
        </SettingSection>

        {/* Info */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, flexDirection: 'row', gap: 12 }}>
          <AntDesign name="info-circle" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              {t('settings.aboutSettings')}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18 }}>
              {t('settings.customizeExperience')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
