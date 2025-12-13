import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { cropDatabase } from '../../utils/cropDatabase';

const { width } = Dimensions.get('window');

export default function FarmingAdvice() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedCrop, setSelectedCrop] = useState('Rice');
  const [showCropPicker, setShowCropPicker] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    conditions: true,
    irrigation: false,
    fertilizer: false,
    pests: false,
    diseases: false,
    harvest: false,
  });

  const temperature = parseInt(params.temperature as string);
  const humidity = parseInt(params.humidity as string);
  const weatherText = params.weatherText as string;
  const cityName = params.cityName as string;

  const cropData = cropDatabase[selectedCrop];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const expandAll = () => {
    setExpandedSections({
      conditions: true,
      irrigation: true,
      fertilizer: true,
      pests: true,
      diseases: true,
      harvest: true,
    });
  };

  const collapseAll = () => {
    setExpandedSections({
      conditions: false,
      irrigation: false,
      fertilizer: false,
      pests: false,
      diseases: false,
      harvest: false,
    });
  };

  const isOptimalTemp =
    temperature >= cropData.optimalTemp.min &&
    temperature <= cropData.optimalTemp.max;
  const isOptimalHumidity =
    humidity >= cropData.optimalHumidity.min &&
    humidity <= cropData.optimalHumidity.max;

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
            Smart Farming Advisor
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            {cityName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={expandAll}
            style={{
              backgroundColor: colors.card,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: colors.primary,
                fontSize: 12,
                fontWeight: '600',
              }}>
              Expand
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={collapseAll}
            style={{
              backgroundColor: colors.card,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                fontWeight: '600',
              }}>
              Collapse
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ padding: 20 }}>
          {/* Crop Selection Card */}
          <View
            style={{
              backgroundColor: colors.success,
              borderRadius: 20,
              padding: 20,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 28 }}>{cropData.icon}</Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      fontWeight: '600',
                      opacity: 0.9,
                    }}>
                    SELECTED CROP
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}>
                    {cropData.name}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      opacity: 0.8,
                      fontStyle: 'italic',
                    }}>
                    {cropData.scientificName}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowCropPicker(!showCropPicker)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                }}>
                <Text
                  style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>
                  CHANGE
                </Text>
              </TouchableOpacity>
            </View>

            {showCropPicker && (
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 12,
                  padding: 12,
                  gap: 8,
                }}>
                {Object.keys(cropDatabase).map((crop) => (
                  <TouchableOpacity
                    key={crop}
                    onPress={() => {
                      setSelectedCrop(crop);
                      setShowCropPicker(false);
                    }}
                    style={{
                      backgroundColor:
                        selectedCrop === crop
                          ? 'rgba(255,255,255,0.3)'
                          : 'rgba(255,255,255,0.1)',
                      padding: 12,
                      borderRadius: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <Text style={{ fontSize: 24 }}>
                      {cropDatabase[crop].icon}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '600',
                      }}>
                      {crop}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {/* Current Conditions Section */}
          <TouchableOpacity
            onPress={() => toggleSection('conditions')}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              marginBottom: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <View
              style={{
                backgroundColor: colors.primary + '20',
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 20 }}>🌡️</Text>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: colors.text,
                  }}>
                  Current Conditions
                </Text>
              </View>
              <AntDesign
                name={expandedSections.conditions ? 'up' : 'down'}
                size={20}
                color={colors.text}
              />
            </View>

            {expandedSections.conditions && (
              <View style={{ padding: 16 }}>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  <View
                    style={{
                      flex: 1,
                      minWidth: '45%',
                      backgroundColor: isOptimalTemp
                        ? colors.success + '20'
                        : colors.error + '20',
                      borderRadius: 12,
                      padding: 16,
                      borderLeftWidth: 4,
                      borderLeftColor: isOptimalTemp
                        ? colors.success
                        : colors.error,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        fontWeight: '600',
                        marginBottom: 4,
                      }}>
                      TEMPERATURE
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: colors.text,
                      }}>
                      {temperature}°F
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: colors.textSecondary,
                        marginTop: 4,
                      }}>
                      Optimal: {cropData.optimalTemp.min}-
                      {cropData.optimalTemp.max}°C
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      minWidth: '45%',
                      backgroundColor: isOptimalHumidity
                        ? colors.success + '20'
                        : colors.error + '20',
                      borderRadius: 12,
                      padding: 16,
                      borderLeftWidth: 4,
                      borderLeftColor: isOptimalHumidity
                        ? colors.success
                        : colors.error,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        fontWeight: '600',
                        marginBottom: 4,
                      }}>
                      HUMIDITY
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: colors.text,
                      }}>
                      {humidity}%
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: colors.textSecondary,
                        marginTop: 4,
                      }}>
                      Optimal: {cropData.optimalHumidity.min}-
                      {cropData.optimalHumidity.max}%
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                      fontWeight: '600',
                      marginBottom: 4,
                    }}>
                    CONDITIONS
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: colors.text,
                    }}>
                    {weatherText}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
          {/* Irrigation Section */}
          <TouchableOpacity
            onPress={() => toggleSection('irrigation')}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              marginBottom: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <View
              style={{
                backgroundColor: '#3B82F6' + '20',
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#3B82F6',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 20 }}>💧</Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: colors.text,
                    }}>
                    Irrigation
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {cropData.waterRequirement} water need
                  </Text>
                </View>
              </View>
              <AntDesign
                name={expandedSections.irrigation ? 'up' : 'down'}
                size={20}
                color={colors.text}
              />
            </View>

            {expandedSections.irrigation && (
              <View style={{ padding: 16 }}>
                <View
                  style={{
                    backgroundColor: '#3B82F6' + '10',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.text,
                      marginBottom: 8,
                    }}>
                    💡 Water Management Tips
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.text,
                      lineHeight: 20,
                    }}>
                    • Water early morning or late evening
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.text,
                      lineHeight: 20,
                    }}>
                    • Use drip irrigation for efficiency
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.text,
                      lineHeight: 20,
                    }}>
                    • Monitor soil moisture regularly
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.text,
                      lineHeight: 20,
                    }}>
                    • Adjust based on rainfall
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* Fertilizer Section */}
          <TouchableOpacity
            onPress={() => toggleSection('fertilizer')}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              marginBottom: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <View
              style={{
                backgroundColor: '#A855F7' + '20',
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#A855F7',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 20 }}>🧪</Text>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: colors.text,
                  }}>
                  Fertilizer
                </Text>
              </View>
              <AntDesign
                name={expandedSections.fertilizer ? 'up' : 'down'}
                size={20}
                color={colors.text}
              />
            </View>

            {expandedSections.fertilizer && (
              <View style={{ padding: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 12,
                  }}>
                  NPK Ratio
                </Text>
                <View
                  style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#A855F7' + '20',
                      borderRadius: 12,
                      padding: 16,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        color: '#A855F7',
                      }}>
                      {cropData.npkRatio.n}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        fontWeight: '600',
                      }}>
                      Nitrogen
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#EC4899' + '20',
                      borderRadius: 12,
                      padding: 16,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        color: '#EC4899',
                      }}>
                      {cropData.npkRatio.p}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        fontWeight: '600',
                      }}>
                      Phosphorus
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#6366F1' + '20',
                      borderRadius: 12,
                      padding: 16,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        color: '#6366F1',
                      }}>
                      {cropData.npkRatio.k}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        fontWeight: '600',
                      }}>
                      Potassium
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
          {/* Pests Section */}
          <TouchableOpacity
            onPress={() => toggleSection('pests')}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              marginBottom: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <View
              style={{
                backgroundColor: '#F97316' + '20',
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#F97316',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 20 }}>🐛</Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: colors.text,
                    }}>
                    Pest Control
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {cropData.commonPests.length} common pests
                  </Text>
                </View>
              </View>
              <AntDesign
                name={expandedSections.pests ? 'up' : 'down'}
                size={20}
                color={colors.text}
              />
            </View>

            {expandedSections.pests && (
              <View style={{ padding: 16 }}>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {cropData.commonPests.map((pest, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#F97316' + '20',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#F97316' + '40',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: colors.text,
                        }}>
                        🐛 {pest}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* Diseases Section */}
          <TouchableOpacity
            onPress={() => toggleSection('diseases')}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              marginBottom: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <View
              style={{
                backgroundColor: '#EF4444' + '20',
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#EF4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 20 }}>🦠</Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: colors.text,
                    }}>
                    Disease Risk
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {cropData.commonDiseases.length} common diseases
                  </Text>
                </View>
              </View>
              <AntDesign
                name={expandedSections.diseases ? 'up' : 'down'}
                size={20}
                color={colors.text}
              />
            </View>

            {expandedSections.diseases && (
              <View style={{ padding: 16 }}>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {cropData.commonDiseases.map((disease, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#EF4444' + '20',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#EF4444' + '40',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: colors.text,
                        }}>
                        🦠 {disease}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* Harvest Section */}
          <TouchableOpacity
            onPress={() => toggleSection('harvest')}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              marginBottom: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <View
              style={{
                backgroundColor: '#F59E0B' + '20',
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: colors.text,
                    }}>
                    Harvest Timing
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {cropData.growthPeriod}
                  </Text>
                </View>
              </View>
              <AntDesign
                name={expandedSections.harvest ? 'up' : 'down'}
                size={20}
                color={colors.text}
              />
            </View>

            {expandedSections.harvest && (
              <View style={{ padding: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 12,
                  }}>
                  Harvest Indicators
                </Text>
                {cropData.harvestIndicators.map((indicator, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      backgroundColor: colors.background,
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 8,
                    }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: '#F59E0B',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        ✓
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.text, flex: 1 }}>
                      {indicator}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>

          {/* Disclaimer */}
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              gap: 12,
              marginTop: 8,
            }}>
            <AntDesign
              name="infocirlce"
              size={20}
              color={colors.textSecondary}
            />
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                flex: 1,
                lineHeight: 18,
              }}>
              This advice is generated based on current weather conditions and
              crop database. Always consult with local agricultural experts.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
