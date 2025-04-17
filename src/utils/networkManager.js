import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

class NetworkManager {
  static MAX_RETRIES = 3;
  static RETRY_DELAY = 1000; // 1 seconde
  static CONNECTION_TIMEOUT = 10000; // 10 secondes

  static async isConnected() {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected && state.isInternetReachable;
    } catch (error) {
      console.error('Erreur lors de la vérification de la connexion:', error);
      return false;
    }
  }

  static async waitForConnection(timeout = this.CONNECTION_TIMEOUT) {
    return new Promise((resolve) => {
      const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected && state.isInternetReachable) {
          unsubscribe();
          resolve(true);
        }
      });

      // Timeout après X secondes
      setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, timeout);
    });
  }

  static async retryOperation(operation, retries = this.MAX_RETRIES, customDelay) {
    let lastError;
    const delay = customDelay || this.RETRY_DELAY;

    for (let i = 0; i < retries; i++) {
      try {
        if (i > 0) {
          // Vérifier la connexion avant chaque nouvelle tentative
          const isConnected = await this.isConnected();
          if (!isConnected) {
            console.log('Attente de la connexion réseau...');
            const connectionRestored = await this.waitForConnection();
            if (!connectionRestored) {
              throw new Error('Impossible de se connecter au réseau');
            }
          }
        }

        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`Tentative ${i + 1}/${retries} échouée:`, error.message);

        if (i === retries - 1) {
          break;
        }

        // Attendre avant la prochaine tentative avec un délai exponentiel
        await new Promise(resolve => 
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      }
    }

    throw lastError;
  }

  static async fetchWithTimeout(resource, options = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout || this.CONNECTION_TIMEOUT);

    try {
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  static getNetworkErrorMessage(error) {
    if (!error) return 'Une erreur réseau est survenue';

    if (error.message.includes('abort')) {
      return 'La requête a été interrompue en raison d\'un délai d\'attente dépassé';
    }

    switch (error.code) {
      case 'ECONNABORTED':
        return 'La connexion a été interrompue';
      case 'ECONNREFUSED':
        return 'La connexion a été refusée';
      case 'ENOTFOUND':
        return 'Impossible de se connecter au serveur';
      case 'ETIMEDOUT':
        return 'Le délai de connexion a expiré';
      default:
        if (error.message.includes('Network request failed')) {
          return 'La requête réseau a échoué. Vérifiez votre connexion.';
        }
        return error.message || 'Une erreur réseau est survenue';
    }
  }

  static async handleNetworkOperation(operation, options = {}) {
    const {
      retries = this.MAX_RETRIES,
      timeout = this.CONNECTION_TIMEOUT,
      showError = true,
      customErrorHandler
    } = options;

    try {
      return await this.retryOperation(
        async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          try {
            const result = await operation(controller.signal);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        },
        retries
      );
    } catch (error) {
      const errorMessage = this.getNetworkErrorMessage(error);
      
      if (customErrorHandler) {
        customErrorHandler(error, errorMessage);
      } else if (showError) {
        // Vous pouvez implémenter ici votre logique d'affichage d'erreur
        console.error('Erreur réseau:', errorMessage);
      }

      throw error;
    }
  }
}

export default NetworkManager;
