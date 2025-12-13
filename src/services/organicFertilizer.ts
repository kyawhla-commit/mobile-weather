export interface FertilizerIngredient {
  name: string;
  amount: string;
  unit: string;
  description: string;
  npkContribution?: {
    n: number;
    p: number;
    k: number;
  };
}

export interface FertilizerRecipe {
  id: string;
  name: string;
  type: 'liquid' | 'solid' | 'compost' | 'tea';
  difficulty: 'easy' | 'moderate' | 'advanced';
  preparationTime: string;
  fermentationTime?: string;
  shelfLife: string;
  npkRatio: {
    n: number;
    p: number;
    k: number;
  };
  ingredients: FertilizerIngredient[];
  instructions: string[];
  applicationMethod: string[];
  benefits: string[];
  bestFor: string[];
  seasonalUse: string[];
  weatherConsiderations: string[];
  icon: string;
  color: string;
}

export interface ApplicationSchedule {
  crop: string;
  fertilizer: string;
  schedule: {
    stage: string;
    timing: string;
    dilution: string;
    frequency: string;
    amount: string;
  }[];
}

export interface WeatherBasedRecommendation {
  condition: string;
  recommendation: string;
  fertilizers: string[];
  timing: string;
  precautions: string[];
}

// Organic Fertilizer Recipes Database
export const ORGANIC_FERTILIZERS: FertilizerRecipe[] = [
  {
    id: 'compost-tea',
    name: 'Compost Tea',
    type: 'liquid',
    difficulty: 'easy',
    preparationTime: '30 minutes',
    fermentationTime: '24-48 hours',
    shelfLife: '1 week refrigerated',
    npkRatio: { n: 2, p: 1, k: 2 },
    ingredients: [
      {
        name: 'Finished Compost',
        amount: '2',
        unit: 'cups',
        description: 'Well-aged, dark compost',
        npkContribution: { n: 1.5, p: 0.8, k: 1.5 }
      },
      {
        name: 'Water',
        amount: '1',
        unit: 'gallon',
        description: 'Non-chlorinated water preferred'
      },
      {
        name: 'Molasses',
        amount: '1',
        unit: 'tablespoon',
        description: 'Feeds beneficial microorganisms',
        npkContribution: { n: 0.5, p: 0.2, k: 0.5 }
      }
    ],
    instructions: [
      'Fill a 5-gallon bucket with non-chlorinated water',
      'Add compost to a mesh bag or old pillowcase',
      'Submerge the compost bag in water',
      'Add molasses to feed microorganisms',
      'Stir vigorously and let steep for 24-48 hours',
      'Stir occasionally during steeping',
      'Remove compost bag and squeeze out liquid',
      'Strain the tea through cheesecloth if desired',
      'Use within 1 week for best results'
    ],
    applicationMethod: [
      'Dilute 1:1 with water for foliar spray',
      'Use undiluted for soil drench',
      'Apply early morning or evening',
      'Spray leaves until dripping'
    ],
    benefits: [
      'Provides beneficial microorganisms',
      'Improves soil structure',
      'Enhances nutrient uptake',
      'Boosts plant immunity',
      'Environmentally friendly'
    ],
    bestFor: ['All vegetables', 'Flowers', 'Herbs', 'Young plants'],
    seasonalUse: ['Spring', 'Summer', 'Fall'],
    weatherConsiderations: [
      'Apply before rain for soil drench',
      'Avoid during extreme heat',
      'Best in mild, humid conditions'
    ],
    icon: '🍃',
    color: '#10B981'
  },
  {
    id: 'banana-peel-fertilizer',
    name: 'Banana Peel Fertilizer',
    type: 'liquid',
    difficulty: 'easy',
    preparationTime: '15 minutes',
    fermentationTime: '2-3 weeks',
    shelfLife: '1 month',
    npkRatio: { n: 0, p: 3, k: 42 },
    ingredients: [
      {
        name: 'Banana Peels',
        amount: '5-6',
        unit: 'pieces',
        description: 'Fresh or dried banana peels',
        npkContribution: { n: 0, p: 3, k: 42 }
      },
      {
        name: 'Water',
        amount: '1',
        unit: 'liter',
        description: 'Clean water'
      },
      {
        name: 'Brown Sugar',
        amount: '2',
        unit: 'tablespoons',
        description: 'Accelerates fermentation'
      }
    ],
    instructions: [
      'Chop banana peels into small pieces',
      'Place peels in a clean jar or container',
      'Add brown sugar to accelerate fermentation',
      'Pour water over the peels',
      'Cover with cloth and secure with rubber band',
      'Let ferment for 2-3 weeks in a cool place',
      'Stir every few days',
      'Strain the liquid when ready',
      'Store in refrigerator'
    ],
    applicationMethod: [
      'Dilute 1:10 with water',
      'Apply to soil around plants',
      'Use every 2 weeks during growing season',
      'Avoid getting on leaves'
    ],
    benefits: [
      'High in potassium for flowering',
      'Promotes root development',
      'Improves fruit quality',
      'Natural and cost-effective',
      'Reduces kitchen waste'
    ],
    bestFor: ['Tomatoes', 'Peppers', 'Flowering plants', 'Fruit trees'],
    seasonalUse: ['Spring', 'Summer'],
    weatherConsiderations: [
      'Apply during cool weather',
      'Water in after application',
      'Avoid during drought stress'
    ],
    icon: '🍌',
    color: '#F59E0B'
  },
  {
    id: 'fish-emulsion',
    name: 'Fish Emulsion',
    type: 'liquid',
    difficulty: 'moderate',
    preparationTime: '45 minutes',
    fermentationTime: '4-6 weeks',
    shelfLife: '6 months',
    npkRatio: { n: 5, p: 2, k: 2 },
    ingredients: [
      {
        name: 'Fish Scraps',
        amount: '2',
        unit: 'pounds',
        description: 'Fresh fish heads, bones, scraps',
        npkContribution: { n: 5, p: 2, k: 2 }
      },
      {
        name: 'Water',
        amount: '1',
        unit: 'gallon',
        description: 'Non-chlorinated water'
      },
      {
        name: 'Molasses',
        amount: '2',
        unit: 'tablespoons',
        description: 'Feeds beneficial bacteria'
      }
    ],
    instructions: [
      'Chop fish scraps into small pieces',
      'Place in a large container with tight lid',
      'Add water to cover fish completely',
      'Add molasses to feed bacteria',
      'Stir well and cover tightly',
      'Place in warm location (70-80°F)',
      'Stir every few days',
      'Ferment for 4-6 weeks until liquid',
      'Strain through fine mesh',
      'Store in cool, dark place'
    ],
    applicationMethod: [
      'Dilute 1:20 with water',
      'Apply to soil, not leaves',
      'Use every 3-4 weeks',
      'Water thoroughly after application'
    ],
    benefits: [
      'High nitrogen for leafy growth',
      'Contains trace minerals',
      'Improves soil microbiology',
      'Long-lasting nutrition',
      'Excellent for leafy greens'
    ],
    bestFor: ['Leafy greens', 'Corn', 'Brassicas', 'Heavy feeders'],
    seasonalUse: ['Spring', 'Early summer'],
    weatherConsiderations: [
      'Apply before rain for best absorption',
      'Avoid in hot, dry weather',
      'Best in cool, moist conditions'
    ],
    icon: '🐟',
    color: '#3B82F6'
  },
  {
    id: 'eggshell-calcium',
    name: 'Eggshell Calcium Supplement',
    type: 'solid',
    difficulty: 'easy',
    preparationTime: '20 minutes',
    shelfLife: '1 year',
    npkRatio: { n: 0, p: 0, k: 0 },
    ingredients: [
      {
        name: 'Eggshells',
        amount: '12',
        unit: 'pieces',
        description: 'Clean, dried eggshells'
      },
      {
        name: 'White Vinegar',
        amount: '1',
        unit: 'cup',
        description: 'For calcium extraction'
      }
    ],
    instructions: [
      'Rinse eggshells thoroughly',
      'Bake at 200°F for 10 minutes to sterilize',
      'Grind shells into fine powder',
      'Mix powder with vinegar in jar',
      'Let sit for 24 hours, stirring occasionally',
      'Strain liquid for immediate use',
      'Save powder for slow-release application',
      'Store both separately'
    ],
    applicationMethod: [
      'Sprinkle powder around plants',
      'Work into soil before planting',
      'Use liquid as foliar spray (diluted)',
      'Apply monthly during growing season'
    ],
    benefits: [
      'Prevents blossom end rot',
      'Strengthens cell walls',
      'Improves fruit quality',
      'Natural pest deterrent',
      'Reduces soil acidity'
    ],
    bestFor: ['Tomatoes', 'Peppers', 'Brassicas', 'Fruit trees'],
    seasonalUse: ['Spring', 'Summer', 'Fall'],
    weatherConsiderations: [
      'Apply before rain for absorption',
      'Avoid during very dry periods',
      'Best in moderate temperatures'
    ],
    icon: '🥚',
    color: '#F3F4F6'
  },
  {
    id: 'seaweed-fertilizer',
    name: 'Seaweed Liquid Fertilizer',
    type: 'liquid',
    difficulty: 'moderate',
    preparationTime: '30 minutes',
    fermentationTime: '3-4 weeks',
    shelfLife: '3 months',
    npkRatio: { n: 1, p: 0, k: 5 },
    ingredients: [
      {
        name: 'Fresh Seaweed',
        amount: '2',
        unit: 'pounds',
        description: 'Kelp or other seaweed',
        npkContribution: { n: 1, p: 0, k: 5 }
      },
      {
        name: 'Water',
        amount: '2',
        unit: 'gallons',
        description: 'Rainwater preferred'
      }
    ],
    instructions: [
      'Rinse seaweed to remove salt',
      'Chop seaweed into small pieces',
      'Place in large container',
      'Cover with water completely',
      'Weigh down with stone to keep submerged',
      'Cover container loosely',
      'Ferment for 3-4 weeks',
      'Stir weekly during fermentation',
      'Strain liquid when ready',
      'Compost remaining solids'
    ],
    applicationMethod: [
      'Dilute 1:10 with water',
      'Apply as foliar spray or soil drench',
      'Use every 2-3 weeks',
      'Apply in early morning or evening'
    ],
    benefits: [
      'Rich in trace minerals',
      'Improves stress tolerance',
      'Enhances root development',
      'Boosts plant immunity',
      'Promotes flowering'
    ],
    bestFor: ['All vegetables', 'Fruit trees', 'Stressed plants', 'Seedlings'],
    seasonalUse: ['Spring', 'Summer', 'Fall'],
    weatherConsiderations: [
      'Excellent during stress periods',
      'Apply before heat waves',
      'Helps plants recover from storms'
    ],
    icon: '🌊',
    color: '#06B6D4'
  },
  {
    id: 'coffee-grounds-compost',
    name: 'Coffee Grounds Fertilizer',
    type: 'solid',
    difficulty: 'easy',
    preparationTime: '10 minutes',
    shelfLife: '6 months',
    npkRatio: { n: 2, p: 0.3, k: 0.3 },
    ingredients: [
      {
        name: 'Used Coffee Grounds',
        amount: '2',
        unit: 'cups',
        description: 'Fresh or dried grounds',
        npkContribution: { n: 2, p: 0.3, k: 0.3 }
      },
      {
        name: 'Brown Materials',
        amount: '4',
        unit: 'cups',
        description: 'Dried leaves, paper, cardboard'
      }
    ],
    instructions: [
      'Collect used coffee grounds',
      'Mix with brown materials 1:2 ratio',
      'Add to compost pile or bin',
      'Turn mixture weekly',
      'Keep moist but not soggy',
      'Compost for 3-6 months',
      'Use when dark and crumbly',
      'Can also use fresh grounds directly'
    ],
    applicationMethod: [
      'Mix into soil before planting',
      'Use as mulch around plants',
      'Add to compost pile',
      'Sprinkle around acid-loving plants'
    ],
    benefits: [
      'Adds organic matter',
      'Improves soil drainage',
      'Attracts earthworms',
      'Provides slow-release nitrogen',
      'Repels some pests'
    ],
    bestFor: ['Blueberries', 'Azaleas', 'Tomatoes', 'Carrots'],
    seasonalUse: ['Spring', 'Fall'],
    weatherConsiderations: [
      'Apply before rainy season',
      'Avoid in very dry conditions',
      'Best mixed with other materials'
    ],
    icon: '☕',
    color: '#92400E'
  },
  {
    id: 'nettle-fertilizer',
    name: 'Nettle Liquid Fertilizer',
    type: 'liquid',
    difficulty: 'moderate',
    preparationTime: '45 minutes',
    fermentationTime: '2-3 weeks',
    shelfLife: '2 months',
    npkRatio: { n: 4, p: 0.7, k: 3.4 },
    ingredients: [
      {
        name: 'Fresh Nettle Leaves',
        amount: '1',
        unit: 'pound',
        description: 'Young nettle plants',
        npkContribution: { n: 4, p: 0.7, k: 3.4 }
      },
      {
        name: 'Water',
        amount: '2',
        unit: 'gallons',
        description: 'Rainwater preferred'
      }
    ],
    instructions: [
      'Wear gloves when handling nettles',
      'Chop nettles coarsely',
      'Place in large container',
      'Cover with water completely',
      'Weigh down with stone',
      'Cover loosely to allow gas escape',
      'Ferment for 2-3 weeks',
      'Stir every few days',
      'Strain when fermentation stops',
      'Store in cool place'
    ],
    applicationMethod: [
      'Dilute 1:20 with water',
      'Apply to soil around plants',
      'Use every 2 weeks during growth',
      'Avoid contact with leaves'
    ],
    benefits: [
      'High nitrogen content',
      'Stimulates growth',
      'Improves chlorophyll production',
      'Natural pest deterrent',
      'Strengthens plant immunity'
    ],
    bestFor: ['Leafy greens', 'Brassicas', 'Heavy feeders', 'Young plants'],
    seasonalUse: ['Spring', 'Early summer'],
    weatherConsiderations: [
      'Apply during cool weather',
      'Water in thoroughly',
      'Avoid during plant stress'
    ],
    icon: '🌿',
    color: '#059669'
  },
  {
    id: 'wood-ash-fertilizer',
    name: 'Wood Ash Fertilizer',
    type: 'solid',
    difficulty: 'easy',
    preparationTime: '5 minutes',
    shelfLife: '2 years',
    npkRatio: { n: 0, p: 1.5, k: 7 },
    ingredients: [
      {
        name: 'Hardwood Ash',
        amount: '1',
        unit: 'cup',
        description: 'From untreated hardwood only',
        npkContribution: { n: 0, p: 1.5, k: 7 }
      }
    ],
    instructions: [
      'Use only ash from untreated hardwood',
      'Ensure ash is completely cool',
      'Sift to remove large pieces',
      'Store in dry container with lid',
      'Test soil pH before application',
      'Apply sparingly - less is more',
      'Work into soil gently',
      'Water in after application'
    ],
    applicationMethod: [
      'Sprinkle lightly around plants',
      'Work into soil surface',
      'Apply maximum 10 lbs per 1000 sq ft per year',
      'Test soil pH regularly'
    ],
    benefits: [
      'High potassium for flowering',
      'Contains calcium and trace minerals',
      'Raises soil pH',
      'Improves fruit quality',
      'Deters soft-bodied pests'
    ],
    bestFor: ['Fruit trees', 'Root vegetables', 'Flowering plants'],
    seasonalUse: ['Fall', 'Early spring'],
    weatherConsiderations: [
      'Apply before rain for incorporation',
      'Avoid during windy conditions',
      'Best in calm, moist weather'
    ],
    icon: '🔥',
    color: '#6B7280'
  },
  {
    id: 'cow-urine-fertilizer',
    name: 'Cow Urine Fertilizer (Jeevamrut)',
    type: 'liquid',
    difficulty: 'easy',
    preparationTime: '30 minutes',
    fermentationTime: '7-10 days',
    shelfLife: '1 month',
    npkRatio: { n: 1, p: 0.5, k: 1.7 },
    ingredients: [
      {
        name: 'Fresh Cow Urine',
        amount: '10',
        unit: 'liters',
        description: 'Fresh, uncontaminated cow urine',
        npkContribution: { n: 1, p: 0.5, k: 1.7 }
      },
      {
        name: 'Cow Dung',
        amount: '10',
        unit: 'kg',
        description: 'Fresh cow dung',
        npkContribution: { n: 0.3, p: 0.2, k: 0.1 }
      },
      {
        name: 'Jaggery (Gur)',
        amount: '2',
        unit: 'kg',
        description: 'Unrefined cane sugar',
      },
      {
        name: 'Gram Flour (Besan)',
        amount: '2',
        unit: 'kg',
        description: 'Chickpea flour for protein'
      },
      {
        name: 'Soil',
        amount: '1',
        unit: 'handful',
        description: 'Living soil with microorganisms'
      },
      {
        name: 'Water',
        amount: '200',
        unit: 'liters',
        description: 'Clean water for dilution'
      }
    ],
    instructions: [
      'Mix cow urine and cow dung in a large container',
      'Add jaggery and gram flour to the mixture',
      'Add a handful of living soil for microorganisms',
      'Stir the mixture thoroughly',
      'Cover with cloth and let ferment for 7-10 days',
      'Stir daily during fermentation',
      'Strain the liquid after fermentation',
      'Dilute with water before application',
      'Store in cool, shaded place'
    ],
    applicationMethod: [
      'Dilute 1:10 with water for soil application',
      'Apply to soil around plants, not on leaves',
      'Use every 15 days during growing season',
      'Apply early morning or evening'
    ],
    benefits: [
      'Rich in growth hormones',
      'Improves soil microbiology',
      'Enhances plant immunity',
      'Natural pest deterrent',
      'Increases soil fertility',
      'Promotes root development'
    ],
    bestFor: ['All vegetables', 'Fruit trees', 'Cereals', 'Cash crops'],
    seasonalUse: ['Spring', 'Summer', 'Monsoon'],
    weatherConsiderations: [
      'Apply during cool weather',
      'Avoid during extreme heat',
      'Best before light rain'
    ],
    icon: '🐄',
    color: '#8B4513'
  },
  {
    id: 'neem-oil-spray',
    name: 'Neem Oil Disease Control',
    type: 'liquid',
    difficulty: 'easy',
    preparationTime: '15 minutes',
    shelfLife: '2 weeks',
    npkRatio: { n: 0, p: 0, k: 0 },
    ingredients: [
      {
        name: 'Neem Oil',
        amount: '2',
        unit: 'tablespoons',
        description: 'Pure cold-pressed neem oil'
      },
      {
        name: 'Liquid Soap',
        amount: '1',
        unit: 'teaspoon',
        description: 'Mild liquid soap as emulsifier'
      },
      {
        name: 'Water',
        amount: '1',
        unit: 'liter',
        description: 'Lukewarm water'
      }
    ],
    instructions: [
      'Mix neem oil with liquid soap first',
      'Add lukewarm water gradually while stirring',
      'Stir vigorously to create emulsion',
      'Let mixture sit for 10 minutes',
      'Stir again before use',
      'Use immediately after preparation',
      'Shake well before each application'
    ],
    applicationMethod: [
      'Spray on all plant surfaces',
      'Apply early morning or late evening',
      'Ensure complete coverage of leaves',
      'Repeat every 7-10 days as needed'
    ],
    benefits: [
      'Controls fungal diseases',
      'Repels insects and pests',
      'Safe for beneficial insects',
      'Systemic protection',
      'Boosts plant immunity',
      'Organic and biodegradable'
    ],
    bestFor: ['Vegetables', 'Fruit trees', 'Ornamental plants', 'Herbs'],
    seasonalUse: ['Spring', 'Summer', 'Monsoon'],
    weatherConsiderations: [
      'Avoid spraying in direct sunlight',
      'Do not apply before rain',
      'Best in cool, humid conditions'
    ],
    icon: '🌿',
    color: '#22C55E'
  },
  {
    id: 'turmeric-ginger-paste',
    name: 'Turmeric-Ginger Disease Paste',
    type: 'solid',
    difficulty: 'easy',
    preparationTime: '20 minutes',
    shelfLife: '1 week refrigerated',
    npkRatio: { n: 0, p: 0, k: 0 },
    ingredients: [
      {
        name: 'Fresh Turmeric',
        amount: '100',
        unit: 'grams',
        description: 'Fresh turmeric rhizome'
      },
      {
        name: 'Fresh Ginger',
        amount: '100',
        unit: 'grams',
        description: 'Fresh ginger rhizome'
      },
      {
        name: 'Garlic',
        amount: '50',
        unit: 'grams',
        description: 'Fresh garlic cloves'
      },
      {
        name: 'Water',
        amount: '500',
        unit: 'ml',
        description: 'Clean water for dilution'
      }
    ],
    instructions: [
      'Wash and clean turmeric, ginger, and garlic',
      'Grind all ingredients into fine paste',
      'Add small amount of water while grinding',
      'Strain the paste to get liquid extract',
      'Dilute the extract with remaining water',
      'Store in refrigerator if not using immediately',
      'Shake well before each use'
    ],
    applicationMethod: [
      'Dilute 1:5 with water before spraying',
      'Apply to affected plant parts',
      'Use as preventive spray weekly',
      'Apply during cool hours'
    ],
    benefits: [
      'Natural antifungal properties',
      'Antibacterial action',
      'Boosts plant immunity',
      'Repels soft-bodied insects',
      'Safe for humans and animals',
      'Easily available ingredients'
    ],
    bestFor: ['Tomatoes', 'Peppers', 'Cucumbers', 'Leafy greens'],
    seasonalUse: ['Monsoon', 'Summer'],
    weatherConsiderations: [
      'Very effective during humid conditions',
      'Apply before disease outbreaks',
      'Reapply after rain'
    ],
    icon: '🧄',
    color: '#F59E0B'
  },
  {
    id: 'buttermilk-spray',
    name: 'Buttermilk Antifungal Spray',
    type: 'liquid',
    difficulty: 'easy',
    preparationTime: '10 minutes',
    shelfLife: '3 days',
    npkRatio: { n: 0.1, p: 0.1, k: 0.1 },
    ingredients: [
      {
        name: 'Fresh Buttermilk',
        amount: '1',
        unit: 'cup',
        description: 'Fresh, unsalted buttermilk'
      },
      {
        name: 'Water',
        amount: '4',
        unit: 'cups',
        description: 'Clean water'
      },
      {
        name: 'Baking Soda',
        amount: '1',
        unit: 'teaspoon',
        description: 'Food-grade baking soda'
      }
    ],
    instructions: [
      'Mix buttermilk with water in spray bottle',
      'Add baking soda and shake well',
      'Let mixture sit for 5 minutes',
      'Shake again before use',
      'Use fresh mixture each time',
      'Do not store for more than 3 days'
    ],
    applicationMethod: [
      'Spray on affected leaves and stems',
      'Apply early morning or evening',
      'Ensure good coverage of plant surfaces',
      'Repeat every 3-4 days during disease season'
    ],
    benefits: [
      'Controls powdery mildew',
      'Prevents fungal diseases',
      'Provides beneficial bacteria',
      'Safe and non-toxic',
      'Improves plant health',
      'Cost-effective solution'
    ],
    bestFor: ['Cucumbers', 'Squash', 'Roses', 'Grapes'],
    seasonalUse: ['Summer', 'Monsoon'],
    weatherConsiderations: [
      'Most effective in humid conditions',
      'Apply when dew is present',
      'Avoid during very hot weather'
    ],
    icon: '🥛',
    color: '#E5E7EB'
  },
  {
    id: 'onion-garlic-spray',
    name: 'Onion-Garlic Pest Repellent',
    type: 'liquid',
    difficulty: 'easy',
    preparationTime: '30 minutes',
    fermentationTime: '24 hours',
    shelfLife: '1 week',
    npkRatio: { n: 0, p: 0, k: 0 },
    ingredients: [
      {
        name: 'Onions',
        amount: '2',
        unit: 'medium',
        description: 'Fresh onions'
      },
      {
        name: 'Garlic',
        amount: '1',
        unit: 'bulb',
        description: 'Fresh garlic bulb'
      },
      {
        name: 'Hot Peppers',
        amount: '2-3',
        unit: 'pieces',
        description: 'Fresh chili peppers'
      },
      {
        name: 'Water',
        amount: '1',
        unit: 'liter',
        description: 'Clean water'
      },
      {
        name: 'Liquid Soap',
        amount: '1',
        unit: 'teaspoon',
        description: 'Mild liquid soap'
      }
    ],
    instructions: [
      'Chop onions, garlic, and peppers finely',
      'Boil water and add chopped ingredients',
      'Simmer for 15 minutes',
      'Let cool and steep for 24 hours',
      'Strain the liquid',
      'Add liquid soap and mix well',
      'Store in cool place'
    ],
    applicationMethod: [
      'Dilute 1:3 with water before spraying',
      'Spray on plants every 7-10 days',
      'Apply during cool hours',
      'Focus on undersides of leaves'
    ],
    benefits: [
      'Repels aphids and soft insects',
      'Natural pest deterrent',
      'Antifungal properties',
      'Safe for beneficial insects',
      'Easily available ingredients',
      'Cost-effective pest control'
    ],
    bestFor: ['Vegetables', 'Herbs', 'Ornamental plants', 'Fruit trees'],
    seasonalUse: ['Spring', 'Summer', 'Monsoon'],
    weatherConsiderations: [
      'Apply during pest active periods',
      'Reapply after rain',
      'Most effective in warm weather'
    ],
    icon: '🧅',
    color: '#DC2626'
  },
  {
    id: 'rice-water-fertilizer',
    name: 'Rice Water Fertilizer',
    type: 'liquid',
    difficulty: 'easy',
    preparationTime: '5 minutes',
    fermentationTime: '3-5 days',
    shelfLife: '1 week',
    npkRatio: { n: 0.2, p: 0.1, k: 0.3 },
    ingredients: [
      {
        name: 'Rice Washing Water',
        amount: '2',
        unit: 'liters',
        description: 'Water used to wash rice',
        npkContribution: { n: 0.2, p: 0.1, k: 0.3 }
      },
      {
        name: 'Brown Sugar',
        amount: '2',
        unit: 'tablespoons',
        description: 'To accelerate fermentation'
      }
    ],
    instructions: [
      'Collect water from washing rice',
      'Add brown sugar to the rice water',
      'Stir well to dissolve sugar',
      'Cover container with cloth',
      'Let ferment for 3-5 days',
      'Stir daily during fermentation',
      'Use when slightly sour smell develops'
    ],
    applicationMethod: [
      'Dilute 1:5 with clean water',
      'Apply to soil around plants',
      'Use every 2 weeks during growing season',
      'Water plants after application'
    ],
    benefits: [
      'Rich in vitamins and minerals',
      'Promotes beneficial bacteria',
      'Improves soil structure',
      'Enhances plant growth',
      'Zero waste solution',
      'Readily available'
    ],
    bestFor: ['Rice plants', 'Vegetables', 'Herbs', 'Houseplants'],
    seasonalUse: ['Spring', 'Summer', 'Monsoon'],
    weatherConsiderations: [
      'Apply during moderate temperatures',
      'Best before light watering',
      'Avoid during extreme heat'
    ],
    icon: '🍚',
    color: '#F3F4F6'
  },
  {
    id: 'ash-lime-spray',
    name: 'Ash-Lime Disease Control',
    type: 'liquid',
    difficulty: 'easy',
    preparationTime: '20 minutes',
    shelfLife: '1 week',
    npkRatio: { n: 0, p: 1, k: 5 },
    ingredients: [
      {
        name: 'Wood Ash',
        amount: '2',
        unit: 'cups',
        description: 'Clean hardwood ash',
        npkContribution: { n: 0, p: 1, k: 5 }
      },
      {
        name: 'Lime (Chuna)',
        amount: '1',
        unit: 'tablespoon',
        description: 'Hydrated lime or slaked lime'
      },
      {
        name: 'Water',
        amount: '4',
        unit: 'liters',
        description: 'Clean water'
      }
    ],
    instructions: [
      'Mix wood ash with water in large container',
      'Add lime and stir thoroughly',
      'Let mixture settle for 2 hours',
      'Stir occasionally during settling',
      'Strain the clear liquid',
      'Store in covered container',
      'Shake well before each use'
    ],
    applicationMethod: [
      'Spray on plant stems and soil',
      'Apply as preventive measure',
      'Use every 15 days during disease season',
      'Avoid spraying on leaves directly'
    ],
    benefits: [
      'Controls soil-borne diseases',
      'Adjusts soil pH',
      'Provides potassium nutrition',
      'Deters crawling insects',
      'Improves soil structure',
      'Natural and alkaline'
    ],
    bestFor: ['Tomatoes', 'Potatoes', 'Brassicas', 'Root vegetables'],
    seasonalUse: ['Monsoon', 'Post-monsoon'],
    weatherConsiderations: [
      'Very effective during wet season',
      'Apply before disease outbreaks',
      'Helps in waterlogged conditions'
    ],
    icon: '🔥',
    color: '#9CA3AF'
  },
  {
    id: 'fermented-fruit-waste',
    name: 'Fermented Fruit Waste Fertilizer',
    type: 'liquid',
    difficulty: 'moderate',
    preparationTime: '45 minutes',
    fermentationTime: '2-3 weeks',
    shelfLife: '2 months',
    npkRatio: { n: 1.5, p: 0.8, k: 2.5 },
    ingredients: [
      {
        name: 'Fruit Peels and Scraps',
        amount: '2',
        unit: 'kg',
        description: 'Mixed fruit waste (banana, orange, apple)',
        npkContribution: { n: 1.5, p: 0.8, k: 2.5 }
      },
      {
        name: 'Brown Sugar/Jaggery',
        amount: '200',
        unit: 'grams',
        description: 'To accelerate fermentation'
      },
      {
        name: 'Water',
        amount: '3',
        unit: 'liters',
        description: 'Non-chlorinated water'
      }
    ],
    instructions: [
      'Chop fruit waste into small pieces',
      'Layer fruit waste and sugar in container',
      'Add water to cover completely',
      'Cover with cloth, secure with rubber band',
      'Ferment for 2-3 weeks in cool place',
      'Stir every 3-4 days',
      'Strain liquid when fermentation complete',
      'Compost remaining solids'
    ],
    applicationMethod: [
      'Dilute 1:20 with water',
      'Apply to soil around plants',
      'Use every 2-3 weeks',
      'Water thoroughly after application'
    ],
    benefits: [
      'Rich in natural sugars and minerals',
      'Promotes beneficial microorganisms',
      'Improves fruit quality',
      'Reduces kitchen waste',
      'Enhances soil fertility',
      'Natural growth promoter'
    ],
    bestFor: ['Fruit trees', 'Flowering plants', 'Vegetables', 'Herbs'],
    seasonalUse: ['Spring', 'Summer'],
    weatherConsiderations: [
      'Apply during active growing season',
      'Best in warm, humid conditions',
      'Avoid during plant dormancy'
    ],
    icon: '🍎',
    color: '#EF4444'
  },
  {
    id: 'bokashi-fertilizer',
    name: 'Bokashi Fermented Fertilizer',
    type: 'compost',
    difficulty: 'moderate',
    preparationTime: '1 hour',
    fermentationTime: '2-4 weeks',
    shelfLife: '6 months',
    npkRatio: { n: 2.5, p: 1.8, k: 2.2 },
    ingredients: [
      {
        name: 'Kitchen Scraps',
        amount: '5',
        unit: 'kg',
        description: 'Vegetable peels, fruit scraps, cooked food',
        npkContribution: { n: 1.5, p: 1.0, k: 1.5 }
      },
      {
        name: 'Bokashi Bran (EM Bran)',
        amount: '500',
        unit: 'grams',
        description: 'Wheat bran inoculated with EM microorganisms',
        npkContribution: { n: 1.0, p: 0.8, k: 0.7 }
      },
      {
        name: 'Molasses',
        amount: '100',
        unit: 'ml',
        description: 'Blackstrap molasses for microorganism food'
      },
      {
        name: 'EM Solution (Mother Culture)',
        amount: '50',
        unit: 'ml',
        description: 'Effective Microorganisms concentrate'
      },
      {
        name: 'Water',
        amount: '200',
        unit: 'ml',
        description: 'Non-chlorinated water'
      }
    ],
    instructions: [
      'Chop kitchen scraps into small pieces (2-3 cm)',
      'Mix molasses and EM solution with water',
      'Layer kitchen scraps in airtight container',
      'Sprinkle bokashi bran over each layer',
      'Spray EM-molasses solution over each layer',
      'Press down firmly to remove air bubbles',
      'Seal container tightly to create anaerobic conditions',
      'Ferment for 2-4 weeks at room temperature',
      'Drain liquid (bokashi tea) weekly',
      'Ready when sweet-sour smell develops',
      'Bury fermented matter in soil for 2 weeks before planting'
    ],
    applicationMethod: [
      'Bury fermented bokashi 20cm deep in soil',
      'Wait 2 weeks before planting in that area',
      'Use bokashi tea diluted 1:100 for watering',
      'Apply bokashi tea weekly during growing season',
      'Mix finished bokashi into compost pile'
    ],
    benefits: [
      'Accelerates decomposition process',
      'Preserves nutrients during fermentation',
      'Improves soil microbiology dramatically',
      'Reduces methane emissions',
      'Processes all organic waste including meat',
      'Creates beneficial microorganism colonies',
      'Improves soil structure and water retention',
      'Suppresses soil-borne diseases'
    ],
    bestFor: ['All vegetables', 'Fruit trees', 'Herbs', 'Ornamental plants'],
    seasonalUse: ['Spring', 'Summer', 'Fall', 'Winter'],
    weatherConsiderations: [
      'Fermentation works in all weather',
      'Apply to soil during moderate temperatures',
      'Bokashi tea excellent during dry periods',
      'Bury fermented matter before rainy season'
    ],
    icon: '🥬',
    color: '#16A34A'
  },
  {
    id: 'bokashi-animal-manure',
    name: 'Bokashi with Animal Manure',
    type: 'compost',
    difficulty: 'moderate',
    preparationTime: '1.5 hours',
    fermentationTime: '3-5 weeks',
    shelfLife: '8 months',
    npkRatio: { n: 3.5, p: 2.5, k: 2.8 },
    ingredients: [
      {
        name: 'Fresh Animal Manure',
        amount: '10',
        unit: 'kg',
        description: 'Fresh cow, buffalo, or pig manure',
        npkContribution: { n: 1.5, p: 1.0, k: 1.2 }
      },
      {
        name: 'Kitchen Scraps',
        amount: '5',
        unit: 'kg',
        description: 'Vegetable peels, fruit scraps, food waste',
        npkContribution: { n: 1.0, p: 0.8, k: 1.0 }
      },
      {
        name: 'Bokashi Bran (EM Bran)',
        amount: '1',
        unit: 'kg',
        description: 'Wheat bran inoculated with EM microorganisms',
        npkContribution: { n: 1.0, p: 0.7, k: 0.6 }
      },
      {
        name: 'Rice Bran',
        amount: '2',
        unit: 'kg',
        description: 'Fresh rice bran for carbon source'
      },
      {
        name: 'Molasses',
        amount: '200',
        unit: 'ml',
        description: 'Blackstrap molasses for microorganism activation'
      },
      {
        name: 'EM Solution (Mother Culture)',
        amount: '100',
        unit: 'ml',
        description: 'Effective Microorganisms concentrate'
      },
      {
        name: 'Water',
        amount: '500',
        unit: 'ml',
        description: 'Non-chlorinated water for mixing'
      },
      {
        name: 'Lime Powder',
        amount: '200',
        unit: 'grams',
        description: 'Agricultural lime to balance pH'
      }
    ],
    instructions: [
      'Mix molasses and EM solution with water in separate container',
      'Layer fresh animal manure in airtight container or pit',
      'Add chopped kitchen scraps over manure layer',
      'Sprinkle bokashi bran and rice bran over each layer',
      'Spray EM-molasses solution evenly over each layer',
      'Add small amount of lime powder to balance pH',
      'Press down firmly to remove air pockets',
      'Repeat layering process until container is full',
      'Cover tightly to create anaerobic conditions',
      'Place weight on top to compress materials',
      'Ferment for 3-5 weeks at ambient temperature',
      'Drain bokashi liquid weekly for use as fertilizer',
      'Check for sweet-sour fermentation smell',
      'Ready when materials are well-fermented and pH is 3.5-4.0'
    ],
    applicationMethod: [
      'Bury fermented bokashi 30cm deep in soil',
      'Wait 3-4 weeks before planting in treated area',
      'Use bokashi liquid diluted 1:200 for watering',
      'Apply bokashi liquid weekly during growing season',
      'Mix finished bokashi into compost pile for further decomposition',
      'Use as base layer in raised beds'
    ],
    benefits: [
      'Higher nutrient content than regular bokashi',
      'Excellent source of nitrogen from animal manure',
      'Improves soil microbiology dramatically',
      'Accelerates decomposition of organic matter',
      'Reduces odor from fresh manure',
      'Creates beneficial microorganism colonies',
      'Improves soil structure and water retention',
      'Suppresses soil-borne diseases and pests',
      'Provides slow-release nutrients for 6-8 months',
      'Reduces methane emissions from manure'
    ],
    bestFor: ['Heavy feeding crops', 'Fruit trees', 'Root vegetables', 'Leafy greens', 'Cereals'],
    seasonalUse: ['Spring', 'Summer', 'Fall', 'Winter'],
    weatherConsiderations: [
      'Fermentation works in all weather conditions',
      'Apply to soil during moderate temperatures',
      'Bokashi liquid excellent during dry periods',
      'Bury fermented matter before heavy rains',
      'Cover fermentation container during monsoon'
    ],
    icon: '🐄',
    color: '#8B4513'
  },
  {
    id: 'em-cow-urine-fertilizer',
    name: 'EM Enhanced Cow Urine Fertilizer',
    type: 'liquid',
    difficulty: 'moderate',
    preparationTime: '45 minutes',
    fermentationTime: '10-14 days',
    shelfLife: '2 months',
    npkRatio: { n: 1.8, p: 0.7, k: 2.1 },
    ingredients: [
      {
        name: 'Fresh Cow Urine',
        amount: '10',
        unit: 'liters',
        description: 'Fresh, clean cow urine',
        npkContribution: { n: 1.0, p: 0.5, k: 1.7 }
      },
      {
        name: 'Cow Dung',
        amount: '5',
        unit: 'kg',
        description: 'Fresh cow dung',
        npkContribution: { n: 0.3, p: 0.2, k: 0.1 }
      },
      {
        name: 'EM Solution (Mother Culture)',
        amount: '100',
        unit: 'ml',
        description: 'Effective Microorganisms concentrate'
      },
      {
        name: 'Jaggery (Gur)',
        amount: '1',
        unit: 'kg',
        description: 'Unrefined cane sugar for EM activation',
        npkContribution: { n: 0.5, p: 0, k: 0.3 }
      },
      {
        name: 'Gram Flour (Besan)',
        amount: '1',
        unit: 'kg',
        description: 'Chickpea flour for protein and amino acids'
      },
      {
        name: 'Neem Leaves',
        amount: '500',
        unit: 'grams',
        description: 'Fresh neem leaves for pest control'
      },
      {
        name: 'Turmeric Powder',
        amount: '50',
        unit: 'grams',
        description: 'Natural antifungal agent'
      },
      {
        name: 'Living Soil',
        amount: '2',
        unit: 'handfuls',
        description: 'Soil rich in indigenous microorganisms'
      },
      {
        name: 'Water',
        amount: '100',
        unit: 'liters',
        description: 'Non-chlorinated water for dilution'
      }
    ],
    instructions: [
      'Mix cow urine and cow dung in large container',
      'Dissolve jaggery in warm water and add to mixture',
      'Add gram flour and mix thoroughly',
      'Grind neem leaves and add to mixture',
      'Add turmeric powder and living soil',
      'Add EM solution and mix well',
      'Cover with cloth and ferment for 10-14 days',
      'Stir daily during fermentation',
      'Mixture ready when sweet-sour smell develops',
      'Strain liquid and store in cool place',
      'Dilute with water before application'
    ],
    applicationMethod: [
      'Dilute 1:20 with water for soil application',
      'Apply to soil around plants, avoid leaves',
      'Use every 10-15 days during growing season',
      'Apply early morning or late evening',
      'Water plants lightly after application'
    ],
    benefits: [
      'Introduces beneficial microorganisms',
      'Enhances soil biological activity',
      'Improves nutrient availability',
      'Strengthens plant immune system',
      'Natural pest and disease control',
      'Promotes root development',
      'Increases crop yield and quality',
      'Improves soil structure and fertility',
      'Reduces need for chemical inputs'
    ],
    bestFor: ['All vegetables', 'Cereals', 'Fruit trees', 'Cash crops', 'Organic farming'],
    seasonalUse: ['Spring', 'Summer', 'Monsoon', 'Post-monsoon'],
    weatherConsiderations: [
      'Apply during cool weather for best results',
      'Excellent during monsoon season',
      'Avoid application during extreme heat',
      'Most effective in humid conditions',
      'Apply before light rain for better absorption'
    ],
    icon: '🦠',
    color: '#7C3AED'
  },
  {
    id: 'em-activated-solution',
    name: 'EM Activated Solution (EM-1)',
    type: 'liquid',
    difficulty: 'easy',
    preparationTime: '20 minutes',
    fermentationTime: '7-10 days',
    shelfLife: '1 month',
    npkRatio: { n: 0.1, p: 0.1, k: 0.2 },
    ingredients: [
      {
        name: 'EM Mother Culture',
        amount: '100',
        unit: 'ml',
        description: 'Original EM concentrate'
      },
      {
        name: 'Molasses',
        amount: '100',
        unit: 'ml',
        description: 'Blackstrap molasses for microorganism food'
      },
      {
        name: 'Water',
        amount: '10',
        unit: 'liters',
        description: 'Non-chlorinated, pH neutral water'
      }
    ],
    instructions: [
      'Use non-chlorinated water at room temperature',
      'Mix molasses with small amount of warm water',
      'Add EM mother culture to molasses solution',
      'Add remaining water and mix gently',
      'Pour into clean plastic container',
      'Leave some air space in container',
      'Cover loosely to allow gas escape',
      'Ferment at 35-40°C for 7-10 days',
      'Ready when pH drops to 3.5-4.0',
      'Sweet-sour smell indicates completion',
      'Store in cool place after activation'
    ],
    applicationMethod: [
      'Dilute 1:1000 for soil application',
      'Dilute 1:500 for compost activation',
      'Spray on compost pile weekly',
      'Add to irrigation water monthly',
      'Use for seed treatment before sowing'
    ],
    benefits: [
      'Introduces diverse beneficial microorganisms',
      'Improves soil biological activity',
      'Accelerates organic matter decomposition',
      'Suppresses harmful pathogens',
      'Improves nutrient cycling',
      'Enhances plant growth and health',
      'Reduces soil compaction',
      'Improves water retention capacity'
    ],
    bestFor: ['Soil conditioning', 'Compost activation', 'Seed treatment', 'All crops'],
    seasonalUse: ['Spring', 'Summer', 'Fall', 'Winter'],
    weatherConsiderations: [
      'Can be applied in all weather conditions',
      'Most effective in warm, humid weather',
      'Excellent for soil preparation',
      'Use regularly for best results'
    ],
    icon: '🧪',
    color: '#0EA5E9'
  },
  {
    id: 'bokashi-sesame-manure',
    name: 'Bokashi with Sesame Cake and Animal Manure',
    type: 'compost',
    difficulty: 'moderate',
    preparationTime: '2 hours',
    fermentationTime: '4-6 weeks',
    shelfLife: '10 months',
    npkRatio: { n: 4.2, p: 3.1, k: 3.5 },
    ingredients: [
      {
        name: 'Sesame Oil Cake',
        amount: '3',
        unit: 'kg',
        description: 'Ground sesame seed cake after oil extraction',
        npkContribution: { n: 2.0, p: 1.5, k: 1.2 }
      },
      {
        name: 'Fresh Animal Manure',
        amount: '8',
        unit: 'kg',
        description: 'Fresh cow, buffalo, or goat manure',
        npkContribution: { n: 1.5, p: 1.0, k: 1.5 }
      },
      {
        name: 'Kitchen Scraps',
        amount: '4',
        unit: 'kg',
        description: 'Vegetable peels, fruit scraps, food waste',
        npkContribution: { n: 0.7, p: 0.6, k: 0.8 }
      },
      {
        name: 'Bokashi Bran (EM Bran)',
        amount: '1.5',
        unit: 'kg',
        description: 'Wheat bran inoculated with EM microorganisms'
      },
      {
        name: 'Rice Bran',
        amount: '2',
        unit: 'kg',
        description: 'Fresh rice bran for carbon balance'
      },
      {
        name: 'Molasses',
        amount: '300',
        unit: 'ml',
        description: 'Blackstrap molasses for microorganism activation'
      },
      {
        name: 'EM Solution',
        amount: '150',
        unit: 'ml',
        description: 'Effective Microorganisms concentrate'
      },
      {
        name: 'Water',
        amount: '800',
        unit: 'ml',
        description: 'Non-chlorinated water'
      }
    ],
    instructions: [
      'Grind sesame cake into fine powder if not already ground',
      'Mix molasses and EM solution with water in separate container',
      'Layer animal manure in airtight container',
      'Add layer of ground sesame cake over manure',
      'Add chopped kitchen scraps as next layer',
      'Sprinkle bokashi bran and rice bran over each layer',
      'Spray EM-molasses solution evenly over all layers',
      'Press down firmly to remove air pockets',
      'Repeat layering process until container is full',
      'Cover tightly to maintain anaerobic conditions',
      'Place heavy weight on top to compress materials',
      'Ferment for 4-6 weeks at ambient temperature',
      'Drain bokashi liquid weekly for immediate use',
      'Check for sweet-sour fermentation smell',
      'Ready when pH reaches 3.5-4.0 and materials are well-fermented'
    ],
    applicationMethod: [
      'Bury fermented bokashi 35cm deep in soil',
      'Wait 4-5 weeks before planting in treated area',
      'Use bokashi liquid diluted 1:300 for weekly watering',
      'Apply as base fertilizer for heavy feeding crops',
      'Mix into compost pile to accelerate decomposition',
      'Use as premium soil amendment for fruit trees'
    ],
    benefits: [
      'Highest nutrient content among bokashi variants',
      'Sesame cake provides excellent protein and oil content',
      'Superior nitrogen release for extended periods',
      'Improves soil structure and water retention dramatically',
      'Creates diverse beneficial microorganism ecosystem',
      'Suppresses soil-borne diseases and nematodes',
      'Provides slow-release nutrients for 8-10 months',
      'Enhances plant immunity and stress tolerance',
      'Improves fruit quality and shelf life',
      'Reduces need for additional fertilizers'
    ],
    bestFor: ['Premium fruit trees', 'High-value vegetables', 'Organic cash crops', 'Greenhouse cultivation'],
    seasonalUse: ['Spring', 'Summer', 'Fall', 'Winter'],
    weatherConsiderations: [
      'Fermentation works optimally in warm weather',
      'Apply to soil during moderate temperatures',
      'Bokashi liquid excellent during all seasons',
      'Bury fermented matter before heavy rains',
      'Store in cool, dry place during hot weather'
    ],
    icon: '🌰',
    color: '#D97706'
  },
  {
    id: 'sesame-cake-fertilizer',
    name: 'Sesame Cake Organic Fertilizer',
    type: 'solid',
    difficulty: 'easy',
    preparationTime: '30 minutes',
    shelfLife: '1 year',
    npkRatio: { n: 6.2, p: 2.9, k: 1.8 },
    ingredients: [
      {
        name: 'Sesame Oil Cake',
        amount: '5',
        unit: 'kg',
        description: 'Ground sesame seed cake after oil extraction',
        npkContribution: { n: 6.2, p: 2.9, k: 1.8 }
      },
      {
        name: 'Neem Cake',
        amount: '2',
        unit: 'kg',
        description: 'Neem seed cake for pest control',
        npkContribution: { n: 1.2, p: 0.5, k: 0.8 }
      },
      {
        name: 'Bone Meal',
        amount: '1',
        unit: 'kg',
        description: 'Ground animal bones for phosphorus',
        npkContribution: { n: 2.0, p: 12.0, k: 0 }
      },
      {
        name: 'Wood Ash',
        amount: '500',
        unit: 'grams',
        description: 'Hardwood ash for potassium',
        npkContribution: { n: 0, p: 1.5, k: 7.0 }
      }
    ],
    instructions: [
      'Grind sesame cake into fine powder if needed',
      'Mix sesame cake with neem cake thoroughly',
      'Add bone meal and mix well',
      'Add wood ash and blend all ingredients',
      'Sieve mixture to ensure uniform consistency',
      'Store in airtight containers in cool, dry place',
      'Label with preparation date'
    ],
    applicationMethod: [
      'Apply 200-300g per square meter before planting',
      'Mix into top 15cm of soil',
      'Water thoroughly after application',
      'Reapply every 6-8 weeks during growing season',
      'Use as side dressing around established plants'
    ],
    benefits: [
      'Very high nitrogen content for vigorous growth',
      'Excellent protein source for soil microorganisms',
      'Natural pest deterrent from neem cake',
      'Slow-release nutrients prevent burning',
      'Improves soil organic matter significantly',
      'Enhances plant disease resistance',
      'Promotes beneficial soil bacteria',
      'Increases crop yield and quality'
    ],
    bestFor: ['Leafy greens', 'Brassicas', 'Legumes', 'High-protein crops'],
    seasonalUse: ['Spring', 'Summer', 'Fall'],
    weatherConsiderations: [
      'Apply before rainy season for best results',
      'Avoid application during very dry periods',
      'Water in thoroughly after application'
    ],
    icon: '🌰',
    color: '#92400E'
  },
  {
    id: 'fermented-sesame-liquid',
    name: 'Fermented Sesame Liquid Fertilizer',
    type: 'liquid',
    difficulty: 'moderate',
    preparationTime: '45 minutes',
    fermentationTime: '3-4 weeks',
    shelfLife: '3 months',
    npkRatio: { n: 3.8, p: 1.5, k: 2.2 },
    ingredients: [
      {
        name: 'Sesame Oil Cake',
        amount: '2',
        unit: 'kg',
        description: 'Ground sesame seed cake',
        npkContribution: { n: 3.8, p: 1.5, k: 1.2 }
      },
      {
        name: 'Fish Scraps',
        amount: '1',
        unit: 'kg',
        description: 'Fresh fish waste for amino acids'
      },
      {
        name: 'Jaggery',
        amount: '300',
        unit: 'grams',
        description: 'Unrefined cane sugar for fermentation'
      },
      {
        name: 'Water',
        amount: '10',
        unit: 'liters',
        description: 'Non-chlorinated water'
      },
      {
        name: 'EM Solution',
        amount: '100',
        unit: 'ml',
        description: 'Effective microorganisms for fermentation'
      }
    ],
    instructions: [
      'Grind sesame cake and fish scraps together',
      'Dissolve jaggery in warm water',
      'Add ground mixture to jaggery water',
      'Add EM solution and mix thoroughly',
      'Pour into fermentation container',
      'Cover with cloth and secure with rubber band',
      'Ferment for 3-4 weeks, stirring weekly',
      'Strain liquid when fermentation is complete',
      'Store filtered liquid in cool place'
    ],
    applicationMethod: [
      'Dilute 1:15 with water for soil application',
      'Apply every 2 weeks during growing season',
      'Use as foliar spray diluted 1:20',
      'Apply early morning or late evening'
    ],
    benefits: [
      'High amino acid content for plant growth',
      'Excellent nitrogen source from sesame',
      'Improves plant protein synthesis',
      'Enhances fruit and seed development',
      'Boosts plant immunity naturally',
      'Promotes beneficial soil microorganisms',
      'Increases chlorophyll production',
      'Improves nutrient uptake efficiency'
    ],
    bestFor: ['Fruit trees', 'Flowering plants', 'Seed crops', 'High-value vegetables'],
    seasonalUse: ['Spring', 'Summer'],
    weatherConsiderations: [
      'Apply during active growing periods',
      'Best results in warm, humid conditions',
      'Avoid application during plant stress'
    ],
    icon: '🌰',
    color: '#F59E0B'
  },
  {
    id: 'groundnut-cake-fertilizer',
    name: 'Groundnut Cake Fertilizer',
    type: 'solid',
    difficulty: 'easy',
    preparationTime: '20 minutes',
    shelfLife: '8 months',
    npkRatio: { n: 7.3, p: 1.5, k: 1.3 },
    ingredients: [
      {
        name: 'Groundnut Oil Cake',
        amount: '5',
        unit: 'kg',
        description: 'Ground peanut cake after oil extraction',
        npkContribution: { n: 7.3, p: 1.5, k: 1.3 }
      },
      {
        name: 'Castor Cake',
        amount: '1',
        unit: 'kg',
        description: 'Castor seed cake for pest control',
        npkContribution: { n: 4.0, p: 1.8, k: 1.2 }
      },
      {
        name: 'Rock Phosphate',
        amount: '500',
        unit: 'grams',
        description: 'Natural phosphorus source'
      }
    ],
    instructions: [
      'Grind groundnut cake into uniform powder',
      'Mix with castor cake thoroughly',
      'Add rock phosphate and blend well',
      'Sieve to remove large particles',
      'Store in moisture-proof containers'
    ],
    applicationMethod: [
      'Apply 250g per square meter before planting',
      'Mix into soil to 20cm depth',
      'Water lightly after application',
      'Reapply monthly during growing season'
    ],
    benefits: [
      'Highest nitrogen content among oil cakes',
      'Excellent for rapid vegetative growth',
      'Natural pest repellent properties',
      'Improves soil structure and fertility',
      'Slow-release nutrition for 3-4 months',
      'Enhances beneficial soil microorganisms',
      'Increases protein content in crops'
    ],
    bestFor: ['Leafy vegetables', 'Cereals', 'Legumes', 'Fast-growing crops'],
    seasonalUse: ['Spring', 'Summer', 'Monsoon'],
    weatherConsiderations: [
      'Apply before monsoon for best results',
      'Effective in warm, moist conditions',
      'Avoid during very dry periods'
    ],
    icon: '🥜',
    color: '#A16207'
  },
  {
    id: 'mustard-cake-fertilizer',
    name: 'Mustard Cake Organic Fertilizer',
    type: 'solid',
    difficulty: 'easy',
    preparationTime: '25 minutes',
    shelfLife: '6 months',
    npkRatio: { n: 5.2, p: 1.8, k: 1.1 },
    ingredients: [
      {
        name: 'Mustard Oil Cake',
        amount: '4',
        unit: 'kg',
        description: 'Ground mustard seed cake after oil extraction',
        npkContribution: { n: 5.2, p: 1.8, k: 1.1 }
      },
      {
        name: 'Vermicompost',
        amount: '2',
        unit: 'kg',
        description: 'Earthworm processed organic matter',
        npkContribution: { n: 1.5, p: 1.0, k: 1.5 }
      },
      {
        name: 'Kelp Meal',
        amount: '500',
        unit: 'grams',
        description: 'Dried seaweed for trace minerals'
      }
    ],
    instructions: [
      'Grind mustard cake into fine powder',
      'Mix with vermicompost thoroughly',
      'Add kelp meal and blend well',
      'Ensure uniform mixture consistency',
      'Store in airtight containers'
    ],
    applicationMethod: [
      'Apply 200g per square meter',
      'Work into top 15cm of soil',
      'Water thoroughly after application',
      'Apply every 6 weeks during growing season'
    ],
    benefits: [
      'High nitrogen for leafy growth',
      'Natural fungicidal properties',
      'Repels soil-dwelling pests',
      'Improves soil microbial activity',
      'Provides trace minerals from kelp',
      'Enhances plant disease resistance',
      'Promotes root development'
    ],
    bestFor: ['Brassicas', 'Leafy greens', 'Root vegetables', 'Herbs'],
    seasonalUse: ['Spring', 'Summer', 'Fall'],
    weatherConsiderations: [
      'Most effective in cool, moist conditions',
      'Apply before rainy periods',
      'Avoid during extreme heat'
    ],
    icon: '🌱',
    color: '#65A30D'
  },
  {
    id: 'coconut-coir-compost',
    name: 'Coconut Coir Compost Fertilizer',
    type: 'compost',
    difficulty: 'moderate',
    preparationTime: '1 hour',
    fermentationTime: '8-12 weeks',
    shelfLife: '1 year',
    npkRatio: { n: 1.8, p: 0.8, k: 2.5 },
    ingredients: [
      {
        name: 'Coconut Coir Pith',
        amount: '10',
        unit: 'kg',
        description: 'Coconut fiber waste from processing',
        npkContribution: { n: 0.5, p: 0.2, k: 1.8 }
      },
      {
        name: 'Cow Dung',
        amount: '5',
        unit: 'kg',
        description: 'Fresh cow manure',
        npkContribution: { n: 0.8, p: 0.4, k: 0.5 }
      },
      {
        name: 'Green Leaves',
        amount: '3',
        unit: 'kg',
        description: 'Fresh green leaves for nitrogen',
        npkContribution: { n: 0.5, p: 0.2, k: 0.2 }
      },
      {
        name: 'EM Solution',
        amount: '200',
        unit: 'ml',
        description: 'Effective microorganisms for decomposition'
      },
      {
        name: 'Water',
        amount: '5',
        unit: 'liters',
        description: 'For moisture maintenance'
      }
    ],
    instructions: [
      'Soak coconut coir pith in water for 24 hours',
      'Drain excess water from coir',
      'Layer coir, cow dung, and green leaves alternately',
      'Spray EM solution over each layer',
      'Maintain moisture at 60-70%',
      'Turn pile every 2 weeks',
      'Compost for 8-12 weeks until dark and crumbly',
      'Screen finished compost before use'
    ],
    applicationMethod: [
      'Apply 3-4 kg per square meter',
      'Mix into top 20cm of soil',
      'Use as mulch around plants',
      'Apply before planting season'
    ],
    benefits: [
      'Excellent soil conditioner',
      'Improves water retention dramatically',
      'Enhances soil aeration',
      'Provides slow-release potassium',
      'Suppresses soil-borne diseases',
      'Increases beneficial microorganisms',
      'Improves root development',
      'Reduces soil compaction'
    ],
    bestFor: ['Sandy soils', 'Container gardening', 'Tropical crops', 'Water-sensitive plants'],
    seasonalUse: ['Spring', 'Summer', 'Fall', 'Winter'],
    weatherConsiderations: [
      'Excellent for water retention in dry seasons',
      'Helps drainage in heavy clay soils',
      'Maintains soil temperature stability'
    ],
    icon: '🥥',
    color: '#8B4513'
  },
  {
    id: 'fermented-banana-stem',
    name: 'Fermented Banana Stem Fertilizer',
    type: 'liquid',
    difficulty: 'moderate',
    preparationTime: '1 hour',
    fermentationTime: '2-3 weeks',
    shelfLife: '2 months',
    npkRatio: { n: 1.2, p: 0.5, k: 4.8 },
    ingredients: [
      {
        name: 'Banana Stem',
        amount: '5',
        unit: 'kg',
        description: 'Fresh banana pseudostem after harvest',
        npkContribution: { n: 1.2, p: 0.5, k: 4.8 }
      },
      {
        name: 'Jaggery',
        amount: '500',
        unit: 'grams',
        description: 'Unrefined cane sugar for fermentation'
      },
      {
        name: 'Water',
        amount: '10',
        unit: 'liters',
        description: 'Clean water for extraction'
      },
      {
        name: 'EM Solution',
        amount: '100',
        unit: 'ml',
        description: 'Effective microorganisms'
      }
    ],
    instructions: [
      'Chop banana stem into small pieces',
      'Crush pieces to extract maximum juice',
      'Dissolve jaggery in water',
      'Add crushed banana stem to jaggery water',
      'Add EM solution and mix well',
      'Cover with cloth and ferment for 2-3 weeks',
      'Stir every 3 days during fermentation',
      'Strain liquid when fermentation is complete'
    ],
    applicationMethod: [
      'Dilute 1:10 with water for soil application',
      'Apply every 2 weeks during fruiting stage',
      'Use undiluted for compost activation',
      'Apply to soil around fruit trees'
    ],
    benefits: [
      'Extremely high potassium content',
      'Excellent for flowering and fruiting',
      'Improves fruit quality and size',
      'Natural growth hormone content',
      'Enhances plant stress tolerance',
      'Promotes root development',
      'Increases sugar content in fruits'
    ],
    bestFor: ['Fruit trees', 'Flowering plants', 'Tomatoes', 'Peppers'],
    seasonalUse: ['Spring', 'Summer'],
    weatherConsiderations: [
      'Most effective during fruiting season',
      'Apply before flowering for best results',
      'Excellent during dry periods'
    ],
    icon: '🍌',
    color: '#FCD34D'
  },
  {
    id: 'mother-em-solution',
    name: 'Mother EM Solution (Indigenous Microorganisms)',
    type: 'liquid',
    difficulty: 'advanced',
    preparationTime: '2 hours',
    fermentationTime: '7-14 days',
    shelfLife: '6 months refrigerated',
    npkRatio: { n: 0.1, p: 0.1, k: 0.2 },
    ingredients: [
      {
        name: 'Cooked Rice',
        amount: '2',
        unit: 'cups',
        description: 'Plain white rice, cooled to room temperature'
      },
      {
        name: 'Bamboo Basket or Wooden Box',
        amount: '1',
        unit: 'piece',
        description: 'Natural material container for microorganism collection'
      },
      {
        name: 'White Cloth or Cheesecloth',
        amount: '1',
        unit: 'piece',
        description: 'Clean cloth for covering'
      },
      {
        name: 'Molasses',
        amount: '1',
        unit: 'liter',
        description: 'Blackstrap molasses for microorganism food'
      },
      {
        name: 'Water',
        amount: '10',
        unit: 'liters',
        description: 'Non-chlorinated, clean water'
      },
      {
        name: 'Milk',
        amount: '1',
        unit: 'liter',
        description: 'Fresh whole milk for selection process'
      }
    ],
    instructions: [
      'PHASE 1: Collecting Indigenous Microorganisms (IMO-1)',
      'Place cooked rice in bamboo basket or wooden box',
      'Cover rice with white cloth or cheesecloth',
      'Place container in forest area under deciduous trees',
      'Choose location with rich organic matter and good air circulation',
      'Leave for 3-5 days until rice develops white fuzzy mold',
      'Collect rice when it shows white, sweet-smelling mold growth',
      '',
      'PHASE 2: Multiplying Microorganisms (IMO-2)',
      'Mix moldy rice with equal amount of brown sugar or molasses',
      'Place mixture in glass jar, leaving 1/3 space for expansion',
      'Cover with breathable cloth and secure with rubber band',
      'Store in cool, dark place for 7 days',
      'Mixture ready when it develops sweet, alcoholic smell',
      '',
      'PHASE 3: Selection Process (IMO-3)',
      'Mix 1 part IMO-2 with 1 part fresh milk',
      'Let mixture sit for 24 hours at room temperature',
      'Good microorganisms will rise to top (cream layer)',
      'Bad microorganisms will sink to bottom',
      'Carefully collect only the top cream layer',
      '',
      'PHASE 4: Final Mother EM Solution',
      'Mix collected cream layer with molasses (1:1 ratio)',
      'Add non-chlorinated water to make 10 liters total',
      'Ferment for additional 7 days in cool place',
      'Strain through fine cloth to remove solids',
      'Store in dark bottles in refrigerator',
      'Label with preparation date and contents'
    ],
    applicationMethod: [
      'Use as mother culture for other EM preparations',
      'Dilute 1:1000 for direct soil application',
      'Mix with molasses to create EM-1 activated solution',
      'Use 100ml per 10 liters for bokashi preparation',
      'Add to compost piles for acceleration',
      'Use for seed treatment before planting'
    ],
    benefits: [
      'Creates indigenous microorganism culture adapted to local conditions',
      'Cost-effective alternative to commercial EM',
      'Contains diverse beneficial bacteria, yeasts, and fungi',
      'Improves soil biological activity dramatically',
      'Enhances plant growth and disease resistance',
      'Accelerates organic matter decomposition',
      'Suppresses harmful pathogens naturally',
      'Reduces need for chemical inputs',
      'Can be continuously propagated and shared',
      'Environmentally sustainable and renewable'
    ],
    bestFor: ['All organic farming applications', 'Soil conditioning', 'Compost activation', 'Plant health'],
    seasonalUse: ['Spring', 'Summer', 'Fall', 'Winter'],
    weatherConsiderations: [
      'Collect IMO during humid, warm weather for best results',
      'Avoid collection during heavy rains',
      'Store finished solution in cool conditions',
      'Fermentation works best at 25-30°C temperature'
    ],
    icon: '🧬',
    color: '#7C3AED'
  },
  {
    id: 'em-bokashi-bran',
    name: 'EM Bokashi Bran (Homemade)',
    type: 'solid',
    difficulty: 'moderate',
    preparationTime: '1 hour',
    fermentationTime: '2-3 weeks',
    shelfLife: '1 year',
    npkRatio: { n: 2.1, p: 1.5, k: 1.2 },
    ingredients: [
      {
        name: 'Wheat Bran',
        amount: '10',
        unit: 'kg',
        description: 'Fresh wheat bran from mill',
        npkContribution: { n: 2.1, p: 1.5, k: 1.2 }
      },
      {
        name: 'Rice Bran',
        amount: '5',
        unit: 'kg',
        description: 'Fresh rice bran for additional nutrients'
      },
      {
        name: 'Mother EM Solution',
        amount: '500',
        unit: 'ml',
        description: 'Homemade or commercial EM mother culture'
      },
      {
        name: 'Molasses',
        amount: '500',
        unit: 'ml',
        description: 'Blackstrap molasses for microorganism food'
      },
      {
        name: 'Water',
        amount: '2',
        unit: 'liters',
        description: 'Non-chlorinated water'
      },
      {
        name: 'Sea Salt',
        amount: '100',
        unit: 'grams',
        description: 'Natural sea salt for preservation'
      }
    ],
    instructions: [
      'Mix wheat bran and rice bran thoroughly in large container',
      'Dissolve molasses in warm water',
      'Add Mother EM solution to molasses water',
      'Add sea salt and mix until dissolved',
      'Gradually add liquid mixture to bran while mixing',
      'Mix thoroughly until moisture content reaches 35-40%',
      'Test moisture: handful should hold together but not drip',
      'Pack mixture into airtight containers or plastic bags',
      'Remove all air and seal tightly',
      'Ferment for 2-3 weeks at room temperature',
      'Check weekly for sweet, alcoholic smell',
      'Ready when bran has pleasant fermented aroma',
      'Store in cool, dry place in sealed containers'
    ],
    applicationMethod: [
      'Use for bokashi composting at 2-3% of organic matter weight',
      'Sprinkle over kitchen scraps in bokashi bucket',
      'Mix into animal manure for fermentation',
      'Add to compost piles for acceleration',
      'Use as soil amendment at 100g per square meter'
    ],
    benefits: [
      'Homemade alternative to expensive commercial bokashi bran',
      'Contains live beneficial microorganisms',
      'Accelerates anaerobic fermentation process',
      'Preserves nutrients during composting',
      'Suppresses putrefaction and bad odors',
      'Creates beneficial microorganism colonies',
      'Improves soil microbiology when applied',
      'Cost-effective for large-scale operations',
      'Can be produced continuously',
      'Reduces dependency on commercial products'
    ],
    bestFor: ['Bokashi composting', 'Animal manure fermentation', 'Soil conditioning', 'Organic waste processing'],
    seasonalUse: ['Spring', 'Summer', 'Fall', 'Winter'],
    weatherConsiderations: [
      'Fermentation works in all weather conditions',
      'Store in cool, dry place during hot weather',
      'Protect from moisture during monsoon',
      'Use within 1 year for best effectiveness'
    ],
    icon: '🌾',
    color: '#D97706'
  },
  {
    id: 'indigenous-microorganism-soil',
    name: 'Indigenous Microorganism Soil Amendment (IMO-4)',
    type: 'solid',
    difficulty: 'advanced',
    preparationTime: '3 hours',
    fermentationTime: '7-10 days',
    shelfLife: '3 months',
    npkRatio: { n: 1.5, p: 1.2, k: 2.0 },
    ingredients: [
      {
        name: 'IMO-3 (from Mother EM process)',
        amount: '1',
        unit: 'kg',
        description: 'Selected microorganism culture from milk separation'
      },
      {
        name: 'Field Soil',
        amount: '5',
        unit: 'kg',
        description: 'Local soil from the area where it will be applied',
        npkContribution: { n: 0.5, p: 0.8, k: 1.5 }
      },
      {
        name: 'Rice Bran',
        amount: '5',
        unit: 'kg',
        description: 'Fresh rice bran for carbon source',
        npkContribution: { n: 1.0, p: 0.4, k: 0.5 }
      },
      {
        name: 'Red Clay or Charcoal Powder',
        amount: '1',
        unit: 'kg',
        description: 'Natural clay or biochar for mineral content'
      },
      {
        name: 'Sea Salt',
        amount: '100',
        unit: 'grams',
        description: 'Natural sea salt for mineral balance'
      },
      {
        name: 'Water',
        amount: '2',
        unit: 'liters',
        description: 'Non-chlorinated water for moisture'
      }
    ],
    instructions: [
      'Mix IMO-3 with rice bran in large container',
      'Add field soil gradually while mixing',
      'Add red clay or charcoal powder',
      'Dissolve sea salt in water',
      'Add salt water gradually while mixing',
      'Adjust moisture to 65-70% (mixture should hold together)',
      'Pile mixture into mound shape',
      'Cover with rice straw or natural materials',
      'Maintain temperature at 50-60°C during fermentation',
      'Turn pile every 2 days to maintain temperature',
      'Ferment for 7-10 days until earthy smell develops',
      'Ready when mixture is dark, crumbly, and sweet-smelling',
      'Store in breathable bags in cool, dry place'
    ],
    applicationMethod: [
      'Apply 500g per square meter before planting',
      'Mix into top 15cm of soil',
      'Use as base for seed starting mix',
      'Add to transplant holes for seedlings',
      'Apply monthly during growing season'
    ],
    benefits: [
      'Introduces locally adapted beneficial microorganisms',
      'Improves soil structure and aggregation',
      'Enhances nutrient cycling and availability',
      'Suppresses soil-borne diseases naturally',
      'Increases soil organic matter content',
      'Improves water retention and drainage',
      'Promotes healthy root development',
      'Creates sustainable soil ecosystem',
      'Reduces need for chemical fertilizers',
      'Builds long-term soil fertility'
    ],
    bestFor: ['Soil restoration', 'Organic farming transition', 'Seedling production', 'Sustainable agriculture'],
    seasonalUse: ['Spring', 'Summer', 'Fall'],
    weatherConsiderations: [
      'Apply during moderate temperatures for best microbial activity',
      'Avoid application during extreme heat or cold',
      'Best results in slightly moist soil conditions',
      'Reapply after heavy rains or flooding'
    ],
    icon: '🦠',
    color: '#059669'
  }
];

