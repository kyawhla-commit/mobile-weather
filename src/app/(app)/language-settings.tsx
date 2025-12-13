import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function LanguageSettings() {
  const { colors } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const handleLanguageSelect = async (langCode: string) => {
    await setLanguage(langCode as any);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <AntDesign name="left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, flex: 1 }}>
          {t('settings.language')}
        </Text>
      </View>

      {/* Language List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden' }}>
          {SUPPORTED_LANGUAGES.map((lang, index) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => handleLanguageSelect(lang.code)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: index < SUPPORTED_LANGUAGES.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
                backgroundColor: language === lang.code ? colors.primary + '10' : 'transparent',
              }}>
              <Text style={{ fontSize: 32, marginRight: 16 }}>
                {lang.flag}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: language === lang.code ? '700' : '500',
                  color: language === lang.code ? colors.primary : colors.text,
                  marginBottom: 2,
                }}>
                  {lang.nativeName}
                </Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                  {lang.name}
                </Text>
              </View>
              {language === lang.code && (
                <AntDesign name="check" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          gap: 12,
          marginTop: 20,
        }}>
          <AntDesign name="infocirlce" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              {t('settings.language')}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18 }}>
              The app will restart to apply the new language. Your settings and data will be preserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
