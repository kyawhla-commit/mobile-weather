import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TemperatureUnit = 'fahrenheit' | 'celsius';
export type SpeedUnit = 'mph' | 'kmh';
export type PressureUnit = 'inHg' | 'mb';
export type DistanceUnit = 'miles' | 'km';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type LayoutStyle = 'compact' | 'comfortable' | 'spacious';

interface Settings {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  pressureUnit: PressureUnit;
  distanceUnit: DistanceUnit;
  themeMode: ThemeMode;
  layoutStyle: LayoutStyle;
  autoLocationEnabled: boolean;
  showWeatherAlerts: boolean;
  show24HourTime: boolean;
  showFeelsLike: boolean;
  showHumidity: boolean;
  showWindSpeed: boolean;
  showPrecipitation: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  convertTemperature: (temp: number, fromUnit?: TemperatureUnit) => number;
  convertSpeed: (speed: number, fromUnit?: SpeedUnit) => number;
  convertDistance: (distance: number, fromUnit?: DistanceUnit) => number;
  getTemperatureSymbol: () => string;
  getSpeedSymbol: () => string;
  getDistanceSymbol: () => string;
}

const DEFAULT_SETTINGS: Settings = {
  temperatureUnit: 'fahrenheit',
  speedUnit: 'mph',
  pressureUnit: 'inHg',
  distanceUnit: 'miles',
  themeMode: 'auto',
  layoutStyle: 'comfortable',
  autoLocationEnabled: true,
  showWeatherAlerts: true,
  show24HourTime: false,
  showFeelsLike: true,
  showHumidity: true,
  showWindSpeed: true,
  showPrecipitation: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('appSettings');
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await AsyncStorage.setItem('appSettings', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(DEFAULT_SETTINGS);
      await AsyncStorage.setItem(
        'appSettings',
        JSON.stringify(DEFAULT_SETTINGS)
      );
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  const convertTemperature = (
    temp: number,
    fromUnit: TemperatureUnit = 'fahrenheit'
  ): number => {
    if (settings.temperatureUnit === fromUnit) return temp;

    if (fromUnit === 'fahrenheit' && settings.temperatureUnit === 'celsius') {
      return (temp - 32) * (5 / 9);
    } else if (
      fromUnit === 'celsius' &&
      settings.temperatureUnit === 'fahrenheit'
    ) {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  const convertSpeed = (speed: number, fromUnit: SpeedUnit = 'mph'): number => {
    if (settings.speedUnit === fromUnit) return speed;

    if (fromUnit === 'mph' && settings.speedUnit === 'kmh') {
      return speed * 1.60934;
    } else if (fromUnit === 'kmh' && settings.speedUnit === 'mph') {
      return speed / 1.60934;
    }
    return speed;
  };

  const convertDistance = (
    distance: number,
    fromUnit: DistanceUnit = 'miles'
  ): number => {
    if (settings.distanceUnit === fromUnit) return distance;

    if (fromUnit === 'miles' && settings.distanceUnit === 'km') {
      return distance * 1.60934;
    } else if (fromUnit === 'km' && settings.distanceUnit === 'miles') {
      return distance / 1.60934;
    }
    return distance;
  };

  const getTemperatureSymbol = (): string => {
    return settings.temperatureUnit === 'fahrenheit' ? '°F' : '°C';
  };

  const getSpeedSymbol = (): string => {
    return settings.speedUnit === 'mph' ? 'mph' : 'km/h';
  };

  const getDistanceSymbol = (): string => {
    return settings.distanceUnit === 'miles' ? 'mi' : 'km';
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        convertTemperature,
        convertSpeed,
        convertDistance,
        getTemperatureSymbol,
        getSpeedSymbol,
        getDistanceSymbol,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
