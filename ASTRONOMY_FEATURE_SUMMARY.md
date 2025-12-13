# Sunrise/Sunset & Moon Phases Feature 🌅🌙

## ✅ Complete Astronomical Data System

### **1. Astronomy Service** 🔭
Created `src/services/astronomy.ts`:

**Sun Calculations:**
- Sunrise & sunset times
- Solar noon
- Day length
- Civil/nautical/astronomical twilight
- Golden hour (morning & evening)
- Blue hour (morning & evening)
- Current sun phase detection

**Moon Calculations:**
- Current moon phase
- Phase name & emoji
- Illumination percentage
- Moon age (days since new moon)
- Next phase dates (new, full, quarters)

**Functions:**
- `calculateSunTimes()` - All sun-related times
- `calculateMoonPhase()` - Moon phase data
- `getCurrentSunPhase()` - Real-time sun position
- `formatTime()` - 12/24 hour formatting
- `formatDuration()` - Human-readable durations

### **2. Astronomy Page** 🌌
Created `src/app/(app)/astronomy.tsx`:

**Features:**

#### **Date Navigation** 📅
- View any date (past/future)
- Previous/next day buttons
- "Today" quick button
- Current date display

#### **Current Phase (Today Only)** ⏰
- Real-time sun phase
- Phase emoji & name
- Description
- Updates every minute

#### **Sun Times** ☀️
- **Sunrise & Sunset**
  - Large display with emojis
  - Day length calculation
  - Formatted times

- **Golden Hour** ✨
  - Morning times
  - Evening times
  - Perfect for photography
  - Orange card design

- **Blue Hour** 💙
  - Morning times
  - Evening times
  - Soft diffused light
  - Blue card design

- **Other Times**
  - Solar noon
  - Civil dawn/dusk
  - Nautical twilight
  - Astronomical twilight

#### **Moon Phase** 🌙
- **Current Phase Display**
  - Large moon emoji
  - Phase name
  - Illumination percentage
  - Progress bar
  - Moon age

- **Upcoming Phases**
  - Next new moon
  - Next first quarter
  - Next full moon
  - Next last quarter
  - Dates for each

### **3. Integration** 🔗

**Added to Weather Pages:**
- Weather tab quick actions
- City detail quick actions
- Orange "Sun & Moon" button
- 🌅 Sunrise emoji icon

**Navigation:**
```
Weather → Sun & Moon → Astronomy Page
City Detail → Sun & Moon → Astronomy Page
```

### **4. Sun Phases** 🌞

**Detected Phases:**
1. **Night** 🌃 - Astronomical night
2. **Astronomical Dawn** 🌌 - Stars fading
3. **Nautical Dawn** 🌅 - Horizon visible
4. **Civil Dawn** 🌄 - Blue hour
5. **Sunrise** 🌅 - Sun rising
6. **Golden Hour** ✨ - Perfect light
7. **Morning** ☀️ - Sun ascending
8. **Solar Noon** ☀️ - Highest point
9. **Afternoon** ☀️ - Sun descending
10. **Golden Hour** 🌇 - Perfect light
11. **Sunset** 🌇 - Sun setting
12. **Civil Dusk** 🌆 - Blue hour
13. **Nautical Dusk** 🌃 - Horizon fading
14. **Astronomical Dusk** 🌌 - Stars appearing

### **5. Moon Phases** 🌙

**8 Moon Phases:**
1. 🌑 **New Moon** (0%)
2. 🌒 **Waxing Crescent** (1-49%)
3. 🌓 **First Quarter** (50%)
4. 🌔 **Waxing Gibbous** (51-99%)
5. 🌕 **Full Moon** (100%)
6. 🌖 **Waning Gibbous** (99-51%)
7. 🌗 **Last Quarter** (50%)
8. 🌘 **Waning Crescent** (49-1%)

### **6. Golden Hour** ✨

**What is it?**
- Period shortly after sunrise or before sunset
- Sun is low on horizon (altitude -4° to 6°)
- Warm, soft, diffused light
- Perfect for photography
- Lasts about 1 hour

**When:**
- Morning: ~1 hour around sunrise
- Evening: ~1 hour around sunset

**Best for:**
- Portrait photography
- Landscape photos
- Outdoor activities
- Romantic moments

