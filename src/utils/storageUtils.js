import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import { decode } from 'base64-arraybuffer';
import supabase from '../config/supabase';

const STORAGE_URL = 'https://dqituzmkfamsbiuxdauv.supabase.co/storage/v1/object/public';

/**
 * Génère un nom de fichier unique
 * @param {string} originalName - Nom original du fichier
 * @returns {string} Nom de fichier unique
 */
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${random}.${extension}`;
};

/**
 * Compresse une image
 * @param {string} uri - URI de l'image
 * @param {Object} options - Options de compression
 * @returns {Promise<string>} URI de l'image compressée
 */
const compressImage = async (uri, options = {}) => {
  const {
    width = 1024,
    quality = 0.8,
    format = ImageManipulator.SaveFormat.JPEG
  } = options;

  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width } }],
      { compress: quality, format }
    );
    return result.uri;
  } catch (error) {
    console.error('Erreur compression image:', error);
    throw error;
  }
};

/**
 * Télécharge un fichier vers Supabase Storage
 * @param {string} uri - URI du fichier local
 * @param {string} bucket - Nom du bucket
 * @param {Object} options - Options supplémentaires
 * @returns {Promise<string>} URL publique du fichier
 */
export const uploadFile = async (uri, bucket = 'media', options = {}) => {
  try {
    const {
      compress = true,
      fileName = null,
      contentType = null,
      path = null
    } = options;

    // Vérifier que le bucket existe
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets.find(b => b.name === bucket)) {
      await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 50000000 // 50MB
      });
    }

    // Compresser l'image si nécessaire
    let fileUri = uri;
    if (compress && uri.match(/\.(jpg|jpeg|png)$/i)) {
      fileUri = await compressImage(uri);
    }

    // Lire le fichier en base64
    let base64;
    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
      });
    } else {
      base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    // Générer un nom de fichier unique
    const uniqueFileName = fileName || generateUniqueFileName(fileUri);
    const filePath = path ? `${path}/${uniqueFileName}` : uniqueFileName;

    // Télécharger le fichier
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, decode(base64), {
        contentType: contentType || 'application/octet-stream',
        upsert: false
      });

    if (error) throw error;

    // Construire l'URL publique
    return `${STORAGE_URL}/${bucket}/${filePath}`;
  } catch (error) {
    console.error('Erreur upload fichier:', error);
    throw error;
  }
};

/**
 * Supprime un fichier de Supabase Storage
 * @param {string} url - URL publique du fichier
 * @returns {Promise<void>}
 */
export const deleteFile = async (url) => {
  try {
    const path = url.split('/').slice(-2).join('/');
    const [bucket, ...filePath] = path.split('/');
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath.join('/')]);

    if (error) throw error;
  } catch (error) {
    console.error('Erreur suppression fichier:', error);
    throw error;
  }
};

/**
 * Télécharge un fichier depuis Supabase Storage
 * @param {string} url - URL publique du fichier
 * @param {string} localPath - Chemin local où sauvegarder le fichier
 * @returns {Promise<string>} Chemin local du fichier
 */
export const downloadFile = async (url, localPath) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, localPath);
    return uri;
  } catch (error) {
    console.error('Erreur téléchargement fichier:', error);
    throw error;
  }
};

/**
 * Vérifie si un fichier existe dans Supabase Storage
 * @param {string} url - URL publique du fichier
 * @returns {Promise<boolean>}
 */
export const fileExists = async (url) => {
  try {
    const path = url.split('/').slice(-2).join('/');
    const [bucket, ...filePath] = path.split('/');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(filePath.slice(0, -1).join('/'), {
        search: filePath.slice(-1)[0]
      });

    if (error) throw error;
    return data.length > 0;
  } catch (error) {
    console.error('Erreur vérification fichier:', error);
    return false;
  }
};

export default {
  uploadFile,
  deleteFile,
  downloadFile,
  fileExists,
  compressImage
};
