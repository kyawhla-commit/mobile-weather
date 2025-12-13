import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import OAuthButtons from '../components/OAuthButtons';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(app)/tabs');
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
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
              {/* Header */}
              <View className="mb-8">
                <Text className="text-3xl font-bold text-white mb-2 text-center">အီးမေးလ်စစ်ဆေးပါ</Text>
                <Text className="text-gray-300 text-base text-center">
                  {emailAddress} သို့ အတည်ပြုကုဒ်ပို့ပြီးပါပြီ
                </Text>
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
                    value={code}
                    placeholder="၆ လုံးကုဒ်ထည့်ပါ"
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={setCode}
                    editable={!loading}
                    className="bg-transparent border border-gray-400 rounded-xl p-4 text-base text-white text-center tracking-widest text-2xl font-semibold"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <TouchableOpacity
                  onPress={onVerifyPress}
                  disabled={loading || code.length !== 6}
                  className={`rounded-xl p-4 mt-2 ${
                    loading || code.length !== 6
                      ? 'bg-gray-600' 
                      : 'bg-blue-600'
                  }`}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-base">အီးမေးလ်အတည်ပြုမည်</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setPendingVerification(false)}
                  className="mt-2"
                >
                  <Text className="text-gray-300 text-center">အခြားအီးမေးလ်သုံးမည်</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

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
              <OAuthButtons mode="sign-up" />
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
                onPress={onSignUpPress}
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
                  <Text className="text-white text-center font-semibold text-base">အကောင့်ဖွင့်မည်</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-8 flex-row justify-center items-center gap-1">
              <Text className="text-gray-300">အကောင့်ရှိပြီးသားလား?</Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-400 font-semibold">ဝင်ရောက်မည်</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
