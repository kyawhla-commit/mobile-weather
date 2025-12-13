import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData } from '../services/weather';

interface SavedCity extends LocationData {
  temperature?: number;
  weatherText?: string;
  weatherIcon?: number;
}

interface CitiesContextType {
  cities: SavedCity[];
  addCity: (city: LocationData) => Promise<void>;
  removeCity: (cityKey: string) => Promise<void>;
  updateCityWeather: (
    cityKey: string,
    temperature: number,
    weatherText: string,
    weatherIcon: number
  ) => void;
}

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);

export function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<SavedCity[]>([]);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const savedCities = await AsyncStorage.getItem('savedCities');
      if (savedCities) {
        setCities(JSON.parse(savedCities));
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const saveCities = async (newCities: SavedCity[]) => {
    try {
      await AsyncStorage.setItem('savedCities', JSON.stringify(newCities));
      setCities(newCities);
    } catch (error) {
      console.error('Error saving cities:', error);
    }
  };

  const addCity = async (city: LocationData) => {
    const cityExists = cities.some((c) => c.Key === city.Key);
    if (!cityExists) {
      const newCities = [...cities, city];
      await saveCities(newCities);
    }
  };

  const removeCity = async (cityKey: string) => {
    const newCities = cities.filter((c) => c.Key !== cityKey);
    await saveCities(newCities);
  };

  const updateCityWeather = (
    cityKey: string,
    temperature: number,
    weatherText: string,
    weatherIcon: number
  ) => {
    setCities((prevCities) =>
      prevCities.map((city) =>
        city.Key === cityKey
          ? { ...city, temperature, weatherText, weatherIcon }
          : city
      )
    );
  };

  return (
    <CitiesContext.Provider
      value={{ cities, addCity, removeCity, updateCityWeather }}>
      {children}
    </CitiesContext.Provider>
  );
}

export function useCities() {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error('useCities must be used within CitiesProvider');
  }
  return context;
}
