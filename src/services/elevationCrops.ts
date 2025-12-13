// Elevation-based crop recommendations

export interface CropRecommendation {
  name: string;
  icon: string;
  category: 'vegetable' | 'fruit' | 'grain' | 'herb' | 'flower' | 'tree';
  description: string;
  growingSeason: string;
  difficulty: 'easy' | 'moderate' | 'hard';
}

export interface ElevationZone {
  name: string;
  minElevation: number; // meters
  maxElevation: number; // meters
  description: string;
  climate: string;
  crops: CropRecommendation[];
}

// Elevation zones with crop recommendations
const elevationZones: ElevationZone[] = [
  {
    name: 'Sea Level to Lowlands',
    minElevation: 0,
    maxElevation: 500,
    description: 'Warm, humid climate with long growing seasons',
    climate: 'Tropical to Subtropical',
    crops: [
      {
        name: 'Rice',
        icon: '🌾',
        category: 'grain',
        description: 'Thrives in warm, wet lowland conditions',
        growingSeason: 'Year-round in tropics',
        difficulty: 'moderate',
      },
      {
        name: 'Bananas',
        icon: '🍌',
        category: 'fruit',
        description: 'Perfect for warm, humid lowlands',
        growingSeason: 'Year-round',
        difficulty: 'easy',
      },
      {
        name: 'Coconut',
        icon: '🥥',
        category: 'tree',
        description: 'Coastal and lowland tropical tree',
        growingSeason: 'Year-round',
        difficulty: 'moderate',
      },
      {
        name: 'Pineapple',
        icon: '🍍',
        category: 'fruit',
        description: 'Tropical fruit for warm climates',
        growingSeason: '18-24 months',
        difficulty: 'easy',
      },
      {
        name: 'Sugarcane',
        icon: '🎋',
        category: 'grain',
        description: 'Warm climate crop',
        growingSeason: '12-18 months',
        difficulty: 'moderate',
      },
      {
        name: 'Mango',
        icon: '🥭',
        category: 'fruit',
        description: 'Tropical fruit tree',
        growingSeason: 'Year-round',
        difficulty: 'moderate',
      },
      {
        name: 'Papaya',
        icon: '🍈',
        category: 'fruit',
        description: 'Fast-growing tropical fruit',
        growingSeason: 'Year-round',
        difficulty: 'easy',
      },
      {
        name: 'Cacao',
        icon: '🍫',
        category: 'tree',
        description: 'Source of chocolate, needs shade',
        growingSeason: 'Year-round',
        difficulty: 'hard',
      },
      {
        name: 'Vanilla',
        icon: '🌿',
        category: 'herb',
        description: 'Climbing orchid for tropical areas',
        growingSeason: '3-4 years to harvest',
        difficulty: 'hard',
      },
      {
        name: 'Cassava',
        icon: '🥔',
        category: 'vegetable',
        description: 'Drought-tolerant root crop',
        growingSeason: '8-12 months',
        difficulty: 'easy',
      },
    ],
  },
  {
    name: 'Low Elevation',
    minElevation: 500,
    maxElevation: 1000,
    description: 'Moderate climate with warm summers',
    climate: 'Temperate',
    crops: [
      {
        name: 'Tomatoes',
        icon: '🍅',
        category: 'vegetable',
        description: 'Versatile warm-season crop',
        growingSeason: 'Spring to Fall',
        difficulty: 'easy',
      },
      {
        name: 'Corn',
        icon: '🌽',
        category: 'grain',
        description: 'Warm-season staple crop',
        growingSeason: 'Summer',
        difficulty: 'easy',
      },
      {
        name: 'Grapes',
        icon: '🍇',
        category: 'fruit',
        description: 'Ideal for moderate elevations',
        growingSeason: 'Spring to Fall',
        difficulty: 'moderate',
      },
      {
        name: 'Peppers',
        icon: '🌶️',
        category: 'vegetable',
        description: 'Heat-loving vegetables',
        growingSeason: 'Summer',
        difficulty: 'easy',
      },
      {
        name: 'Strawberries',
        icon: '🍓',
        category: 'fruit',
        description: 'Cool-season berry',
        growingSeason: 'Spring to Summer',
        difficulty: 'easy',
      },
      {
        name: 'Basil',
        icon: '🌿',
        category: 'herb',
        description: 'Warm-season herb',
        growingSeason: 'Summer',
        difficulty: 'easy',
      },
      {
        name: 'Avocado',
        icon: '🥑',
        category: 'fruit',
        description: 'Subtropical fruit tree, frost-sensitive',
        growingSeason: 'Year-round',
        difficulty: 'moderate',
      },
      {
        name: 'Coffee',
        icon: '☕',
        category: 'tree',
        description: 'Grows best at 600-1200m elevation',
        growingSeason: 'Year-round',
        difficulty: 'moderate',
      },
      {
        name: 'Citrus',
        icon: '🍊',
        category: 'fruit',
        description: 'Oranges, lemons, limes thrive here',
        growingSeason: 'Year-round',
        difficulty: 'moderate',
      },
      {
        name: 'Olives',
        icon: '🫒',
        category: 'fruit',
        description: 'Mediterranean climate tree',
        growingSeason: 'Year-round',
        difficulty: 'moderate',
      },
      {
        name: 'Cucumbers',
        icon: '🥒',
        category: 'vegetable',
        description: 'Warm-season vine crop',
        growingSeason: 'Summer',
        difficulty: 'easy',
      },
      {
        name: 'Watermelon',
        icon: '🍉',
        category: 'fruit',
        description: 'Heat-loving summer fruit',
        growingSeason: 'Summer',
        difficulty: 'easy',
      },
    ],
  },
  {
    name: 'Mid Elevation',
    minElevation: 1000,
    maxElevation: 2000,
    description: 'Cool climate with distinct seasons',
    climate: 'Cool Temperate',
    crops: [
      {
        name: 'Potatoes',
        icon: '🥔',
        category: 'vegetable',
        description: 'Excellent for cooler climates',
        growingSeason: 'Spring to Fall',
        difficulty: 'easy',
      },
      {
        name: 'Wheat',
        icon: '🌾',
        category: 'grain',
        description: 'Cool-season grain crop',
        growingSeason: 'Fall to Summer',
        difficulty: 'moderate',
      },
      {
        name: 'Apples',
        icon: '🍎',
        category: 'fruit',
        description: 'Requires cool winters',
        growingSeason: 'Spring to Fall',
        difficulty: 'moderate',
      },
      {
        name: 'Carrots',
        icon: '🥕',
        category: 'vegetable',
        description: 'Cool-season root vegetable',
        growingSeason: 'Spring and Fall',
        difficulty: 'easy',
      },
      {
        name: 'Cabbage',
        icon: '🥬',
        category: 'vegetable',
        description: 'Cold-hardy leafy vegetable',
        growingSeason: 'Spring and Fall',
        difficulty: 'easy',
      },
      {
        name: 'Berries',
        icon: '🫐',
        category: 'fruit',
        description: 'Blueberries, raspberries thrive here',
        growingSeason: 'Summer',
        difficulty: 'moderate',
      },
      {
        name: 'Coffee (Arabica)',
        icon: '☕',
        category: 'tree',
        description: 'Premium coffee grows at 1200-1800m',
        growingSeason: 'Year-round',
        difficulty: 'hard',
      },
      {
        name: 'Cherries',
        icon: '🍒',
        category: 'fruit',
        description: 'Sweet and sour varieties',
        growingSeason: 'Spring to Summer',
        difficulty: 'moderate',
      },
      {
        name: 'Broccoli',
        icon: '🥦',
        category: 'vegetable',
        description: 'Cool-season brassica',
        growingSeason: 'Spring and Fall',
        difficulty: 'easy',
      },
      {
        name: 'Onions',
        icon: '🧅',
        category: 'vegetable',
        description: 'Cool-season bulb crop',
        growingSeason: 'Spring to Fall',
        difficulty: 'easy',
      },
      {
        name: 'Garlic',
        icon: '🧄',
        category: 'vegetable',
        description: 'Plant in fall, harvest in summer',
        growingSeason: 'Fall to Summer',
        difficulty: 'easy',
      },
      {
        name: 'Lavender',
        icon: '💜',
        category: 'herb',
        description: 'Aromatic herb for dry climates',
        growingSeason: 'Spring to Fall',
        difficulty: 'easy',
      },
    ],
  },
  {
    name: 'High Elevation',
    minElevation: 2000,
    maxElevation: 3000,
    description: 'Cold climate with short growing season',
    climate: 'Alpine/Subalpine',
    crops: [
      {
        name: 'Barley',
        icon: '🌾',
        category: 'grain',
        description: 'Hardy grain for high altitudes',
        growingSeason: 'Short summer',
        difficulty: 'moderate',
      },
      {
        name: 'Quinoa',
        icon: '🌾',
        category: 'grain',
        description: 'Native to high Andes',
        growingSeason: 'Summer',
        difficulty: 'moderate',
      },
      {
        name: 'Lettuce',
        icon: '🥬',
        category: 'vegetable',
        description: 'Cool-season leafy green',
        growingSeason: 'Short summer',
        difficulty: 'easy',
      },
      {
        name: 'Peas',
        icon: '🫛',
        category: 'vegetable',
        description: 'Cold-tolerant legume',
        growingSeason: 'Early summer',
        difficulty: 'easy',
      },
      {
        name: 'Kale',
        icon: '🥬',
        category: 'vegetable',
        description: 'Very cold-hardy green',
        growingSeason: 'Spring to Fall',
        difficulty: 'easy',
      },
      {
        name: 'Alpine Flowers',
        icon: '🌸',
        category: 'flower',
        description: 'Hardy mountain flowers',
        growingSeason: 'Short summer',
        difficulty: 'moderate',
      },
      {
        name: 'Spinach',
        icon: '🥬',
        category: 'vegetable',
        description: 'Cold-tolerant leafy green',
        growingSeason: 'Spring and Fall',
        difficulty: 'easy',
      },
      {
        name: 'Radishes',
        icon: '🌱',
        category: 'vegetable',
        description: 'Fast-growing root vegetable',
        growingSeason: 'Spring to Fall',
        difficulty: 'easy',
      },
      {
        name: 'Beets',
        icon: '🥕',
        category: 'vegetable',
        description: 'Cold-hardy root crop',
        growingSeason: 'Spring to Fall',
        difficulty: 'easy',
      },
      {
        name: 'Rye',
        icon: '🌾',
        category: 'grain',
        description: 'Very cold-hardy grain',
        growingSeason: 'Fall to Summer',
        difficulty: 'moderate',
      },
    ],
  },
  {
    name: 'Very High Elevation',
    minElevation: 3000,
    maxElevation: 5000,
    description: 'Extreme cold with very short growing season',
    climate: 'High Alpine',
    crops: [
      {
        name: 'Hardy Grains',
        icon: '🌾',
        category: 'grain',
        description: 'Only the hardiest grains survive',
        growingSeason: 'Very short summer',
        difficulty: 'hard',
      },
      {
        name: 'Root Vegetables',
        icon: '🥔',
        category: 'vegetable',
        description: 'Potatoes, turnips in protected areas',
        growingSeason: 'Short summer',
        difficulty: 'hard',
      },
      {
        name: 'Alpine Herbs',
        icon: '🌿',
        category: 'herb',
        description: 'Hardy mountain herbs',
        growingSeason: 'Very short',
        difficulty: 'hard',
      },
      {
        name: 'Greenhouse Crops',
        icon: '🏠',
        category: 'vegetable',
        description: 'Most crops need greenhouse protection',
        growingSeason: 'Extended with protection',
        difficulty: 'hard',
      },
    ],
  },
];

