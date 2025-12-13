import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherAlert } from '../services/weather';

interface SevereWeatherAlertsProps {
  alerts: WeatherAlert[];
  smartAlerts: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
    icon: string;
  }>;
  cityName: string;
  visible: boolean;
  onClose: () => void;
}

export default function SevereWeatherAlerts({
  alerts,
  smartAlerts,
  cityName,
  visible,
  onClose,
}: SevereWeatherAlertsProps) {
  // All hooks must be declared before any conditional returns
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Early return after all hooks are declared
  if (!visible) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return ['#DC2626', '#B91C1C'];
      case 'medium':
        return ['#EA580C', '#D97706'];
      case 'low':
        return ['#059669', '#047857'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const renderAlerts = () => {
    const allAlerts = [
      ...alerts.map((alert) => ({
        id: alert.AlertID.toString(),
        type: alert.Type,
        severity: alert.Level.toLowerCase(),
        message: alert.Description.Localized,
        icon: getSeverityIcon(alert.Level.toLowerCase()),
        source: 'AccuWeather',
        isOfficial: true,
      })),
      ...smartAlerts.map((alert, index) => ({
        id: `smart-${index}`,
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        icon: alert.icon,
        source: 'Smart Alert',
        isOfficial: false,
      })),
    ];

    if (allAlerts.length === 0) {
      return (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-6xl mb-4">☀️</Text>
          <Text className="text-xl font-bold text-gray-800 mb-2">
            No Active Alerts
          </Text>
          <Text className="text-gray-600 text-center">
            Weather conditions are currently normal for {cityName}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView className="flex-1 p-4">
        {allAlerts.map((alert) => (
          <Animated.View
            key={alert.id}
            style={{ opacity: fadeAnim }}
            className="mb-4"
          >
            <LinearGradient
              colors={getSeverityColor(alert.severity) as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-4 shadow-lg"
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{alert.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">
                      {alert.type}
                    </Text>
                    <Text className="text-white/80 text-sm">
                      {alert.source}
                      {alert.isOfficial && ' • Official'}
                    </Text>
                  </View>
                </View>
                <View className="bg-white/20 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-medium uppercase">
                    {alert.severity}
                  </Text>
                </View>
              </View>
              <Text className="text-white text-sm leading-5">
                {alert.message}
              </Text>
            </LinearGradient>
          </Animated.View>
        ))}
      </ScrollView>
    );
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
              Weather Alerts
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Text className="text-gray-600 text-lg">×</Text>
            </TouchableOpacity>
          </View>
          
          <View className="px-4 mt-2">
            <Text className="text-gray-600 text-center">
              Current weather alerts for {cityName}
            </Text>
          </View>
        </View>

        {/* Content - Only Current Alerts */}
        {renderAlerts()}
      </View>
    </Modal>
  );
}