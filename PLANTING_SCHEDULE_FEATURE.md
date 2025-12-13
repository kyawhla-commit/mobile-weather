# What Time to Grow Feature

## Overview
The "What Time to Grow" feature provides farmers and gardeners with optimal planting schedules, seasonal timing recommendations, and comprehensive growth calendars based on their local climate conditions.

## Features

### 🌍 Climate Zone Detection
- Automatically determines climate zone based on temperature
- Supports Tropical, Subtropical, Temperate, and Continental zones
- Provides zone-specific growing recommendations

### 📅 Current Recommendations
- **Plant This Month**: Shows crops optimal for current month
- **Harvest This Month**: Lists crops ready for harvest
- **Climate-Specific Advice**: Tailored to local growing conditions

### 🗓️ Monthly Calendar
- 12-month planting and harvesting calendar
- Seasonal maintenance activities
- Weather considerations for each month
- Visual indicators for current month

### 🌾 Crop-Specific Details
- **Planting Windows**: Optimal and alternative planting times
- **Growth Timeline**: Complete growth stages with durations
- **Harvest Timing**: When to expect harvest
- **Frost Considerations**: Cold weather planning

## Supported Crops

**Total: 25+ Crop Varieties** across multiple categories and climate zones

### Grains & Cereals
- 🌾 Rice (Tropical & Temperate zones)
- 🌾 Wheat (Temperate zone)
- 🌽 Corn (Temperate zone)

### Vegetables
- 🍅 Tomato (Tropical & Temperate zones)
- 🥔 Potato (Multiple zones)
- 🧅 Onion (Tropical & Temperate zones)
- 🥕 Carrot (Temperate zone)
- 🥬 Lettuce (Temperate & Subtropical zones)
- 🥬 Spinach (Temperate zone)
- 🌶️ Pepper (Tropical & Temperate zones)
- 🥒 Cucumber (Tropical & Temperate zones)
- 🍆 Eggplant (Warm season crop)
- 🌶️ Okra (Hot weather crop)
- 🥬 Cabbage (Cool season crop)
- 🥦 Cauliflower (Cool season crop)
- 🥦 Broccoli (Cool season crop)
- 🫘 Beans (Warm season crop)
- 🟢 Peas (Cool season crop)

### Fruits & Tree Crops
- 🥑 Avocado (Tropical & Subtropical zones)
- 🍌 Banana (Tropical zone)
- 🥭 Mango (Tropical zone)
- 🫐 Papaya (Tropical zone)
- 🍍 Pineapple (Tropical zone)
- 🥥 Coconut (Tropical zone)

### Beverage & Specialty Crops
- ☕ Coffee (Tropical & Subtropical zones)
- 🍫 Cacao (Tropical zone)

### Cash Crops
- 🌱 Cotton (Multiple zones)
- 🫘 Soybean (Multiple zones)
- 🎋 Sugarcane (Tropical zones)

## Navigation

### From Weather Tab
1. Search for a city or use current location
2. View weather details
3. Click "What Time to Grow" card (purple card with 📅 icon)

### From Profile Tab
1. Go to Profile tab
2. Find "Farming Features" section
3. Click "Planting Schedule"

## Screen Views

### Current View
- Climate zone information
- Current month planting recommendations
- Harvest recommendations
- Optimal vs alternative planting times

### Calendar View
- 12-month overview
- Monthly activities (planting, harvesting, maintenance)
- Weather considerations
- Current month highlighting

### Crops View
- Crop selection dropdown
- Detailed planting windows
- Growth stage timeline
- Harvest timing
- Frost considerations

## Technical Implementation

### Services
- `src/services/plantingSchedule.ts` - Core scheduling logic
- Climate zone detection based on temperature
- Monthly calendar generation
- Planting recommendations engine

### Components
- `src/app/(app)/planting-schedule.tsx` - Main screen
- Three-tab interface (Current/Calendar/Crops)
- Responsive design with weather-themed colors

### Data Structure
```typescript
interface PlantingWindow {
  start: string;    // Month name
  end: string;      // Month name  
  optimal: boolean; // Is this the best time?
  reason: string;   // Why this timing?
}

interface GrowthStage {
  stage: string;       // Stage name
  duration: string;    // Time duration
  description: string; // What happens
  icon: string;        // Visual indicator
  tips: string[];      // Helpful tips
}
```

## Usage Examples

### Spring Planning (March)
- **Temperate Zone**: Plant tomatoes indoors, direct sow carrots
- **Tropical Zone**: Second season tomato planting

### Summer Activities (July)
- **Temperate Zone**: Plant fall carrots, harvest spring crops
- **Tropical Zone**: Monsoon rice management

### Fall Preparation (September)
- **Temperate Zone**: Plant winter wheat, harvest corn
- **Tropical Zone**: Post-monsoon crop planning

## Benefits

### For Farmers
- **Maximize Yields**: Plant at optimal times
- **Risk Management**: Avoid frost and extreme weather
- **Resource Planning**: Schedule labor and inputs
- **Crop Rotation**: Plan successive plantings

### For Home Gardeners
- **Success Rate**: Higher germination and growth
- **Seasonal Planning**: Know what to plant when
- **Harvest Timing**: Plan for continuous harvests
- **Learning Tool**: Understand plant growth cycles

## Future Enhancements

### Planned Features
- **Frost Date Integration**: Automatic frost date lookup
- **Soil Temperature**: Include soil temp requirements
- **Companion Planting**: Suggest crop combinations
- **Succession Planting**: Staggered planting schedules
- **Regional Varieties**: Local cultivar recommendations

### Data Expansion
- More crop varieties
- Regional growing guides
- Pest and disease calendars
- Fertilizer schedules
- Irrigation timing

## Integration with Weather Data

The feature integrates with the app's weather system to:
- Determine climate zones from temperature data
- Provide location-specific recommendations
- Consider current weather conditions
- Adapt advice to local climate patterns

## User Experience

### Visual Design
- **Color Coding**: Green for optimal, blue for alternative
- **Icons**: Intuitive crop and activity symbols
- **Progress Indicators**: Growth stage timelines
- **Seasonal Themes**: Weather-appropriate colors

### Accessibility
- Clear typography and contrast
- Intuitive navigation
- Helpful descriptions and tips
- Visual and text indicators

This feature transforms weather data into actionable agricultural guidance, helping users make informed decisions about when to plant, tend, and harvest their crops.