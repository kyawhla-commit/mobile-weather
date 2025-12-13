import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertRule, alertService } from '../services/alertService';
import {
  getNotificationSettings,
  saveNotificationSettings,
  NotificationSettings,
} from '../services/notificationService';
import { useCustomAlert, AlertTypes } from './CustomAlert';

interface AlertSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export default function AlertSettings({ visible, onClose }: AlertSettingsProps) {
  const { showAlert, AlertComponent } = useCustomAlert();
  
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    extremeHeat: true,
    freezeWarning: true,
    highWind: true,
    heavyRain: true,
    frost: true,
    humidity: false,
  });
  const [showAddRule, setShowAddRule] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    const rules = await alertService.loadAlertRules();
    const settings = await getNotificationSettings();
    setAlertRules(rules);
    setNotificationSettings(settings);
  };

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    await alertService.updateAlertRule(ruleId, { enabled });
    const updatedRules = alertRules.map((rule) =>
      rule.id === ruleId ? { ...rule, enabled } : rule
    );
    setAlertRules(updatedRules);
  };

  const handleToggleNotification = async (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...notificationSettings, [key]: value };
    setNotificationSettings(updated);
    await saveNotificationSettings(updated);
  };

  const handleDeleteRule = (ruleId: string) => {
    showAlert(AlertTypes.destructive(
      'Delete Alert Rule',
      'Are you sure you want to delete this alert rule?',
      async () => {
        await alertService.removeAlertRule(ruleId);
        setAlertRules(alertRules.filter((rule) => rule.id !== ruleId));
      }
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-300';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300';
      case 'low':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-700';
      case 'medium':
        return 'text-yellow-700';
      case 'low':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  const renderRuleConditions = (rule: AlertRule) => {
    const conditions = [];
    
    if (rule.conditions.temperature) {
      const temp = rule.conditions.temperature;
      if (temp.min !== undefined && temp.max !== undefined) {
        conditions.push(`Temperature: ${temp.min}°-${temp.max}°${temp.unit}`);
      } else if (temp.min !== undefined) {
        conditions.push(`Temperature: >${temp.min}°${temp.unit}`);
      } else if (temp.max !== undefined) {
        conditions.push(`Temperature: <${temp.max}°${temp.unit}`);
      }
    }
    
    if (rule.conditions.wind) {
      conditions.push(`Wind: >${rule.conditions.wind.max} ${rule.conditions.wind.unit}`);
    }
    
    if (rule.conditions.humidity) {
      const hum = rule.conditions.humidity;
      if (hum.min !== undefined && hum.max !== undefined) {
        conditions.push(`Humidity: ${hum.min}%-${hum.max}%`);
      } else if (hum.min !== undefined) {
        conditions.push(`Humidity: >${hum.min}%`);
      } else if (hum.max !== undefined) {
        conditions.push(`Humidity: <${hum.max}%`);
      }
    }
    
    if (rule.conditions.precipitation) {
      conditions.push(`Rain: >${rule.conditions.precipitation.probability}% chance`);
    }
    
    if (rule.conditions.weatherConditions) {
      conditions.push(`Conditions: ${rule.conditions.weatherConditions.join(', ')}`);
    }
    
    return conditions.join(' • ');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 pt-12 pb-4">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-2xl font-bold text-gray-800">
              Alert Settings
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Text className="text-gray-600 text-lg">×</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1">
          {/* Notification Settings */}
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Notification Settings
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-700 font-medium">Enable Notifications</Text>
                <Switch
                  value={notificationSettings.enabled}
                  onValueChange={(value) => handleToggleNotification('enabled', value)}
                />
              </View>
              
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-700">Extreme Heat Alerts</Text>
                <Switch
                  value={notificationSettings.extremeHeat}
                  onValueChange={(value) => handleToggleNotification('extremeHeat', value)}
                  disabled={!notificationSettings.enabled}
                />
              </View>
              
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-700">Freeze Warnings</Text>
                <Switch
                  value={notificationSettings.freezeWarning}
                  onValueChange={(value) => handleToggleNotification('freezeWarning', value)}
                  disabled={!notificationSettings.enabled}
                />
              </View>
              
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-700">High Wind Alerts</Text>
                <Switch
                  value={notificationSettings.highWind}
                  onValueChange={(value) => handleToggleNotification('highWind', value)}
                  disabled={!notificationSettings.enabled}
                />
              </View>
              
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-700">Heavy Rain Alerts</Text>
                <Switch
                  value={notificationSettings.heavyRain}
                  onValueChange={(value) => handleToggleNotification('heavyRain', value)}
                  disabled={!notificationSettings.enabled}
                />
              </View>
              
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-700">Frost Advisories</Text>
                <Switch
                  value={notificationSettings.frost}
                  onValueChange={(value) => handleToggleNotification('frost', value)}
                  disabled={!notificationSettings.enabled}
                />
              </View>
              
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-700">High Humidity Alerts</Text>
                <Switch
                  value={notificationSettings.humidity}
                  onValueChange={(value) => handleToggleNotification('humidity', value)}
                  disabled={!notificationSettings.enabled}
                />
              </View>
            </View>
          </View>

          {/* Alert Rules */}
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Alert Rules ({alertRules.length})
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddRule(true)}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Add Rule</Text>
              </TouchableOpacity>
            </View>

            {alertRules.map((rule) => (
              <View
                key={rule.id}
                className={`mb-3 p-4 rounded-xl border ${getSeverityColor(rule.severity)}`}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-xl mr-2">{rule.icon}</Text>
                      <Text className="text-lg font-bold text-gray-800">
                        {rule.name}
                      </Text>
                    </View>
                    <Text className={`text-sm font-medium uppercase ${getSeverityTextColor(rule.severity)}`}>
                      {rule.severity} Priority
                    </Text>
                  </View>
                  <Switch
                    value={rule.enabled}
                    onValueChange={(value) => handleToggleRule(rule.id, value)}
                  />
                </View>
                
                <Text className="text-gray-700 text-sm mb-2">
                  {rule.message}
                </Text>
                
                <Text className="text-gray-500 text-xs mb-3">
                  {renderRuleConditions(rule)}
                </Text>
                
                {rule.id.startsWith('custom-') && (
                  <View className="flex-row justify-end">
                    <TouchableOpacity
                      onPress={() => setEditingRule(rule)}
                      className="mr-2 px-3 py-1 bg-blue-100 rounded"
                    >
                      <Text className="text-blue-600 text-sm">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteRule(rule.id)}
                      className="px-3 py-1 bg-red-100 rounded"
                    >
                      <Text className="text-red-600 text-sm">Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
        
        {AlertComponent}
      </View>
    </Modal>
  );
}