import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { getCacheStats, clearAllCache, clearExpiredCache, getAllCachedCities, getCacheAge } from '../../services/offlineStorage';

export default function OfflineSettings() {
  const { colors } = useTheme();
  const { isOnline, lastSync, syncNow, syncInProgress, connectionType } = useOffline();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [cachedCities, setCachedCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCacheInfo();
  }, []);

  // Reload when lastSync changes (after sync completes)
  useEffect(() => {
    if (lastSync !== null) {
      loadCacheInfo();
    }
  }, [lastSync]);

  const loadCacheInfo = async () => {
    setLoading(true);
    try {
      const [cacheStats, cities] = await Promise.all([
        getCacheStats(),
        getAllCachedCities(),
      ]);
      setStats(cacheStats);
      setCachedCities(cities);
    } catch (error) {
      console.error('Error loading cache info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear All Cache',
      'This will remove all cached weather data. You will need an internet connection to view weather information.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAllCache();
            await loadCacheInfo();
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleClearExpired = async () => {
    await clearExpiredCache();
    await loadCacheInfo();
    Alert.alert('Success', 'Expired cache cleared');
  };

  const getConnectionIcon = () => {
    if (!isOnline) return '📴';
    switch (connectionType) {
      case 'wifi':
        return '📶';
      case 'cellular':
        return '📱';
      default:
        return '🌐';
    }
  };

  const getConnectionText = () => {
    if (!isOnline) return 'Offline';
    return connectionType ? connectionType.charAt(0).toUpperCase() + connectionType.slice(1) : 'Online';
  };

  const getLastSyncText = () => {
    if (!lastSync) return 'Never';
    if (lastSync < 1) return 'Just now';
    if (lastSync < 60) return `${lastSync} minutes ago`;
    const hours = Math.floor(lastSync / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <AntDesign name="left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, flex: 1 }}>
          Offline & Cache
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Connection Status */}
        <View style={{ backgroundColor: isOnline ? '#D1FAE5' : '#FF9500', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 32, marginRight: 12 }}>{getConnectionIcon()}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: isOnline ? colors.success : 'white' }}>
                {getConnectionText()}
              </Text>
              <Text style={{ fontSize: 14, color: isOnline ? colors.success : 'rgba(255,255,255,0.9)' }}>
                Last sync: {getLastSyncText()}
              </Text>
            </View>
          </View>
          {isOnline && (
            <TouchableOpacity
              onPress={async () => {
                await syncNow();
                // Reload cache info after sync
                await loadCacheInfo();
              }}
              disabled={syncInProgress}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                padding: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>
                {syncInProgress ? 'Syncing...' : 'Sync Now'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cache Statistics */}
        {stats && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Cache Statistics
            </Text>
            <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.textSecondary }}>Total Cached</Text>
                <Text style={{ color: colors.text, fontWeight: '600' }}>{stats.totalCached} cities</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.textSecondary }}>Fresh Cache</Text>
                <Text style={{ color: colors.success, fontWeight: '600' }}>{stats.freshCache}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.textSecondary }}>Expired Cache</Text>
                <Text style={{ color: colors.error, fontWeight: '600' }}>{stats.expiredCache}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.textSecondary }}>Total Size</Text>
                <Text style={{ color: colors.text, fontWeight: '600' }}>{stats.totalSize}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Cached Cities */}
        {cachedCities.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Cached Cities ({cachedCities.length})
            </Text>
            <View style={{ gap: 8 }}>
              {cachedCities.map((city, index) => {
                const age = getCacheAge(city);
                const isFresh = age < 10;
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 12,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                        {city.cityName}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                        Cached {age} minutes ago
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: isFresh ? '#D1FAE5' : colors.errorLight,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '600', color: isFresh ? colors.success : colors.error }}>
                        {isFresh ? 'FRESH' : 'OLD'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
            Cache Management
          </Text>
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={handleClearExpired}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <AntDesign name="delete" size={20} color={colors.primary} />
                <Text style={{ fontSize: 16, color: colors.text }}>Clear Expired Cache</Text>
              </View>
              <AntDesign name="right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClearCache}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <AntDesign name="delete" size={20} color={colors.error} />
                <Text style={{ fontSize: 16, color: colors.error }}>Clear All Cache</Text>
              </View>
              <AntDesign name="right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={loadCacheInfo}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <AntDesign name="reload" size={20} color={colors.primary} />
                <Text style={{ fontSize: 16, color: colors.text }}>Refresh Statistics</Text>
              </View>
              <AntDesign name="right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, flexDirection: 'row', gap: 12 }}>
          <AntDesign name="infocirlce" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              About Offline Mode
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18 }}>
              Weather data is cached for 30 minutes. When offline, you can still view cached data for your saved cities. The app will automatically sync when you're back online.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
