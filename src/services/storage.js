import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

export const storage = {
  async uploadFile(path, fileUri) {
    try {
      // Convertir le fichier en base64
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Convertir base64 en Blob
      const blob = await (await fetch(fileUri)).blob();

      // Téléverser sur Supabase Storage
      const { data, error } = await supabase.storage
        .from('public')
        .upload(path, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) throw error;

      // Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('public')
        .getPublicUrl(path);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Erreur de téléversement:', error);
      throw error;
    }
  }
};