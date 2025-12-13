import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { WeatherAlert, CurrentConditions, DailyForecast } from './weather';
import { scheduleWeatherAlert, saveAlertToHistory } from './notificationService';

export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    temperature?: {
      min?: number;
      max?: number;
      unit: 'F' | 'C';
    };
    wind?: {
      max: number;
      unit: 'mph' | 'kmh';
    };
    humidity?: {
      min?: number;
      max?: number;
    };
    precipitation?: {
      probability: number;
    };
    weatherConditions?: string[];
  };
  severity: 'low' | 'medium' | 'high';
  message: string;
  icon: string;
}

export interface ProcessedAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  icon: string;
  timestamp: number;
  source: 'official' | 'smart' | 'custom';
  locationKey: string;
  cityName: string;
  expiresAt?: number;
}

const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: 'extreme-heat',
    name: 'Extreme Heat Warning',
    enabled: true,
    conditions: {
      temperature: { min: 95, unit: 'F' },
    },
    severity: 'high',
    message: 'Dangerous heat conditions. Stay hydrated and avoid outdoor activities.',
    icon: '🌡️',
  },
  {
    id: 'freeze-warning',
    name: 'Freeze Warning',
    enabled: true,
    conditions: {
      temperature: { max: 32, unit: 'F' },
    },
    severity: 'high',
    message: 'Freezing temperatures expected. Protect sensitive plants and pipes.',
    icon: '❄️',
  },
  {
    id: 'high-wind',
    name: 'High Wind Warning',
    enabled: true,
    conditions: {
      wind: { max: 30, unit: 'mph' },
    },
    severity: 'high',
    message: 'Dangerous wind conditions. Secure loose objects and use caution outdoors.',
    icon: '💨',
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Rain Alert',
    enabled: true,
    conditions: {
      precipitation: { probability: 80 },
      weatherConditions: ['Rain', 'Heavy Rain', 'Thunderstorms'],
    },
    severity: 'medium',
    message: 'Heavy rain expected. Avoid low-lying areas and drive carefully.',
    icon: '🌧️',
  },
  {
    id: 'frost-advisory',
    name: 'Frost Advisory',
    enabled: true,
    conditions: {
      temperature: { min: 32, max: 40, unit: 'F' },
    },
    severity: 'medium',
    message: 'Frost conditions possible. Cover sensitive plants.',
    icon: '🧊',
  },
  {
    id: 'high-humidity',
    name: 'High Humidity Alert',
    enabled: false,
    conditions: {
      humidity: { min: 85 },
      temperature: { min: 75, unit: 'F' },
    },
    severity: 'low',
    message: 'Very high humidity. Increased disease risk for crops and discomfort.',
    icon: '💧',
  },
];

export class AlertService {
  private alertRules: AlertRule[] = [];
  private activeAlerts: ProcessedAlert[] = [];

  async initialize() {
    await this.loadAlertRules();
  }

  async loadAlertRules(): Promise<AlertRule[]> {
    try {
      const saved = await AsyncStorage.getItem('alertRules');
      if (saved) {
        this.alertRules = JSON.parse(saved);
      } else {
        this.alertRules = DEFAULT_ALERT_RULES;
        await this.saveAlertRules();
      }
      return this.alertRules;
    } catch (error) {
      console.error('Error loading alert rules:', error);
      this.alertRules = DEFAULT_ALERT_RULES;
      return this.alertRules;
    }
  }

  async saveAlertRules(): Promise<void> {
    try {
      await AsyncStorage.setItem('alertRules', JSON.stringify(this.alertRules));
    } catch (error) {
      console.error('Error saving alert rules:', error);
    }
  }

