import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { WeatherWidgetData } from './WeatherWidget';

interface WeatherWidgetConfigProps {
  visible: boolean;
  onClose: () => void;
  onAddWidget: (type: WeatherWidgetData['type']) => void;
}

export default function WeatherWidgetConfig({
  visible,
  onClose,
  onAddWidget,
}: WeatherWidgetConfigProps) {
  const [selectedCategory, setSelectedCategory] = useState<'essential' | 'detailed' | 'all'>('essential');

  const widgetTypes = {
    essential: [
      {
        type: 'current' as const,
        title: 'Current Weather',
        description: 'Temperature, condition, and weather icon',
        icon: 'weather-partly-cloudy',
        gradient: ['#4F46E5', '#7C3AED'],
        popular: true,
      },
      {
        type: 'forecast' as const,
        title: '5-Day Forecast',
        description: 'Daily weather forecast with highs and lows',
        icon: 'calendar-week',
        gradient: ['#059669', '#0D9488'],
        popular: true,
      },
      {
        type: 'alerts' as const,
        title: 'Weather Alerts',
        description: 'Severe weather warnings and notifications',
        icon: 'alert',
        gradient: ['#DC2626', '#B91C1C'],
        popular: false,
      },
    ],
    detailed: [
      {
        type: 'hourly' as const,
        title: 'Hourly Forecast',
        description: 'Hour-by-hour weather conditions',
        icon: 'clock-outline',
        gradient: ['#DC2626', '#EA580C'],
        popular: false,
      },
      {
        type: 'aqi' as const,
        title: 'Air Quality',
        description: 'Air quality index and health recommendations',
        icon: 'air-filter',
        gradient: ['#6366F1', '#8B5CF6'],
        popular: false,
      },
      {
        type: 'wind' as const,
        title: 'Wind Conditions',
        description: 'Wind speed, direction, and gusts',
        icon: 'weather-windy',
        gradient: ['#0EA5E9', '#0284C7'],
        popular: false,
      },
      {
        type: 'humidity' as const,
        title: 'Humidity',
        description: 'Relative humidity and dew point',
        icon: 'water-percent',
        gradient: ['#06B6D4', '#0891B2'],
        popular: false,
      },
    ],
    advanced: [
      {
        type: 'pressure' as const,
        title: 'Atmospheric Pressure',
        description: 'Barometric pressure and trends',
        icon: 'gauge',
        gradient: ['#8B5CF6', '#7C3AED'],
        popular: false,
      },
      {
        type: 'uv' as const,
        title: 'UV Index',
        description: 'UV radiation levels and sun safety',
        icon: 'white-balance-sunny',
        gradient: ['#F59E0B', '#D97706'],
        popular: false,
      },
      {
        type: 'visibility' as const,
        title: 'Visibility',
        description: 'Atmospheric visibility conditions',
        icon: 'eye-outline',
        gradient: ['#6B7280', '#4B5563'],
        popular: false,
      },
    ],
  };

  const getAllWidgets = () => {
    switch (selectedCategory) {
      case 'essential':
        return widgetTypes.essential;
      case 'detailed':
        return [...widgetTypes.essential, ...widgetTypes.detailed];
      case 'all':
        return [...widgetTypes.essential, ...widgetTypes.detailed, ...widgetTypes.advanced];
      default:
        return widgetTypes.essential;
    }
  };

  const handleAddWidget = (type: WeatherWidgetData['type']) => {
    onAddWidget(type);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 pt-12 pb-4">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-2xl font-bold text-gray-800">
              Add Weather Widget
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Text className="text-gray-600 text-lg">×</Text>
            </TouchableOpacity>
          </View>

          {/* Category Selector */}
          <View className="px-4 mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-2">
                {(['essential', 'detailed', 'all'] as const).map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === category
                        ? 'bg-blue-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`font-medium capitalize ${
                        selectedCategory === category
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Widget Grid */}
        <ScrollView className="flex-1 p-4">
          <View className="flex-row flex-wrap justify-between">
            {getAllWidgets().map((widget) => (
              <TouchableOpacity
                key={widget.type}
                onPress={() => handleAddWidget(widget.type)}
                className="w-[48%] mb-4"
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={widget.gradient as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl p-4 h-32"
                >
                  {/* Popular badge */}
                  {widget.popular && (
                    <View className="absolute top-2 right-2 bg-white/20 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-medium">Popular</Text>
                    </View>
                  )}

                  <View className="flex-1 justify-between">
                    <View>
                      <MaterialCommunityIcons 
                        name={widget.icon as any} 
                        size={32} 
                        color="white" 
                      />
                    </View>
                    
                    <View>
                      <Text className="text-white font-bold text-base mb-1">
                        {widget.title}
                      </Text>
                      <Text className="text-white/80 text-xs" numberOfLines={2}>
                        {widget.description}
                      </Text>
                    </View>
                  </View>

                  {/* Add icon */}
                  <View className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="plus" size={16} color="white" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tips Section */}
          <View className="mt-6 p-4 bg-blue-50 rounded-2xl">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#3B82F6" />
              <Text className="text-blue-800 font-bold text-base ml-2">
                Widget Tips
              </Text>
            </View>
            
            <View className="space-y-2">
              <Text className="text-blue-700 text-sm">
                • Long press any widget to enter edit mode
              </Text>
              <Text className="text-blue-700 text-sm">
                • Drag widgets to rearrange their position
              </Text>
              <Text className="text-blue-700 text-sm">
                • Use different sizes for different information density
              </Text>
              <Text className="text-blue-700 text-sm">
                • Essential widgets are perfect for quick glances
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}