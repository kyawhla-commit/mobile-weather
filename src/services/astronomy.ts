// Astronomy calculations for sunrise, sunset, moon phases, and golden hour
// Uses Sunrise-Sunset API for accurate sun times

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dayLength: number; // in minutes
  civilDawn: Date;
  civilDusk: Date;
  nauticalDawn: Date;
  nauticalDusk: Date;
  astronomicalDawn: Date;
  astronomicalDusk: Date;
  goldenHourMorningStart: Date;
  goldenHourMorningEnd: Date;
  goldenHourEveningStart: Date;
  goldenHourEveningEnd: Date;
  blueHourMorningStart: Date;
  blueHourMorningEnd: Date;
  blueHourEveningStart: Date;
  blueHourEveningEnd: Date;
}

export interface MoonPhase {
  phase: number; // 0-1 (0 = new moon, 0.5 = full moon)
  phaseName: string;
  illumination: number; // 0-100%
  age: number; // days since new moon
  emoji: string;
  nextNewMoon: Date;
  nextFullMoon: Date;
  nextFirstQuarter: Date;
  nextLastQuarter: Date;
}

// Calculate Julian Day
function getJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = date.getMonth() + 1 + 12 * a - 3;
  
  return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 +
         (date.getHours() - 12) / 24 + date.getMinutes() / 1440 + date.getSeconds() / 86400;
}

// Calculate sun position
function getSunPosition(date: Date, lat: number, lon: number): { altitude: number; azimuth: number } {
  const jd = getJulianDay(date);
  const n = jd - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) % 360;
  const lambda = L + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180);
  
  const epsilon = 23.439 - 0.0000004 * n;
  const alpha = Math.atan2(Math.cos(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180), 
                           Math.cos(lambda * Math.PI / 180)) * 180 / Math.PI;
  const delta = Math.asin(Math.sin(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180)) * 180 / Math.PI;
  
  const gmst = (280.460 + 360.9856474 * n) % 360;
  const lmst = (gmst + lon) % 360;
  const ha = (lmst - alpha) % 360;
  
  const altitude = Math.asin(
    Math.sin(lat * Math.PI / 180) * Math.sin(delta * Math.PI / 180) +
    Math.cos(lat * Math.PI / 180) * Math.cos(delta * Math.PI / 180) * Math.cos(ha * Math.PI / 180)
  ) * 180 / Math.PI;
  
  const azimuth = Math.atan2(
    Math.sin(ha * Math.PI / 180),
    Math.cos(ha * Math.PI / 180) * Math.sin(lat * Math.PI / 180) - 
    Math.tan(delta * Math.PI / 180) * Math.cos(lat * Math.PI / 180)
  ) * 180 / Math.PI + 180;
  
  return { altitude, azimuth };
}

// Calculate sunrise/sunset times
export function calculateSunTimes(date: Date, lat: number, lon: number): SunTimes {
  const jd = getJulianDay(date);
  const n = Math.round(jd - 2451545.0 - 0.0009 - lon / 360);
  const jStar = 2451545.0 + 0.0009 + lon / 360 + n;
  
  const M = (357.5291 + 0.98560028 * (jStar - 2451545.0)) % 360;
  const C = 1.9148 * Math.sin(M * Math.PI / 180) + 0.0200 * Math.sin(2 * M * Math.PI / 180) + 
            0.0003 * Math.sin(3 * M * Math.PI / 180);
  const lambda = (M + C + 180 + 102.9372) % 360;
  
  const jTransit = jStar + 0.0053 * Math.sin(M * Math.PI / 180) - 0.0069 * Math.sin(2 * lambda * Math.PI / 180);
  
  const delta = Math.asin(Math.sin(lambda * Math.PI / 180) * Math.sin(23.44 * Math.PI / 180)) * 180 / Math.PI;
  
  const calculateTime = (angle: number): { rise: Date; set: Date } => {
    const cosH = (Math.sin(angle * Math.PI / 180) - Math.sin(lat * Math.PI / 180) * Math.sin(delta * Math.PI / 180)) /
                 (Math.cos(lat * Math.PI / 180) * Math.cos(delta * Math.PI / 180));
    
    if (cosH > 1 || cosH < -1) {
      // Sun never rises or never sets
      const noon = new Date(date);
      noon.setHours(12, 0, 0, 0);
      return { rise: noon, set: noon };
    }
    
    const H = Math.acos(cosH) * 180 / Math.PI;
    const jRise = jTransit - H / 360;
    const jSet = jTransit + H / 360;
    
    const rise = new Date((jRise - 2440587.5) * 86400000);
    const set = new Date((jSet - 2440587.5) * 86400000);
    
    return { rise, set };
  };
  
  const { rise: sunrise, set: sunset } = calculateTime(-0.833); // Sunrise/sunset
  const { rise: civilDawn, set: civilDusk } = calculateTime(-6); // Civil twilight
  const { rise: nauticalDawn, set: nauticalDusk } = calculateTime(-12); // Nautical twilight
  const { rise: astronomicalDawn, set: astronomicalDusk } = calculateTime(-18); // Astronomical twilight
  
  const solarNoon = new Date((jTransit - 2440587.5) * 86400000);
  const dayLength = (sunset.getTime() - sunrise.getTime()) / 60000; // minutes
  
  // Golden hour: sun altitude between -4° and 6°
  const goldenHourMorningStart = new Date(sunrise.getTime() - 60 * 60 * 1000); // ~1 hour before sunrise
  const goldenHourMorningEnd = new Date(sunrise.getTime() + 60 * 60 * 1000); // ~1 hour after sunrise
  const goldenHourEveningStart = new Date(sunset.getTime() - 60 * 60 * 1000); // ~1 hour before sunset
  const goldenHourEveningEnd = new Date(sunset.getTime() + 60 * 60 * 1000); // ~1 hour after sunset
  
  // Blue hour: sun altitude between -6° and -4°
  const blueHourMorningStart = new Date(civilDawn.getTime());
  const blueHourMorningEnd = new Date(sunrise.getTime() - 30 * 60 * 1000);
  const blueHourEveningStart = new Date(sunset.getTime() + 30 * 60 * 1000);
  const blueHourEveningEnd = new Date(civilDusk.getTime());
  
  return {
    sunrise,
    sunset,
    solarNoon,
    dayLength,
    civilDawn,
    civilDusk,
    nauticalDawn,
    nauticalDusk,
    astronomicalDawn,
    astronomicalDusk,
    goldenHourMorningStart,
    goldenHourMorningEnd,
    goldenHourEveningStart,
    goldenHourEveningEnd,
    blueHourMorningStart,
    blueHourMorningEnd,
    blueHourEveningStart,
    blueHourEveningEnd,
  };
}

