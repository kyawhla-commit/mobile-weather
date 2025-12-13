# 🌤️ Weather API Setup Guide

## Quick Switch Between APIs

Your weather app now supports **4 different weather APIs**. You can easily switch between them by changing one environment variable.

## 📋 API Options

### 1. 🌱 WeatherAPI.com (Low cost + easy integration)
- **Cost**: Free tier (1M calls/month), then $4/month
- **Best for**: Small apps, prototyping, cost-conscious projects
- **Features**: Simple API, air quality, astronomy data
- **Signup**: https://www.weatherapi.com/

### 2. ⚖️ OpenWeatherMap (Good balance + reliability)  
- **Cost**: Free tier (1K calls/day), then $40/month for 100K calls
- **Best for**: Most production apps, good balance of features/cost
- **Features**: One Call API, historical data, weather maps
- **Signup**: https://openweathermap.org/api

### 3. 🏢 AccuWeather (Enterprise accuracy & brand reputation)
- **Cost**: Premium pricing, contact for quotes
- **Best for**: Enterprise apps, high accuracy requirements
- **Features**: Detailed forecasts, weather alerts, minute-by-minute precipitation
- **Signup**: https://developer.accuweather.com/

### 4. 📍 Tomorrow.io (Hyperlocal precision)
- **Cost**: Free tier (500 calls/day), then $99/month
- **Best for**: Apps needing hyperlocal accuracy, weather intelligence
- **Features**: Hyperlocal forecasts, weather intelligence, advanced analytics
- **Signup**: https://www.tomorrow.io/weather-api/

## 🚀 Setup Instructions

### Step 1: Choose Your API
Add these environment variables to your `.env.local` file:

```bash
# Choose your weather provider (accuweather, weatherapi, openweathermap, tomorrow)
EXPO_PUBLIC_WEATHER_PROVIDER=weatherapi

# Add API keys for the providers you want to use
EXPO_PUBLIC_ACCUWEATHER_API_KEY=your_accuweather_key_here
EXPO_PUBLIC_WEATHERAPI_KEY=your_weatherapi_key_here  
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_openweather_key_here
EXPO_PUBLIC_TOMORROW_API_KEY=your_tomorrow_key_here
```

### Step 2: Get API Keys

#### WeatherAPI.com (Recommended for testing)
1. Go to https://www.weatherapi.com/
2. Sign up for free account
3. Get your API key from dashboard
4. Add to `.env.local`: `EXPO_PUBLIC_WEATHERAPI_KEY=your_key`

#### OpenWeatherMap (Recommended for production)
1. Go to https://openweathermap.org/api
2. Sign up and verify email
3. Get API key from "API keys" tab
4. Add to `.env.local`: `EXPO_PUBLIC_OPENWEATHER_API_KEY=your_key`

#### AccuWeather (Current setup)
- You already have this configured
- Keep using: `EXPO_PUBLIC_ACCUWEATHER_API_KEY=your_key`

#### Tomorrow.io (Premium option)
1. Go to https://www.tomorrow.io/weather-api/
2. Sign up for account
3. Get API key from dashboard
4. Add to `.env.local`: `EXPO_PUBLIC_TOMORROW_API_KEY=your_key`

### Step 3: Switch Provider
Change the provider in your `.env.local`:

```bash
# For free testing
EXPO_PUBLIC_WEATHER_PROVIDER=weatherapi

# For production reliability  
EXPO_PUBLIC_WEATHER_PROVIDER=openweathermap

# For enterprise features (current)
EXPO_PUBLIC_WEATHER_PROVIDER=accuweather

# For hyperlocal accuracy
EXPO_PUBLIC_WEATHER_PROVIDER=tomorrow
```

### Step 4: Update Your Code
Replace your current weather service imports:

```typescript
// OLD - Direct AccuWeather usage
import { searchLocation, getCurrentConditions } from './services/weather';

// NEW - Unified weather service
import { searchLocations, getCurrentWeather } from './services/weatherService';
```

## 🔄 Migration Guide

### Update Weather Components
Replace your existing weather calls:

```typescript
// Before
const locations = await searchLocation(query);
const weather = await getCurrentConditions(locationKey);

// After  
const locations = await searchLocations(query);
const weather = await getCurrentWeather(location);
```

### Benefits of New System
- ✅ **Easy switching**: Change provider with one environment variable
- ✅ **Unified interface**: Same code works with all APIs
- ✅ **Fallback support**: Switch providers if one fails
- ✅ **Cost optimization**: Use free tiers for development, premium for production
- ✅ **Feature comparison**: Test different providers easily

## 💰 Cost Comparison

| Provider | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| WeatherAPI.com | 1M calls/month | $4/month | Development, small apps |
| OpenWeatherMap | 1K calls/day | $40/month (100K calls) | Most production apps |
| AccuWeather | Limited | Contact sales | Enterprise, high accuracy |
| Tomorrow.io | 500 calls/day | $99/month | Hyperlocal, advanced features |

## 🧪 Testing Different APIs

You can easily test all APIs by changing the environment variable:

```bash
# Test WeatherAPI.com
EXPO_PUBLIC_WEATHER_PROVIDER=weatherapi npm start

# Test OpenWeatherMap  
EXPO_PUBLIC_WEATHER_PROVIDER=openweathermap npm start

# Test Tomorrow.io
EXPO_PUBLIC_WEATHER_PROVIDER=tomorrow npm start
```

## 📱 Production Recommendations

### For Small Apps (< 10K users)
- **Primary**: WeatherAPI.com (free tier)
- **Backup**: OpenWeatherMap (free tier)

### For Medium Apps (10K - 100K users)  
- **Primary**: OpenWeatherMap ($40/month)
- **Backup**: WeatherAPI.com ($4/month)

### For Large Apps (100K+ users)
- **Primary**: AccuWeather (enterprise)
- **Backup**: Tomorrow.io (premium)

## 🔧 Advanced Configuration

You can also switch providers programmatically:

```typescript
import { getCurrentProvider, getProviderInfo } from './services/weatherService';

console.log('Current provider:', getCurrentProvider());
console.log('Provider info:', getProviderInfo());
```

## 🚨 Important Notes

1. **API Keys**: Keep your API keys secure and never commit them to version control
2. **Rate Limits**: Each provider has different rate limits - monitor usage
3. **Data Format**: The unified service handles format conversion automatically
4. **Caching**: Consider implementing caching to reduce API calls
5. **Error Handling**: Test error scenarios with each provider

## 📞 Support

If you need help choosing the right API for your use case:
- **Budget-conscious**: Start with WeatherAPI.com
- **Balanced needs**: Use OpenWeatherMap  
- **Enterprise**: Stick with AccuWeather
- **Hyperlocal**: Try Tomorrow.io