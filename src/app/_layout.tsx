import "../global.css";
import { Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { ThemeProvider } from '../context/ThemeContext'
import { CitiesProvider } from '../context/CitiesContext'
import { NotificationProvider } from '../context/NotificationContext'
import { SettingsProvider } from '../context/SettingsContext'
import { OfflineProvider } from '../context/OfflineContext'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthProvider } from '../context/AuthContext'
import { suppressNavigationWarnings } from '../utils/navigationFix'

// Suppress navigation warnings in development
suppressNavigationWarnings();

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_aW5ub2NlbnQtZW11LTg5LmNsZXJrLmFjY291bnRzLmRldiQ'

if (!publishableKey) {
  console.error('Missing Publishable Key - using fallback')
}

export default function Layout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <AuthProvider>
          <LanguageProvider>
            <OfflineProvider>
              <SettingsProvider>
                <ThemeProvider>
                  <CitiesProvider>
                    <NotificationProvider>
                      <Slot />
                    </NotificationProvider>
                  </CitiesProvider>
                </ThemeProvider>
              </SettingsProvider>
            </OfflineProvider>
          </LanguageProvider>
        </AuthProvider>
      </ClerkLoaded>
    </ClerkProvider>
  )
}
