# 🎨 App Logo Setup Guide

## 📱 **How to Add Your Weather App Logo**

### **Step 1: Prepare Logo Files**

You need to create these image files and place them in the `assets/` folder:

#### **Required Files:**
1. **`assets/icon.png`** - Main app icon (1024x1024px)
2. **`assets/adaptive-icon.png`** - Android adaptive icon (1024x1024px) 
3. **`assets/splash.png`** - Splash screen image (1284x2778px recommended)

#### **Image Specifications:**

**App Icon (`icon.png`):**
- Size: 1024x1024 pixels
- Format: PNG with transparent background
- Style: Your weather app logo design
- Used for: iOS app icon, Android launcher icon

**Adaptive Icon (`adaptive-icon.png`):**
- Size: 1024x1024 pixels  
- Format: PNG with transparent background
- Design: Logo should fit in center 66% of canvas (safe area)
- Used for: Android adaptive icons (various shapes)

**Splash Screen (`splash.png`):**
- Size: 1284x2778 pixels (iPhone 12 Pro Max resolution)
- Format: PNG
- Design: Logo centered on blue background (#1e3a8a)
- Used for: App loading screen

### **Step 2: Logo Design Recommendations**

**Colors:**
- Primary: Blue gradient (#1e3a8a to #3b82f6)
- Accent: White/light colors for contrast
- Background: Transparent for icon, blue for splash

**Elements:**
- Weather symbols (sun, clouds, rain)
- Clean, modern typography
- Subtle farming/agriculture elements
- Myanmar-friendly design

**Style:**
- Minimalist and professional
- Scalable (looks good at small sizes)
- High contrast for visibility
- Rounded corners for modern look

### **Step 3: Generate Your Logo**

Use the AI prompt from earlier to generate your logo, then:

1. **Download** the generated logo files
2. **Resize** them to the required dimensions:
   - Main logo → 1024x1024px → Save as `icon.png`
   - Same logo → 1024x1024px → Save as `adaptive-icon.png`
   - Splash version → 1284x2778px → Save as `splash.png`

3. **Replace** the placeholder files in `assets/` folder

### **Step 4: Test Your Logo**

After adding your logo files:

```bash
# Clear Expo cache and restart
npx expo start --clear
```

**Check these locations:**
- ✅ App icon in device home screen
- ✅ Splash screen when app loads
- ✅ App store listings (when published)
- ✅ Web favicon (for web version)

### **Step 5: Logo Variations for Different Contexts**

**App Store Assets (when publishing):**
- App Store icon: 1024x1024px
- Screenshots: Various device sizes
- Feature graphic: 1024x500px (Android)

**In-App Usage:**
You can also use your logo inside the app:

```typescript
// Example: Add logo to header
import { Image } from 'react-native';

<Image 
  source={require('../assets/icon.png')} 
  style={{ width: 40, height: 40 }}
/>
```

### **Step 6: Current Configuration**

Your `app.json` is already configured with:

```json
{
  "expo": {
    "name": "Climate Companion",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#1e3a8a"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1e3a8a"
      }
    }
  }
}
```

### **Step 7: Logo Tools & Resources**

**Free Design Tools:**
- Canva (templates available)
- GIMP (free Photoshop alternative)
- Figma (web-based design)
- Sketch (Mac only)

**AI Logo Generators:**
- DALL-E 2/3
- Midjourney  
- Stable Diffusion
- Adobe Firefly

**Icon Generators:**
- App Icon Generator (online)
- Icon Kitchen (Android)
- iOS App Icon Template

### **Step 8: Publishing Considerations**

**App Store Guidelines:**
- No text in icon (iOS preference)
- High contrast and visibility
- Consistent branding
- Cultural sensitivity

**Google Play Guidelines:**
- Adaptive icon support
- Various device compatibility
- Material Design principles

## 🚀 **Quick Start**

1. Generate logo using AI prompt
2. Resize to required dimensions
3. Replace files in `assets/` folder
4. Run `npx expo start --clear`
5. Test on device/simulator

Your weather app will now have a professional, branded appearance! 🌤️

## 📞 **Need Help?**

If you need assistance with:
- Logo design refinements
- Image resizing
- Configuration issues
- Publishing preparation

Just ask for specific help with any step!