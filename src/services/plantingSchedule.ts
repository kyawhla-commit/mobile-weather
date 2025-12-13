export interface PlantingWindow {
  start: string; // Month name
  end: string; // Month name
  optimal: boolean;
  reason: string;
}

export interface GrowthStage {
  stage: string;
  duration: string; // e.g., "2-3 weeks"
  description: string;
  icon: string;
  tips: string[];
}

export interface SeasonalTiming {
  crop: string;
  plantingWindows: PlantingWindow[];
  harvestTime: string;
  growthStages: GrowthStage[];
  climateZone: string;
  frostConsiderations: string[];
}

export interface MonthlyActivity {
  month: string;
  activities: {
    planting: string[];
    harvesting: string[];
    maintenance: string[];
  };
  weatherConsiderations: string[];
}

// Climate zones based on temperature patterns
export const CLIMATE_ZONES = {
  tropical: {
    name: 'Tropical',
    tempRange: { min: 20, max: 35 },
    description: 'Hot and humid year-round',
    growingSeason: 'Year-round',
  },
  subtropical: {
    name: 'Subtropical', 
    tempRange: { min: 15, max: 30 },
    description: 'Warm with mild winters',
    growingSeason: 'March to November',
  },
  temperate: {
    name: 'Temperate',
    tempRange: { min: 10, max: 25 },
    description: 'Four distinct seasons',
    growingSeason: 'April to October',
  },
  continental: {
    name: 'Continental',
    tempRange: { min: 5, max: 20 },
    description: 'Cold winters, warm summers',
    growingSeason: 'May to September',
  },
};

// Determine climate zone based on average temperature
export function getClimateZone(avgTemp: number): keyof typeof CLIMATE_ZONES {
  if (avgTemp >= 25) return 'tropical';
  if (avgTemp >= 20) return 'subtropical';
  if (avgTemp >= 15) return 'temperate';
  return 'continental';
}

