import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {
  getCropRecommendations,
  CropRecommendation,
} from '../../services/elevationCrops';

export default function ElevationCrops() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const elevation = parseFloat(params.elevation as string);
  const cityName = params.cityName as string;

  const { zone, recommendations } = getCropRecommendations(elevation);

  const groupedCrops = recommendations.reduce((acc, crop) => {
    if (!acc[crop.category]) {
      acc[crop.category] = [];
    }
    acc[crop.category].push(crop);
    return acc;
  }, {} as Record<string, CropRecommendation[]>);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10B981';
      case 'moderate':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vegetable':
        return '🥬';
      case 'fruit':
        return '🍎';
      case 'grain':
        return '🌾';
      case 'herb':
        return '🌿';
      case 'flower':
        return '🌸';
      case 'tree':
        return '🌳';
      default:
        return '🌱';
    }
  };

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
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
            What to Grow Here
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            {cityName}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
          }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 60, marginBottom: 8 }}>⛰️</Text>
            <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 4 }}>
              {Math.round(elevation)} m
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 8 }}>
              {Math.round(elevation * 3.28084)} ft
            </Text>
          </View>

          <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
              ELEVATION ZONE
            </Text>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
              {zone.name}
            </Text>
          </View>

          <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
              CLIMATE
            </Text>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
              {zone.climate}
            </Text>
          </View>

          <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16 }}>
            <Text style={{ color: 'white', fontSize: 14, lineHeight: 20 }}>
              {zone.description}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
          Recommended Crops
        </Text>

        {Object.entries(groupedCrops).map(([category, crops]) => (
          <View key={category} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Text style={{ fontSize: 24 }}>{getCategoryIcon(category)}</Text>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, textTransform: 'capitalize' }}>
                {category}s
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              {crops.map((crop, index) => (
                <View key={index} style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Text style={{ fontSize: 28 }}>{crop.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginBottom: 4 }}>
                        {crop.name}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: colors.background }}>
                          <Text style={{ color: getDifficultyColor(crop.difficulty), fontSize: 11, fontWeight: '600', textTransform: 'uppercase' }}>
                            {crop.difficulty}
                          </Text>
                        </View>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                          {crop.growingSeason}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
                    {crop.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20, marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 24 }}>💡</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              Growing Tips
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Start with easy difficulty crops if you are a beginner
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Consider your local weather patterns and frost dates
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Higher elevations have shorter growing seasons
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Use greenhouses to extend the growing season
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Check with local agricultural extension for specific advice
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
