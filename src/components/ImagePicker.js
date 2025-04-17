import * as ExpoImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

const ImagePicker = {
  requestPermissions: async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access media library was denied');
        return false;
      }
      return true;
    }
    return true;
  },

  pickImage: async (options = {}) => {
    try {
      const hasPermission = await ImagePicker.requestPermissions();
      if (!hasPermission) return null;

      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        ...options,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  },

  takePhoto: async (options = {}) => {
    try {
      const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access camera was denied');
        return null;
      }

      const result = await ExpoImagePicker.launchCameraAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        ...options,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }
};

export default ImagePicker;