// Application schedules for different crops
export const APPLICATION_SCHEDULES: ApplicationSchedule[] = [
  {
    crop: 'Tomatoes',
    fertilizer: 'compost-tea',
    schedule: [
      {
        stage: 'Seedling',
        timing: 'Weekly',
        dilution: '1:2',
        frequency: 'Once per week',
        amount: '1 cup per plant'
      },
      {
        stage: 'Vegetative',
        timing: 'Bi-weekly',
        dilution: '1:1',
        frequency: 'Every 2 weeks',
        amount: '2 cups per plant'
      },
      {
        stage: 'Flowering',
        timing: 'Weekly',
        dilution: '1:1',
        frequency: 'Once per week',
        amount: '2 cups per plant'
      },
      {
        stage: 'Fruiting',
        timing: 'Bi-weekly',
        dilution: '1:1',
        frequency: 'Every 2 weeks',
        amount: '3 cups per plant'
      }
    ]
  },
  {
    crop: 'Leafy Greens',
    fertilizer: 'fish-emulsion',
    schedule: [
      {
        stage: 'Seedling',
        timing: 'Weekly',
        dilution: '1:30',
        frequency: 'Once per week',
        amount: '1/2 cup per plant'
      },
      {
        stage: 'Growing',
        timing: 'Bi-weekly',
        dilution: '1:20',
        frequency: 'Every 2 weeks',
        amount: '1 cup per plant'
      },
      {
        stage: 'Harvest',
        timing: 'Weekly',
        dilution: '1:25',
        frequency: 'Once per week',
        amount: '1 cup per plant'
      }
    ]
  },
  {
    crop: 'All Vegetables',
    fertilizer: 'cow-urine-fertilizer',
    schedule: [
      {
        stage: 'Soil Preparation',
        timing: 'Before planting',
        dilution: '1:10',
        frequency: 'Once before sowing',
        amount: '2 liters per square meter'
      },
      {
        stage: 'Vegetative Growth',
        timing: 'Every 15 days',
        dilution: '1:10',
        frequency: 'Bi-weekly',
        amount: '1 liter per plant'
      },
      {
        stage: 'Flowering',
        timing: 'Every 15 days',
        dilution: '1:15',
        frequency: 'Bi-weekly',
        amount: '1 liter per plant'
      },
      {
        stage: 'Fruiting',
        timing: 'Every 20 days',
        dilution: '1:15',
        frequency: 'Every 3 weeks',
        amount: '1.5 liters per plant'
      }
    ]
  },
  {
    crop: 'Disease Prevention',
    fertilizer: 'neem-oil-spray',
    schedule: [
      {
        stage: 'Preventive',
        timing: 'Weekly',
        dilution: 'As prepared',
        frequency: 'Once per week',
        amount: 'Complete plant coverage'
      },
      {
        stage: 'Early Infection',
        timing: 'Every 3 days',
        dilution: 'As prepared',
        frequency: 'Every 3 days',
        amount: 'Focus on affected areas'
      },
      {
        stage: 'Active Treatment',
        timing: 'Every 2 days',
        dilution: 'As prepared',
        frequency: 'Every 2 days',
        amount: 'Thorough coverage'
      }
    ]
  },
  {
    crop: 'Fruit Trees',
    fertilizer: 'fermented-fruit-waste',
    schedule: [
      {
        stage: 'Pre-flowering',
        timing: 'Monthly',
        dilution: '1:20',
        frequency: 'Once per month',
        amount: '5 liters per tree'
      },
      {
        stage: 'Flowering',
        timing: 'Bi-weekly',
        dilution: '1:25',
        frequency: 'Every 2 weeks',
        amount: '3 liters per tree'
      },
      {
        stage: 'Fruit Development',
        timing: 'Every 3 weeks',
        dilution: '1:20',
        frequency: 'Every 3 weeks',
        amount: '4 liters per tree'
      }
    ]
  },
  {
    crop: 'All Vegetables',
    fertilizer: 'bokashi-fertilizer',
    schedule: [
      {
        stage: 'Soil Preparation',
        timing: '2 weeks before planting',
        dilution: 'Bury directly',
        frequency: 'Once per season',
        amount: '2-3 kg per square meter'
      },
      {
        stage: 'Growing Season',
        timing: 'Weekly',
        dilution: '1:100 (bokashi tea)',
        frequency: 'Once per week',
        amount: '1 liter per square meter'
      },
      {
        stage: 'Mid-season Boost',
        timing: 'Monthly',
        dilution: 'Bury around plants',
        frequency: 'Once per month',
        amount: '500g per plant'
      }
    ]
  },
  {
    crop: 'Heavy Feeding Crops',
    fertilizer: 'bokashi-animal-manure',
    schedule: [
      {
        stage: 'Pre-season Soil Preparation',
        timing: '4 weeks before planting',
        dilution: 'Bury directly',
        frequency: 'Once per season',
        amount: '4-5 kg per square meter'
      },
      {
        stage: 'Growing Season',
        timing: 'Bi-weekly',
        dilution: '1:200 (bokashi liquid)',
        frequency: 'Every 2 weeks',
        amount: '2 liters per square meter'
      },
      {
        stage: 'Mid-season Application',
        timing: 'Monthly',
        dilution: 'Bury around plants',
        frequency: 'Once per month',
        amount: '1 kg per plant'
      },
      {
        stage: 'Pre-harvest',
        timing: '4 weeks before harvest',
        dilution: '1:300 (bokashi liquid)',
        frequency: 'Weekly',
        amount: '1 liter per square meter'
      }
    ]
  },
  {
    crop: 'All Crops',
    fertilizer: 'em-cow-urine-fertilizer',
    schedule: [
      {
        stage: 'Soil Preparation',
        timing: '1 week before planting',
        dilution: '1:20',
        frequency: 'Once before sowing',
        amount: '3 liters per square meter'
      },
      {
        stage: 'Vegetative Growth',
        timing: 'Every 10 days',
        dilution: '1:20',
        frequency: 'Every 10 days',
        amount: '1.5 liters per plant'
      },
      {
        stage: 'Flowering & Fruiting',
        timing: 'Every 15 days',
        dilution: '1:25',
        frequency: 'Every 15 days',
        amount: '2 liters per plant'
      }
    ]
  },
  {
    crop: 'Soil Conditioning',
    fertilizer: 'em-activated-solution',
    schedule: [
      {
        stage: 'Initial Treatment',
        timing: 'Before season start',
        dilution: '1:1000',
        frequency: 'Once',
        amount: '10 liters per 100 sq meters'
      },
      {
        stage: 'Maintenance',
        timing: 'Monthly',
        dilution: '1:1000',
        frequency: 'Once per month',
        amount: '5 liters per 100 sq meters'
      },
      {
        stage: 'Compost Activation',
        timing: 'Weekly',
        dilution: '1:500',
        frequency: 'Once per week',
        amount: 'Spray entire compost pile'
      }
    ]
  },
  {
    crop: 'Premium Fruit Trees',
    fertilizer: 'bokashi-sesame-manure',
    schedule: [
      {
        stage: 'Pre-season Preparation',
        timing: '6 weeks before flowering',
        dilution: 'Bury directly',
        frequency: 'Once per season',
        amount: '5-8 kg per tree'
      },
      {
        stage: 'Growing Season',
        timing: 'Weekly',
        dilution: '1:300 (bokashi liquid)',
        frequency: 'Once per week',
        amount: '3 liters per tree'
      },
      {
        stage: 'Fruiting Stage',
        timing: 'Bi-weekly',
        dilution: '1:400 (bokashi liquid)',
        frequency: 'Every 2 weeks',
        amount: '4 liters per tree'
      }
    ]
  },
  {
    crop: 'High-Value Vegetables',
    fertilizer: 'sesame-cake-fertilizer',
    schedule: [
      {
        stage: 'Soil Preparation',
        timing: '2 weeks before planting',
        dilution: 'Apply directly',
        frequency: 'Once per season',
        amount: '300g per square meter'
      },
      {
        stage: 'Mid-season',
        timing: 'Every 6 weeks',
        dilution: 'Side dressing',
        frequency: 'Every 6 weeks',
        amount: '150g per square meter'
      },
      {
        stage: 'Pre-harvest',
        timing: '4 weeks before harvest',
        dilution: 'Light application',
        frequency: 'Once',
        amount: '100g per square meter'
      }
    ]
  },
  {
    crop: 'Fruit Trees',
    fertilizer: 'fermented-banana-stem',
    schedule: [
      {
        stage: 'Pre-flowering',
        timing: '4 weeks before flowering',
        dilution: '1:10',
        frequency: 'Weekly',
        amount: '2 liters per tree'
      },
      {
        stage: 'Flowering',
        timing: 'During flowering period',
        dilution: '1:12',
        frequency: 'Bi-weekly',
        amount: '3 liters per tree'
      },
      {
        stage: 'Fruit Development',
        timing: 'During fruit development',
        dilution: '1:10',
        frequency: 'Every 2 weeks',
        amount: '4 liters per tree'
      }
    ]
  },
  {
    crop: 'EM Production System',
    fertilizer: 'mother-em-solution',
    schedule: [
      {
        stage: 'IMO Collection',
        timing: 'During humid, warm weather',
        dilution: 'Use as mother culture',
        frequency: 'Seasonal production',
        amount: 'Collect 2-3 batches per season'
      },
      {
        stage: 'EM Propagation',
        timing: 'Monthly',
        dilution: '1:1 with molasses',
        frequency: 'Once per month',
        amount: 'Produce 10-20 liters per batch'
      },
      {
        stage: 'Soil Application',
        timing: 'Weekly during growing season',
        dilution: '1:1000',
        frequency: 'Once per week',
        amount: '1 liter per 100 square meters'
      }
    ]
  },
  {
    crop: 'Bokashi Production',
    fertilizer: 'em-bokashi-bran',
    schedule: [
      {
        stage: 'Bran Preparation',
        timing: 'Monthly production',
        dilution: 'Use directly',
        frequency: 'Once per month',
        amount: '15 kg batch for household use'
      },
      {
        stage: 'Kitchen Waste Processing',
        timing: 'Daily',
        dilution: '2-3% of waste weight',
        frequency: 'Daily',
        amount: '50-100g per 3kg waste'
      },
      {
        stage: 'Compost Acceleration',
        timing: 'Weekly',
        dilution: 'Sprinkle over compost',
        frequency: 'Once per week',
        amount: '200g per cubic meter compost'
      }
    ]
  },
  {
    crop: 'Soil Restoration',
    fertilizer: 'indigenous-microorganism-soil',
    schedule: [
      {
        stage: 'Initial Soil Treatment',
        timing: 'Before planting season',
        dilution: 'Apply directly',
        frequency: 'Once per season',
        amount: '500g per square meter'
      },
      {
        stage: 'Maintenance Application',
        timing: 'Monthly during growing season',
        dilution: 'Apply directly',
        frequency: 'Once per month',
        amount: '200g per square meter'
      },
      {
        stage: 'Seedling Production',
        timing: 'During seed starting',
        dilution: 'Mix with potting soil',
        frequency: 'Each batch',
        amount: '20% of potting mix volume'
      }
    ]
  }
];

