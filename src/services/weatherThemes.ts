// Dynamic weather-based themes and UI configurations

export interface WeatherTheme {
  name: string;
  gradient: string[];
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  accentColor: string;
  emoji: string;
  particles?: {
    type: 'rain' | 'snow' | 'clouds' | 'sun' | 'stars';
    count: number;
  };
  animation?: 'pulse' | 'float' | 'shimmer' | 'wave';
}

export function getWeatherTheme(
  weatherText: string,
  temperature: number,
  isDark: boolean,
  isNight: boolean = false
): WeatherTheme {
  const weather = weatherText.toLowerCase();

  // Rainy weather
  if (
    weather.includes('rain') ||
    weather.includes('shower') ||
    weather.includes('drizzle')
  ) {
    return {
      name: 'Rainy',
      gradient: isDark
        ? ['#1e3a5f', '#2d5a7b', '#3a7ca5']
        : ['#4a90a4', '#5fa8d3', '#87ceeb'],
      backgroundColor: isDark ? '#1a2332' : '#e8f4f8',
      cardColor: isDark ? '#2a3f5f' : '#d4e9f7',
      textColor: isDark ? '#e0f2fe' : '#0c4a6e',
      accentColor: '#3b82f6',
      emoji: '🌧️',
      particles: { type: 'rain', count: 50 },
      animation: 'wave',
    };
  }

  // Thunderstorm
  if (weather.includes('storm') || weather.includes('thunder')) {
    return {
      name: 'Stormy',
      gradient: isDark
        ? ['#1a1a2e', '#2d2d44', '#3f3f5a']
        : ['#4a5568', '#5a6c7d', '#718096'],
      backgroundColor: isDark ? '#0f0f1e' : '#cbd5e0',
      cardColor: isDark ? '#252542' : '#a0aec0',
      textColor: isDark ? '#f3f4f6' : '#1a202c',
      accentColor: '#fbbf24',
      emoji: '⛈️',
      particles: { type: 'rain', count: 80 },
      animation: 'pulse',
    };
  }

  // Snowy weather
  if (
    weather.includes('snow') ||
    weather.includes('flurr') ||
    weather.includes('blizzard')
  ) {
    return {
      name: 'Snowy',
      gradient: isDark
        ? ['#2d3748', '#4a5568', '#718096']
        : ['#e2e8f0', '#f7fafc', '#ffffff'],
      backgroundColor: isDark ? '#1a202c' : '#f7fafc',
      cardColor: isDark ? '#2d3748' : '#edf2f7',
      textColor: isDark ? '#f7fafc' : '#2d3748',
      accentColor: '#60a5fa',
      emoji: '❄️',
      particles: { type: 'snow', count: 60 },
      animation: 'float',
    };
  }

  // Cloudy weather
  if (weather.includes('cloud') || weather.includes('overcast')) {
    return {
      name: 'Cloudy',
      gradient: isDark
        ? ['#374151', '#4b5563', '#6b7280']
        : ['#9ca3af', '#d1d5db', '#e5e7eb'],
      backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
      cardColor: isDark ? '#374151' : '#e5e7eb',
      textColor: isDark ? '#f9fafb' : '#1f2937',
      accentColor: '#6b7280',
      emoji: '☁️',
      particles: { type: 'clouds', count: 20 },
      animation: 'float',
    };
  }

  // Foggy/Misty weather
  if (
    weather.includes('fog') ||
    weather.includes('mist') ||
    weather.includes('haze')
  ) {
    return {
      name: 'Foggy',
      gradient: isDark
        ? ['#2d3748', '#4a5568', '#5a6c7d']
        : ['#cbd5e0', '#e2e8f0', '#edf2f7'],
      backgroundColor: isDark ? '#1a202c' : '#edf2f7',
      cardColor: isDark ? '#2d3748' : '#e2e8f0',
      textColor: isDark ? '#e2e8f0' : '#2d3748',
      accentColor: '#94a3b8',
      emoji: '🌫️',
      particles: { type: 'clouds', count: 30 },
      animation: 'wave',
    };
  }

  // Partly cloudy
  if (weather.includes('partly') || weather.includes('mostly')) {
    return {
      name: 'Partly Cloudy',
      gradient: isDark
        ? ['#1e40af', '#3b82f6', '#60a5fa']
        : ['#60a5fa', '#93c5fd', '#dbeafe'],
      backgroundColor: isDark ? '#1e3a8a' : '#eff6ff',
      cardColor: isDark ? '#1e40af' : '#dbeafe',
      textColor: isDark ? '#dbeafe' : '#1e3a8a',
      accentColor: '#3b82f6',
      emoji: '⛅',
      particles: { type: 'clouds', count: 15 },
      animation: 'float',
    };
  }

  // Clear/Sunny weather
  if (weather.includes('clear') || weather.includes('sunny')) {
    // Night time clear
    if (isNight) {
      return {
        name: 'Clear Night',
        gradient: isDark
          ? ['#0f172a', '#1e293b', '#334155']
          : ['#1e293b', '#334155', '#475569'],
        backgroundColor: isDark ? '#020617' : '#0f172a',
        cardColor: isDark ? '#1e293b' : '#334155',
        textColor: isDark ? '#f1f5f9' : '#f8fafc',
        accentColor: '#fbbf24',
        emoji: '🌙',
        particles: { type: 'stars', count: 100 },
        animation: 'shimmer',
      };
    }

    // Hot sunny day
    if (temperature > 85) {
      return {
        name: 'Hot & Sunny',
        gradient: isDark
          ? ['#dc2626', '#ea580c', '#f59e0b']
          : ['#fef3c7', '#fde68a', '#fcd34d'],
        backgroundColor: isDark ? '#7c2d12' : '#fffbeb',
        cardColor: isDark ? '#9a3412' : '#fef3c7',
        textColor: isDark ? '#fef3c7' : '#78350f',
        accentColor: '#f59e0b',
        emoji: '🌡️',
        particles: { type: 'sun', count: 30 },
        animation: 'pulse',
      };
    }

    // Pleasant sunny day
    return {
      name: 'Sunny',
      gradient: isDark
        ? ['#f59e0b', '#fbbf24', '#fcd34d']
        : ['#fef3c7', '#fde68a', '#fcd34d'],
      backgroundColor: isDark ? '#78350f' : '#fffbeb',
      cardColor: isDark ? '#92400e' : '#fef3c7',
      textColor: isDark ? '#fef3c7' : '#78350f',
      accentColor: '#f59e0b',
      emoji: '☀️',
      particles: { type: 'sun', count: 20 },
      animation: 'shimmer',
    };
  }

  // Windy weather
  if (weather.includes('wind') || weather.includes('breezy')) {
    return {
      name: 'Windy',
      gradient: isDark
        ? ['#0e7490', '#0891b2', '#06b6d4']
        : ['#a5f3fc', '#67e8f9', '#22d3ee'],
      backgroundColor: isDark ? '#164e63' : '#ecfeff',
      cardColor: isDark ? '#155e75' : '#cffafe',
      textColor: isDark ? '#cffafe' : '#164e63',
      accentColor: '#06b6d4',
      emoji: '💨',
      particles: { type: 'clouds', count: 40 },
      animation: 'wave',
    };
  }

  // Default theme
  return {
    name: 'Default',
    gradient: isDark
      ? ['#1e40af', '#3b82f6', '#60a5fa']
      : ['#60a5fa', '#93c5fd', '#dbeafe'],
    backgroundColor: isDark ? '#1e3a8a' : '#eff6ff',
    cardColor: isDark ? '#1e40af' : '#dbeafe',
    textColor: isDark ? '#dbeafe' : '#1e3a8a',
    accentColor: '#3b82f6',
    emoji: '🌤️',
    animation: 'float',
  };
}

// Get time of day
export function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 20;
}

// Get season-based adjustments
export function getSeasonalAdjustments(): {
  season: string;
  emoji: string;
  tint: string;
} {
  const month = new Date().getMonth();

  // Winter (Dec, Jan, Feb)
  if (month === 11 || month === 0 || month === 1) {
    return { season: 'Winter', emoji: '❄️', tint: '#60a5fa' };
  }

  // Spring (Mar, Apr, May)
  if (month >= 2 && month <= 4) {
    return { season: 'Spring', emoji: '🌸', tint: '#f472b6' };
  }

  // Summer (Jun, Jul, Aug)
  if (month >= 5 && month <= 7) {
    return { season: 'Summer', emoji: '☀️', tint: '#fbbf24' };
  }

  // Fall (Sep, Oct, Nov)
  return { season: 'Fall', emoji: '🍂', tint: '#f97316' };
}

// Generate particle positions for animations
export function generateParticles(count: number): Array<{
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}> {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
  }));
}
