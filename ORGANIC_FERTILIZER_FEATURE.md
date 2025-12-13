# Organic Fertilizer Feature

## Overview
The Organic Fertilizer feature provides comprehensive guidance on creating and using natural, homemade fertilizers for sustainable gardening and farming. It includes detailed recipes, weather-based application recommendations, and seasonal timing guidance.

## Features

### 🍃 Recipe Database
**8 Comprehensive Recipes** covering different types and purposes:

#### Liquid Fertilizers
- **Compost Tea** - All-purpose microbial boost (NPK: 2-1-2)
- **Banana Peel Fertilizer** - High potassium for flowering (NPK: 0-3-42)
- **Fish Emulsion** - Nitrogen-rich for leafy growth (NPK: 5-2-2)
- **Seaweed Fertilizer** - Trace minerals and stress relief (NPK: 1-0-5)
- **Nettle Fertilizer** - Growth stimulant (NPK: 4-0.7-3.4)

#### Solid Fertilizers
- **Eggshell Calcium** - Prevents blossom end rot
- **Coffee Grounds Compost** - Slow-release nitrogen (NPK: 2-0.3-0.3)
- **Wood Ash** - High potassium and pH adjustment (NPK: 0-1.5-7)

### 📱 Three-View Interface

#### 1. Recipes View
- **Filter by Type**: Liquid, Solid, Compost, Tea
- **Filter by Difficulty**: Easy, Moderate, Advanced
- **Detailed Recipe Cards** with NPK ratios and best uses
- **Interactive Recipe Modal** with complete instructions

#### 2. Weather View
- **Current Conditions Display**: Temperature and humidity
- **Weather-Based Recommendations**: Optimal timing for applications
- **Condition-Specific Guidance**:
  - Before Rain: Apply solid fertilizers
  - Hot Weather: Avoid applications
  - Cool/Cloudy: Ideal for foliar feeding
  - High Humidity: Soil applications only
  - Drought Stress: Use stress-relief formulas

#### 3. Seasonal View
- **Monthly Recommendations**: Best fertilizers for current month
- **Seasonal Tips**: Spring growth, summer maintenance, fall preparation
- **Climate-Aware Suggestions**: Adapted to local growing seasons

## Recipe Details

### Complete Information for Each Recipe
- **Ingredients List**: Exact amounts and descriptions
- **NPK Contributions**: Nutritional breakdown per ingredient
- **Step-by-Step Instructions**: Detailed preparation process
- **Application Methods**: How to use the finished fertilizer
- **Benefits**: What the fertilizer provides to plants
- **Best For**: Recommended crops and plant types
- **Weather Considerations**: When and when not to apply
- **Shelf Life**: Storage duration and conditions

### Example: Compost Tea Recipe
```
Ingredients:
- 2 cups finished compost
- 1 gallon non-chlorinated water
- 1 tablespoon molasses

Process:
1. Steep compost in water for 24-48 hours
2. Add molasses to feed microorganisms
3. Strain and use within 1 week

Application:
- Dilute 1:1 for foliar spray
- Use undiluted for soil drench
- Apply early morning or evening
```

## Weather Integration

### Smart Recommendations
The feature analyzes current weather conditions to provide optimal application timing:

**Temperature-Based**:
- >85°F: Avoid fertilizing (plant stress)
- <75°F: Ideal for foliar applications

**Humidity-Based**:
- >80%: Soil applications only (disease risk)
- <70%: Safe for foliar feeding

**Precipitation-Based**:
- Before Rain: Apply solid fertilizers for incorporation
- During Drought: Use stress-relief formulas only

### Precautions System
Each weather condition includes specific precautions:
- Risk assessments
- Application modifications
- Timing adjustments
- Safety considerations

## Technical Implementation

### Service Architecture (`src/services/organicFertilizer.ts`)
```typescript
interface FertilizerRecipe {
  id: string;
  name: string;
  type: 'liquid' | 'solid' | 'compost' | 'tea';
  difficulty: 'easy' | 'moderate' | 'advanced';
  npkRatio: { n: number; p: number; k: number };
  ingredients: FertilizerIngredient[];
  instructions: string[];
  applicationMethod: string[];
  benefits: string[];
  weatherConsiderations: string[];
}
```

### Weather Analysis Functions
- `getWeatherRecommendations()`: Analyzes conditions
- `getSeasonalRecommendations()`: Monthly suggestions
- `calculateTotalNPK()`: Nutritional calculations

