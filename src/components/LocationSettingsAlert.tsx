import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { SettingsNavigation, getLocationInstructions } from '../utils/settingsNavigation';

const { width } = Dimensions.get('window');

interface LocationSettingsAlertProps {
  visible: boolean;
  onClose: () => void;
  issue: 'location_services' | 'app_permission';
  title: string;
  message: string;
}

export default function LocationSettingsAlert({
  visible,
  onClose,
  issue,
  title,
  message,
}: LocationSettingsAlertProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const instructions = getLocationInstructions();
  
  const handleOpenSettings = async () => {
    try {
      await SettingsNavigation.openSmartSettings(issue);
      onClose();
    } catch (error) {
      console.error('Failed to open settings:', error);
      // Keep the alert open if settings failed to open
    }
  };

  const getIssueConfig = () => {
    if (issue === 'location_services') {
      return {
        icon: 'map-pin-off',
        gradient: ['#EF4444', '#DC2626'],
        buttonText: 'Open Location Settings',
        description: 'Location services are disabled on your device. This prevents all apps from accessing your location.',
      };
    } else {
      return {
        icon: 'shield-off',
        gradient: ['#F59E0B', '#D97706'],
        buttonText: 'Open App Settings',
        description: 'This app needs location permission to provide weather for your current location.',
      };
    }
  };

  const config = getIssueConfig();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            width: width - 40,
            maxWidth: 400,
          }}
        >
          <View className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <LinearGradient
              colors={config.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-6 pt-8 pb-6"
            >
              <View className="items-center">
                <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-4">
                  <Feather name={config.icon as any} size={32} color="white" />
                </View>
                <Text className="text-2xl font-bold text-white text-center mb-2">
                  {title}
                </Text>
                <Text className="text-white/90 text-center text-sm">
                  {config.description}
                </Text>
              </View>
            </LinearGradient>

            {/* Content */}
            <ScrollView className="max-h-96">
              <View className="px-6 py-6">
                <Text className="text-gray-700 text-base leading-6 text-center mb-6">
                  {message}
                </Text>

                {/* Instructions */}
                <View className="bg-blue-50 rounded-2xl p-4 mb-6">
                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                      <Feather name="info" size={16} color="white" />
                    </View>
                    <Text className="text-blue-800 font-bold text-lg">
                      {instructions.title}
                    </Text>
                  </View>
                  
                  {instructions.steps.map((step, index) => (
                    <View key={index} className="flex-row items-start mb-2">
                      <Text className="text-blue-700 font-medium mr-2 mt-0.5">
                        {step.split('.')[0]}.
                      </Text>
                      <Text className="text-blue-700 flex-1">
                        {step.split('.').slice(1).join('.').trim()}
                      </Text>
                    </View>
                  ))}
                  
                  <View className="mt-3 pt-3 border-t border-blue-200">
                    <Text className="text-blue-600 text-sm italic">
                      💡 {instructions.note}
                    </Text>
                  </View>
                </View>

                {/* Platform-specific note */}
                <View className="bg-gray-50 rounded-xl p-4 mb-6">
                  <View className="flex-row items-center mb-2">
                    <MaterialCommunityIcons 
                      name={Platform.OS === 'ios' ? 'apple' : 'android'} 
                      size={20} 
                      color="#6B7280" 
                    />
                    <Text className="text-gray-700 font-medium ml-2">
                      {Platform.OS === 'ios' ? 'iOS' : 'Android'} Instructions
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-sm">
                    {Platform.OS === 'ios' 
                      ? 'After tapping "Open Settings", you\'ll be taken to the Settings app. Navigate to the location settings as shown above.'
                      : 'The button below will try to open location settings directly. If it opens the wrong screen, manually navigate to Location settings.'
                    }
                  </Text>
                </View>

                {/* Buttons */}
                <View className="space-y-3">
                  <TouchableOpacity
                    onPress={handleOpenSettings}
                    className="rounded-xl py-4 px-6 shadow-lg"
                    style={{
                      backgroundColor: '#3B82F6',
                      shadowColor: '#3B82F6',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <View className="flex-row items-center justify-center">
                      <Feather name="settings" size={20} color="white" />
                      <Text className="text-white font-bold text-lg ml-2">
                        {config.buttonText}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onClose}
                    className="bg-gray-100 rounded-xl py-3 px-6"
                  >
                    <Text className="text-gray-600 font-medium text-center">
                      I'll do it manually
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// Hook for easier usage
export const useLocationSettingsAlert = () => {
  const [alertConfig, setAlertConfig] = React.useState<{
    visible: boolean;
    issue: 'location_services' | 'app_permission';
    title: string;
    message: string;
  } | null>(null);

  const showLocationAlert = (
    issue: 'location_services' | 'app_permission',
    title: string,
    message: string
  ) => {
    setAlertConfig({
      visible: true,
      issue,
      title,
      message,
    });
  };

  const hideLocationAlert = () => {
    setAlertConfig(null);
  };

  const LocationAlertComponent = alertConfig ? (
    <LocationSettingsAlert
      visible={alertConfig.visible}
      onClose={hideLocationAlert}
      issue={alertConfig.issue}
      title={alertConfig.title}
      message={alertConfig.message}
    />
  ) : null;

  return {
    showLocationAlert,
    hideLocationAlert,
    LocationAlertComponent,
  };
};