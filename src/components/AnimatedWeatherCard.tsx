import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { WeatherTheme } from '../services/weatherThemes';

interface AnimatedWeatherCardProps {
  theme: WeatherTheme;
  temperature: string;
  weatherText: string;
  weatherIcon: string;
  feelsLike?: string;
}

export default function AnimatedWeatherCard({
  theme,
  temperature,
  weatherText,
  weatherIcon,
  feelsLike,
}: AnimatedWeatherCardProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    if (theme.animation === 'pulse') {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [theme]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardColor,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}>
      <Animated.View
        style={[
          styles.content,
          theme.animation === 'pulse' && {
            transform: [{ scale: pulseAnim }],
          },
        ]}>
        {/* Weather Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.weatherIcon}>{weatherIcon}</Text>
          {theme.animation === 'shimmer' && <ShimmerEffect />}
        </View>

        {/* Temperature */}
        <Text style={[styles.temperature, { color: theme.textColor }]}>
          {temperature}°
        </Text>

        {/* Weather Description */}
        <Text style={[styles.weatherText, { color: theme.textColor }]}>
          {weatherText}
        </Text>

        {/* Feels Like */}
        {feelsLike && (
          <Text
            style={[
              styles.feelsLike,
              { color: theme.textColor, opacity: 0.7 },
            ]}>
            Feels like {feelsLike}°
          </Text>
        )}

        {/* Theme Badge */}
        <View
          style={[
            styles.themeBadge,
            { backgroundColor: theme.accentColor + '20' },
          ]}>
          <Text style={[styles.themeBadgeText, { color: theme.accentColor }]}>
            {theme.emoji} {theme.name}
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

function ShimmerEffect() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };
    shimmer();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          opacity,
          borderRadius: 100,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  weatherIcon: {
    fontSize: 80,
  },
  temperature: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 22,
    marginBottom: 8,
  },
  feelsLike: {
    fontSize: 14,
    marginBottom: 16,
  },
  themeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  themeBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
