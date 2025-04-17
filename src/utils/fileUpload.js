import supabase from '../config/supabase';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { decode } from 'base64-arraybuffer';

/**
 * Génère un nom de fichier unique basé sur le timestamp et un identifiant aléatoire
 * @param {string} originalName - Nom original du fichier ou extension
 * @returns {string} Nom de fichier unique
 */
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const extension = originalName.includes('.') 
    ? originalName.split('.').pop() 
    : originalName.replace('/', '');
  return `${timestamp}_${random}.${extension}`;
};

/**
 * Télécharge un fichier vers Supabase Storage
 * @param {string} uri - URI du fichier local
 * @param {string} mimeType - Type MIME du fichier
 * @param {string} [bucket='attachments'] - Nom du bucket Supabase Storage
 * @returns {Promise<string>} URL publique du fichier téléchargé
 */
export const uploadFile = async (uri, mimeType, bucket = 'attachments') => {
  try {
    // Vérifier que le bucket existe, le créer si nécessaire
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets.find(b => b.name === bucket)) {
      await supabase.storage.createBucket(bucket, {
        public: true,
        allowedMimeTypes: ['image/*', 'audio/*', 'video/*', 'application/*'],
        fileSizeLimit: 50000000 // 50MB
      });
    }

    let base64;
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
      });
    } else {
      base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    const fileName = generateUniqueFileName(mimeType);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, decode(base64), {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Erreur upload fichier:', error);
    throw new Error('Impossible de télécharger le fichier');
  }
};

/**
 * Supprime un fichier de Supabase Storage
 * @param {string} url - URL publique du fichier
 * @param {string} [bucket='attachments'] - Nom du bucket Supabase Storage
 * @returns {Promise<void>}
 */
export const deleteFile = async (url, bucket = 'attachments') => {
  try {
    const path = url.split('/').pop();
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Erreur suppression fichier:', error);
    throw new Error('Impossible de supprimer le fichier');
  }
};

/**
 * Vérifie si un fichier existe dans Supabase Storage
 * @param {string} path - Chemin du fichier dans le bucket
 * @param {string} [bucket='attachments'] - Nom du bucket Supabase Storage
 * @returns {Promise<boolean>}
 */
export const fileExists = async (path, bucket = 'attachments') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list('', {
        search: path
      });

    if (error) throw error;
    return data.some(file => file.name === path);
  } catch (error) {
    console.error('Erreur vérification fichier:', error);
    return false;
  }
};
