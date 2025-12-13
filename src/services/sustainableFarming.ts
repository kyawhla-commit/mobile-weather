export interface SustainablePractice {
  id: string;
  name: string;
  category: 'water' | 'soil' | 'biodiversity' | 'energy' | 'waste' | 'climate';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToImplement: string;
  costLevel: 'low' | 'medium' | 'high';
  description: string;
  benefits: string[];
  implementation: string[];
  materials: string[];
  maintenance: string[];
  climateZones: string[];
  seasonalTiming: string[];
  weatherConsiderations: string[];
  localAdaptations: string[];
  icon: string;
  color: string;
}

export interface LocationBasedRecommendation {
  climateZone: string;
  elevation: number;
  temperature: number;
  humidity: number;
  practices: SustainablePractice[];
  priorities: string[];
  challenges: string[];
  opportunities: string[];
}

export interface RegionalAdaptation {
  region: string;
  climate: string;
  commonChallenges: string[];
  traditionalPractices: string[];
  modernSolutions: string[];
  localResources: string[];
}

export interface CSAGrowingGuide {
  id: string;
  cropName: string;
  variety: string;
  category: 'cereals' | 'vegetables' | 'legumes' | 'fruits' | 'herbs';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  growingPeriod: string;
  climateRequirements: {
    temperature: { min: number; max: number; optimal: number };
    rainfall: { min: number; max: number; optimal: number };
    humidity: { min: number; max: number };
    soilPH: { min: number; max: number };
  };
  csaApproach: {
    productivityMethods: string[];
    adaptationStrategies: string[];
    mitigationPractices: string[];
  };
  growingStages: CSAGrowingStage[];
  weatherManagement: CSAWeatherResponse[];
  expectedYield: string;
  marketValue: string;
  nutritionalBenefits: string[];
  myanmarContext: string[];
  icon: string;
  color: string;
}

export interface CSAGrowingStage {
  stage: string;
  duration: string;
  description: string;
  csaTechniques: string[];
  activities: string[];
  materials: string[];
  weatherConsiderations: string[];
  troubleshooting: string[];
  successIndicators: string[];
}

export interface CSAWeatherResponse {
  weatherCondition: string;
  cropStage: string;
  immediateActions: string[];
  preventiveMeasures: string[];
  recoverySteps: string[];
  expectedImpact: string;
}

export interface CSAPractice {
  id: string;
  name: string;
  pillar: 'productivity' | 'adaptation' | 'mitigation';
  category: 'crop-management' | 'water-management' | 'soil-health' | 'climate-resilience' | 'carbon-sequestration';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToImplement: string;
  costLevel: 'low' | 'medium' | 'high';
  description: string;
  climateImpact: {
    adaptationBenefit: string;
    mitigationPotential: string;
    productivityGain: string;
  };
  implementation: string[];
  materials: string[];
  monitoring: string[];
  successIndicators: string[];
  myanmarContext: string[];
  weatherDependency: string[];
  icon: string;
  color: string;
}

export interface WeatherBasedDecision {
  weatherCondition: string;
  recommendation: string;
  actions: string[];
  timing: string;
  precautions: string[];
  expectedOutcome: string;
}

// Sustainable Farming Practices Database
export const SUSTAINABLE_PRACTICES: SustainablePractice[] = [
  {
    id: 'rainwater-harvesting',
    name: 'Rainwater Harvesting',
    category: 'water',
    difficulty: 'intermediate',
    timeToImplement: '2-4 weeks',
    costLevel: 'medium',
    description: 'Collect and store rainwater for irrigation during dry periods',
    benefits: [
      'Reduces dependency on groundwater',
      'Provides water during droughts',
      'Reduces soil erosion',
      'Improves water table recharge',
      'Cost-effective irrigation'
    ],
    implementation: [
      'Install gutters and downspouts on roofs',
      'Set up collection tanks or ponds',
      'Create first-flush diverters',
      'Install filtration systems',
      'Design distribution network',
      'Add overflow management'
    ],
    materials: [
      'Gutters and pipes',
      'Storage tanks (plastic/concrete)',
      'Mesh filters',
      'Taps and valves',
      'Pump (if needed)'
    ],
    maintenance: [
      'Clean gutters monthly',
      'Check filters regularly',
      'Inspect tanks for leaks',
      'Remove algae growth',
      'Test water quality'
    ],
    climateZones: ['tropical', 'subtropical', 'temperate'],
    seasonalTiming: ['Pre-monsoon setup', 'Monsoon collection', 'Post-monsoon use'],
    weatherConsiderations: [
      'Most effective in areas with distinct wet/dry seasons',
      'Size tanks based on rainfall patterns',
      'Protect from freezing in cold climates'
    ],
    localAdaptations: [
      'Use local materials for construction',
      'Adapt to roof types and materials',
      'Consider local rainfall intensity'
    ],
    icon: '🌧️',
    color: '#3B82F6'
  },
  {
    id: 'drip-irrigation',
    name: 'Drip Irrigation System',
    category: 'water',
    difficulty: 'intermediate',
    timeToImplement: '1-2 weeks',
    costLevel: 'medium',
    description: 'Efficient water delivery system that applies water directly to plant roots',
    benefits: [
      'Saves 30-50% water compared to flood irrigation',
      'Reduces weed growth',
      'Prevents soil erosion',
      'Allows precise fertilizer application',
      'Reduces disease spread'
    ],
    implementation: [
      'Design system layout',
      'Install main water line',
      'Set up pressure regulators',
      'Lay drip lines along crop rows',
      'Install emitters at plant locations',
      'Add timer and control system'
    ],
    materials: [
      'Main supply pipe',
      'Drip tubes or tapes',
      'Emitters and connectors',
      'Pressure regulators',
      'Filters and valves',
      'Timer system'
    ],
    maintenance: [
      'Clean filters weekly',
      'Check for clogged emitters',
      'Inspect lines for damage',
      'Flush system monthly',
      'Replace worn components'
    ],
    climateZones: ['arid', 'semi-arid', 'tropical', 'temperate'],
    seasonalTiming: ['Install before planting season', 'Use throughout growing season'],
    weatherConsiderations: [
      'Essential in water-scarce regions',
      'Adjust timing based on temperature',
      'Protect from freezing'
    ],
    localAdaptations: [
      'Use gravity-fed systems in hilly areas',
      'Solar-powered pumps for remote locations',
      'Local pipe materials'
    ],
    icon: '💧',
    color: '#06B6D4'
  },
  {
    id: 'composting-system',
    name: 'On-Farm Composting',
    category: 'waste',
    difficulty: 'beginner',
    timeToImplement: '1 week setup',
    costLevel: 'low',
    description: 'Convert organic waste into nutrient-rich compost for soil improvement',
    benefits: [
      'Reduces waste disposal costs',
      'Improves soil structure and fertility',
      'Increases water retention',
      'Reduces need for chemical fertilizers',
      'Sequesters carbon in soil'
    ],
    implementation: [
      'Choose composting method (pile, bin, or windrow)',
      'Set up composting area with good drainage',
      'Collect green and brown materials',
      'Layer materials in proper ratios',
      'Turn pile regularly for aeration',
      'Monitor temperature and moisture'
    ],
    materials: [
      'Organic waste (kitchen scraps, crop residues)',
      'Brown materials (dry leaves, straw)',
      'Compost bins or wire mesh',
      'Pitchfork or turning tool',
      'Thermometer',
      'Water source'
    ],
    maintenance: [
      'Turn pile every 2-3 weeks',
      'Monitor moisture levels',
      'Add materials as available',
      'Check temperature regularly',
      'Harvest finished compost'
    ],
    climateZones: ['all'],
    seasonalTiming: ['Year-round activity', 'Faster in warm weather'],
    weatherConsiderations: [
      'Cover during heavy rains',
      'Add water during dry periods',
      'Slower decomposition in cold weather'
    ],
    localAdaptations: [
      'Use local organic waste materials',
      'Adapt to local climate conditions',
      'Consider cultural composting practices'
    ],
    icon: '♻️',
    color: '#10B981'
  },
  {
    id: 'cover-cropping',
    name: 'Cover Crop Integration',
    category: 'soil',
    difficulty: 'intermediate',
    timeToImplement: '1 season',
    costLevel: 'low',
    description: 'Plant cover crops to protect and improve soil between main crop seasons',
    benefits: [
      'Prevents soil erosion',
      'Improves soil organic matter',
      'Fixes nitrogen (legume covers)',
      'Suppresses weeds naturally',
      'Enhances biodiversity'
    ],
    implementation: [
      'Select appropriate cover crop species',
      'Prepare seedbed after main crop harvest',
      'Sow cover crop seeds',
      'Manage growth through season',
      'Terminate before next main crop',
      'Incorporate into soil or use as mulch'
    ],
    materials: [
      'Cover crop seeds (legumes, grasses, brassicas)',
      'Seeding equipment',
      'Termination tools (mower, roller)',
      'Basic soil amendments if needed'
    ],
    maintenance: [
      'Monitor establishment',
      'Control excessive growth if needed',
      'Time termination properly',
      'Manage residue incorporation'
    ],
    climateZones: ['temperate', 'subtropical', 'tropical'],
    seasonalTiming: ['Plant after harvest', 'Grow during off-season', 'Terminate before planting'],
    weatherConsiderations: [
      'Choose species adapted to local climate',
      'Consider frost tolerance',
      'Plan around rainfall patterns'
    ],
    localAdaptations: [
      'Use locally adapted species',
      'Consider traditional intercropping',
      'Adapt to local farming calendar'
    ],
    icon: '🌱',
    color: '#22C55E'
  },
  {
    id: 'integrated-pest-management',
    name: 'Integrated Pest Management (IPM)',
    category: 'biodiversity',
    difficulty: 'intermediate',
    timeToImplement: '1-2 seasons',
    costLevel: 'low',
    description: 'Holistic approach to pest control using biological, cultural, and minimal chemical methods',
    benefits: [
      'Reduces pesticide use by 50-80%',
      'Protects beneficial insects',
      'Prevents pest resistance',
      'Improves crop quality',
      'Reduces environmental impact'
    ],
    implementation: [
      'Monitor pest populations regularly',
      'Identify beneficial insects',
      'Plant trap crops and beneficial habitats',
      'Use biological control agents',
      'Apply cultural control methods',
      'Use targeted treatments only when needed'
    ],
    materials: [
      'Monitoring tools (traps, magnifying glass)',
      'Beneficial insect habitats',
      'Biological control agents',
      'Organic pesticides (as backup)',
      'Record keeping materials'
    ],
    maintenance: [
      'Weekly pest monitoring',
      'Maintain beneficial habitats',
      'Keep detailed records',
      'Adjust strategies based on results',
      'Train in pest identification'
    ],
    climateZones: ['all'],
    seasonalTiming: ['Year-round monitoring', 'Seasonal strategy adjustments'],
    weatherConsiderations: [
      'Pest pressure varies with weather',
      'Beneficial insects affected by climate',
      'Adjust monitoring frequency'
    ],
    localAdaptations: [
      'Focus on locally common pests',
      'Use native beneficial species',
      'Incorporate traditional knowledge'
    ],
    icon: '🐛',
    color: '#F59E0B'
  },
  {
    id: 'agroforestry',
    name: 'Agroforestry Systems',
    category: 'biodiversity',
    difficulty: 'advanced',
    timeToImplement: '2-5 years',
    costLevel: 'medium',
    description: 'Integrate trees and shrubs into farming systems for multiple benefits',
    benefits: [
      'Increases biodiversity',
      'Provides additional income sources',
      'Improves microclimate',
      'Reduces wind erosion',
      'Sequesters carbon',
      'Provides shade and shelter'
    ],
    implementation: [
      'Design agroforestry layout',
      'Select appropriate tree species',
      'Prepare planting sites',
      'Plant trees at optimal spacing',
      'Establish understory crops',
      'Manage tree-crop interactions'
    ],
    materials: [
      'Tree seedlings or seeds',
      'Planting tools',
      'Tree guards/protection',
      'Irrigation for establishment',
      'Pruning tools'
    ],
    maintenance: [
      'Regular pruning and management',
      'Monitor tree-crop competition',
      'Harvest tree products',
      'Maintain optimal spacing',
      'Pest and disease management'
    ],
    climateZones: ['tropical', 'subtropical', 'temperate'],
    seasonalTiming: ['Plant during rainy season', 'Year-round management'],
    weatherConsiderations: [
      'Choose climate-adapted species',
      'Consider seasonal water needs',
      'Plan for extreme weather protection'
    ],
    localAdaptations: [
      'Use native tree species',
      'Incorporate traditional systems',
      'Consider local market demands'
    ],
    icon: '🌳',
    color: '#059669'
  },
  {
    id: 'solar-powered-systems',
    name: 'Solar-Powered Farm Systems',
    category: 'energy',
    difficulty: 'intermediate',
    timeToImplement: '2-4 weeks',
    costLevel: 'high',
    description: 'Use solar energy for irrigation pumps, lighting, and processing equipment',
    benefits: [
      'Reduces electricity costs',
      'Provides energy independence',
      'Environmentally friendly',
      'Low maintenance requirements',
      'Suitable for remote locations'
    ],
    implementation: [
      'Assess energy requirements',
      'Size solar panel system',
      'Install panels and mounting',
      'Set up battery storage',
      'Connect to farm equipment',
      'Install monitoring system'
    ],
    materials: [
      'Solar panels',
      'Charge controller',
      'Batteries for storage',
      'Inverter (if needed)',
      'Wiring and connectors',
      'Mounting hardware'
    ],
    maintenance: [
      'Clean panels regularly',
      'Check battery levels',
      'Inspect connections',
      'Monitor system performance',
      'Replace components as needed'
    ],
    climateZones: ['all with adequate sunlight'],
    seasonalTiming: ['Year-round operation', 'Peak performance in sunny seasons'],
    weatherConsiderations: [
      'Size system for worst-case weather',
      'Protect from extreme weather',
      'Consider seasonal variations'
    ],
    localAdaptations: [
      'Adapt to local solar irradiance',
      'Use local installation expertise',
      'Consider government incentives'
    ],
    icon: '☀️',
    color: '#EAB308'
  },
  {
    id: 'biogas-production',
    name: 'On-Farm Biogas System',
    category: 'energy',
    difficulty: 'advanced',
    timeToImplement: '4-8 weeks',
    costLevel: 'medium',
    description: 'Convert organic waste into biogas for cooking and heating',
    benefits: [
      'Provides renewable energy',
      'Reduces waste disposal problems',
      'Produces nutrient-rich slurry',
      'Reduces greenhouse gas emissions',
      'Provides energy independence'
    ],
    implementation: [
      'Design biogas plant size',
      'Construct digester tank',
      'Install gas collection system',
      'Set up gas storage and distribution',
      'Connect to appliances',
      'Train in operation and maintenance'
    ],
    materials: [
      'Digester tank (concrete/plastic)',
      'Gas pipes and fittings',
      'Gas storage tank',
      'Biogas stove or burner',
      'Organic waste (animal dung, crop residues)',
      'Water for mixing'
    ],
    maintenance: [
      'Feed digester daily',
      'Monitor gas production',
      'Remove slurry regularly',
      'Check for gas leaks',
      'Maintain optimal temperature'
    ],
    climateZones: ['tropical', 'subtropical', 'warm temperate'],
    seasonalTiming: ['Year-round operation', 'Better performance in warm weather'],
    weatherConsiderations: [
      'Insulate in cold climates',
      'Maintain optimal temperature',
      'Protect from extreme weather'
    ],
    localAdaptations: [
      'Use locally available waste materials',
      'Adapt to local construction methods',
      'Consider cultural acceptance'
    ],
    icon: '🔥',
    color: '#DC2626'
  },
  {
    id: 'water-efficient-crops',
    name: 'Drought-Resistant Crop Selection',
    category: 'climate',
    difficulty: 'beginner',
    timeToImplement: '1 season',
    costLevel: 'low',
    description: 'Choose and cultivate crops that require less water and are adapted to local climate',
    benefits: [
      'Reduces water consumption',
      'Increases resilience to drought',
      'Maintains productivity in dry conditions',
      'Reduces irrigation costs',
      'Adapts to climate change'
    ],
    implementation: [
      'Research drought-tolerant varieties',
      'Test small plots first',
      'Adapt planting schedules',
      'Modify cultivation practices',
      'Monitor performance',
      'Scale up successful varieties'
    ],
    materials: [
      'Drought-resistant seeds/varieties',
      'Mulching materials',
      'Efficient irrigation equipment',
      'Soil moisture monitoring tools'
    ],
    maintenance: [
      'Monitor soil moisture',
      'Apply mulch regularly',
      'Adjust irrigation timing',
      'Select seeds for next season',
      'Keep performance records'
    ],
    climateZones: ['arid', 'semi-arid', 'drought-prone areas'],
    seasonalTiming: ['Plant with first rains', 'Harvest before dry season'],
    weatherConsiderations: [
      'Time planting with rainfall',
      'Prepare for extended dry periods',
      'Monitor weather forecasts'
    ],
    localAdaptations: [
      'Use locally adapted varieties',
      'Consider traditional drought crops',
      'Adapt to local rainfall patterns'
    ],
    icon: '🌵',
    color: '#92400E'
  },
  {
    id: 'soil-conservation',
    name: 'Soil Conservation Practices',
    category: 'soil',
    difficulty: 'intermediate',
    timeToImplement: '1-2 seasons',
    costLevel: 'low',
    description: 'Implement practices to prevent soil erosion and maintain soil health',
    benefits: [
      'Prevents topsoil loss',
      'Maintains soil fertility',
      'Reduces sedimentation in water bodies',
      'Improves water infiltration',
      'Increases long-term productivity'
    ],
    implementation: [
      'Assess erosion risk areas',
      'Install contour barriers',
      'Create terraces on slopes',
      'Plant grass waterways',
      'Establish buffer strips',
      'Implement no-till practices'
    ],
    materials: [
      'Stones or logs for barriers',
      'Grass seeds for waterways',
      'Plants for buffer strips',
      'Basic construction tools',
      'Mulching materials'
    ],
    maintenance: [
      'Inspect barriers after rains',
      'Maintain grass waterways',
      'Repair damaged terraces',
      'Add mulch as needed',
      'Monitor erosion patterns'
    ],
    climateZones: ['all, especially hilly areas'],
    seasonalTiming: ['Install before rainy season', 'Maintain year-round'],
    weatherConsiderations: [
      'Critical during heavy rainfall',
      'Plan for seasonal weather patterns',
      'Strengthen before storm seasons'
    ],
    localAdaptations: [
      'Use local materials for construction',
      'Adapt to local topography',
      'Consider traditional methods'
    ],
    icon: '🏔️',
    color: '#78716C'
  }
];

