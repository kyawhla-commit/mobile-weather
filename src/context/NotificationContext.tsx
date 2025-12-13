import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationContextType {
  unreadCount: number;
  incrementUnreadCount: () => void;
  clearUnreadCount: () => void;
  setUnreadCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCountState] = useState(0);

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await AsyncStorage.getItem('unreadAlertCount');
      if (count) {
        setUnreadCountState(parseInt(count, 10));
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const saveUnreadCount = async (count: number) => {
    try {
      await AsyncStorage.setItem('unreadAlertCount', count.toString());
      setUnreadCountState(count);
    } catch (error) {
      console.error('Error saving unread count:', error);
    }
  };

  const incrementUnreadCount = () => {
    const newCount = unreadCount + 1;
    saveUnreadCount(newCount);
  };

  const clearUnreadCount = () => {
    saveUnreadCount(0);
  };

  const setUnreadCount = (count: number) => {
    saveUnreadCount(count);
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        incrementUnreadCount,
        clearUnreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationCount() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationCount must be used within NotificationProvider');
  }
  return context;
}
