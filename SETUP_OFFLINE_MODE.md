# Setup Offline Mode - Installation Guide

## Current Status

The offline mode is **implemented but using a mock** for the NetInfo package. The app will run, but offline detection won't work until you install the real package.

## Installation Steps

### Step 1: Install NetInfo Package

Run this command in your project directory:

```bash
npx expo install @react-native-community/netinfo
```

### Step 2: Update Import Statements

After installing the package, update these two files:

#### File 1: `src/context/OfflineContext.tsx`

**Change line 2 from:**

```typescript
import NetInfo from '../services/netinfo-mock';
```

**To:**

```typescript
import NetInfo from '@react-native-community/netinfo';
```

#### File 2: `src/services/offlineStorage.ts`

**Change line 2 from:**

```typescript
import NetInfo from './netinfo-mock';
```

**To:**

```typescript
import NetInfo from '@react-native-community/netinfo';
```

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npx expo start
```

### Step 4: Test Offline Mode

1. Open the app
2. View weather for a city (gets cached)
3. Turn off WiFi/mobile data
4. You should see an orange "Offline Mode" banner
5. Weather data should still be visible
6. Turn internet back on
7. Banner should disappear

## Current Behavior (Without Real Package)

**With Mock (Current):**

- ✅ App runs without errors
- ✅ All UI works
- ❌ Always shows "Online"
- ❌ No offline detection
- ❌ No network change detection

**With Real Package (After Installation):**

- ✅ App runs without errors
- ✅ All UI works
- ✅ Real-time offline detection
- ✅ Network change detection
- ✅ WiFi/Cellular detection
- ✅ Offline banner shows when offline
- ✅ Auto-sync when back online

## Quick Test

### Before Installation:

```
Profile → Settings → Offline & Cache
Status: Always shows "Online" (mock)
```

### After Installation:

```
Profile → Settings → Offline & Cache
Status: Shows real network state
Turn off WiFi → Status changes to "Offline"
Turn on WiFi → Status changes to "WiFi"
```

## Alternative: Keep Using Mock

If you want to test without installing the package, the app will work but:

- Offline mode won't activate
- Network detection won't work
- Cache will still work
- Manual sync will work

## Files Structure

```
src/
├── services/
│   ├── netinfo-mock.ts          ← Mock (temporary)
│   └── offlineStorage.ts        ← Uses mock (change after install)
├── context/
│   └── OfflineContext.tsx       ← Uses mock (change after install)
└── components/
    └── OfflineBanner.tsx        ← Will work after install
```

## Troubleshooting

### Error: "Unable to resolve @react-native-community/netinfo"

**Solution:** The package isn't installed yet. Either:

1. Install the package (recommended)
2. Keep using the mock (current state)

### After installing, still shows mock behavior

**Solution:** Make sure you:

1. Updated both import statements
2. Restarted the development server
3. Cleared cache: `npx expo start -c`

### Package installation fails

**Solution:** Try:

```bash
npm install @react-native-community/netinfo
# or
yarn add @react-native-community/netinfo
```

## Summary

**Current State:**

- ✅ Offline mode implemented
- ✅ App runs with mock
- ⏳ Waiting for NetInfo package installation

**After Installation:**

- ✅ Full offline detection
- ✅ Real-time network monitoring
- ✅ Automatic sync
- ✅ Complete offline mode

**To Enable Full Offline Mode:**

1. Run: `npx expo install @react-native-community/netinfo`
2. Update 2 import statements
3. Restart server
4. Test offline mode

---

**Note:** The app is fully functional with the mock. Install the real package when you're ready to test offline features!