  async updateAlertRule(ruleId: string, updates: Partial<AlertRule>): Promise<void> {
    this.alertRules = this.alertRules.map((rule) =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    await this.saveAlertRules();
  }

  async addCustomAlertRule(rule: Omit<AlertRule, 'id'>): Promise<string> {
    const newRule: AlertRule = {
      ...rule,
      id: `custom-${Date.now()}`,
    };
    this.alertRules.push(newRule);
    await this.saveAlertRules();
    return newRule.id;
  }

  async removeAlertRule(ruleId: string): Promise<void> {
    this.alertRules = this.alertRules.filter((rule) => rule.id !== ruleId);
    await this.saveAlertRules();
  }

  processWeatherData(
    currentWeather: CurrentConditions,
    forecast: DailyForecast[],
    officialAlerts: WeatherAlert[],
    locationKey: string,
    cityName: string
  ): ProcessedAlert[] {
    const alerts: ProcessedAlert[] = [];

    // Process official alerts
    officialAlerts.forEach((alert) => {
      alerts.push({
        id: `official-${alert.AlertID}`,
        type: alert.Type,
        severity: this.mapOfficialSeverity(alert.Level),
        message: alert.Description.Localized,
        icon: this.getAlertIcon(alert.Type),
        timestamp: Date.now(),
        source: 'official',
        locationKey,
        cityName,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });
    });

    // Process smart alerts based on rules
    const enabledRules = this.alertRules.filter((rule) => rule.enabled);
    
    enabledRules.forEach((rule) => {
      if (this.evaluateRule(rule, currentWeather, forecast)) {
        const alert: ProcessedAlert = {
          id: `smart-${rule.id}-${Date.now()}`,
          type: rule.name,
          severity: rule.severity,
          message: this.formatAlertMessage(rule.message, currentWeather, cityName),
          icon: rule.icon,
          timestamp: Date.now(),
          source: 'smart',
          locationKey,
          cityName,
          expiresAt: Date.now() + 6 * 60 * 60 * 1000, // 6 hours
        };
        alerts.push(alert);
      }
    });

    this.activeAlerts = alerts;
    return alerts;
  }

  private evaluateRule(
    rule: AlertRule,
    currentWeather: CurrentConditions,
    forecast: DailyForecast[]
  ): boolean {
    const { conditions } = rule;

    // Temperature check
    if (conditions.temperature) {
      const temp = currentWeather.Temperature.Imperial.Value;
      if (conditions.temperature.min !== undefined && temp < conditions.temperature.min) {
        return false;
      }
      if (conditions.temperature.max !== undefined && temp > conditions.temperature.max) {
        return false;
      }
    }

    // Wind check
    if (conditions.wind) {
      const windSpeed = currentWeather.Wind.Speed.Imperial.Value;
      if (windSpeed < conditions.wind.max) {
        return false;
      }
    }

    // Humidity check
    if (conditions.humidity) {
      const humidity = currentWeather.RelativeHumidity;
      if (conditions.humidity.min !== undefined && humidity < conditions.humidity.min) {
        return false;
      }
      if (conditions.humidity.max !== undefined && humidity > conditions.humidity.max) {
        return false;
      }
    }

    // Weather conditions check
    if (conditions.weatherConditions) {
      const currentCondition = currentWeather.WeatherText;
      if (!conditions.weatherConditions.some((condition) =>
        currentCondition.toLowerCase().includes(condition.toLowerCase())
      )) {
        return false;
      }
    }

    return true;
  }

  private mapOfficialSeverity(level: string): 'low' | 'medium' | 'high' {
    switch (level.toLowerCase()) {
      case 'minor':
        return 'low';
      case 'moderate':
        return 'medium';
      case 'major':
      case 'severe':
        return 'high';
      default:
        return 'medium';
    }
  }

  private getAlertIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'Heat Warning': '🌡️',
      'Cold Warning': '❄️',
      'Wind Warning': '💨',
      'Rain Warning': '🌧️',
      'Snow Warning': '🌨️',
      'Thunderstorm Warning': '⛈️',
      'Fog Warning': '🌫️',
      'Ice Warning': '🧊',
      'Flood Warning': '🌊',
      'Tornado Warning': '🌪️',
      'Hurricane Warning': '🌀',
    };
    
    return iconMap[type] || '⚠️';
  }

  private formatAlertMessage(
    template: string,
    currentWeather: CurrentConditions,
    cityName: string
  ): string {
    const temp = Math.round(currentWeather.Temperature.Imperial.Value);
    const wind = Math.round(currentWeather.Wind.Speed.Imperial.Value);
    const humidity = currentWeather.RelativeHumidity;

    return template
      .replace('{temperature}', `${temp}°F`)
      .replace('{wind}', `${wind} mph`)
      .replace('{humidity}', `${humidity}%`)
      .replace('{city}', cityName);
  }

  async sendAlertNotifications(alerts: ProcessedAlert[]): Promise<void> {
    for (const alert of alerts) {
      // Check if we've already sent this alert recently
      const recentAlerts = await this.getRecentAlerts(alert.locationKey);
      const isDuplicate = recentAlerts.some(
        (recent) =>
          recent.type === alert.type &&
          Date.now() - recent.timestamp < 60 * 60 * 1000 // 1 hour
      );

      if (!isDuplicate) {
        await scheduleWeatherAlert({
          title: `${alert.icon} ${alert.type}`,
          body: alert.message,
          data: alert,
        });

        await saveAlertToHistory({
          type: alert.type,
          message: alert.message,
          severity: alert.severity,
          city: alert.cityName,
        });

        await this.saveAlertToRecent(alert);
      }
    }
  }

  private async getRecentAlerts(locationKey: string): Promise<ProcessedAlert[]> {
    try {
      const recent = await AsyncStorage.getItem(`recentAlerts_${locationKey}`);
      if (recent) {
        const alerts: ProcessedAlert[] = JSON.parse(recent);
        // Filter out expired alerts
        return alerts.filter((alert) => 
          !alert.expiresAt || Date.now() < alert.expiresAt
        );
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  private async saveAlertToRecent(alert: ProcessedAlert): Promise<void> {
    try {
      const recent = await this.getRecentAlerts(alert.locationKey);
      const updated = [alert, ...recent].slice(0, 20); // Keep last 20
      await AsyncStorage.setItem(
        `recentAlerts_${alert.locationKey}`,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error('Error saving recent alert:', error);
    }
  }

  getActiveAlerts(): ProcessedAlert[] {
    return this.activeAlerts.filter(
      (alert) => !alert.expiresAt || Date.now() < alert.expiresAt
    );
  }

  getAlertRules(): AlertRule[] {
    return this.alertRules;
  }

  async clearExpiredAlerts(): Promise<void> {
    this.activeAlerts = this.activeAlerts.filter(
      (alert) => !alert.expiresAt || Date.now() < alert.expiresAt
    );
  }
}

// Singleton instance
export const alertService = new AlertService();