import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {
  getAlertHistory,
  markAlertAsRead,
  clearAlertHistory,
  AlertHistory,
} from '../../services/notificationService';

export default function AlertHistoryPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const [history, setHistory] = useState<AlertHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const alerts = await getAlertHistory();
    setHistory(alerts);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (alertId: string) => {
    await markAlertAsRead(alertId);
    await loadHistory();
  };

  const handleClearAll = async () => {
    await clearAlertHistory();
    await loadHistory();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return colors.error;
      case 'medium':
        return '#F59E0B';
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <AntDesign name="left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
            Alert History
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            {history.length} total alerts
          </Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={{ color: colors.error, fontSize: 14, fontWeight: '600' }}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {history.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 80, marginBottom: 16 }}>📜</Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
              No Alert History
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>
              Your weather alerts will appear here
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {history.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                onPress={() => handleMarkAsRead(alert.id)}
                style={{
                  backgroundColor: alert.read ? colors.card : colors.primaryLight,
                  borderRadius: 12,
                  padding: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: getSeverityColor(alert.severity),
                  opacity: alert.read ? 0.7 : 1,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>
                      {alert.type}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>
                      {alert.message}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                        📍 {alert.city}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                        🕐 {formatTime(alert.timestamp)}
                      </Text>
                    </View>
                  </View>
                  {!alert.read && (
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: 8 }} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
