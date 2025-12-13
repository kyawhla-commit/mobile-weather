import { Linking, Platform, Alert } from 'react-native';

/**
 * Utility functions for navigating to different device settings
 */

export const SettingsNavigation = {
  /**
   * Open device location settings (not app settings)
   */
  openLocationSettings: async () => {
    try {
      if (Platform.OS === 'ios') {
        // On iOS, we can only open the main Settings app
        // Users will need to navigate to Privacy & Security > Location Services
        await Linking.openURL('App-Prefs:Privacy&path=LOCATION');
      } else if (Platform.OS === 'android') {
        // On Android, try to open location settings directly
        try {
          await Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
        } catch (error) {
          // Fallback to general location settings
          await Linking.sendIntent('android.settings.SECURITY_SETTINGS');
        }
      } else {
        // Fallback for other platforms
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Failed to open location settings:', error);
      // Fallback to app settings if device settings fail
      await Linking.openSettings();
    }
  },

  /**
   * Open app-specific settings
   */
  openAppSettings: async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Failed to open app settings:', error);
      Alert.alert(
        'Settings Unavailable',
        'Please manually open your device settings and navigate to this app\'s permissions.',
        [{ text: 'OK' }]
      );
    }
  },

  /**
   * Smart settings navigation based on the issue
   */
  openSmartSettings: async (issue: 'location_services' | 'app_permission') => {
    if (issue === 'location_services') {
      await SettingsNavigation.openLocationSettings();
    } else {
      await SettingsNavigation.openAppSettings();
    }
  },

  /**
   * Show instructions for manual navigation
   */
  showLocationSettingsInstructions: () => {
    const instructions = Platform.OS === 'ios' 
      ? 'Go to Settings → Privacy & Security → Location Services and turn on Location Services.'
      : 'Go to Settings → Location (or Security & Location) and turn on Location Services.';

    Alert.alert(
      'Enable Location Services',
      instructions,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => SettingsNavigation.openLocationSettings()
        }
      ]
    );
  },

  /**
   * Show instructions for app permission
   */
  showAppPermissionInstructions: () => {
    const instructions = Platform.OS === 'ios'
      ? 'Go to Settings → Weather App → Location and select "While Using App" or "Always".'
      : 'Go to Settings → Apps → Weather App → Permissions → Location and enable location access.';

    Alert.alert(
      'Enable App Permission',
      instructions,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => SettingsNavigation.openAppSettings()
        }
      ]
    );
  }
};

/**
 * Enhanced Linking utility with better error handling
 */
export const EnhancedLinking = {
  /**
   * Open URL with fallback handling
   */
  openURL: async (url: string, fallbackUrl?: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else if (fallbackUrl) {
        await Linking.openURL(fallbackUrl);
      } else {
        throw new Error('URL not supported');
      }
    } catch (error) {
      console.error('Failed to open URL:', url, error);
      if (fallbackUrl && fallbackUrl !== url) {
        try {
          await Linking.openURL(fallbackUrl);
        } catch (fallbackError) {
          console.error('Fallback URL also failed:', fallbackUrl, fallbackError);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  },

  /**
   * Send Android intent with fallback
   */
  sendIntent: async (intent: string, fallbackIntent?: string) => {
    if (Platform.OS !== 'android') {
      throw new Error('Intents are only supported on Android');
    }

    try {
      await Linking.sendIntent(intent);
    } catch (error) {
      console.error('Failed to send intent:', intent, error);
      if (fallbackIntent) {
        try {
          await Linking.sendIntent(fallbackIntent);
        } catch (fallbackError) {
          console.error('Fallback intent also failed:', fallbackIntent, fallbackError);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  }
};

/**
 * Platform-specific deep links for settings
 */
export const SettingsDeepLinks = {
  ios: {
    main: 'App-Prefs:root',
    location: 'App-Prefs:Privacy&path=LOCATION',
    notifications: 'App-Prefs:NOTIFICATIONS_ID',
    general: 'App-Prefs:General',
  },
  android: {
    location: 'android.settings.LOCATION_SOURCE_SETTINGS',
    security: 'android.settings.SECURITY_SETTINGS',
    apps: 'android.settings.APPLICATION_SETTINGS',
    appDetails: 'android.settings.APPLICATION_DETAILS_SETTINGS',
  }
};

/**
 * Get user-friendly instructions for enabling location
 */
export const getLocationInstructions = () => {
  if (Platform.OS === 'ios') {
    return {
      title: 'Enable Location Services on iOS',
      steps: [
        '1. Open the Settings app',
        '2. Tap "Privacy & Security"',
        '3. Tap "Location Services"',
        '4. Turn on "Location Services"',
        '5. Return to the weather app'
      ],
      note: 'You may also need to enable location access for this specific app.'
    };
  } else {
    return {
      title: 'Enable Location Services on Android',
      steps: [
        '1. Open the Settings app',
        '2. Tap "Location" (or "Security & Location")',
        '3. Turn on "Use location"',
        '4. Return to the weather app'
      ],
      note: 'The exact steps may vary depending on your Android version.'
    };
  }
};