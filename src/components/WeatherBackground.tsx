import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherTheme, generateParticles } from '../services/weatherThemes';

const { width, height } = Dimensions.get('window');

interface WeatherBackgroundProps {
  theme?: WeatherTheme;
  children: React.ReactNode;
}

export default function WeatherBackground({ theme, children }: WeatherBackgroundProps) {
  if (!theme) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      {theme.particles && (
        <WeatherParticles
          type={theme.particles.type}
          count={theme.particles.count}
        />
      )}
      
      {children}
    </View>
  );
}

interface WeatherParticlesProps {
  type: 'rain' | 'snow' | 'clouds' | 'sun' | 'stars';
  count: number;
}

function WeatherParticles({ type, count }: WeatherParticlesProps) {
  const particles = generateParticles(count);
  
  switch (type) {
    case 'rain':
      return <RainParticles particles={particles} />;
    case 'snow':
      return <SnowParticles particles={particles} />;
    case 'stars':
      return <StarParticles particles={particles} />;
    case 'clouds':
      return <CloudParticles particles={particles} />;
    case 'sun':
      return <SunRays particles={particles} />;
    default:
      return null;
  }
}

// Rain particles
function RainParticles({ particles }: { particles: any[] }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((particle, index) => (
        <RainDrop key={index} particle={particle} />
      ))}
    </View>
  );
}

function RainDrop({ particle }: { particle: any }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000 / particle.speed,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, height + 20],
  });

  return (
    <Animated.View
      style={[
        styles.raindrop,
        {
          left: `${particle.x}%`,
          opacity: particle.opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

// Snow particles
function SnowParticles({ particles }: { particles: any[] }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((particle, index) => (
        <Snowflake key={index} particle={particle} />
      ))}
    </View>
  );
}

function Snowflake({ particle }: { particle: any }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const swayValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000 / particle.speed,
        useNativeDriver: true,
      }).start(() => animate());
    };

    const sway = () => {
      Animated.sequence([
        Animated.timing(swayValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(swayValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => sway());
    };

    animate();
    sway();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, height + 20],
  });

  const translateX = swayValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  return (
    <Animated.View
      style={[
        styles.snowflake,
        {
          left: `${particle.x}%`,
          opacity: particle.opacity,
          width: particle.size * 3,
          height: particle.size * 3,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
}

// Star particles
function StarParticles({ particles }: { particles: any[] }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((particle, index) => (
        <Star key={index} particle={particle} />
      ))}
    </View>
  );
}

function Star({ particle }: { particle: any }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: particle.size * 2,
          height: particle.size * 2,
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          }),
        },
      ]}
    />
  );
}

// Cloud particles
function CloudParticles({ particles }: { particles: any[] }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.slice(0, 10).map((particle, index) => (
        <Cloud key={index} particle={particle} />
      ))}
    </View>
  );
}

function Cloud({ particle }: { particle: any }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 20000 / particle.speed,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100],
  });

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          top: `${particle.y}%`,
          opacity: particle.opacity * 0.3,
          transform: [{ translateX }],
        },
      ]}
    />
  );
}

// Sun rays
function SunRays({ particles }: { particles: any[] }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.slice(0, 8).map((particle, index) => (
        <SunRay key={index} particle={particle} index={index} />
      ))}
    </View>
  );
}

function SunRay({ particle, index }: { particle: any; index: number }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    setTimeout(() => animate(), index * 250);
  }, []);

  const rotation = `${(360 / 8) * index}deg`;

  return (
    <Animated.View
      style={[
        styles.sunRay,
        {
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.3],
          }),
          transform: [
            { rotate: rotation },
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              }),
            },
          ],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  raindrop: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
  snowflake: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 100,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 100,
  },
  cloud: {
    position: 'absolute',
    width: 80,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  sunRay: {
    position: 'absolute',
    width: width,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: '20%',
    left: '50%',
    marginLeft: -width / 2,
  },
});
