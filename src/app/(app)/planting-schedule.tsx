import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {
  getClimateZone,
  generateMonthlyCalendar,
  getCurrentPlantingRecommendations,
  PLANTING_SCHEDULES,
  CLIMATE_ZONES,
  type MonthlyActivity,
} from '../../services/plantingSchedule';

const { width } = Dimensions.get('window');

export default function PlantingSchedule() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedView, setSelectedView] = useState<'current' | 'calendar' | 'crops'>('current');
  const [selectedCrop, setSelectedCrop] = useState<string>('Rice');
  const [monthlyCalendar, setMonthlyCalendar] = useState<MonthlyActivity[]>([]);

  const temperature = parseFloat(params.temperature as string) || 25;
  const cityName = params.cityName as string || 'Your Location';
  
  const climateZone = getClimateZone(temperature);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  useEffect(() => {
    const calendar = generateMonthlyCalendar(climateZone);
    setMonthlyCalendar(calendar);
  }, [climateZone]);

  const currentRecommendations = getCurrentPlantingRecommendations(currentMonth, climateZone);
  const climateInfo = CLIMATE_ZONES[climateZone];

  const getViewButtonStyle = (view: string) => ({
    backgroundColor: selectedView === view ? colors.primary : colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center' as const,
  });

  const getViewButtonTextStyle = (view: string) => ({
    color: selectedView === view ? 'white' : colors.text,
    fontSize: 14,
    fontWeight: '600' as const,
  });

  const renderCurrentRecommendations = () => (
    <View style={{ gap: 20 }}>
      {/* Climate Zone Info */}
      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 20,
          padding: 20,
          marginBottom: 4,
        }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 50, marginBottom: 8 }}>🌍</Text>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
            {climateInfo.name} Zone
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
            {climateInfo.description}
          </Text>
        </View>

        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
            GROWING SEASON
          </Text>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
            {climateInfo.growingSeason}
          </Text>
        </View>
      </View>

      {/* Plant Now Section */}
      <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.success,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 20 }}>🌱</Text>
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
              Plant This Month
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              {currentMonth} recommendations
            </Text>
          </View>
        </View>

        {currentRecommendations.plantNow.length > 0 ? (
          <View style={{ gap: 12 }}>
            {currentRecommendations.plantNow.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: item.optimal ? colors.success + '20' : colors.primaryLight,
                  borderRadius: 12,
                  padding: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: item.optimal ? colors.success : colors.primary,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Text style={{ fontSize: 24 }}>
                    {PLANTING_SCHEDULES[item.crop]?.[climateZone]?.growthStages[0]?.icon || '🌱'}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                    {item.crop}
                  </Text>
                  {item.optimal && (
                    <View
                      style={{
                        backgroundColor: colors.success,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}>
                      <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                        OPTIMAL
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                  {item.reason}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>🌾</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>
              No optimal planting recommendations for {currentMonth} in your climate zone.
            </Text>
          </View>
        )}
      </View>

      {/* Harvest Now Section */}
      {currentRecommendations.harvestNow.length > 0 && (
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#F59E0B',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 20 }}>✂️</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
              Harvest This Month
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {currentRecommendations.harvestNow.map((crop, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#F59E0B' + '20',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#F59E0B' + '40',
                }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>
                  ✂️ {crop}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderMonthlyCalendar = () => (
    <View style={{ gap: 16 }}>
      {monthlyCalendar.map((month, index) => {
        const isCurrentMonth = month.month === currentMonth;
        const hasActivities = 
          month.activities.planting.length > 0 || 
          month.activities.harvesting.length > 0 || 
          month.activities.maintenance.length > 0;

        return (
          <View
            key={index}
            style={{
              backgroundColor: isCurrentMonth ? colors.primary + '20' : colors.card,
              borderRadius: 16,
              padding: 16,
              borderWidth: isCurrentMonth ? 2 : 0,
              borderColor: colors.primary,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 24 }}>📅</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                {month.month}
              </Text>
              {isCurrentMonth && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                    CURRENT
                  </Text>
                </View>
              )}
            </View>

            {hasActivities ? (
              <View style={{ gap: 12 }}>
                {month.activities.planting.length > 0 && (
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.success, marginBottom: 6 }}>
                      🌱 Planting
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {month.activities.planting.map((crop, idx) => (
                        <View
                          key={idx}
                          style={{
                            backgroundColor: colors.success + '20',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 8,
                          }}>
                          <Text style={{ fontSize: 11, color: colors.text }}>
                            {crop}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {month.activities.harvesting.length > 0 && (
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#F59E0B', marginBottom: 6 }}>
                      ✂️ Harvesting
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {month.activities.harvesting.map((crop, idx) => (
                        <View
                          key={idx}
                          style={{
                            backgroundColor: '#F59E0B' + '20',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 8,
                          }}>
                          <Text style={{ fontSize: 11, color: colors.text }}>
                            {crop}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {month.activities.maintenance.length > 0 && (
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary, marginBottom: 6 }}>
                      🔧 Maintenance
                    </Text>
                    <View style={{ gap: 4 }}>
                      {month.activities.maintenance.slice(0, 3).map((task, idx) => (
                        <Text key={idx} style={{ fontSize: 12, color: colors.textSecondary }}>
                          • {task}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <Text style={{ color: colors.textSecondary, fontSize: 12, fontStyle: 'italic' }}>
                No major activities scheduled
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );

  const renderCropDetails = () => {
    const cropSchedule = PLANTING_SCHEDULES[selectedCrop]?.[climateZone];
    
    if (!cropSchedule) {
      return (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>🌾</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
            No Data Available
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>
            Planting schedule for {selectedCrop} is not available for your climate zone.
          </Text>
        </View>
      );
    }

    return (
      <View style={{ gap: 20 }}>
        {/* Crop Selection */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
            Select Crop
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {Object.keys(PLANTING_SCHEDULES).map((crop) => (
              <TouchableOpacity
                key={crop}
                onPress={() => setSelectedCrop(crop)}
                style={{
                  backgroundColor: selectedCrop === crop ? colors.primary : colors.background,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: selectedCrop === crop ? colors.primary : colors.border,
                }}>
                <Text
                  style={{
                    color: selectedCrop === crop ? 'white' : colors.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}>
                  {crop}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Planting Windows */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 }}>🗓️</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
              Planting Windows
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            {cropSchedule.plantingWindows.map((window, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: window.optimal ? colors.success + '20' : colors.primaryLight,
                  borderRadius: 12,
                  padding: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: window.optimal ? colors.success : colors.primary,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                    {window.start} - {window.end}
                  </Text>
                  {window.optimal && (
                    <View
                      style={{
                        backgroundColor: colors.success,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}>
                      <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                        OPTIMAL
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                  {window.reason}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Growth Stages */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 }}>📈</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
              Growth Timeline
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            {cropSchedule.growthStages.map((stage, index) => (
              <View key={index} style={{ flexDirection: 'row', gap: 16 }}>
                <View style={{ alignItems: 'center', width: 60 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.primary + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}>
                    <Text style={{ fontSize: 20 }}>{stage.icon}</Text>
                  </View>
                  <Text style={{ fontSize: 10, color: colors.textSecondary, textAlign: 'center' }}>
                    {stage.duration}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                    {stage.stage}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8, lineHeight: 18 }}>
                    {stage.description}
                  </Text>
                  <View style={{ gap: 4 }}>
                    {stage.tips.slice(0, 2).map((tip, tipIndex) => (
                      <Text key={tipIndex} style={{ fontSize: 12, color: colors.textSecondary }}>
                        • {tip}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Harvest Time */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Text style={{ fontSize: 24 }}>✂️</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
              Harvest Time
            </Text>
          </View>
          <Text style={{ fontSize: 16, color: colors.text, lineHeight: 22 }}>
            {cropSchedule.harvestTime}
          </Text>
        </View>

        {/* Frost Considerations */}
        {cropSchedule.frostConsiderations.length > 0 && (
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 24 }}>❄️</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                Frost Considerations
              </Text>
            </View>
            <View style={{ gap: 8 }}>
              {cropSchedule.frostConsiderations.map((consideration, index) => (
                <Text key={index} style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
                  • {consideration}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
            What Time to Grow
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            {cityName}
          </Text>
        </View>
      </View>

      {/* View Toggle */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 4,
            gap: 4,
          }}>
          <TouchableOpacity
            onPress={() => setSelectedView('current')}
            style={getViewButtonStyle('current')}>
            <Text style={getViewButtonTextStyle('current')}>Current</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView('calendar')}
            style={getViewButtonStyle('calendar')}>
            <Text style={getViewButtonTextStyle('calendar')}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView('crops')}
            style={getViewButtonStyle('crops')}>
            <Text style={getViewButtonTextStyle('crops')}>Crops</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {selectedView === 'current' && renderCurrentRecommendations()}
        {selectedView === 'calendar' && renderMonthlyCalendar()}
        {selectedView === 'crops' && renderCropDetails()}
      </ScrollView>
    </SafeAreaView>
  );
}