import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {
  ORGANIC_FERTILIZERS,
  getFertilizersByType,
  getFertilizersByDifficulty,
  getWeatherRecommendations,
  getSeasonalRecommendations,
  getFertilizerById,
  type FertilizerRecipe,
  type WeatherBasedRecommendation,
} from '../../services/organicFertilizer';

const { width } = Dimensions.get('window');

export default function OrganicFertilizer() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedView, setSelectedView] = useState<'recipes' | 'weather' | 'seasonal' | 'disease'>('recipes');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'liquid' | 'solid' | 'compost' | 'tea'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'moderate' | 'advanced'>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<FertilizerRecipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const temperature = parseFloat(params.temperature as string) || 75;
  const humidity = parseFloat(params.humidity as string) || 60;
  const weatherText = params.weatherText as string || 'Clear';
  const cityName = params.cityName as string || 'Your Location';

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const isRaining = weatherText.toLowerCase().includes('rain');

  // Get filtered fertilizers
  const getFilteredFertilizers = (): FertilizerRecipe[] => {
    let filtered = ORGANIC_FERTILIZERS;

    if (selectedFilter !== 'all') {
      filtered = getFertilizersByType(selectedFilter);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(f => f.difficulty === selectedDifficulty);
    }

    return filtered;
  };

  const weatherRecommendations = getWeatherRecommendations(temperature, humidity, isRaining, weatherText);
  const seasonalFertilizers = getSeasonalRecommendations(currentMonth);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'moderate': return '#F59E0B';
      case 'advanced': return colors.error;
      default: return colors.textSecondary;
    }
  };

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

  const renderRecipeCard = (recipe: FertilizerRecipe) => (
    <TouchableOpacity
      key={recipe.id}
      onPress={() => {
        setSelectedRecipe(recipe);
        setShowRecipeModal(true);
      }}
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: recipe.color,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: recipe.color + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
          <Text style={{ fontSize: 24 }}>{recipe.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
            {recipe.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <View
              style={{
                backgroundColor: getDifficultyColor(recipe.difficulty) + '20',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
              }}>
              <Text
                style={{
                  color: getDifficultyColor(recipe.difficulty),
                  fontSize: 11,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}>
                {recipe.difficulty}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.primaryLight,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
              }}>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '600' }}>
                {recipe.type.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
            NPK: {recipe.npkRatio.n}-{recipe.npkRatio.p}-{recipe.npkRatio.k} • {recipe.preparationTime}
          </Text>
        </View>
        <AntDesign name="right" size={20} color={colors.textSecondary} />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {recipe.bestFor.slice(0, 3).map((crop, index) => (
          <View
            key={index}
            style={{
              backgroundColor: colors.background,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}>
            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
              {crop}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderRecipeModal = () => {
    if (!selectedRecipe) return null;

    return (
      <Modal
        visible={showRecipeModal}
        animationType="slide"
        presentationStyle="pageSheet">
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
              onPress={() => setShowRecipeModal(false)}
              style={{ marginRight: 16 }}>
              <AntDesign name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                {selectedRecipe.name}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                {selectedRecipe.type} • {selectedRecipe.difficulty}
              </Text>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            
            {/* Recipe Header */}
            <View
              style={{
                backgroundColor: selectedRecipe.color,
                borderRadius: 20,
                padding: 20,
                marginBottom: 24,
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 60, marginBottom: 12 }}>{selectedRecipe.icon}</Text>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                {selectedRecipe.name}
              </Text>
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>PREP TIME</Text>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    {selectedRecipe.preparationTime}
                  </Text>
                </View>
                {selectedRecipe.fermentationTime && (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>FERMENT</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                      {selectedRecipe.fermentationTime}
                    </Text>
                  </View>
                )}
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>SHELF LIFE</Text>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    {selectedRecipe.shelfLife}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: 'row',
                  gap: 16,
                }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    {selectedRecipe.npkRatio.n}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>N</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    {selectedRecipe.npkRatio.p}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>P</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    {selectedRecipe.npkRatio.k}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>K</Text>
                </View>
              </View>
            </View>

            {/* Ingredients */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Ingredients
              </Text>
              <View style={{ gap: 8 }}>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 12,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                        {ingredient.name}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>
                        {ingredient.description}
                      </Text>
                      {ingredient.npkContribution && (
                        <Text style={{ color: colors.primary, fontSize: 11 }}>
                          NPK: {ingredient.npkContribution.n}-{ingredient.npkContribution.p}-{ingredient.npkContribution.k}
                        </Text>
                      )}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                        {ingredient.amount}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        {ingredient.unit}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Instructions */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Instructions
              </Text>
              <View style={{ gap: 8 }}>
                {selectedRecipe.instructions.map((instruction, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 12,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                    }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        marginTop: 2,
                      }}>
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={{ flex: 1, color: colors.text, fontSize: 14, lineHeight: 20 }}>
                      {instruction}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Application Method */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Application Method
              </Text>
              <View style={{ gap: 8 }}>
                {selectedRecipe.applicationMethod.map((method, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.success + '20',
                      borderRadius: 12,
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🌱</Text>
                    <Text style={{ flex: 1, color: colors.text, fontSize: 14 }}>
                      {method}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Benefits */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Benefits
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {selectedRecipe.benefits.map((benefit, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.primaryLight,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                    }}>
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                      ✓ {benefit}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Best For */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Best For
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {selectedRecipe.bestFor.map((crop, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.card,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}>
                    <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>
                      {crop}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Weather Considerations */}
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Weather Considerations
              </Text>
              <View style={{ gap: 8 }}>
                {selectedRecipe.weatherConsiderations.map((consideration, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#F59E0B' + '20',
                      borderRadius: 12,
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>⚠️</Text>
                    <Text style={{ flex: 1, color: colors.text, fontSize: 14 }}>
                      {consideration}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderRecipesView = () => (
    <View style={{ gap: 20 }}>
      {/* Filters */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
          Filter by Type
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {['all', 'liquid', 'solid', 'compost', 'tea'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedFilter(type as any)}
              style={{
                backgroundColor: selectedFilter === type ? colors.primary : colors.card,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedFilter === type ? colors.primary : colors.border,
              }}>
              <Text
                style={{
                  color: selectedFilter === type ? 'white' : colors.text,
                  fontSize: 14,
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
          Filter by Difficulty
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {['all', 'easy', 'moderate', 'advanced'].map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              onPress={() => setSelectedDifficulty(difficulty as any)}
              style={{
                backgroundColor: selectedDifficulty === difficulty ? colors.primary : colors.card,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedDifficulty === difficulty ? colors.primary : colors.border,
              }}>
              <Text
                style={{
                  color: selectedDifficulty === difficulty ? 'white' : colors.text,
                  fontSize: 14,
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}>
                {difficulty}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recipe Cards */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Organic Fertilizer Recipes ({getFilteredFertilizers().length})
        </Text>
        {getFilteredFertilizers().map(renderRecipeCard)}
      </View>
    </View>
  );

  const renderWeatherView = () => (
    <View style={{ gap: 20 }}>
      {/* Current Weather Info */}
      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 20,
          padding: 20,
          marginBottom: 4,
        }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 50, marginBottom: 8 }}>🌤️</Text>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
            Current Conditions
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
            {cityName}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
              TEMPERATURE
            </Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
              {Math.round(temperature)}°F
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
              HUMIDITY
            </Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
              {Math.round(humidity)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Weather Recommendations */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Weather-Based Recommendations
        </Text>
        {weatherRecommendations.length > 0 ? (
          <View style={{ gap: 12 }}>
            {weatherRecommendations.map((rec, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: rec.fertilizers.length > 0 ? colors.success : colors.error,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Text style={{ fontSize: 24 }}>
                    {rec.condition.includes('Hot') ? '🌡️' : 
                     rec.condition.includes('Rain') ? '🌧️' : 
                     rec.condition.includes('Humidity') ? '💧' : 
                     rec.condition.includes('Cool') ? '☁️' : '🌿'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                      {rec.condition}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                      {rec.timing}
                    </Text>
                  </View>
                </View>

                <Text style={{ color: colors.text, fontSize: 14, marginBottom: 12, lineHeight: 20 }}>
                  {rec.recommendation}
                </Text>

                {rec.fertilizers.length > 0 && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                      Recommended Fertilizers:
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {rec.fertilizers.map((fertilizerId, idx) => {
                        const fertilizer = getFertilizerById(fertilizerId);
                        return fertilizer ? (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => {
                              setSelectedRecipe(fertilizer);
                              setShowRecipeModal(true);
                            }}
                            style={{
                              backgroundColor: colors.primaryLight,
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 12,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 4,
                            }}>
                            <Text style={{ fontSize: 14 }}>{fertilizer.icon}</Text>
                            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                              {fertilizer.name}
                            </Text>
                          </TouchableOpacity>
                        ) : null;
                      })}
                    </View>
                  </View>
                )}

                {rec.precautions.length > 0 && (
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                      Precautions:
                    </Text>
                    <View style={{ gap: 4 }}>
                      {rec.precautions.map((precaution, idx) => (
                        <Text key={idx} style={{ color: colors.textSecondary, fontSize: 13 }}>
                          • {precaution}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 60, marginBottom: 16 }}>🌱</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
              Good Conditions
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>
              Current weather conditions are suitable for most fertilizer applications.
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderSeasonalView = () => (
    <View style={{ gap: 20 }}>
      {/* Current Season Info */}
      <View
        style={{
          backgroundColor: colors.success,
          borderRadius: 20,
          padding: 20,
          marginBottom: 4,
        }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 50, marginBottom: 8 }}>📅</Text>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
            {currentMonth} Fertilizers
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
            Best organic fertilizers for this season
          </Text>
        </View>
      </View>

      {/* Seasonal Fertilizers */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Recommended for {currentMonth} ({seasonalFertilizers.length})
        </Text>
        {seasonalFertilizers.length > 0 ? (
          <View style={{ gap: 12 }}>
            {seasonalFertilizers.map(renderRecipeCard)}
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 60, marginBottom: 16 }}>🌿</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
              Off Season
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>
              Limited fertilizer recommendations for {currentMonth}.
            </Text>
          </View>
        )}
      </View>

      {/* All Season Tips */}
      <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Text style={{ fontSize: 24 }}>💡</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
            Seasonal Tips
          </Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
            • Spring: Focus on nitrogen-rich fertilizers for new growth
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
            • Summer: Use balanced fertilizers and stress-relief formulas
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
            • Fall: Emphasize phosphorus and potassium for root development
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
            • Winter: Prepare compost and plan for next season
          </Text>
        </View>
      </View>
    </View>
  );

  const renderDiseaseView = () => {
    const diseaseControlFertilizers = ORGANIC_FERTILIZERS.filter(f => 
      f.benefits.some(benefit => 
        benefit.toLowerCase().includes('disease') || 
        benefit.toLowerCase().includes('fungal') || 
        benefit.toLowerCase().includes('pest') ||
        benefit.toLowerCase().includes('antibacterial') ||
        benefit.toLowerCase().includes('antifungal')
      )
    );

    return (
      <View style={{ gap: 20 }}>
        {/* Disease Control Header */}
        <View
          style={{
            backgroundColor: '#DC2626',
            borderRadius: 20,
            padding: 20,
            marginBottom: 4,
          }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 50, marginBottom: 8 }}>🛡️</Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
              Disease & Pest Control
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
              Natural solutions for plant health
            </Text>
          </View>
        </View>

        {/* Traditional Remedies */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
            Traditional Natural Remedies ({diseaseControlFertilizers.length})
          </Text>
          <View style={{ gap: 12 }}>
            {diseaseControlFertilizers.map(renderRecipeCard)}
          </View>
        </View>

        {/* Common Problems & Solutions */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 }}>🔬</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              Common Problems & Solutions
            </Text>
          </View>
          <View style={{ gap: 12 }}>
            <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                🦠 Fungal Diseases (Powdery Mildew, Blight)
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                Use: Buttermilk spray, Neem oil, Turmeric-ginger paste
              </Text>
            </View>
            <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                🐛 Soft-bodied Insects (Aphids, Whiteflies)
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                Use: Onion-garlic spray, Neem oil, Turmeric paste
              </Text>
            </View>
            <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                🌱 Soil-borne Diseases (Root rot, Damping off)
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                Use: Ash-lime spray, Cow urine fertilizer, Neem oil
              </Text>
            </View>
            <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                🍃 Bacterial Infections (Leaf spots, Wilts)
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                Use: Turmeric-ginger paste, Buttermilk spray
              </Text>
            </View>
          </View>
        </View>

        {/* Application Tips */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 }}>⚡</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              Quick Action Guide
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • <Text style={{ fontWeight: '600' }}>Prevention:</Text> Apply weekly during disease season
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • <Text style={{ fontWeight: '600' }}>Early Signs:</Text> Apply every 3 days until controlled
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • <Text style={{ fontWeight: '600' }}>Active Infection:</Text> Daily application + remove affected parts
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • <Text style={{ fontWeight: '600' }}>Best Time:</Text> Early morning or late evening
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • <Text style={{ fontWeight: '600' }}>Weather:</Text> Avoid rainy days, apply in dry conditions
            </Text>
          </View>
        </View>
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
            Organic Fertilizers
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            Natural nutrition for your plants
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
            gap: 2,
          }}>
          <TouchableOpacity
            onPress={() => setSelectedView('recipes')}
            style={getViewButtonStyle('recipes')}>
            <Text style={getViewButtonTextStyle('recipes')}>Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView('weather')}
            style={getViewButtonStyle('weather')}>
            <Text style={getViewButtonTextStyle('weather')}>Weather</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView('seasonal')}
            style={getViewButtonStyle('seasonal')}>
            <Text style={getViewButtonTextStyle('seasonal')}>Seasonal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView('disease')}
            style={getViewButtonStyle('disease')}>
            <Text style={getViewButtonTextStyle('disease')}>Disease</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {selectedView === 'recipes' && renderRecipesView()}
        {selectedView === 'weather' && renderWeatherView()}
        {selectedView === 'seasonal' && renderSeasonalView()}
        {selectedView === 'disease' && renderDiseaseView()}
      </ScrollView>

      {renderRecipeModal()}
    </SafeAreaView>
  );
}