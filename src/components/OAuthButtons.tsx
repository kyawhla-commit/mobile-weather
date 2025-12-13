import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Custom Google icon component
const GoogleIcon = () => (
  <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
    <Text className="text-red-500 text-sm font-bold">G</Text>
  </View>
);

// Placeholder icons for future OAuth providers
const GitHubIcon = () => (
  <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
    <Text className="text-gray-800 text-sm font-bold">⚡</Text>
  </View>
);

const FacebookIcon = () => (
  <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
    <Text className="text-blue-600 text-lg font-bold">f</Text>
  </View>
);

interface OAuthButtonsProps {
  mode?: 'sign-in' | 'sign-up';
}

export default function OAuthButtons({ mode = 'sign-in' }: OAuthButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // Only use Google OAuth for now since it's most commonly enabled by default
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await googleAuth();

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(app)/tabs');
      }
    } catch (err: any) {
      console.error('OAuth error:', err);
      Alert.alert(
        'ဝင်ရောက်မှုအမှား',
        'Google နှင့်ဝင်ရောက်မှုမအောင်မြင်ပါ။ ကျေးဇူးပြု၍ ပြန်ကြိုးစားပါ။',
        [{ text: 'အိုကေ', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleComingSoon = (provider: string) => {
    Alert.alert(
      'မကြာမီရရှိမည်',
      `${provider} OAuth ကို မကြာမီထည့်သွင်းပေးမည်ဖြစ်သည်။`,
      [{ text: 'အိုကေ', style: 'default' }]
    );
  };

  return (
    <View className="gap-4">
      {/* GitHub Button - Coming Soon */}
      <TouchableOpacity
        onPress={() => handleComingSoon('GitHub')}
        className="bg-gray-700 rounded-2xl p-4 flex-row items-center justify-center gap-3"
        activeOpacity={0.8}
        style={{ minHeight: 56 }}
      >
        <GitHubIcon />
        <Text className="text-white font-semibold text-base">
          GitHub နှင့်ဝင်ရောက်မည်
        </Text>
      </TouchableOpacity>
      
      {/* Facebook Button - Coming Soon */}
      <TouchableOpacity
        onPress={() => handleComingSoon('Facebook')}
        className="bg-blue-600 rounded-2xl p-4 flex-row items-center justify-center gap-3"
        activeOpacity={0.8}
        style={{ minHeight: 56 }}
      >
        <FacebookIcon />
        <Text className="text-white font-semibold text-base">
          Facebook နှင့်ဝင်ရောက်မည်
        </Text>
      </TouchableOpacity>
      
      {/* Google Button - Working */}
      <TouchableOpacity
        onPress={handleGoogleSignIn}
        disabled={loading}
        className={`bg-red-500 rounded-2xl p-4 flex-row items-center justify-center gap-3 ${
          loading ? 'opacity-50' : ''
        }`}
        activeOpacity={0.8}
        style={{ minHeight: 56 }}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <GoogleIcon />
            <Text className="text-white font-semibold text-base">
              Google နှင့်ဝင်ရောက်မည်
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}