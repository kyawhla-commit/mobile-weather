import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { locationService } from '../services/location';
import { useCustomAlert, AlertTypes } from './CustomAlert';
import { useLocationSettingsAlert } from './LocationSettingsAlert';
import { SettingsNavigation } from '../utils/settingsNavigation';

interface LocationPermissionHelperProps {
  onLocationEnabled?: () => void;
  onSkip?: () => void;
  errorCode?: string;
}

export default function LocationPermissionHelper({
  onLocationEnabled,
  onSkip,
  errorCode,
}: LocationPermissionHelperProps) {
  const { showAlert, AlertComponent } = useCustomAlert();
  const { showLocationAlert, LocationAlertComponent } = useLocationSettingsAlert();
  
  const [locationStatus, setLocationStatus] = useState<{
    servicesEnabled: boolean;
    permissionGranted: boolean;
    checking: boolean;
  }>({
    servicesEnabled: false,
    permissionGranted: false,
    checking: true,
  });

  useEffect(() => {
    checkLocationStatus();
  }, []);

  const checkLocationStatus = async () => {
    try {
      setLocationStatus(prev => ({ ...prev, checking: true }));
      
      const [servicesEnabled, permissionGranted] = await Promise.all([
        locationService.isLocationEnabled(),
        locationService.checkLocationPermission(),
      ]);

      setLocationStatus({
        servicesEnabled,
        permissionGranted,
        checking: false,
      });
    } catch (error) {
      console.error('Error checking location status:', error);
      setLocationStatus({
        servicesEnabled: false,
        permissionGranted: false,
        checking: false,
      });
    }
  };

  const handleEnableLocation = async () => {
    try {
      // Re-check current status
      await checkLocationStatus();

      // If location services are disabled, show enhanced location settings alert
      if (!locationStatus.servicesEnabled) {
        showLocationAlert(
          'location_services',
          'Location Services Disabled',
          'Location services are turned off on your device. Please enable them in your device settings to get weather for your current location.'
        );
        return;
      }

      // If services are enabled but permission not granted, request permission
      if (!locationStatus.permissionGranted) {
        const permission = await locationService.requestLocationPermission();
        
        if (permission.granted) {
          // Update status and notify parent
          setLocationStatus(prev => ({ ...prev, permissionGranted: true }));
          onLocationEnabled?.();
        } else if (!permission.canAskAgain) {
          showLocationAlert(
            'app_permission',
            'Location Permission Required',
            'Location permission has been permanently denied. Please enable it in your app settings.'
          );
        } else {
          showAlert({
            type: 'warning',
            title: 'Location Permission Denied',
            message: 'Location access is needed to show weather for your current location. You can still add cities manually.',
            buttons: [
              { text: 'OK', style: 'cancel' },
              { text: 'Try Again', style: 'primary', onPress: handleEnableLocation },
            ],
          });
        }
      } else {
        // Both services and permission are enabled, try to get location
        onLocationEnabled?.();
      }
    } catch (error) {
      console.error('Error enabling location:', error);
      showAlert(AlertTypes.error(
        'Location Error',
        'There was an error accessing your location. Please try again or add cities manually.'
      ));
    }
  };

  const getMainMessage = () => {
    if (locationStatus.checking) {
      return {
        title: 'Checking Location Status...',
        subtitle: 'Please wait while we check your location settings',
      };
    }

    if (!locationStatus.servicesEnabled) {
      return {
        title: 'Location Services Disabled',
        subtitle: 'Enable location services in your device settings to get weather for your current location',
      };
    }

    if (!locationStatus.permissionGranted) {
      return {
        title: 'Location Permission Required',
        subtitle: 'Allow location access to get instant weather updates for your current location',
      };
    }

    return {
      title: 'Enable Location Access',
      subtitle: 'Get instant weather updates for your current location automatically',
    };
  };

  const getActionButtonText = () => {
    if (locationStatus.checking) return 'Checking...';
    if (!locationStatus.servicesEnabled) return 'Open Device Settings';
    if (!locationStatus.permissionGranted) return 'Grant Permission';
    return 'Enable Location Access';
  };

  const { title, subtitle } = getMainMessage();

  return (
    <View className="p-6">
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-6"
      >
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
            <MaterialCommunityIcons name="crosshairs-gps" size={40} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white text-center mb-2">
            {title}
          </Text>
          <Text className="text-white/90 text-center text-base leading-6">
            {subtitle}
          </Text>
        </View>

        {/* Status Indicators */}
        <View className="space-y-3 mb-6">
          <View className="flex-row items-center">
            <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
              locationStatus.servicesEnabled ? 'bg-green-500/30' : 'bg-red-500/30'
            }`}>
              <Feather 
                name={locationStatus.servicesEnabled ? "check" : "x"} 
                size={16} 
                color={locationStatus.servicesEnabled ? "#10B981" : "#EF4444"} 
              />
            </View>
            <Text className="text-white/90 flex-1">
              Location services {locationStatus.servicesEnabled ? 'enabled' : 'disabled'}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
              locationStatus.permissionGranted ? 'bg-green-500/30' : 'bg-yellow-500/30'
            }`}>
              <Feather 
                name={locationStatus.permissionGranted ? "check" : "alert-circle"} 
                size={16} 
                color={locationStatus.permissionGranted ? "#10B981" : "#F59E0B"} 
              />
            </View>
            <Text className="text-white/90 flex-1">
              App permission {locationStatus.permissionGranted ? 'granted' : 'required'}
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View className="space-y-4 mb-6">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3">
              <Feather name="zap" size={16} color="white" />
            </View>
            <Text className="text-white/90 flex-1">
              Instant weather updates when you open the app
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3">
              <Feather name="shield" size={16} color="white" />
            </View>
            <Text className="text-white/90 flex-1">
              Severe weather alerts for your area
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3">
              <Feather name="map-pin" size={16} color="white" />
            </View>
            <Text className="text-white/90 flex-1">
              Perfect for travelers and daily commuters
            </Text>
          </View>
        </View>

        <View className="space-y-3">
          <TouchableOpacity
            onPress={handleEnableLocation}
            disabled={locationStatus.checking}
            className={`bg-white rounded-xl py-4 px-6 flex-row items-center justify-center ${
              locationStatus.checking ? 'opacity-50' : ''
            }`}
          >
            <MaterialCommunityIcons 
              name={!locationStatus.servicesEnabled ? "cog" : "crosshairs-gps"} 
              size={20} 
              color="#3B82F6" 
            />
            <Text className="text-blue-600 font-bold text-lg ml-2">
              {getActionButtonText()}
            </Text>
          </TouchableOpacity>

          {onSkip && (
            <TouchableOpacity
              onPress={onSkip}
              className="bg-white/20 rounded-xl py-3 px-6 flex-row items-center justify-center"
            >
              <Text className="text-white font-medium">
                Skip for now
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-white/70 text-xs text-center mt-4">
          Your location data is only used to provide weather information and is never shared with third parties.
        </Text>
      </LinearGradient>
      
      {AlertComponent}
      {LocationAlertComponent}
    </View>
  );
}