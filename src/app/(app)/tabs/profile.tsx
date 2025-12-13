import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../context/ThemeContext'
import { AntDesign } from '@expo/vector-icons'

export default function Profile() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const { theme, setTheme, colors, isDark } = useTheme()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/sign-in')
  }

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: '☀️' },
    { value: 'dark' as const, label: 'Dark', icon: '🌙' },
    { value: 'system' as const, label: 'System', icon: '⚙️' },
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ padding: 24 }}>
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>
              Profile
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
              Manage your account settings
            </Text>
          </View>

          {/* User Info Card */}
          <View style={{ backgroundColor: colors.primaryLight, borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 40, 
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <Text style={{ fontSize: 32, color: 'white' }}>
                  {user?.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                {user?.emailAddresses[0]?.emailAddress}
              </Text>
            </View>
          </View>

          {/* Theme Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Appearance
            </Text>
            <View style={{ gap: 12 }}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setTheme(option.value)}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 2,
                    borderColor: theme === option.value ? colors.primary : 'transparent',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 24 }}>{option.icon}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text }}>
                      {option.label}
                    </Text>
                  </View>
                  {theme === option.value && (
                    <AntDesign name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Quick Actions
            </Text>
            <View style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={() => router.push('/(app)/settings')}
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
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primary + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <AntDesign name="setting" size={20} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      Settings
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Units, display & preferences
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(app)/notification-settings')}
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
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.error + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <AntDesign name="notification" size={20} color={colors.error} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      Notifications
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Manage weather alerts
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Farming Features */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Farming Features
            </Text>
            <View style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={() => router.push('/(app)/planting-schedule')}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#8B5CF6' + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 20 }}>📅</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      Planting Schedule
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      When to plant and harvest crops
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(app)/farming-advice')}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.success + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 20 }}>🌾</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      Farming Advice
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Crop recommendations and tips
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(app)/elevation-crops')}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primary + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 20 }}>⛰️</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      What to Grow Here
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Crops suitable for your elevation
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(app)/organic-fertilizer')}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#059669' + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 20 }}>🍃</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      Organic Fertilizers
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Natural plant nutrition recipes
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(app)/sustainable-farming')}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#7C3AED' + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 20 }}>🌍</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      Sustainable Farming
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Location-based sustainable practices
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Details */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Account Details
            </Text>
            <View style={{ gap: 12 }}>
              <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: 4 }}>
                  Email
                </Text>
                <Text style={{ fontSize: 16, color: colors.text }}>
                  {user?.emailAddresses[0]?.emailAddress}
                </Text>
              </View>

              <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: 4 }}>
                  User ID
                </Text>
                <Text style={{ fontSize: 12, color: colors.text }}>
                  {user?.id}
                </Text>
              </View>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              backgroundColor: colors.error,
              borderRadius: 12,
              padding: 16,
              marginTop: 16,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}