import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {
  SUSTAINABLE_PRACTICES,
  getLocationBasedRecommendations,
  getPracticesByCategory,
  getPracticesByDifficulty,
  getRegionalAdaptation,
  calculatePriorityScore,
  CSA_GROWING_GUIDES,
  CSA_PRACTICES,
  getCSAGuidesByCategory,
  getCSAPracticesByPillar,
  getWeatherDecisions,
  calculateCSAReadinessScore,
  type SustainablePractice,
  type CSAGrowingGuide,
  type CSAPractice,
  type WeatherBasedDecision,
} from '../../services/sustainableFarming';

export default function SustainableFarming() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedView, setSelectedView] = useState<'recommendations' | 'practices' | 'regional' | 'implementation' | 'csa-growing'>('recommendations');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'water' | 'soil' | 'biodiversity' | 'energy' | 'waste' | 'climate'>('all');
  const [selectedPractice, setSelectedPractice] = useState<SustainablePractice | null>(null);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [selectedGrowingGuide, setSelectedGrowingGuide] = useState<CSAGrowingGuide | null>(null);
  const [showGrowingModal, setShowGrowingModal] = useState(false);
  const [selectedCSAPractice, setSelectedCSAPractice] = useState<CSAPractice | null>(null);
  const [showCSAModal, setShowCSAModal] = useState(false);

  const temperature = parseFloat(params.temperature as string) || 25;
  const humidity = parseFloat(params.humidity as string) || 60;
  const elevation = parseFloat(params.elevation as string) || 100;
  const cityName = params.cityName as string || 'Your Location';
  const weatherText = params.weatherText as string || 'Clear';

  const locationRecommendations = getLocationBasedRecommendations(temperature, humidity, elevation, weatherText);
  const regionalAdaptation = getRegionalAdaptation(temperature, elevation, humidity);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.success;
      case 'intermediate': return '#F59E0B';
      case 'advanced': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return colors.success;
      case 'medium': return '#F59E0B';
      case 'high': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water': return '💧';
      case 'soil': return '🌱';
      case 'biodiversity': return '🦋';
      case 'energy': return '⚡';
      case 'waste': return '♻️';
      case 'climate': return '🌍';
      default: return '🌿';
    }
  };

  const getViewButtonStyle = (view: string) => ({
    backgroundColor: selectedView === view ? colors.primary : colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center' as const,
  });

  const getViewButtonTextStyle = (view: string) => ({
    color: selectedView === view ? 'white' : colors.text,
    fontSize: 12,
    fontWeight: '600' as const,
  });

  const renderPracticeCard = (practice: SustainablePractice, showPriority = false) => {
    const priorityScore = showPriority ? calculatePriorityScore(practice, temperature, humidity, elevation) : 0;
    
    return (
      <TouchableOpacity
        key={practice.id}
        onPress={() => {
          setSelectedPractice(practice);
          setShowPracticeModal(true);
        }}
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: practice.color,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: practice.color + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
            <Text style={{ fontSize: 24 }}>{practice.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 }}>
                {practice.name}
              </Text>
              {showPriority && (
                <View
                  style={{
                    backgroundColor: priorityScore >= 8 ? colors.success : priorityScore >= 6 ? '#F59E0B' : colors.textSecondary,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                    marginLeft: 8,
                  }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                    {priorityScore >= 8 ? 'HIGH' : priorityScore >= 6 ? 'MED' : 'LOW'}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <View
                style={{
                  backgroundColor: getDifficultyColor(practice.difficulty) + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    color: getDifficultyColor(practice.difficulty),
                    fontSize: 11,
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                  {practice.difficulty}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: getCostColor(practice.costLevel) + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    color: getCostColor(practice.costLevel),
                    fontSize: 11,
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                  {practice.costLevel} cost
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
                  {practice.timeToImplement}
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
              {practice.description}
            </Text>
          </View>
          <AntDesign name="right" size={20} color={colors.textSecondary} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {practice.benefits.slice(0, 2).map((benefit, index) => (
            <View
              key={index}
              style={{
                backgroundColor: colors.background,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}>
              <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                ✓ {benefit}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommendationsView = () => (
    <View style={{ gap: 20 }}>
      {/* Location Overview */}
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
            {cityName}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
            {locationRecommendations.climateZone} climate • {Math.round(elevation)}m elevation
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
              TEMPERATURE
            </Text>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
              {Math.round(temperature)}°F
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
              HUMIDITY
            </Text>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
              {Math.round(humidity)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Priorities */}
      {locationRecommendations.priorities.length > 0 && (
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 }}>🎯</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              Priority Areas
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {locationRecommendations.priorities.map((priority, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.success + '20',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}>
                <Text style={{ color: colors.success, fontSize: 12, fontWeight: '600' }}>
                  {priority}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Top Recommended Practices */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Recommended Practices ({locationRecommendations.practices.length})
        </Text>
        <View style={{ gap: 12 }}>
          {locationRecommendations.practices
            .sort((a, b) => calculatePriorityScore(b, temperature, humidity, elevation) - calculatePriorityScore(a, temperature, humidity, elevation))
            .slice(0, 5)
            .map(practice => renderPracticeCard(practice, true))}
        </View>
      </View>

      {/* Challenges & Opportunities */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {locationRecommendations.challenges.length > 0 && (
          <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Text style={{ fontSize: 20 }}>⚠️</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                Challenges
              </Text>
            </View>
            <View style={{ gap: 6 }}>
              {locationRecommendations.challenges.slice(0, 3).map((challenge, index) => (
                <Text key={index} style={{ color: colors.textSecondary, fontSize: 12 }}>
                  • {challenge}
                </Text>
              ))}
            </View>
          </View>
        )}

        {locationRecommendations.opportunities.length > 0 && (
          <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Text style={{ fontSize: 20 }}>💡</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                Opportunities
              </Text>
            </View>
            <View style={{ gap: 6 }}>
              {locationRecommendations.opportunities.slice(0, 3).map((opportunity, index) => (
                <Text key={index} style={{ color: colors.textSecondary, fontSize: 12 }}>
                  • {opportunity}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderPracticesView = () => {
    const getFilteredPractices = () => {
      if (selectedCategory === 'all') {
        return SUSTAINABLE_PRACTICES;
      }
      return getPracticesByCategory(selectedCategory);
    };

    return (
      <View style={{ gap: 20 }}>
        {/* Category Filter */}
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
            Filter by Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {['all', 'water', 'soil', 'biodiversity', 'energy', 'waste', 'climate'].map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category as any)}
                style={{
                  backgroundColor: selectedCategory === category ? colors.primary : colors.card,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: selectedCategory === category ? colors.primary : colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                <Text style={{ fontSize: 16 }}>{getCategoryIcon(category)}</Text>
                <Text
                  style={{
                    color: selectedCategory === category ? 'white' : colors.text,
                    fontSize: 14,
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Practice Cards */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
            Sustainable Practices ({getFilteredPractices().length})
          </Text>
          {getFilteredPractices().map(practice => renderPracticeCard(practice))}
        </View>
      </View>
    );
  };

  const renderRegionalView = () => (
    <View style={{ gap: 20 }}>
      {regionalAdaptation ? (
        <>
          {/* Regional Header */}
          <View
            style={{
              backgroundColor: colors.success,
              borderRadius: 20,
              padding: 20,
              marginBottom: 4,
            }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 50, marginBottom: 8 }}>🗺️</Text>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
                {regionalAdaptation.region}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
                {regionalAdaptation.climate}
              </Text>
            </View>
          </View>

          {/* Common Challenges */}
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Text style={{ fontSize: 24 }}>⚠️</Text>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                Common Challenges
              </Text>
            </View>
            <View style={{ gap: 8 }}>
              {regionalAdaptation.commonChallenges.map((challenge, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: 12,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 16, marginRight: 8 }}>🔸</Text>
                  <Text style={{ flex: 1, color: colors.text, fontSize: 14 }}>
                    {challenge}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Traditional Practices */}
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Text style={{ fontSize: 24 }}>🏛️</Text>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                Traditional Practices
              </Text>
            </View>
            <View style={{ gap: 8 }}>
              {regionalAdaptation.traditionalPractices.map((practice, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#F59E0B' + '20',
                    borderRadius: 12,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 16, marginRight: 8 }}>🌾</Text>
                  <Text style={{ flex: 1, color: colors.text, fontSize: 14 }}>
                    {practice}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Modern Solutions */}
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Text style={{ fontSize: 24 }}>🔬</Text>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                Modern Solutions
              </Text>
            </View>
            <View style={{ gap: 8 }}>
              {regionalAdaptation.modernSolutions.map((solution, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.primary + '20',
                    borderRadius: 12,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 16, marginRight: 8 }}>⚡</Text>
                  <Text style={{ flex: 1, color: colors.text, fontSize: 14 }}>
                    {solution}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Local Resources */}
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Text style={{ fontSize: 24 }}>🌟</Text>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                Local Resources
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {regionalAdaptation.localResources.map((resource, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.success + '20',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}>
                  <Text style={{ color: colors.success, fontSize: 12, fontWeight: '600' }}>
                    ✓ {resource}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View style={{ alignItems: 'center', paddingVertical: 60 }}>
          <Text style={{ fontSize: 80, marginBottom: 16 }}>🌍</Text>
          <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
            General Recommendations
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>
            No specific regional data available for your location.
            Check the Practices tab for general sustainable farming methods.
          </Text>
        </View>
      )}
    </View>
  );

  const renderImplementationView = () => {
    const beginnerPractices = getPracticesByDifficulty('beginner');
    const intermediatePractices = getPracticesByDifficulty('intermediate');
    const advancedPractices = getPracticesByDifficulty('advanced');

    return (
      <View style={{ gap: 20 }}>
        {/* Implementation Guide Header */}
        <View
          style={{
            backgroundColor: '#8B5CF6',
            borderRadius: 20,
            padding: 20,
            marginBottom: 4,
          }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 50, marginBottom: 8 }}>🚀</Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
              Implementation Guide
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
              Step-by-step approach to sustainable farming
            </Text>
          </View>
        </View>

        {/* Phase 1: Beginner */}
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
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>1</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                Phase 1: Foundation (0-6 months)
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                Start with these beginner-friendly practices
              </Text>
            </View>
          </View>
          <View style={{ gap: 8 }}>
            {beginnerPractices.slice(0, 3).map((practice, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedPractice(practice);
                  setShowPracticeModal(true);
                }}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>{practice.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                    {practice.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {practice.timeToImplement} • {practice.costLevel} cost
                  </Text>
                </View>
                <AntDesign name="right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phase 2: Intermediate */}
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
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>2</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                Phase 2: Expansion (6-18 months)
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                Build on your foundation with these practices
              </Text>
            </View>
          </View>
          <View style={{ gap: 8 }}>
            {intermediatePractices.slice(0, 3).map((practice, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedPractice(practice);
                  setShowPracticeModal(true);
                }}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>{practice.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                    {practice.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {practice.timeToImplement} • {practice.costLevel} cost
                  </Text>
                </View>
                <AntDesign name="right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phase 3: Advanced */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.error,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>3</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                Phase 3: Optimization (18+ months)
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                Advanced systems for maximum sustainability
              </Text>
            </View>
          </View>
          <View style={{ gap: 8 }}>
            {advancedPractices.slice(0, 3).map((practice, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedPractice(practice);
                  setShowPracticeModal(true);
                }}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>{practice.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                    {practice.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {practice.timeToImplement} • {practice.costLevel} cost
                  </Text>
                </View>
                <AntDesign name="right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Implementation Tips */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 }}>💡</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              Implementation Tips
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Start small and scale up gradually
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Focus on practices that address your main challenges
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Combine multiple practices for synergistic effects
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Monitor and measure results to guide decisions
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              • Connect with local farmers and extension services
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCSAGrowingView = () => {
    return (
      <View style={{ gap: 20 }}>
        {/* CSA Growing Header */}
        <View
          style={{
            backgroundColor: '#10B981',
            borderRadius: 20,
            padding: 20,
            marginBottom: 4,
          }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 50, marginBottom: 8 }}>🌱</Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
              How to Grow with CSA Methods
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
              Step-by-step guides for climate-smart crop production
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
                CROP GUIDES
              </Text>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {CSA_GROWING_GUIDES.length}
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
                WEATHER
              </Text>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {Math.round(temperature)}°F
              </Text>
            </View>
          </View>
        </View>

        {/* Crop Categories */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
            Crop Categories
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {['cereals', 'vegetables', 'legumes', 'fruits'].map((category) => {
              const guides = getCSAGuidesByCategory(category);
              const categoryColors = {
                cereals: '#F59E0B',
                vegetables: '#EF4444', 
                legumes: '#22C55E',
                fruits: '#8B5CF6'
              };
              
              const categoryIcons = {
                cereals: '🌾',
                vegetables: '🥬',
                legumes: '🫘',
                fruits: '🍎'
              };
              
              return (
                <View
                  key={category}
                  style={{
                    flex: 1,
                    minWidth: '45%',
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: categoryColors[category as keyof typeof categoryColors],
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 24, marginRight: 8 }}>
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, textTransform: 'capitalize' }}>
                      {category}
                    </Text>
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {guides.length} growing guides available
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Growing Guides */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
            CSA Growing Guides
          </Text>
          {CSA_GROWING_GUIDES.map((guide) => (
            <TouchableOpacity
              key={guide.id}
              onPress={() => {
                setSelectedGrowingGuide(guide);
                setShowGrowingModal(true);
              }}
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                borderLeftWidth: 4,
                borderLeftColor: guide.color,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: guide.color + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                  <Text style={{ fontSize: 24 }}>{guide.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                    {guide.cropName} - {guide.variety}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <View
                      style={{
                        backgroundColor: guide.difficulty === 'beginner' ? colors.success + '20' : 
                                       guide.difficulty === 'intermediate' ? '#F59E0B20' : colors.error + '20',
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}>
                      <Text
                        style={{
                          color: guide.difficulty === 'beginner' ? colors.success : 
                                guide.difficulty === 'intermediate' ? '#F59E0B' : colors.error,
                          fontSize: 11,
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}>
                        {guide.difficulty}
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
                        {guide.growingPeriod}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                    Expected yield: {guide.expectedYield}
                  </Text>
                </View>
                <AntDesign name="right" size={20} color={colors.textSecondary} />
              </View>

              {/* CSA Approach Preview */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                <View
                  style={{
                    backgroundColor: colors.background,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                    📈 Productivity
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.background,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                    🛡️ Adaptation
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.background,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                    🌍 Mitigation
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weather-Based Decisions */}
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 }}>🌤️</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              Current Weather Recommendations
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 12 }}>
            {weatherText} • {Math.round(temperature)}°F • {Math.round(humidity)}% humidity
          </Text>
          {getWeatherDecisions(weatherText).slice(0, 2).map((decision, index) => (
            <View
              key={index}
              style={{
                backgroundColor: colors.background,
                borderRadius: 12,
                padding: 12,
                marginBottom: 8,
              }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                {decision.recommendation}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                {decision.actions.slice(0, 2).join(' • ')}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPracticeModal = () => {
    if (!selectedPractice) return null;

    return (
      <Modal
        visible={showPracticeModal}
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
              onPress={() => setShowPracticeModal(false)}
              style={{ marginRight: 16 }}>
              <AntDesign name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                {selectedPractice.name}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                {selectedPractice.category} • {selectedPractice.difficulty}
              </Text>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            
            {/* Practice Header */}
            <View
              style={{
                backgroundColor: selectedPractice.color,
                borderRadius: 20,
                padding: 20,
                marginBottom: 24,
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 60, marginBottom: 12 }}>{selectedPractice.icon}</Text>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                {selectedPractice.name}
              </Text>
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>DIFFICULTY</Text>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textTransform: 'capitalize' }}>
                    {selectedPractice.difficulty}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>TIME</Text>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    {selectedPractice.timeToImplement}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>COST</Text>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textTransform: 'capitalize' }}>
                    {selectedPractice.costLevel}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 12,
                  padding: 12,
                }}>
                <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>
                  {selectedPractice.description}
                </Text>
              </View>
            </View>

            {/* Benefits */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Benefits
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {selectedPractice.benefits.map((benefit, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.success + '20',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                    }}>
                    <Text style={{ color: colors.success, fontSize: 12, fontWeight: '600' }}>
                      ✓ {benefit}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Implementation Steps */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Implementation Steps
              </Text>
              <View style={{ gap: 8 }}>
                {selectedPractice.implementation.map((step, index) => (
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
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Materials Needed */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Materials Needed
              </Text>
              <View style={{ gap: 8 }}>
                {selectedPractice.materials.map((material, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.primaryLight,
                      borderRadius: 12,
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>📦</Text>
                    <Text style={{ flex: 1, color: colors.text, fontSize: 14 }}>
                      {material}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Maintenance */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Maintenance Requirements
              </Text>
              <View style={{ gap: 8 }}>
                {selectedPractice.maintenance.map((task, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#F59E0B' + '20',
                      borderRadius: 12,
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🔧</Text>
                    <Text style={{ flex: 1, color: colors.text, fontSize: 14 }}>
                      {task}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Weather Considerations */}
            {selectedPractice.weatherConsiderations.length > 0 && (
              <View>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                  Weather Considerations
                </Text>
                <View style={{ gap: 8 }}>
                  {selectedPractice.weatherConsiderations.map((consideration, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.card,
                        borderRadius: 12,
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={{ fontSize: 16, marginRight: 8 }}>🌤️</Text>
                      <Text style={{ flex: 1, color: colors.text, fontSize: 14 }}>
                        {consideration}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderGrowingModal = () => {
    if (!selectedGrowingGuide) return null;

    return (
      <Modal
        visible={showGrowingModal}
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
              onPress={() => setShowGrowingModal(false)}
              style={{ marginRight: 16 }}>
              <AntDesign name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                {selectedGrowingGuide.cropName} - {selectedGrowingGuide.variety}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                {selectedGrowingGuide.category} • {selectedGrowingGuide.difficulty} • {selectedGrowingGuide.growingPeriod}
              </Text>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            
            {/* Crop Header */}
            <View
              style={{
                backgroundColor: selectedGrowingGuide.color,
                borderRadius: 20,
                padding: 20,
                marginBottom: 24,
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 60, marginBottom: 12 }}>{selectedGrowingGuide.icon}</Text>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                {selectedGrowingGuide.cropName}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 12 }}>
                {selectedGrowingGuide.variety}
              </Text>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 12,
                  padding: 12,
                }}>
                <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>
                  Expected Yield: {selectedGrowingGuide.expectedYield}
                </Text>
              </View>
            </View>

            {/* Climate Requirements */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Climate Requirements
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                <View style={{ flex: 1, minWidth: '45%', backgroundColor: colors.card, borderRadius: 12, padding: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 }}>
                    TEMPERATURE
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    {selectedGrowingGuide.climateRequirements.temperature.optimal}°C optimal
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    ({selectedGrowingGuide.climateRequirements.temperature.min}-{selectedGrowingGuide.climateRequirements.temperature.max}°C range)
                  </Text>
                </View>
                <View style={{ flex: 1, minWidth: '45%', backgroundColor: colors.card, borderRadius: 12, padding: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 }}>
                    RAINFALL
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    {selectedGrowingGuide.climateRequirements.rainfall.optimal}mm optimal
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    ({selectedGrowingGuide.climateRequirements.rainfall.min}-{selectedGrowingGuide.climateRequirements.rainfall.max}mm range)
                  </Text>
                </View>
              </View>
            </View>

            {/* CSA Approach */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Climate-Smart Agriculture Approach
              </Text>
              
              {/* Productivity Methods */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                  📈 Productivity Methods
                </Text>
                {selectedGrowingGuide.csaApproach.productivityMethods.map((method, index) => (
                  <Text key={index} style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 4 }}>
                    • {method}
                  </Text>
                ))}
              </View>

              {/* Adaptation Strategies */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                  🛡️ Adaptation Strategies
                </Text>
                {selectedGrowingGuide.csaApproach.adaptationStrategies.map((strategy, index) => (
                  <Text key={index} style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 4 }}>
                    • {strategy}
                  </Text>
                ))}
              </View>

              {/* Mitigation Practices */}
              <View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                  🌍 Mitigation Practices
                </Text>
                {selectedGrowingGuide.csaApproach.mitigationPractices.map((practice, index) => (
                  <Text key={index} style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 4 }}>
                    • {practice}
                  </Text>
                ))}
              </View>
            </View>

            {/* Growing Stages */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Growing Stages
              </Text>
              {selectedGrowingGuide.growingStages.map((stage, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: selectedGrowingGuide.color,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}>
                      <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                        {stage.stage}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                        Duration: {stage.duration}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 12 }}>
                    {stage.description}
                  </Text>

                  {/* CSA Techniques */}
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 }}>
                      CSA Techniques:
                    </Text>
                    {stage.csaTechniques.map((technique, techIndex) => (
                      <Text key={techIndex} style={{ color: colors.primary, fontSize: 13, marginBottom: 2 }}>
                        • {technique}
                      </Text>
                    ))}
                  </View>

                  {/* Success Indicators */}
                  <View style={{ backgroundColor: colors.success + '20', borderRadius: 8, padding: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.success, marginBottom: 4 }}>
                      Success Indicators:
                    </Text>
                    {stage.successIndicators.map((indicator, indIndex) => (
                      <Text key={indIndex} style={{ color: colors.success, fontSize: 12, marginBottom: 2 }}>
                        ✓ {indicator}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* Myanmar Context */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Myanmar Context
              </Text>
              <View style={{ backgroundColor: colors.primaryLight, borderRadius: 12, padding: 16 }}>
                {selectedGrowingGuide.myanmarContext.map((context, index) => (
                  <Text key={index} style={{ color: colors.primary, fontSize: 14, marginBottom: 8, lineHeight: 20 }}>
                    • {context}
                  </Text>
                ))}
              </View>
            </View>

            {/* Nutritional Benefits */}
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Nutritional Benefits
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {selectedGrowingGuide.nutritionalBenefits.map((benefit, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.success + '20',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                    }}>
                    <Text style={{ color: colors.success, fontSize: 12, fontWeight: '600' }}>
                      {benefit}
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
            Sustainable Farming
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            Location-based sustainable practices
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
            onPress={() => setSelectedView('recommendations')}
            style={getViewButtonStyle('recommendations')}>
            <Text style={getViewButtonTextStyle('recommendations')}>Recommended</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView('practices')}
            style={getViewButtonStyle('practices')}>
            <Text style={getViewButtonTextStyle('practices')}>Practices</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView('regional')}
            style={getViewButtonStyle('regional')}>
            <Text style={getViewButtonTextStyle('regional')}>Regional</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView('implementation')}
            style={getViewButtonStyle('implementation')}>
            <Text style={getViewButtonTextStyle('implementation')}>Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView('csa-growing')}
            style={getViewButtonStyle('csa-growing')}>
            <Text style={getViewButtonTextStyle('csa-growing')}>CSA Growing</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {selectedView === 'recommendations' && renderRecommendationsView()}
        {selectedView === 'practices' && renderPracticesView()}
        {selectedView === 'regional' && renderRegionalView()}
        {selectedView === 'implementation' && renderImplementationView()}
        {selectedView === 'csa-growing' && renderCSAGrowingView()}
      </ScrollView>

      {renderPracticeModal()}
      {renderGrowingModal()}
    </SafeAreaView>
  );
}