### **7. Blue Hour** 💙

**What is it?**
- Period of twilight
- Sun is below horizon (altitude -6° to -4°)
- Deep blue sky
- Soft, even lighting
- Lasts about 20-30 minutes

**When:**
- Morning: Before sunrise
- Evening: After sunset

**Best for:**
- Cityscape photography
- Architecture photos
- Long exposures
- Artistic shots

### **8. Calculations** 🔢

**Accuracy:**
- Based on astronomical formulas
- Julian day calculations
- Sun position algorithms
- Moon phase cycles (29.53 days)
- Location-specific (lat/lon)

**Data Sources:**
- Mathematical calculations
- No API required
- Works offline
- Instant results

### **9. Features Summary** 🎯

**Sun Data:**
- ✅ Sunrise/sunset times
- ✅ Day length
- ✅ Golden hour times
- ✅ Blue hour times
- ✅ Twilight times
- ✅ Solar noon
- ✅ Current phase

**Moon Data:**
- ✅ Current phase
- ✅ Illumination %
- ✅ Moon age
- ✅ Phase emoji
- ✅ Next phases
- ✅ Phase calendar

**User Experience:**
- ✅ Date navigation
- ✅ Real-time updates
- ✅ 12/24 hour format
- ✅ Pull to refresh
- ✅ Beautiful UI
- ✅ Informative cards

### **10. Use Cases** 💡

**For Photographers:**
- Plan golden hour shoots
- Find blue hour times
- Track moon phases
- Schedule outdoor sessions

**For Farmers:**
- Plan work schedules
- Track daylight hours
- Moon phase planting
- Harvest timing

**For General Users:**
- Plan outdoor activities
- Track sunrise/sunset
- Moon watching
- Astronomical events

### **11. Visual Design** 🎨

**Color Coding:**
- 🟠 Orange - Golden hour
- 🔵 Blue - Blue hour
- 🟣 Purple - Primary card
- ⚪ White - Text on colored backgrounds

**Cards:**
- Rounded corners
- Shadow effects
- Icon badges
- Progress bars
- Emoji indicators

**Layout:**
- Clean sections
- Easy navigation
- Scrollable content
- Responsive design

### **12. Technical Details** 🔧

**Files Created:**
- ✅ `src/services/astronomy.ts` - Calculations
- ✅ `src/app/(app)/astronomy.tsx` - UI page

**Files Updated:**
- ✅ `src/app/(app)/city-detail.tsx` - Added button
- ✅ `src/app/(app)/tabs/weather.tsx` - Added button

**Dependencies:**
- None! Pure JavaScript calculations
- No external APIs
- Works offline
- Fast performance

### **13. Future Enhancements** 🚀

Potential additions:
- [ ] Moonrise/moonset times
- [ ] Eclipse predictions
- [ ] Planet positions
- [ ] Star charts
- [ ] Astronomical events
- [ ] Tide predictions
- [ ] Meteor showers
- [ ] Constellation guide

---

## Quick Access

### **From Weather Page:**
1. View weather for a city
2. Scroll to quick actions
3. Tap **"Sun & Moon"** (orange button)
4. View astronomical data

### **From City Detail:**
1. Go to My Cities
2. Tap a city
3. Scroll to quick actions
4. Tap **"Sun & Moon"** (orange button)
5. View astronomical data

### **Features:**
- 🌅 Sunrise & sunset times
- ✨ Golden hour calculator
- 💙 Blue hour times
- 🌙 Moon phase calendar
- 📅 Date navigation
- ⏰ Real-time updates
- 🌍 Location-specific
- 📸 Photography planning

---

## Summary

The Astronomy feature provides:
- 🌅 **Sunrise/Sunset** - Accurate times for any date
- ✨ **Golden Hour** - Perfect photography timing
- 💙 **Blue Hour** - Twilight magic moments
- 🌙 **Moon Phases** - Complete lunar calendar
- 📅 **Date Navigation** - Past & future dates
- ⏰ **Real-time** - Current sun phase
- 🎨 **Beautiful UI** - Intuitive design
- 📍 **Location-based** - Accurate for your area

Perfect for photographers, farmers, and anyone who loves tracking the sun and moon! 🌅🌙✨
