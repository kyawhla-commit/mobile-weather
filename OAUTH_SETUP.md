# OAuth Setup Guide

## Overview
Your weather app now supports OAuth authentication using Clerk. The UI is designed with Myanmar language support and matches your specified design.

## Features Implemented
- ✅ Google OAuth (fully working) - "Google နှင့်ဝင်ရောက်မည်"
- 🔄 GitHub OAuth (coming soon) - "GitHub နှင့်ဝင်ရောက်မည်"
- 🔄 Facebook OAuth (coming soon) - "Facebook နှင့်ဝင်ရောက်မည်"
- ✅ Dark blue gradient background (#1e3a8a)
- ✅ Rounded buttons with proper icons
- ✅ Myanmar language support for all text
- ✅ Email/password fallback with Myanmar placeholders
- ✅ Error handling with Myanmar messages

## Current Status
- **Google OAuth**: ✅ Ready to use (just needs to be enabled in Clerk)
- **GitHub OAuth**: 🔄 Shows "Coming Soon" message when tapped
- **Facebook OAuth**: 🔄 Shows "Coming Soon" message when tapped

## Clerk Dashboard Setup

### 1. Enable Google OAuth (Priority)
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to "User & Authentication" → "Social Connections"
4. Enable Google:
   - Toggle "Google" to enabled
   - Add your Google OAuth client credentials
   - Set redirect URL: `https://your-app.clerk.accounts.dev/v1/oauth_callback`

### 2. Optional: Enable Additional Providers Later
Once Google is working, you can enable:

#### GitHub
- Toggle "GitHub" to enabled in Clerk dashboard
- Update OAuthButtons.tsx to use `useOAuth({ strategy: 'oauth_github' })`

#### Facebook
- Toggle "Facebook" to enabled in Clerk dashboard  
- Update OAuthButtons.tsx to use `useOAuth({ strategy: 'oauth_facebook' })`

### 2. Configure OAuth Apps

#### GitHub OAuth App
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth App with:
   - Application name: "Weather App"
   - Homepage URL: Your app URL
   - Authorization callback URL: `https://your-app.clerk.accounts.dev/v1/oauth_callback`

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-app.clerk.accounts.dev/v1/oauth_callback`

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create new app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs: `https://your-app.clerk.accounts.dev/v1/oauth_callback`

## Testing OAuth
1. Run your app: `npm start`
2. Navigate to sign-in screen
3. Tap "Google နှင့်ဝင်ရောက်မည်" button
4. Complete OAuth flow in browser
5. Should redirect back to app and sign in
6. GitHub/Facebook buttons show "Coming Soon" alerts

## Error Fixed
- ❌ **Previous Error**: `oauth_github does not match one of the allowed values`
- ✅ **Solution**: Removed unconfigured OAuth providers, kept only Google
- ✅ **User Experience**: GitHub/Facebook show "Coming Soon" instead of errors

## Files Modified
- `src/components/OAuthButtons.tsx` - OAuth button component with Myanmar text
- `src/app/sign-in.tsx` - Updated sign-in screen with new design
- `src/app/sign-up.tsx` - Updated sign-up screen with new design
- `src/context/AuthContext.tsx` - Auth context for state management
- `src/app/_layout.tsx` - Added AuthProvider wrapper

## Myanmar Text Used
- "GitHub နှင့်ဝင်ရောက်မည်" - Continue with GitHub
- "Facebook နှင့်ဝင်ရောက်မည်" - Continue with Facebook  
- "Google နှင့်ဝင်ရောက်မည်" - Continue with Google
- "သို့မဟုတ်" - Or
- "အီးမေးလ်လိပ်စာနှင့်ဝင်ရောက်မည်" - Sign in with email
- "အောက်ခံစကားဝှက်မည်" - Password
- "ဝင်ရောက်မည်" - Sign In
- "အကောင့်ဖွင့်မည်" - Create Account

## Next Steps
1. Configure OAuth providers in Clerk dashboard
2. Test OAuth flows
3. Customize error messages if needed
4. Add user profile management features