// Regional adaptations for different areas
export const REGIONAL_ADAPTATIONS: RegionalAdaptation[] = [
  {
    region: 'Tropical Lowlands',
    climate: 'Hot and humid year-round',
    commonChallenges: [
      'High pest and disease pressure',
      'Intense rainfall and flooding',
      'Soil nutrient leaching',
      'Heat stress on crops'
    ],
    traditionalPractices: [
      'Mixed cropping systems',
      'Raised bed cultivation',
      'Natural pest control methods',
      'Seasonal crop rotation'
    ],
    modernSolutions: [
      'Improved drainage systems',
      'Climate-controlled storage',
      'Precision agriculture',
      'Integrated pest management'
    ],
    localResources: [
      'Abundant organic matter',
      'Year-round growing season',
      'High solar radiation',
      'Diverse local varieties'
    ]
  },
  {
    region: 'Mountainous Areas',
    climate: 'Cool temperatures, variable rainfall',
    commonChallenges: [
      'Steep slopes and erosion',
      'Limited growing season',
      'Temperature fluctuations',
      'Limited market access'
    ],
    traditionalPractices: [
      'Terrace farming',
      'Altitude-based crop zoning',
      'Traditional storage methods',
      'Community resource sharing'
    ],
    modernSolutions: [
      'Greenhouse cultivation',
      'Improved transportation',
      'Value-added processing',
      'Micro-hydropower systems'
    ],
    localResources: [
      'Clean water sources',
      'Diverse microclimates',
      'Traditional knowledge',
      'Unique crop varieties'
    ]
  },
  {
    region: 'Arid and Semi-Arid',
    climate: 'Low rainfall, high temperatures',
    commonChallenges: [
      'Water scarcity',
      'Soil degradation',
      'Extreme temperatures',
      'Limited crop options'
    ],
    traditionalPractices: [
      'Water harvesting techniques',
      'Drought-resistant crops',
      'Nomadic grazing systems',
      'Traditional irrigation methods'
    ],
    modernSolutions: [
      'Drip irrigation systems',
      'Solar-powered equipment',
      'Improved crop varieties',
      'Precision water management'
    ],
    localResources: [
      'High solar radiation',
      'Traditional knowledge',
      'Adapted livestock breeds',
      'Indigenous crop varieties'
    ]
  },
  {
    region: 'Coastal Areas',
    climate: 'Moderate temperatures, high humidity',
    commonChallenges: [
      'Salt water intrusion',
      'Cyclones and storms',
      'Soil salinity',
      'Coastal erosion'
    ],
    traditionalPractices: [
      'Salt-tolerant crops',
      'Coastal protection methods',
      'Aquaculture integration',
      'Seasonal migration patterns'
    ],
    modernSolutions: [
      'Desalination systems',
      'Storm-resistant structures',
      'Integrated farming systems',
      'Early warning systems'
    ],
    localResources: [
      'Marine resources',
      'Moderate climate',
      'Tourism potential',
      'Diverse ecosystems'
    ]
  }
];

// Get climate zone from temperature
export function getClimateZone(temperature: number): string {
  if (temperature >= 30) return 'tropical';
  if (temperature >= 25) return 'subtropical';
  if (temperature >= 15) return 'temperate';
  if (temperature >= 5) return 'continental';
  return 'cold';
}

// Get elevation category
export function getElevationCategory(elevation: number): string {
  if (elevation < 200) return 'lowland';
  if (elevation < 800) return 'mid-elevation';
  if (elevation < 2000) return 'highland';
  return 'mountain';
}

// Get location-based recommendations
export function getLocationBasedRecommendations(
  temperature: number,
  humidity: number,
  elevation: number,
  weatherText: string
): LocationBasedRecommendation {
  const climateZone = getClimateZone(temperature);
  const elevationCategory = getElevationCategory(elevation);
  
  // Filter practices based on climate zone
  const suitablePractices = SUSTAINABLE_PRACTICES.filter(practice => 
    practice.climateZones.includes(climateZone) || 
    practice.climateZones.includes('all')
  );

  // Prioritize practices based on conditions
  const priorities: string[] = [];
  const challenges: string[] = [];
  const opportunities: string[] = [];

  // Temperature-based priorities
  if (temperature > 35) {
    priorities.push('Water conservation', 'Heat stress management');
    challenges.push('Extreme heat stress', 'High evaporation rates');
  } else if (temperature < 10) {
    priorities.push('Season extension', 'Cold protection');
    challenges.push('Short growing season', 'Frost damage risk');
  }

  // Humidity-based considerations
  if (humidity > 80) {
    priorities.push('Disease prevention', 'Drainage improvement');
    challenges.push('High disease pressure', 'Waterlogging risk');
  } else if (humidity < 40) {
    priorities.push('Water conservation', 'Drought resilience');
    challenges.push('Water scarcity', 'Drought stress');
  }

  // Elevation-based considerations
  if (elevation > 1000) {
    priorities.push('Soil conservation', 'Microclimate management');
    challenges.push('Soil erosion', 'Temperature variations');
    opportunities.push('Diverse microclimates', 'Premium crop potential');
  } else {
    opportunities.push('Longer growing season', 'Better market access');
  }

  // Weather-based considerations
  if (weatherText.toLowerCase().includes('rain')) {
    priorities.push('Water harvesting', 'Drainage management');
    opportunities.push('Water collection potential');
  }

  return {
    climateZone,
    elevation,
    temperature,
    humidity,
    practices: suitablePractices,
    priorities: [...new Set(priorities)],
    challenges: [...new Set(challenges)],
    opportunities: [...new Set(opportunities)]
  };
}

// Get practices by category
export function getPracticesByCategory(category: string): SustainablePractice[] {
  return SUSTAINABLE_PRACTICES.filter(practice => practice.category === category);
}

// Get practices by difficulty
export function getPracticesByDifficulty(difficulty: string): SustainablePractice[] {
  return SUSTAINABLE_PRACTICES.filter(practice => practice.difficulty === difficulty);
}

// Get regional adaptation
export function getRegionalAdaptation(
  temperature: number,
  elevation: number,
  humidity: number
): RegionalAdaptation | null {
  if (temperature > 25 && elevation < 500) {
    return REGIONAL_ADAPTATIONS.find(r => r.region === 'Tropical Lowlands') || null;
  } else if (elevation > 1000) {
    return REGIONAL_ADAPTATIONS.find(r => r.region === 'Mountainous Areas') || null;
  } else if (temperature > 25 && humidity < 50) {
    return REGIONAL_ADAPTATIONS.find(r => r.region === 'Arid and Semi-Arid') || null;
  } else if (elevation < 200 && humidity > 70) {
    return REGIONAL_ADAPTATIONS.find(r => r.region === 'Coastal Areas') || null;
  }
  return null;
}

// Get seasonal recommendations
export function getSeasonalRecommendations(month: string): SustainablePractice[] {
  const seasonMap: { [key: string]: string } = {
    'December': 'Winter', 'January': 'Winter', 'February': 'Winter',
    'March': 'Spring', 'April': 'Spring', 'May': 'Spring',
    'June': 'Summer', 'July': 'Summer', 'August': 'Summer',
    'September': 'Fall', 'October': 'Fall', 'November': 'Fall'
  };

  const season = seasonMap[month];
  return SUSTAINABLE_PRACTICES.filter(practice => 
    practice.seasonalTiming.some(timing => 
      timing.toLowerCase().includes(season.toLowerCase()) ||
      timing.toLowerCase().includes('year-round')
    )
  );
}

// Calculate implementation priority score
export function calculatePriorityScore(
  practice: SustainablePractice,
  temperature: number,
  humidity: number,
  elevation: number
): number {
  let score = 0;

  // Climate suitability
  const climateZone = getClimateZone(temperature);
  if (practice.climateZones.includes(climateZone) || practice.climateZones.includes('all')) {
    score += 3;
  }

  // Difficulty bonus (easier practices get higher priority)
  if (practice.difficulty === 'beginner') score += 3;
  else if (practice.difficulty === 'intermediate') score += 2;
  else score += 1;

  // Cost consideration (lower cost gets higher priority)
  if (practice.costLevel === 'low') score += 3;
  else if (practice.costLevel === 'medium') score += 2;
  else score += 1;

  // Environmental urgency
  if (temperature > 35 && practice.category === 'water') score += 2;
  if (humidity > 80 && practice.category === 'soil') score += 2;
  if (elevation > 1000 && practice.category === 'soil') score += 2;

  return score;
}