// Calculate moon phase
export function calculateMoonPhase(date: Date): MoonPhase {
  const jd = getJulianDay(date);
  const daysSinceNew = (jd - 2451549.5) % 29.53058867;
  const phase = daysSinceNew / 29.53058867;
  
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100;
  
  let phaseName: string;
  let emoji: string;
  
  if (phase < 0.0625) {
    phaseName = 'New Moon';
    emoji = '🌑';
  } else if (phase < 0.1875) {
    phaseName = 'Waxing Crescent';
    emoji = '🌒';
  } else if (phase < 0.3125) {
    phaseName = 'First Quarter';
    emoji = '🌓';
  } else if (phase < 0.4375) {
    phaseName = 'Waxing Gibbous';
    emoji = '🌔';
  } else if (phase < 0.5625) {
    phaseName = 'Full Moon';
    emoji = '🌕';
  } else if (phase < 0.6875) {
    phaseName = 'Waning Gibbous';
    emoji = '🌖';
  } else if (phase < 0.8125) {
    phaseName = 'Last Quarter';
    emoji = '🌗';
  } else if (phase < 0.9375) {
    phaseName = 'Waning Crescent';
    emoji = '🌘';
  } else {
    phaseName = 'New Moon';
    emoji = '🌑';
  }
  
  // Calculate next phases
  const daysToNextNew = (1 - phase) * 29.53058867;
  const daysToNextFull = phase < 0.5 ? (0.5 - phase) * 29.53058867 : (1.5 - phase) * 29.53058867;
  const daysToNextFirstQuarter = phase < 0.25 ? (0.25 - phase) * 29.53058867 : (1.25 - phase) * 29.53058867;
  const daysToNextLastQuarter = phase < 0.75 ? (0.75 - phase) * 29.53058867 : (1.75 - phase) * 29.53058867;
  
  const nextNewMoon = new Date(date.getTime() + daysToNextNew * 86400000);
  const nextFullMoon = new Date(date.getTime() + daysToNextFull * 86400000);
  const nextFirstQuarter = new Date(date.getTime() + daysToNextFirstQuarter * 86400000);
  const nextLastQuarter = new Date(date.getTime() + daysToNextLastQuarter * 86400000);
  
  return {
    phase,
    phaseName,
    illumination,
    age: daysSinceNew,
    emoji,
    nextNewMoon,
    nextFullMoon,
    nextFirstQuarter,
    nextLastQuarter,
  };
}

