interface WeatherConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherText: string;
}

interface FarmingAdvice {
  irrigation: {
    recommendation: string;
    frequency: string;
    timing: string;
  };
  planting: {
    suitable: boolean;
    recommendation: string;
    bestCrops: string[];
  };
  pestRisk: {
    level: 'Low' | 'Moderate' | 'High';
    warning: string;
    prevention: string[];
  };
  activities: {
    recommended: string[];
    avoid: string[];
  };
}

export function generateFarmingAdvice(weather: WeatherConditions): FarmingAdvice {
  const { temperature, humidity, windSpeed, weatherText } = weather;
  
  // Irrigation advice
  const getIrrigationAdvice = () => {
    if (weatherText.toLowerCase().includes('rain')) {
      return {
        recommendation: 'Reduce or skip irrigation today',
        frequency: 'Monitor soil moisture',
        timing: 'Wait for soil to dry',
      };
    }
    
    if (temperature > 30 && humidity < 40) {
      return {
        recommendation: 'Increase irrigation frequency',
        frequency: 'Water 2-3 times daily',
        timing: 'Early morning and evening',
      };
    }
    
    if (temperature > 25 && humidity < 60) {
      return {
        recommendation: 'Regular irrigation needed',
        frequency: 'Once or twice daily',
        timing: 'Early morning or late evening',
      };
    }
    
    return {
      recommendation: 'Moderate irrigation',
      frequency: 'Once daily',
      timing: 'Early morning preferred',
    };
  };

  // Planting advice
  const getPlantingAdvice = () => {
    const isRainy = weatherText.toLowerCase().includes('rain') || 
                    weatherText.toLowerCase().includes('storm');
    const isHot = temperature > 35;
    const isCold = temperature < 10;
    const isWindy = windSpeed > 10;

    if (isRainy || isWindy) {
      return {
        suitable: false,
        recommendation: 'Postpone planting activities',
        bestCrops: [],
      };
    }

    if (isHot) {
      return {
        suitable: true,
        recommendation: 'Good for heat-tolerant crops',
        bestCrops: ['Tomatoes', 'Peppers', 'Eggplant', 'Okra', 'Melons'],
      };
    }

    if (isCold) {
      return {
        suitable: true,
        recommendation: 'Ideal for cool-season crops',
        bestCrops: ['Lettuce', 'Spinach', 'Broccoli', 'Cabbage', 'Peas'],
      };
    }

    return {
      suitable: true,
      recommendation: 'Excellent planting conditions',
      bestCrops: ['Beans', 'Corn', 'Squash', 'Cucumbers', 'Carrots'],
    };
  };

  // Pest risk assessment
  const getPestRisk = () => {
    if (temperature > 25 && temperature < 35 && humidity > 60) {
      return {
        level: 'High' as const,
        warning: 'High pest activity expected',
        prevention: [
          'Inspect crops daily',
          'Apply organic pesticides',
          'Remove infected plants',
          'Maintain proper spacing',
        ],
      };
    }

    if (temperature > 20 && humidity > 50) {
      return {
        level: 'Moderate' as const,
        warning: 'Moderate pest risk',
        prevention: [
          'Regular monitoring needed',
          'Use preventive measures',
          'Keep area clean',
        ],
      };
    }

    return {
      level: 'Low' as const,
      warning: 'Low pest activity',
      prevention: [
        'Continue routine monitoring',
        'Maintain good practices',
      ],
    };
  };

  // Activity recommendations
  const getActivities = () => {
    const recommended: string[] = [];
    const avoid: string[] = [];

    const isRainy = weatherText.toLowerCase().includes('rain');
    const isWindy = windSpeed > 8;
    const isHot = temperature > 32;

    if (!isRainy && !isWindy) {
      recommended.push('Planting and transplanting');
      recommended.push('Fertilizer application');
      recommended.push('Pruning and trimming');
    }

    if (temperature > 20 && temperature < 30 && !isRainy) {
      recommended.push('Harvesting');
      recommended.push('Soil preparation');
    }

    if (!isHot && !isRainy) {
      recommended.push('Weeding');
      recommended.push('Mulching');
    }

    if (isRainy) {
      avoid.push('Planting seeds');
      avoid.push('Applying fertilizers');
      avoid.push('Spraying pesticides');
    }

    if (isWindy) {
      avoid.push('Spraying operations');
      avoid.push('Transplanting seedlings');
    }

    if (isHot) {
      avoid.push('Midday field work');
      avoid.push('Transplanting');
    }

    return { recommended, avoid };
  };

  return {
    irrigation: getIrrigationAdvice(),
    planting: getPlantingAdvice(),
    pestRisk: getPestRisk(),
    activities: getActivities(),
  };
}
