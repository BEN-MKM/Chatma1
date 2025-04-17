import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Configuration des logs
const LOG_FILE = `${FileSystem.documentDirectory}app.log`;
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

/**
 * Écrit un message dans le fichier de log
 * @param {string} level - Niveau de log
 * @param {string} message - Message à logger
 * @param {Object} [extra] - Données supplémentaires
 */
const writeToLog = async (level, message, extra = {}) => {
  try {
    if (Platform.OS === 'web') return;

    const timestamp = new Date().toISOString();
    const logEntry = JSON.stringify({
      timestamp,
      level,
      message,
      ...extra,
    }) + '\n';

    // Vérifier si le fichier existe
    const fileInfo = await FileSystem.getInfoAsync(LOG_FILE);
    
    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(LOG_FILE, logEntry);
      return;
    }

    // Vérifier la taille du fichier
    if (fileInfo.size > MAX_LOG_SIZE) {
      // Archiver et créer un nouveau fichier
      const archiveFile = `${LOG_FILE}.${timestamp}.archive`;
      await FileSystem.moveAsync({
        from: LOG_FILE,
        to: archiveFile,
      });
    }

    // Ajouter le nouveau log
    await FileSystem.writeAsStringAsync(LOG_FILE, logEntry, {
      encoding: FileSystem.EncodingType.UTF8,
      append: true,
    });
  } catch (error) {
    console.error('Erreur écriture log:', error);
  }
};

/**
 * Classe personnalisée pour les erreurs de l'application
 */
export class AppError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Gestionnaire global des erreurs non capturées
 * @param {Error} error - L'erreur à gérer
 */
export const handleUncaughtError = async (error) => {
  try {
    const errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    // Logger l'erreur
    await writeToLog(LOG_LEVELS.ERROR, 'Erreur non capturée', errorDetails);

    // En développement, afficher l'erreur dans la console
    if (__DEV__) {
      console.error('Erreur non capturée:', error);
    }

    // Ici, vous pourriez envoyer l'erreur à un service de suivi des erreurs
    // comme Sentry, Crashlytics, etc.
  } catch (e) {
    console.error('Erreur dans le gestionnaire d\'erreurs:', e);
  }
};

/**
 * Logger un message de debug
 * @param {string} message - Message à logger
 * @param {Object} [extra] - Données supplémentaires
 */
export const logDebug = (message, extra = {}) => {
  if (__DEV__) {
    console.debug(message, extra);
  }
  writeToLog(LOG_LEVELS.DEBUG, message, extra);
};

/**
 * Logger un message d'information
 * @param {string} message - Message à logger
 * @param {Object} [extra] - Données supplémentaires
 */
export const logInfo = (message, extra = {}) => {
  if (__DEV__) {
    console.info(message, extra);
  }
  writeToLog(LOG_LEVELS.INFO, message, extra);
};

/**
 * Logger un avertissement
 * @param {string} message - Message à logger
 * @param {Object} [extra] - Données supplémentaires
 */
export const logWarning = (message, extra = {}) => {
  if (__DEV__) {
    console.warn(message, extra);
  }
  writeToLog(LOG_LEVELS.WARN, message, extra);
};

/**
 * Logger une erreur
 * @param {string} message - Message à logger
 * @param {Error|Object} error - L'erreur ou des données supplémentaires
 */
export const logError = (message, error = {}) => {
  const errorDetails = error instanceof Error ? {
    name: error.name,
    message: error.message,
    stack: error.stack,
  } : error;

  if (__DEV__) {
    console.error(message, errorDetails);
  }
  writeToLog(LOG_LEVELS.ERROR, message, errorDetails);
};

/**
 * Récupère les logs
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Array>} Liste des logs
 */
export const getLogs = async (options = {}) => {
  try {
    const {
      level,
      startDate,
      endDate,
      limit = 100,
    } = options;

    const fileInfo = await FileSystem.getInfoAsync(LOG_FILE);
    if (!fileInfo.exists) return [];

    const content = await FileSystem.readAsStringAsync(LOG_FILE);
    const logs = content
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line))
      .filter(log => {
        if (level && log.level !== level) return false;
        if (startDate && new Date(log.timestamp) < new Date(startDate)) return false;
        if (endDate && new Date(log.timestamp) > new Date(endDate)) return false;
        return true;
      })
      .slice(-limit);

    return logs;
  } catch (error) {
    console.error('Erreur lecture logs:', error);
    return [];
  }
};

/**
 * Nettoie les vieux logs
 * @param {number} [maxAge=7] - Âge maximum des logs en jours
 */
export const cleanOldLogs = async (maxAge = 7) => {
  try {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
    const logFiles = files.filter(file => file.startsWith('app.log'));

    for (const file of logFiles) {
      if (!file.includes('.archive')) continue;

      const filePath = `${FileSystem.documentDirectory}${file}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      const fileDate = new Date(file.split('.')[1]);
      const ageInDays = (Date.now() - fileDate.getTime()) / (1000 * 60 * 60 * 24);

      if (ageInDays > maxAge) {
        await FileSystem.deleteAsync(filePath);
      }
    }
  } catch (error) {
    console.error('Erreur nettoyage logs:', error);
  }
};

export default {
  AppError,
  handleUncaughtError,
  logDebug,
  logInfo,
  logWarning,
  logError,
  getLogs,
  cleanOldLogs,
};
