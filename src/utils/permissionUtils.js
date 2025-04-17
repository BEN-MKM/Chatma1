import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Camera from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError, logWarning } from './errorUtils';

const PERMISSION_KEYS = {
  CAMERA: '@permissions_camera',
  PHOTOS: '@permissions_photos',
  LOCATION: '@permissions_location',
  CONTACTS: '@permissions_contacts',
  NOTIFICATIONS: '@permissions_notifications',
  MICROPHONE: '@permissions_microphone',
};

/**
 * Vérifie si l'utilisateur a déjà refusé une permission
 * @param {string} permissionKey - Clé de la permission
 * @returns {Promise<boolean>}
 */
const hasUserDeniedPermission = async (permissionKey) => {
  try {
    const status = await AsyncStorage.getItem(permissionKey);
    return status === 'denied';
  } catch (error) {
    logError('Erreur vérification permission refusée:', error);
    return false;
  }
};

/**
 * Marque une permission comme refusée
 * @param {string} permissionKey - Clé de la permission
 */
const markPermissionAsDenied = async (permissionKey) => {
  try {
    await AsyncStorage.setItem(permissionKey, 'denied');
  } catch (error) {
    logError('Erreur marquage permission refusée:', error);
  }
};

/**
 * Affiche une alerte pour expliquer pourquoi une permission est nécessaire
 * @param {string} permission - Nom de la permission
 * @param {string} usage - Utilisation prévue
 * @returns {Promise<boolean>} - True si l'utilisateur accepte d'ouvrir les paramètres
 */
const showPermissionExplanation = async (permission, usage) => {
  return new Promise((resolve) => {
    Alert.alert(
      'Permission nécessaire',
      `Nous avons besoin de votre permission pour accéder à ${permission} afin de ${usage}. Voulez-vous modifier ce paramètre ?`,
      [
        {
          text: 'Non merci',
          onPress: () => resolve(false),
          style: 'cancel',
        },
        {
          text: 'Ouvrir les paramètres',
          onPress: () => {
            Linking.openSettings();
            resolve(true);
          },
        },
      ],
      { cancelable: false }
    );
  });
};

/**
 * Demande la permission d'utiliser la caméra
 * @param {string} [usage='prendre des photos'] - Utilisation prévue
 * @returns {Promise<boolean>}
 */
export const requestCameraPermission = async (usage = 'prendre des photos') => {
  try {
    if (await hasUserDeniedPermission(PERMISSION_KEYS.CAMERA)) {
      const shouldOpen = await showPermissionExplanation('la caméra', usage);
      return shouldOpen;
    }

    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      markPermissionAsDenied(PERMISSION_KEYS.CAMERA);
      logWarning('Permission caméra refusée');
      return false;
    }

    return true;
  } catch (error) {
    logError('Erreur permission caméra:', error);
    return false;
  }
};

/**
 * Demande la permission d'accéder aux photos
 * @param {string} [usage='sélectionner des photos'] - Utilisation prévue
 * @returns {Promise<boolean>}
 */
export const requestPhotosPermission = async (usage = 'sélectionner des photos') => {
  try {
    if (await hasUserDeniedPermission(PERMISSION_KEYS.PHOTOS)) {
      const shouldOpen = await showPermissionExplanation('vos photos', usage);
      return shouldOpen;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      markPermissionAsDenied(PERMISSION_KEYS.PHOTOS);
      logWarning('Permission photos refusée');
      return false;
    }

    return true;
  } catch (error) {
    logError('Erreur permission photos:', error);
    return false;
  }
};

/**
 * Demande la permission d'accéder à la localisation
 * @param {string} [usage='partager votre position'] - Utilisation prévue
 * @returns {Promise<boolean>}
 */
export const requestLocationPermission = async (usage = 'partager votre position') => {
  try {
    if (await hasUserDeniedPermission(PERMISSION_KEYS.LOCATION)) {
      const shouldOpen = await showPermissionExplanation('votre position', usage);
      return shouldOpen;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      markPermissionAsDenied(PERMISSION_KEYS.LOCATION);
      logWarning('Permission localisation refusée');
      return false;
    }

    return true;
  } catch (error) {
    logError('Erreur permission localisation:', error);
    return false;
  }
};

/**
 * Demande la permission d'accéder aux contacts
 * @param {string} [usage='partager des contacts'] - Utilisation prévue
 * @returns {Promise<boolean>}
 */
export const requestContactsPermission = async (usage = 'partager des contacts') => {
  try {
    if (await hasUserDeniedPermission(PERMISSION_KEYS.CONTACTS)) {
      const shouldOpen = await showPermissionExplanation('vos contacts', usage);
      return shouldOpen;
    }

    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      markPermissionAsDenied(PERMISSION_KEYS.CONTACTS);
      logWarning('Permission contacts refusée');
      return false;
    }

    return true;
  } catch (error) {
    logError('Erreur permission contacts:', error);
    return false;
  }
};

/**
 * Demande la permission d'envoyer des notifications
 * @param {string} [usage='vous tenir informé'] - Utilisation prévue
 * @returns {Promise<boolean>}
 */
export const requestNotificationsPermission = async (usage = 'vous tenir informé') => {
  try {
    if (Platform.OS === 'web') return false;
    
    if (await hasUserDeniedPermission(PERMISSION_KEYS.NOTIFICATIONS)) {
      const shouldOpen = await showPermissionExplanation('les notifications', usage);
      return shouldOpen;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      markPermissionAsDenied(PERMISSION_KEYS.NOTIFICATIONS);
      logWarning('Permission notifications refusée');
      return false;
    }

    return true;
  } catch (error) {
    logError('Erreur permission notifications:', error);
    return false;
  }
};

/**
 * Demande la permission d'utiliser le microphone
 * @param {string} [usage='enregistrer des messages vocaux'] - Utilisation prévue
 * @returns {Promise<boolean>}
 */
export const requestMicrophonePermission = async (usage = 'enregistrer des messages vocaux') => {
  try {
    if (await hasUserDeniedPermission(PERMISSION_KEYS.MICROPHONE)) {
      const shouldOpen = await showPermissionExplanation('votre microphone', usage);
      return shouldOpen;
    }

    const { status } = await Camera.requestMicrophonePermissionsAsync();
    if (status !== 'granted') {
      markPermissionAsDenied(PERMISSION_KEYS.MICROPHONE);
      logWarning('Permission microphone refusée');
      return false;
    }

    return true;
  } catch (error) {
    logError('Erreur permission microphone:', error);
    return false;
  }
};

/**
 * Réinitialise toutes les permissions refusées
 */
export const resetDeniedPermissions = async () => {
  try {
    const keys = Object.values(PERMISSION_KEYS);
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    logError('Erreur réinitialisation permissions:', error);
  }
};

export default {
  requestCameraPermission,
  requestPhotosPermission,
  requestLocationPermission,
  requestContactsPermission,
  requestNotificationsPermission,
  requestMicrophonePermission,
  resetDeniedPermissions,
};
