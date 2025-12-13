import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useOffline } from '../context/OfflineContext';
import { AntDesign } from '@expo/vector-icons';

export default function OfflineBanner() {
  const { colors } = useTheme();
  const { isOnline, lastSync, syncNow, syncInProgress } = useOffline();

  if (isOnline) return null;

  const getLastSyncText = () => {
    if (!lastSync) return 'Never synced';
    if (lastSync < 1) return 'Just now';
    if (lastSync < 60) return `${lastSync}m ago`;
    const hours = Math.floor(lastSync / 60);
    return `${hours}h ago`;
  };

  return (
    <View
      style={{
        backgroundColor: '#FF9500',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <AntDesign name="disconnect" size={18} color="white" />
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
            Offline Mode
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11 }}>
            Last sync: {getLastSyncText()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={syncNow}
        disabled={syncInProgress}
        style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
          {syncInProgress ? 'Syncing...' : 'Retry'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
