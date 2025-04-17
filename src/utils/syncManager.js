import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import supabase from '../config/supabase';

class SyncManager {
  static SYNC_QUEUE_KEY = '@sync_queue';
  static MAX_RETRIES = 3;
  static RETRY_DELAY = 1000; // 1 seconde
  static SYNC_INTERVAL = 60000; // 1 minute

  static syncInterval = null;

  static async startSync() {
    if (this.syncInterval) return;
    
    // Démarrer la synchronisation périodique
    this.syncInterval = setInterval(() => {
      this.processSyncQueue();
    }, this.SYNC_INTERVAL);

    // Écouter les changements de connectivité
    NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        this.processSyncQueue();
      }
    });

    // Traiter la file immédiatement au démarrage
    await this.processSyncQueue();
  }

  static stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  static async addToSyncQueue(action) {
    try {
      const queue = await this.getSyncQueue();
      const newAction = {
        ...action,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        retries: 0
      };
      queue.push(newAction);
      await AsyncStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
      
      // Tenter de synchroniser immédiatement si possible
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected && netInfo.isInternetReachable) {
        this.processSyncQueue();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la file de synchronisation:', error);
    }
  }

  static async getSyncQueue() {
    try {
      const queue = await AsyncStorage.getItem(this.SYNC_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération de la file de synchronisation:', error);
      return [];
    }
  }

  static async processSyncQueue() {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected || !netInfo.isInternetReachable) return;

    try {
      const queue = await this.getSyncQueue();
      if (queue.length === 0) return;

      const processedActions = [];
      const failedActions = [];

      for (const action of queue) {
        try {
          if (action.retries >= this.MAX_RETRIES) {
            processedActions.push(action); // Abandonner après MAX_RETRIES tentatives
            continue;
          }

          await this.processAction(action);
          processedActions.push(action);
        } catch (error) {
          console.error(`Erreur lors du traitement de l'action ${action.type}:`, error);
          action.retries = (action.retries || 0) + 1;
          action.lastError = error.message;
          failedActions.push(action);
        }
      }

      // Mettre à jour la file avec uniquement les actions échouées
      const newQueue = queue.filter(
        action => !processedActions.includes(action) || failedActions.includes(action)
      );
      await AsyncStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(newQueue));

    } catch (error) {
      console.error('Erreur lors du traitement de la file de synchronisation:', error);
    }
  }

  static async processAction(action) {
    switch (action.type) {
      case 'UPDATE_PROFILE':
        await this.handleProfileUpdate(action.data);
        break;
      case 'UPDATE_SETTINGS':
        await this.handleSettingsUpdate(action.data);
        break;
      case 'UPDATE_AVATAR':
        await this.handleAvatarUpdate(action.data);
        break;
      default:
        throw new Error(`Type d'action non supporté: ${action.type}`);
    }
  }

  static async handleProfileUpdate(data) {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', data.id);

    if (error) throw error;
  }

  static async handleSettingsUpdate(data) {
    const { settingType, settings, userId } = data;
    const { error } = await supabase
      .from(`${settingType}_settings`)
      .upsert({
        user_id: userId,
        settings,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  static async handleAvatarUpdate(data) {
    const { userId, avatarUrl, oldAvatarUrl } = data;

    // Supprimer l'ancienne image si elle existe
    if (oldAvatarUrl) {
      const oldPath = oldAvatarUrl.split('/').pop();
      await supabase.storage
        .from('avatars')
        .remove([`${userId}/${oldPath}`]);
    }

    // Mettre à jour le profil avec la nouvelle URL
    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  }

  static async retryOperation(operation) {
    let lastError;
    for (let i = 0; i < this.MAX_RETRIES; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (i === this.MAX_RETRIES - 1) break;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * Math.pow(2, i)));
      }
    }
    throw lastError;
  }
}

export default SyncManager;
