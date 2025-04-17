import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../config/supabase';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
    this.token = null;
    this.supabaseSubscriptions = [];
    this.userId = null;
  }

  async init(userId) {
    this.userId = userId;
    await this.configurePushNotifications();
    await this.registerForPushNotificationsAsync();
    await this.setupListeners();
    await this.setupSupabaseSubscriptions();
    await this.updateDeviceToken();
  }

  async configurePushNotifications() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Configuration des catégories de notifications
    await Notifications.setNotificationCategoryAsync('social', [
      {
        identifier: 'like',
        buttonTitle: 'Voir',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'comment',
        buttonTitle: 'Répondre',
        options: {
          opensAppToForeground: true,
        },
      },
    ]);
  }

  async setupSupabaseSubscriptions() {
    if (!this.userId) return;

    // Souscription aux nouveaux messages
    const messagesSubscription = supabase
      .channel('new_messages')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${this.userId}`
        },
        async (payload) => {
          await this.handleNewMessage(payload.new);
        }
      )
      .subscribe();

    // Souscription aux mentions
    const mentionsSubscription = supabase
      .channel('mentions')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mentions',
          filter: `mentioned_user_id=eq.${this.userId}`
        },
        async (payload) => {
          await this.handleMention(payload.new);
        }
      )
      .subscribe();

    // Souscription aux likes et commentaires
    const socialSubscription = supabase
      .channel('social_notifications')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'social_notifications',
          filter: `user_id=eq.${this.userId}`
        },
        async (payload) => {
          await this.handleSocialNotification(payload.new);
        }
      )
      .subscribe();

    this.supabaseSubscriptions.push(
      messagesSubscription,
      mentionsSubscription,
      socialSubscription
    );
  }

  async updateDeviceToken() {
    if (!this.userId || !this.token) return;

    try {
      const deviceInfo = {
        user_id: this.userId,
        token: this.token,
        platform: Platform.OS,
        app_version: Device.osVersion,
        last_active: new Date().toISOString()
      };

      const { error } = await supabase
        .from('device_tokens')
        .upsert(deviceInfo, {
          onConflict: 'user_id,token',
          returning: 'minimal'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du token:', error);
    }
  }

  async registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
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
        throw new Error('Permission to receive notifications was denied');
      }

      const token = await Notifications.getExpoPushTokenAsync();
      this.token = token;

      // Sauvegarder le token
      await AsyncStorage.setItem('pushToken', token.data);

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  setupListeners() {
    this.notificationListener = Notifications.addNotificationReceivedListener(
      this.handleNotification
    );

    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse
    );
  }

  handleNotification = (notification) => {
    // Gérer la notification reçue
    const { data, body, title } = notification.request.content;
    
    // Mettre à jour le badge
    this.updateBadgeCount();
    
    // Émettre un événement pour l'interface utilisateur
    // Vous pouvez utiliser un gestionnaire d'événements ici
  };

  handleNotificationResponse = (response) => {
    const { notification } = response;
    const { data } = notification.request.content;

    // Navigation vers le contenu approprié selon le type de notification
    switch (data.type) {
      case 'post':
        // Naviguer vers le post
        break;
      case 'message':
        // Ouvrir la conversation
        break;
      case 'profile':
        // Afficher le profil
        break;
    }
  };

  async scheduleNotification({ title, body, data, trigger }) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          badge: 1,
        },
        trigger,
      });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async updateBadgeCount() {
    try {
      const currentBadgeCount = await Notifications.getBadgeCountAsync();
      await Notifications.setBadgeCountAsync(currentBadgeCount + 1);
    } catch (error) {
      console.error('Error updating badge count:', error);
    }
  }

  async clearBadgeCount() {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge count:', error);
    }
  }

  cleanup() {
    // Nettoyer les listeners Expo
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }

    // Nettoyer les souscriptions Supabase
    this.supabaseSubscriptions.forEach(subscription => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    });
    this.supabaseSubscriptions = [];

    // Réinitialiser les variables
    this.userId = null;
    this.token = null;
  }
}

export default new NotificationService();
