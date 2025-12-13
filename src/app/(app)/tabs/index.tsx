import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../context/ThemeContext';
import { useCities } from '../../../context/CitiesContext';
import { useSettings } from '../../../context/SettingsContext';
import { AntDesign, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  getCurrentConditions,
  getWeatherIcon,
  get5DayForecast,
  get12HourForecast,
  getCurrentWeatherProvider,
  LocationData,
  CurrentConditions,
  DailyForecast,
  HourlyForecast,
} from '../../../services/weatherAdapter';
import {
  getWeatherAlerts,
  generateSmartAlerts,
  getAirQuality,
  WeatherAlert,
} from '../../../services/weather';
import { getWeatherTheme, isNightTime } from '../../../services/weatherThemes';
import { getMyLocationWeather } from '../../../services/location';
import { useLanguage } from '../../../context/LanguageContext';
import WeatherWidgetManager from '../../../components/WeatherWidgetManager';
import SevereWeatherAlerts from '../../../components/SevereWeatherAlerts';
import LocationPermissionHelper from '../../../components/LocationPermissionHelper';
import { useCustomAlert, AlertTypes } from '../../../components/CustomAlert';
import { alertService } from '../../../services/alertService';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const { colors, isDark } = useTheme();
  const { cities, addCity, removeCity, updateCityWeather } = useCities();
  const { settings, convertTemperature, getTemperatureSymbol } = useSettings();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingMyLocation, setLoadingMyLocation] = useState(false);
  const [myLocationWeather, setMyLocationWeather] = useState<{
    location: LocationData;
    weather: CurrentConditions;
    forecast: DailyForecast[];
    hourlyForecast: HourlyForecast[];
    alerts: WeatherAlert[];
    smartAlerts: Array<{
      type: string;
      severity: 'high' | 'medium' | 'low';
      message: string;
      icon: string;
    }>;
    aqi: any;
  } | null>(null);
  const [showCitiesModal, setShowCitiesModal] = useState(false);
  const [showWidgetManager, setShowWidgetManager] = useState(false);
  const [showSevereAlerts, setShowSevereAlerts] = useState(false);
  const [showLocationHelper, setShowLocationHelper] = useState(false);
  const [locationErrorCode, setLocationErrorCode] = useState<string | undefined>();
  
  const { showAlert, AlertComponent } = useCustomAlert();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const modalSlideAnim = useRef(new Animated.Value(height)).current;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Load my location weather on mount if enabled
  useEffect(() => {
    if (settings.autoLocationEnabled) {
      loadMyLocationWeather();
    }
  }, [settings.autoLocationEnabled]);

  // Load weather for tracked cities
  useEffect(() => {
    loadWeatherForCities();
  }, [cities.length]);

  const loadMyLocationWeather = async () => {
    try {
      setLoadingMyLocation(true);
      const { location } = await getMyLocationWeather();
      
      const [weather, forecast, hourlyForecast, alerts] = await Promise.all([
        getCurrentConditions(location.Key),
        get5DayForecast(location.Key),
        get12HourForecast(location.Key),
        getWeatherAlerts(location.Key),
      ]);

      // Generate smart alerts
      const smartAlerts = generateSmartAlerts(weather, forecast);

      // Get AQI data if coordinates are available
      let aqi = null;
      if (location.GeoPosition) {
        try {
          aqi = await getAirQuality(
            location.GeoPosition.Latitude,
            location.GeoPosition.Longitude
          );
        } catch (error) {
          console.log('Could not load AQI data:', error);
        }
      }

      // Process alerts with alert service
      await alertService.initialize();
      const processedAlerts = alertService.processWeatherData(
        weather,
        forecast,
        alerts,
        location.Key,
        location.LocalizedName
      );

      // Send notifications for new alerts
      await alertService.sendAlertNotifications(processedAlerts);
      
      setMyLocationWeather({ 
        location, 
        weather, 
        forecast, 
        hourlyForecast,
        alerts,
        smartAlerts,
        aqi
      });
    } catch (error: any) {
      console.log('Could not load my location weather:', error);
      
      // Handle specific location errors with user-friendly messages
      if (error?.code === 'SERVICE_DISABLED' || error?.code === 'PERMISSION_DENIED') {
        // Show the location helper instead of just an alert
        setLocationErrorCode(error.code);
        setShowLocationHelper(true);
      }
      
      setMyLocationWeather(null);
    } finally {
      setLoadingMyLocation(false);
    }
  };

  const loadWeatherForCities = async () => {
    if (cities.length === 0) return;

    try {
      await Promise.all(
        cities.map(async (city) => {
          try {
            const weather = await getCurrentConditions(city.Key);
            updateCityWeather(
              city.Key,
              Math.round(weather.Temperature.Imperial.Value),
              weather.WeatherText,
              weather.WeatherIcon
            );
          } catch (error) {
            console.error(`Error loading weather for ${city.LocalizedName}:`, error);
          }
        })
      );
    } catch (error) {
      console.error('Error loading weather for cities:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      settings.autoLocationEnabled ? loadMyLocationWeather() : Promise.resolve(),
      loadWeatherForCities(),
    ]);
    setRefreshing(false);
  };

  const handleRemoveCity = async (cityKey: string) => {
    showAlert(AlertTypes.destructive(
      t('common.remove') + ' ' + t('addCity.title'),
      'Are you sure you want to remove this city?',
      () => removeCity(cityKey)
    ));
  };

  const openCitiesModal = () => {
    setShowCitiesModal(true);
    Animated.spring(modalSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeCitiesModal = () => {
    Animated.timing(modalSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowCitiesModal(false);
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 18) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get weather theme for my location
  const myLocationTheme = myLocationWeather
    ? getWeatherTheme(
        myLocationWeather.weather.WeatherText,
        myLocationWeather.weather.Temperature.Imperial.Value,
        isDark,
        isNightTime()
      )
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          {/* My Location Weather - Hero Section */}
          {myLocationWeather ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                router.push({
                  pathname: '/(app)/city-detail',
                  params: {
                    cityKey: myLocationWeather.location.Key,
                    cityName: myLocationWeather.location.LocalizedName,
                    cityRegion: myLocationWeather.location.AdministrativeArea.LocalizedName,
                    cityCountry: myLocationWeather.location.Country.LocalizedName,
                  },
                });
              }}>
              <LinearGradient
                colors={
                  myLocationTheme && myLocationTheme.gradient.length >= 2
                    ? (myLocationTheme.gradient as [string, string, ...string[]])
                    : isDark
                    ? ['#1e40af', '#3b82f6']
                    : ['#60a5fa', '#93c5fd']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingHorizontal: 24,
                  paddingTop: 20,
                  paddingBottom: 32,
                  borderBottomLeftRadius: 32,
                  borderBottomRightRadius: 32,
                }}>
                
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>
                      {getGreeting()} 👋
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500' }}>
                      {formatDate()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => setShowSevereAlerts(true)}
                      style={{
                        backgroundColor: myLocationWeather?.alerts?.length > 0 || myLocationWeather?.smartAlerts?.length > 0 
                          ? 'rgba(239, 68, 68, 0.9)' 
                          : 'rgba(255,255,255,0.25)',
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <AntDesign name="warning" size={20} color="white" />
                      {(myLocationWeather?.alerts?.length > 0 || myLocationWeather?.smartAlerts?.length > 0) && (
                        <View style={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          backgroundColor: '#EF4444',
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                            {(myLocationWeather?.alerts?.length || 0) + (myLocationWeather?.smartAlerts?.length || 0)}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setShowWidgetManager(true)}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: 'rgba(255,255,255,0.3)',
                      }}>
                      <MaterialCommunityIcons name="widgets" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push('/(app)/add-city')}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: 'rgba(255,255,255,0.3)',
                      }}>
                      <AntDesign name="plus" size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* My Location Badge */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <View style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.9)',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <MaterialCommunityIcons name="crosshairs-gps" size={14} color="white" />
                    <Text style={{ color: 'white', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>
                      MY LOCATION
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}>
                    <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>
                      {formatTime()}
                    </Text>
                  </View>
                </View>

                {/* Location Name */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                  <Feather name="map-pin" size={18} color="white" />
                  <Text style={{ fontSize: 20, fontWeight: '600', color: 'white' }}>
                    {myLocationWeather.location.LocalizedName}
                  </Text>
                  <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>
                    {myLocationWeather.location.AdministrativeArea.LocalizedName}
                  </Text>
                </View>

                {/* Main Weather Display */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 }}>
                      <Text style={{ fontSize: 72, fontWeight: 'bold', color: 'white', lineHeight: 72 }}>
                        {Math.round(convertTemperature(myLocationWeather.weather.Temperature.Imperial.Value))}
                      </Text>
                      <Text style={{ fontSize: 40, fontWeight: '300', color: 'white' }}>
                        {getTemperatureSymbol()}
                      </Text>
                    </View>
                    <View style={{
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 14,
                      alignSelf: 'flex-start',
                      marginBottom: 16,
                    }}>
                      <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>
                        {myLocationWeather.weather.WeatherText}
                      </Text>
                    </View>
                    
                    {/* Quick Stats */}
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="water-outline" size={16} color="rgba(255,255,255,0.9)" />
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' }}>
                          {myLocationWeather.weather.RelativeHumidity}%
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Feather name="wind" size={16} color="rgba(255,255,255,0.9)" />
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' }}>
                          {Math.round(myLocationWeather.weather.Wind.Speed.Imperial.Value)} mph
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Weather Icon */}
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 100 }}>
                      {getWeatherIcon(myLocationWeather.weather.WeatherIcon)}
                    </Text>
                  </View>
                </View>

                {/* 5-Day Mini Forecast */}
                <View style={{ marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                    {myLocationWeather.forecast.slice(0, 5).map((day, index) => {
                      const date = new Date(day.Date);
                      const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
                      
                      return (
                        <View
                          key={index}
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: 16,
                            padding: 12,
                            minWidth: 70,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)',
                          }}>
                          <Text style={{ fontSize: 12, fontWeight: '600', color: 'white', marginBottom: 8 }}>
                            {dayName}
                          </Text>
                          <Text style={{ fontSize: 28, marginBottom: 8 }}>
                            {getWeatherIcon(day.Day.Icon)}
                          </Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
                            {Math.round(convertTemperature(day.Temperature.Maximum.Value))}°
                          </Text>
                          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                            {Math.round(convertTemperature(day.Temperature.Minimum.Value))}°
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : loadingMyLocation ? (
            <View style={{
              paddingHorizontal: 24,
              paddingVertical: 60,
              alignItems: 'center',
              backgroundColor: colors.card,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ color: colors.textSecondary, marginTop: 16, fontSize: 14 }}>
                {t('home.gettingLocation')}
              </Text>
            </View>
          ) : (
            <View style={{
              paddingHorizontal: 24,
              paddingVertical: 40,
              backgroundColor: colors.card,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>
                    {getGreeting()} 👋
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
                    {formatDate()}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => router.push('/(app)/alerts')}
                    style={{
                      backgroundColor: colors.error + '20',
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AntDesign name="warning" size={20} color={colors.error} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push('/(app)/add-city')}
                    style={{
                      backgroundColor: colors.primary,
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AntDesign name="plus" size={22} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={() => {
                  setLocationErrorCode(undefined);
                  setShowLocationHelper(true);
                }}
                style={{
                  backgroundColor: colors.primary + '15',
                  borderRadius: 16,
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  borderWidth: 2,
                  borderColor: colors.primary + '30',
                  borderStyle: 'dashed',
                }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <MaterialCommunityIcons name="crosshairs-gps" size={28} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                    {t('home.enableMyLocation')}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
                    {t('home.getWeatherForLocation')}
                  </Text>
                </View>
                <AntDesign name="right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Actions Section */}
          <View style={{ padding: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
              {t('home.quickActions')}
            </Text>
            
            <View style={{ gap: 12 }}>
              {/* Tracked Cities Button */}
              <TouchableOpacity
                onPress={openCitiesModal}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 20,
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: colors.primary + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}>
                  <Feather name="map-pin" size={26} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                    {t('home.trackedCities')}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                    {cities.length === 0
                      ? t('home.noCitiesAdded')
                      : t('home.citiesTracked', { count: cities.length })}
                  </Text>
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary + '15',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AntDesign name="right" size={18} color={colors.primary} />
                </View>
              </TouchableOpacity>

              {/* Add City Button */}
              <TouchableOpacity
                onPress={() => router.push('/(app)/add-city')}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 20,
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}>
                  <AntDesign name="plus" size={26} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', marginBottom: 4 }}>
                    {t('home.addNewCity')}
                  </Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
                    {t('home.trackWeather')}
                  </Text>
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AntDesign name="right" size={18} color="white" />
                </View>
              </TouchableOpacity>

              {/* Weather Widgets Button */}
              <TouchableOpacity
                onPress={() => setShowWidgetManager(true)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 20,
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: colors.primary + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}>
                  <MaterialCommunityIcons name="widgets" size={26} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                    Weather Widgets
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                    Customize your weather dashboard
                  </Text>
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary + '15',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AntDesign name="right" size={18} color={colors.primary} />
                </View>
              </TouchableOpacity>

              {/* Weather Alerts Button */}
              <TouchableOpacity
                onPress={() => setShowSevereAlerts(true)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 20,
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: colors.error + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}>
                  <AntDesign name="warning" size={26} color={colors.error} />
                  {myLocationWeather && (
                    (myLocationWeather.alerts?.length > 0 || myLocationWeather.smartAlerts?.length > 0)
                  ) && (
                    <View style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      backgroundColor: colors.error,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                        {(myLocationWeather?.alerts?.length || 0) + (myLocationWeather?.smartAlerts?.length || 0)}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                    {t('home.weatherAlerts')}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                    {myLocationWeather && (
                      (myLocationWeather.alerts?.length > 0 || myLocationWeather.smartAlerts?.length > 0)
                    ) 
                      ? `${(myLocationWeather?.alerts?.length || 0) + (myLocationWeather?.smartAlerts?.length || 0)} active alerts`
                      : t('home.viewActiveWarnings')
                    }
                  </Text>
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.error + '15',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AntDesign name="right" size={18} color={colors.error} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Tracked Cities Modal */}
      <Modal
        visible={showCitiesModal}
        transparent
        animationType="none"
        onRequestClose={closeCitiesModal}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={closeCitiesModal}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                maxHeight: height * 0.85,
                transform: [{ translateY: modalSlideAnim }],
              }}>
              {/* Modal Header */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 24,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>
                    {t('home.trackedCities')}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                    {cities.length === 0
                      ? t('home.noCitiesAdded')
                      : t('home.citiesTracked', { count: cities.length })}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={closeCitiesModal}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <AntDesign name="close" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <ScrollView
                style={{ maxHeight: height * 0.7 }}
                contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
                {cities.length === 0 ? (
                  <View style={{
                    alignItems: 'center',
                    paddingVertical: 40,
                  }}>
                    <View style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: colors.primary + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}>
                      <Text style={{ fontSize: 40 }}>🌍</Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' }}>
                      {t('home.noCitiesYet')}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
                      {t('home.addCitiesToTrack')}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        closeCitiesModal();
                        router.push('/(app)/add-city');
                      }}
                      style={{
                        backgroundColor: colors.primary,
                        paddingHorizontal: 28,
                        paddingVertical: 14,
                        borderRadius: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <AntDesign name="plus" size={18} color="white" />
                      <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
                        {t('home.addYourFirstCity')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ gap: 12 }}>
                    {cities.map((city) => {
                      const weatherTheme =
                        city.temperature !== undefined && city.weatherText
                          ? getWeatherTheme(city.weatherText, city.temperature, isDark, isNightTime())
                          : null;

                      return (
                        <TouchableOpacity
                          key={city.Key}
                          onPress={() => {
                            closeCitiesModal();
                            router.push({
                              pathname: '/(app)/city-detail',
                              params: {
                                cityKey: city.Key,
                                cityName: city.LocalizedName,
                                cityRegion: city.AdministrativeArea.LocalizedName,
                                cityCountry: city.Country.LocalizedName,
                              },
                            });
                          }}
                          activeOpacity={0.7}
                          style={{
                            backgroundColor: colors.card,
                            borderRadius: 18,
                            padding: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 8,
                            elevation: 2,
                            borderWidth: 1,
                            borderColor: colors.border,
                          }}>
                          
                          {/* Weather Icon */}
                          <View style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            backgroundColor: weatherTheme ? weatherTheme.gradient[0] + '20' : colors.primary + '15',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 14,
                          }}>
                            {city.weatherIcon !== undefined ? (
                              <Text style={{ fontSize: 36 }}>
                                {getWeatherIcon(city.weatherIcon)}
                              </Text>
                            ) : (
                              <ActivityIndicator size="small" color={colors.primary} />
                            )}
                          </View>

                          {/* City Info */}
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 2 }}>
                              {city.LocalizedName}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>
                              {city.AdministrativeArea.LocalizedName}, {city.Country.LocalizedName}
                            </Text>
                            {city.weatherText && (
                              <View style={{
                                backgroundColor: colors.primary + '15',
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 8,
                                alignSelf: 'flex-start',
                              }}>
                                <Text style={{ fontSize: 11, color: colors.primary, fontWeight: '600' }}>
                                  {city.weatherText}
                                </Text>
                              </View>
                            )}
                          </View>

                          {/* Temperature */}
                          {city.temperature !== undefined ? (
                            <View style={{ alignItems: 'flex-end', marginRight: 12 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.text }}>
                                  {Math.round(convertTemperature(city.temperature))}
                                </Text>
                                <Text style={{ fontSize: 20, fontWeight: '300', color: colors.text }}>
                                  {getTemperatureSymbol()}
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 12 }} />
                          )}

                          {/* Actions */}
                          <View style={{ gap: 8 }}>
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleRemoveCity(city.Key);
                              }}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: colors.error + '15',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <AntDesign name="close" size={14} color={colors.error} />
                            </TouchableOpacity>
                            <View style={{
                              width: 32,
                              height: 32,
                              borderRadius: 16,
                              backgroundColor: colors.primary + '15',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <AntDesign name="right" size={14} color={colors.primary} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}

                    {/* Add More Button */}
                    <TouchableOpacity
                      onPress={() => {
                        closeCitiesModal();
                        router.push('/(app)/add-city');
                      }}
                      style={{
                        backgroundColor: colors.primary + '15',
                        borderRadius: 18,
                        padding: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        borderWidth: 2,
                        borderColor: colors.primary + '30',
                        borderStyle: 'dashed',
                        marginTop: 8,
                      }}>
                      <AntDesign name="plus" size={20} color={colors.primary} />
                      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>
                        {t('home.addMoreCities')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Weather Widget Manager */}
      {myLocationWeather && (
        <WeatherWidgetManager
          visible={showWidgetManager}
          onClose={() => setShowWidgetManager(false)}
          weatherData={{
            currentWeather: myLocationWeather.weather,
            forecast: myLocationWeather.forecast,
            hourlyForecast: myLocationWeather.hourlyForecast,
            alerts: myLocationWeather.alerts,
            aqi: myLocationWeather.aqi,
          }}
          cityName={myLocationWeather.location.LocalizedName}
        />
      )}

      {/* Severe Weather Alerts */}
      {myLocationWeather && (
        <SevereWeatherAlerts
          visible={showSevereAlerts}
          onClose={() => setShowSevereAlerts(false)}
          alerts={myLocationWeather.alerts}
          smartAlerts={myLocationWeather.smartAlerts}
          cityName={myLocationWeather.location.LocalizedName}
        />
      )}

      {/* Location Permission Helper */}
      <Modal
        visible={showLocationHelper}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLocationHelper(false)}
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-end p-4 pt-12">
            <TouchableOpacity
              onPress={() => setShowLocationHelper(false)}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Text className="text-gray-600 text-lg">×</Text>
            </TouchableOpacity>
          </View>
          
          <LocationPermissionHelper
            onLocationEnabled={() => {
              setShowLocationHelper(false);
              setLocationErrorCode(undefined);
              loadMyLocationWeather();
            }}
            onSkip={() => {
              setShowLocationHelper(false);
              setLocationErrorCode(undefined);
            }}
            errorCode={locationErrorCode}
          />
        </View>
      </Modal>

      {AlertComponent}
    </SafeAreaView>
  );
}