### Screen Implementation (`src/app/(app)/organic-fertilizer.tsx`)
- **Modal-Based Recipe Details**: Full-screen recipe viewer
- **Dynamic Filtering**: Real-time recipe filtering
- **Weather Integration**: Live condition analysis
- **Responsive Design**: Optimized for mobile viewing

## Navigation Integration

### Multiple Access Points
**Weather Tab**: After city selection with weather data
**City Detail**: Agricultural planning section
**Weather Detail**: After weather charts
**Weather Insights**: Agricultural planning section
**Profile Tab**: Farming features section

### Parameter Passing
```typescript
router.push({
  pathname: '/(app)/organic-fertilizer',
  params: {
    temperature: currentTemp,
    humidity: currentHumidity,
    weatherText: weatherCondition,
    cityName: location,
  },
});
```

## User Experience

### Progressive Disclosure
1. **Overview Cards**: Quick recipe summaries
2. **Detailed Modal**: Complete recipe information
3. **Weather Context**: Condition-specific guidance
4. **Seasonal Timing**: Monthly recommendations

### Visual Design
- **Color-Coded Recipes**: Each recipe has unique color
- **Difficulty Indicators**: Easy (Green), Moderate (Orange), Advanced (Red)
- **NPK Display**: Clear nutritional information
- **Weather Icons**: Visual condition indicators

### Accessibility Features
- **Clear Typography**: Easy-to-read instructions
- **Visual Hierarchy**: Organized information flow
- **Touch-Friendly**: Large tap targets
- **Consistent Navigation**: Familiar interaction patterns

## Benefits

### For Home Gardeners
- **Cost Savings**: Use kitchen scraps and yard waste
- **Sustainability**: Reduce chemical fertilizer dependence
- **Education**: Learn about plant nutrition
- **Customization**: Tailor fertilizers to specific needs

### for Organic Farmers
- **Certification Compliance**: OMRI-approved ingredients
- **Soil Health**: Improve microbial activity
- **Crop Quality**: Enhanced flavor and nutrition
- **Environmental Impact**: Reduce synthetic inputs

### For Agricultural Education
- **Hands-On Learning**: Practical fertilizer making
- **Scientific Understanding**: NPK ratios and plant nutrition
- **Sustainable Practices**: Environmental stewardship
- **Traditional Knowledge**: Time-tested methods

## Recipe Categories

### By Nutrient Focus
**Nitrogen-Rich** (Leafy Growth):
- Fish Emulsion (NPK: 5-2-2)
- Nettle Fertilizer (NPK: 4-0.7-3.4)
- Coffee Grounds (NPK: 2-0.3-0.3)

**Phosphorus-Rich** (Root Development):
- Banana Peel (NPK: 0-3-42)
- Wood Ash (NPK: 0-1.5-7)

**Potassium-Rich** (Flowering/Fruiting):
- Banana Peel (NPK: 0-3-42)
- Seaweed (NPK: 1-0-5)
- Wood Ash (NPK: 0-1.5-7)

**Balanced** (General Purpose):
- Compost Tea (NPK: 2-1-2)

### By Application Method
**Foliar Sprays**:
- Compost Tea (diluted)
- Seaweed Fertilizer
- Fish Emulsion (very diluted)

**Soil Drenches**:
- All liquid fertilizers
- Diluted solid fertilizers

**Soil Amendments**:
- Coffee Grounds Compost
- Eggshell Calcium
- Wood Ash

## Safety and Best Practices

### Preparation Safety
- **Fermentation Precautions**: Proper ventilation
- **Hygiene Standards**: Clean equipment and containers
- **Storage Guidelines**: Cool, dark locations
- **Expiration Monitoring**: Use within shelf life

### Application Safety
- **Dilution Ratios**: Prevent plant burning
- **Timing Considerations**: Avoid stress periods
- **Weather Awareness**: Optimal conditions only
- **Soil Testing**: Monitor pH and nutrient levels

## Future Enhancements

### Planned Features
- **Custom Recipe Builder**: Create personalized formulas
- **Application Scheduler**: Calendar-based reminders
- **Nutrient Calculator**: Precise NPK calculations
- **Photo Documentation**: Visual recipe guides
- **Community Sharing**: User-submitted recipes

### Integration Opportunities
- **Soil Testing**: Connect with soil analysis results
- **Plant Health**: Link to disease/pest management
- **Harvest Tracking**: Correlate fertilizer use with yields
- **Weather Alerts**: Automatic application reminders

This comprehensive organic fertilizer feature transforms kitchen scraps and yard waste into valuable plant nutrition, making sustainable gardening accessible to everyone while providing professional-grade guidance for optimal results.