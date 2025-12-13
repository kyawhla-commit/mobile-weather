import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherWidget, { WeatherWidgetData } from './WeatherWidget';
import WeatherWidgetConfig from './WeatherWidgetConfig';
import { useToast } from './Toast';

interface WeatherWidgetManagerProps {
  weatherData: {
    currentWeather: any;
    forecast: any[];
    hourlyForecast: any[];
    alerts: any[];
    aqi: any;
  };
  cityName: string;
  visible: boolean;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WeatherWidgetManager({
  weatherData,
  cityName,
  visible,
  onClose,
}: WeatherWidgetManagerProps) {
  const [widgets, setWidgets] = useState<WeatherWidgetData[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [showWidgetConfig, setShowWidgetConfig] = useState(false);
  const [draggedWidget] = useState<string | null>(null);
  const [newlyAddedWidget, setNewlyAddedWidget] = useState<string | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    loadWidgets();
  }, []);

  useEffect(() => {
    if (visible) {
      updateWidgetData();
    }
  }, [visible, weatherData]);

  // Update widget data when widgets array changes
  useEffect(() => {
    if (widgets.length > 0) {
      updateWidgetData();
    }
  }, [widgets.length]);

  const loadWidgets = async () => {
    try {
      const savedWidgets = await AsyncStorage.getItem('weatherWidgets');
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets));
      } else {
        // Create default widgets
        const defaultWidgets = createDefaultWidgets();
        setWidgets(defaultWidgets);
        await saveWidgets(defaultWidgets);
      }
    } catch (error) {
      console.error('Error loading widgets:', error);
    }
  };

  const saveWidgets = async (widgetsToSave: WeatherWidgetData[]) => {
    try {
      await AsyncStorage.setItem('weatherWidgets', JSON.stringify(widgetsToSave));
    } catch (error) {
      console.error('Error saving widgets:', error);
      throw error;
    }
  };

  const createDefaultWidgets = (): WeatherWidgetData[] => {
    return [
      {
        id: 'current-1',
        type: 'current',
        title: 'Current Weather',
        data: {},
        size: 'large',
        position: { x: 0, y: 0 },
        theme: 'auto',
      },
      {
        id: 'wind-1',
        type: 'wind',
        title: 'Wind',
        data: {},
        size: 'small',
        position: { x: 0, y: 200 },
        theme: 'auto',
      },
      {
        id: 'humidity-1',
        type: 'humidity',
        title: 'Humidity',
        data: {},
        size: 'small',
        position: { x: 0, y: 200 },
        theme: 'auto',
      },
      {
        id: 'forecast-1',
        type: 'forecast',
        title: '5-Day Forecast',
        data: {},
        size: 'large',
        position: { x: 0, y: 400 },
        theme: 'auto',
      },
    ];
  };

  const updateWidgetData = () => {
    const updatedWidgets = widgets.map((widget) => {
      switch (widget.type) {
        case 'current':
          return {
            ...widget,
            data: {
              temperature: weatherData.currentWeather?.Temperature?.Imperial?.Value || 0,
              condition: weatherData.currentWeather?.WeatherText || 'Unknown',
              icon: weatherData.currentWeather?.WeatherIcon || 1,
              feelsLike: weatherData.currentWeather?.RealFeelTemperature?.Imperial?.Value || 0,
              humidity: weatherData.currentWeather?.RelativeHumidity || 0,
              windSpeed: weatherData.currentWeather?.Wind?.Speed?.Imperial?.Value || 0,
              windDirection: weatherData.currentWeather?.Wind?.Direction?.Localized || 'N',
            },
          };
        case 'forecast':
          return {
            ...widget,
            data: {
              forecast: weatherData.forecast || [],
            },
          };
        case 'hourly':
          return {
            ...widget,
            data: {
              hourly: weatherData.hourlyForecast || [],
            },
          };
        case 'alerts':
          return {
            ...widget,
            data: {
              alerts: weatherData.alerts || [],
            },
          };
        case 'aqi':
          return {
            ...widget,
            data: {
              aqi: weatherData.aqi?.aqi || 0,
              category: weatherData.aqi?.category || 'Unknown',
            },
          };
        case 'wind':
          return {
            ...widget,
            data: {
              speed: weatherData.currentWeather?.Wind?.Speed?.Imperial?.Value || 0,
              direction: weatherData.currentWeather?.Wind?.Direction?.Localized || 'N',
              degrees: weatherData.currentWeather?.Wind?.Direction?.Degrees || 0,
              gust: weatherData.currentWeather?.WindGust?.Speed?.Imperial?.Value || 0,
            },
          };
        case 'humidity':
          return {
            ...widget,
            data: {
              humidity: weatherData.currentWeather?.RelativeHumidity || 0,
              dewPoint: weatherData.currentWeather?.DewPoint?.Imperial?.Value || 0,
            },
          };
        case 'pressure':
          return {
            ...widget,
            data: {
              pressure: weatherData.currentWeather?.Pressure?.Imperial?.Value || 30.0,
              trend: weatherData.currentWeather?.PressureTendency?.LocalizedText || 'steady',
            },
          };
        case 'uv':
          return {
            ...widget,
            data: {
              uvIndex: weatherData.currentWeather?.UVIndex || 0,
              uvDescription: weatherData.currentWeather?.UVIndexText || 'Low',
            },
          };
        case 'visibility':
          return {
            ...widget,
            data: {
              visibility: weatherData.currentWeather?.Visibility?.Imperial?.Value || 10,
              visibilityDescription: weatherData.currentWeather?.Visibility?.Imperial?.Unit || 'Good',
            },
          };
        default:
          return widget;
      }
    });
    setWidgets(updatedWidgets);
  };

  const handleAddWidget = () => {
    setShowWidgetConfig(true);
  };

  const handleDuplicateWidget = (widgetId: string) => {
    const widgetToDuplicate = widgets.find(w => w.id === widgetId);
    if (!widgetToDuplicate) return;


    
    // Position the duplicate slightly offset from the original
    const newPosition = {
      x: Math.min(widgetToDuplicate.position.x + 20, screenWidth - 160),
      y: Math.min(widgetToDuplicate.position.y + 20, screenHeight - 200),
    };

    const duplicatedWidget: WeatherWidgetData = {
      ...widgetToDuplicate,
      id: `${widgetToDuplicate.type}-${Date.now()}`,
      position: newPosition,
    };

    const updatedWidgets = [...widgets, duplicatedWidget];
    setWidgets(updatedWidgets);
    saveWidgets(updatedWidgets);
    updateWidgetData();
    
    showToast(`${getWidgetTitle(widgetToDuplicate.type)} widget duplicated`, 'success');
  };

  const reorganizeWidgets = () => {
    // Sort widgets by type priority for better organization
    const typePriority = {
      'current': 1,
      'forecast': 2,
      'alerts': 3,
      'aqi': 4,
      'wind': 5,
      'humidity': 6,
      'pressure': 7,
      'uv': 8,
      'visibility': 9,
      'hourly': 10,
    };
    
    const reorganizedWidgets = [...widgets].sort((a, b) => {
      const priorityA = typePriority[a.type] || 99;
      const priorityB = typePriority[b.type] || 99;
      return priorityA - priorityB;
    }).map((widget, index) => ({
      ...widget,
      position: { x: 0, y: index * 200 } // Simple position for flex layout
    }));
    
    setWidgets(reorganizedWidgets);
    saveWidgets(reorganizedWidgets);
    showToast('Widgets reorganized systematically', 'success');
  };

  const handleResetWidgets = () => {
    Alert.alert(
      'Reset All Widgets',
      'This will remove all widgets and restore the default layout. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultWidgets = createDefaultWidgets();
            setWidgets(defaultWidgets);
            saveWidgets(defaultWidgets);
            updateWidgetData();
            setEditMode(false);
            setSelectedWidget(null);
            showToast('Widgets reset to default layout', 'info');
          },
        },
      ]
    );
  };

  const addWidget = async (type: WeatherWidgetData['type']) => {
    try {
      // Check widget limit
      if (widgets.length >= 12) {
        showToast('Maximum of 12 widgets allowed', 'warning');
        return;
      }

      // Check for duplicate widget types (for certain types)
      const singleInstanceTypes = ['current', 'alerts'];
      if (singleInstanceTypes.includes(type) && widgets.some(w => w.type === type)) {
        showToast(`${getWidgetTitle(type)} widget already exists`, 'warning');
        return;
      }

      // Smart sizing based on widget type
      const getOptimalSize = (type: WeatherWidgetData['type']): WeatherWidgetData['size'] => {
        switch (type) {
          case 'current':
          case 'forecast':
            return 'large';
          case 'wind':
          case 'humidity':
          case 'pressure':
          case 'uv':
          case 'visibility':
          case 'alerts':
            return 'small';
          case 'hourly':
          case 'aqi':
            return 'medium';
          default:
            return 'medium';
        }
      };

      const optimalSize = getOptimalSize(type);
      // Position is handled by flexbox layout now
      const position = { x: 0, y: widgets.length * 200 };

      const newWidget: WeatherWidgetData = {
        id: `${type}-${Date.now()}`,
        type,
        title: getWidgetTitle(type),
        data: {},
        size: optimalSize,
        position,
        theme: 'auto',
      };

      // Update state and save
      const updatedWidgets = [...widgets, newWidget];
      setWidgets(updatedWidgets);
      
      // Save to storage
      await saveWidgets(updatedWidgets);
      
      // Highlight newly added widget and scroll to bottom
      setNewlyAddedWidget(newWidget.id);
      setTimeout(() => setNewlyAddedWidget(null), 2000);
      
      // Scroll to bottom to show new widget
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 300);
      
      // Show success toast
      showToast(`${getWidgetTitle(type)} widget added successfully!`, 'success');
      
    } catch (error) {
      console.error('Error adding widget:', error);
      showToast('Failed to add widget. Please try again.', 'error');
    }
  };

  const getWidgetDimensions = (size: WeatherWidgetData['size']) => {
    const availableWidth = screenWidth - 40;
    const margin = 16;
    
    switch (size) {
      case 'small':
        return { 
          width: (availableWidth - margin) / 2, 
          height: 120 
        };
      case 'medium':
        return { 
          width: (availableWidth - margin) / 2, 
          height: 140 
        };
      case 'large':
        return { 
          width: availableWidth, 
          height: 160 
        };
      case 'xlarge':
        return { 
          width: availableWidth, 
          height: 200 
        };
      default:
        return { 
          width: (availableWidth - margin) / 2, 
          height: 120 
        };
    }
  };

  const getWidgetTitle = (type: WeatherWidgetData['type']): string => {
    switch (type) {
      case 'current':
        return 'Current Weather';
      case 'forecast':
        return '5-Day Forecast';
      case 'hourly':
        return 'Hourly Forecast';
      case 'alerts':
        return 'Weather Alerts';
      case 'aqi':
        return 'Air Quality';
      case 'wind':
        return 'Wind Conditions';
      case 'humidity':
        return 'Humidity';
      case 'pressure':
        return 'Atmospheric Pressure';
      case 'uv':
        return 'UV Index';
      case 'visibility':
        return 'Visibility';
      default:
        return 'Weather Widget';
    }
  };

  const handleWidgetLongPress = (widgetId: string) => {
    if (!editMode) {
      setEditMode(true);
    }
    setSelectedWidget(widgetId);
  };

  const handleDeleteWidget = (widgetId: string) => {
    Alert.alert(
      'Delete Widget',
      'Are you sure you want to delete this widget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const widgetToDelete = widgets.find(w => w.id === widgetId);
            const updatedWidgets = widgets.filter((w) => w.id !== widgetId);
            setWidgets(updatedWidgets);
            saveWidgets(updatedWidgets);
            setSelectedWidget(null);
            setEditMode(false);
            
            // Show success toast
            if (widgetToDelete) {
              showToast(`${getWidgetTitle(widgetToDelete.type)} widget removed`, 'info');
            }
          },
        },
      ]
    );
  };

  const handleWidgetSizeChange = (widgetId: string, size: WeatherWidgetData['size']) => {
    const updatedWidgets = widgets.map((w) =>
      w.id === widgetId ? { ...w, size } : w
    );
    setWidgets(updatedWidgets);
    saveWidgets(updatedWidgets);
  };

  const renderEditControls = () => {
    if (!editMode || !selectedWidget) return null;

    const widget = widgets.find((w) => w.id === selectedWidget);
    if (!widget) return null;

    return (
      <View 
        className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 12,
        }}
      >
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Edit Widget
        </Text>
        
        <Text className="text-sm font-medium text-gray-600 mb-2">Size:</Text>
        <View className="flex-row mb-4">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => handleWidgetSizeChange(selectedWidget, size)}
              className={`mr-2 px-3 py-2 rounded-lg ${
                widget.size === size
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  widget.size === size ? 'text-white' : 'text-gray-700'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-between mb-3">
          <TouchableOpacity
            onPress={() => handleDuplicateWidget(selectedWidget)}
            className="bg-green-500 px-4 py-2 rounded-lg flex-1 mr-2"
          >
            <Text className="text-white font-medium text-center">Duplicate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleDeleteWidget(selectedWidget)}
            className="bg-red-500 px-4 py-2 rounded-lg flex-1 ml-2"
          >
            <Text className="text-white font-medium text-center">Delete</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mb-3">
          <TouchableOpacity
            onPress={reorganizeWidgets}
            className="bg-purple-500 px-4 py-2 rounded-lg flex-1 mr-2"
          >
            <Text className="text-white font-medium text-center">Reorganize</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleResetWidgets}
            className="bg-orange-500 px-4 py-2 rounded-lg flex-1 ml-2"
          >
            <Text className="text-white font-medium text-center">Reset All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            setEditMode(false);
            setSelectedWidget(null);
          }}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium text-center">Done Editing</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={{ paddingTop: StatusBar.currentHeight || 44, paddingBottom: 16, paddingHorizontal: 16 }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-white">
                  Weather Widgets
                </Text>
                <Text className="text-white/80 text-base">
                  {cityName} • {widgets.length} widget{widgets.length !== 1 ? 's' : ''} {widgets.length > 4 ? '• Scroll to see all' : ''}
                </Text>
              </View>
              
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={handleAddWidget}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialCommunityIcons name="plus" size={24} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setEditMode(!editMode)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: editMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialCommunityIcons name="pencil" size={20} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialCommunityIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            
            {editMode && (
              <View className="bg-white/20 px-4 py-3 rounded-2xl mt-3">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="information" size={16} color="white" />
                  <Text className="text-white/90 text-sm ml-2 flex-1">
                    Long press widgets to customize • Scroll to see all widgets
                  </Text>
                </View>
              </View>
            )}
            
            {/* Scroll Indicator */}
            {widgets.length > 4 && (
              <View className="bg-white/20 px-3 py-2 rounded-full mt-2 self-center">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="gesture-swipe-vertical" size={14} color="white" />
                  <Text className="text-white/90 text-xs ml-1">
                    Scroll for more widgets
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Widget Canvas */}
          <ScrollView 
            ref={scrollViewRef}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: editMode && selectedWidget ? 200 : 40,
            }}
          >
            {widgets.length === 0 ? (
              /* Empty State */
              <View className="flex-1 items-center justify-center p-8" style={{ minHeight: screenHeight - 300 }}>
                <View className="items-center">
                  <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-6">
                    <MaterialCommunityIcons name="widgets" size={48} color="white" />
                  </View>
                  
                  <Text className="text-3xl font-bold text-white mb-3 text-center">
                    Create Your Dashboard
                  </Text>
                  
                  <Text className="text-white/80 text-center text-lg mb-8 leading-6">
                    Add weather widgets to create your personalized weather dashboard
                  </Text>
                  
                  <TouchableOpacity
                    onPress={handleAddWidget}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      paddingHorizontal: 32,
                      paddingVertical: 16,
                      borderRadius: 25,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color="#667eea" />
                    <Text style={{ color: '#667eea', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>
                      Add Your First Widget
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Widget Grid */
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {widgets
                  .sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x)
                  .map((widget, index) => {
                    const dimensions = getWidgetDimensions(widget.size);
                    const isLarge = widget.size === 'large' || widget.size === 'xlarge';
                    const isNewWidget = newlyAddedWidget === widget.id;
                    
                    return (
                      <View
                        key={widget.id}
                        style={{
                          width: isLarge ? '100%' : '48%',
                          marginBottom: 16,
                          position: 'relative',
                        }}
                      >
                        <WeatherWidget
                          widget={{
                            ...widget,
                            position: { x: 0, y: 0 } // Reset position for flex layout
                          }}
                          onLongPress={() => handleWidgetLongPress(widget.id)}
                          isEditing={editMode}
                          isDragging={draggedWidget === widget.id}
                        />
                        
                        {/* New Widget Highlight Effect */}
                        {isNewWidget && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              borderRadius: 20,
                              borderWidth: 3,
                              borderColor: '#10B981',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              pointerEvents: 'none',
                            }}
                          >
                            <View style={{ position: 'absolute', top: -32, left: 0, right: 0, alignItems: 'center' }}>
                              <View className="bg-green-500 px-3 py-1 rounded-full">
                                <Text className="text-white text-xs font-bold">New Widget Added!</Text>
                              </View>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
              </View>
            )}
          </ScrollView>

          {/* Scroll to Top Button */}
          {widgets.length > 6 && (
            <TouchableOpacity
              onPress={() => {
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
              }}
              style={{
                position: 'absolute',
                bottom: editMode && selectedWidget ? 220 : 80,
                right: 20,
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <MaterialCommunityIcons name="chevron-up" size={24} color="#667eea" />
            </TouchableOpacity>
          )}

          {renderEditControls()}
          {/* Toast Notifications */}
          {ToastComponent}
        </LinearGradient>
      </Modal>

      {/* Widget Configuration Modal */}
      <WeatherWidgetConfig
        visible={showWidgetConfig}
        onClose={() => setShowWidgetConfig(false)}
        onAddWidget={addWidget}
      />
    </>
  );
}