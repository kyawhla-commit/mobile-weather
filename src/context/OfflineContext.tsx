import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { isOnline, processOfflineQueue, clearExpiredCache, getTimeSinceLastSync, updateLastSync } from '../services/offlineStorage';

interface OfflineContextType {
  isOnline: boolean;
  isConnected: boolean;
  connectionType: string | null;
  lastSync: number | null;
  syncInProgress: boolean;
  syncNow: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnlineState, setIsOnlineState] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      setIsOnlineState(state.isConnected ?? false);
      setConnectionType(state.type);

      console.log('Network state changed:', {
        isConnected: state.isConnected,
        type: state.type,
      });

      // Process offline queue when coming back online
      if (state.isConnected && !isOnlineState) {
        console.log('Back online! Processing offline queue...');
        handleBackOnline();
      }
    });

    // Initial setup
    const initialize = async () => {
      await checkNetworkState();
      await loadLastSync();
      await clearExpiredCache();
      
      // Set initial sync timestamp if none exists
      const lastSyncTime = await getTimeSinceLastSync();
      if (lastSyncTime === null) {
        console.log('No previous sync found, setting initial sync time');
        await updateLastSync();
        await loadLastSync();
      }
    };

    initialize();

    return () => unsubscribe();
  }, []);

  const checkNetworkState = async () => {
    const online = await isOnline();
    setIsOnlineState(online);
  };

  const loadLastSync = async () => {
    const timeSinceSync = await getTimeSinceLastSync();
    setLastSync(timeSinceSync);
  };

  const handleBackOnline = async () => {
    try {
      await processOfflineQueue();
      await updateLastSync();
      await loadLastSync();
    } catch (error) {
      console.error('Error processing offline queue:', error);
    }
  };

  const syncNow = async () => {
    if (!isOnlineState) {
      console.log('Cannot sync: offline');
      alert('Cannot sync while offline');
      return;
    }

    console.log('Starting sync...');
    setSyncInProgress(true);
    try {
      console.log('Processing offline queue...');
      await processOfflineQueue();
      
      console.log('Clearing expired cache...');
      await clearExpiredCache();
      
      console.log('Updating last sync timestamp...');
      await updateLastSync();
      
      console.log('Loading last sync time...');
      await loadLastSync();
      
      console.log('Sync completed successfully!');
      alert('Sync completed successfully!');
    } catch (error) {
      console.error('Error during sync:', error);
      alert('Sync failed: ' + (error as Error).message);
    } finally {
      setSyncInProgress(false);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline: isOnlineState,
        isConnected,
        connectionType,
        lastSync,
        syncInProgress,
        syncNow,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}
