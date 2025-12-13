import { CurrentConditions, DailyForecast } from './weather';

export interface WeatherInsight {
  id: string;
  category: 'clothing' | 'activity' | 'travel' | 'health';
  icon: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

// Generate clothing recommendations based on weather
export function getClothingRecommendations(
  currentWeather: CurrentConditions,
  forecast: DailyForecast[]
): WeatherInsight[] {
  const insights: WeatherInsight[] = [];
  const tempF = currentWeather.Temperature.Imperial.Value;
  const weatherText = currentWeather.WeatherText.toLowerCase();
  const windSpeed = currentWeather.Wind.Speed.Imperial.Value;

  // Temperature-based clothing
  if (tempF > 85) {
    insights.push({
      id: 'clothing-hot',
      category: 'clothing',
      icon: '👕',
      title: 'Light & Breathable',
      description:
        'Wear light-colored, loose-fitting clothes. Cotton or moisture-wicking fabrics recommended.',
      priority: 'high',
    });
  } else if (tempF > 70) {
    insights.push({
      id: 'clothing-warm',
      category: 'clothing',
      icon: '👔',
      title: 'Comfortable Casual',
      description:
        'T-shirt and shorts or light pants. Perfect weather for casual wear.',
      priority: 'medium',
    });
  } else if (tempF > 55) {
    insights.push({
      id: 'clothing-mild',
      category: 'clothing',
      icon: '🧥',
      title: 'Layer Up',
      description:
        'Light jacket or sweater recommended. Layer for temperature changes.',
      priority: 'medium',
    });
  } else if (tempF > 40) {
    insights.push({
      id: 'clothing-cool',
      category: 'clothing',
      icon: '🧥',
      title: 'Jacket Required',
      description:
        'Wear a warm jacket or coat. Long pants and closed-toe shoes.',
      priority: 'high',
    });
  } else {
    insights.push({
      id: 'clothing-cold',
      category: 'clothing',
      icon: '🧣',
      title: 'Bundle Up',
      description:
        'Heavy coat, gloves, scarf, and hat essential. Dress in layers.',
      priority: 'high',
    });
  }

  // Rain gear
  if (weatherText.includes('rain') || weatherText.includes('shower')) {
    insights.push({
      id: 'clothing-rain',
      category: 'clothing',
      icon: '☔',
      title: 'Rain Gear Needed',
      description:
        'Bring an umbrella and wear waterproof jacket. Water-resistant shoes recommended.',
      priority: 'high',
    });
  }

  // Wind protection
  if (windSpeed > 15) {
    insights.push({
      id: 'clothing-wind',
      category: 'clothing',
      icon: '🧥',
      title: 'Windbreaker Recommended',
      description:
        'Windy conditions. Wear a windbreaker or wind-resistant outer layer.',
      priority: 'medium',
    });
  }

  // Sun protection
  if (weatherText.includes('sunny') || weatherText.includes('clear')) {
    insights.push({
      id: 'clothing-sun',
      category: 'clothing',
      icon: '🕶️',
      title: 'Sun Protection',
      description:
        'Wear sunglasses, hat, and apply sunscreen. UV protection important.',
      priority: 'medium',
    });
  }

  return insights;
}

// Generate outdoor activity suggestions
export function getActivitySuggestions(
  currentWeather: CurrentConditions,
  forecast: DailyForecast[]
): WeatherInsight[] {
  const insights: WeatherInsight[] = [];
  const tempF = currentWeather.Temperature.Imperial.Value;
  const weatherText = currentWeather.WeatherText.toLowerCase();
  const windSpeed = currentWeather.Wind.Speed.Imperial.Value;
  const humidity = currentWeather.RelativeHumidity;

  // Ideal outdoor conditions
  if (
    tempF >= 65 &&
    tempF <= 80 &&
    !weatherText.includes('rain') &&
    windSpeed < 15
  ) {
    insights.push({
      id: 'activity-perfect',
      category: 'activity',
      icon: '🏃',
      title: 'Perfect for Outdoor Activities',
      description:
        'Ideal conditions for running, cycling, hiking, or sports. Great day to be outside!',
      priority: 'high',
    });
  }

  // Beach/pool weather
  if (tempF > 80 && !weatherText.includes('rain')) {
    insights.push({
      id: 'activity-beach',
      category: 'activity',
      icon: '🏖️',
      title: 'Beach & Pool Weather',
      description:
        'Perfect for swimming, beach activities, or water sports. Stay hydrated!',
      priority: 'high',
    });
  }

  // Indoor activities
  if (weatherText.includes('rain') || weatherText.includes('storm')) {
    insights.push({
      id: 'activity-indoor',
      category: 'activity',
      icon: '🏠',
      title: 'Indoor Activities Recommended',
      description:
        'Great day for museums, shopping, movies, or indoor sports facilities.',
      priority: 'medium',
    });
  }

  // Winter activities
  if (tempF < 40 && weatherText.includes('snow')) {
    insights.push({
      id: 'activity-winter',
      category: 'activity',
      icon: '⛷️',
      title: 'Winter Sports Weather',
      description:
        'Good conditions for skiing, snowboarding, or building a snowman!',
      priority: 'high',
    });
  }

  // Photography
  if (weatherText.includes('partly') || weatherText.includes('cloudy')) {
    insights.push({
      id: 'activity-photo',
      category: 'activity',
      icon: '📸',
      title: 'Great for Photography',
      description:
        'Soft, diffused light perfect for outdoor photography and sightseeing.',
      priority: 'low',
    });
  }

  // Gardening
  if (
    tempF >= 60 &&
    tempF <= 75 &&
    !weatherText.includes('rain') &&
    humidity > 40
  ) {
    insights.push({
      id: 'activity-garden',
      category: 'activity',
      icon: '🌱',
      title: 'Ideal Gardening Weather',
      description:
        'Perfect conditions for planting, weeding, or general garden maintenance.',
      priority: 'low',
    });
  }

  // Stargazing
  if (weatherText.includes('clear') && tempF < 70) {
    insights.push({
      id: 'activity-stars',
      category: 'activity',
      icon: '🌟',
      title: 'Stargazing Tonight',
      description:
        'Clear skies expected. Great night for astronomy and stargazing.',
      priority: 'low',
    });
  }

  return insights;
}

// Generate travel planning advice
export function getTravelAdvice(
  currentWeather: CurrentConditions,
  forecast: DailyForecast[]
): WeatherInsight[] {
  const insights: WeatherInsight[] = [];
  const tempF = currentWeather.Temperature.Imperial.Value;
  const weatherText = currentWeather.WeatherText.toLowerCase();
  const windSpeed = currentWeather.Wind.Speed.Imperial.Value;
  const visibility = currentWeather.Visibility.Imperial.Value;

  // Check forecast for travel planning
  const hasRainInForecast = forecast.some(
    (day) =>
      day.Day.IconPhrase.toLowerCase().includes('rain') ||
      day.Day.IconPhrase.toLowerCase().includes('shower')
  );

  const hasStormInForecast = forecast.some(
    (day) =>
      day.Day.IconPhrase.toLowerCase().includes('storm') ||
      day.Day.IconPhrase.toLowerCase().includes('thunder')
  );

  // Driving conditions
  if (visibility < 5 || weatherText.includes('fog')) {
    insights.push({
      id: 'travel-visibility',
      category: 'travel',
      icon: '🚗',
      title: 'Reduced Visibility',
      description:
        'Drive carefully with headlights on. Allow extra travel time and maintain safe distance.',
      priority: 'high',
    });
  }

  if (weatherText.includes('rain') || weatherText.includes('wet')) {
    insights.push({
      id: 'travel-rain',
      category: 'travel',
      icon: '🚙',
      title: 'Wet Road Conditions',
      description:
        'Roads may be slippery. Reduce speed and increase following distance.',
      priority: 'high',
    });
  }

  if (weatherText.includes('snow') || weatherText.includes('ice')) {
    insights.push({
      id: 'travel-winter',
      category: 'travel',
      icon: '❄️',
      title: 'Winter Driving Hazards',
      description:
        'Icy roads possible. Use winter tires, drive slowly, and avoid sudden movements.',
      priority: 'high',
    });
  }

  // Flight considerations
  if (windSpeed > 25 || hasStormInForecast) {
    insights.push({
      id: 'travel-flight',
      category: 'travel',
      icon: '✈️',
      title: 'Check Flight Status',
      description:
        'Weather may affect flights. Check with airline for potential delays or cancellations.',
      priority: 'medium',
    });
  }

  // Good travel conditions
  if (
    tempF >= 60 &&
    tempF <= 80 &&
    !weatherText.includes('rain') &&
    visibility > 10
  ) {
    insights.push({
      id: 'travel-good',
      category: 'travel',
      icon: '🗺️',
      title: 'Excellent Travel Conditions',
      description:
        'Clear roads and good visibility. Perfect day for a road trip or sightseeing.',
      priority: 'low',
    });
  }

  // Pack for rain
  if (hasRainInForecast) {
    insights.push({
      id: 'travel-pack-rain',
      category: 'travel',
      icon: '🎒',
      title: 'Pack Rain Gear',
      description:
        'Rain expected in the coming days. Bring umbrella and waterproof items.',
      priority: 'medium',
    });
  }

  // Temperature changes
  const tempRange =
    Math.max(...forecast.map((d) => d.Temperature.Maximum.Value)) -
    Math.min(...forecast.map((d) => d.Temperature.Minimum.Value));
  if (tempRange > 20) {
    insights.push({
      id: 'travel-temp-change',
      category: 'travel',
      icon: '🌡️',
      title: 'Variable Temperatures',
      description: `Temperature swings of ${Math.round(
        tempRange
      )}°F expected. Pack layers for flexibility.`,
      priority: 'medium',
    });
  }

  return insights;
}

// Generate health tips based on weather
export function getHealthTips(
  currentWeather: CurrentConditions,
  forecast: DailyForecast[]
): WeatherInsight[] {
  const insights: WeatherInsight[] = [];
  const tempF = currentWeather.Temperature.Imperial.Value;
  const weatherText = currentWeather.WeatherText.toLowerCase();
  const humidity = currentWeather.RelativeHumidity;
  const realFeelF = currentWeather.RealFeelTemperature.Imperial.Value;

  // Heat-related health
  if (tempF > 90 || realFeelF > 95) {
    insights.push({
      id: 'health-heat',
      category: 'health',
      icon: '💧',
      title: 'Heat Safety Alert',
      description:
        'Stay hydrated! Drink water regularly, avoid strenuous outdoor activity during peak heat.',
      priority: 'high',
    });
  }

  if (tempF > 85 && humidity > 70) {
    insights.push({
      id: 'health-humidity',
      category: 'health',
      icon: '🥵',
      title: 'High Heat Index',
      description:
        'Heat and humidity combination dangerous. Take frequent breaks in air conditioning.',
      priority: 'high',
    });
  }

  // Cold-related health
  if (tempF < 32 || realFeelF < 25) {
    insights.push({
      id: 'health-cold',
      category: 'health',
      icon: '🧊',
      title: 'Cold Weather Precautions',
      description:
        'Risk of frostbite and hypothermia. Limit outdoor exposure and dress warmly.',
      priority: 'high',
    });
  }

  // Allergy considerations
  if (
    tempF >= 60 &&
    tempF <= 75 &&
    !weatherText.includes('rain') &&
    humidity < 60
  ) {
    insights.push({
      id: 'health-allergy',
      category: 'health',
      icon: '🤧',
      title: 'High Pollen Conditions',
      description:
        'Ideal conditions for pollen. Allergy sufferers should take precautions.',
      priority: 'medium',
    });
  }

  // Air quality and breathing
  if (humidity > 80) {
    insights.push({
      id: 'health-breathing',
      category: 'health',
      icon: '😮‍💨',
      title: 'High Humidity Alert',
      description:
        'May affect breathing for those with asthma or respiratory conditions. Stay indoors if needed.',
      priority: 'medium',
    });
  }

  // UV protection
  if (weatherText.includes('sunny') || weatherText.includes('clear')) {
    insights.push({
      id: 'health-uv',
      category: 'health',
      icon: '☀️',
      title: 'UV Protection Needed',
      description:
        'Apply SPF 30+ sunscreen every 2 hours. Wear protective clothing and seek shade.',
      priority: 'medium',
    });
  }

  // Hydration reminder
  if (tempF > 75 || humidity < 30) {
    insights.push({
      id: 'health-hydration',
      category: 'health',
      icon: '💦',
      title: 'Stay Hydrated',
      description:
        'Drink 8-10 glasses of water today. Carry a water bottle if going outside.',
      priority: 'medium',
    });
  }

  // Sleep quality
  if (tempF >= 60 && tempF <= 70) {
    insights.push({
      id: 'health-sleep',
      category: 'health',
      icon: '😴',
      title: 'Ideal Sleeping Temperature',
      description:
        'Perfect temperature for quality sleep. Open windows for fresh air circulation.',
      priority: 'low',
    });
  }

  // Vitamin D
  if (weatherText.includes('sunny') && tempF >= 60 && tempF <= 80) {
    insights.push({
      id: 'health-vitamin-d',
      category: 'health',
      icon: '🌞',
      title: 'Vitamin D Opportunity',
      description:
        'Great weather for natural vitamin D. Spend 15-20 minutes in sunlight.',
      priority: 'low',
    });
  }

  return insights;
}

// Get all insights combined
export function getAllWeatherInsights(
  currentWeather: CurrentConditions,
  forecast: DailyForecast[]
): {
  clothing: WeatherInsight[];
  activities: WeatherInsight[];
  travel: WeatherInsight[];
  health: WeatherInsight[];
  all: WeatherInsight[];
} {
  const clothing = getClothingRecommendations(currentWeather, forecast);
  const activities = getActivitySuggestions(currentWeather, forecast);
  const travel = getTravelAdvice(currentWeather, forecast);
  const health = getHealthTips(currentWeather, forecast);

  // Sort all by priority
  const all = [...clothing, ...activities, ...travel, ...health].sort(
    (a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
  );

  return {
    clothing,
    activities,
    travel,
    health,
    all,
  };
}