// Climate-Smart Agriculture Growing Guides
export const CSA_GROWING_GUIDES: CSAGrowingGuide[] = [
  {
    id: 'csa-rice-guide',
    cropName: 'Rice',
    variety: 'Climate-Smart Varieties',
    category: 'cereals',
    difficulty: 'intermediate',
    growingPeriod: '120-150 days',
    climateRequirements: {
      temperature: { min: 20, max: 35, optimal: 25 },
      rainfall: { min: 1000, max: 2000, optimal: 1500 },
      humidity: { min: 70, max: 90 },
      soilPH: { min: 5.5, max: 7.0 }
    },
    csaApproach: {
      productivityMethods: [
        'Use climate-resilient varieties like Manawthukha',
        'System of Rice Intensification (SRI) techniques',
        'Precision nutrient management',
        'Integrated pest management'
      ],
      adaptationStrategies: [
        'Alternate Wetting and Drying (AWD)',
        'Drought-tolerant variety selection',
        'Flexible planting dates based on weather',
        'Water harvesting and storage'
      ],
      mitigationPractices: [
        'Reduced methane emissions through AWD',
        'Organic matter incorporation',
        'Efficient fertilizer use',
        'Cover cropping in fallow periods'
      ]
    },
    growingStages: [
      {
        stage: 'Land Preparation',
        duration: '2-3 weeks',
        description: 'Prepare fields using CSA principles for optimal growing conditions',
        csaTechniques: [
          'Minimum tillage to preserve soil structure',
          'Incorporate organic matter and crop residues',
          'Level fields for efficient water management',
          'Install AWD monitoring tubes'
        ],
        activities: [
          'Test soil pH and nutrient levels',
          'Apply organic fertilizers based on soil test',
          'Prepare seedbeds with proper drainage',
          'Set up water level monitoring system'
        ],
        materials: [
          'Organic compost or manure',
          'PVC pipes for AWD monitoring',
          'Soil testing kit',
          'Basic farm tools'
        ],
        weatherConsiderations: [
          'Avoid land preparation during heavy rains',
          'Ensure proper drainage before monsoon',
          'Time activities based on weather forecast'
        ],
        troubleshooting: [
          'Poor drainage: Install additional drainage channels',
          'Soil compaction: Use organic matter to improve structure',
          'Uneven field: Re-level using laser leveling if available'
        ],
        successIndicators: [
          'Well-leveled fields with good drainage',
          'Soil organic matter >2%',
          'Proper AWD infrastructure in place'
        ]
      },
      {
        stage: 'Nursery and Seedling',
        duration: '3-4 weeks',
        description: 'Raise healthy seedlings using climate-smart techniques',
        csaTechniques: [
          'Use climate-adapted seed varieties',
          'Organic seed treatment for disease resistance',
          'Water-efficient nursery management',
          'Integrated nutrient management in nursery'
        ],
        activities: [
          'Select certified climate-resilient seeds',
          'Treat seeds with organic solutions',
          'Prepare raised nursery beds',
          'Monitor seedling growth and health'
        ],
        materials: [
          'Climate-adapted rice seeds',
          'Organic seed treatment materials',
          'Nursery trays or beds',
          'Organic fertilizers for nursery'
        ],
        weatherConsiderations: [
          'Protect nursery from extreme weather',
          'Adjust watering based on rainfall',
          'Provide shade during hot weather'
        ],
        troubleshooting: [
          'Poor germination: Check seed quality and treatment',
          'Damping off: Improve drainage and air circulation',
          'Slow growth: Apply organic liquid fertilizer'
        ],
        successIndicators: [
          'Germination rate >85%',
          'Healthy, vigorous seedlings',
          'Ready for transplanting in 25-30 days'
        ]
      },
      {
        stage: 'Transplanting',
        duration: '1-2 weeks',
        description: 'Transplant seedlings using SRI and CSA methods',
        csaTechniques: [
          'Young seedling transplanting (12-15 days)',
          'Single seedling per hill',
          'Square planting pattern (25x25 cm)',
          'Shallow transplanting depth'
        ],
        activities: [
          'Transplant young, healthy seedlings',
          'Maintain proper spacing for better growth',
          'Apply organic starter fertilizer',
          'Begin AWD water management'
        ],
        materials: [
          'Healthy seedlings',
          'Transplanting tools',
          'Organic starter fertilizer',
          'Measuring tools for spacing'
        ],
        weatherConsiderations: [
          'Transplant during cool, cloudy weather',
          'Avoid transplanting during heavy rain',
          'Ensure adequate water for establishment'
        ],
        troubleshooting: [
          'Seedling shock: Provide adequate water and shade',
          'Poor establishment: Check soil conditions and drainage',
          'Pest attack: Apply organic pest control measures'
        ],
        successIndicators: [
          'Seedling survival rate >95%',
          'Good root establishment within 1 week',
          'Uniform plant spacing achieved'
        ]
      },
      {
        stage: 'Vegetative Growth',
        duration: '6-8 weeks',
        description: 'Manage crop growth using climate-smart practices',
        csaTechniques: [
          'Implement AWD water management',
          'Organic weed management',
          'Precision nutrient application',
          'Integrated pest management'
        ],
        activities: [
          'Monitor water levels using AWD tubes',
          'Apply organic fertilizers at key growth stages',
          'Manage weeds using mechanical and organic methods',
          'Scout for pests and diseases regularly'
        ],
        materials: [
          'Organic fertilizers (compost, vermicompost)',
          'Mechanical weeding tools',
          'Organic pest control materials',
          'Water level monitoring equipment'
        ],
        weatherConsiderations: [
          'Adjust irrigation based on rainfall',
          'Increase monitoring during extreme weather',
          'Apply foliar nutrition during stress periods'
        ],
        troubleshooting: [
          'Nutrient deficiency: Apply targeted organic fertilizers',
          'Pest outbreak: Use integrated pest management',
          'Water stress: Adjust AWD schedule'
        ],
        successIndicators: [
          'Healthy green foliage',
          'Good tillering (15-20 tillers per plant)',
          'Effective weed control'
        ]
      },
      {
        stage: 'Reproductive Phase',
        duration: '4-5 weeks',
        description: 'Critical phase requiring careful water and nutrient management',
        csaTechniques: [
          'Maintain continuous flooding during flowering',
          'Apply potassium-rich organic fertilizers',
          'Monitor for pest and disease pressure',
          'Provide micronutrient support'
        ],
        activities: [
          'Stop AWD and maintain water level',
          'Apply flowering stage nutrition',
          'Increase pest and disease monitoring',
          'Support plants if needed'
        ],
        materials: [
          'Potassium-rich organic fertilizers',
          'Micronutrient solutions',
          'Plant support materials if needed',
          'Pest monitoring tools'
        ],
        weatherConsiderations: [
          'Critical period - avoid water stress',
          'Protect from strong winds',
          'Monitor temperature during flowering'
        ],
        troubleshooting: [
          'Poor flowering: Check nutrition and water status',
          'Pest damage: Apply targeted organic controls',
          'Lodging: Provide plant support'
        ],
        successIndicators: [
          'Good panicle formation',
          'High percentage of filled grains',
          'Minimal pest and disease damage'
        ]
      },
      {
        stage: 'Maturation and Harvest',
        duration: '3-4 weeks',
        description: 'Final stage focusing on grain filling and harvest timing',
        csaTechniques: [
          'Gradual water reduction before harvest',
          'Monitor grain moisture content',
          'Time harvest for optimal quality',
          'Prepare crop residues for next season'
        ],
        activities: [
          'Reduce water levels gradually',
          'Monitor grain maturity indicators',
          'Plan harvest timing and logistics',
          'Prepare for post-harvest handling'
        ],
        materials: [
          'Grain moisture meter',
          'Harvesting tools or equipment',
          'Drying facilities',
          'Storage containers'
        ],
        weatherConsiderations: [
          'Avoid harvest during rainy periods',
          'Ensure proper drying conditions',
          'Protect harvested grain from moisture'
        ],
        troubleshooting: [
          'Delayed maturity: Check for nutrient or water issues',
          'Grain quality problems: Adjust harvest timing',
          'Weather delays: Use protective measures'
        ],
        successIndicators: [
          'Grain moisture content 20-22% at harvest',
          'Good grain quality and yield',
          'Minimal post-harvest losses'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'Heavy Rainfall',
        cropStage: 'All stages',
        immediateActions: [
          'Ensure proper field drainage',
          'Monitor for waterlogging',
          'Apply preventive fungicide if needed'
        ],
        preventiveMeasures: [
          'Maintain drainage channels',
          'Use raised bed cultivation',
          'Select flood-tolerant varieties'
        ],
        recoverySteps: [
          'Drain excess water quickly',
          'Apply recovery nutrition',
          'Monitor for disease outbreaks'
        ],
        expectedImpact: 'Minimal yield loss with proper management'
      },
      {
        weatherCondition: 'Drought Stress',
        cropStage: 'Vegetative to Reproductive',
        immediateActions: [
          'Implement strict AWD schedule',
          'Apply mulching if possible',
          'Reduce plant competition through thinning'
        ],
        preventiveMeasures: [
          'Use drought-tolerant varieties',
          'Improve soil water retention',
          'Install efficient irrigation systems'
        ],
        recoverySteps: [
          'Resume normal irrigation when water available',
          'Apply stress recovery fertilizers',
          'Monitor for secondary pest issues'
        ],
        expectedImpact: 'Yield reduction can be minimized to 10-20%'
      }
    ],
    expectedYield: '4-6 tons per hectare with CSA methods',
    marketValue: 'Premium price for climate-smart rice',
    nutritionalBenefits: [
      'High protein content',
      'Rich in essential amino acids',
      'Good source of B vitamins',
      'Contains antioxidants'
    ],
    myanmarContext: [
      'Suitable for both monsoon and dry season cultivation',
      'Compatible with traditional Myanmar rice varieties',
      'Can be integrated with fish and duck farming',
      'Supports food security and climate resilience'
    ],
    icon: '🌾',
    color: '#F59E0B'
  },
  {
    id: 'csa-tomato-guide',
    cropName: 'Tomato',
    variety: 'Heat-Tolerant Varieties',
    category: 'vegetables',
    difficulty: 'intermediate',
    growingPeriod: '90-120 days',
    climateRequirements: {
      temperature: { min: 18, max: 35, optimal: 25 },
      rainfall: { min: 600, max: 1200, optimal: 800 },
      humidity: { min: 50, max: 80 },
      soilPH: { min: 6.0, max: 7.0 }
    },
    csaApproach: {
      productivityMethods: [
        'Use heat-tolerant hybrid varieties',
        'Drip irrigation for water efficiency',
        'Integrated nutrient management',
        'Protected cultivation techniques'
      ],
      adaptationStrategies: [
        'Shade nets during extreme heat',
        'Mulching for soil temperature control',
        'Flexible planting schedules',
        'Rainwater harvesting for irrigation'
      ],
      mitigationPractices: [
        'Organic matter incorporation',
        'Reduced tillage practices',
        'Efficient fertilizer use',
        'Composting of crop residues'
      ]
    },
    growingStages: [
      {
        stage: 'Nursery Preparation',
        duration: '4-5 weeks',
        description: 'Raise healthy seedlings in controlled environment',
        csaTechniques: [
          'Use climate-adapted varieties',
          'Organic seed treatment',
          'Protected nursery environment',
          'Water-efficient nursery management'
        ],
        activities: [
          'Prepare nursery beds with organic compost',
          'Sow seeds in pro-trays or beds',
          'Maintain optimal temperature and humidity',
          'Apply organic liquid fertilizers'
        ],
        materials: [
          'Heat-tolerant tomato seeds',
          'Pro-trays or nursery beds',
          'Organic compost and fertilizers',
          'Shade nets for protection'
        ],
        weatherConsiderations: [
          'Protect from extreme temperatures',
          'Maintain consistent moisture',
          'Provide ventilation during hot weather'
        ],
        troubleshooting: [
          'Damping off: Improve drainage and air circulation',
          'Slow growth: Check temperature and nutrition',
          'Pest issues: Use organic pest control'
        ],
        successIndicators: [
          'Strong, healthy seedlings',
          '4-6 true leaves developed',
          'Ready for transplanting'
        ]
      },
      {
        stage: 'Land Preparation and Transplanting',
        duration: '2-3 weeks',
        description: 'Prepare fields and transplant using CSA methods',
        csaTechniques: [
          'Raised bed cultivation',
          'Drip irrigation installation',
          'Organic soil amendment',
          'Mulching for temperature control'
        ],
        activities: [
          'Prepare raised beds with proper drainage',
          'Install drip irrigation system',
          'Apply organic fertilizers and compost',
          'Transplant seedlings with proper spacing'
        ],
        materials: [
          'Organic compost and fertilizers',
          'Drip irrigation equipment',
          'Mulching materials',
          'Plant support stakes'
        ],
        weatherConsiderations: [
          'Transplant during cool hours',
          'Provide temporary shade if needed',
          'Ensure adequate water for establishment'
        ],
        troubleshooting: [
          'Transplant shock: Provide shade and water',
          'Poor drainage: Improve bed construction',
          'Pest attack: Apply organic controls'
        ],
        successIndicators: [
          'Good seedling establishment',
          'Proper plant spacing achieved',
          'Irrigation system functioning well'
        ]
      },
      {
        stage: 'Vegetative Growth',
        duration: '4-5 weeks',
        description: 'Support vigorous plant growth with climate-smart practices',
        csaTechniques: [
          'Precision irrigation scheduling',
          'Organic nutrient management',
          'Integrated pest management',
          'Microclimate modification'
        ],
        activities: [
          'Monitor soil moisture and irrigate as needed',
          'Apply organic fertilizers at regular intervals',
          'Prune and train plants for better growth',
          'Scout for pests and diseases'
        ],
        materials: [
          'Organic liquid fertilizers',
          'Plant training materials',
          'Organic pest control products',
          'Soil moisture monitoring tools'
        ],
        weatherConsiderations: [
          'Adjust irrigation based on weather',
          'Provide additional shade during heat waves',
          'Protect from strong winds'
        ],
        troubleshooting: [
          'Nutrient deficiency: Apply targeted fertilizers',
          'Pest outbreak: Use IPM strategies',
          'Water stress: Adjust irrigation schedule'
        ],
        successIndicators: [
          'Vigorous plant growth',
          'Good leaf color and health',
          'Proper plant structure'
        ]
      },
      {
        stage: 'Flowering and Fruit Set',
        duration: '3-4 weeks',
        description: 'Critical phase for fruit development',
        csaTechniques: [
          'Optimal water and nutrient management',
          'Temperature control measures',
          'Pollination support',
          'Calcium supplementation'
        ],
        activities: [
          'Maintain consistent soil moisture',
          'Apply flowering stage fertilizers',
          'Support natural pollination',
          'Monitor for blossom end rot'
        ],
        materials: [
          'Calcium-rich organic fertilizers',
          'Micronutrient solutions',
          'Pollination support tools',
          'Temperature monitoring equipment'
        ],
        weatherConsiderations: [
          'Critical temperature control needed',
          'Avoid water stress during flowering',
          'Protect from extreme weather'
        ],
        troubleshooting: [
          'Poor fruit set: Check pollination and nutrition',
          'Blossom end rot: Improve calcium availability',
          'Flower drop: Control temperature and water'
        ],
        successIndicators: [
          'Good flower production',
          'High fruit set percentage',
          'Healthy fruit development'
        ]
      },
      {
        stage: 'Fruit Development and Harvest',
        duration: '6-8 weeks',
        description: 'Fruit maturation and continuous harvest',
        csaTechniques: [
          'Balanced nutrition for fruit quality',
          'Efficient water management',
          'Integrated pest management',
          'Optimal harvest timing'
        ],
        activities: [
          'Monitor fruit development stages',
          'Apply fruit development fertilizers',
          'Harvest fruits at proper maturity',
          'Maintain plant health for continuous production'
        ],
        materials: [
          'Potassium-rich organic fertilizers',
          'Harvest containers and tools',
          'Post-harvest handling materials',
          'Plant support systems'
        ],
        weatherConsiderations: [
          'Harvest during cool hours',
          'Protect fruits from sun scald',
          'Ensure proper ventilation'
        ],
        troubleshooting: [
          'Fruit cracking: Maintain consistent moisture',
          'Poor fruit quality: Check nutrition and water',
          'Pest damage: Intensify IPM measures'
        ],
        successIndicators: [
          'Good fruit size and quality',
          'Continuous harvest over 6-8 weeks',
          'Minimal post-harvest losses'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'Heat Wave',
        cropStage: 'All stages',
        immediateActions: [
          'Install shade nets (30-50%)',
          'Increase irrigation frequency',
          'Apply foliar sprays for cooling'
        ],
        preventiveMeasures: [
          'Use heat-tolerant varieties',
          'Mulch soil surface',
          'Plan planting to avoid extreme heat'
        ],
        recoverySteps: [
          'Gradually remove shade as temperature drops',
          'Apply recovery nutrition',
          'Monitor for heat stress symptoms'
        ],
        expectedImpact: 'Yield loss can be limited to 15-25%'
      }
    ],
    expectedYield: '40-60 tons per hectare with CSA methods',
    marketValue: 'Premium price for quality tomatoes',
    nutritionalBenefits: [
      'Rich in lycopene and antioxidants',
      'Good source of vitamin C',
      'Contains folate and potassium',
      'Low in calories'
    ],
    myanmarContext: [
      'Suitable for dry season cultivation',
      'Can be grown in protected structures',
      'Good market demand in urban areas',
      'Supports smallholder income generation'
    ],
    icon: '🍅',
    color: '#EF4444'
  },
  {
    id: 'csa-mungbean-guide',
    cropName: 'Mung Bean',
    variety: 'Short Duration Varieties',
    category: 'legumes',
    difficulty: 'beginner',
    growingPeriod: '60-75 days',
    climateRequirements: {
      temperature: { min: 25, max: 40, optimal: 30 },
      rainfall: { min: 300, max: 800, optimal: 500 },
      humidity: { min: 40, max: 70 },
      soilPH: { min: 6.0, max: 7.5 }
    },
    csaApproach: {
      productivityMethods: [
        'Use improved short-duration varieties',
        'Rhizobium inoculation for nitrogen fixation',
        'Optimal plant population',
        'Integrated pest management'
      ],
      adaptationStrategies: [
        'Drought-tolerant variety selection',
        'Flexible planting dates',
        'Water conservation techniques',
        'Heat stress management'
      ],
      mitigationPractices: [
        'Biological nitrogen fixation',
        'Reduced fertilizer requirements',
        'Soil carbon sequestration',
        'Crop residue management'
      ]
    },
    growingStages: [
      {
        stage: 'Land Preparation and Sowing',
        duration: '1-2 weeks',
        description: 'Prepare land and sow seeds using CSA principles',
        csaTechniques: [
          'Minimum tillage practices',
          'Seed treatment with rhizobium',
          'Optimal sowing depth and spacing',
          'Water conservation measures'
        ],
        activities: [
          'Prepare field with minimal disturbance',
          'Treat seeds with rhizobium inoculant',
          'Sow seeds at proper depth and spacing',
          'Apply organic fertilizers if needed'
        ],
        materials: [
          'Improved mung bean seeds',
          'Rhizobium inoculant',
          'Organic fertilizers',
          'Basic farm tools'
        ],
        weatherConsiderations: [
          'Sow after sufficient soil moisture',
          'Avoid sowing during extreme heat',
          'Time sowing based on rainfall forecast'
        ],
        troubleshooting: [
          'Poor germination: Check seed quality and moisture',
          'Uneven emergence: Ensure proper sowing depth',
          'Pest attack: Apply organic seed treatment'
        ],
        successIndicators: [
          'Uniform germination >80%',
          'Good seedling vigor',
          'Proper plant population established'
        ]
      },
      {
        stage: 'Vegetative Growth',
        duration: '3-4 weeks',
        description: 'Support plant growth and nitrogen fixation',
        csaTechniques: [
          'Monitor nitrogen fixation',
          'Water-efficient irrigation',
          'Organic weed management',
          'Integrated pest management'
        ],
        activities: [
          'Check for nodule formation',
          'Apply light irrigation if needed',
          'Control weeds mechanically',
          'Monitor for pest and disease'
        ],
        materials: [
          'Irrigation equipment',
          'Mechanical weeding tools',
          'Organic pest control materials',
          'Monitoring tools'
        ],
        weatherConsiderations: [
          'Provide supplemental irrigation during dry spells',
          'Protect from excessive rainfall',
          'Monitor temperature stress'
        ],
        troubleshooting: [
          'Poor nodulation: Check rhizobium inoculation',
          'Weed competition: Increase weeding frequency',
          'Pest damage: Apply organic controls'
        ],
        successIndicators: [
          'Good nodule formation',
          'Healthy green foliage',
          'Effective weed control'
        ]
      },
      {
        stage: 'Flowering and Pod Formation',
        duration: '2-3 weeks',
        description: 'Critical phase for yield determination',
        csaTechniques: [
          'Optimal water management',
          'Micronutrient supplementation',
          'Pollination support',
          'Pest monitoring'
        ],
        activities: [
          'Maintain adequate soil moisture',
          'Apply micronutrient spray if needed',
          'Monitor flower and pod development',
          'Intensify pest monitoring'
        ],
        materials: [
          'Micronutrient solutions',
          'Irrigation equipment',
          'Pest monitoring tools',
          'Foliar spray equipment'
        ],
        weatherConsiderations: [
          'Critical water requirement period',
          'Protect from extreme temperatures',
          'Avoid water stress during flowering'
        ],
        troubleshooting: [
          'Flower drop: Check water and temperature stress',
          'Poor pod set: Ensure adequate nutrition',
          'Pest damage: Apply targeted controls'
        ],
        successIndicators: [
          'Good flower production',
          'High pod set percentage',
          'Healthy pod development'
        ]
      },
      {
        stage: 'Pod Filling and Maturation',
        duration: '2-3 weeks',
        description: 'Final stage focusing on seed development',
        csaTechniques: [
          'Gradual water reduction',
          'Monitor seed development',
          'Prepare for harvest timing',
          'Manage crop residues'
        ],
        activities: [
          'Reduce irrigation frequency',
          'Monitor pod maturity indicators',
          'Plan harvest timing',
          'Prepare post-harvest facilities'
        ],
        materials: [
          'Harvesting tools',
          'Drying facilities',
          'Storage containers',
          'Moisture meter'
        ],
        weatherConsiderations: [
          'Avoid harvest during rainy periods',
          'Ensure proper drying conditions',
          'Protect from excessive moisture'
        ],
        troubleshooting: [
          'Delayed maturity: Check for stress factors',
          'Pod shattering: Time harvest properly',
          'Quality issues: Ensure proper drying'
        ],
        successIndicators: [
          'Uniform pod maturity',
          'Good seed quality',
          'Minimal harvest losses'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'Drought Stress',
        cropStage: 'Flowering to Pod Filling',
        immediateActions: [
          'Apply light irrigation if available',
          'Mulch soil surface',
          'Reduce plant competition'
        ],
        preventiveMeasures: [
          'Use drought-tolerant varieties',
          'Improve soil water retention',
          'Time planting to avoid dry periods'
        ],
        recoverySteps: [
          'Resume normal irrigation when available',
          'Apply foliar nutrition',
          'Monitor for secondary issues'
        ],
        expectedImpact: 'Yield reduction can be limited to 20-30%'
      }
    ],
    expectedYield: '1.2-1.8 tons per hectare with CSA methods',
    marketValue: 'Good market price for quality mung beans',
    nutritionalBenefits: [
      'High protein content (24%)',
      'Rich in folate and fiber',
      'Good source of potassium',
      'Contains antioxidants'
    ],
    myanmarContext: [
      'Ideal for post-rice cultivation',
      'Fits well in crop rotation systems',
      'Good export potential',
      'Supports soil fertility through nitrogen fixation'
    ],
    icon: '🫘',
    color: '#22C55E'
  },
  {
    id: 'csa-coffee-guide',
    cropName: 'Coffee',
    variety: 'Shade-Grown Arabica',
    category: 'fruits',
    difficulty: 'advanced',
    growingPeriod: '3-5 years to production',
    climateRequirements: {
      temperature: { min: 15, max: 28, optimal: 22 },
      rainfall: { min: 1200, max: 2000, optimal: 1500 },
      humidity: { min: 60, max: 85 },
      soilPH: { min: 6.0, max: 7.0 }
    },
    csaApproach: {
      productivityMethods: [
        'Shade-grown agroforestry systems',
        'Organic soil management',
        'Integrated pest management',
        'Quality processing techniques'
      ],
      adaptationStrategies: [
        'Climate-resilient varieties selection',
        'Altitude-appropriate cultivation',
        'Shade tree diversification',
        'Water conservation techniques'
      ],
      mitigationPractices: [
        'Carbon sequestration through shade trees',
        'Reduced deforestation pressure',
        'Organic waste composting',
        'Renewable energy in processing'
      ]
    },
    growingStages: [
      {
        stage: 'Site Selection and Preparation',
        duration: '6-12 months',
        description: 'Choose optimal site and prepare land using agroforestry principles',
        csaTechniques: [
          'Select sites at 1000-2000m elevation',
          'Establish shade tree canopy (30-50% shade)',
          'Implement contour planting on slopes',
          'Create windbreaks and erosion control'
        ],
        activities: [
          'Conduct soil and climate assessment',
          'Plant shade trees 2-3 years before coffee',
          'Prepare terraces on sloped land',
          'Install drainage and irrigation systems'
        ],
        materials: [
          'Shade tree seedlings (banana, avocado, timber)',
          'Soil testing equipment',
          'Terracing materials',
          'Irrigation infrastructure'
        ],
        weatherConsiderations: [
          'Plant shade trees during rainy season',
          'Avoid land preparation during heavy rains',
          'Consider microclimate effects of elevation'
        ],
        troubleshooting: [
          'Poor drainage: Install additional drainage channels',
          'Excessive shade: Prune shade trees appropriately',
          'Soil erosion: Strengthen terracing and ground cover'
        ],
        successIndicators: [
          'Appropriate shade canopy established',
          'Good soil drainage and structure',
          'Effective erosion control measures'
        ]
      },
      {
        stage: 'Nursery and Seedling Production',
        duration: '8-12 months',
        description: 'Raise healthy coffee seedlings using sustainable practices',
        csaTechniques: [
          'Use climate-adapted coffee varieties',
          'Organic nursery management',
          'Integrated pest and disease management',
          'Water-efficient nursery systems'
        ],
        activities: [
          'Select high-quality seeds from healthy plants',
          'Prepare organic potting mix',
          'Maintain optimal nursery conditions',
          'Gradually acclimatize seedlings'
        ],
        materials: [
          'Climate-resilient coffee seeds',
          'Organic compost and fertilizers',
          'Nursery bags and shade structures',
          'Watering and monitoring equipment'
        ],
        weatherConsiderations: [
          'Protect seedlings from extreme weather',
          'Adjust watering based on rainfall',
          'Provide adequate ventilation'
        ],
        troubleshooting: [
          'Damping off: Improve drainage and air circulation',
          'Slow growth: Check nutrition and light levels',
          'Pest issues: Apply organic pest control'
        ],
        successIndicators: [
          'Healthy, vigorous seedlings',
          '4-6 pairs of true leaves',
          'Ready for field transplanting'
        ]
      },
      {
        stage: 'Planting and Establishment',
        duration: '1-2 years',
        description: 'Transplant and establish young coffee plants in agroforestry system',
        csaTechniques: [
          'Optimal spacing for agroforestry (2x2m)',
          'Intercropping with compatible species',
          'Organic mulching and soil management',
          'Integrated water management'
        ],
        activities: [
          'Transplant seedlings during rainy season',
          'Apply organic fertilizers and mulch',
          'Establish intercropping systems',
          'Monitor plant establishment and growth'
        ],
        materials: [
          'Healthy coffee seedlings',
          'Organic fertilizers and compost',
          'Mulching materials',
          'Intercrop seeds (beans, vegetables)'
        ],
        weatherConsiderations: [
          'Plant during onset of rainy season',
          'Provide temporary shade if needed',
          'Protect from strong winds'
        ],
        troubleshooting: [
          'Transplant shock: Provide adequate water and shade',
          'Poor establishment: Check soil conditions',
          'Competition: Manage intercrop spacing'
        ],
        successIndicators: [
          'Good plant survival rate (>90%)',
          'Healthy root and shoot development',
          'Successful intercrop establishment'
        ]
      },
      {
        stage: 'Vegetative Growth',
        duration: '2-3 years',
        description: 'Support vigorous growth and canopy development',
        csaTechniques: [
          'Organic nutrition management',
          'Pruning and canopy management',
          'Integrated pest and disease control',
          'Soil health maintenance'
        ],
        activities: [
          'Apply organic fertilizers seasonally',
          'Prune for optimal canopy structure',
          'Monitor for pests and diseases',
          'Maintain soil cover and organic matter'
        ],
        materials: [
          'Organic fertilizers and compost',
          'Pruning tools and equipment',
          'Organic pest control materials',
          'Soil amendments'
        ],
        weatherConsiderations: [
          'Adjust fertilization based on rainfall',
          'Prune during dry season',
          'Monitor for weather-related stress'
        ],
        troubleshooting: [
          'Nutrient deficiency: Apply targeted organic fertilizers',
          'Pest outbreak: Intensify IPM measures',
          'Poor growth: Check soil and shade conditions'
        ],
        successIndicators: [
          'Vigorous vegetative growth',
          'Well-structured canopy',
          'Healthy leaf color and size'
        ]
      },
      {
        stage: 'Flowering and Fruit Development',
        duration: '6-8 months annually',
        description: 'Support flowering and cherry development for optimal yield',
        csaTechniques: [
          'Balanced nutrition for flowering',
          'Water management during critical periods',
          'Integrated pest management',
          'Quality-focused cultivation'
        ],
        activities: [
          'Monitor flowering patterns',
          'Apply flowering stage nutrition',
          'Manage water stress during fruit development',
          'Control pests and diseases'
        ],
        materials: [
          'Balanced organic fertilizers',
          'Micronutrient solutions',
          'Irrigation equipment',
          'Pest monitoring tools'
        ],
        weatherConsiderations: [
          'Critical water needs during fruit development',
          'Protect from extreme temperatures',
          'Monitor for disease-favorable conditions'
        ],
        troubleshooting: [
          'Poor flowering: Check nutrition and water status',
          'Fruit drop: Manage water stress and nutrition',
          'Disease issues: Apply preventive treatments'
        ],
        successIndicators: [
          'Good flowering intensity',
          'High fruit set percentage',
          'Healthy cherry development'
        ]
      },
      {
        stage: 'Harvest and Processing',
        duration: '3-4 months annually',
        description: 'Harvest and process coffee using sustainable methods',
        csaTechniques: [
          'Selective harvesting for quality',
          'Sustainable processing methods',
          'Water conservation in processing',
          'Organic waste management'
        ],
        activities: [
          'Harvest only ripe cherries',
          'Process using eco-friendly methods',
          'Dry coffee using solar or controlled methods',
          'Compost processing waste'
        ],
        materials: [
          'Harvesting baskets and tools',
          'Processing equipment',
          'Drying facilities',
          'Storage containers'
        ],
        weatherConsiderations: [
          'Harvest during dry weather',
          'Protect drying coffee from rain',
          'Ensure proper ventilation during drying'
        ],
        troubleshooting: [
          'Uneven ripening: Implement multiple harvests',
          'Processing delays: Improve workflow efficiency',
          'Quality issues: Monitor processing parameters'
        ],
        successIndicators: [
          'High-quality coffee beans',
          'Minimal processing waste',
          'Good market prices achieved'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'Drought Stress',
        cropStage: 'All stages',
        immediateActions: [
          'Increase shade canopy density',
          'Apply mulch to conserve moisture',
          'Implement water-saving irrigation'
        ],
        preventiveMeasures: [
          'Establish deep-rooted shade trees',
          'Improve soil organic matter',
          'Install efficient irrigation systems'
        ],
        recoverySteps: [
          'Gradually resume normal irrigation',
          'Apply recovery nutrition',
          'Monitor for stress-related diseases'
        ],
        expectedImpact: 'Yield reduction can be limited to 20-30% with proper management'
      },
      {
        weatherCondition: 'Heavy Rainfall',
        cropStage: 'Flowering to Harvest',
        immediateActions: [
          'Ensure proper field drainage',
          'Apply preventive fungicide treatments',
          'Protect drying coffee from moisture'
        ],
        preventiveMeasures: [
          'Install drainage systems',
          'Maintain proper plant spacing',
          'Use disease-resistant varieties'
        ],
        recoverySteps: [
          'Remove damaged plant parts',
          'Apply recovery treatments',
          'Improve air circulation'
        ],
        expectedImpact: 'Quality issues can be minimized with proper post-rain management'
      }
    ],
    expectedYield: '800-1200 kg/hectare of green coffee beans',
    marketValue: 'Premium price for shade-grown, organic coffee',
    nutritionalBenefits: [
      'Rich in antioxidants',
      'Contains beneficial compounds',
      'Natural caffeine source',
      'Supports mental alertness'
    ],
    myanmarContext: [
      'Suitable for highland areas of Shan State',
      'Can be integrated with existing agroforestry',
      'Growing export market demand',
      'Supports rural income diversification',
      'Compatible with traditional farming systems'
    ],
    icon: '☕',
    color: '#8B4513'
  },
  {
    id: 'csa-avocado-guide',
    cropName: 'Avocado',
    variety: 'Climate-Adapted Varieties',
    category: 'fruits',
    difficulty: 'advanced',
    growingPeriod: '3-4 years to production',
    climateRequirements: {
      temperature: { min: 18, max: 30, optimal: 24 },
      rainfall: { min: 800, max: 1500, optimal: 1200 },
      humidity: { min: 50, max: 75 },
      soilPH: { min: 6.0, max: 7.5 }
    },
    csaApproach: {
      productivityMethods: [
        'Grafted high-yielding varieties',
        'Precision irrigation management',
        'Integrated nutrient management',
        'Pollination optimization'
      ],
      adaptationStrategies: [
        'Heat and drought-tolerant rootstocks',
        'Microclimate management',
        'Water-efficient cultivation',
        'Climate-resilient variety selection'
      ],
      mitigationPractices: [
        'Carbon sequestration in tree biomass',
        'Reduced tillage practices',
        'Organic waste recycling',
        'Efficient water use systems'
      ]
    },
    growingStages: [
      {
        stage: 'Site Selection and Preparation',
        duration: '3-6 months',
        description: 'Choose optimal site and prepare for avocado cultivation',
        csaTechniques: [
          'Select well-drained, elevated sites',
          'Implement contour planting',
          'Install efficient irrigation systems',
          'Prepare windbreaks and microclimates'
        ],
        activities: [
          'Conduct soil and drainage assessment',
          'Prepare planting holes with organic matter',
          'Install irrigation infrastructure',
          'Establish windbreaks if needed'
        ],
        materials: [
          'Soil testing equipment',
          'Organic compost and amendments',
          'Irrigation pipes and emitters',
          'Windbreak plants'
        ],
        weatherConsiderations: [
          'Avoid waterlogged conditions',
          'Consider prevailing wind patterns',
          'Plan for seasonal water availability'
        ],
        troubleshooting: [
          'Poor drainage: Install drainage tiles or raised beds',
          'Compacted soil: Add organic matter and avoid heavy machinery',
          'Wind exposure: Establish protective barriers'
        ],
        successIndicators: [
          'Excellent soil drainage achieved',
          'Irrigation system functioning properly',
          'Adequate wind protection established'
        ]
      },
      {
        stage: 'Planting and Establishment',
        duration: '1-2 years',
        description: 'Plant grafted trees and establish strong root systems',
        csaTechniques: [
          'Use climate-adapted rootstocks',
          'Optimal spacing for air circulation (6x6m)',
          'Organic mulching and soil management',
          'Integrated water and nutrient management'
        ],
        activities: [
          'Plant grafted trees during optimal season',
          'Apply organic fertilizers and mulch',
          'Establish regular irrigation schedule',
          'Monitor tree establishment and growth'
        ],
        materials: [
          'Grafted avocado trees',
          'Organic fertilizers and compost',
          'Mulching materials',
          'Tree stakes and guards'
        ],
        weatherConsiderations: [
          'Plant during mild weather conditions',
          'Protect young trees from extreme temperatures',
          'Ensure consistent moisture during establishment'
        ],
        troubleshooting: [
          'Transplant shock: Provide adequate water and shade',
          'Root rot: Improve drainage and reduce watering',
          'Slow growth: Check soil nutrition and pH'
        ],
        successIndicators: [
          'High tree survival rate (>95%)',
          'Strong root system development',
          'Healthy vegetative growth'
        ]
      },
      {
        stage: 'Vegetative Growth',
        duration: '2-3 years',
        description: 'Support vigorous tree growth and canopy development',
        csaTechniques: [
          'Precision nutrition management',
          'Pruning for optimal tree structure',
          'Integrated pest and disease management',
          'Efficient water use practices'
        ],
        activities: [
          'Apply balanced organic fertilizers',
          'Prune for good tree structure and air circulation',
          'Monitor for pests and diseases',
          'Maintain consistent irrigation'
        ],
        materials: [
          'Organic fertilizers with micronutrients',
          'Pruning tools and equipment',
          'Organic pest control materials',
          'Irrigation monitoring equipment'
        ],
        weatherConsiderations: [
          'Adjust fertilization based on growth season',
          'Prune during dry periods',
          'Monitor water stress during hot weather'
        ],
        troubleshooting: [
          'Nutrient deficiency: Apply targeted fertilizers',
          'Pest issues: Implement IPM strategies',
          'Water stress: Adjust irrigation frequency'
        ],
        successIndicators: [
          'Strong, well-structured canopy',
          'Healthy leaf color and size',
          'Good annual growth increment'
        ]
      },
      {
        stage: 'Pre-Production',
        duration: '1-2 years',
        description: 'Prepare trees for flowering and fruit production',
        csaTechniques: [
          'Balanced nutrition for flowering',
          'Water management for flower induction',
          'Pollination support systems',
          'Canopy management for light penetration'
        ],
        activities: [
          'Adjust fertilization for reproductive phase',
          'Manage irrigation to induce flowering',
          'Introduce pollinators or hand pollination',
          'Prune for optimal light distribution'
        ],
        materials: [
          'Flowering-stage fertilizers',
          'Pollination support tools',
          'Bee hives or pollinator attractants',
          'Light pruning equipment'
        ],
        weatherConsiderations: [
          'Critical water management during flower induction',
          'Protect flowers from extreme weather',
          'Ensure favorable conditions for pollination'
        ],
        troubleshooting: [
          'Poor flowering: Adjust nutrition and water stress',
          'Low fruit set: Improve pollination',
          'Flower drop: Check environmental conditions'
        ],
        successIndicators: [
          'Good flowering intensity',
          'Successful fruit set',
          'Healthy early fruit development'
        ]
      },
      {
        stage: 'Production and Harvest',
        duration: '6-8 months annually',
        description: 'Manage fruit development and harvest high-quality avocados',
        csaTechniques: [
          'Precision irrigation during fruit development',
          'Integrated pest management',
          'Quality-focused cultivation practices',
          'Sustainable harvest methods'
        ],
        activities: [
          'Monitor fruit development stages',
          'Apply fruit development nutrition',
          'Manage pests and diseases',
          'Harvest at optimal maturity'
        ],
        materials: [
          'Fruit development fertilizers',
          'Pest monitoring and control tools',
          'Harvesting equipment',
          'Post-harvest handling materials'
        ],
        weatherConsiderations: [
          'Critical water needs during fruit sizing',
          'Protect fruits from sun scald',
          'Harvest during optimal weather conditions'
        ],
        troubleshooting: [
          'Fruit drop: Check water and nutrition status',
          'Poor fruit quality: Adjust cultural practices',
          'Pest damage: Intensify monitoring and control'
        ],
        successIndicators: [
          'Good fruit size and quality',
          'Minimal fruit drop',
          'High market value achieved'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'Heat Stress',
        cropStage: 'All stages',
        immediateActions: [
          'Increase irrigation frequency',
          'Apply reflective mulch',
          'Provide temporary shade for young trees'
        ],
        preventiveMeasures: [
          'Use heat-tolerant rootstocks',
          'Maintain adequate soil moisture',
          'Plant windbreaks for microclimate modification'
        ],
        recoverySteps: [
          'Apply foliar nutrition',
          'Gradually reduce irrigation as stress subsides',
          'Monitor for heat-related diseases'
        ],
        expectedImpact: 'Yield reduction can be limited to 15-25% with proper management'
      },
      {
        weatherCondition: 'Waterlogging',
        cropStage: 'All stages',
        immediateActions: [
          'Improve drainage immediately',
          'Reduce irrigation',
          'Apply preventive fungicide treatments'
        ],
        preventiveMeasures: [
          'Install proper drainage systems',
          'Use raised bed cultivation',
          'Select well-drained sites'
        ],
        recoverySteps: [
          'Allow soil to dry gradually',
          'Apply recovery nutrition',
          'Monitor for root rot symptoms'
        ],
        expectedImpact: 'Tree mortality can be prevented with quick drainage action'
      }
    ],
    expectedYield: '8-15 tons per hectare at full production',
    marketValue: 'High-value export crop with growing demand',
    nutritionalBenefits: [
      'Rich in healthy monounsaturated fats',
      'High in fiber and potassium',
      'Contains vitamins K, C, and E',
      'Good source of folate'
    ],
    myanmarContext: [
      'Suitable for highland and mid-elevation areas',
      'Growing domestic and export market',
      'Can be integrated with coffee and other tree crops',
      'Supports high-value agriculture development',
      'Requires initial investment but high returns'
    ],
    icon: '🥑',
    color: '#4ADE80'
  },
  {
    id: 'csa-chili-guide',
    cropName: 'Chili Pepper',
    variety: 'Heat-Tolerant Varieties',
    category: 'vegetables',
    difficulty: 'intermediate',
    growingPeriod: '90-120 days',
    climateRequirements: {
      temperature: { min: 20, max: 35, optimal: 28 },
      rainfall: { min: 600, max: 1000, optimal: 800 },
      humidity: { min: 60, max: 80 },
      soilPH: { min: 6.0, max: 7.0 }
    },
    csaApproach: {
      productivityMethods: [
        'High-yielding heat-tolerant varieties',
        'Drip irrigation for water efficiency',
        'Integrated pest management',
        'Precision nutrient management'
      ],
      adaptationStrategies: [
        'Shade nets during extreme heat',
        'Mulching for soil temperature control',
        'Drought-resistant variety selection',
        'Flexible planting schedules'
      ],
      mitigationPractices: [
        'Organic matter incorporation',
        'Efficient fertilizer use',
        'Composting of crop residues',
        'Reduced tillage practices'
      ]
    },
    growingStages: [
      {
        stage: 'Seed Starting and Nursery',
        duration: '4-6 weeks',
        description: 'Start seeds in controlled environment for strong seedlings',
        csaTechniques: [
          'Use heat-tolerant varieties adapted to local climate',
          'Organic seed treatment for disease resistance',
          'Temperature-controlled nursery management',
          'Water-efficient seedling production'
        ],
        activities: [
          'Start seeds in seed trays with organic mix',
          'Maintain optimal temperature (25-30°C)',
          'Provide adequate light and ventilation',
          'Harden off seedlings before transplanting'
        ],
        materials: [
          'Heat-tolerant chili seeds',
          'Organic seed starting mix',
          'Seed trays and covers',
          'Temperature monitoring equipment'
        ],
        weatherConsiderations: [
          'Protect from temperature extremes',
          'Maintain consistent moisture',
          'Provide ventilation during hot weather'
        ],
        troubleshooting: [
          'Poor germination: Check seed quality and temperature',
          'Damping off: Improve air circulation and drainage',
          'Leggy seedlings: Increase light intensity'
        ],
        successIndicators: [
          'Germination rate >85%',
          'Strong, stocky seedlings',
          'Well-developed root system'
        ]
      },
      {
        stage: 'Transplanting and Establishment',
        duration: '2-3 weeks',
        description: 'Transplant seedlings and establish in field conditions',
        csaTechniques: [
          'Raised bed cultivation for drainage',
          'Drip irrigation system installation',
          'Organic soil preparation',
          'Companion planting integration'
        ],
        activities: [
          'Prepare raised beds with organic matter',
          'Install drip irrigation system',
          'Transplant seedlings with proper spacing',
          'Apply organic starter fertilizer'
        ],
        materials: [
          'Healthy chili seedlings',
          'Organic compost and fertilizers',
          'Drip irrigation equipment',
          'Mulching materials'
        ],
        weatherConsiderations: [
          'Transplant during cool hours',
          'Provide temporary shade if needed',
          'Ensure adequate water for establishment'
        ],
        troubleshooting: [
          'Transplant shock: Provide shade and consistent moisture',
          'Poor establishment: Check soil drainage and pH',
          'Pest attack: Apply organic pest deterrents'
        ],
        successIndicators: [
          'High survival rate (>95%)',
          'New growth within 1 week',
          'Good root establishment'
        ]
      },
      {
        stage: 'Vegetative Growth',
        duration: '4-6 weeks',
        description: 'Support vigorous plant growth and development',
        csaTechniques: [
          'Precision irrigation based on soil moisture',
          'Organic nutrient management',
          'Integrated pest and disease management',
          'Microclimate optimization'
        ],
        activities: [
          'Monitor soil moisture and irrigate as needed',
          'Apply organic fertilizers at regular intervals',
          'Stake plants for support',
          'Scout for pests and diseases regularly'
        ],
        materials: [
          'Organic liquid fertilizers',
          'Plant stakes and ties',
          'Organic pest control products',
          'Soil moisture monitoring tools'
        ],
        weatherConsiderations: [
          'Adjust irrigation based on rainfall',
          'Provide shade during extreme heat',
          'Protect from strong winds'
        ],
        troubleshooting: [
          'Nutrient deficiency: Apply targeted organic fertilizers',
          'Pest outbreak: Implement IPM strategies',
          'Water stress: Adjust irrigation frequency'
        ],
        successIndicators: [
          'Vigorous vegetative growth',
          'Dark green, healthy foliage',
          'Strong stem development'
        ]
      },
      {
        stage: 'Flowering and Fruit Set',
        duration: '3-4 weeks',
        description: 'Support flowering and initial fruit development',
        csaTechniques: [
          'Balanced nutrition for flowering',
          'Optimal water management',
          'Pollination support',
          'Temperature stress management'
        ],
        activities: [
          'Apply flowering stage fertilizers',
          'Maintain consistent soil moisture',
          'Support natural pollination',
          'Monitor for flower drop'
        ],
        materials: [
          'Phosphorus-rich organic fertilizers',
          'Calcium supplements',
          'Pollinator attractant plants',
          'Shade cloth for extreme heat'
        ],
        weatherConsiderations: [
          'Critical temperature control during flowering',
          'Avoid water stress during fruit set',
          'Protect from extreme weather'
        ],
        troubleshooting: [
          'Poor fruit set: Check pollination and nutrition',
          'Flower drop: Control temperature and water stress',
          'Blossom end rot: Improve calcium availability'
        ],
        successIndicators: [
          'Abundant flowering',
          'Good fruit set percentage',
          'Healthy early fruit development'
        ]
      },
      {
        stage: 'Fruit Development and Harvest',
        duration: '6-10 weeks',
        description: 'Support fruit maturation and continuous harvest',
        csaTechniques: [
          'Balanced nutrition for fruit quality',
          'Efficient water management',
          'Integrated pest management',
          'Optimal harvest timing'
        ],
        activities: [
          'Monitor fruit development stages',
          'Apply fruit development fertilizers',
          'Harvest fruits at desired maturity',
          'Maintain plant health for continuous production'
        ],
        materials: [
          'Potassium-rich organic fertilizers',
          'Harvest containers and tools',
          'Post-harvest handling materials',
          'Plant support systems'
        ],
        weatherConsiderations: [
          'Harvest during cool hours',
          'Protect fruits from sun damage',
          'Ensure proper ventilation'
        ],
        troubleshooting: [
          'Fruit cracking: Maintain consistent moisture',
          'Poor fruit quality: Check nutrition and water',
          'Pest damage: Intensify monitoring and control'
        ],
        successIndicators: [
          'Good fruit size and color',
          'Continuous harvest over 8-10 weeks',
          'High market quality'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'Extreme Heat',
        cropStage: 'All stages',
        immediateActions: [
          'Install 30-50% shade nets',
          'Increase irrigation frequency',
          'Apply cooling foliar sprays'
        ],
        preventiveMeasures: [
          'Use heat-tolerant varieties',
          'Mulch soil surface heavily',
          'Plan planting to avoid peak heat'
        ],
        recoverySteps: [
          'Gradually remove shade as temperature drops',
          'Apply recovery nutrition',
          'Monitor for heat stress damage'
        ],
        expectedImpact: 'Yield loss can be limited to 20-30% with proper management'
      }
    ],
    expectedYield: '15-25 tons per hectare fresh chilies',
    marketValue: 'High demand in local and export markets',
    nutritionalBenefits: [
      'Rich in vitamin C and capsaicin',
      'Contains antioxidants',
      'Supports metabolism',
      'Natural antimicrobial properties'
    ],
    myanmarContext: [
      'Essential ingredient in Myanmar cuisine',
      'Suitable for year-round cultivation',
      'Good export potential to neighboring countries',
      'Can be processed for value addition'
    ],
    icon: '🌶️',
    color: '#DC2626'
  },
  {
    id: 'csa-eggplant-guide',
    cropName: 'Eggplant',
    variety: 'Local and Hybrid Varieties',
    category: 'vegetables',
    difficulty: 'intermediate',
    growingPeriod: '100-130 days',
    climateRequirements: {
      temperature: { min: 22, max: 35, optimal: 28 },
      rainfall: { min: 600, max: 1200, optimal: 900 },
      humidity: { min: 60, max: 85 },
      soilPH: { min: 6.0, max: 7.0 }
    },
    csaApproach: {
      productivityMethods: [
        'High-yielding hybrid varieties',
        'Precision irrigation management',
        'Integrated nutrient management',
        'Optimal plant spacing and training'
      ],
      adaptationStrategies: [
        'Heat-tolerant variety selection',
        'Mulching for soil temperature control',
        'Flexible planting schedules',
        'Water conservation techniques'
      ],
      mitigationPractices: [
        'Organic matter incorporation',
        'Efficient fertilizer use',
        'Crop residue management',
        'Reduced tillage practices'
      ]
    },
    growingStages: [
      {
        stage: 'Nursery and Seedling Production',
        duration: '5-6 weeks',
        description: 'Raise healthy seedlings in protected environment',
        csaTechniques: [
          'Use disease-resistant varieties',
          'Organic nursery management',
          'Temperature and humidity control',
          'Integrated pest management in nursery'
        ],
        activities: [
          'Sow seeds in organic seed mix',
          'Maintain optimal growing conditions',
          'Apply organic liquid fertilizers',
          'Harden off seedlings before transplanting'
        ],
        materials: [
          'Quality eggplant seeds',
          'Organic seed starting mix',
          'Nursery trays and covers',
          'Organic fertilizers'
        ],
        weatherConsiderations: [
          'Protect from temperature extremes',
          'Maintain consistent moisture',
          'Provide adequate ventilation'
        ],
        troubleshooting: [
          'Damping off: Improve drainage and air circulation',
          'Slow growth: Check temperature and nutrition',
          'Pest issues: Apply organic pest control'
        ],
        successIndicators: [
          'Strong, healthy seedlings',
          '6-8 true leaves developed',
          'Well-developed root system'
        ]
      },
      {
        stage: 'Field Preparation and Transplanting',
        duration: '2-3 weeks',
        description: 'Prepare field and establish seedlings',
        csaTechniques: [
          'Raised bed cultivation',
          'Drip irrigation installation',
          'Organic soil amendment',
          'Companion planting setup'
        ],
        activities: [
          'Prepare raised beds with organic matter',
          'Install irrigation system',
          'Transplant seedlings with proper spacing',
          'Apply organic base fertilizer'
        ],
        materials: [
          'Healthy eggplant seedlings',
          'Organic compost and fertilizers',
          'Irrigation equipment',
          'Mulching materials'
        ],
        weatherConsiderations: [
          'Transplant during favorable weather',
          'Provide temporary protection if needed',
          'Ensure adequate soil moisture'
        ],
        troubleshooting: [
          'Transplant shock: Provide shade and water',
          'Poor establishment: Check soil conditions',
          'Pest attack: Apply preventive measures'
        ],
        successIndicators: [
          'Good seedling survival rate',
          'Active growth within 1 week',
          'Proper plant establishment'
        ]
      },
      {
        stage: 'Vegetative Growth',
        duration: '6-8 weeks',
        description: 'Support vigorous plant growth and development',
        csaTechniques: [
          'Precision irrigation scheduling',
          'Organic nutrient management',
          'Integrated pest and disease management',
          'Plant training and support'
        ],
        activities: [
          'Monitor soil moisture and irrigate',
          'Apply organic fertilizers regularly',
          'Stake and train plants',
          'Scout for pests and diseases'
        ],
        materials: [
          'Organic fertilizers',
          'Plant stakes and ties',
          'Organic pest control products',
          'Monitoring tools'
        ],
        weatherConsiderations: [
          'Adjust irrigation based on weather',
          'Provide support during windy conditions',
          'Monitor for heat stress'
        ],
        troubleshooting: [
          'Nutrient deficiency: Apply targeted fertilizers',
          'Pest outbreak: Implement IPM strategies',
          'Poor growth: Check soil and water conditions'
        ],
        successIndicators: [
          'Vigorous vegetative growth',
          'Healthy green foliage',
          'Strong plant structure'
        ]
      },
      {
        stage: 'Flowering and Fruit Development',
        duration: '4-6 weeks',
        description: 'Support flowering and fruit set',
        csaTechniques: [
          'Balanced nutrition for flowering',
          'Optimal water management',
          'Pollination support',
          'Fruit thinning if needed'
        ],
        activities: [
          'Apply flowering stage fertilizers',
          'Maintain consistent soil moisture',
          'Support natural pollination',
          'Monitor fruit development'
        ],
        materials: [
          'Balanced organic fertilizers',
          'Calcium supplements',
          'Pollination support tools',
          'Fruit support materials'
        ],
        weatherConsiderations: [
          'Critical water needs during flowering',
          'Protect from extreme temperatures',
          'Ensure good air circulation'
        ],
        troubleshooting: [
          'Poor fruit set: Check pollination and nutrition',
          'Flower drop: Control environmental stress',
          'Fruit deformities: Improve growing conditions'
        ],
        successIndicators: [
          'Good flowering intensity',
          'High fruit set percentage',
          'Healthy fruit development'
        ]
      },
      {
        stage: 'Harvest and Continuous Production',
        duration: '8-12 weeks',
        description: 'Harvest mature fruits and maintain production',
        csaTechniques: [
          'Optimal harvest timing',
          'Continuous plant maintenance',
          'Quality-focused harvesting',
          'Post-harvest handling'
        ],
        activities: [
          'Harvest fruits at proper maturity',
          'Maintain plant health for continuous production',
          'Apply post-harvest fertilizers',
          'Monitor for late-season pests'
        ],
        materials: [
          'Harvest tools and containers',
          'Post-harvest fertilizers',
          'Storage and handling materials',
          'Plant maintenance tools'
        ],
        weatherConsiderations: [
          'Harvest during cool hours',
          'Protect harvested fruits from heat',
          'Maintain plant health during stress periods'
        ],
        troubleshooting: [
          'Fruit quality issues: Improve cultural practices',
          'Reduced production: Check plant nutrition',
          'Storage problems: Improve post-harvest handling'
        ],
        successIndicators: [
          'Good fruit size and quality',
          'Continuous harvest over 10-12 weeks',
          'High market acceptance'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'High Temperature',
        cropStage: 'Flowering and Fruiting',
        immediateActions: [
          'Provide shade during peak hours',
          'Increase irrigation frequency',
          'Apply foliar cooling sprays'
        ],
        preventiveMeasures: [
          'Use heat-tolerant varieties',
          'Mulch heavily around plants',
          'Install shade structures'
        ],
        recoverySteps: [
          'Monitor for heat stress symptoms',
          'Apply recovery nutrition',
          'Adjust irrigation schedule'
        ],
        expectedImpact: 'Yield reduction can be minimized to 15-25%'
      }
    ],
    expectedYield: '25-40 tons per hectare',
    marketValue: 'Consistent demand in local markets',
    nutritionalBenefits: [
      'Rich in fiber and antioxidants',
      'Good source of vitamins and minerals',
      'Low in calories',
      'Contains nasunin for brain health'
    ],
    myanmarContext: [
      'Popular vegetable in Myanmar cuisine',
      'Suitable for both seasons',
      'Good market demand year-round',
      'Can be grown in home gardens'
    ],
    icon: '🍆',
    color: '#8B5CF6'
  },
  {
    id: 'csa-okra-guide',
    cropName: 'Okra (Lady Finger)',
    variety: 'Heat-Tolerant Varieties',
    category: 'vegetables',
    difficulty: 'beginner',
    growingPeriod: '60-90 days',
    climateRequirements: {
      temperature: { min: 25, max: 40, optimal: 32 },
      rainfall: { min: 500, max: 1000, optimal: 750 },
      humidity: { min: 60, max: 85 },
      soilPH: { min: 6.0, max: 7.5 }
    },
    csaApproach: {
      productivityMethods: [
        'High-yielding heat-tolerant varieties',
        'Direct seeding for better establishment',
        'Optimal plant spacing',
        'Regular harvesting for continuous production'
      ],
      adaptationStrategies: [
        'Drought-tolerant variety selection',
        'Mulching for moisture conservation',
        'Heat stress management',
        'Flexible planting dates'
      ],
      mitigationPractices: [
        'Organic matter incorporation',
        'Minimal tillage practices',
        'Crop residue recycling',
        'Efficient water use'
      ]
    },
    growingStages: [
      {
        stage: 'Land Preparation and Sowing',
        duration: '1-2 weeks',
        description: 'Prepare land and direct sow okra seeds',
        csaTechniques: [
          'Minimal tillage land preparation',
          'Organic matter incorporation',
          'Direct seeding for better root development',
          'Optimal row spacing for mechanization'
        ],
        activities: [
          'Prepare field with minimal disturbance',
          'Apply organic fertilizers and compost',
          'Sow seeds directly in rows',
          'Apply light irrigation after sowing'
        ],
        materials: [
          'Heat-tolerant okra seeds',
          'Organic fertilizers and compost',
          'Basic farm tools',
          'Irrigation equipment'
        ],
        weatherConsiderations: [
          'Sow after soil temperature reaches 20°C',
          'Avoid sowing during heavy rain periods',
          'Ensure adequate soil moisture for germination'
        ],
        troubleshooting: [
          'Poor germination: Check seed quality and soil moisture',
          'Uneven emergence: Ensure proper seed depth',
          'Pest attack: Apply organic seed treatment'
        ],
        successIndicators: [
          'Uniform germination >80%',
          'Good seedling vigor',
          'Proper plant population'
        ]
      },
      {
        stage: 'Seedling Establishment',
        duration: '2-3 weeks',
        description: 'Support seedling growth and establishment',
        csaTechniques: [
          'Water-efficient irrigation',
          'Organic weed management',
          'Integrated pest management',
          'Soil moisture conservation'
        ],
        activities: [
          'Thin seedlings to optimal spacing',
          'Apply light irrigation as needed',
          'Control weeds mechanically',
          'Monitor for early pests'
        ],
        materials: [
          'Thinning and weeding tools',
          'Organic mulching materials',
          'Irrigation equipment',
          'Organic pest deterrents'
        ],
        weatherConsiderations: [
          'Protect seedlings from extreme heat',
          'Maintain consistent soil moisture',
          'Provide wind protection if needed'
        ],
        troubleshooting: [
          'Damping off: Improve drainage and air circulation',
          'Slow growth: Check soil nutrition',
          'Pest damage: Apply organic controls'
        ],
        successIndicators: [
          'Healthy seedling establishment',
          'Good root development',
          'Uniform plant growth'
        ]
      },
      {
        stage: 'Vegetative Growth',
        duration: '3-4 weeks',
        description: 'Support vigorous plant growth',
        csaTechniques: [
          'Precision nutrient management',
          'Efficient water use',
          'Integrated pest and disease management',
          'Soil health maintenance'
        ],
        activities: [
          'Apply organic fertilizers',
          'Monitor soil moisture and irrigate',
          'Control weeds and pests',
          'Maintain soil mulch'
        ],
        materials: [
          'Organic fertilizers',
          'Mulching materials',
          'Pest monitoring tools',
          'Irrigation equipment'
        ],
        weatherConsiderations: [
          'Adjust irrigation based on rainfall',
          'Monitor for heat stress',
          'Protect from strong winds'
        ],
        troubleshooting: [
          'Nutrient deficiency: Apply targeted fertilizers',
          'Water stress: Adjust irrigation schedule',
          'Pest outbreak: Implement IPM strategies'
        ],
        successIndicators: [
          'Vigorous vegetative growth',
          'Healthy green foliage',
          'Good plant height and branching'
        ]
      },
      {
        stage: 'Flowering and Pod Formation',
        duration: '2-3 weeks',
        description: 'Support flowering and initial pod development',
        csaTechniques: [
          'Balanced nutrition for flowering',
          'Optimal water management',
          'Pollination support',
          'Early harvest preparation'
        ],
        activities: [
          'Apply flowering stage fertilizers',
          'Maintain consistent soil moisture',
          'Monitor flower and pod development',
          'Prepare for harvest'
        ],
        materials: [
          'Balanced organic fertilizers',
          'Harvest preparation tools',
          'Monitoring equipment',
          'Storage containers'
        ],
        weatherConsiderations: [
          'Critical water needs during flowering',
          'Protect flowers from extreme weather',
          'Ensure good pollination conditions'
        ],
        troubleshooting: [
          'Poor flowering: Check nutrition and water',
          'Flower drop: Control environmental stress',
          'Pest damage: Intensify monitoring'
        ],
        successIndicators: [
          'Abundant flowering',
          'Good pod set',
          'Healthy pod development'
        ]
      },
      {
        stage: 'Continuous Harvest',
        duration: '6-8 weeks',
        description: 'Regular harvesting for continuous production',
        csaTechniques: [
          'Regular harvest for continuous production',
          'Plant maintenance for extended harvest',
          'Quality-focused harvesting',
          'Post-harvest handling'
        ],
        activities: [
          'Harvest young tender pods daily',
          'Maintain plant health',
          'Apply post-harvest fertilizers',
          'Monitor for late-season issues'
        ],
        materials: [
          'Sharp harvest knives',
          'Harvest containers',
          'Post-harvest fertilizers',
          'Storage materials'
        ],
        weatherConsiderations: [
          'Harvest during cool morning hours',
          'Protect harvested pods from heat',
          'Maintain plant health during stress'
        ],
        troubleshooting: [
          'Tough pods: Harvest more frequently',
          'Reduced production: Check plant nutrition',
          'Quality issues: Improve harvest timing'
        ],
        successIndicators: [
          'Tender, high-quality pods',
          'Continuous production over 6-8 weeks',
          'Good market acceptance'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'Extreme Heat',
        cropStage: 'All stages',
        immediateActions: [
          'Increase irrigation frequency',
          'Apply mulch to cool soil',
          'Harvest during cooler hours'
        ],
        preventiveMeasures: [
          'Use heat-tolerant varieties',
          'Plant during optimal seasons',
          'Maintain soil organic matter'
        ],
        recoverySteps: [
          'Monitor for heat stress symptoms',
          'Apply foliar nutrition',
          'Adjust cultural practices'
        ],
        expectedImpact: 'Minimal yield loss with proper heat management'
      }
    ],
    expectedYield: '8-12 tons per hectare',
    marketValue: 'Good demand in local and regional markets',
    nutritionalBenefits: [
      'High in fiber and vitamin C',
      'Good source of folate',
      'Contains antioxidants',
      'Supports digestive health'
    ],
    myanmarContext: [
      'Popular vegetable in Myanmar cuisine',
      'Well-adapted to hot climate',
      'Can be grown year-round',
      'Good for small-scale farming'
    ],
    icon: '🌶️',
    color: '#16A34A'
  },
  {
    id: 'csa-cucumber-guide',
    cropName: 'Cucumber',
    variety: 'Heat-Tolerant Varieties',
    category: 'vegetables',
    difficulty: 'intermediate',
    growingPeriod: '70-90 days',
    climateRequirements: {
      temperature: { min: 18, max: 35, optimal: 26 },
      rainfall: { min: 600, max: 1200, optimal: 900 },
      humidity: { min: 60, max: 85 },
      soilPH: { min: 6.0, max: 7.0 }
    },
    csaApproach: {
      productivityMethods: [
        'High-yielding hybrid varieties',
        'Vertical growing systems',
        'Drip irrigation for efficiency',
        'Integrated pest management'
      ],
      adaptationStrategies: [
        'Heat-tolerant variety selection',
        'Shade nets during extreme heat',
        'Mulching for soil temperature control',
        'Protected cultivation techniques'
      ],
      mitigationPractices: [
        'Organic matter incorporation',
        'Efficient water use systems',
        'Crop residue management',
        'Reduced tillage practices'
      ]
    },
    growingStages: [
      {
        stage: 'Seed Starting and Nursery',
        duration: '3-4 weeks',
        description: 'Start seeds and raise healthy seedlings',
        csaTechniques: [
          'Use disease-resistant varieties',
          'Controlled environment nursery',
          'Organic seed treatment',
          'Temperature and humidity management'
        ],
        activities: [
          'Start seeds in organic seed mix',
          'Maintain optimal growing conditions',
          'Apply organic liquid fertilizers',
          'Prepare seedlings for transplanting'
        ],
        materials: [
          'Quality cucumber seeds',
          'Organic seed starting mix',
          'Seed trays and covers',
          'Nursery management tools'
        ],
        weatherConsiderations: [
          'Maintain consistent temperature',
          'Protect from temperature extremes',
          'Ensure adequate ventilation'
        ],
        troubleshooting: [
          'Poor germination: Check seed quality and conditions',
          'Damping off: Improve air circulation',
          'Slow growth: Adjust temperature and nutrition'
        ],
        successIndicators: [
          'Strong, healthy seedlings',
          'Well-developed root system',
          'Ready for transplanting'
        ]
      },
      {
        stage: 'Field Preparation and Transplanting',
        duration: '1-2 weeks',
        description: 'Prepare field and establish cucumber plants',
        csaTechniques: [
          'Raised bed cultivation',
          'Drip irrigation installation',
          'Vertical support system setup',
          'Organic soil preparation'
        ],
        activities: [
          'Prepare raised beds with organic matter',
          'Install irrigation and support systems',
          'Transplant seedlings with proper spacing',
          'Apply organic base fertilizer'
        ],
        materials: [
          'Healthy cucumber seedlings',
          'Organic compost and fertilizers',
          'Trellises and support materials',
          'Irrigation equipment'
        ],
        weatherConsiderations: [
          'Transplant during favorable weather',
          'Provide temporary protection',
          'Ensure adequate soil moisture'
        ],
        troubleshooting: [
          'Transplant shock: Provide shade and water',
          'Poor establishment: Check soil conditions',
          'Support issues: Strengthen trellis system'
        ],
        successIndicators: [
          'Good seedling survival',
          'Active growth within days',
          'Proper support system in place'
        ]
      },
      {
        stage: 'Vegetative Growth and Training',
        duration: '4-5 weeks',
        description: 'Support plant growth and train on supports',
        csaTechniques: [
          'Precision irrigation management',
          'Organic nutrient management',
          'Plant training and pruning',
          'Integrated pest management'
        ],
        activities: [
          'Train vines on support structures',
          'Apply organic fertilizers regularly',
          'Monitor soil moisture and irrigate',
          'Scout for pests and diseases'
        ],
        materials: [
          'Plant ties and clips',
          'Organic fertilizers',
          'Pruning tools',
          'Pest monitoring equipment'
        ],
        weatherConsiderations: [
          'Adjust irrigation based on weather',
          'Provide wind protection',
          'Monitor for heat stress'
        ],
        troubleshooting: [
          'Poor vine growth: Check nutrition and water',
          'Training issues: Adjust support system',
          'Pest problems: Implement IPM strategies'
        ],
        successIndicators: [
          'Vigorous vine growth',
          'Good plant training',
          'Healthy foliage development'
        ]
      },
      {
        stage: 'Flowering and Fruit Set',
        duration: '2-3 weeks',
        description: 'Support flowering and fruit development',
        csaTechniques: [
          'Balanced nutrition for flowering',
          'Optimal water management',
          'Pollination support',
          'Environmental control'
        ],
        activities: [
          'Apply flowering stage fertilizers',
          'Maintain consistent soil moisture',
          'Support pollination activities',
          'Monitor fruit set and development'
        ],
        materials: [
          'Balanced organic fertilizers',
          'Pollination support tools',
          'Monitoring equipment',
          'Environmental control materials'
        ],
        weatherConsiderations: [
          'Critical water needs during flowering',
          'Protect from extreme temperatures',
          'Ensure good pollination conditions'
        ],
        troubleshooting: [
          'Poor fruit set: Check pollination and nutrition',
          'Flower drop: Control environmental stress',
          'Fruit deformities: Improve growing conditions'
        ],
        successIndicators: [
          'Good flowering intensity',
          'High fruit set percentage',
          'Healthy fruit development'
        ]
      },
      {
        stage: 'Harvest and Production',
        duration: '6-8 weeks',
        description: 'Continuous harvesting of mature cucumbers',
        csaTechniques: [
          'Regular harvest for continuous production',
          'Quality-focused harvesting',
          'Plant maintenance',
          'Post-harvest handling'
        ],
        activities: [
          'Harvest cucumbers at optimal size',
          'Maintain plant health',
          'Apply post-harvest fertilizers',
          'Monitor for late-season issues'
        ],
        materials: [
          'Sharp harvest knives',
          'Harvest containers',
          'Post-harvest fertilizers',
          'Storage and handling materials'
        ],
        weatherConsiderations: [
          'Harvest during cool hours',
          'Protect harvested fruits from heat',
          'Maintain plant health during stress'
        ],
        troubleshooting: [
          'Bitter cucumbers: Check water and heat stress',
          'Reduced production: Improve plant nutrition',
          'Quality issues: Adjust harvest timing'
        ],
        successIndicators: [
          'High-quality cucumbers',
          'Continuous production',
          'Good market acceptance'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'High Temperature',
        cropStage: 'All stages',
        immediateActions: [
          'Install shade nets (30-50%)',
          'Increase irrigation frequency',
          'Apply cooling mulch'
        ],
        preventiveMeasures: [
          'Use heat-tolerant varieties',
          'Plan planting for cooler seasons',
          'Install permanent shade structures'
        ],
        recoverySteps: [
          'Monitor for heat stress symptoms',
          'Apply recovery nutrition',
          'Adjust irrigation schedule'
        ],
        expectedImpact: 'Yield reduction can be limited to 20-30%'
      }
    ],
    expectedYield: '20-35 tons per hectare',
    marketValue: 'Good demand in fresh markets',
    nutritionalBenefits: [
      'High water content for hydration',
      'Good source of vitamin K',
      'Contains antioxidants',
      'Low in calories'
    ],
    myanmarContext: [
      'Popular salad vegetable',
      'Suitable for protected cultivation',
      'Good market demand year-round',
      'Can be grown in small spaces'
    ],
    icon: '🥒',
    color: '#22C55E'
  },
  {
    id: 'csa-maize-guide',
    cropName: 'Maize (Corn)',
    variety: 'Drought-Tolerant Hybrids',
    category: 'cereals',
    difficulty: 'intermediate',
    growingPeriod: '90-120 days',
    climateRequirements: {
      temperature: { min: 18, max: 35, optimal: 26 },
      rainfall: { min: 500, max: 1200, optimal: 800 },
      humidity: { min: 50, max: 80 },
      soilPH: { min: 6.0, max: 7.5 }
    },
    csaApproach: {
      productivityMethods: [
        'High-yielding drought-tolerant hybrids',
        'Precision planting and spacing',
        'Integrated nutrient management',
        'Optimal plant population'
      ],
      adaptationStrategies: [
        'Drought-tolerant variety selection',
        'Conservation agriculture practices',
        'Flexible planting dates',
        'Water harvesting techniques'
      ],
      mitigationPractices: [
        'Reduced tillage practices',
        'Crop residue retention',
        'Efficient fertilizer use',
        'Carbon sequestration in soil'
      ]
    },
    growingStages: [
      {
        stage: 'Land Preparation and Planting',
        duration: '2-3 weeks',
        description: 'Prepare land and plant maize using conservation practices',
        csaTechniques: [
          'Minimum tillage land preparation',
          'Precision planting for optimal spacing',
          'Organic matter incorporation',
          'Water conservation measures'
        ],
        activities: [
          'Prepare field with minimal disturbance',
          'Apply organic fertilizers and compost',
          'Plant seeds at optimal depth and spacing',
          'Install water conservation structures'
        ],
        materials: [
          'Drought-tolerant maize seeds',
          'Organic fertilizers and compost',
          'Precision planting equipment',
          'Water conservation materials'
        ],
        weatherConsiderations: [
          'Plant after sufficient soil moisture',
          'Avoid planting during extreme weather',
          'Time planting with rainfall patterns'
        ],
        troubleshooting: [
          'Poor germination: Check seed quality and moisture',
          'Uneven emergence: Ensure proper planting depth',
          'Pest attack: Apply organic seed treatment'
        ],
        successIndicators: [
          'Uniform germination >85%',
          'Good seedling vigor',
          'Optimal plant population achieved'
        ]
      },
      {
        stage: 'Seedling Establishment',
        duration: '3-4 weeks',
        description: 'Support seedling growth and establishment',
        csaTechniques: [
          'Water-efficient irrigation',
          'Organic weed management',
          'Integrated pest management',
          'Soil health monitoring'
        ],
        activities: [
          'Monitor seedling development',
          'Apply light irrigation if needed',
          'Control weeds mechanically',
          'Scout for early pests and diseases'
        ],
        materials: [
          'Irrigation equipment',
          'Mechanical weeding tools',
          'Organic pest control materials',
          'Monitoring tools'
        ],
        weatherConsiderations: [
          'Protect seedlings from extreme weather',
          'Maintain adequate soil moisture',
          'Monitor for drought stress'
        ],
        troubleshooting: [
          'Slow growth: Check soil nutrition and moisture',
          'Weed competition: Increase weeding frequency',
          'Pest damage: Apply organic controls'
        ],
        successIndicators: [
          'Healthy seedling establishment',
          'Good root development',
          'Effective weed control'
        ]
      },
      {
        stage: 'Vegetative Growth',
        duration: '5-6 weeks',
        description: 'Support vigorous plant growth and development',
        csaTechniques: [
          'Precision nutrient management',
          'Efficient water use',
          'Integrated pest and disease management',
          'Soil conservation practices'
        ],
        activities: [
          'Apply organic fertilizers at key growth stages',
          'Monitor soil moisture and irrigate as needed',
          'Control weeds and pests',
          'Maintain soil cover and structure'
        ],
        materials: [
          'Organic fertilizers',
          'Irrigation equipment',
          'Pest monitoring tools',
          'Soil conservation materials'
        ],
        weatherConsiderations: [
          'Adjust irrigation based on rainfall',
          'Monitor for drought stress',
          'Protect from strong winds'
        ],
        troubleshooting: [
          'Nutrient deficiency: Apply targeted fertilizers',
          'Water stress: Adjust irrigation schedule',
          'Pest outbreak: Implement IPM strategies'
        ],
        successIndicators: [
          'Vigorous vegetative growth',
          'Good plant height and leaf development',
          'Healthy green color'
        ]
      },
      {
        stage: 'Tasseling and Silking',
        duration: '2-3 weeks',
        description: 'Critical reproductive phase requiring optimal conditions',
        csaTechniques: [
          'Optimal water management during critical period',
          'Balanced nutrition for reproduction',
          'Pollination support',
          'Stress management'
        ],
        activities: [
          'Ensure adequate water supply',
          'Apply reproductive stage fertilizers',
          'Monitor pollination process',
          'Protect from environmental stress'
        ],
        materials: [
          'Irrigation equipment',
          'Reproductive stage fertilizers',
          'Monitoring tools',
          'Stress protection materials'
        ],
        weatherConsiderations: [
          'Critical water needs during tasseling',
          'Protect from extreme temperatures',
          'Ensure good pollination weather'
        ],
        troubleshooting: [
          'Poor pollination: Check environmental conditions',
          'Silk emergence issues: Ensure adequate nutrition',
          'Stress symptoms: Improve water and nutrition'
        ],
        successIndicators: [
          'Good tassel and silk development',
          'Successful pollination',
          'Good kernel set'
        ]
      },
      {
        stage: 'Grain Filling and Maturation',
        duration: '6-8 weeks',
        description: 'Support grain development and prepare for harvest',
        csaTechniques: [
          'Balanced nutrition for grain filling',
          'Water management during grain development',
          'Plant health maintenance',
          'Harvest preparation'
        ],
        activities: [
          'Monitor grain development',
          'Apply grain filling fertilizers',
          'Maintain plant health',
          'Prepare for harvest timing'
        ],
        materials: [
          'Grain filling fertilizers',
          'Plant health monitoring tools',
          'Harvest preparation equipment',
          'Storage preparation materials'
        ],
        weatherConsiderations: [
          'Monitor for drought stress during grain filling',
          'Protect from extreme weather',
          'Plan harvest timing based on weather'
        ],
        troubleshooting: [
          'Poor grain filling: Check water and nutrition',
          'Disease issues: Apply preventive treatments',
          'Lodging: Provide plant support if needed'
        ],
        successIndicators: [
          'Good grain development',
          'Proper kernel moisture content',
          'Healthy plant condition at harvest'
        ]
      }
    ],
    weatherManagement: [
      {
        weatherCondition: 'Drought Stress',
        cropStage: 'Tasseling to Grain Filling',
        immediateActions: [
          'Apply supplemental irrigation if available',
          'Mulch soil surface to conserve moisture',
          'Reduce plant competition through thinning'
        ],
        preventiveMeasures: [
          'Use drought-tolerant varieties',
          'Improve soil water retention',
          'Install water harvesting systems'
        ],
        recoverySteps: [
          'Resume normal irrigation when available',
          'Apply stress recovery fertilizers',
          'Monitor for secondary pest issues'
        ],
        expectedImpact: 'Yield reduction can be limited to 25-40% with proper management'
      }
    ],
    expectedYield: '4-7 tons per hectare with CSA practices',
    marketValue: 'Good demand for food and feed markets',
    nutritionalBenefits: [
      'Good source of carbohydrates',
      'Contains protein and fiber',
      'Rich in vitamin B6',
      'Provides essential amino acids'
    ],
    myanmarContext: [
      'Important cereal crop in Myanmar',
      'Suitable for both seasons',
      'Good rotation crop with rice',
      'Growing demand for animal feed'
    ],
    icon: '🌽',
    color: '#FCD34D'
  }
];

// Climate-Smart Agriculture Practices
export const CSA_PRACTICES: CSAPractice[] = [
  {
    id: 'awd-rice',
    name: 'Alternate Wetting and Drying (AWD)',
    pillar: 'mitigation',
    category: 'water-management',
    difficulty: 'intermediate',
    timeToImplement: '1 season',
    costLevel: 'low',
    description: 'Water management technique for rice that reduces methane emissions while maintaining yields',
    climateImpact: {
      adaptationBenefit: 'Reduces water use by 15-30%, building resilience to water scarcity',
      mitigationPotential: 'Reduces methane emissions by 30-70% compared to continuous flooding',
      productivityGain: 'Maintains or slightly increases rice yields while reducing input costs'
    },
    implementation: [
      'Install water level monitoring tubes in rice fields',
      'Allow water level to drop 15cm below soil surface',
      'Re-flood when water reaches safe AWD threshold',
      'Maintain continuous flooding during flowering stage',
      'Monitor crop response and adjust as needed'
    ],
    materials: [
      'Perforated PVC pipes for water level monitoring',
      'Field leveling equipment',
      'Water control structures',
      'Measuring tape or ruler'
    ],
    monitoring: [
      'Daily water level measurements',
      'Weekly crop growth observations',
      'Soil moisture monitoring',
      'Yield measurements at harvest'
    ],
    successIndicators: [
      'Water savings of 15-30%',
      'Maintained or improved yields',
      'Reduced methane emissions',
      'Lower irrigation costs'
    ],
    myanmarContext: [
      'Suitable for irrigated rice systems in Myanmar',
      'Can be adapted to monsoon rice with supplemental irrigation',
      'Requires farmer training and initial support',
      'Compatible with existing rice varieties'
    ],
    weatherDependency: [
      'Most effective in irrigated systems',
      'Requires reliable water supply control',
      'May need adjustment during extreme weather'
    ],
    icon: '🌾',
    color: '#3B82F6'
  },
  {
    id: 'cover-crop-system',
    name: 'Cover Crop Integration',
    pillar: 'mitigation',
    category: 'soil-health',
    difficulty: 'intermediate',
    timeToImplement: '2-3 seasons',
    costLevel: 'medium',
    description: 'Growing cover crops to improve soil health, sequester carbon, and enhance system resilience',
    climateImpact: {
      adaptationBenefit: 'Improves soil water retention and reduces erosion during extreme weather',
      mitigationPotential: 'Sequesters 0.5-2 tons CO2/ha/year in soil organic matter',
      productivityGain: 'Increases main crop yields by 10-25% through improved soil fertility'
    },
    implementation: [
      'Select appropriate cover crop species for local conditions',
      'Plant cover crops after main crop harvest',
      'Manage cover crops through growth cycle',
      'Terminate cover crops before main crop planting',
      'Incorporate residues into soil or use as mulch'
    ],
    materials: [
      'Cover crop seeds (legumes, grasses, brassicas)',
      'Seeding equipment or broadcasting tools',
      'Termination equipment (mower, roller)',
      'Incorporation tools if needed'
    ],
    monitoring: [
      'Cover crop establishment and growth',
      'Soil organic matter changes',
      'Nitrogen fixation by legume covers',
      'Main crop response and yields'
    ],
    successIndicators: [
      'Good cover crop establishment (>80% ground cover)',
      'Increased soil organic matter',
      'Improved soil structure and water infiltration',
      'Enhanced main crop performance'
    ],
    myanmarContext: [
      'Suitable for rice-based systems during dry season',
      'Can use local legume species like cowpea, mung bean',
      'Fits well with traditional crop rotation practices',
      'Provides additional income from cover crop harvest'
    ],
    weatherDependency: [
      'Requires adequate moisture for establishment',
      'Drought-tolerant species needed for dry season',
      'May need irrigation in very dry conditions'
    ],
    icon: '🌱',
    color: '#10B981'
  },
  {
    id: 'precision-fertilizer',
    name: 'Precision Fertilizer Management',
    pillar: 'productivity',
    category: 'crop-management',
    difficulty: 'advanced',
    timeToImplement: '1-2 seasons',
    costLevel: 'medium',
    description: 'Site-specific fertilizer application based on soil testing and crop needs',
    climateImpact: {
      adaptationBenefit: 'Optimizes nutrient availability under variable climate conditions',
      mitigationPotential: 'Reduces N2O emissions by 20-40% through efficient nitrogen use',
      productivityGain: 'Increases nutrient use efficiency and crop yields by 15-30%'
    },
    implementation: [
      'Conduct detailed soil testing for nutrient status',
      'Develop site-specific fertilizer recommendations',
      'Use precision application equipment',
      'Apply fertilizers at optimal timing',
      'Monitor crop response and adjust rates'
    ],
    materials: [
      'Soil testing kits or laboratory services',
      'GPS or field mapping tools',
      'Variable rate application equipment',
      'Leaf color charts or SPAD meters',
      'Record keeping materials'
    ],
    monitoring: [
      'Soil nutrient levels before and after application',
      'Plant tissue nutrient analysis',
      'Crop growth and development stages',
      'Yield response to fertilizer treatments'
    ],
    successIndicators: [
      'Improved nutrient use efficiency',
      'Reduced fertilizer costs per unit yield',
      'Better crop nutrition and health',
      'Minimized environmental losses'
    ],
    myanmarContext: [
      'Particularly important for intensive rice systems',
      'Can reduce fertilizer costs for smallholder farmers',
      'Requires access to soil testing services',
      'Compatible with both organic and mineral fertilizers'
    ],
    weatherDependency: [
      'Application timing depends on weather conditions',
      'Rainfall affects nutrient availability and losses',
      'Temperature influences nutrient uptake rates'
    ],
    icon: '🧪',
    color: '#8B5CF6'
  },
  {
    id: 'agroforestry-system',
    name: 'Agroforestry Integration',
    pillar: 'adaptation',
    category: 'climate-resilience',
    difficulty: 'advanced',
    timeToImplement: '3-5 years',
    costLevel: 'high',
    description: 'Integrating trees with crops and/or livestock for multiple benefits',
    climateImpact: {
      adaptationBenefit: 'Provides microclimate modification and protection from extreme weather',
      mitigationPotential: 'Sequesters 2-10 tons CO2/ha/year in tree biomass and soil',
      productivityGain: 'Diversifies income sources and can increase total system productivity'
    },
    implementation: [
      'Design appropriate tree-crop combinations',
      'Select suitable tree species for local conditions',
      'Establish trees with proper spacing and arrangement',
      'Manage competition between trees and crops',
      'Harvest tree products at appropriate times'
    ],
    materials: [
      'Tree seedlings or seeds',
      'Planting tools and equipment',
      'Fencing materials for protection',
      'Pruning and management tools',
      'Irrigation systems if needed'
    ],
    monitoring: [
      'Tree survival and growth rates',
      'Crop performance under trees',
      'Soil health improvements',
      'Economic returns from tree products'
    ],
    successIndicators: [
      'High tree survival rates (>80%)',
      'Maintained or improved crop yields',
      'Diversified income streams',
      'Enhanced ecosystem services'
    ],
    myanmarContext: [
      'Traditional practice in many Myanmar farming systems',
      'Suitable for both upland and lowland areas',
      'Can include fruit trees, timber species, or multipurpose trees',
      'Provides additional income and food security'
    ],
    weatherDependency: [
      'Tree establishment requires adequate rainfall',
      'Mature systems provide weather protection',
      'Species selection depends on climate conditions'
    ],
    icon: '🌳',
    color: '#059669'
  }
];

// Weather-based Decision Support
export const WEATHER_DECISIONS: WeatherBasedDecision[] = [
  {
    weatherCondition: 'Heavy Rainfall Expected',
    recommendation: 'Prepare for excess water management',
    actions: [
      'Check and clear drainage channels',
      'Harvest mature crops if possible',
      'Apply preventive fungicide treatments',
      'Secure farm equipment and materials'
    ],
    timing: '24-48 hours before expected rainfall',
    precautions: [
      'Avoid field operations during heavy rain',
      'Monitor for waterlogging in low-lying areas',
      'Be prepared for potential flooding'
    ],
    expectedOutcome: 'Minimized crop damage and infrastructure loss'
  },
  {
    weatherCondition: 'Drought Conditions Developing',
    recommendation: 'Implement water conservation measures',
    actions: [
      'Switch to drought-tolerant crop varieties',
      'Implement water-saving irrigation techniques',
      'Apply mulch to reduce evaporation',
      'Consider early harvest of stressed crops'
    ],
    timing: 'As soon as drought indicators appear',
    precautions: [
      'Monitor soil moisture levels regularly',
      'Prioritize water use for most valuable crops',
      'Prepare alternative livelihood strategies'
    ],
    expectedOutcome: 'Maintained crop production under water stress'
  },
  {
    weatherCondition: 'Temperature Extremes (>40°C)',
    recommendation: 'Protect crops from heat stress',
    actions: [
      'Provide shade for sensitive crops',
      'Increase irrigation frequency',
      'Apply foliar sprays to cool plants',
      'Harvest early morning or late evening'
    ],
    timing: 'Before and during heat wave periods',
    precautions: [
      'Avoid midday field work',
      'Monitor workers for heat stress',
      'Ensure adequate water supply'
    ],
    expectedOutcome: 'Reduced heat stress damage to crops'
  },
  {
    weatherCondition: 'Pest/Disease Favorable Weather',
    recommendation: 'Implement integrated pest management',
    actions: [
      'Apply preventive treatments',
      'Increase field monitoring frequency',
      'Remove infected plant materials',
      'Use biological control agents'
    ],
    timing: 'Based on weather-pest models',
    precautions: [
      'Follow safe pesticide application practices',
      'Rotate different control methods',
      'Monitor for resistance development'
    ],
    expectedOutcome: 'Effective pest and disease control'
  }
];

// Get CSA growing guides by category
export function getCSAGuidesByCategory(category: string): CSAGrowingGuide[] {
  return CSA_GROWING_GUIDES.filter(guide => guide.category === category);
}

// Get CSA growing guides by difficulty
export function getCSAGuidesByDifficulty(difficulty: string): CSAGrowingGuide[] {
  return CSA_GROWING_GUIDES.filter(guide => guide.difficulty === difficulty);
}

// Get CSA growing guide by crop name
export function getCSAGuideByName(cropName: string): CSAGrowingGuide | undefined {
  return CSA_GROWING_GUIDES.find(guide => guide.cropName.toLowerCase() === cropName.toLowerCase());
}

// Get CSA practices by pillar
export function getCSAPracticesByPillar(pillar: string): CSAPractice[] {
  return CSA_PRACTICES.filter(practice => practice.pillar === pillar);
}

// Get weather-based decisions
export function getWeatherDecisions(weatherCondition: string): WeatherBasedDecision[] {
  return WEATHER_DECISIONS.filter(decision => 
    decision.weatherCondition.toLowerCase().includes(weatherCondition.toLowerCase())
  );
}

// Calculate CSA implementation readiness score
export function calculateCSAReadinessScore(
  farmSize: number,
  experience: string,
  resources: string,
  climateRisk: string
): number {
  let score = 0;

  // Farm size factor
  if (farmSize < 1) score += 1;
  else if (farmSize < 5) score += 2;
  else score += 3;

  // Experience factor
  if (experience === 'beginner') score += 1;
  else if (experience === 'intermediate') score += 2;
  else score += 3;

  // Resource availability
  if (resources === 'limited') score += 1;
  else if (resources === 'moderate') score += 2;
  else score += 3;

  // Climate risk urgency
  if (climateRisk === 'high') score += 3;
  else if (climateRisk === 'medium') score += 2;
  else score += 1;

  return Math.min(score, 10); // Cap at 10
}