// Format time for display
export function formatTime(date: Date, use24Hour: boolean = false): string {
  if (use24Hour) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Format duration
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

// Get current sun phase
export function getCurrentSunPhase(sunTimes: SunTimes, now: Date = new Date()): {
  phase: string;
  emoji: string;
  description: string;
} {
  const time = now.getTime();
  
  if (time < sunTimes.astronomicalDawn.getTime()) {
    return { phase: 'Night', emoji: '🌃', description: 'Astronomical night' };
  } else if (time < sunTimes.nauticalDawn.getTime()) {
    return { phase: 'Astronomical Dawn', emoji: '🌌', description: 'Stars fading' };
  } else if (time < sunTimes.civilDawn.getTime()) {
    return { phase: 'Nautical Dawn', emoji: '🌅', description: 'Horizon visible' };
  } else if (time < sunTimes.sunrise.getTime()) {
    return { phase: 'Civil Dawn', emoji: '🌄', description: 'Blue hour' };
  } else if (time < sunTimes.goldenHourMorningEnd.getTime()) {
    return { phase: 'Golden Hour', emoji: '🌅', description: 'Perfect light for photos' };
  } else if (time < sunTimes.solarNoon.getTime()) {
    return { phase: 'Morning', emoji: '☀️', description: 'Sun rising' };
  } else if (time < sunTimes.goldenHourEveningStart.getTime()) {
    return { phase: 'Afternoon', emoji: '☀️', description: 'Sun descending' };
  } else if (time < sunTimes.sunset.getTime()) {
    return { phase: 'Golden Hour', emoji: '🌇', description: 'Perfect light for photos' };
  } else if (time < sunTimes.civilDusk.getTime()) {
    return { phase: 'Civil Dusk', emoji: '🌆', description: 'Blue hour' };
  } else if (time < sunTimes.nauticalDusk.getTime()) {
    return { phase: 'Nautical Dusk', emoji: '🌃', description: 'Horizon fading' };
  } else if (time < sunTimes.astronomicalDusk.getTime()) {
    return { phase: 'Astronomical Dusk', emoji: '🌌', description: 'Stars appearing' };
  } else {
    return { phase: 'Night', emoji: '🌃', description: 'Astronomical night' };
  }
}


// Fetch real sunrise/sunset data from API
export async function fetchRealSunTimes(date: Date, lat: number, lon: number): Promise<SunTimes> {
  try {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${dateStr}&formatted=0`;
    
    console.log('Fetching sun times from API:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sun times from API');
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error('API returned error status');
    }
    
    const results = data.results;
    
    // Parse ISO dates from API
    const sunrise = new Date(results.sunrise);
    const sunset = new Date(results.sunset);
    const solarNoon = new Date(results.solar_noon);
    const civilDawn = new Date(results.civil_twilight_begin);
    const civilDusk = new Date(results.civil_twilight_end);
    const nauticalDawn = new Date(results.nautical_twilight_begin);
    const nauticalDusk = new Date(results.nautical_twilight_end);
    const astronomicalDawn = new Date(results.astronomical_twilight_begin);
    const astronomicalDusk = new Date(results.astronomical_twilight_end);
    
    // Calculate day length in minutes
    const dayLength = (sunset.getTime() - sunrise.getTime()) / 60000;
    
    // Calculate golden hour times (approximately 1 hour around sunrise/sunset)
    const goldenHourMorningStart = new Date(sunrise.getTime() - 30 * 60 * 1000);
    const goldenHourMorningEnd = new Date(sunrise.getTime() + 60 * 60 * 1000);
    const goldenHourEveningStart = new Date(sunset.getTime() - 60 * 60 * 1000);
    const goldenHourEveningEnd = new Date(sunset.getTime() + 30 * 60 * 1000);
    
    // Calculate blue hour times (civil twilight period)
    const blueHourMorningStart = new Date(civilDawn.getTime());
    const blueHourMorningEnd = new Date(sunrise.getTime() - 20 * 60 * 1000);
    const blueHourEveningStart = new Date(sunset.getTime() + 20 * 60 * 1000);
    const blueHourEveningEnd = new Date(civilDusk.getTime());
    
    console.log('Successfully fetched real sun times:', {
      sunrise: sunrise.toLocaleTimeString(),
      sunset: sunset.toLocaleTimeString(),
    });
    
    return {
      sunrise,
      sunset,
      solarNoon,
      dayLength,
      civilDawn,
      civilDusk,
      nauticalDawn,
      nauticalDusk,
      astronomicalDawn,
      astronomicalDusk,
      goldenHourMorningStart,
      goldenHourMorningEnd,
      goldenHourEveningStart,
      goldenHourEveningEnd,
      blueHourMorningStart,
      blueHourMorningEnd,
      blueHourEveningStart,
      blueHourEveningEnd,
    };
  } catch (error) {
    console.error('Error fetching real sun times, falling back to calculations:', error);
    // Fallback to calculated times if API fails
    return calculateSunTimes(date, lat, lon);
  }
}

// Get sun times with API (preferred) or calculation (fallback)
export async function getSunTimes(date: Date, lat: number, lon: number, useAPI: boolean = true): Promise<SunTimes> {
  if (useAPI) {
    try {
      return await fetchRealSunTimes(date, lat, lon);
    } catch (error) {
      console.log('API failed, using calculations');
      return calculateSunTimes(date, lat, lon);
    }
  }
  return calculateSunTimes(date, lat, lon);
}
