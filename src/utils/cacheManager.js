import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class CacheManager {
  static CACHE_EXPIRY = 3600000; // 1 heure en millisecondes

  static async setItem(key, value, expiry = this.CACHE_EXPIRY) {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiry,
      };
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Erreur lors de la mise en cache:', error);
    }
  }

  static async getItem(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;

      const item = JSON.parse(data);
      const isExpired = Date.now() - item.timestamp > item.expiry;

      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Erreur lors de la récupération du cache:', error);
      return null;
    }
  }

  static async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
    }
  }

  static async isNetworkAvailable() {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected && netInfo.isInternetReachable;
  }
}

export default CacheManager;