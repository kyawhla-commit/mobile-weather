# Climate Companion 🌤️

A comprehensive weather and farming companion app built with React Native and Expo. Get real-time weather data, farming advice, planting schedules, and more.

## Features

### Weather
- Real-time weather data with AccuWeather API
- 5-day weather forecasts
- Air Quality Index (AQI) monitoring
- Astronomy data (sunrise, sunset, moon phases)
- Severe weather alerts and notifications
- Dynamic weather-themed UI backgrounds
- Offline mode with cached data

### Farming Tools
- Smart planting schedules based on weather
- Elevation-based crop recommendations
- Organic fertilizer guides
- Sustainable farming practices
- Weather-based farming advice

### User Experience
- Multi-language support (English, Spanish, Burmese)
- Dark/Light theme with auto-detection
- Location-based weather (GPS)
- Save multiple cities
- Customizable weather widgets
- Push notifications for weather alerts

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Navigation:** Expo Router
- **Styling:** NativeWind (TailwindCSS)
- **Authentication:** Clerk
- **State Management:** React Context
- **Storage:** AsyncStorage, SecureStore
- **Charts:** react-native-chart-kit

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- EAS CLI (for builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/kyawhla-commit/mobile-weather.git
cd mobile-weather

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_ACCUWEATHER_API_KEY=your_accuweather_key
EXPO_PUBLIC_WEATHER_PROVIDER=accuweather
```

### Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Project Structure

```
src/
├── app/                    # Expo Router screens
│   ├── (app)/             # Authenticated screens
│   │   ├── tabs/          # Bottom tab navigation
│   │   ├── add-city.tsx
│   │   ├── air-quality.tsx
│   │   ├── astronomy.tsx
│   │   ├── farming-advice.tsx
│   │   ├── planting-schedule.tsx
│   │   └── ...
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── components/            # Reusable components
├── context/              # React Context providers
├── locales/              # i18n translations
├── services/             # API and business logic
└── utils/                # Helper functions
```

## Building for Production

### Using EAS Build

```bash
# Configure EAS secrets (do this once)
eas secret:create --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "your_key"
eas secret:create --name EXPO_PUBLIC_ACCUWEATHER_API_KEY --value "your_key"
eas secret:create --name EXPO_PUBLIC_WEATHER_PROVIDER --value "accuweather"

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

## API Keys Setup

1. **Clerk Authentication:** Get your publishable key from [Clerk Dashboard](https://dashboard.clerk.com)
2. **AccuWeather API:** Get your API key from [AccuWeather Developer](https://developer.accuweather.com)

## License

MIT License
