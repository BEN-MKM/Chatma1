import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
import supabase from '../config/supabase';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationListener, setNotificationListener] = useState(null);
  const [responseListener, setResponseListener] = useState(null);

  // Mettre à jour le token dans la base de données
  const updateUserPushToken = useCallback(async (token) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          push_token: token,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur mise à jour token:', error);
    }
  }, [user]);

  // Gérer les réponses aux notifications
  const handleNotificationResponse = useCallback(async (response) => {
    const data = response.notification.request.content.data;

    // Navigation vers la conversation si c'est un message
    if (data?.type === 'message' && data?.conversationId) {
      // La navigation doit être gérée via un service de navigation
      // car on ne peut pas utiliser useNavigation ici
      global.navigationRef?.current?.navigate('ChatRoom', {
        conversationId: data.conversationId
      });
    }
  }, []);

  // Demander les permissions et obtenir le token
  const registerForPushNotificationsAsync = useCallback(async () => {
    if (!Device.isDevice) {
      console.log('Les notifications nécessitent un appareil physique');
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission notifications refusée');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } catch (error) {
      console.error('Erreur enregistrement notifications:', error);
    }
  }, []);

  // Effet pour l'initialisation des notifications
  useEffect(() => {
    let isMounted = true;

    const initializeNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token && isMounted) {
        setExpoPushToken(token);
        await updateUserPushToken(token);
      }
    };

    initializeNotifications();

    // Écouter les notifications reçues
    const notificationSub = Notifications.addNotificationReceivedListener(notification => {
      if (isMounted) {
        setNotification(notification);
      }
    });

    // Écouter les réponses aux notifications
    const responseSub = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    setNotificationListener(notificationSub);
    setResponseListener(responseSub);

    return () => {
      isMounted = false;
      if (notificationSub) {
        Notifications.removeNotificationSubscription(notificationSub);
      }
      if (responseSub) {
        Notifications.removeNotificationSubscription(responseSub);
      }
    };
  }, [registerForPushNotificationsAsync, updateUserPushToken, handleNotificationResponse]);

  // Envoyer une notification
  const sendPushNotification = useCallback(async (expoPushToken, title, body, data = {}) => {
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Erreur envoi notification:', error);
    }
  }, []);

  const value = {
    expoPushToken,
    notification,
    sendPushNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