// Weather-based recommendations
export const WEATHER_RECOMMENDATIONS: WeatherBasedRecommendation[] = [
  {
    condition: 'Before Rain',
    recommendation: 'Apply solid fertilizers and soil drenches',
    fertilizers: ['eggshell-calcium', 'coffee-grounds-compost', 'wood-ash-fertilizer'],
    timing: '2-4 hours before expected rain',
    precautions: [
      'Avoid foliar sprays',
      'Apply to soil only',
      'Ensure good drainage'
    ]
  },
  {
    condition: 'Hot Weather (>85°F)',
    recommendation: 'Avoid fertilizing during heat stress',
    fertilizers: [],
    timing: 'Wait for cooler weather',
    precautions: [
      'Plants cannot absorb nutrients efficiently',
      'Risk of burning plants',
      'Wait for temperatures below 80°F'
    ]
  },
  {
    condition: 'Cool, Cloudy Weather',
    recommendation: 'Ideal for foliar feeding',
    fertilizers: ['compost-tea', 'seaweed-fertilizer', 'nettle-fertilizer'],
    timing: 'Early morning or late afternoon',
    precautions: [
      'Ensure leaves can dry before evening',
      'Use diluted solutions',
      'Test on small area first'
    ]
  },
  {
    condition: 'Drought Stress',
    recommendation: 'Focus on stress-relief fertilizers',
    fertilizers: ['seaweed-fertilizer'],
    timing: 'After watering, in evening',
    precautions: [
      'Water plants first',
      'Use very diluted solutions',
      'Apply to soil, not leaves'
    ]
  },
  {
    condition: 'High Humidity',
    recommendation: 'Avoid foliar applications, use disease control sprays',
    fertilizers: ['neem-oil-spray', 'buttermilk-spray', 'turmeric-ginger-paste'],
    timing: 'Apply disease control measures',
    precautions: [
      'Risk of fungal diseases',
      'Focus on preventive treatments',
      'Ensure good air circulation'
    ]
  },
  {
    condition: 'Monsoon Season',
    recommendation: 'Focus on disease prevention and soil health',
    fertilizers: ['cow-urine-fertilizer', 'ash-lime-spray', 'neem-oil-spray'],
    timing: 'Apply during breaks in rain',
    precautions: [
      'High disease pressure',
      'Ensure good drainage',
      'Apply preventive treatments'
    ]
  },
  {
    condition: 'Post-Monsoon',
    recommendation: 'Restore soil health and prevent diseases',
    fertilizers: ['cow-urine-fertilizer', 'fermented-fruit-waste', 'rice-water-fertilizer'],
    timing: 'Apply when soil starts to dry',
    precautions: [
      'Soil may be waterlogged',
      'Check for root rot',
      'Gradual application'
    ]
  },
  {
    condition: 'Pest Outbreak',
    recommendation: 'Use natural pest repellents immediately',
    fertilizers: ['onion-garlic-spray', 'neem-oil-spray', 'turmeric-ginger-paste'],
    timing: 'Apply at first sign of pests',
    precautions: [
      'Identify pest type first',
      'Apply during cool hours',
      'Repeat applications needed'
    ]
  },
  {
    condition: 'Disease Symptoms',
    recommendation: 'Apply antifungal and antibacterial treatments',
    fertilizers: ['buttermilk-spray', 'turmeric-ginger-paste', 'ash-lime-spray'],
    timing: 'Immediate application required',
    precautions: [
      'Remove affected plant parts',
      'Improve air circulation',
      'Avoid overhead watering'
    ]
  },
  {
    condition: 'Soil Degradation',
    recommendation: 'Use EM-based fertilizers for soil restoration',
    fertilizers: ['em-cow-urine-fertilizer', 'em-activated-solution', 'bokashi-fertilizer'],
    timing: 'Apply during soil preparation phase',
    precautions: [
      'Test soil pH before application',
      'Ensure proper fermentation of EM products',
      'Apply consistently for best results'
    ]
  },
  {
    condition: 'Organic Farming Transition',
    recommendation: 'Establish beneficial microorganism populations',
    fertilizers: ['bokashi-fertilizer', 'em-activated-solution', 'em-cow-urine-fertilizer'],
    timing: 'Start 3 months before planting season',
    precautions: [
      'Avoid chemical inputs during transition',
      'Build soil biology gradually',
      'Monitor soil health improvements'
    ]
  },
  {
    condition: 'Kitchen Waste Management',
    recommendation: 'Convert organic waste to valuable fertilizer',
    fertilizers: ['bokashi-fertilizer'],
    timing: 'Continuous process year-round',
    precautions: [
      'Maintain anaerobic conditions',
      'Use proper EM bran ratios',
      'Ensure complete fermentation'
    ]
  },
  {
    condition: 'Animal Manure Management',
    recommendation: 'Convert fresh manure to high-quality fertilizer',
    fertilizers: ['bokashi-animal-manure'],
    timing: 'Process fresh manure immediately',
    precautions: [
      'Use fresh manure within 24 hours',
      'Maintain proper carbon-nitrogen ratio',
      'Ensure complete anaerobic fermentation',
      'Monitor pH levels during fermentation'
    ]
  },
  {
    condition: 'Heavy Feeding Crop Production',
    recommendation: 'Use nutrient-rich bokashi for demanding crops',
    fertilizers: ['bokashi-animal-manure', 'em-cow-urine-fertilizer'],
    timing: 'Apply 4 weeks before planting season',
    precautions: [
      'Allow proper decomposition time',
      'Test soil nutrient levels',
      'Avoid over-application',
      'Monitor plant response'
    ]
  },
  {
    condition: 'Premium Crop Production',
    recommendation: 'Use high-quality sesame-based fertilizers for premium crops',
    fertilizers: ['bokashi-sesame-manure', 'sesame-cake-fertilizer', 'fermented-sesame-liquid'],
    timing: 'Apply throughout growing season',
    precautions: [
      'Use for high-value crops only due to cost',
      'Ensure proper fermentation before application',
      'Monitor soil nutrient balance',
      'Combine with other organic inputs'
    ]
  },
  {
    condition: 'Oil Cake Availability',
    recommendation: 'Utilize available oil cakes for organic fertilization',
    fertilizers: ['groundnut-cake-fertilizer', 'mustard-cake-fertilizer', 'sesame-cake-fertilizer'],
    timing: 'Apply based on crop requirements',
    precautions: [
      'Check oil cake quality and freshness',
      'Store in dry conditions to prevent spoilage',
      'Apply appropriate rates to avoid burning',
      'Combine with other organic matter'
    ]
  },
  {
    condition: 'Coconut Growing Regions',
    recommendation: 'Utilize coconut waste for soil improvement',
    fertilizers: ['coconut-coir-compost'],
    timing: 'Apply before planting season',
    precautions: [
      'Ensure proper composting of coir',
      'Check salt content in coastal areas',
      'Combine with nitrogen sources',
      'Monitor soil drainage improvements'
    ]
  },
  {
    condition: 'Banana Growing Areas',
    recommendation: 'Convert banana waste to high-potassium fertilizer',
    fertilizers: ['fermented-banana-stem'],
    timing: 'Process immediately after banana harvest',
    precautions: [
      'Use fresh banana stems within 24 hours',
      'Ensure complete fermentation',
      'Dilute properly to avoid potassium excess',
      'Apply during fruiting stages for best results'
    ]
  },
  {
    condition: 'EM Production and Self-Sufficiency',
    recommendation: 'Establish indigenous microorganism production system',
    fertilizers: ['mother-em-solution', 'em-bokashi-bran', 'indigenous-microorganism-soil'],
    timing: 'Start during favorable weather conditions',
    precautions: [
      'Collect IMO during humid, warm weather',
      'Maintain sterile conditions during production',
      'Store EM products properly to maintain viability',
      'Test EM effectiveness before large-scale use'
    ]
  },
  {
    condition: 'Organic Certification Requirements',
    recommendation: 'Use homemade EM products for certified organic production',
    fertilizers: ['mother-em-solution', 'indigenous-microorganism-soil', 'em-bokashi-bran'],
    timing: 'Integrate into organic management system',
    precautions: [
      'Document all production processes for certification',
      'Use only approved ingredients and methods',
      'Maintain records of application rates and timing',
      'Ensure compliance with organic standards'
    ]
  },
  {
    condition: 'Cost Reduction in Organic Farming',
    recommendation: 'Replace expensive commercial EM with homemade alternatives',
    fertilizers: ['mother-em-solution', 'em-bokashi-bran'],
    timing: 'Establish production system at start of season',
    precautions: [
      'Invest time in learning proper production techniques',
      'Start with small batches to perfect methods',
      'Maintain consistent quality control',
      'Scale up production gradually'
    ]
  }
];

