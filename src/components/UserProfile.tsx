import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function UserProfile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/sign-in');
            } catch (error) {
              console.error('Sign out error:', error);
            }
          },
        },
      ]
    );
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'User';
  const email = user.emailAddresses[0]?.emailAddress;
  const profileImage = user.imageUrl;

  return (
    <View className="bg-white rounded-xl p-4 mx-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center gap-3 mb-4">
        {profileImage ? (
          <Image 
            source={{ uri: profileImage }} 
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
            <Text className="text-white font-semibold text-lg">
              {getInitials(displayName)}
            </Text>
          </View>
        )}
        
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base">{displayName}</Text>
          {email && (
            <Text className="text-gray-600 text-sm">{email}</Text>
          )}
        </View>
      </View>

      {/* OAuth Provider Info */}
      {user.externalAccounts && user.externalAccounts.length > 0 && (
        <View className="mb-4">
          <Text className="text-gray-700 font-medium text-sm mb-2">Connected Accounts</Text>
          {user.externalAccounts.map((account, index) => (
            <View key={index} className="flex-row items-center gap-2 mb-1">
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <Text className="text-gray-600 text-sm capitalize">
                {account.provider} ({account.emailAddress || account.username})
              </Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-red-50 border border-red-200 rounded-lg p-3"
        activeOpacity={0.8}
      >
        <Text className="text-red-600 font-medium text-center">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}