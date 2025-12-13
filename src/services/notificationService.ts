import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Safely import expo-notifications and device
let Notifications: any = null;
let Device: any = null;

try {
  Notifications = require('expo-notifications');
  Device = require('expo-device');
  
  // Configure notification behavior only if available
  if (Notifications && Notifications.setNotificationHandler) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch (error) {
  console.warn('expo-notifications not available in this environment:', error.message);
}

export interface NotificationSettings {
  enabled: boolean;
  extremeHeat: boolean;
  freezeWarning: boolean;
  highWind: boolean;
  heavyRain: boolean;
  frost: boolean;
  humidity: boolean;
}

export interface AlertHistory {
  id: string;
  type: string;
  message: string;
  severity: string;
  city: string;
  timestamp: number;
  read: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  extremeHeat: true,
  freezeWarning: true,
  highWind: true,
  heavyRain: true,
  frost: true,
  humidity: false,
};

export async function registerForPushNotificationsAsync() {
  if (!Notifications || !Device) {
    console.warn('Push notifications not available in this environment');
    return null;
  }

  let token;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('weather-alerts', {
        name: 'Weather Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permission not granted');
        return null;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      console.warn('Must use physical device for Push Notifications');
    }
  } catch (error) {
    console.warn('Error registering for push notifications:', error.message);
  }

  return token;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const settings = await AsyncStorage.getItem('notificationSettings');
    return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}

export async function saveNotificationSettings(settings: NotificationSettings) {
  try {
    await AsyncStorage.setItem(
      'notificationSettings',
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
}

export async function getAlertHistory(): Promise<AlertHistory[]> {
  try {
    const history = await AsyncStorage.getItem('alertHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    return [];
  }
}

export async function saveAlertToHistory(
  alert: Omit<AlertHistory, 'id' | 'timestamp' | 'read'>
) {
  try {
    const history = await getAlertHistory();
    const newAlert: AlertHistory = {
      ...alert,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };

    const updatedHistory = [newAlert, ...history].slice(0, 50); // Keep last 50 alerts
    await AsyncStorage.setItem('alertHistory', JSON.stringify(updatedHistory));
    
    // Increment unread count
    await incrementUnreadCount();
  } catch (error) {
    console.error('Error saving alert to history:', error);
  }
}

export async function incrementUnreadCount() {
  try {
    const count = await AsyncStorage.getItem('unreadAlertCount');
    const newCount = count ? parseInt(count, 10) + 1 : 1;
    await AsyncStorage.setItem('unreadAlertCount', newCount.toString());
  } catch (error) {
    console.error('Error incrementing unread count:', error);
  }
}

export async function markAlertAsRead(alertId: string) {
  try {
    const history = await getAlertHistory();
    const updated = history.map((alert) =>
      alert.id === alertId ? { ...alert, read: true } : alert
    );
    await AsyncStorage.setItem('alertHistory', JSON.stringify(updated));
  } catch (error) {
    console.error('Error marking alert as read:', error);
  }
}

export async function clearAlertHistory() {
  try {
    await AsyncStorage.removeItem('alertHistory');
  } catch (error) {
    console.error('Error clearing alert history:', error);
  }
}

export async function scheduleWeatherAlert(alert: {
  title: string;
  body: string;
  data?: any;
}) {
  const settings = await getNotificationSettings();

  if (!settings.enabled) return;

  if (!Notifications || !Notifications.scheduleNotificationAsync) {
    console.warn('Notifications not available, alert saved to history only');
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: alert.title,
        body: alert.body,
        data: alert.data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority?.HIGH || 'high',
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.warn('Error scheduling notification:', error.message);
  }
}

export async function checkAndSendAlerts(
  currentWeather: any,
  cityName: string
) {
  const settings = await getNotificationSettings();

  if (!settings.enabled) return;

  const tempF = currentWeather.Temperature.Imperial.Value;
  const windSpeed = currentWeather.Wind.Speed.Imperial.Value;
  const humidity = currentWeather.RelativeHumidity;

  // Extreme Heat Alert
  if (settings.extremeHeat && tempF > 95) {
    const alert = {
      type: 'Extreme Heat',
      message: `Dangerous heat at ${Math.round(tempF)}°F in ${cityName}`,
      severity: 'high',
      city: cityName,
    };

    await scheduleWeatherAlert({
      title: '🌡️ Extreme Heat Warning',
      body: alert.message,
      data: alert,
    });

    await saveAlertToHistory(alert);
  }

  // Freeze Warning
  if (settings.freezeWarning && tempF < 32) {
    const alert = {
      type: 'Freeze Warning',
      message: `Freezing temperature at ${Math.round(tempF)}°F in ${cityName}`,
      severity: 'high',
      city: cityName,
    };

    await scheduleWeatherAlert({
      title: '❄️ Freeze Warning',
      body: alert.message,
      data: alert,
    });

    await saveAlertToHistory(alert);
  }

  // Frost Advisory
  if (settings.frost && tempF >= 32 && tempF < 40) {
    const alert = {
      type: 'Frost Advisory',
      message: `Cold temperature at ${Math.round(
        tempF
      )}°F in ${cityName}. Frost possible.`,
      severity: 'medium',
      city: cityName,
    };

    await scheduleWeatherAlert({
      title: '🧊 Frost Advisory',
      body: alert.message,
      data: alert,
    });

    await saveAlertToHistory(alert);
  }

  // High Wind Warning
  if (settings.highWind && windSpeed > 30) {
    const alert = {
      type: 'High Wind Warning',
      message: `Dangerous winds at ${Math.round(windSpeed)} mph in ${cityName}`,
      severity: 'high',
      city: cityName,
    };

    await scheduleWeatherAlert({
      title: '💨 High Wind Warning',
      body: alert.message,
      data: alert,
    });

    await saveAlertToHistory(alert);
  }

  // High Humidity
  if (settings.humidity && humidity > 85 && tempF > 75) {
    const alert = {
      type: 'High Humidity',
      message: `Very humid at ${humidity}% in ${cityName}. Disease risk for crops.`,
      severity: 'medium',
      city: cityName,
    };

    await scheduleWeatherAlert({
      title: '💧 High Humidity Alert',
      body: alert.message,
      data: alert,
    });

    await saveAlertToHistory(alert);
  }
}
