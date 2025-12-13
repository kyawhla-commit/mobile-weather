import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import OAuthButtons from '../components/OAuthButtons';

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(app)/tabs');
      } else {
        setError('Sign in failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#1e3a8a' }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-md mx-auto">
            {/* OAuth Buttons */}
            <View className="mb-8">
              <OAuthButtons mode="sign-in" />
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-400" />
              <Text className="mx-4 text-gray-300 text-sm">သို့မဟုတ်</Text>
              <View className="flex-1 h-px bg-gray-400" />
            </View>

            {/* Form */}
            <View className="gap-4">
              {error ? (
                <View className="bg-red-500/20 border border-red-400 rounded-xl p-3">
                  <Text className="text-red-300 text-sm">{error}</Text>
                </View>
              ) : null}

              <View>
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={emailAddress}
                  placeholder="အီးမေးလ်လိပ်စာနှင့်ဝင်ရောက်မည်"
                  onChangeText={setEmailAddress}
                  editable={!loading}
                  className="bg-transparent border border-gray-400 rounded-xl p-4 text-base text-white"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View>
                <TextInput
                  value={password}
                  placeholder="အောက်ခံစကားဝှက်မည်"
                  secureTextEntry={true}
                  onChangeText={setPassword}
                  editable={!loading}
                  className="bg-transparent border border-gray-400 rounded-xl p-4 text-base text-white"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <TouchableOpacity
                onPress={onSignInPress}
                disabled={loading || !emailAddress || !password}
                className={`rounded-xl p-4 mt-2 ${
                  loading || !emailAddress || !password 
                    ? 'bg-gray-600' 
                    : 'bg-blue-600'
                }`}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-base">ဝင်ရောက်မည်</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-8 flex-row justify-center items-center gap-1">
              <Text className="text-gray-300">အကောင့်မရှိသေးပါသလား?</Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-400 font-semibold">အကောင့်ဖွင့်မည်</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
