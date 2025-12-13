# Elevation Feature ⛰️

## Overview
Display the elevation/altitude of locations in the weather details section.

## Implementation

### What Was Added

#### 1. **Elevation State**
```typescript
const [elevation, setElevation] = useState<{
  metric: number;
  imperial: number;
} | null>(null);
```

#### 2. **Extract Elevation from Location Data**
```typescript
if (locationDetails.GeoPosition.Elevation) {
  setElevation({
    metric: locationDetails.GeoPosition.Elevation.Metric.Value,
    imperial: locationDetails.GeoPosition.Elevation.Imperial.Value,
  });
}
```

#### 3. **Display in Weather Details Grid**
```typescript
{
  icon: '⛰️',
  label: 'Elevation',
  value: `${Math.round(elevation.metric)} m / ${Math.round(elevation.imperial)} ft`,
}
```

## Visual Display

### Weather Details Grid

```
┌──────────────────────────────────────┐
│  Details                             │
│                                      │
│  ┌─────────┐  ┌─────────┐          │
│  │   💨    │  │   💧    │          │
│  │  Wind   │  │Humidity │          │
│  │ 15 mph  │  │  65%    │          │
│  └─────────┘  └─────────┘          │
│                                      │
│  ┌─────────┐  ┌─────────┐          │
│  │   👁️    │  │   🌡️    │          │
│  │Visibility│  │Feels Like│         │
│  │  10 mi  │  │  72°F   │          │
│  └─────────┘  └─────────┘          │
│                                      │
│  ┌─────────┐  ┌─────────┐          │
│  │   ☁️    │  │   🧭    │          │
│  │  Cloud  │  │  Wind   │          │
│  │  Cover  │  │Direction│          │
│  │   45%   │  │   NW    │          │
│  └─────────┘  └─────────┘          │
│                                      │
│  ┌─────────────────────┐            │
│  │        ⛰️           │            │
│  │     Elevation       │            │
│  │   150 m / 492 ft    │            │
│  └─────────────────────┘            │
└──────────────────────────────────────┘
```

## Features

### ✅ Dual Units
- Shows both metric (meters) and imperial (feet)
- Rounded to whole numbers
- Clear formatting

### ✅ Conditional Display
- Only shows if elevation data is available
- Gracefully handles missing data
- No errors if elevation is null

### ✅ Visual Design
- Mountain emoji (⛰️) for easy recognition
- Consistent card styling
- Fits with other weather details

## Data Source

Elevation data comes from AccuWeather's location API:
```typescript
LocationData.GeoPosition.Elevation {
  Metric: { Value: number, Unit: "m" }
  Imperial: { Value: number, Unit: "ft" }
}
```

## Use Cases

### 1. **Mountain/Hill Locations**
- Shows altitude for elevated areas
- Useful for hiking/skiing destinations
- Helps understand temperature variations

### 2. **Coastal vs Inland**
- Sea level (0m) for coastal cities
- Higher elevations for inland areas
- Context for weather patterns

### 3. **Aviation/Travel**
- Useful for pilots
- Travel planning
- Understanding air pressure

## Examples

### Sea Level City (Miami)
```
⛰️ Elevation
0 m / 0 ft
```

### Moderate Elevation (Denver)
```
⛰️ Elevation
1,609 m / 5,280 ft
```

### High Elevation (La Paz)
```
⛰️ Elevation
3,640 m / 11,942 ft
```

### Mountain Peak (Mount Everest Base Camp)
```
⛰️ Elevation
5,364 m / 17,598 ft
```

## Benefits

### For Users
- 📊 **More Information** - Complete location data
- 🏔️ **Context** - Understand altitude effects
- 🌡️ **Temperature** - Elevation affects temperature
- ✈️ **Travel** - Useful for trip planning

### For Weather Understanding
- Higher elevation = Lower temperature
- Higher elevation = Lower air pressure
- Higher elevation = More UV exposure
- Higher elevation = Different weather patterns

## Technical Details

### Data Availability
- ✅ Available for most cities
- ✅ Available for major locations
- ⚠️ May be missing for some small towns
- ⚠️ May be approximate for some areas

### Accuracy
- Typically accurate to ±10 meters
- Based on geographic databases
- May vary by location
- Generally reliable for major cities

### Performance
- No additional API calls needed
- Data comes with location details
- Cached with other location data
- No performance impact

## Future Enhancements

### Planned Features
- [ ] Elevation-based weather insights
- [ ] Altitude sickness warnings (>2,500m)
- [ ] Pressure altitude calculation
- [ ] Elevation profile for routes
- [ ] Comparison with other cities

### Advanced Features
- [ ] Topographic map integration
- [ ] Elevation gain/loss for travel
- [ ] Weather by elevation zones
- [ ] Mountain weather forecasts

## Summary

The elevation feature provides:

1. **Complete Location Data** - Shows altitude information
2. **Dual Units** - Metric and imperial measurements
3. **Conditional Display** - Only shows when available
4. **Clean Design** - Fits with existing UI
5. **No Performance Impact** - Uses existing data

**Status**: ✅ Complete and Working

The elevation is now displayed in the weather details grid when available! ⛰️

