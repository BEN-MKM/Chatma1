import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@ChatMa:';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
const MAX_MESSAGES_PER_CONVERSATION = 100;

// Clés de cache
const KEYS = {
  CONVERSATIONS: `${CACHE_PREFIX}conversations`,
  MESSAGES: `${CACHE_PREFIX}messages:`,
  USER_PROFILES: `${CACHE_PREFIX}profiles:`,
  LAST_SYNC: `${CACHE_PREFIX}lastSync:`,
};

/**
 * Stocke les conversations dans le cache
 * @param {Array} conversations - Liste des conversations
 * @returns {Promise<void>}
 */
export const cacheConversations = async (conversations) => {
  try {
    const data = {
      timestamp: Date.now(),
      conversations,
    };
    await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur cache conversations:', error);
  }
};

/**
 * Récupère les conversations du cache
 * @returns {Promise<Array>} Liste des conversations
 */
export const getCachedConversations = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
    if (!data) return null;

    const { timestamp, conversations } = JSON.parse(data);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      await AsyncStorage.removeItem(KEYS.CONVERSATIONS);
      return null;
    }

    return conversations;
  } catch (error) {
    console.error('Erreur lecture cache conversations:', error);
    return null;
  }
};

/**
 * Stocke les messages d'une conversation dans le cache
 * @param {string} conversationId - ID de la conversation
 * @param {Array} messages - Liste des messages
 * @returns {Promise<void>}
 */
export const cacheMessages = async (conversationId, messages) => {
  try {
    const key = `${KEYS.MESSAGES}${conversationId}`;
    const data = {
      timestamp: Date.now(),
      messages: messages.slice(0, MAX_MESSAGES_PER_CONVERSATION),
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur cache messages:', error);
  }
};

/**
 * Récupère les messages d'une conversation du cache
 * @param {string} conversationId - ID de la conversation
 * @returns {Promise<Array>} Liste des messages
 */
export const getCachedMessages = async (conversationId) => {
  try {
    const key = `${KEYS.MESSAGES}${conversationId}`;
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;

    const { timestamp, messages } = JSON.parse(data);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return messages;
  } catch (error) {
    console.error('Erreur lecture cache messages:', error);
    return null;
  }
};

/**
 * Stocke un profil utilisateur dans le cache
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} profile - Profil de l'utilisateur
 * @returns {Promise<void>}
 */
export const cacheUserProfile = async (userId, profile) => {
  try {
    const key = `${KEYS.USER_PROFILES}${userId}`;
    const data = {
      timestamp: Date.now(),
      profile,
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur cache profil:', error);
  }
};

/**
 * Récupère un profil utilisateur du cache
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Profil de l'utilisateur
 */
export const getCachedUserProfile = async (userId) => {
  try {
    const key = `${KEYS.USER_PROFILES}${userId}`;
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;

    const { timestamp, profile } = JSON.parse(data);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Erreur lecture cache profil:', error);
    return null;
  }
};

/**
 * Met à jour la date de dernière synchronisation
 * @param {string} type - Type de données ('conversations', 'messages', etc.)
 * @returns {Promise<void>}
 */
export const updateLastSync = async (type) => {
  try {
    const key = `${KEYS.LAST_SYNC}${type}`;
    await AsyncStorage.setItem(key, Date.now().toString());
  } catch (error) {
    console.error('Erreur mise à jour sync:', error);
  }
};

/**
 * Récupère la date de dernière synchronisation
 * @param {string} type - Type de données ('conversations', 'messages', etc.)
 * @returns {Promise<number>} Timestamp de la dernière synchronisation
 */
export const getLastSync = async (type) => {
  try {
    const key = `${KEYS.LAST_SYNC}${type}`;
    const timestamp = await AsyncStorage.getItem(key);
    return timestamp ? parseInt(timestamp) : null;
  } catch (error) {
    console.error('Erreur lecture sync:', error);
    return null;
  }
};

/**
 * Nettoie le cache expiré
 * @returns {Promise<void>}
 */
export const cleanExpiredCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));

    for (const key of chatKeys) {
      const data = await AsyncStorage.getItem(key);
      if (!data) continue;

      const { timestamp } = JSON.parse(data);
      if (Date.now() - timestamp > CACHE_EXPIRY) {
        await AsyncStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Erreur nettoyage cache:', error);
  }
};

/**
 * Nettoie tout le cache
 * @returns {Promise<void>}
 */
export const clearAllCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(chatKeys);
  } catch (error) {
    console.error('Erreur suppression cache:', error);
  }
};

export default {
  cacheConversations,
  getCachedConversations,
  cacheMessages,
  getCachedMessages,
  cacheUserProfile,
  getCachedUserProfile,
  updateLastSync,
  getLastSync,
  cleanExpiredCache,
  clearAllCache,
};
