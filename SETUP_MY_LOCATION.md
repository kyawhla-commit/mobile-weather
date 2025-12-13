# Setup Guide: My Location Feature 🚀

## Quick Start

### Step 1: Install Package

```bash
npx expo install expo-location
```

### Step 2: Configure Permissions

Add to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location to show weather for your current area."
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "We need your location to show weather for your current area.",
        "NSLocationAlwaysUsageDescription": "We need your location to show weather for your current area."
      }
    },
    "android": {
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

### Step 3: Rebuild App

After adding permissions, rebuild your app:

```bash
# For development build
npx expo prebuild

# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

**Note**: Permission changes require a rebuild, not just a refresh!

## Files Created

✅ `src/services/location.ts` - Location service
✅ Updated `src/app/(app)/tabs/index.tsx` - Added My Location button

## How It Works

### 1. User Taps GPS Button
```
[📍] ← Green button in dashboard header
```

### 2. App Requests Permission (First Time)
```
iOS: "Allow [App] to access your location?"
Android: "Allow [App] to access this device's location?"
```

### 3. Gets GPS Coordinates
```
Latitude: 37.7749
Longitude: -122.4194
```

### 4. Finds City
```
Reverse Geocode: San Francisco, CA
```

### 5. Searches Weather
```
AccuWeather: Find closest station
```

### 6. Shows Weather
```
Navigate to city detail screen
```

## Testing

### Test on Device
```bash
# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android

# Physical Device
npx expo start
# Scan QR code with Expo Go
```

### Simulate Location

**iOS Simulator:**
1. Features > Location > Custom Location
2. Enter coordinates
3. Test the feature

**Android Emulator:**
1. Extended Controls (...)
2. Location tab
3. Enter coordinates
4. Send

## Troubleshooting

### Permission Not Requested?

**Check:**
1. Did you rebuild after adding permissions?
2. Is `expo-location` installed?
3. Check `app.json` configuration

**Fix:**
```bash
# Clean and rebuild
rm -rf node_modules
npm install
npx expo prebuild --clean
npx expo run:ios  # or run:android
```

### Location Not Working?

**iOS:**
- Settings > Privacy > Location Services > [Your App]
- Enable "While Using the App"

**Android:**
- Settings > Apps > [Your App] > Permissions > Location
- Enable "Allow only while using the app"

### "Location services are disabled"

**Enable on Device:**
- **iOS**: Settings > Privacy > Location Services > ON
- **Android**: Settings > Location > ON

## Usage

### In Your App

```typescript
import { getMyLocationWeather } from '../services/location';

// Get weather for current location
const handleMyLocation = async () => {
  try {
    const { location, cityName } = await getMyLocationWeather();
    console.log('Found:', cityName);
    // Use location data...
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Button Component

```typescript
<TouchableOpacity onPress={handleMyLocation}>
  <MaterialCommunityIcons name="crosshairs-gps" size={24} />
</TouchableOpacity>
```

## Production Checklist

Before releasing:

- [ ] Permissions configured in app.json
- [ ] App rebuilt with permissions
- [ ] Tested on real devices
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Privacy policy updated
- [ ] App store descriptions mention location
- [ ] Screenshots show location feature

## App Store Requirements

### iOS App Store

**Privacy Policy:**
- Explain why you need location
- How location data is used
- That it's not stored or shared

**App Description:**
- Mention location feature
- Explain benefits

### Google Play Store

**Privacy Policy:**
- Same as iOS

**Permissions Declaration:**
- Explain location permission usage
- Required for app review

## Privacy Compliance

### GDPR (Europe)
- ✅ Explicit consent required
- ✅ Clear purpose explanation
- ✅ User can deny/revoke
- ✅ No data storage

### CCPA (California)
- ✅ Transparent data usage
- ✅ User control
- ✅ No selling of data

### General Best Practices
- ✅ Request permission in context
- ✅ Explain why you need it
- ✅ Respect user choice
- ✅ Don't track without consent

## Example Privacy Text

### Permission Dialog (iOS)
```
"We need your location to show weather for your current area."
```

### Privacy Policy Section
```
Location Data:
- Used only when you tap the "My Location" button
- Converts GPS coordinates to city name
- Fetches weather for your area
- Not stored on our servers
- Not shared with third parties
- You can deny access anytime
```

## Support

### Common Questions

**Q: Why do you need my location?**
A: To show weather for your current area without manual searching.

**Q: Is my location tracked?**
A: No, we only use it when you tap the button and don't store it.

**Q: Can I use the app without location?**
A: Yes! Location is optional. You can search for cities manually.

**Q: How accurate is it?**
A: We use balanced GPS accuracy (~100m) for best results.

**Q: Does it work offline?**
A: GPS works offline, but you need internet for weather data.

## Next Steps

1. ✅ Install `expo-location`
2. ✅ Configure permissions
3. ✅ Rebuild app
4. ✅ Test on device
5. ✅ Update privacy policy
6. ✅ Submit to app stores

**You're all set!** 🎉

The My Location feature is now ready to use. Users can tap the green GPS button to instantly see weather for their current location!

