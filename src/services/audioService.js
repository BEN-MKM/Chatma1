import * as FileSystem from 'expo-file-system';
import supabase from '../config/supabase';
import { decode } from 'base64-arraybuffer';

const BUCKET_NAME = 'audio-messages';

export const uploadAudio = async (uri) => {
  try {
    // Lire le fichier en base64
    const base64File = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Générer un nom de fichier unique
    const fileName = `${Date.now()}.m4a`;
    const filePath = `public/${fileName}`;

    // Convertir base64 en ArrayBuffer pour Supabase
    const arrayBuffer = decode(base64File);

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, arrayBuffer, {
        contentType: 'audio/m4a',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Obtenir l'URL publique
    const { data: publicUrl } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;

  } catch (error) {
    console.error('Erreur lors de l\'upload audio:', error);
    throw error;
  }
};

export const deleteAudio = async (url) => {
  try {
    const path = url.split('/').pop();
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([`public/${path}`]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la suppression audio:', error);
    throw error;
  }
};