// Get fertilizer by ID
export function getFertilizerById(id: string): FertilizerRecipe | undefined {
  return ORGANIC_FERTILIZERS.find(fertilizer => fertilizer.id === id);
}

// Get fertilizers by type
export function getFertilizersByType(type: string): FertilizerRecipe[] {
  return ORGANIC_FERTILIZERS.filter(fertilizer => fertilizer.type === type);
}

// Get fertilizers by difficulty
export function getFertilizersByDifficulty(difficulty: string): FertilizerRecipe[] {
  return ORGANIC_FERTILIZERS.filter(fertilizer => fertilizer.difficulty === difficulty);
}

// Get weather-based recommendations
export function getWeatherRecommendations(
  temperature: number,
  humidity: number,
  isRaining: boolean,
  weatherText: string
): WeatherBasedRecommendation[] {
  const recommendations: WeatherBasedRecommendation[] = [];
  const currentMonth = new Date().getMonth();
  const isMonsoon = currentMonth >= 5 && currentMonth <= 9; // June to October
  const isPostMonsoon = currentMonth >= 9 && currentMonth <= 11; // October to December

  // Temperature-based recommendations
  if (temperature > 85) {
    recommendations.push(WEATHER_RECOMMENDATIONS.find(r => r.condition === 'Hot Weather (>85°F)')!);
  } else if (temperature < 75 && humidity < 70) {
    recommendations.push(WEATHER_RECOMMENDATIONS.find(r => r.condition === 'Cool, Cloudy Weather')!);
  }

  // Seasonal recommendations
  if (isMonsoon && (humidity > 80 || isRaining)) {
    recommendations.push(WEATHER_RECOMMENDATIONS.find(r => r.condition === 'Monsoon Season')!);
  } else if (isPostMonsoon) {
    recommendations.push(WEATHER_RECOMMENDATIONS.find(r => r.condition === 'Post-Monsoon')!);
  }

  // Humidity-based recommendations
  if (humidity > 80 && !isMonsoon) {
    recommendations.push(WEATHER_RECOMMENDATIONS.find(r => r.condition === 'High Humidity')!);
  }

  // Rain-based recommendations
  if (weatherText.toLowerCase().includes('rain') || isRaining) {
    if (!isMonsoon) {
      recommendations.push(WEATHER_RECOMMENDATIONS.find(r => r.condition === 'Before Rain')!);
    }
  }

  // Drought stress
  if (weatherText.toLowerCase().includes('dry') && temperature > 80) {
    recommendations.push(WEATHER_RECOMMENDATIONS.find(r => r.condition === 'Drought Stress')!);
  }

  return recommendations;
}

// Get seasonal fertilizer recommendations
export function getSeasonalRecommendations(month: string): FertilizerRecipe[] {
  const seasonMap: { [key: string]: string } = {
    'December': 'Winter', 'January': 'Winter', 'February': 'Winter',
    'March': 'Spring', 'April': 'Spring', 'May': 'Spring',
    'June': 'Summer', 'July': 'Summer', 'August': 'Summer',
    'September': 'Fall', 'October': 'Fall', 'November': 'Fall'
  };

  const season = seasonMap[month];
  return ORGANIC_FERTILIZERS.filter(fertilizer => 
    fertilizer.seasonalUse.includes(season)
  );
}

// Calculate NPK totals for a recipe
export function calculateTotalNPK(recipe: FertilizerRecipe): { n: number; p: number; k: number } {
  return recipe.ingredients.reduce(
    (total, ingredient) => {
      if (ingredient.npkContribution) {
        total.n += ingredient.npkContribution.n;
        total.p += ingredient.npkContribution.p;
        total.k += ingredient.npkContribution.k;
      }
      return total;
    },
    { n: 0, p: 0, k: 0 }
  );
}