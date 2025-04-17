import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState([]);

  const processPendingActions = useCallback(async () => {
    if (pendingActions.length === 0) return;

    for (const action of pendingActions) {
      try {
        switch (action.type) {
          case 'SEND_MESSAGE':
            await processOfflineMessage(action.payload);
            break;
          case 'UPDATE_MESSAGE':
            await processOfflineUpdate(action.payload);
            break;
          case 'DELETE_MESSAGE':
            await processOfflineDelete(action.payload);
            break;
          // Add more cases as needed
        }
      } catch (error) {
        console.error('Error processing action:', error);
        continue;
      }
    }

    await savePendingActions([]);
  }, [pendingActions]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        processPendingActions();
      }
    });

    loadPendingActions();
    return () => unsubscribe();
  }, [processPendingActions]);

  const loadPendingActions = async () => {
    try {
      const actions = await AsyncStorage.getItem('pendingActions');
      if (actions) {
        setPendingActions(JSON.parse(actions));
      }
    } catch (error) {
      console.error('Error loading pending actions:', error);
    }
  };

  const savePendingActions = async (actions) => {
    try {
      await AsyncStorage.setItem('pendingActions', JSON.stringify(actions));
      setPendingActions(actions);
    } catch (error) {
      console.error('Error saving pending actions:', error);
    }
  };

  const addPendingAction = async (action) => {
    const newActions = [...pendingActions, action];
    await savePendingActions(newActions);
  };

  const processOfflineMessage = async (message) => {
    // Implement your message sending logic here
  };

  const processOfflineUpdate = async (update) => {
    // Implement your update logic here
  };

  const processOfflineDelete = async (messageId) => {
    // Implement your delete logic here
  };

  return (
    <OfflineContext.Provider 
      value={{ 
        isOnline, 
        addPendingAction,
        pendingActions,
        processPendingActions 
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
