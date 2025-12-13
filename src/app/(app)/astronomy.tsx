import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {
  getSunTimes,
  calculateMoonPhase,
  formatTime,
  formatDuration,
  getCurrentSunPhase,
  SunTimes,
  MoonPhase,
} from '../../services/astronomy';

export default function Astronomy() {
  const { colors } = useTheme();
  const { settings } = useSettings();
  const router = useRouter();
  const params = useLocalSearchParams();

  const cityName = params.cityName as string;
  const lat = parseFloat(params.lat as string) || 37.7749; // Default to SF
  const lon = parseFloat(params.lon as string) || -122.4194;

  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [moonPhase, setMoonPhase] = useState<MoonPhase | null>(null);
  const [currentPhase, setCurrentPhase] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateAstronomy();
    const interval = setInterval(() => {
      if (sunTimes) {
        setCurrentPhase(getCurrentSunPhase(sunTimes));
      }
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [selectedDate]);

  const calculateAstronomy = async () => {
    setLoading(true);
    try {
      // Use real API data for sun times
      const sun = await getSunTimes(selectedDate, lat, lon, true);
      const moon = calculateMoonPhase(selectedDate);
      setSunTimes(sun);
      setMoonPhase(moon);
      setCurrentPhase(getCurrentSunPhase(sun));
    } catch (error) {
      console.error('Error calculating astronomy:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await calculateAstronomy();
    setRefreshing(false);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  if (loading && !sunTimes) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 16 }}>
            <AntDesign name="left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
            Sun & Moon
          </Text>
        </View>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 16 }}>🌅</Text>
          <Text style={{ color: colors.textSecondary }}>
            Loading astronomical data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}>
          <AntDesign name="left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
            Sun & Moon
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            {cityName}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.success + '20',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
          }}>
          <Text
            style={{ color: colors.success, fontSize: 10, fontWeight: '600' }}>
            LIVE DATA
          </Text>
        </View>
      </View>

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
        <View style={{ padding: 20 }}>
          {/* Date Selector */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <TouchableOpacity
              onPress={() => changeDate(-1)}
              style={{
                backgroundColor: colors.card,
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AntDesign name="left" size={20} color={colors.text} />
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: colors.text,
                }}>
                {isToday
                  ? 'Today'
                  : selectedDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => changeDate(1)}
              style={{
                backgroundColor: colors.card,
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AntDesign name="right" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {isToday && (
            <TouchableOpacity
              onPress={() => setSelectedDate(new Date())}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                padding: 12,
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>Today</Text>
            </TouchableOpacity>
          )}

          {/* Current Phase (only for today) */}
          {isToday && currentPhase && (
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: 20,
                padding: 24,
                marginBottom: 20,
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 60, marginBottom: 12 }}>
                {currentPhase.emoji}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 4,
                }}>
                {currentPhase.phase}
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                {currentPhase.description}
              </Text>
            </View>
          )}

          {/* Sun Times */}
          {sunTimes && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 12,
                }}>
                ☀️ Sun Times
              </Text>

              {/* Sunrise & Sunset */}
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>🌅</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        marginBottom: 4,
                      }}>
                      Sunrise
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: colors.text,
                      }}>
                      {formatTime(sunTimes.sunrise, settings.show24HourTime)}
                    </Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: colors.border }} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>🌇</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        marginBottom: 4,
                      }}>
                      Sunset
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: colors.text,
                      }}>
                      {formatTime(sunTimes.sunset, settings.show24HourTime)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    paddingTop: 12,
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Day Length: {formatDuration(sunTimes.dayLength)}
                  </Text>
                </View>
              </View>

              {/* Golden Hour */}
              <View
                style={{
                  backgroundColor: '#FFA500',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 12,
                  }}>
                  ✨ Golden Hour
                </Text>
                <View style={{ gap: 8 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                      Morning
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: 14,
                      }}>
                      {formatTime(
                        sunTimes.goldenHourMorningStart,
                        settings.show24HourTime
                      )}{' '}
                      -{' '}
                      {formatTime(
                        sunTimes.goldenHourMorningEnd,
                        settings.show24HourTime
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                      Evening
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: 14,
                      }}>
                      {formatTime(
                        sunTimes.goldenHourEveningStart,
                        settings.show24HourTime
                      )}{' '}
                      -{' '}
                      {formatTime(
                        sunTimes.goldenHourEveningEnd,
                        settings.show24HourTime
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Blue Hour */}
              <View
                style={{
                  backgroundColor: '#4169E1',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 12,
                  }}>
                  💙 Blue Hour
                </Text>
                <View style={{ gap: 8 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                      Morning
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: 14,
                      }}>
                      {formatTime(
                        sunTimes.blueHourMorningStart,
                        settings.show24HourTime
                      )}{' '}
                      -{' '}
                      {formatTime(
                        sunTimes.blueHourMorningEnd,
                        settings.show24HourTime
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                      Evening
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: 14,
                      }}>
                      {formatTime(
                        sunTimes.blueHourEveningStart,
                        settings.show24HourTime
                      )}{' '}
                      -{' '}
                      {formatTime(
                        sunTimes.blueHourEveningEnd,
                        settings.show24HourTime
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Other Times */}
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 16,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: 12,
                  }}>
                  Other Times
                </Text>
                <View style={{ gap: 8 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                      Solar Noon
                    </Text>
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: '600',
                        fontSize: 14,
                      }}>
                      {formatTime(sunTimes.solarNoon, settings.show24HourTime)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                      Civil Dawn
                    </Text>
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: '600',
                        fontSize: 14,
                      }}>
                      {formatTime(sunTimes.civilDawn, settings.show24HourTime)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                      Civil Dusk
                    </Text>
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: '600',
                        fontSize: 14,
                      }}>
                      {formatTime(sunTimes.civilDusk, settings.show24HourTime)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Moon Phase */}
          {moonPhase && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 12,
                }}>
                🌙 Moon Phase
              </Text>

              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 20,
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                <Text style={{ fontSize: 80, marginBottom: 12 }}>
                  {moonPhase.emoji}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: 4,
                  }}>
                  {moonPhase.phaseName}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginBottom: 16,
                  }}>
                  {moonPhase.illumination.toFixed(1)}% Illuminated
                </Text>
                <View
                  style={{
                    width: '100%',
                    height: 8,
                    backgroundColor: colors.background,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      width: `${moonPhase.illumination}%`,
                      height: '100%',
                      backgroundColor: colors.primary,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    marginTop: 8,
                  }}>
                  Age: {moonPhase.age.toFixed(1)} days
                </Text>
              </View>

              {/* Next Phases */}
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 16,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: 12,
                  }}>
                  Upcoming Phases
                </Text>
                <View style={{ gap: 8 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <Text style={{ fontSize: 20 }}>🌑</Text>
                      <Text style={{ color: colors.text, fontSize: 14 }}>
                        New Moon
                      </Text>
                    </View>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      {moonPhase.nextNewMoon.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <Text style={{ fontSize: 20 }}>🌓</Text>
                      <Text style={{ color: colors.text, fontSize: 14 }}>
                        First Quarter
                      </Text>
                    </View>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      {moonPhase.nextFirstQuarter.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <Text style={{ fontSize: 20 }}>🌕</Text>
                      <Text style={{ color: colors.text, fontSize: 14 }}>
                        Full Moon
                      </Text>
                    </View>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      {moonPhase.nextFullMoon.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <Text style={{ fontSize: 20 }}>🌗</Text>
                      <Text style={{ color: colors.text, fontSize: 14 }}>
                        Last Quarter
                      </Text>
                    </View>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      {moonPhase.nextLastQuarter.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Info */}
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              gap: 12,
            }}>
            <AntDesign name="infocirlce" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                  fontWeight: '600',
                  marginBottom: 4,
                }}>
                About Astronomical Data
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  lineHeight: 18,
                }}>
                Golden hour is perfect for photography. Blue hour provides soft,
                diffused light. Times are calculated for your location.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
