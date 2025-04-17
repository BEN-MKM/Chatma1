// src/utils/errorHandler.js
import { Alert } from 'react-native';

class ErrorHandler {
  static handle(error, context = '') {
    console.error(`Erreur dans ${context}:`, error);

    let message = 'Une erreur est survenue';
    let title = 'Erreur';

    if (error.response) {
      // Erreur de réponse du serveur
      switch (error.response.status) {
        case 400:
          message = 'Requête invalide';
          break;
        case 401:
          message = 'Non autorisé';
          break;
        case 403:
          message = 'Accès refusé';
          break;
        case 404:
          message = 'Ressource non trouvée';
          break;
        case 500:
          message = 'Erreur serveur';
          break;
        default:
          message = `Erreur ${error.response.status}`;
      }
    } else if (error.request) {
      // Erreur réseau
      message = 'Problème de connexion';
      title = 'Erreur réseau';
    }

    Alert.alert(title, message, [{ text: 'OK' }]);
    
    // Vous pouvez également envoyer l'erreur à un service de monitoring
    // sendToErrorMonitoring(error, context);
  }
}

export default ErrorHandler;