// Planting schedules for different crops and climate zones
export const PLANTING_SCHEDULES: { [crop: string]: { [zone: string]: SeasonalTiming } } = {
  Rice: {
    tropical: {
      crop: 'Rice',
      plantingWindows: [
        { start: 'June', end: 'July', optimal: true, reason: 'Monsoon season provides adequate water' },
        { start: 'November', end: 'December', optimal: false, reason: 'Dry season planting with irrigation' },
      ],
      harvestTime: 'October-November (Kharif), March-April (Rabi)',
      growthStages: [
        { stage: 'Seedbed Preparation', duration: '1-2 weeks', description: 'Prepare nursery beds and soak seeds', icon: '🌱', tips: ['Use certified seeds', 'Treat seeds with fungicide'] },
        { stage: 'Transplanting', duration: '3-4 weeks', description: 'Move seedlings to main field', icon: '🌾', tips: ['Maintain 2-3 cm water level', 'Plant 2-3 seedlings per hill'] },
        { stage: 'Vegetative Growth', duration: '6-8 weeks', description: 'Tillering and leaf development', icon: '🌿', tips: ['Apply nitrogen fertilizer', 'Control weeds'] },
        { stage: 'Reproductive Phase', duration: '4-5 weeks', description: 'Flowering and grain formation', icon: '🌸', tips: ['Maintain water level', 'Monitor for pests'] },
        { stage: 'Maturation', duration: '3-4 weeks', description: 'Grain filling and ripening', icon: '🌾', tips: ['Reduce water gradually', 'Prepare for harvest'] },
      ],
      climateZone: 'tropical',
      frostConsiderations: ['No frost risk in tropical zones'],
    },
    temperate: {
      crop: 'Rice',
      plantingWindows: [
        { start: 'May', end: 'June', optimal: true, reason: 'Warm weather and adequate water supply' },
      ],
      harvestTime: 'September-October',
      growthStages: [
        { stage: 'Seedbed Preparation', duration: '2-3 weeks', description: 'Prepare nursery beds when soil warms', icon: '🌱', tips: ['Wait for soil temperature >15°C', 'Use cold-tolerant varieties'] },
        { stage: 'Transplanting', duration: '3-4 weeks', description: 'Move seedlings after last frost', icon: '🌾', tips: ['Ensure no frost risk', 'Maintain water temperature'] },
        { stage: 'Vegetative Growth', duration: '8-10 weeks', description: 'Slower growth in cooler climate', icon: '🌿', tips: ['Monitor temperature', 'Adjust fertilizer timing'] },
        { stage: 'Reproductive Phase', duration: '5-6 weeks', description: 'Flowering in summer heat', icon: '🌸', tips: ['Ensure adequate water', 'Watch for heat stress'] },
        { stage: 'Maturation', duration: '4-5 weeks', description: 'Harvest before first frost', icon: '🌾', tips: ['Monitor weather forecast', 'Harvest at proper moisture'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Plant after last spring frost', 'Harvest before first fall frost'],
    },
  },
  Tomato: {
    tropical: {
      crop: 'Tomato',
      plantingWindows: [
        { start: 'October', end: 'November', optimal: true, reason: 'Cool, dry season ideal for growth' },
        { start: 'January', end: 'February', optimal: false, reason: 'Second season planting' },
      ],
      harvestTime: 'December-March, April-June',
      growthStages: [
        { stage: 'Seed Starting', duration: '2-3 weeks', description: 'Start seeds in protected environment', icon: '🌱', tips: ['Use quality potting mix', 'Maintain 25-30°C temperature'] },
        { stage: 'Transplanting', duration: '1 week', description: 'Move seedlings to field', icon: '🌿', tips: ['Harden off seedlings', 'Plant in evening'] },
        { stage: 'Vegetative Growth', duration: '4-6 weeks', description: 'Establish root system and foliage', icon: '🌱', tips: ['Provide support stakes', 'Regular watering'] },
        { stage: 'Flowering', duration: '2-3 weeks', description: 'First flowers appear', icon: '🌸', tips: ['Avoid overhead watering', 'Monitor for pests'] },
        { stage: 'Fruit Development', duration: '6-8 weeks', description: 'Fruits form and ripen', icon: '🍅', tips: ['Consistent watering', 'Harvest regularly'] },
      ],
      climateZone: 'tropical',
      frostConsiderations: ['No frost risk, but avoid extreme heat periods'],
    },
    temperate: {
      crop: 'Tomato',
      plantingWindows: [
        { start: 'March', end: 'April', optimal: true, reason: 'Start indoors before last frost' },
        { start: 'May', end: 'June', optimal: true, reason: 'Direct sowing after soil warms' },
      ],
      harvestTime: 'July-October',
      growthStages: [
        { stage: 'Seed Starting', duration: '6-8 weeks', description: 'Start indoors 6-8 weeks before last frost', icon: '🌱', tips: ['Use grow lights', 'Maintain 18-24°C'] },
        { stage: 'Transplanting', duration: '1 week', description: 'Plant out after last frost', icon: '🌿', tips: ['Harden off for 1 week', 'Soil temp >16°C'] },
        { stage: 'Vegetative Growth', duration: '6-8 weeks', description: 'Rapid growth in warm weather', icon: '🌱', tips: ['Mulch around plants', 'Deep, infrequent watering'] },
        { stage: 'Flowering', duration: '3-4 weeks', description: 'Flowers appear in summer', icon: '🌸', tips: ['Hand pollinate if needed', 'Remove suckers'] },
        { stage: 'Fruit Development', duration: '8-12 weeks', description: 'Continuous harvest until frost', icon: '🍅', tips: ['Pick green tomatoes before frost', 'Support heavy branches'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Start indoors before last frost', 'Harvest all fruits before first frost'],
    },
  },
  Wheat: {
    temperate: {
      crop: 'Wheat',
      plantingWindows: [
        { start: 'September', end: 'October', optimal: true, reason: 'Winter wheat - requires cold period' },
        { start: 'March', end: 'April', optimal: false, reason: 'Spring wheat - shorter season' },
      ],
      harvestTime: 'July-August (Winter), August-September (Spring)',
      growthStages: [
        { stage: 'Seeding', duration: '1-2 weeks', description: 'Direct seeding in prepared field', icon: '🌱', tips: ['Proper seed depth 2-3 cm', 'Good seed-to-soil contact'] },
        { stage: 'Germination', duration: '1-2 weeks', description: 'Seeds sprout and emerge', icon: '🌿', tips: ['Adequate soil moisture', 'Monitor for pests'] },
        { stage: 'Tillering', duration: '4-6 weeks', description: 'Multiple shoots develop', icon: '🌾', tips: ['Apply nitrogen fertilizer', 'Control weeds'] },
        { stage: 'Stem Extension', duration: '6-8 weeks', description: 'Plants grow tall and develop heads', icon: '🌾', tips: ['Monitor for diseases', 'Apply fungicides if needed'] },
        { stage: 'Grain Filling', duration: '4-6 weeks', description: 'Grains develop and mature', icon: '🌾', tips: ['Avoid water stress', 'Prepare harvest equipment'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Winter wheat needs vernalization', 'Spring wheat planted after frost risk'],
    },
  },
  Corn: {
    temperate: {
      crop: 'Corn',
      plantingWindows: [
        { start: 'April', end: 'May', optimal: true, reason: 'Soil temperature above 10°C' },
        { start: 'June', end: 'July', optimal: false, reason: 'Late planting for shorter season varieties' },
      ],
      harvestTime: 'August-October',
      growthStages: [
        { stage: 'Planting', duration: '1 week', description: 'Direct seeding when soil warms', icon: '🌱', tips: ['Soil temperature >10°C', 'Plant 2-3 cm deep'] },
        { stage: 'Emergence', duration: '1-2 weeks', description: 'Seedlings emerge from soil', icon: '🌿', tips: ['Protect from birds', 'Monitor soil moisture'] },
        { stage: 'Vegetative Growth', duration: '8-10 weeks', description: 'Rapid growth and leaf development', icon: '🌽', tips: ['Side-dress with nitrogen', 'Control weeds early'] },
        { stage: 'Tasseling', duration: '2-3 weeks', description: 'Pollen release and silk emergence', icon: '🌾', tips: ['Ensure adequate water', 'Monitor for corn borer'] },
        { stage: 'Grain Filling', duration: '6-8 weeks', description: 'Kernels develop and mature', icon: '🌽', tips: ['Maintain soil moisture', 'Watch for harvest timing'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Plant after last spring frost', 'Harvest before first fall frost'],
    },
  },
  Onion: {
    tropical: {
      crop: 'Onion',
      plantingWindows: [
        { start: 'October', end: 'November', optimal: true, reason: 'Cool, dry season ideal for bulb development' },
        { start: 'January', end: 'February', optimal: false, reason: 'Second planting season' },
      ],
      harvestTime: 'February-April, May-July',
      growthStages: [
        { stage: 'Seed Starting', duration: '4-6 weeks', description: 'Start seeds in nursery beds', icon: '🌱', tips: ['Use well-draining soil', 'Maintain consistent moisture'] },
        { stage: 'Transplanting', duration: '1 week', description: 'Move seedlings to main field', icon: '🌿', tips: ['Plant when pencil-thick', 'Space 10-15 cm apart'] },
        { stage: 'Vegetative Growth', duration: '8-10 weeks', description: 'Leaf development and early bulbing', icon: '🧅', tips: ['Regular weeding', 'Moderate watering'] },
        { stage: 'Bulb Development', duration: '6-8 weeks', description: 'Bulb swelling and maturation', icon: '🧅', tips: ['Reduce watering', 'Stop nitrogen fertilizer'] },
        { stage: 'Maturation', duration: '2-3 weeks', description: 'Tops fall over, bulbs cure', icon: '🧅', tips: ['Stop watering', 'Harvest when tops dry'] },
      ],
      climateZone: 'tropical',
      frostConsiderations: ['No frost risk, but avoid extreme heat during bulbing'],
    },
    temperate: {
      crop: 'Onion',
      plantingWindows: [
        { start: 'March', end: 'April', optimal: true, reason: 'Spring planting for summer harvest' },
        { start: 'August', end: 'September', optimal: false, reason: 'Fall planting for overwintering varieties' },
      ],
      harvestTime: 'July-September (Spring planted), June-July (Fall planted)',
      growthStages: [
        { stage: 'Seed Starting', duration: '10-12 weeks', description: 'Start indoors in late winter', icon: '🌱', tips: ['Start 10-12 weeks before last frost', 'Keep soil moist'] },
        { stage: 'Transplanting', duration: '1 week', description: 'Plant out after soil workable', icon: '🌿', tips: ['Harden off seedlings', 'Plant in cool weather'] },
        { stage: 'Vegetative Growth', duration: '10-12 weeks', description: 'Leaf growth in cool weather', icon: '🧅', tips: ['Consistent watering', 'Side-dress with nitrogen'] },
        { stage: 'Bulb Development', duration: '8-10 weeks', description: 'Bulbing triggered by day length', icon: '🧅', tips: ['Reduce watering', 'Stop cultivating'] },
        { stage: 'Maturation', duration: '3-4 weeks', description: 'Tops fall over and cure', icon: '🧅', tips: ['Stop watering completely', 'Cure in field'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Can tolerate light frost', 'Harvest before hard freeze'],
    },
  },
  Carrot: {
    temperate: {
      crop: 'Carrot',
      plantingWindows: [
        { start: 'March', end: 'April', optimal: true, reason: 'Cool spring weather ideal for germination' },
        { start: 'July', end: 'August', optimal: true, reason: 'Fall planting for winter harvest' },
      ],
      harvestTime: 'June-July (Spring), October-December (Fall)',
      growthStages: [
        { stage: 'Direct Seeding', duration: '2-3 weeks', description: 'Sow seeds directly in prepared beds', icon: '🌱', tips: ['Sow thinly', 'Keep soil moist for germination'] },
        { stage: 'Germination', duration: '2-3 weeks', description: 'Seeds sprout slowly', icon: '🌿', tips: ['Be patient - can take 3 weeks', 'Thin seedlings when 2 inches tall'] },
        { stage: 'Vegetative Growth', duration: '8-10 weeks', description: 'Top growth and root development', icon: '🥕', tips: ['Regular watering', 'Hill soil around shoulders'] },
        { stage: 'Root Development', duration: '4-6 weeks', description: 'Carrot root swells and colors', icon: '🥕', tips: ['Consistent moisture', 'Avoid fresh manure'] },
        { stage: 'Maturation', duration: '2-3 weeks', description: 'Full size and color development', icon: '🥕', tips: ['Can leave in ground until needed', 'Mulch for winter storage'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Tolerates light frost', 'Sweetens after frost', 'Mulch for winter harvest'],
    },
  },
  Coffee: {
    tropical: {
      crop: 'Coffee',
      plantingWindows: [
        { start: 'May', end: 'July', optimal: true, reason: 'Start of rainy season ideal for establishment' },
        { start: 'October', end: 'November', optimal: false, reason: 'Post-harvest planting with irrigation' },
      ],
      harvestTime: 'October-February (main harvest), April-June (fly harvest)',
      growthStages: [
        { stage: 'Nursery', duration: '6-8 months', description: 'Seedling development in shade', icon: '🌱', tips: ['Use shade cloth 50%', 'Regular watering', 'Disease-free seedlings'] },
        { stage: 'Transplanting', duration: '1 month', description: 'Move to plantation with shade trees', icon: '☕', tips: ['Plant at start of rains', 'Maintain shade cover', 'Stake young plants'] },
        { stage: 'Establishment', duration: '18-24 months', description: 'Root development and vegetative growth', icon: '🌿', tips: ['Gradual shade reduction', 'Regular pruning', 'Weed control'] },
        { stage: 'First Flowering', duration: '6 months', description: 'Initial flower and fruit development', icon: '🌸', tips: ['Balanced fertilization', 'Pest monitoring', 'Proper spacing'] },
        { stage: 'Production', duration: 'Ongoing', description: 'Annual harvest cycles', icon: '☕', tips: ['Selective picking', 'Post-harvest pruning', 'Soil management'] },
      ],
      climateZone: 'tropical',
      frostConsiderations: ['Cannot tolerate frost', 'Requires elevation 1000-2000m', 'Shade protection essential'],
    },
    subtropical: {
      crop: 'Coffee',
      plantingWindows: [
        { start: 'March', end: 'May', optimal: true, reason: 'Spring planting before summer heat' },
      ],
      harvestTime: 'September-December',
      growthStages: [
        { stage: 'Nursery', duration: '8-10 months', description: 'Extended nursery period for cooler climate', icon: '🌱', tips: ['Protect from cold', 'Greenhouse cultivation', 'Cold-tolerant varieties'] },
        { stage: 'Transplanting', duration: '1 month', description: 'Plant after last frost risk', icon: '☕', tips: ['Wait for soil warming', 'Wind protection', 'Mulch heavily'] },
        { stage: 'Establishment', duration: '24-30 months', description: 'Slower growth in cooler conditions', icon: '🌿', tips: ['Frost protection', 'Microclimate management', 'Extended care period'] },
        { stage: 'First Flowering', duration: '8 months', description: 'Later flowering due to climate', icon: '🌸', tips: ['Monitor temperature stress', 'Adjust fertilization', 'Disease prevention'] },
        { stage: 'Production', duration: 'Ongoing', description: 'Shorter harvest season', icon: '☕', tips: ['Harvest before cold', 'Winter protection', 'Quality focus'] },
      ],
      climateZone: 'subtropical',
      frostConsiderations: ['Protect from frost', 'May need greenhouse cultivation', 'Choose cold-tolerant varieties'],
    },
  },
  Avocado: {
    tropical: {
      crop: 'Avocado',
      plantingWindows: [
        { start: 'March', end: 'May', optimal: true, reason: 'Before hot season, good root establishment' },
        { start: 'September', end: 'November', optimal: false, reason: 'Post-monsoon planting' },
      ],
      harvestTime: 'Year-round depending on variety',
      growthStages: [
        { stage: 'Grafted Sapling', duration: '6-12 months', description: 'Nursery-grown grafted plants', icon: '🌱', tips: ['Choose disease-resistant rootstock', 'Proper variety selection', 'Gradual hardening'] },
        { stage: 'Transplanting', duration: '1 month', description: 'Establish in orchard', icon: '🥑', tips: ['Dig large planting holes', 'Good drainage essential', 'Stake if needed'] },
        { stage: 'Establishment', duration: '2-3 years', description: 'Root and canopy development', icon: '🌳', tips: ['Regular watering', 'Mulch around base', 'Prune for shape'] },
        { stage: 'First Flowering', duration: '6 months', description: 'Initial flower production', icon: '🌸', tips: ['Cross-pollination important', 'Monitor for pests', 'Balanced nutrition'] },
        { stage: 'Production', duration: 'Ongoing', description: 'Annual fruit production', icon: '🥑', tips: ['Harvest at proper maturity', 'Post-harvest care', 'Alternate bearing management'] },
      ],
      climateZone: 'tropical',
      frostConsiderations: ['Sensitive to frost when young', 'Protect first 2-3 years', 'Choose appropriate varieties'],
    },
    subtropical: {
      crop: 'Avocado',
      plantingWindows: [
        { start: 'March', end: 'April', optimal: true, reason: 'Spring planting for establishment before winter' },
      ],
      harvestTime: 'February-September depending on variety',
      growthStages: [
        { stage: 'Grafted Sapling', duration: '8-12 months', description: 'Cold-hardy rootstock selection', icon: '🌱', tips: ['Choose cold-tolerant varieties', 'Container growing option', 'Frost protection ready'] },
        { stage: 'Transplanting', duration: '1 month', description: 'Plant in protected location', icon: '🥑', tips: ['South-facing slope preferred', 'Wind protection', 'Excellent drainage'] },
        { stage: 'Establishment', duration: '3-4 years', description: 'Slower growth in cooler climate', icon: '🌳', tips: ['Frost protection systems', 'Microclimate creation', 'Extended care period'] },
        { stage: 'First Flowering', duration: '8 months', description: 'Temperature-dependent flowering', icon: '🌸', tips: ['Monitor cold damage', 'Pollination assistance', 'Flower protection'] },
        { stage: 'Production', duration: 'Ongoing', description: 'Climate-limited production', icon: '🥑', tips: ['Harvest timing critical', 'Cold storage needs', 'Tree protection'] },
      ],
      climateZone: 'subtropical',
      frostConsiderations: ['Requires frost protection', 'Young trees very sensitive', 'May need heated greenhouse'],
    },
  },
  Banana: {
    tropical: {
      crop: 'Banana',
      plantingWindows: [
        { start: 'March', end: 'May', optimal: true, reason: 'Pre-monsoon planting for good establishment' },
        { start: 'September', end: 'October', optimal: false, reason: 'Post-monsoon planting' },
      ],
      harvestTime: '12-15 months after planting',
      growthStages: [
        { stage: 'Sucker Planting', duration: '1 month', description: 'Plant tissue-culture or sword suckers', icon: '🌱', tips: ['Choose healthy planting material', 'Treat with fungicide', 'Proper spacing 2x2m'] },
        { stage: 'Establishment', duration: '3-4 months', description: 'Root development and early growth', icon: '🍌', tips: ['Regular watering', 'Weed control', 'Apply organic matter'] },
        { stage: 'Vegetative Growth', duration: '6-8 months', description: 'Rapid pseudostem development', icon: '🌿', tips: ['Monthly fertilization', 'Desuckering', 'Pest monitoring'] },
        { stage: 'Flowering', duration: '2-3 months', description: 'Flower emergence and fruit setting', icon: '🌸', tips: ['Support heavy bunches', 'Remove male bud', 'Protect from wind'] },
        { stage: 'Fruit Development', duration: '3-4 months', description: 'Bunch filling and maturation', icon: '🍌', tips: ['Bunch covering', 'Harvest at 75% maturity', 'Ratoon management'] },
      ],
      climateZone: 'tropical',
      frostConsiderations: ['Cannot tolerate any frost', 'Requires year-round warmth', 'Wind protection important'],
    },
  },
  Lettuce: {
    temperate: {
      crop: 'Lettuce',
      plantingWindows: [
        { start: 'March', end: 'April', optimal: true, reason: 'Cool spring weather ideal' },
        { start: 'August', end: 'September', optimal: true, reason: 'Fall planting for winter harvest' },
      ],
      harvestTime: 'May-June (Spring), October-November (Fall)',
      growthStages: [
        { stage: 'Seed Starting', duration: '2-3 weeks', description: 'Start indoors or direct sow', icon: '🌱', tips: ['Keep soil moist', 'Cool temperatures 60-65°F', 'Thin seedlings'] },
        { stage: 'Transplanting', duration: '1 week', description: 'Move to garden beds', icon: '🥬', tips: ['Harden off seedlings', 'Plant in cool weather', 'Space 6-8 inches apart'] },
        { stage: 'Vegetative Growth', duration: '4-6 weeks', description: 'Leaf development and head formation', icon: '🥬', tips: ['Consistent watering', 'Light fertilization', 'Pest monitoring'] },
        { stage: 'Head Formation', duration: '2-3 weeks', description: 'Tight head development', icon: '🥬', tips: ['Avoid water stress', 'Harvest before bolting', 'Morning harvest best'] },
        { stage: 'Harvest', duration: '1-2 weeks', description: 'Cut at soil level', icon: '🥬', tips: ['Harvest outer leaves first', 'Cut and come again', 'Store in cool place'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Tolerates light frost', 'Protect from hard freeze', 'Row covers helpful'],
    },
    subtropical: {
      crop: 'Lettuce',
      plantingWindows: [
        { start: 'October', end: 'November', optimal: true, reason: 'Cool season crop for winter growing' },
        { start: 'January', end: 'February', optimal: false, reason: 'Late winter planting' },
      ],
      harvestTime: 'December-February, March-April',
      growthStages: [
        { stage: 'Seed Starting', duration: '2-3 weeks', description: 'Cool season establishment', icon: '🌱', tips: ['Shade during hot days', 'Consistent moisture', 'Heat-tolerant varieties'] },
        { stage: 'Transplanting', duration: '1 week', description: 'Plant in cooler months', icon: '🥬', tips: ['Evening planting', 'Mulch to keep cool', 'Adequate spacing'] },
        { stage: 'Vegetative Growth', duration: '5-7 weeks', description: 'Growth in mild temperatures', icon: '🥬', tips: ['Morning watering', 'Shade cloth if needed', 'Regular feeding'] },
        { stage: 'Head Formation', duration: '2-4 weeks', description: 'Head development in cool weather', icon: '🥬', tips: ['Avoid heat stress', 'Harvest before warm weather', 'Succession planting'] },
        { stage: 'Harvest', duration: '2-3 weeks', description: 'Extended harvest period', icon: '🥬', tips: ['Early morning harvest', 'Quick cooling', 'Multiple cuttings'] },
      ],
      climateZone: 'subtropical',
      frostConsiderations: ['Minimal frost tolerance', 'Protect from unexpected cold', 'Choose appropriate varieties'],
    },
  },
  Spinach: {
    temperate: {
      crop: 'Spinach',
      plantingWindows: [
        { start: 'March', end: 'April', optimal: true, reason: 'Cool spring conditions ideal' },
        { start: 'August', end: 'September', optimal: true, reason: 'Fall planting for extended harvest' },
      ],
      harvestTime: 'May-June (Spring), September-November (Fall)',
      growthStages: [
        { stage: 'Direct Seeding', duration: '1-2 weeks', description: 'Sow directly in garden', icon: '🌱', tips: ['Sow every 2 weeks', 'Keep soil moist', 'Cool soil preferred'] },
        { stage: 'Germination', duration: '1-2 weeks', description: 'Seeds sprout in cool weather', icon: '🌿', tips: ['Thin to 4-6 inches', 'Protect from heat', 'Consistent moisture'] },
        { stage: 'Vegetative Growth', duration: '4-6 weeks', description: 'Leaf development', icon: '🥬', tips: ['Side-dress with nitrogen', 'Harvest outer leaves', 'Prevent bolting'] },
        { stage: 'Harvest', duration: '2-4 weeks', description: 'Continuous leaf harvest', icon: '🥬', tips: ['Cut and come again', 'Harvest before flowering', 'Morning picking'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Very frost tolerant', 'Can overwinter with protection', 'Quality improves after light frost'],
    },
  },
  Pepper: {
    tropical: {
      crop: 'Pepper',
      plantingWindows: [
        { start: 'March', end: 'May', optimal: true, reason: 'Warm season crop, plant after soil warms' },
        { start: 'August', end: 'September', optimal: false, reason: 'Second season planting' },
      ],
      harvestTime: 'June-October, November-February',
      growthStages: [
        { stage: 'Seed Starting', duration: '6-8 weeks', description: 'Start seeds indoors', icon: '🌱', tips: ['Warm soil 80-85°F', 'Bottom heat helpful', 'Transplant after hardening'] },
        { stage: 'Transplanting', duration: '1 week', description: 'Move to field after warm weather', icon: '🌶️', tips: ['Soil temp >65°F', 'Protect from wind', 'Space 18-24 inches'] },
        { stage: 'Vegetative Growth', duration: '6-8 weeks', description: 'Plant establishment and growth', icon: '🌿', tips: ['Consistent watering', 'Mulch around plants', 'Support tall varieties'] },
        { stage: 'Flowering', duration: '4-6 weeks', description: 'Flower production and fruit set', icon: '🌸', tips: ['Avoid water stress', 'Monitor for pests', 'Hand pollinate if needed'] },
        { stage: 'Fruit Development', duration: '8-12 weeks', description: 'Continuous harvest period', icon: '🌶️', tips: ['Regular picking', 'Harvest at desired color', 'Keep plants productive'] },
      ],
      climateZone: 'tropical',
      frostConsiderations: ['Cannot tolerate frost', 'Warm season crop only', 'Protect from cold winds'],
    },
    temperate: {
      crop: 'Pepper',
      plantingWindows: [
        { start: 'May', end: 'June', optimal: true, reason: 'Plant after last frost when soil is warm' },
      ],
      harvestTime: 'July-October',
      growthStages: [
        { stage: 'Seed Starting', duration: '8-10 weeks', description: 'Start indoors 8-10 weeks before last frost', icon: '🌱', tips: ['Use heat mat', 'Grow lights helpful', 'Harden off gradually'] },
        { stage: 'Transplanting', duration: '1 week', description: 'Plant out after soil warms to 65°F', icon: '🌶️', tips: ['Wait for warm weather', 'Use row covers if cool', 'Stake tall varieties'] },
        { stage: 'Vegetative Growth', duration: '8-10 weeks', description: 'Slower growth in cooler climate', icon: '🌿', tips: ['Mulch for warmth', 'Protect from cool nights', 'Regular fertilization'] },
        { stage: 'Flowering', duration: '6-8 weeks', description: 'Temperature-dependent flowering', icon: '🌸', tips: ['Maintain warm conditions', 'Consistent watering', 'Monitor for diseases'] },
        { stage: 'Fruit Development', duration: '10-14 weeks', description: 'Harvest until first frost', icon: '🌶️', tips: ['Pick regularly', 'Harvest green before frost', 'Extend season with protection'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Very frost sensitive', 'Harvest all fruits before frost', 'Use season extenders'],
    },
  },
  Cucumber: {
    temperate: {
      crop: 'Cucumber',
      plantingWindows: [
        { start: 'May', end: 'June', optimal: true, reason: 'Warm soil and air temperatures needed' },
        { start: 'July', end: 'July', optimal: false, reason: 'Second planting for fall harvest' },
      ],
      harvestTime: 'July-September',
      growthStages: [
        { stage: 'Direct Seeding', duration: '1-2 weeks', description: 'Sow directly when soil is warm', icon: '🌱', tips: ['Soil temp >65°F', 'Plant in hills or rows', 'Keep soil moist'] },
        { stage: 'Germination', duration: '1 week', description: 'Quick germination in warm soil', icon: '🌿', tips: ['Thin to best plants', 'Protect from cucumber beetles', 'Provide support'] },
        { stage: 'Vine Development', duration: '4-6 weeks', description: 'Rapid vine growth and spreading', icon: '🥒', tips: ['Train on trellises', 'Regular watering', 'Mulch around plants'] },
        { stage: 'Flowering', duration: '2-3 weeks', description: 'Male flowers first, then female', icon: '🌸', tips: ['Encourage pollinators', 'Monitor for pests', 'Consistent moisture'] },
        { stage: 'Fruit Production', duration: '6-8 weeks', description: 'Continuous harvest period', icon: '🥒', tips: ['Pick daily when ready', 'Keep vines productive', 'Watch for diseases'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Very frost sensitive', 'Plant after all frost danger', 'Harvest before first fall frost'],
    },
    tropical: {
      crop: 'Cucumber',
      plantingWindows: [
        { start: 'October', end: 'November', optimal: true, reason: 'Cool season growing in hot climates' },
        { start: 'February', end: 'March', optimal: false, reason: 'Second season before hot weather' },
      ],
      harvestTime: 'December-February, April-May',
      growthStages: [
        { stage: 'Direct Seeding', duration: '1-2 weeks', description: 'Plant in cooler months', icon: '🌱', tips: ['Avoid extreme heat', 'Provide afternoon shade', 'Consistent watering'] },
        { stage: 'Germination', duration: '1 week', description: 'Good germination in moderate temps', icon: '🌿', tips: ['Protect from intense sun', 'Thin appropriately', 'Early pest control'] },
        { stage: 'Vine Development', duration: '3-5 weeks', description: 'Faster growth in warm climate', icon: '🥒', tips: ['Provide shade cloth', 'Frequent watering', 'Strong support systems'] },
        { stage: 'Flowering', duration: '2-3 weeks', description: 'Heat can affect pollination', icon: '🌸', tips: ['Morning watering', 'Encourage beneficial insects', 'Monitor heat stress'] },
        { stage: 'Fruit Production', duration: '4-6 weeks', description: 'Shorter season due to heat', icon: '🥒', tips: ['Harvest frequently', 'Early morning picking', 'Succession planting'] },
      ],
      climateZone: 'tropical',
      frostConsiderations: ['No frost risk', 'Heat is main limiting factor', 'Grow in cooler months'],
    },
  },
  Beans: {
    temperate: {
      crop: 'Beans',
      plantingWindows: [
        { start: 'May', end: 'June', optimal: true, reason: 'Warm soil needed for germination' },
        { start: 'July', end: 'July', optimal: false, reason: 'Second planting for fall harvest' },
      ],
      harvestTime: 'July-September',
      growthStages: [
        { stage: 'Direct Seeding', duration: '1-2 weeks', description: 'Sow directly in warm soil', icon: '🌱', tips: ['Soil temp >60°F', 'Inoculate with rhizobia', 'Plant 1-2 inches deep'] },
        { stage: 'Germination', duration: '1-2 weeks', description: 'Quick emergence in warm conditions', icon: '🌿', tips: ['Keep soil moist', 'Protect from birds', 'Thin if overcrowded'] },
        { stage: 'Vegetative Growth', duration: '4-6 weeks', description: 'Leaf development and flowering', icon: '🫘', tips: ['Minimal nitrogen needed', 'Support pole varieties', 'Regular watering'] },
        { stage: 'Pod Development', duration: '3-4 weeks', description: 'Flower to pod formation', icon: '🫘', tips: ['Consistent moisture', 'Avoid overhead watering', 'Monitor for pests'] },
        { stage: 'Harvest', duration: '4-6 weeks', description: 'Continuous picking period', icon: '🫘', tips: ['Pick regularly', 'Harvest young and tender', 'Keep plants productive'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Frost sensitive', 'Plant after last frost', 'Harvest before first frost'],
    },
  },
  Cabbage: {
    temperate: {
      crop: 'Cabbage',
      plantingWindows: [
        { start: 'March', end: 'April', optimal: true, reason: 'Cool weather crop for spring planting' },
        { start: 'July', end: 'August', optimal: true, reason: 'Fall planting for winter harvest' },
      ],
      harvestTime: 'June-July (Spring), October-December (Fall)',
      growthStages: [
        { stage: 'Seed Starting', duration: '4-6 weeks', description: 'Start indoors for transplanting', icon: '🌱', tips: ['Cool conditions 60-65°F', 'Strong light needed', 'Harden off gradually'] },
        { stage: 'Transplanting', duration: '1 week', description: 'Move to garden in cool weather', icon: '🥬', tips: ['Plant in cool weather', 'Space 12-18 inches', 'Firm soil around roots'] },
        { stage: 'Vegetative Growth', duration: '8-10 weeks', description: 'Leaf development before heading', icon: '🥬', tips: ['Consistent watering', 'Side-dress with nitrogen', 'Pest monitoring'] },
        { stage: 'Head Formation', duration: '4-6 weeks', description: 'Head development and sizing', icon: '🥬', tips: ['Avoid water stress', 'Reduce nitrogen', 'Monitor for splitting'] },
        { stage: 'Harvest', duration: '2-3 weeks', description: 'Cut heads when firm', icon: '🥬', tips: ['Harvest before splitting', 'Cut at soil level', 'Store in cool place'] },
      ],
      climateZone: 'temperate',
      frostConsiderations: ['Tolerates moderate frost', 'Quality improves after light frost', 'Protect from hard freeze'],
    },
  },
};

// Generate monthly planting calendar
export function generateMonthlyCalendar(climateZone: keyof typeof CLIMATE_ZONES): MonthlyActivity[] {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return months.map(month => {
    const activities: MonthlyActivity = {
      month,
      activities: { planting: [], harvesting: [], maintenance: [] },
      weatherConsiderations: []
    };

    // Check each crop's planting windows for this month
    Object.entries(PLANTING_SCHEDULES).forEach(([crop, zones]) => {
      const schedule = zones[climateZone];
      if (schedule) {
        schedule.plantingWindows.forEach(window => {
          if (isMonthInRange(month, window.start, window.end)) {
            activities.activities.planting.push(`${crop} ${window.optimal ? '(Optimal)' : '(Alternative)'}`);
          }
        });

        // Check harvest times
        if (schedule.harvestTime.toLowerCase().includes(month.toLowerCase())) {
          activities.activities.harvesting.push(crop);
        }
      }
    });

    // Add seasonal maintenance activities
    activities.activities.maintenance = getMaintenanceActivities(month, climateZone);
    activities.weatherConsiderations = getWeatherConsiderations(month, climateZone);

    return activities;
  });
}

function isMonthInRange(month: string, start: string, end: string): boolean {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthIndex = months.indexOf(month);
  const startIndex = months.indexOf(start);
  const endIndex = months.indexOf(end);
  
  if (startIndex <= endIndex) {
    return monthIndex >= startIndex && monthIndex <= endIndex;
  } else {
    // Handle year wrap-around (e.g., November to February)
    return monthIndex >= startIndex || monthIndex <= endIndex;
  }
}

function getMaintenanceActivities(month: string, climateZone: keyof typeof CLIMATE_ZONES): string[] {
  const activities: { [key: string]: string[] } = {
    January: ['Plan crop rotation', 'Order seeds', 'Maintain equipment'],
    February: ['Prepare seedbeds', 'Soil testing', 'Prune fruit trees'],
    March: ['Start seedlings indoors', 'Apply pre-emergent herbicides', 'Check irrigation systems'],
    April: ['Transplant seedlings', 'Apply fertilizers', 'Monitor for pests'],
    May: ['Mulch crops', 'Install support structures', 'Begin regular watering'],
    June: ['Weed control', 'Monitor plant health', 'Harvest early crops'],
    July: ['Deep watering', 'Pest management', 'Harvest summer crops'],
    August: ['Continue harvesting', 'Save seeds', 'Plan fall plantings'],
    September: ['Plant cover crops', 'Harvest main crops', 'Preserve produce'],
    October: ['Clean up garden', 'Compost plant debris', 'Plant garlic'],
    November: ['Protect tender plants', 'Harvest root vegetables', 'Plan next year'],
    December: ['Review growing records', 'Order catalogs', 'Maintain tools'],
  };

  return activities[month] || [];
}

function getWeatherConsiderations(month: string, climateZone: keyof typeof CLIMATE_ZONES): string[] {
  const considerations: { [key: string]: { [zone: string]: string[] } } = {
    January: {
      tropical: ['Dry season - increase irrigation', 'Cool temperatures ideal for cool-season crops'],
      temperate: ['Plan for spring planting', 'Protect plants from frost'],
    },
    February: {
      tropical: ['Continue dry season management', 'Prepare for hot season'],
      temperate: ['Late winter - prepare for spring', 'Watch for late frost'],
    },
    March: {
      tropical: ['Hot season begins', 'Increase shade and water'],
      temperate: ['Spring preparation', 'Soil may still be frozen'],
    },
    April: {
      tropical: ['Peak hot season', 'Provide maximum shade'],
      temperate: ['Spring planting begins', 'Watch for late frost'],
    },
    May: {
      tropical: ['Pre-monsoon heat', 'Prepare for rainy season'],
      temperate: ['Warm spring weather', 'Good planting conditions'],
    },
    June: {
      tropical: ['Monsoon season begins', 'Manage excess water'],
      temperate: ['Early summer', 'Establish watering routine'],
    },
    July: {
      tropical: ['Peak monsoon', 'Drainage and disease management'],
      temperate: ['Hot summer', 'Increase watering frequency'],
    },
    August: {
      tropical: ['Continued monsoon', 'Monitor for fungal diseases'],
      temperate: ['Peak summer heat', 'Provide shade for sensitive crops'],
    },
    September: {
      tropical: ['Late monsoon', 'Prepare for post-monsoon season'],
      temperate: ['Early fall', 'Harvest summer crops'],
    },
    October: {
      tropical: ['Post-monsoon', 'Ideal growing conditions return'],
      temperate: ['Fall season', 'Prepare for frost'],
    },
    November: {
      tropical: ['Cool, dry weather', 'Excellent for most crops'],
      temperate: ['Late fall', 'Harvest before frost'],
    },
    December: {
      tropical: ['Peak growing season', 'Optimal conditions'],
      temperate: ['Winter preparation', 'Protect from freezing'],
    },
  };

  return considerations[month]?.[climateZone] || [];
}

// Get planting recommendations based on current date and location
export function getCurrentPlantingRecommendations(
  currentMonth: string,
  climateZone: keyof typeof CLIMATE_ZONES
): {
  plantNow: Array<{ crop: string; reason: string; optimal: boolean }>;
  plantSoon: Array<{ crop: string; month: string; reason: string }>;
  harvestNow: string[];
} {
  const plantNow: Array<{ crop: string; reason: string; optimal: boolean }> = [];
  const plantSoon: Array<{ crop: string; month: string; reason: string }> = [];
  const harvestNow: string[] = [];

  Object.entries(PLANTING_SCHEDULES).forEach(([crop, zones]) => {
    const schedule = zones[climateZone];
    if (schedule) {
      // Check if we can plant now
      schedule.plantingWindows.forEach(window => {
        if (isMonthInRange(currentMonth, window.start, window.end)) {
          plantNow.push({
            crop,
            reason: window.reason,
            optimal: window.optimal
          });
        }
      });

      // Check harvest time
      if (schedule.harvestTime.toLowerCase().includes(currentMonth.toLowerCase())) {
        harvestNow.push(crop);
      }
    }
  });

  return { plantNow, plantSoon, harvestNow };
}