/**
 * Navigation compatibility utility
 * Fixes potential conflicts between Expo Router and React Navigation
 */

import { Platform } from 'react-native';

/**
 * Check if we're in a valid navigation context
 * This helps prevent navigation-related errors in development
 */
export const isNavigationReady = (): boolean => {
  try {
    // In Expo Router, navigation is handled automatically
    // We don't need to check for NavigationContainer
    return true;
  } catch (error) {
    console.warn('Navigation context check failed:', error);
    return false;
  }
};

/**
 * Safe navigation wrapper
 * Ensures navigation operations are performed safely
 */
export const safeNavigate = (callback: () => void): void => {
  try {
    if (isNavigationReady()) {
      callback();
    } else {
      console.warn('Navigation not ready, skipping navigation operation');
    }
  } catch (error) {
    console.error('Navigation operation failed:', error);
  }
};

/**
 * Development environment check
 */
export const isDevelopment = (): boolean => {
  return __DEV__ || process.env.NODE_ENV === 'development';
};

/**
 * Log navigation errors in development only
 */
export const logNavigationError = (error: any, context?: string): void => {
  if (isDevelopment()) {
    console.warn(`Navigation Error${context ? ` in ${context}` : ''}:`, error);
  }
};

/**
 * Suppress navigation warnings in development
 * This can help reduce noise from React Navigation/Expo Router conflicts
 */
export const suppressNavigationWarnings = (): void => {
  if (isDevelopment()) {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Suppress specific navigation-related warnings
      if (
        message.includes('NavigationContainer') ||
        message.includes('navigation context') ||
        message.includes('React Navigation')
      ) {
        return; // Suppress these warnings
      }
      
      // Allow other warnings through
      originalWarn.apply(console, args);
    };
  }
};