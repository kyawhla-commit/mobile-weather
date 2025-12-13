import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive' | 'primary';
}

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  icon?: string;
  iconColor?: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'location';
  onClose?: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'primary' }],
  icon,
  iconColor,
  type = 'info',
  onClose,
}: CustomAlertProps) {
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

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          gradient: ['#10B981', '#059669'],
          icon: 'check-circle',
          iconColor: '#10B981',
        };
      case 'warning':
        return {
          gradient: ['#F59E0B', '#D97706'],
          icon: 'alert-triangle',
          iconColor: '#F59E0B',
        };
      case 'error':
        return {
          gradient: ['#EF4444', '#DC2626'],
          icon: 'x-circle',
          iconColor: '#EF4444',
        };
      case 'location':
        return {
          gradient: ['#3B82F6', '#1D4ED8'],
          icon: 'map-pin',
          iconColor: '#3B82F6',
        };
      default:
        return {
          gradient: ['#6366F1', '#4F46E5'],
          icon: 'info',
          iconColor: '#6366F1',
        };
    }
  };

  const getButtonStyle = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'primary':
        return {
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
        };
      case 'destructive':
        return {
          backgroundColor: '#EF4444',
          textColor: '#FFFFFF',
        };
      case 'cancel':
        return {
          backgroundColor: '#F3F4F6',
          textColor: '#6B7280',
        };
      default:
        return {
          backgroundColor: '#F9FAFB',
          textColor: '#374151',
        };
    }
  };

  const typeConfig = getTypeConfig();
  const alertIcon = icon || typeConfig.icon;
  const alertIconColor = iconColor || typeConfig.iconColor;

  const handleButtonPress = (button: AlertButton) => {
    button.onPress?.();
    onClose?.();
  };

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
            {/* Header with gradient */}
            <LinearGradient
              colors={typeConfig.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-6 pt-8 pb-6"
            >
              <View className="items-center">
                <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-4">
                  <Feather name={alertIcon as any} size={32} color="white" />
                </View>
                <Text className="text-2xl font-bold text-white text-center mb-2">
                  {title}
                </Text>
              </View>
            </LinearGradient>

            {/* Content */}
            <View className="px-6 py-6">
              <Text className="text-gray-700 text-base leading-6 text-center mb-6">
                {message}
              </Text>

              {/* Buttons */}
              <View className="space-y-3">
                {buttons.map((button, index) => {
                  const buttonStyle = getButtonStyle(button.style || 'default');
                  const isLastButton = index === buttons.length - 1;
                  const isPrimaryButton = button.style === 'primary' || 
                    (buttons.length === 1 && !button.style);

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleButtonPress(button)}
                      className={`rounded-xl py-4 px-6 ${
                        isPrimaryButton ? 'shadow-lg' : ''
                      }`}
                      style={{
                        backgroundColor: buttonStyle.backgroundColor,
                        shadowColor: isPrimaryButton ? buttonStyle.backgroundColor : undefined,
                        shadowOffset: isPrimaryButton ? { width: 0, height: 4 } : undefined,
                        shadowOpacity: isPrimaryButton ? 0.3 : undefined,
                        shadowRadius: isPrimaryButton ? 8 : undefined,
                        elevation: isPrimaryButton ? 5 : undefined,
                      }}
                    >
                      <Text
                        className={`text-center font-bold text-lg`}
                        style={{ color: buttonStyle.textColor }}
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// Hook for easier usage
export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = React.useState<CustomAlertProps | null>(null);

  const showAlert = (config: Omit<CustomAlertProps, 'visible' | 'onClose'>) => {
    setAlertConfig({
      ...config,
      visible: true,
      onClose: () => setAlertConfig(null),
    });
  };

  const hideAlert = () => {
    setAlertConfig(null);
  };

  const AlertComponent = alertConfig ? (
    <CustomAlert
      {...alertConfig}
      visible={!!alertConfig}
      onClose={hideAlert}
    />
  ) : null;

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};

// Predefined alert types for common use cases
export const AlertTypes = {
  success: (title: string, message: string, onOk?: () => void) => ({
    type: 'success' as const,
    title,
    message,
    buttons: [{ text: 'Great!', style: 'primary' as const, onPress: onOk }],
  }),

  error: (title: string, message: string, onOk?: () => void) => ({
    type: 'error' as const,
    title,
    message,
    buttons: [{ text: 'OK', style: 'primary' as const, onPress: onOk }],
  }),

  warning: (title: string, message: string, onOk?: () => void, onCancel?: () => void) => ({
    type: 'warning' as const,
    title,
    message,
    buttons: [
      { text: 'Cancel', style: 'cancel' as const, onPress: onCancel },
      { text: 'Continue', style: 'primary' as const, onPress: onOk },
    ],
  }),

  confirm: (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => ({
    type: 'info' as const,
    title,
    message,
    buttons: [
      { text: 'Cancel', style: 'cancel' as const, onPress: onCancel },
      { text: 'Confirm', style: 'primary' as const, onPress: onConfirm },
    ],
  }),

  location: (title: string, message: string, onSettings?: () => void, onCancel?: () => void) => ({
    type: 'location' as const,
    title,
    message,
    buttons: [
      { text: 'Cancel', style: 'cancel' as const, onPress: onCancel },
      { text: 'Open Settings', style: 'primary' as const, onPress: onSettings },
    ],
  }),

  destructive: (title: string, message: string, onDelete?: () => void, onCancel?: () => void) => ({
    type: 'error' as const,
    title,
    message,
    buttons: [
      { text: 'Cancel', style: 'cancel' as const, onPress: onCancel },
      { text: 'Delete', style: 'destructive' as const, onPress: onDelete },
    ],
  }),
};