/**
 * Get crop recommendations based on elevation
 */
export function getCropRecommendations(elevationMeters: number): {
  zone: ElevationZone;
  recommendations: CropRecommendation[];
} {
  // Find the appropriate elevation zone
  const zone =
    elevationZones.find(
      (z) =>
        elevationMeters >= z.minElevation && elevationMeters < z.maxElevation
    ) || elevationZones[elevationZones.length - 1]; // Default to highest zone

  return {
    zone,
    recommendations: zone.crops,
  };
}

/**
 * Get top crop recommendations (most suitable)
 */
export function getTopCrops(
  elevationMeters: number,
  count: number = 3
): CropRecommendation[] {
  const { recommendations } = getCropRecommendations(elevationMeters);

  // Prioritize easy crops
  const sorted = [...recommendations].sort((a, b) => {
    const difficultyOrder = { easy: 0, moderate: 1, hard: 2 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });

  return sorted.slice(0, count);
}

/**
 * Get crops by category
 */
export function getCropsByCategory(
  elevationMeters: number,
  category: CropRecommendation['category']
): CropRecommendation[] {
  const { recommendations } = getCropRecommendations(elevationMeters);
  return recommendations.filter((crop) => crop.category === category);
}

/**
 * Get elevation zone name
 */
export function getElevationZoneName(elevationMeters: number): string {
  const { zone } = getCropRecommendations(elevationMeters);
  return zone.name;
}

/**
 * Get climate description
 */
export function getClimateDescription(elevationMeters: number): string {
  const { zone } = getCropRecommendations(elevationMeters);
  return zone.climate;
}

/**
 * Check if crop is suitable for elevation
 */
export function isCropSuitable(
  cropName: string,
  elevationMeters: number
): boolean {
  const { recommendations } = getCropRecommendations(elevationMeters);
  return recommendations.some(
    (crop) => crop.name.toLowerCase() === cropName.toLowerCase()
  );
}
// I'll add more crops including avocado, coffee, and other popular crops to each elevation zone: